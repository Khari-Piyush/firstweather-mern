import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api.improved.js";
import ProductCard from "../components/ProductCard.improved.jsx";
import GetBestPriceButton from "../components/GetBestPriceButton.improved.jsx";
import DownloadCatalogButton from "../components/DownloadCatalogButton.improved.jsx";
import AddToInquiryButton from "../components/AddToInquiryButton.improved.jsx";
import {
  PageWrapper,
  Section,
  SectionLabel,
  SectionHeading,
  BodyText,
} from "../components/Layout.improved.jsx";
import Reveal from "../components/Reveal.improved.jsx";
import "../components/LazySection.improved.css";

const WA_NUMBER = "917428088039";

const buildWaUrl = (product) => {
  const lines = [
    "Hi First Weather,",
    "",
    `I'm interested in: ${product.productName}`,
    product.productId ? `Product Code: ${product.productId}` : null,
    "",
    "Please share the best price.",
  ].filter((l) => l !== null);
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
};

const optimizeImg = (url) =>
  url ? url.replace("/upload/", "/upload/w_800,f_auto,q_auto/") : null;

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

// Extracts the 11-char video id from watch/youtu.be/shorts (and embed) URL forms; null if not YouTube.
const extractYouTubeId = (url) => {
  if (!url) return null;
  let u;
  try {
    u = new URL(url);
  } catch {
    return null;
  }

  const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "youtu.be") {
    const id = u.pathname.slice(1).split("/")[0];
    return YOUTUBE_ID_REGEX.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (u.pathname === "/watch") {
      const id = u.searchParams.get("v");
      return id && YOUTUBE_ID_REGEX.test(id) ? id : null;
    }
    const shortsMatch = u.pathname.match(/^\/shorts\/([^/]+)/);
    if (shortsMatch) return YOUTUBE_ID_REGEX.test(shortsMatch[1]) ? shortsMatch[1] : null;

    const embedMatch = u.pathname.match(/^\/embed\/([^/]+)/);
    if (embedMatch) return YOUTUBE_ID_REGEX.test(embedMatch[1]) ? embedMatch[1] : null;
  }

  return null;
};

/* ── Page ────────────────────────────────────────────────────────── */

const ProductDetailPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [recLoading, setRecLoading] = useState(false);
  const [recFallback, setRecFallback] = useState(false);

  // Fetch product
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get(`/products/${id}`)
      .then((r) => { if (!cancelled) setProduct(r.data); })
      .catch(() => { if (!cancelled) setError("Failed to load product."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  // gtag view_product
  useEffect(() => {
    if (!product) return;
    if (typeof window.gtag === "function") {
      window.gtag("event", "view_product", {
        event_category: "engagement",
        event_label: product.productName,
      });
    }
  }, [product]);

  // ML recommendations — falls back to same-category products on empty/error
  useEffect(() => {
    if (!product?._id) return;
    let cancelled = false;

    const loadFallback = () => {
      if (!product.category) {
        if (!cancelled) setRecLoading(false);
        return;
      }
      api.get("/products", { params: { category: product.category, limit: 6 } })
        .then((r) => {
          if (cancelled) return;
          const items = Array.isArray(r.data) ? r.data : [];
          const filtered = items.filter((p) => p._id !== product._id).slice(0, 5);
          setRecommendations(filtered);
          setRecFallback(true);
        })
        .catch(() => { if (!cancelled) setRecommendations([]); })
        .finally(() => { if (!cancelled) setRecLoading(false); });
    };

    setRecLoading(true);
    setRecFallback(false);
    setRecommendations([]);

    api.get(`/recommend/${product._id}`)
      .then((r) => {
        if (cancelled) return;
        const items = Array.isArray(r.data) ? r.data : [];
        if (items.length > 0) {
          setRecommendations(items);
          setRecLoading(false);
        } else {
          loadFallback();
        }
      })
      .catch(() => { if (!cancelled) loadFallback(); });

    return () => { cancelled = true; };
  }, [product?._id, product?.category]);

  if (loading) {
    return (
      <PageWrapper>
        <div style={stateMsg}>Loading…</div>
      </PageWrapper>
    );
  }

  if (error || !product) {
    return (
      <PageWrapper>
        <div style={stateMsg}>
          {error || "Product not found."}{" "}
          <Link to="/products" style={{ color: "var(--fw-navy-mid)" }}>
            ← Back to Products
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const imgSrc = optimizeImg(product.imageUrl) || "/fw-logo-blue.webp";
  const waUrl = buildWaUrl(product);
  const videoId = extractYouTubeId(product.videoUrl);

  return (
    <PageWrapper>
      {/* ── 1. Product hero: image + info ──────────────────────── */}
      <Section bg="var(--fw-white)">

        {/* Breadcrumb */}
        <nav style={breadcrumb} aria-label="breadcrumb">
          <Link to="/categories" style={breadLink}>Categories</Link>
          {product.category && (
            <>
              <span style={breadSep} aria-hidden="true">/</span>
              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                style={breadLink}
              >
                {product.category}
              </Link>
            </>
          )}
          <span style={breadSep} aria-hidden="true">/</span>
          <span style={{ color: "var(--fw-gray-700)", fontSize: "var(--fw-text-sm)" }}>
            {product.productName}
          </span>
        </nav>

        <div style={topGrid}>
          {/* Image */}
          <div style={imgWrap}>
            <img
              src={imgSrc}
              alt={product.productName}
              style={imgStyle}
              decoding="async"
            />
          </div>

          {/* Info */}
          <div style={infoCol}>
            {product.category && (
              <SectionLabel>{product.category}</SectionLabel>
            )}

            <h1 style={productTitle}>{product.productName}</h1>

            {/* Specs */}
            <div style={specsBlock}>
              {product.productId && (
                <SpecRow label="Product Code" value={product.productId} mono />
              )}
              {product.carModel && (
                <SpecRow label="Compatible Vehicle" value={product.carModel} />
              )}
              {product.inStock != null && (
                <SpecRow
                  label="Availability"
                  value={product.inStock ? "In Stock" : "Out of Stock"}
                  accent={product.inStock ? "green" : "red"}
                />
              )}
            </div>

            {product.price != null && (
              <p style={priceHint}>
                MRP ₹{product.price}
                <span style={priceNote}> · contact us for net / bulk pricing</span>
              </p>
            )}

            {/* Action buttons */}
            <div style={ctaStack}>
              <GetBestPriceButton
                productId={product._id}
                productName={product.productName}
                full
              />

              <AddToInquiryButton product={product} variant="secondary" full />

              <a href={waUrl} target="_blank" rel="noopener noreferrer" style={waBtn}>
                <WaIcon />
                WhatsApp
              </a>

              <DownloadCatalogButton
                category={product.category}
                variant="secondary"
                full
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── 2. Description ─────────────────────────────────────── */}
      {product.description && (
        <Reveal as={Section} bg="var(--fw-surface-alt)" compact>
          <SectionLabel>About this Product</SectionLabel>
          <BodyText style={{ maxWidth: "72ch" }}>{product.description}</BodyText>
        </Reveal>
      )}

      {/* ── 3. Product Video ───────────────────────────────────── */}
      {videoId && (
        <Reveal as={Section} bg="var(--fw-white)" compact>
          <SectionLabel>Product Video</SectionLabel>
          <div style={videoWrap}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              title={`${product.productName} — Product Video`}
              style={videoIframe}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Reveal>
      )}

      {/* ── 4. Recommendations ─────────────────────────────────── */}
      {(recLoading || recommendations.length > 0) && (
        <Reveal as={Section} bg="var(--fw-white)">
          <div style={{ marginBottom: "var(--fw-space-8)" }}>
            <SectionLabel>
              {recFallback ? "You May Also Like" : "You May Also Need"}
            </SectionLabel>
            <SectionHeading style={{ margin: 0 }}>
              {recFallback ? "More From This Category" : "Frequently Bought Together"}
            </SectionHeading>
          </div>

          <div style={recGrid}>
            {recLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={recSkeletonCard}>
                  <div className="fw-lazy-skeleton" style={recSkeletonImg} />
                  <div style={recSkeletonBody}>
                    <div className="fw-lazy-skeleton" style={recSkeletonLine} />
                    <div className="fw-lazy-skeleton" style={recSkeletonLineShort} />
                  </div>
                </div>
              ))
            ) : (
              recommendations.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    if (typeof window.gtag === "function") {
                      window.gtag("event", "recommendation_click", {
                        event_category: "engagement",
                        event_label: item.productName,
                      });
                    }
                  }}
                >
                  <ProductCard product={item} />
                </div>
              ))
            )}
          </div>
        </Reveal>
      )}
    </PageWrapper>
  );
};

export default ProductDetailPage;

/* ── SpecRow ─────────────────────────────────────────────────────── */

const SpecRow = ({ label, value, mono, accent }) => (
  <div style={specRow}>
    <span style={specLabel}>{label}</span>
    <span style={{
      ...specValue,
      fontFamily: mono ? "'Courier New', monospace" : undefined,
      color: accent === "green" ? "#16a34a"
        : accent === "red" ? "#dc2626"
          : undefined,
      fontWeight: accent ? "var(--fw-weight-semibold)" : undefined,
    }}>
      {value}
    </span>
  </div>
);

/* ── WhatsApp icon (inline SVG — no external dependency) ─────────── */

const WaIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="currentColor"
    aria-hidden="true"
    style={{ flexShrink: 0 }}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

/* ── Styles ──────────────────────────────────────────────────────── */

const stateMsg = {
  textAlign: "center",
  padding: "var(--fw-space-20)",
  color: "var(--fw-gray-500)",
};

const breadcrumb = {
  display: "flex",
  alignItems: "center",
  gap: "var(--fw-space-2)",
  marginBottom: "var(--fw-space-8)",
  flexWrap: "wrap",
};

const breadLink = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-gray-500)",
  textDecoration: "none",
};

const breadSep = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-gray-300)",
};

const topGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "var(--fw-space-12)",
  alignItems: "start",
};

const imgWrap = {
  background: "var(--fw-gray-100)",
  borderRadius: "var(--fw-radius-lg)",
  padding: "var(--fw-space-2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const imgStyle = {
  width: "100%",
  maxHeight: "380px",
  objectFit: "cover",
};

const infoCol = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--fw-space-6)",
};

const productTitle = {
  fontSize: "clamp(var(--fw-text-2xl), 3.5vw, var(--fw-text-4xl))",
  fontWeight: "var(--fw-weight-bold)",
  letterSpacing: "var(--fw-tracking-tight)",
  lineHeight: "var(--fw-leading-tight)",
  color: "var(--fw-navy)",
  margin: "0",
};

const specsBlock = {
  display: "flex",
  flexDirection: "column",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-md)",
  overflow: "hidden",
  background: "var(--fw-gray-300)",
  gap: "1px",
};

const specRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "var(--fw-space-3) var(--fw-space-5)",
  background: "var(--fw-white)",
};

const specLabel = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-gray-500)",
  fontWeight: "var(--fw-weight-medium)",
};

const specValue = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-navy)",
  fontWeight: "var(--fw-weight-semibold)",
  textAlign: "right",
};

const priceHint = {
  fontSize: "var(--fw-text-base)",
  color: "var(--fw-navy)",
  fontWeight: "var(--fw-weight-semibold)",
  margin: "0",
};

const priceNote = {
  fontSize: "var(--fw-text-xs)",
  color: "var(--fw-gray-500)",
  fontWeight: "var(--fw-weight-normal)",
};

const ctaStack = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--fw-space-3)",
};

const waBtn = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "var(--fw-space-2)",
  padding: "0 var(--fw-space-6)",
  minHeight: "var(--fw-tap)",
  background: "#25D366",
  color: "#fff",
  borderRadius: "var(--fw-radius-sm)",
  textDecoration: "none",
  fontSize: "var(--fw-text-sm)",
  fontWeight: "var(--fw-weight-semibold)",
  fontFamily: "var(--fw-font)",
  letterSpacing: "var(--fw-tracking-tight)",
};

const videoWrap = {
  width: "100%",
  maxWidth: "720px",
  aspectRatio: "16 / 9",
  borderRadius: "var(--fw-radius-lg)",
  overflow: "hidden",
  background: "var(--fw-gray-100)",
};

const videoIframe = {
  width: "100%",
  height: "100%",
  border: "none",
  display: "block",
};

const recGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
  gap: "var(--fw-space-5)",
};

const recSkeletonCard = {
  background: "var(--fw-white)",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-md)",
  overflow: "hidden",
};

const recSkeletonImg = {
  width: "100%",
  aspectRatio: "1 / 1",
  borderRadius: 0,
};

const recSkeletonBody = {
  padding: "var(--fw-space-4) var(--fw-space-5)",
  borderTop: "1px solid var(--fw-gray-300)",
};

const recSkeletonLine = {
  height: 14,
  width: "80%",
  marginBottom: "var(--fw-space-2)",
};

const recSkeletonLineShort = {
  height: 12,
  width: "40%",
};
