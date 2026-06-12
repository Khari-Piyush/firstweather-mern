import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.improved";
import {
  PageWrapper,
  Section,
  SectionLabel,
  BodyText,
} from "../components/Layout.improved.jsx";
import Reveal from "../components/Reveal.improved.jsx";

// Locally available category images (public/)
const CATEGORY_IMG = {
  "wiper-arms": "/fw-arm.webp",
  "wiper-blades": "/fw-blade.webp",
  "wiper-linkage-assemblies": "/fw-linkage.webp",
  "wiper-wheel-box": "/fw-wheelbox.webp",
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/categories")
      .then((r) => setCategories(r.data))
      .catch(() => setError("Could not load categories."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper>
      {/* Page header */}
      <section style={header}>
        <div style={headerInner}>
          <SectionLabel light>Product Catalog</SectionLabel>
          <h1 style={pageTitle}>All Categories</h1>
          <BodyText light style={{ maxWidth: "44ch", margin: "0 auto" }}>
            Browse our complete range of wiper system components for commercial
            and passenger vehicles.
          </BodyText>
        </div>
      </section>

      {/* Grid */}
      <Reveal as={Section} bg="var(--fw-white)">
        {loading && <p style={msg}>Loading categories…</p>}
        {error && <p style={{ ...msg, color: "var(--fw-gray-700)" }}>{error}</p>}

        {!loading && !error && categories.length === 0 && (
          <p style={msg}>
            No categories found.{" "}
            <Link to="/contact" style={{ color: "var(--fw-navy-mid)" }}>
              Contact us
            </Link>{" "}
            for assistance.
          </p>
        )}

        {!loading && categories.length > 0 && (
          <div style={grid}>
            {categories.map((cat) => (
              <CategoryCard key={cat.slug} cat={cat} />
            ))}
          </div>
        )}
      </Reveal>
    </PageWrapper>
  );
};

export default CategoriesPage;

/* ── CategoryCard ─────────────────────────────────────────────────
   Image + name only. Nothing heavy.
────────────────────────────────────────────────────────────────── */

const CategoryCard = ({ cat }) => {
  const img = CATEGORY_IMG[cat.slug];

  return (
    <Link to={`/categories/${cat.slug}`} style={card}>
      <div style={imgWrap}>
        {img ? (
          <img src={img} alt={cat.name} style={imgStyle} loading="lazy" decoding="async" />
        ) : (
          <div style={placeholder}>
            <span style={placeholderIcon}>⚙</span>
          </div>
        )}
      </div>
      <div style={cardLabel}>
        <span style={cardName}>{cat.name}</span>
        <span style={cardArrow}>→</span>
      </div>
    </Link>
  );
};

/* ── Styles ──────────────────────────────────────────────────────── */

const header = {
  background: "var(--fw-navy)",
  padding: "var(--fw-space-20) var(--fw-section-px)",
  textAlign: "center",
};

const headerInner = {
  maxWidth: "var(--fw-container)",
  margin: "0 auto",
};

const pageTitle = {
  fontSize: "clamp(var(--fw-text-3xl), 5vw, var(--fw-text-5xl))",
  fontWeight: "var(--fw-weight-bold)",
  letterSpacing: "var(--fw-tracking-tight)",
  lineHeight: "var(--fw-leading-tight)",
  color: "var(--fw-white)",
  margin: "0 0 var(--fw-space-4)",
};

const msg = {
  textAlign: "center",
  color: "var(--fw-gray-500)",
  padding: "var(--fw-space-16) 0",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "var(--fw-space-6)",
};

const card = {
  display: "flex",
  flexDirection: "column",
  textDecoration: "none",
  background: "var(--fw-white)",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-md)",
  overflow: "hidden",
  boxShadow: "var(--fw-shadow-sm)",
  transition: "box-shadow var(--fw-duration) var(--fw-ease), transform var(--fw-duration) var(--fw-ease)",
};

const imgWrap = {
  width: "100%",
  aspectRatio: "4 / 3",
  background: "var(--fw-gray-100)",
  overflow: "hidden",
};

const imgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  //padding: "var(--fw-space-8)",
};

const placeholder = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--fw-gray-100)",
};

const placeholderIcon = {
  fontSize: "2.5rem",
  opacity: 0.2,
};

const cardLabel = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "var(--fw-space-4) var(--fw-space-5)",
  borderTop: "1px solid var(--fw-gray-300)",
};

const cardName = {
  fontSize: "var(--fw-text-sm)",
  fontWeight: "var(--fw-weight-semibold)",
  color: "var(--fw-navy)",
  letterSpacing: "var(--fw-tracking-tight)",
};

const cardArrow = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-gray-500)",
};
