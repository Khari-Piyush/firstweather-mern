import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api.improved.js";
import {
  PageWrapper,
  Section,
  SectionLabel,
  SectionHeading,
  BodyText,
} from "../components/Layout.improved.jsx";
import { SecondaryButton } from "../components/Button.improved.jsx";
import ProductCard from "../components/ProductCard.improved.jsx";
import DownloadCatalogButton from "../components/DownloadCatalogButton.improved.jsx";
import GetBestPriceButton from "../components/GetBestPriceButton.improved.jsx";
import Reveal from "../components/Reveal.improved.jsx";

// Categories that have dedicated hero images in public/
const CATEGORY_HERO = {
  "wiper-arms": "/fw-arm.webp",
  "wiper-blades": "/fw-blade.webp",
  "wiper-linkage-assemblies": "/fw-linkage.webp",
  "wiper-wheel-box": "/fw-wheelbox.webp",
  "wiper-motors": "/fw-motor.webp",
  "wiper-motor-gear": "/fw-gear.webp",
  "complete-wiper-kits": "/fw-wipersys.webp",
  "bus-wiper-systems": "/fw-bus-system.webp",
  "wiper-spare-parts": "/fw-spares.webp",
};

const CategoryDetailPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api.get(`/categories/${slug}/products?limit=10`)
      .then((r) => {
        setCategory(r.data.category);
        setProducts(r.data.products || []);
      })
      .catch(() => setError("Could not load this category."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <PageWrapper>
        <div style={stateMsg}>Loading…</div>
      </PageWrapper>
    );
  }

  if (error || !category) {
    return (
      <PageWrapper>
        <div style={stateMsg}>
          {error || "Category not found."}{" "}
          <Link to="/categories" style={{ color: "var(--fw-navy-mid)" }}>
            ← Back to categories
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const heroImg = CATEGORY_HERO[slug];

  return (
    <PageWrapper>

      {/* ── 1. Hero banner ─────────────────────────────────────── */}
      <section style={heroStyle(heroImg)}>
        <div style={heroOverlay} />
        <div style={heroContent}>
          <SectionLabel light>Product Category</SectionLabel>
          <h1 style={heroTitle}>{category.name}</h1>
        </div>
      </section>

      {/* ── 2. Description ─────────────────────────────────────── */}
      {category.description && (
        <Reveal as={Section} bg="var(--fw-white)" compact>
          <div style={{ maxWidth: "64ch" }}>
            <BodyText style={{ margin: 0, fontSize: "var(--fw-text-lg)" }}>
              {category.description}
            </BodyText>
          </div>
        </Reveal>
      )}

      {/* ── 3. Featured products (first 10) ────────────────────── */}
      <Reveal as={Section} bg="var(--fw-surface-alt)">
        <div style={{ marginBottom: "var(--fw-space-10)" }}>
          <SectionLabel>Featured Products</SectionLabel>
          <SectionHeading style={{ margin: "0" }}>
            {products.length > 0 ? `${category.name} Products` : "Products"}
          </SectionHeading>
        </div>

        {products.length === 0 ? (
          <p style={noProducts}>
            No products listed yet.{" "}
            <Link to="/contact" style={{ color: "var(--fw-navy-mid)" }}>
              Contact us
            </Link>{" "}
            for availability.
          </p>
        ) : (
          <>
            <div style={productGrid}>
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {/* 4. View All Products */}
            <div style={{ textAlign: "center", marginTop: "var(--fw-space-10)" }}>
              <SecondaryButton
                to={`/products?category=${encodeURIComponent(category.name)}`}
              >
                View All Products
              </SecondaryButton>
            </div>
          </>
        )}
      </Reveal>

      {/* ── 5 & 6. Catalog + Inquiry CTAs on navy ──────────────── */}
      <Reveal as={Section} bg="var(--fw-navy)">
        <div style={ctaRow}>

          {/* Catalog CTA — DownloadCatalogButton handles PDF vs Request */}
          <div style={ctaBox}>
            <h3 style={ctaBoxTitle}>Product Catalog</h3>
            <p style={ctaBoxDesc}>
              {category.catalogPdfUrl
                ? "Download the full product catalog for this category."
                : "Request a catalog for this category and we'll send it to you."}
            </p>
            <DownloadCatalogButton
              catalogPdfUrl={category.catalogPdfUrl}
              category={category.name}
              variant="ghost"
            />
          </div>

          {/* Inquiry CTA */}
          <div style={ctaBoxRight}>
            <h3 style={ctaBoxTitle}>Have a Requirement?</h3>
            <p style={ctaBoxDesc}>
              Tell us your vehicle model and quantity — we respond within 24 hours.
            </p>
            <GetBestPriceButton
              category={category.name}
              variant="ghost"
            />
          </div>

        </div>
      </Reveal>

    </PageWrapper>
  );
};

export default CategoryDetailPage;

/* ── Styles ──────────────────────────────────────────────────────── */

const stateMsg = {
  textAlign: "center",
  padding: "var(--fw-space-20)",
  color: "var(--fw-gray-500)",
};

const heroStyle = (img) => ({
  position: "relative",
  width: "100%",
  minHeight: "400px",
  backgroundImage: img ? `url(${img})` : "none",
  backgroundSize: img ? "cover" : undefined,
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: img ? undefined : "var(--fw-navy)",
  display: "flex",
  alignItems: "flex-end",
});

const heroOverlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(to top, rgba(10,23,42,0.92) 0%, rgba(10,23,42,0.45) 60%, rgba(10,23,42,0.2) 100%)",
};

const heroContent = {
  position: "relative",
  maxWidth: "var(--fw-container)",
  width: "100%",
  margin: "0 auto",
  padding: "var(--fw-space-12) var(--fw-section-px)",
};

const heroTitle = {
  fontSize: "clamp(var(--fw-text-3xl), 5vw, var(--fw-text-5xl))",
  fontWeight: "var(--fw-weight-bold)",
  letterSpacing: "var(--fw-tracking-tight)",
  lineHeight: "var(--fw-leading-tight)",
  color: "var(--fw-white)",
  margin: "0",
};

const noProducts = {
  textAlign: "center",
  color: "var(--fw-gray-500)",
  padding: "var(--fw-space-12) 0",
};

const productGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: "var(--fw-space-5)",
};

const ctaRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--fw-space-8)",
  alignItems: "flex-start",
};

const ctaBox = {
  flex: "1 1 260px",
};

const ctaBoxRight = {
  flex: "1 1 260px",
  borderLeft: "1px solid rgba(255,255,255,0.12)",
  paddingLeft: "var(--fw-space-10)",
};

const ctaBoxTitle = {
  fontSize: "var(--fw-text-xl)",
  fontWeight: "var(--fw-weight-semibold)",
  color: "var(--fw-white)",
  margin: "0 0 var(--fw-space-3)",
  letterSpacing: "var(--fw-tracking-tight)",
};

const ctaBoxDesc = {
  fontSize: "var(--fw-text-base)",
  color: "rgba(255,255,255,0.65)",
  lineHeight: "var(--fw-leading-normal)",
  margin: "0 0 var(--fw-space-6)",
};
