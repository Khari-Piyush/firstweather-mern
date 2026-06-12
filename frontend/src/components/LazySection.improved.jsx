import { useInView } from "../hooks/useInView.improved.js";
import "./LazySection.improved.css";

/* ── LazySection ──────────────────────────────────────────────────
   Defers mounting `children` until the wrapper scrolls within
   `rootMargin` of the viewport — keeps heavy below-the-fold
   sections (data fetches, decorative effects) out of the initial
   render. Shows `fallback` (a skeleton by default) until then.

   `minHeight` reserves space for the skeleton/content so nothing
   shifts (CLS) when the real content mounts.

   Once `children` mount they stay mounted (no re-hiding on scroll
   away), and the data/markup they render is regular DOM content —
   this only delays *when* it mounts, not whether it ever does.
────────────────────────────────────────────────────────────────── */

const LazySection = ({
  children,
  fallback,
  minHeight,
  rootMargin = "300px 0px",
  as: Tag = "div",
  onDark = false,
  style,
  ...rest
}) => {
  const [ref, inView] = useInView({ rootMargin, threshold: 0, once: true });

  return (
    <Tag ref={ref} style={{ minHeight: inView ? undefined : minHeight, ...style }} {...rest}>
      {inView
        ? children
        : fallback ?? (
            <div
              className={`fw-lazy-skeleton${onDark ? " fw-lazy-skeleton--on-dark" : ""}`}
              style={{ minHeight }}
              aria-hidden="true"
            />
          )}
    </Tag>
  );
};

export default LazySection;
