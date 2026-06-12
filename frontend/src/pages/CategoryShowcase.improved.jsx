import { Section, SectionLabel, SectionHeading } from "../components/Layout.improved.jsx";
import { SecondaryButton } from "../components/Button.improved.jsx";
import MeteorBackground from "../components/MeteorBackground.improved.jsx";
import KineticText from "../components/KineticText.improved.jsx";
import CategoryCard from "../components/CategoryCard.improved.jsx";

import wiperArm from "/fw-arm.webp";
import wiperBlade from "/fw-blade.webp";
import wiperLinkage from "/fw-linkage.webp";
import wiperWheelBox from "/fw-wheelbox.webp";

const CATEGORIES = [
  {
    label: "Wiper Arms",
    slug: "wiper-arms",
    img: wiperArm,
    description: "Bayonet, hook-type, double-pipe and more.",
  },
  {
    label: "Wiper Blades",
    slug: "wiper-blades",
    img: wiperBlade,
    description: "U-hook, frameless soft and hybrid blades.",
  },
  {
    label: "Wiper Linkage Assemblies",
    slug: "wiper-linkage-assemblies",
    img: wiperLinkage,
    description: "Complete assemblies for smooth wiper operation.",
  },
  {
    label: "Wiper Wheel Box",
    slug: "wiper-wheel-box",
    img: wiperWheelBox,
    description: "Pivot and transmission wheel box components.",
  },
];

const CategoryShowcase = () => (
  <Section bg="var(--fw-white)" style={{ position: "relative", overflow: "hidden" }}>
    <MeteorBackground variant="onLight">
      <div style={{ textAlign: "center", marginBottom: "var(--fw-space-12)" }}>
        <SectionLabel>Product Categories</SectionLabel>
        <SectionHeading style={{ margin: "0 auto var(--fw-space-4)" }}>
          <KineticText text="Built for Every Vehicle" />
        </SectionHeading>
        <p style={{
          fontSize: "var(--fw-text-base)",
          color: "var(--fw-gray-500)",
          maxWidth: "48ch",
          margin: "0 auto",
          lineHeight: "var(--fw-leading-normal)",
        }}>
          From passenger cars to heavy commercial vehicles — wiper
          components engineered for reliability.
        </p>
      </div>

      <div style={grid}>
        {CATEGORIES.map((cat) => (
          <CategoryCard key={cat.slug} cat={cat} />
        ))}
      </div>

      <div style={{ textAlign: "center", marginTop: "var(--fw-space-12)" }}>
        <SecondaryButton to="/categories">
          View All Categories
        </SecondaryButton>
      </div>
    </MeteorBackground>
  </Section>
);

export default CategoryShowcase;

/* ── Styles ──────────────────────────────────────────────────────── */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "var(--fw-space-6)",
};
