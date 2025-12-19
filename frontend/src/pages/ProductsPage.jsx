import { useEffect, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // 👇 animation state
  const [mounted, setMounted] = useState(false);

  // 🔥 THIS IS THE KEY FIX
  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch {
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  if (loading) return <p style={{ padding: "1rem" }}>Loading products...</p>;
  if (error) return <p style={{ padding: "1rem", color: "red" }}>{error}</p>;

  return (
    <div
      style={{
        padding: "1.5rem",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0f7ff 0%, #ffffff 60%)",

        /* 🔥 REAL SMOOTH ANIMATION */
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        willChange: "opacity, transform",
      }}
    >
      <h2 style={{ marginBottom: "0.4rem" }}>Products</h2>
      <p style={{ color: "#555", marginBottom: "1rem" }}>
        Premium windshield wiper parts by <b>First Weather</b>
      </p>

      {/* CATEGORY FILTER */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: "0.45rem 0.9rem",
              borderRadius: "999px",
              border: "1px solid #2563eb",
              background:
                selectedCategory === cat
                  ? "linear-gradient(135deg, #2563eb, #1e40af)"
                  : "#fff",
              color: selectedCategory === cat ? "#fff" : "#2563eb",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* PRODUCTS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {filteredProducts.map((p) => (
          <div
            key={p._id}
            style={{
              borderRadius: "14px",
              background: "#fff",
              border: "1px solid #e0ecff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
              transition: "transform 0.25s ease, box-shadow 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0 18px 40px rgba(37,99,235,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(0,0,0,0.06)";
            }}
          >
            {p.imageUrl && (
              <div
                style={{
                  background: "linear-gradient(180deg, #e0f2fe, #ffffff)",
                  borderRadius: "14px 14px 0 0",
                  padding: "0.75rem",
                }}
              >
                <img
                  src={p.imageUrl}
                  alt={p.productName}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "contain",
                  }}
                />
              </div>
            )}

            <div style={{ padding: "0.9rem" }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>
                {p.productName}
              </h3>

              <p style={{ fontWeight: "bold", fontSize: "1.05rem" }}>
                ₹{p.price}
              </p>

              <Link
                to={`/products/${p._id}`}
                style={{
                  display: "inline-block",
                  marginTop: "0.4rem",
                  textDecoration: "none",
                  color: "#fff",
                  background: "linear-gradient(135deg, #2563eb, #1e40af)",
                  padding: "0.4rem 0.9rem",
                  borderRadius: "6px",
                  fontSize: "0.85rem",
                }}
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
