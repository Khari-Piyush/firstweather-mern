from flask import Flask, jsonify
import pymongo
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

app = Flask(__name__)

# 🔥 PORT FIX (Render)
port = int(os.environ.get("PORT", 10000))

# 🔥 CACHE (speed boost)
cache = {}

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
client = pymongo.MongoClient("mongodb+srv://firstweather_ADMIN:RdDg4t4YbgEQrMoc@firstweather.yvrbdz0.mongodb.net/firstweather")
db = client["firstweather"]
collection = db["products"]

# Load data
data = list(collection.find())
products = pd.DataFrame(data)

# 🔥 PREPROCESSING
products['productName'] = products['productName'].apply(clean_text)
products['carModel'] = products['carModel'].apply(clean_text)
products['category'] = products['category'].apply(clean_text)

products['tags'] = (
    products['carModel'] + " " + products['carModel'] + " " +  # weight
    products['category'] + " " +
    products['productName']
)

# 🔥 VECTORIZATION (optimized)
cv = CountVectorizer(max_features=5000, stop_words='english')
vectors = cv.fit_transform(products['tags'])  # ❌ no .toarray()

similarity = cosine_similarity(vectors)

# 🔥 TEST ROUTE
@app.route("/")
def home():
    return "ML Running 🔥"

# 🔥 RECOMMEND API
@app.route("/recommend/<product_id>")
def recommend_api(product_id):
    try:
        # 🔥 CACHE CHECK
        if product_id in cache:
            return jsonify(cache[product_id])

        index = products[products['_id'].astype(str) == product_id].index[0]

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

        # 🔥 SAVE CACHE
        cache[product_id] = result

        return jsonify(result)

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": "Product not found"})

# Run server
if __name__ == "__main__":
    print("Total products:", collection.count_documents({}))
    app.run(host="0.0.0.0", port=port)