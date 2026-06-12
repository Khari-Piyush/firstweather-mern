import "./LazySection.improved.css";

/* ── PageSkeleton ─────────────────────────────────────────────────
   Lightweight placeholder shown by the route-level Suspense
   fallback while a lazy-loaded page chunk downloads — replaces a
   blank screen with a shimmering approximation of the page shell.
────────────────────────────────────────────────────────────────── */

const PageSkeleton = () => (
  <div style={{ minHeight: "100vh", background: "var(--fw-bg)" }} aria-hidden="true">
    <div style={headerBand}>
      <div style={headerInner}>
        <div className="fw-lazy-skeleton fw-lazy-skeleton--on-dark" style={{ height: 12, width: 140, marginBottom: "var(--fw-space-4)" }} />
        <div className="fw-lazy-skeleton fw-lazy-skeleton--on-dark" style={{ height: 36, width: "55%", maxWidth: 420 }} />
      </div>
    </div>

    <div style={grid}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="fw-lazy-skeleton" style={{ aspectRatio: "4 / 3" }} />
      ))}
    </div>
  </div>
);

export default PageSkeleton;

/* ── Styles ─────────────────────────────────────────────────────── */

const headerBand = {
  background: "var(--fw-navy)",
  padding: "var(--fw-space-16) var(--fw-section-px)",
};

const headerInner = {
  maxWidth: "var(--fw-container)",
  margin: "0 auto",
};

const grid = {
  maxWidth: "var(--fw-container)",
  margin: "0 auto",
  padding: "var(--fw-space-12) var(--fw-section-px)",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "var(--fw-space-6)",
};
