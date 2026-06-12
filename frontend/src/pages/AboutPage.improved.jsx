import {
  PageWrapper,
  Section,
  SectionLabel,
  SectionHeading,
  BodyText,
  Divider,
} from "../components/Layout.improved.jsx";
import GetBestPriceButton from "../components/GetBestPriceButton.improved.jsx";
import Reveal from "../components/Reveal.improved.jsx";
import LeadershipSection from "../components/LeadershipSection.improved.jsx";

/* ─── Static Data ──────────────────────────────────────────────────── */

const TIMELINE = [
  {
    year: "2005",
    title: "Where It Began",
    desc: "We started by manufacturing die-cut EVA (Ethylene-Vinyl Acetate) sheets used as acoustic damping and thermal insulation mats for early Maruti engines like the F8B on the original Maruti 800 — fitted to the firewall and floorboards to cut engine noise and block heat.",
  },
  {
    year: "2008",
    title: "Entered the Wiper Industry",
    desc: "As EVA usage in Maruti cars phased out, we transitioned our business and manufactured our first wiper wheel box for Tata — marking our full entry into the automotive wiper parts industry.",
  },
  {
    year: "2012",
    title: "Wiper Motor Gears",
    desc: "Expanded into wiper motor gears, manufacturing them across applications — for cars, buses and trucks.",
  },
  {
    year: "2016",
    title: "Widening the Range",
    desc: "We recognised how much more the vehicle wiper segment had to offer and began broadening our product range to cover more wiper components.",
  },
  {
    year: "2020",
    title: "Full System Coverage",
    desc: "Scaled up to a complete range — wiper linkage assemblies, wiper wheel boxes, wiper motor gears and wiper spare parts — covering the full wiper system.",
  },
  {
    year: "2025",
    title: "The First Weather Brand",
    desc: "Unified our products under our brand name, First Weather — manufacturing Tata bolt-type blades, wiper arms, linkage assemblies, wheel boxes, motor gears, wiper rods and spares.",
  },
  {
    year: "2026",
    title: "One-Stop Wiper Solution",
    desc: "Today we supply bus and truck body builders, traders, dealers and retailers — a one-stop solution for almost every vehicle wiper part. Visit us at Punja Sharif Market, Kashmere Gate, Delhi - 110006.",
  },
];

const OVERVIEW_ROWS = [
  { label: "Company", value: "S.R ENTERPRISES" },
  { label: "Business Type", value: "Manufacturer & Supplier" },
  { label: "Established", value: "2005" },
  { label: "Experience", value: "20+ Years" },
  { label: "Industry", value: "Automotive Components" },
  { label: "Products", value: "Wiper Arms, Blades, Linkage Assemblies, Motors, Spares" },
  { label: "Vehicle Coverage", value: "1,000+ Models — Commercial & Passenger" },
  { label: "Markets", value: "Pan-India · Aftermarket" },
  { label: "Vision", value: "To be India's most trusted manufacturer of automotive wiper systems." },
  { label: "Mission", value: "Deliver precision-engineered wiper components that meet every road condition across India." },
];

const WHY_US = [
  { key: "star", title: "20+ Years Experience", desc: "Two decades of expertise manufacturing wiper systems for every Indian road condition and vehicle type." },
  { key: "shield", title: "OEM Quality Standards", desc: "Every product is tested to meet or exceed original equipment manufacturer specifications before dispatch." },
  { key: "grid", title: "1,000+ Vehicle Models", desc: "Commercial trucks, passenger cars, buses, and heavy-duty vehicles — all covered in one place." },
  { key: "headset", title: "24-Hour Response", desc: "Bulk inquiries, technical support, and after-sales assistance — always answered within 24 hours." },
];

const STATS = [
  { value: "2005", label: "Year Founded" },
  { value: "20+", label: "Years Experience" },
  { value: "1000+", label: "Vehicle Models" },
  { value: "200+", label: "Cities Covered" },
];

const CERTIFICATES = [
  {
    title: "GST Registration Certificate",
    desc: "Goods & Services Tax registration under the Government of India.",
    fileUrl: "/gst-certificate.pdf",
  },
  {
    title: "Trademark Certificate",
    desc: "Registered trademark for the First Weather brand name and logo.",
    fileUrl: "/",
  },
  {
    title: "UDYAM Registration Certificate",
    desc: "Certificate of company incorporation and business registration documents.",
    fileUrl: "/udyam-certificate.pdf",
  },
  // {
  //   title: "ISO Certification",
  //   desc: "Quality management system certification.",
  //   fileUrl: null,
  // },
];

const LOCATIONS = [
  {
    type: "Registered Office",
    address: " IST FLOOR, HOUSE NO WP-406B KH NO. 532, BLK-WP VILLAGE WAZIR PUR, WAZIR PUR, North West Delhi, Delhi - 110052, INDIA",
    mapsUrl: null,
  },
  {
    type: "Store & Sales Office",
    address: "245/1A, PUNJA SHARIF MARKET, KASHMERE GATE, DELHI - 110006, INDIA",
    mapsUrl: null,
  },
  {
    type: "Warehouse",
    address: "ANAND PARBAT, DELHI - 110005, INDIA",
    mapsUrl: null,
  },
];

const VALUES = [
  { no: "01", title: "Quality", desc: "Every component built to meet or exceed OEM specifications." },
  { no: "02", title: "Reliability", desc: "Engineered to perform in every season, on every road." },
  { no: "03", title: "Trust", desc: "20 years of honest business with customers and partners." },
  { no: "04", title: "Innovation", desc: "Continuous improvement in materials, design, and fit." },
  { no: "05", title: "Commitment", desc: "Customer satisfaction is the only measure of our success." },
];

/* ─── Page ─────────────────────────────────────────────────────────── */

const AboutPage = () => (
  <PageWrapper>
    <HeroBand />
    <Reveal><StorySection /></Reveal>
    <Reveal><LeadershipSection /></Reveal>
    <Reveal><OverviewSection /></Reveal>
    <Reveal><WhyChooseUsSection /></Reveal>
    <Reveal><StatsSection /></Reveal>
    <Reveal><CertificatesSection /></Reveal>
    <Reveal><LocationsSection /></Reveal>
    <Reveal><ValuesSection /></Reveal>
    <Reveal><CtaBand /></Reveal>
  </PageWrapper>
);

export default AboutPage;

/* ─── 1. Hero ──────────────────────────────────────────────────────── */

const HeroBand = () => (
  <section style={heroBand}>
    <div style={heroInner}>
      <SectionLabel light>Company Profile</SectionLabel>
      <h1 style={heroTitle}>
        Building Trust,<br />One Wiper at a Time.
      </h1>
      <p style={heroSub}>
        Since 2005, First Weather Wipers has been engineering precision wiper
        systems for India's most demanding roads and vehicle fleets.
      </p>
    </div>
  </section>
);

/* ─── 2. Story + Timeline ──────────────────────────────────────────── */

const StorySection = () => (
  <Section bg="var(--fw-white)">
    <div style={storyGrid}>
      <div style={storyLeft}>
        <SectionLabel>Our Journey</SectionLabel>
        <SectionHeading style={{ margin: "0 0 var(--fw-space-6)" }}>
          Two Decades of<br />Engineering Excellence
        </SectionHeading>
        <BodyText>
          First Weather Wipers was born out of a simple observation: Indian roads
          demand more from wiper systems than imported solutions can offer. From
          extreme monsoon conditions to year-round dust and heat, Indian vehicles
          need components engineered specifically for this environment.
        </BodyText>
        <BodyText style={{ marginTop: "var(--fw-space-2)" }}>
          What began as a focused manufacturing unit in 2005 has grown into one
          of India's most trusted automotive wiper suppliers — covering 1,000+
          vehicle models and serving fleet operators, dealers, and OEMs across
          the country.
        </BodyText>
      </div>

      <div style={timelineCol}>
        {TIMELINE.map((item, i) => (
          <TimelineItem
            key={item.year}
            item={item}
            last={i === TIMELINE.length - 1}
          />
        ))}
      </div>
    </div>
  </Section>
);

const TimelineItem = ({ item, last }) => (
  <div style={{ display: "flex", gap: "var(--fw-space-5)" }}>
    <div style={tlTrack}>
      <div style={tlDot} />
      {!last && <div style={tlLine} />}
    </div>
    <div style={{ paddingBottom: last ? 0 : "var(--fw-space-8)" }}>
      <span style={tlYear}>{item.year}</span>
      <p style={tlTitle}>{item.title}</p>
      <p style={tlDesc}>{item.desc}</p>
    </div>
  </div>
);

/* ─── 4. Company Overview ──────────────────────────────────────────── */

const OverviewSection = () => (
  <Section bg="var(--fw-white)">
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "var(--fw-space-10)" }}>
        <SectionLabel>At a Glance</SectionLabel>
        <SectionHeading style={{ margin: "0" }}>Company Overview</SectionHeading>
      </div>
      <div style={overviewTable}>
        {OVERVIEW_ROWS.map((row) => (
          <div key={row.label} style={overviewRow}>
            <span style={overviewLabel}>{row.label}</span>
            <span style={overviewValue}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  </Section>
);

/* ─── 5. Why Choose Us ─────────────────────────────────────────────── */

const WhyChooseUsSection = () => (
  <Section bg="var(--fw-surface-alt)">
    <div style={{ textAlign: "center", marginBottom: "var(--fw-space-12)" }}>
      <SectionLabel>Why First Weather</SectionLabel>
      <SectionHeading style={{ margin: "0 auto" }}>
        Why Thousands of Dealers<br />and Fleets Choose Us
      </SectionHeading>
    </div>
    <div style={whyGrid}>
      {WHY_US.map((item) => (
        <WhyCard key={item.key} item={item} />
      ))}
    </div>
  </Section>
);

const WhyCard = ({ item }) => (
  <div style={whyCard}>
    <div style={whyIconWrap}>
      <WhyIcon name={item.key} />
    </div>
    <h4 style={whyTitle}>{item.title}</h4>
    <p style={whyDesc}>{item.desc}</p>
  </div>
);

/* ─── 6. Stats ─────────────────────────────────────────────────────── */

const StatsSection = () => (
  <section style={statsBand}>
    <div style={statsInner}>
      {STATS.map((s) => (
        <div key={s.label} style={statItem}>
          <span style={statValue}>{s.value}</span>
          <span style={statLabel}>{s.label}</span>
        </div>
      ))}
    </div>
  </section>
);

/* ─── 7. Certificates ──────────────────────────────────────────────── */

const CertificatesSection = () => (
  <Section bg="var(--fw-white)">
    <div style={{ marginBottom: "var(--fw-space-12)" }}>
      <SectionLabel>Legal & Compliance</SectionLabel>
      <SectionHeading style={{ margin: "0" }}>
        Certifications & Documents
      </SectionHeading>
    </div>
    <div style={certGrid}>
      {CERTIFICATES.map((cert) => (
        <CertCard key={cert.title} cert={cert} />
      ))}
    </div>
  </Section>
);

const CertCard = ({ cert }) => (
  <div style={certCard}>
    <div style={certIconWrap}>
      <DocumentIcon />
    </div>
    <div style={{ flex: 1 }}>
      <h4 style={certTitle}>{cert.title}</h4>
      <p style={certDesc}>{cert.desc}</p>
      {cert.fileUrl ? (
        <a
          href={cert.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={certLink}
        >
          View Document →
        </a>
      ) : (
        <span style={certPending}>Document coming soon</span>
      )}
    </div>
  </div>
);

/* ─── 8. Locations ─────────────────────────────────────────────────── */

const LocationsSection = () => (
  <Section bg="var(--fw-surface-alt)">
    <div style={{ marginBottom: "var(--fw-space-12)" }}>
      <SectionLabel>Where We Are</SectionLabel>
      <SectionHeading style={{ margin: "0" }}>Business Locations</SectionHeading>
    </div>
    <div style={locGrid}>
      {LOCATIONS.map((loc) => (
        <LocCard key={loc.type} loc={loc} />
      ))}
    </div>
  </Section>
);

const LocCard = ({ loc }) => (
  <div style={locCard}>
    <span style={locType}>{loc.type}</span>
    <div style={locAddrRow}>
      <PinIcon />
      <p style={locAddress}>{loc.address}</p>
    </div>
    {loc.mapsUrl ? (
      <a
        href={loc.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={locDirBtn}
      >
        Get Directions →
      </a>
    ) : (
      <span style={locPending}></span>
    )}
  </div>
);

/* ─── 9. Brand Values ──────────────────────────────────────────────── */

const ValuesSection = () => (
  <Section bg="var(--fw-navy)">
    <div style={{ textAlign: "center", marginBottom: "var(--fw-space-12)" }}>
      <SectionLabel light>What We Stand For</SectionLabel>
      <SectionHeading light style={{ margin: "0 auto" }}>
        Our Brand Values
      </SectionHeading>
    </div>
    <div style={valuesGrid}>
      {VALUES.map((v) => (
        <div key={v.no} style={valueItem}>
          <span style={valueNo}>{v.no}</span>
          <h4 style={valueTitle}>{v.title}</h4>
          <p style={valueDesc}>{v.desc}</p>
        </div>
      ))}
    </div>
  </Section>
);

/* ─── 10. CTA Band ─────────────────────────────────────────────────── */

const CtaBand = () => (
  <>
    <Divider />
    <Section bg="var(--fw-white)" compact>
      <div style={ctaInner}>
        <div>
          <SectionHeading style={{ margin: "0 0 var(--fw-space-3)" }}>
            Ready to place an order?
          </SectionHeading>
          <BodyText style={{ margin: 0 }}>
            Contact us for bulk pricing, availability, and technical specifications.
          </BodyText>
        </div>
        <GetBestPriceButton />
      </div>
    </Section>
  </>
);

/* ─── Icons ────────────────────────────────────────────────────────── */

const WhyIcon = ({ name }) => {
  if (name === "star") return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
  if (name === "shield") return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
    </svg>
  );
  if (name === "grid") return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
    </svg>
  );
  if (name === "headset") return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 1C7.03 1 3 5.03 3 10v3c0 1.1.9 2 2 2h1v-6H5c0-3.87 3.13-7 7-7s7 3.13 7 7h-1v6h1c1.1 0 2-.9 2-2v-3c0-4.97-4.03-9-9-9z" />
    </svg>
  );
  if (name === "truck") return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  );
  if (name === "wrench") return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
    </svg>
  );
  return null;
};

const DocumentIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
  </svg>
);

const PinIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="currentColor"
    aria-hidden="true"
    style={{ flexShrink: 0, marginTop: "2px", color: "var(--fw-navy)" }}
  >
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

/* ─── Styles ───────────────────────────────────────────────────────── */

const heroBand = {
  background: "var(--fw-navy)",
  padding: "var(--fw-space-20) var(--fw-section-px)",
};

const heroInner = {
  maxWidth: "var(--fw-container)",
  margin: "0 auto",
};

const heroTitle = {
  fontSize: "clamp(var(--fw-text-3xl), 6vw, var(--fw-text-5xl))",
  fontWeight: "var(--fw-weight-bold)",
  letterSpacing: "var(--fw-tracking-tight)",
  lineHeight: "var(--fw-leading-tight)",
  color: "var(--fw-white)",
  margin: "0 0 var(--fw-space-6)",
  maxWidth: "18ch",
};

const heroSub = {
  fontSize: "var(--fw-text-lg)",
  color: "rgba(255,255,255,0.72)",
  lineHeight: "var(--fw-leading-normal)",
  maxWidth: "52ch",
  margin: 0,
};

/* Story */
const storyGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "var(--fw-space-16)",
  alignItems: "start",
};

const storyLeft = {
  display: "flex",
  flexDirection: "column",
};

const timelineCol = {
  display: "flex",
  flexDirection: "column",
};

const tlTrack = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  flexShrink: 0,
};

const tlDot = {
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  background: "var(--fw-navy)",
  flexShrink: 0,
};

const tlLine = {
  width: "2px",
  flex: 1,
  background: "var(--fw-gray-300)",
  minHeight: "var(--fw-space-8)",
};

const tlYear = {
  display: "inline-block",
  fontSize: "var(--fw-text-xs)",
  fontWeight: "var(--fw-weight-semibold)",
  letterSpacing: "var(--fw-tracking-wide)",
  color: "var(--fw-white)",
  background: "var(--fw-navy)",
  padding: "2px 8px",
  borderRadius: "999px",
  marginBottom: "var(--fw-space-2)",
};

const tlTitle = {
  fontSize: "var(--fw-text-base)",
  fontWeight: "var(--fw-weight-semibold)",
  color: "var(--fw-navy)",
  margin: "0 0 var(--fw-space-2)",
  letterSpacing: "var(--fw-tracking-tight)",
};

const tlDesc = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-gray-500)",
  lineHeight: "var(--fw-leading-normal)",
  margin: 0,
};

/* Overview */
const overviewTable = {
  display: "flex",
  flexDirection: "column",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-md)",
  overflow: "hidden",
  background: "var(--fw-gray-300)",
  gap: "1px",
};

const overviewRow = {
  display: "grid",
  gridTemplateColumns: "minmax(110px, 160px) 1fr",
  gap: "var(--fw-space-4)",
  padding: "var(--fw-space-4) var(--fw-space-5)",
  background: "var(--fw-white)",
  alignItems: "start",
};

const overviewLabel = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-gray-500)",
  fontWeight: "var(--fw-weight-medium)",
  paddingTop: "1px",
};

const overviewValue = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-navy)",
  fontWeight: "var(--fw-weight-semibold)",
  lineHeight: "var(--fw-leading-normal)",
};

/* Why Choose Us */
const whyGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "var(--fw-space-5)",
};

const whyCard = {
  background: "var(--fw-white)",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-md)",
  padding: "var(--fw-space-8)",
};

const whyIconWrap = {
  width: "44px",
  height: "44px",
  borderRadius: "var(--fw-radius-sm)",
  background: "var(--fw-navy)",
  color: "var(--fw-white)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "var(--fw-space-5)",
  flexShrink: 0,
};

const whyTitle = {
  fontSize: "var(--fw-text-base)",
  fontWeight: "var(--fw-weight-semibold)",
  color: "var(--fw-navy)",
  margin: "0 0 var(--fw-space-3)",
  letterSpacing: "var(--fw-tracking-tight)",
};

const whyDesc = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-gray-500)",
  lineHeight: "var(--fw-leading-normal)",
  margin: 0,
};

/* Stats */
const statsBand = {
  background: "var(--fw-navy)",
  padding: "var(--fw-space-10) var(--fw-section-px)",
};

const statsInner = {
  maxWidth: "var(--fw-container)",
  margin: "0 auto",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
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

/* Certificates */
const certGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "var(--fw-space-5)",
};

const certCard = {
  display: "flex",
  gap: "var(--fw-space-5)",
  alignItems: "flex-start",
  padding: "var(--fw-space-6)",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-md)",
  background: "var(--fw-white)",
};

const certIconWrap = {
  width: "44px",
  height: "44px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "var(--fw-gray-100)",
  borderRadius: "var(--fw-radius-sm)",
  color: "var(--fw-navy)",
  flexShrink: 0,
};

const certTitle = {
  fontSize: "var(--fw-text-sm)",
  fontWeight: "var(--fw-weight-semibold)",
  color: "var(--fw-navy)",
  margin: "0 0 var(--fw-space-2)",
};

const certDesc = {
  fontSize: "var(--fw-text-xs)",
  color: "var(--fw-gray-500)",
  lineHeight: "var(--fw-leading-normal)",
  margin: "0 0 var(--fw-space-3)",
};

const certLink = {
  fontSize: "var(--fw-text-xs)",
  fontWeight: "var(--fw-weight-semibold)",
  color: "var(--fw-navy)",
  textDecoration: "none",
};

const certPending = {
  fontSize: "var(--fw-text-xs)",
  color: "var(--fw-gray-500)",
  fontStyle: "italic",
};

/* Locations */
const locGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "var(--fw-space-5)",
};

const locCard = {
  background: "var(--fw-white)",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-md)",
  padding: "var(--fw-space-7)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--fw-space-4)",
};

const locType = {
  fontSize: "var(--fw-text-xs)",
  fontWeight: "var(--fw-weight-semibold)",
  letterSpacing: "var(--fw-tracking-wide)",
  textTransform: "uppercase",
  color: "var(--fw-navy)",
  background: "var(--fw-gray-100)",
  padding: "3px 10px",
  borderRadius: "999px",
  alignSelf: "flex-start",
};

const locAddrRow = {
  display: "flex",
  gap: "var(--fw-space-3)",
  alignItems: "flex-start",
};

const locAddress = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-gray-700)",
  lineHeight: "var(--fw-leading-normal)",
  margin: 0,
};

const locDirBtn = {
  fontSize: "var(--fw-text-sm)",
  fontWeight: "var(--fw-weight-semibold)",
  color: "var(--fw-navy)",
  textDecoration: "none",
  alignSelf: "flex-start",
};

const locPending = {
  fontSize: "var(--fw-text-xs)",
  color: "var(--fw-gray-500)",
  fontStyle: "italic",
};

/* Brand Values */
const valuesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
  gap: "var(--fw-space-8)",
};

const valueItem = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--fw-space-3)",
};

const valueNo = {
  fontSize: "var(--fw-text-xs)",
  fontWeight: "var(--fw-weight-semibold)",
  letterSpacing: "var(--fw-tracking-wide)",
  color: "rgba(255,255,255,0.3)",
};

const valueTitle = {
  fontSize: "var(--fw-text-xl)",
  fontWeight: "var(--fw-weight-bold)",
  color: "var(--fw-white)",
  letterSpacing: "var(--fw-tracking-tight)",
  margin: 0,
};

const valueDesc = {
  fontSize: "var(--fw-text-sm)",
  color: "rgba(255,255,255,0.6)",
  lineHeight: "var(--fw-leading-normal)",
  margin: 0,
};

/* CTA */
const ctaInner = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "var(--fw-space-8)",
};
