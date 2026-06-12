import HeroSection from "./HeroSection.improved.jsx";
import CategoryShowcase from "./CategoryShowcase.improved.jsx";
import TestimonialsSection from "./TestimonialsSection.improved.jsx";
import { PageWrapper, Section, SectionLabel, SectionHeading, BodyText, Divider } from "../components/Layout.improved.jsx";
import { PrimaryButton } from "../components/Button.improved.jsx";
import MeteorBackground from "../components/MeteorBackground.improved.jsx";
import Reveal from "../components/Reveal.improved.jsx";
import LazySection from "../components/LazySection.improved.jsx";
import BrandMarquee from "../components/BrandMarquee.improved.jsx";

const STATS = [
  { value: "2005", label: "Established" },
  { value: "20+", label: "Years Experience" },
  { value: "1000+", label: "Vehicle Models Covered" },
];

/* ── HomePage ───────────────────────────────────────────────────── */

const HomePage = () => (
  <PageWrapper>
    <HeroSection />
    <Reveal>
      <StatsStrip />
    </Reveal>
    <LazySection minHeight="700px" rootMargin="400px 0px">
      <Reveal>
        <CategoryShowcase />
      </Reveal>
    </LazySection>
    <Reveal>
      <BrandsSection />
    </Reveal>
    <LazySection minHeight="600px" rootMargin="400px 0px">
      <Reveal>
        <TestimonialsSection />
      </Reveal>
    </LazySection>
    <Reveal>
      <FAQSection />
    </Reveal>
    <Reveal>
      <CtaStrip />
    </Reveal>
  </PageWrapper>
);

export default HomePage;

/* ── StatsStrip ─────────────────────────────────────────────────── */

const StatsStrip = () => (
  <section style={statsOuter}>
    <MeteorBackground variant="onDark">
      <div style={statsInner}>
        {STATS.map((s) => (
          <div key={s.label} style={statItem}>
            <span style={statValue}>{s.value}</span>
            <span style={statLabel}>{s.label}</span>
          </div>
        ))}
      </div>
    </MeteorBackground>
  </section>
);

const statsOuter = {
  position: "relative",
  overflow: "hidden",
  background: "var(--fw-navy)",
  padding: "var(--fw-space-10) var(--fw-section-px)",
};

const statsInner = {
  maxWidth: "var(--fw-container)",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "var(--fw-space-8)",
  textAlign: "center",
};

const statItem = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--fw-space-2)",
};

const statValue = {
  fontSize: "clamp(var(--fw-text-2xl), 4vw, var(--fw-text-4xl))",
  fontWeight: "var(--fw-weight-bold)",
  letterSpacing: "var(--fw-tracking-tight)",
  color: "var(--fw-white)",
};

const statLabel = {
  fontSize: "var(--fw-text-sm)",
  color: "rgba(255,255,255,0.55)",
  letterSpacing: "var(--fw-tracking-wide)",
  textTransform: "uppercase",
};

/* ── BrandsSection ──────────────────────────────────────────────── */

const BrandsSection = () => (
  <Section bg="var(--fw-surface-alt)" style={{ position: "relative", overflow: "hidden" }}>
    <MeteorBackground variant="onLight">
      <div style={{ textAlign: "center", marginBottom: "var(--fw-space-12)" }}>
        <SectionLabel>Vehicle Compatibility</SectionLabel>
        <SectionHeading style={{ margin: "0 auto" }}>
          Fits the Vehicles You Service
        </SectionHeading>
      </div>

      <BrandMarquee />
    </MeteorBackground>
  </Section>
);

/* ── FAQSection ────────────────────────────────────────────────────
   Visible FAQ + matching FAQPage JSON-LD — written for AI answer
   engines (Google AI Overviews, ChatGPT, Gemini, Perplexity) to
   parse and cite directly.
────────────────────────────────────────────────────────────────── */

const FAQ_ITEMS = [
  {
    q: "What products does First Weather manufacture?",
    a: "First Weather manufactures and supplies aftermarket wiper arms, wiper blades, wiper linkage assemblies, wiper wheel boxes, wiper motors, wiper rods, washer systems and complete wiper kits for passenger cars, buses, trucks and other commercial vehicles.",
  },
  {
    q: "Are First Weather wiper parts OEM-quality?",
    a: "Yes. First Weather is an aftermarket manufacturer that builds wiper components to OEM-equivalent quality and fitment standards. We are not an OEM supplier — we manufacture replacement parts engineered to match or exceed original specifications for performance, durability and fit.",
  },
  {
    q: "What is the difference between OEM and aftermarket wiper parts?",
    a: "OEM parts are supplied to the vehicle manufacturer under their brand, while aftermarket parts are replacement components sold independently. First Weather makes aftermarket wiper parts built to OEM-equivalent quality standards, giving the same fit and reliability — typically at better value for dealers, workshops and fleet operators.",
  },
  {
    q: "Which vehicle brands and models are compatible with First Weather wiper systems?",
    a: "First Weather wiper arms, blades and linkages are engineered to fit 1,000+ vehicle models from brands including Tata, Mahindra, Ashok Leyland, Eicher, Volvo, Toyota, Maruti Suzuki, Hyundai, Force, Ford, Piaggio and SML Isuzu — covering passenger, bus and commercial applications.",
  },
  {
    q: "Does First Weather supply wiper systems for buses and trucks?",
    a: "Yes. First Weather manufactures heavy-duty wiper arms, blades, linkages and motors for commercial vehicles — including buses, trucks and fleet vehicles — engineered for Indian roads, dust and monsoon conditions.",
  },
  {
    q: "How do I find the right wiper blade or arm size for my vehicle?",
    a: 'Share your vehicle make, model and year and our team will recommend the correct wiper size and fitment. Use "Get Best Price" with your vehicle details, or "Request Full Catalog" to browse compatibility, and we respond within 24 hours.',
  },
  {
    q: "What wiper blade fittings do you support (U-hook, bayonet, pin-type)?",
    a: "First Weather supplies blades and arms across common Indian fitment types including U-hook (hook-type), bayonet, side-pin, pinch-tab and double-pipe arms, plus frameless soft and hybrid blades for modern vehicles.",
  },
  {
    q: "Do you sell single wiper parts or only complete wiper systems?",
    a: "Both. You can source individual components — arms, blades, linkages, wheel boxes, motors, rods — or complete wiper kits and full systems, depending on whether you need a specific replacement part or a full assembly.",
  },
  {
    q: "Can dealers and distributors order in bulk, and is there a minimum order quantity?",
    a: 'Yes, First Weather supplies dealers, distributors, workshops and fleet buyers in bulk. For minimum order quantities and wholesale terms, use "Get Best Price" with your requirement and our team will share details within 24 hours.',
  },
  {
    q: "How can dealers and distributors get wholesale pricing or the product catalogue?",
    a: 'Dealers, distributors and bulk buyers can request wholesale pricing using "Get Best Price", or request the full product catalogue using "Request Full Catalog". Our team responds within 24 hours.',
  },
  {
    q: "Do First Weather wiper parts come with a warranty or quality guarantee?",
    a: "First Weather wiper components are manufactured to OEM-equivalent quality and tested for durability against wear, heat and corrosion. For specific warranty terms on a product or bulk order, contact our team via \"Get Best Price\".",
  },
  {
    q: "How long has First Weather been making automotive wiper parts in India?",
    a: "First Weather has been manufacturing aftermarket automotive wiper components in India since 2005, supplying dealers, distributors, workshops, fleet operators and the replacement-parts aftermarket pan-India.",
  },
  {
    q: "Do you ship across India and how soon can orders be delivered?",
    a: "Yes. First Weather is based in Delhi and supplies pan-India to dealers, workshops, distributors and fleet operators. Share your location and quantity via \"Get Best Price\" for dispatch timelines and freight options.",
  },
  {
    q: "Where is First Weather based and which areas does it supply?",
    a: "First Weather is based in Delhi, India, and supplies wiper arms, blades, linkages and complete wiper systems pan-India to dealers, workshops, distributors and fleet operators.",
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const FAQSection = () => (
  <Section bg="var(--fw-surface-alt)" style={{ position: "relative", overflow: "hidden" }}>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
    />
    <MeteorBackground variant="onLight">
      <div style={{ textAlign: "center", marginBottom: "var(--fw-space-12)" }}>
        <SectionLabel>FAQs</SectionLabel>
        <SectionHeading style={{ margin: "0 auto" }}>
          Frequently Asked Questions
        </SectionHeading>
      </div>

      <div style={faqList}>
        {FAQ_ITEMS.map((item) => (
          <details key={item.q} style={faqItem}>
            <summary style={faqQuestion}>{item.q}</summary>
            <p style={faqAnswer}>{item.a}</p>
          </details>
        ))}
      </div>
    </MeteorBackground>
  </Section>
);

const faqList = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--fw-space-3)",
  maxWidth: "800px",
  margin: "0 auto",
};

const faqItem = {
  background: "var(--fw-white)",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-md)",
  padding: "var(--fw-space-5) var(--fw-space-6)",
};

const faqQuestion = {
  fontSize: "var(--fw-text-base)",
  fontWeight: "var(--fw-weight-semibold)",
  color: "var(--fw-navy)",
  cursor: "pointer",
  letterSpacing: "var(--fw-tracking-tight)",
};

const faqAnswer = {
  fontSize: "var(--fw-text-sm)",
  lineHeight: "var(--fw-leading-normal)",
  color: "var(--fw-gray-500)",
  margin: "var(--fw-space-3) 0 0",
};

/* ── CtaStrip ───────────────────────────────────────────────────── */

const CtaStrip = () => (
  <>
    <Divider />
    <Section bg="var(--fw-white)" compact style={{ position: "relative", overflow: "hidden" }}>
      <MeteorBackground variant="onLight">
        <div style={ctaInner}>
          <div>
            <SectionHeading style={{ margin: "0 0 var(--fw-space-3)" }}>
              Need the right part?
            </SectionHeading>
            <BodyText style={{ margin: 0 }}>
              Tell us your vehicle and requirement — we'll get back within 24 hours.
            </BodyText>
          </div>
          <PrimaryButton to="/contact">
            Get Best Price
          </PrimaryButton>
        </div>
      </MeteorBackground>
    </Section>
  </>
);

const ctaInner = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--fw-space-8)",
};
