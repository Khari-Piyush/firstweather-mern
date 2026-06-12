import { Link } from "react-router-dom";
import "./ProductCard.improved.css";

const optimizeImg = (url) =>
  url ? url.replace("/upload/", "/upload/w_400,f_auto,q_auto/") : null;

const ProductCard = ({ product }) => (
  <Link to={`/products/${product._id}`} className="fw-product-card" style={card}>
    <div style={imgWrap}>
      <img
        src={optimizeImg(product.imageUrl) || "/fw-logo-blue.webp"}
        alt={product.productName}
        style={imgStyle}
        loading="lazy"
        decoding="async"
      />
    </div>
    <div style={cardBody}>
      <p style={nameStyle}>{product.productName}</p>
      {product.productId && (
        <p style={codeStyle}>{product.productId}</p>
      )}
      {product.price != null && (
        <p style={priceStyle}>₹{product.price}</p>
      )}
    </div>
  </Link>
);

export default ProductCard;

/* ── Styles ──────────────────────────────────────────────────────── */

const card = {
  display: "flex",
  flexDirection: "column",
  textDecoration: "none",
  background: "var(--fw-white)",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-md)",
  overflow: "hidden",
  boxShadow: "var(--fw-shadow-sm)",
};

const imgWrap = {
  width: "100%",
  aspectRatio: "1 / 1",
  background: "var(--fw-gray-100)",
  overflow: "hidden",
};

const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
  padding: "var(--fw-space-6)",
};

const cardBody = {
  padding: "var(--fw-space-4) var(--fw-space-5)",
  borderTop: "1px solid var(--fw-gray-300)",
};

const nameStyle = {
  fontSize: "var(--fw-text-sm)",
  fontWeight: "var(--fw-weight-semibold)",
  color: "var(--fw-navy)",
  margin: "0 0 var(--fw-space-1)",
  lineHeight: "var(--fw-leading-snug)",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
};

const codeStyle = {
  fontSize: "var(--fw-text-xs)",
  color: "var(--fw-gray-500)",
  letterSpacing: "var(--fw-tracking-wide)",
  margin: "0",
};

const priceStyle = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-gray-700)",
  margin: "var(--fw-space-2) 0 0",
  fontWeight: "var(--fw-weight-medium)",
};
