import { Link } from "react-router-dom";
import GetBestPriceButton from "../components/GetBestPriceButton.improved.jsx";
import DownloadCatalogButton from "../components/DownloadCatalogButton.improved.jsx";
import Meteors from "../components/Meteors.improved.jsx";
import heroImage from "/hero-wiper-collage.webp";

const TRUST_POINTS = [
  "OEM-Quality Manufacturing",
  "Pan-India Delivery",
];

const HeroSection = () => (
  <section style={sectionStyle}>
    {/* Dark gradient overlay — heavier on left for text legibility */}
    <div style={overlay} />

    <Meteors variant="onDark" />

    <div style={content}>
      <p style={eyebrow}> LEADING WIPER SYSTEMS MANUFACTURER · MADE IN INDIA</p>

      <h1 style={heading}>
        Wiper Parts Manufacturer of<br />
        Blades, Arms, Linkage &amp; Spares
      </h1>

      <p style={subtext}>
        OEM-quality wiper blades, arms, linkages, wheel box, rods, motor gear, motors and spares for cars, buses and trucks — trusted
        by dealers, distributors, workshops and fleet operators across India.
      </p>

      <div style={ctas}>
        <GetBestPriceButton
          style={{ background: "var(--fw-white)", color: "var(--fw-navy)", borderColor: "var(--fw-white)" }}
        />

        <DownloadCatalogButton variant="ghost" />

        <Link to="/contact?type=distributor" style={distributorLink}>
          Become a Distributor →
        </Link>
      </div>

      <ul style={trustRow}>
        {TRUST_POINTS.map((point) => (
          <li key={point} style={trustItem}>
            <span aria-hidden="true" style={trustCheck}>✓</span>
            {point}
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default HeroSection;

/* ── Styles ─────────────────────────────────────────────────────── */

const sectionStyle = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
  minHeight: "90vh",
  backgroundImage: `url(${heroImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  display: "flex",
  alignItems: "center",
};

const overlay = {
  position: "absolute",
  inset: 0,
  background: "linear-gradient(100deg, rgba(10,23,42,0.88) 0%, rgba(10,23,42,0.55) 60%, rgba(10,23,42,0.2) 100%)",
};

const content = {
  position: "relative",
  maxWidth: "var(--fw-container)",
  width: "100%",
  margin: "0 auto",
  padding: "var(--fw-space-16) var(--fw-section-px)",
};

const eyebrow = {
  fontSize: "var(--fw-text-xs)",
  fontWeight: "var(--fw-weight-semibold)",
  letterSpacing: "var(--fw-tracking-wide)",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.65)",
  marginBottom: "var(--fw-space-4)",
};

const heading = {
  fontSize: "clamp(2.2rem, 6.5vw, var(--fw-text-5xl))",
  fontWeight: "var(--fw-weight-bold)",
  letterSpacing: "var(--fw-tracking-tight)",
  lineHeight: "var(--fw-leading-tight)",
  color: "var(--fw-white)",
  margin: "0 0 var(--fw-space-5)",
  maxWidth: "26ch",
};

const subtext = {
  fontSize: "var(--fw-text-lg)",
  lineHeight: "var(--fw-leading-normal)",
  color: "rgba(255,255,255,0.78)",
  maxWidth: "58ch",
  margin: "0 0 var(--fw-space-8)",
};

const ctas = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "var(--fw-space-5)",
  marginBottom: "var(--fw-space-8)",
};

const distributorLink = {
  fontSize: "var(--fw-text-sm)",
  fontWeight: "var(--fw-weight-semibold)",
  letterSpacing: "var(--fw-tracking-wide)",
  color: "rgba(255,255,255,0.85)",
  textDecoration: "none",
  borderBottom: "1px solid rgba(255,255,255,0.4)",
  paddingBottom: "2px",
  whiteSpace: "nowrap",
};

const trustRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--fw-space-2) var(--fw-space-6)",
  margin: 0,
  padding: 0,
  listStyle: "none",
};

const trustItem = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "var(--fw-text-xs)",
  fontWeight: "var(--fw-weight-semibold)",
  letterSpacing: "var(--fw-tracking-wide)",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.65)",
};

const trustCheck = {
  color: "rgba(255,255,255,0.4)",
};
