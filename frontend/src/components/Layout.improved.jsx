/**
 * Layout primitives for all redesigned surfaces (T21–T25).
 *
 * PageWrapper   — full-height page root with bg token applied
 * Section       — full-bleed section with constrained inner content
 * Container     — constrained content container only (no section padding)
 * SectionLabel  — small-caps eyebrow text above headings
 * SectionHeading — large section heading (h2)
 * PageHeading   — hero-scale heading (h1)
 * BodyText      — restrained paragraph
 * Divider       — 1px separator
 */

import { forwardRef } from "react";

/* ── PageWrapper ────────────────────────────────────────────────── */

export const PageWrapper = ({ children, style }) => (
  <div
    style={{
      background: "var(--fw-bg)",
      minHeight: "100vh",
      fontFamily: "var(--fw-font)",
      WebkitFontSmoothing: "antialiased",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ── Section ─────────────────────────────────────────────────────
   Full-bleed background, auto-centered constrained content.
   Pass bg to set the section background colour/gradient.
   Pass compact to use tighter vertical padding.
────────────────────────────────────────────────────────────────── */

export const Section = forwardRef(({ children, bg, compact, style, innerStyle, id, className, ...rest }, ref) => (
  <section
    ref={ref}
    id={id}
    className={className}
    style={{
      width: "100%",
      background: bg || "transparent",
      paddingTop:    compact ? "var(--fw-space-12)" : "var(--fw-section-py)",
      paddingBottom: compact ? "var(--fw-space-12)" : "var(--fw-section-py)",
      ...style,
    }}
    {...rest}
  >
    <div
      style={{
        maxWidth:     "var(--fw-container)",
        margin:       "0 auto",
        paddingLeft:  "var(--fw-section-px)",
        paddingRight: "var(--fw-section-px)",
        ...innerStyle,
      }}
    >
      {children}
    </div>
  </section>
));

Section.displayName = "Section";

/* ── Container ───────────────────────────────────────────────────
   Constrained content container only — no section padding.
   Use inside a full-bleed wrapper when you need the constraint
   without the section rhythm (e.g. Navbar inner, Footer inner).
────────────────────────────────────────────────────────────────── */

export const Container = ({ children, style }) => (
  <div
    style={{
      maxWidth:     "var(--fw-container)",
      margin:       "0 auto",
      paddingLeft:  "var(--fw-section-px)",
      paddingRight: "var(--fw-section-px)",
      ...style,
    }}
  >
    {children}
  </div>
);

/* ── SectionLabel ────────────────────────────────────────────────
   Eyebrow / category label in small-caps above a heading.
────────────────────────────────────────────────────────────────── */

export const SectionLabel = ({ children, light, style }) => (
  <p
    style={{
      fontSize:      "var(--fw-text-xs)",
      fontWeight:    "var(--fw-weight-semibold)",
      letterSpacing: "var(--fw-tracking-wide)",
      textTransform: "uppercase",
      color: light ? "rgba(255,255,255,0.6)" : "var(--fw-gray-500)",
      margin:        "0 0 var(--fw-space-3)",
      ...style,
    }}
  >
    {children}
  </p>
);

/* ── PageHeading (h1) ─────────────────────────────────────────────
   Hero-scale — use once per page.
────────────────────────────────────────────────────────────────── */

export const PageHeading = ({ children, light, style }) => (
  <h1
    style={{
      fontSize:      "clamp(var(--fw-text-3xl), 6vw, var(--fw-text-5xl))",
      fontWeight:    "var(--fw-weight-bold)",
      letterSpacing: "var(--fw-tracking-tight)",
      lineHeight:    "var(--fw-leading-tight)",
      color: light ? "var(--fw-white)" : "var(--fw-navy)",
      margin:        "0 0 var(--fw-space-6)",
      ...style,
    }}
  >
    {children}
  </h1>
);

/* ── SectionHeading (h2) ──────────────────────────────────────────
   Used for each major section within a page.
────────────────────────────────────────────────────────────────── */

export const SectionHeading = ({ children, light, style }) => (
  <h2
    style={{
      fontSize:      "clamp(var(--fw-text-2xl), 4vw, var(--fw-text-4xl))",
      fontWeight:    "var(--fw-weight-bold)",
      letterSpacing: "var(--fw-tracking-tight)",
      lineHeight:    "var(--fw-leading-tight)",
      color: light ? "var(--fw-white)" : "var(--fw-navy)",
      margin:        "0 0 var(--fw-space-6)",
      ...style,
    }}
  >
    {children}
  </h2>
);

/* ── SubHeading (h3) ──────────────────────────────────────────────  */

export const SubHeading = ({ children, light, style }) => (
  <h3
    style={{
      fontSize:      "var(--fw-text-xl)",
      fontWeight:    "var(--fw-weight-semibold)",
      letterSpacing: "var(--fw-tracking-tight)",
      lineHeight:    "var(--fw-leading-snug)",
      color: light ? "var(--fw-white)" : "var(--fw-navy)",
      margin:        "0 0 var(--fw-space-4)",
      ...style,
    }}
  >
    {children}
  </h3>
);

/* ── BodyText ─────────────────────────────────────────────────────  */

export const BodyText = ({ children, light, style }) => (
  <p
    style={{
      fontSize:   "var(--fw-text-base)",
      lineHeight: "var(--fw-leading-normal)",
      color: light ? "rgba(255,255,255,0.75)" : "var(--fw-gray-500)",
      margin:     "0 0 var(--fw-space-4)",
      ...style,
    }}
  >
    {children}
  </p>
);

/* ── Divider ──────────────────────────────────────────────────────  */

export const Divider = ({ style }) => (
  <hr
    style={{
      border:    "none",
      borderTop: "1px solid var(--fw-gray-300)",
      margin:    "0",
      ...style,
    }}
  />
);
