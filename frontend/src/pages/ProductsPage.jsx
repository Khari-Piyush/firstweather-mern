import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";

const CATEGORY_MAP = {
  "wiper-arm": "F.W Wiper Arm",
  "wiper-blade": "F.W Wiper Blade",
  "wiper-linkage": "F.W Wiper Linkage",
  "wiper-motor-gear": "F.W Wiper Motor Gear",
  "wiper-wheel-box" : "F.W Wiper Wheel Box",
  "wiper-rod": "F.W Wiper Rod",
  "wiper-power-window" : "F.W Power Window Accessories",
  "wiper-acc": "F.W Wiper Accessories",
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products");
        setProducts(res.data);

        if (urlCategory && CATEGORY_MAP[urlCategory]) {
          setSelectedCategory(CATEGORY_MAP[urlCategory]);
        } else {
          setSelectedCategory("All");
        }
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [urlCategory]);

  /* ================= FILTER ================= */
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
          onClick={() => setSelectedCategory("All")}
        />
        <CategoryBtn
          label="F.W Wiper Arm"
          active={selectedCategory === CATEGORY_MAP["wiper-arm"]}
          onClick={() => setSelectedCategory(CATEGORY_MAP["wiper-arm"])}
        />
        <CategoryBtn
          label="F.W Wiper Blade"
          active={selectedCategory === CATEGORY_MAP["wiper-blade"]}
          onClick={() => setSelectedCategory(CATEGORY_MAP["wiper-blade"])}
        />
        <CategoryBtn
          label="F.W Wiper Linkage"
          active={selectedCategory === CATEGORY_MAP["wiper-linkage"]}
          onClick={() => setSelectedCategory(CATEGORY_MAP["wiper-linkage"])}
        />
        <CategoryBtn
          label="F.W Wiper Wheel Box"
          active={selectedCategory === CATEGORY_MAP["wiper-wheel-box"]}
          onClick={() => setSelectedCategory(CATEGORY_MAP["wiper-wheel-box"])}
        />
        <CategoryBtn
          label="F.W Wiper Motor Gear"
          active={selectedCategory === CATEGORY_MAP["wiper-motor-gear"]}
          onClick={() => setSelectedCategory(CATEGORY_MAP["wiper-motor-gear"])}
        />
        <CategoryBtn
          label="F.W Wiper Rod"
          active={selectedCategory === CATEGORY_MAP["wiper-rod"]}
          onClick={() => setSelectedCategory(CATEGORY_MAP["wiper-rod"])}
        />
        <CategoryBtn
          label="F.W Power Window Accessories"
          active={selectedCategory === CATEGORY_MAP["wiper-power-window"]}
          onClick={() => setSelectedCategory(CATEGORY_MAP["wiper-power-window"])}
        />
        <CategoryBtn
          label="F.W Wiper Accessories"
          active={selectedCategory === CATEGORY_MAP["wiper-acc"]}
          onClick={() => setSelectedCategory(CATEGORY_MAP["wiper-acc"])}
        />
      </div>

      {/* ================= PRODUCT GRID ================= */}
      <div style={grid}>
        {filteredProducts.map((p) => (
          <div key={p._id} style={card}>
            <img src={p.imageUrl} alt={p.productName} style={img} />
            <h4>{p.productName}</h4>
            <p>₹{p.price}</p>

            <Link to={`/products/${p._id}`} style={viewBtn}>
              View Details
            </Link>
          </div>
        ))}
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
