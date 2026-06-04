from flask import Flask, jsonify, request
import pymongo
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os
import threading
import time
from collections import OrderedDict
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# 🔥 PORT FIX (Render)
port = int(os.environ.get("PORT", 10000))

# 🔥 BOUNDED LRU CACHE WITH TTL
CACHE_MAX = 200
CACHE_TTL = 300  # 5 minutes

class _BoundedTTLCache:
    def __init__(self, max_size, ttl):
        self._store = OrderedDict()
        self._max = max_size
        self._ttl = ttl
        self._lock = threading.Lock()

    def get(self, key):
        with self._lock:
            if key not in self._store:
                return None
            value, ts = self._store[key]
            if time.monotonic() - ts > self._ttl:
                del self._store[key]
                return None
            self._store.move_to_end(key)
            return value

    def set(self, key, value):
        with self._lock:
            if key in self._store:
                self._store.move_to_end(key)
            self._store[key] = (value, time.monotonic())
            if len(self._store) > self._max:
                self._store.popitem(last=False)

    def clear(self):
        with self._lock:
            self._store.clear()

cache = _BoundedTTLCache(CACHE_MAX, CACHE_TTL)

# 🔥 TEXT CLEANING FUNCTION
def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = text.replace("/", " ")
    text = text.replace("|", " ")
    text = text.replace("-", " ")
    return text

# MongoDB connect
mongo_uri = os.environ.get("MONGO_URI")
if not mongo_uri:
    raise RuntimeError("MONGO_URI environment variable is not set")
client = pymongo.MongoClient(mongo_uri)
db = client["firstweather"]
collection = db["products"]

# 🔥 MODEL STATE — protected by lock for thread-safe reload
_model_lock = threading.RLock()
_model = {"products": None, "similarity": None}

def _build_model():
    data = list(collection.find())
    if not data:
        return pd.DataFrame(), None
    df = pd.DataFrame(data)
    df['productName'] = df['productName'].apply(clean_text)
    df['carModel'] = df['carModel'].apply(clean_text)
    df['category'] = df['category'].apply(clean_text)
    df['tags'] = (
        df['carModel'] + " " + df['carModel'] + " " +  # weight
        df['category'] + " " +
        df['productName']
    )
    cv = CountVectorizer(max_features=5000, stop_words='english')
    vectors = cv.fit_transform(df['tags'])
    sim = cosine_similarity(vectors)
    return df, sim

# Build model at startup
_df, _sim = _build_model()
with _model_lock:
    _model["products"] = _df
    _model["similarity"] = _sim
print("Model built at startup. Products loaded:", len(_df))

# 🔥 HEALTH ROUTES
@app.route("/")
def home():
    with _model_lock:
        count = len(_model["products"]) if _model["products"] is not None and not _model["products"].empty else 0
    return jsonify({"status": "ok", "products_loaded": count})

@app.route("/health")
def health():
    with _model_lock:
        count = len(_model["products"]) if _model["products"] is not None and not _model["products"].empty else 0
    return jsonify({"status": "ok", "products_loaded": count})

# 🔥 RELOAD ROUTE — call after product create/update/delete
ML_RELOAD_SECRET = os.environ.get("ML_RELOAD_SECRET", "")

@app.route("/reload", methods=["POST"])
def reload_model():
    if not ML_RELOAD_SECRET:
        return jsonify({"error": "Reload endpoint not configured"}), 503
    if request.headers.get("X-Reload-Secret", "") != ML_RELOAD_SECRET:
        return jsonify({"error": "Unauthorized"}), 401
    try:
        new_df, new_sim = _build_model()
        with _model_lock:
            _model["products"] = new_df
            _model["similarity"] = new_sim
            cache.clear()
        print("Model reloaded. Products loaded:", len(new_df))
        return jsonify({"message": "Model reloaded", "count": len(new_df)})
    except Exception as e:
        print("Reload error:", e)
        return jsonify({"error": "Reload failed"}), 500

# 🔥 RECOMMEND API
@app.route("/recommend/<product_id>")
def recommend_api(product_id):
    cached = cache.get(product_id)
    if cached is not None:
        return jsonify(cached)

    with _model_lock:
        products = _model["products"]
        similarity = _model["similarity"]

    if products is None or products.empty:
        return jsonify({"error": "Model not ready"}), 503

    matches = products[products['_id'].astype(str) == product_id]
    if matches.empty:
        return jsonify({"error": "Product not found"}), 404

    try:
        index = matches.index[0]
        distances = similarity[index]

        products_list = sorted(
            list(enumerate(distances)),
            reverse=True,
            key=lambda x: x[1]
        )

        selected_car = str(products.iloc[index]['carModel']).lower()
        result = []

        # 🔥 SAME CAR MODEL
        for i in products_list:
            product = products.iloc[i[0]]
            car = str(product['carModel']).lower()
            if selected_car == car and i[0] != index:
                result.append(str(product['_id']))
            if len(result) == 5:
                break

        # 🔥 PARTIAL MATCH
        if len(result) < 5:
            for i in products_list:
                product = products.iloc[i[0]]
                car = str(product['carModel']).lower()
                if (selected_car in car or car in selected_car) and i[0] != index:
                    pid = str(product['_id'])
                    if pid not in result:
                        result.append(pid)
                if len(result) == 5:
                    break

        # 🔥 FALLBACK
        if len(result) < 5:
            for i in products_list:
                pid = str(products.iloc[i[0]]['_id'])
                if pid not in result and i[0] != index:
                    result.append(pid)
                if len(result) == 5:
                    break

        cache.set(product_id, result)
        return jsonify(result)

    except Exception as e:
        print("Recommend error:", e)
        return jsonify({"error": "Recommendation failed"}), 500

# Run server
if __name__ == "__main__":
    print("Total products:", collection.count_documents({}))
    app.run(host="0.0.0.0", port=port)
