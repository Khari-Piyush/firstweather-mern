import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../api";
import { CartContext } from "../contexts/CartContext.jsx";

const ProductDetailPage = () => {
  const { id } = useParams(); // /products/:id
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addItem } = useContext(CartContext);
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!product) return;

    // frontend/src/pages/ProductDetailPage.jsx (inside handleAddToCart)
    addItem({
      product: product._id,
      productId: product.productId || product.slug || product._id,
      name: product.productName || product.slug || product.productId || product._id,
      price: product.price,
      qty: 1,
      imageUrl: product.imageUrl || "",
    });


    navigate("/cart");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. It may not exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>Product Detail</h2>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ padding: "1rem" }}>
        <h2>Product Detail</h2>
        <p style={{ color: "red" }}>{error || "Product not found."}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>{product.name}</h2>
      <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: "320px",
              height: "220px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
        )}
        <div>
          <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>₹{product.price}</p>
          {product.productId && <p>Product Code: {product.productId}</p>}
          {product.carModel && <p>Car Model: {product.carModel}</p>}
          {product.category && <p>Category: {product.category}</p>}
          {product.compatibleYears && product.compatibleYears.length > 0 && (
            <p>Compatible Years: {product.compatibleYears.join(", ")}</p>
          )}
          <p
            style={{
              marginTop: "0.5rem",
              color: product.inStock ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </p>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      {product.description && (
        <div style={{ marginTop: "1.5rem" }}>
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
