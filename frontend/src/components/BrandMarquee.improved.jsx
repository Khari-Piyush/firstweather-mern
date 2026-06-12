import Marquee from "./Marquee.improved.jsx";
import "./BrandMarquee.improved.css";

import tata from "/brands/tata.png";
import hyundai from "/brands/hyundai.png";
import mahindra from "/brands/mahindra.png";
import ashoka from "/brands/ashok-leyland.png";
import ford from "/brands/ford.png";
import eicher from "/brands/eicher.png";
import volvo from "/brands/volvo.png";
import toyota from "/brands/toyota.png";
import maruti from "/brands/maruti.png";
import force from "/brands/force.png";
import sml from "/brands/sml.png";

const BRAND_LOGOS = [
  { name: "Tata", img: tata },
  { name: "Hyundai", img: hyundai },
  { name: "Mahindra", img: mahindra },
  { name: "Ashok Leyland", img: ashoka },
  { name: "Eicher", img: eicher },
  { name: "Volvo", img: volvo },
  { name: "Toyota", img: toyota },
  { name: "Maruti", img: maruti },
  { name: "Force", img: force },
  { name: "Ford", img: ford },
  { name: "SML", img: sml },
];

/* ── BrandMarquee ─────────────────────────────────────────────────
   Continuously scrolling row of vehicle brand logos for the
   "Vehicle Compatibility" section. Single row, calm speed, pauses
   on hover (desktop), fades to the section background at both
   edges. Falls back to a static wrapping row of all logos under
   prefers-reduced-motion.
────────────────────────────────────────────────────────────────── */

const BrandMarquee = () => (
  <Marquee
    pauseOnHover
    fade
    fadeColor="var(--fw-surface-alt)"
    duration="40s"
    gap="var(--fw-space-4)"
    className="fw-brand-marquee"
  >
    {BRAND_LOGOS.map((b) => (
      <LogoCard key={b.name} name={b.name} img={b.img} />
    ))}
  </Marquee>
);

export default BrandMarquee;

/* ── LogoCard ─────────────────────────────────────────────────────  */

const LogoCard = ({ name, img }) => (
  <div style={logoCard}>
    <img src={img} alt={name} style={logoImg} loading="lazy" decoding="async" />
  </div>
);

const logoCard = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: "160px",
  minHeight: "80px",
  padding: "var(--fw-space-6) var(--fw-space-4)",
  background: "var(--fw-white)",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-md)",
  boxShadow: "var(--fw-shadow-sm)",
};

const logoImg = {
  maxWidth: "90px",
  maxHeight: "44px",
  objectFit: "cover",
};
