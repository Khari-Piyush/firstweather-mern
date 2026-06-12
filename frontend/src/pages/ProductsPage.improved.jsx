import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api.improved.js";
import ProductCard from "../components/ProductCard.improved.jsx";
import {
  PageWrapper,
  Section,
  SectionLabel,
} from "../components/Layout.improved.jsx";
import Reveal from "../components/Reveal.improved.jsx";

const LIMIT = 20;

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") || "";
  const urlVehicle  = searchParams.get("vehicle")  || "";

  const [products,   setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [page,       setPage]       = useState(1);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [hasMore,    setHasMore]    = useState(false);

  // Reset page when filter changes
  useEffect(() => { setPage(1); }, [urlCategory, urlVehicle]);

  // Fetch category list for filter chips
  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  // Fetch products
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    api.get("/products", {
      params: {
        page,
        limit: LIMIT,
        category: urlCategory || undefined,
        vehicle:  urlVehicle  || undefined,
      },
    })
      .then((r) => {
        if (!cancelled) {
          setProducts(r.data);
          setHasMore(r.data.length === LIMIT);
        }
      })
      .catch(() => { if (!cancelled) setError("Failed to load products."); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [page, urlCategory, urlVehicle]);

  const setCategory = (name) => {
    const next = new URLSearchParams(searchParams);
    if (name) next.set("category", name);
    else next.delete("category");
    next.delete("vehicle");
    setSearchParams(next);
  };

  const title = urlCategory
    || (urlVehicle ? `Results for "${urlVehicle}"` : "All Products");

  return (
    <PageWrapper>
      {/* ── Page header ─────────────────────────────────────────── */}
      <section style={headerStyle}>
        <div style={headerInner}>
          <SectionLabel light>Products</SectionLabel>
          <h1 style={pageTitle}>{title}</h1>
          <Link to="/categories" style={backLink}>← Back to Categories</Link>
        </div>
      </section>

      {/* ── Category filter strip ───────────────────────────────── */}
      {categories.length > 0 && (
        <div style={filterOuter}>
          <div style={filterInner}>
            <Chip
              label="All"
              active={!urlCategory}
              onClick={() => setCategory("")}
            />
            {categories.map((cat) => (
              <Chip
                key={cat.slug}
                label={cat.name}
                active={urlCategory === cat.name}
                onClick={() => setCategory(cat.name)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Product grid ────────────────────────────────────────── */}
      <Reveal as={Section} bg="var(--fw-white)">
        {loading && (
          <div style={productGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && error && (
          <p style={msgStyle}>{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p style={msgStyle}>
            No products found in this category.{" "}
            <Link to="/contact" style={{ color: "var(--fw-navy-mid)" }}>
              Contact us
            </Link>{" "}
            for assistance.
          </p>
        )}

        {!loading && products.length > 0 && (
          <>
            <div style={productGrid}>
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {/* Pagination */}
            <div style={paginationRow}>
              <PageButton
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ← Previous
              </PageButton>
              <span style={pageNum}>Page {page}</span>
              <PageButton
                disabled={!hasMore}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </PageButton>
            </div>
          </>
        )}
      </Reveal>
    </PageWrapper>
  );
};

export default ProductsPage;

/* ── Chip ──────────────────────────────────────────────────────── */

const Chip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "0 var(--fw-space-5)",
      borderRadius: "999px",
      border: "1px solid",
      borderColor: active ? "var(--fw-navy)" : "var(--fw-gray-300)",
      background: active ? "var(--fw-navy)" : "transparent",
      color: active ? "var(--fw-white)" : "var(--fw-gray-700)",
      fontSize: "var(--fw-text-sm)",
      fontWeight: active ? "var(--fw-weight-semibold)" : "var(--fw-weight-normal)",
      cursor: "pointer",
      minHeight: "var(--fw-tap)",
      whiteSpace: "nowrap",
      fontFamily: "var(--fw-font)",
    }}
  >
    {label}
  </button>
);

/* ── PageButton ────────────────────────────────────────────────── */

const PageButton = ({ children, disabled, onClick }) => (
  <button
    disabled={disabled}
    onClick={onClick}
    style={{
      padding: "0 var(--fw-space-6)",
      minHeight: "var(--fw-tap)",
      border: "1px solid var(--fw-gray-300)",
      borderRadius: "var(--fw-radius-sm)",
      background: disabled ? "var(--fw-gray-100)" : "var(--fw-white)",
      color: disabled ? "var(--fw-gray-500)" : "var(--fw-navy)",
      fontSize: "var(--fw-text-sm)",
      fontWeight: "var(--fw-weight-medium)",
      cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "var(--fw-font)",
      opacity: disabled ? 0.5 : 1,
    }}
  >
    {children}
  </button>
);

/* ── SkeletonCard ──────────────────────────────────────────────── */

const SkeletonCard = () => (
  <div style={{
    background: "var(--fw-white)",
    border: "1px solid var(--fw-gray-300)",
    borderRadius: "var(--fw-radius-md)",
    overflow: "hidden",
    opacity: 0.55,
  }}>
    <div style={{ aspectRatio: "1 / 1", background: "var(--fw-gray-100)" }} />
    <div style={{ padding: "var(--fw-space-4) var(--fw-space-5)" }}>
      <div style={{ height: "13px", background: "var(--fw-gray-300)", borderRadius: "4px", marginBottom: "8px" }} />
      <div style={{ height: "11px", background: "var(--fw-gray-300)", borderRadius: "4px", width: "55%" }} />
    </div>
  </div>
);

/* ── Styles ──────────────────────────────────────────────────────── */

const headerStyle = {
  background: "var(--fw-navy)",
  padding: "var(--fw-space-16) var(--fw-section-px)",
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
  margin: "0 0 var(--fw-space-3)",
};

const backLink = {
  fontSize: "var(--fw-text-sm)",
  color: "rgba(255,255,255,0.6)",
  textDecoration: "none",
};

const filterOuter = {
  background: "var(--fw-surface-alt)",
  borderBottom: "1px solid var(--fw-gray-300)",
  padding: "var(--fw-space-4) var(--fw-section-px)",
  position: "sticky",
  top: "var(--fw-nav-height)",
  zIndex: 10,
};

const filterInner = {
  maxWidth: "var(--fw-container)",
  margin: "0 auto",
  display: "flex",
  gap: "var(--fw-space-3)",
  overflowX: "auto",
  scrollbarWidth: "none",
};

const productGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "var(--fw-space-5)",
};

const msgStyle = {
  textAlign: "center",
  color: "var(--fw-gray-500)",
  padding: "var(--fw-space-16) 0",
  fontSize: "var(--fw-text-base)",
};

const paginationRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "var(--fw-space-6)",
  marginTop: "var(--fw-space-12)",
};

const pageNum = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-gray-500)",
};
