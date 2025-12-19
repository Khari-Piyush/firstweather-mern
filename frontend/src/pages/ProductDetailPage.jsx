import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p style={{ padding: "1rem" }}>Loading...</p>;
  if (error || !product)
    return <p style={{ padding: "1rem", color: "red" }}>{error}</p>;

  return (
    <div
      style={{
        padding: "1.5rem",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0f7ff 0%, #ffffff 65%)",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "#fff",
          borderRadius: "18px",
          padding: "1.5rem",
          boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
        }}
      >
        {/* TOP SECTION */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* IMAGE */}
          <div
            style={{
              background: "linear-gradient(180deg, #e0f2fe, #ffffff)",
              borderRadius: "16px",
              padding: "1rem",
              textAlign: "center",
            }}
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.productName}
                style={{
                  width: "100%",
                  maxHeight: "320px",
                  objectFit: "contain",
                }}
              />
            )}
          </div>

          {/* INFO */}
          <div>
            <h2 style={{ marginBottom: "0.4rem" }}>
              {product.productName}
            </h2>

            <p
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "#1e40af",
                marginBottom: "0.5rem",
              }}
            >
              ₹{product.price}
            </p>

            <p style={meta}><b>Product Code:</b> {product.productId}</p>
            <p style={meta}><b>Car Model:</b> {product.carModel}</p>
            <p style={meta}><b>Category:</b> {product.category}</p>

            <p
              style={{
                marginTop: "0.5rem",
                fontWeight: "bold",
                color: product.inStock ? "#16a34a" : "#dc2626",
              }}
            >
              {product.inStock ? "✔ In Stock" : "✖ Out of Stock"}
            </p>

            <button
              style={enquireBtn}
              onClick={() => navigate(`/enquire/${product._id}`)}
            >
              Enquire Now
            </button>
          </div>
        </div>

        {/* DESCRIPTION */}
        {product.description && (
          <div style={{ marginTop: "2rem" }}>
            {/* HIGHLIGHTS */}
            <div
              style={{
                background: "#eff6ff",
                padding: "1rem",
                borderRadius: "14px",
                marginBottom: "1.2rem",
              }}
            >
              <h3 style={{ marginBottom: "0.6rem" }}>🔧 Product Highlights</h3>
              <ul style={{ paddingLeft: "1.2rem", lineHeight: "1.7", color: "#1e3a8a" }}>
                <li>OEM-quality wiper rod for Ashok Leyland Captain</li>
                <li>Smooth & synchronized windshield wiping</li>
                <li>Heavy-duty build for commercial vehicles</li>
                <li>Corrosion-resistant & weatherproof finish</li>
                <li>Accurate fit – easy installation</li>
              </ul>
            </div>

            {/* FEATURES GRID */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {[
                "Heavy Duty Construction",
                "Noise-Free Operation",
                "OEM Grade Fitment",
                "Long Service Life",
                "Designed for Indian Roads",
                "Trusted First Weather Quality",
              ].map((f, i) => (
                <div
                  key={i}
                  style={{
                    background: "#ffffff",
                    borderRadius: "12px",
                    padding: "0.9rem",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    color: "#1f2937",
                  }}
                >
                  ✔ {f}
                </div>
              ))}
            </div>

            {/* APPLICATIONS */}
            <div
              style={{
                background: "#f8fafc",
                padding: "1rem",
                borderRadius: "14px",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ marginBottom: "0.5rem" }}>🚛 Applications</h3>
              <p style={{ color: "#374151", fontSize: "0.95rem" }}>
                Suitable for Ashok Leyland Captain trucks and commercial vehicles
                requiring reliable windshield wiper linkage systems.
              </p>
            </div>

            {/* SEO DESCRIPTION (READ MORE STYLE) */}
            <details
              style={{
                background: "#ffffff",
                padding: "1rem",
                borderRadius: "14px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              }}
            >
              <summary
                style={{
                  cursor: "pointer",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                📄 Detailed Product Description
              </summary>

              <p
                style={{
                  lineHeight: "1.7",
                  color: "#374151",
                  fontSize: "0.9rem",
                  marginTop: "0.5rem",
                }}
              >
                {product.description}
              </p>
            </details>
          </div>
        )}

      </div>
    </div>
  );
};

const meta = {
  margin: "0.2rem 0",
  fontSize: "0.95rem",
};

const enquireBtn = {
  marginTop: "1rem",
  width: "100%",
  background: "linear-gradient(135deg, #2563eb, #1e40af)",
  color: "#fff",
  border: "none",
  padding: "0.7rem",
  borderRadius: "10px",
  fontSize: "1rem",
  cursor: "pointer",
};

export default ProductDetailPage;
