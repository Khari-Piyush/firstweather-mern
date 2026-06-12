import { Link } from "react-router-dom";
import "./CategoryCard.improved.css";

const CategoryCard = ({ cat }) => (
  <Link to={`/categories/${cat.slug}`} className="fw-cat-card" style={card}>
    <div style={imgWrap}>
      <img src={cat.img} alt={cat.label} className="fw-cat-card-img" style={img} loading="lazy" decoding="async" />
    </div>
    <div style={cardBody}>
      <h3 style={cardTitle}>{cat.label}</h3>
      <p style={cardDesc}>{cat.description}</p>
      <span className="fw-cat-card-link" style={cardLink}>Explore →</span>
    </div>
  </Link>
);

export default CategoryCard;

/* ── Styles ──────────────────────────────────────────────────────── */

const card = {
  display: "flex",
  flexDirection: "column",
  background: "var(--fw-white)",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-md)",
  overflow: "hidden",
  textDecoration: "none",
};

const imgWrap = {
  width: "100%",
  aspectRatio: "4/3",
  background: "var(--fw-blue)",
  overflow: "hidden",
};

const img = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const cardBody = {
  padding: "var(--fw-space-6)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--fw-space-2)",
  flexGrow: 1,
};

const cardTitle = {
  fontSize: "var(--fw-text-lg)",
  fontWeight: "var(--fw-weight-semibold)",
  color: "var(--fw-navy)",
  margin: 0,
  letterSpacing: "var(--fw-tracking-tight)",
};

const cardDesc = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-gray-500)",
  lineHeight: "var(--fw-leading-normal)",
  margin: 0,
  flexGrow: 1,
};

const cardLink = {
  fontSize: "var(--fw-text-sm)",
  fontWeight: "var(--fw-weight-semibold)",
  color: "var(--fw-navy-mid)",
  marginTop: "var(--fw-space-2)",
};
