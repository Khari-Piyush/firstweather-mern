import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import "./ProductsPage.css";


const CATEGORY_MAP = {
  "wiper-arm": "F.W Wiper Arm",
  "wiper-blade": "F.W Wiper Blade",
  "wiper-linkage": "F.W Wiper Linkage",
  "wiper-motor-gear": "F.W Wiper Motor Gear",
  "wiper-wheel-box": "F.W Wiper Wheel Box",
  "wiper-rod": "F.W Wiper Rod",
  "wiper-power-window": "F.W Power Window Accessories",
  "wiper-acc": "F.W Wiper Accessories",
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");

  /* ================= URL CATEGORY (ONLY ONCE) ================= */
  useEffect(() => {
    if (urlCategory && CATEGORY_MAP[urlCategory]) {
      setSelectedCategory(CATEGORY_MAP[urlCategory]);
    }
  }, [urlCategory]);

  /* ================= FETCH PRODUCTS (REAL PAGINATION) ================= */
  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const params = {
          page,
          limit: 25,
        };

        if (selectedCategory !== "All") {
          params.category = selectedCategory;
        }

        const res = await api.get("/products", { params });

        if (!cancelled) {
          setProducts(res.data);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load products");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    // optional idle delay (ok to keep)
    if ("requestIdleCallback" in window) {
      requestIdleCallback(fetchProducts);
    } else {
      fetchProducts();
    }

    return () => {
      cancelled = true;
    };
  }, [page, selectedCategory]);



  /* ================= FILTER (SAME AS YOUR ORIGINAL) ================= */
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (loading) return <p style={{ padding: "1rem" }}>Loading products...</p>;
  if (error) return <p style={{ color: "red", padding: "1rem" }}>{error}</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>
        {selectedCategory === "All" ? "All Products" : selectedCategory}
      </h2>

      {/* ================= CATEGORY FILTER ================= */}
      <div style={filterWrap}>
        <CategoryBtn
          label="All"
          active={selectedCategory === "All"}
          onClick={() => {
            setSelectedCategory("All");
            setPage(1); // 🔥 reset page on category change
          }}
        />

        {Object.values(CATEGORY_MAP).map((cat) => (
          <CategoryBtn
            key={cat}
            label={cat}
            active={selectedCategory === cat}
            onClick={() => {
              setSelectedCategory(cat);
              setPage(1); // 🔥 reset page
            }}
          />
        ))}
      </div>

      {/* ================= PRODUCT GRID ================= */}
      <div style={grid}>
        {filteredProducts.map((p) => (
          <div key={p._id} style={card}>
            <img
              src={p.imageUrl}
              alt={p.productName}
              style={img}
              loading="lazy"
            />
            <h4>{p.productName}</h4>
            <p>
              ₹{p.price} <span> / {p.unit}</span>
            </p>

            <Link to={`/products/${p._id}`} style={viewBtn}>
              View Details
            </Link>
          </div>
        ))}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="pagination-wrapper">
        <div className="rain-pagination">
          <button
            className="rain-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            ◀ Prev
          </button>

          <div className="rain-page">
            <span>Page</span>
            <strong>{page}</strong>
          </div>

          <button
            className="rain-btn"
            disabled={products.length < 24}
            onClick={() => setPage(page + 1)}
          >
            Next ▶
          </button>

          {/* droplets */}
          <span className="drop d1"></span>
          <span className="drop d2"></span>
          <span className="drop d3"></span>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;

/* ================= COMPONENT ================= */

const CategoryBtn = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px 16px",
      borderRadius: "20px",
      border: "1px solid #1e3a8a",
      background: active ? "#1e3a8a" : "#fff",
      color: active ? "#fff" : "#1e3a8a",
      cursor: "pointer",
      fontWeight: "500",
    }}
  >
    {label}
  </button>
);

/* ================= STYLES ================= */

const filterWrap = {
  display: "flex",
  gap: "0.75rem",
  marginBottom: "1.5rem",
  flexWrap: "wrap",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "1.5rem",
};

const card = {
  background: "#fff",
  padding: "1rem",
  borderRadius: "10px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  textAlign: "center",
};

const img = {
  width: "100%",
  height: "180px",
  objectFit: "contain",
};

const viewBtn = {
  display: "inline-block",
  marginTop: "0.5rem",
  textDecoration: "none",
  background: "#0f172a",
  color: "#fff",
  padding: "6px 14px",
  borderRadius: "6px",
};


