import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>Products</h2>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>Products</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>Products</h2>
        <p>No products found. Login as admin and add some.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Products</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {products.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "0.75rem",
              background: "#fff",
            }}
          >
            {p.imageUrl && (
              <img
                src={p.imageUrl}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "0.5rem",
                }}
              />
            )}
            <h3 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>{p.productName}</h3>
            <p style={{ margin: 0, fontWeight: "bold" }}>₹{p.price}</p>
            {p.carModel && (
              <p style={{ margin: "0.25rem 0", fontSize: "0.85rem", color: "#555" }}>
                For: {p.carModel}
              </p>
            )}
            <p
              style={{
                margin: "0.25rem 0",
                fontSize: "0.8rem",
                color: p.inStock ? "green" : "red",
              }}
            >
              {p.inStock ? "In Stock" : "Out of Stock"}
            </p>
            <Link
              to={`/products/${p._id}`}
              style={{
                display: "inline-block",
                marginTop: "0.5rem",
                fontSize: "0.9rem",
                textDecoration: "none",
                color: "#fff",
                background: "#2563eb",
                padding: "0.35rem 0.75rem",
                borderRadius: "4px",
              }}
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
