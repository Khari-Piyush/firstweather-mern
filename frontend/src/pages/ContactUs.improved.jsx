import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import api from "../api.improved.js";
import { toast } from "react-toastify";
import {
  PageWrapper,
  Section,
  SectionLabel,
  SectionHeading,
} from "../components/Layout.improved.jsx";
import Reveal from "../components/Reveal.improved.jsx";

/* ── Context helpers ─────────────────────────────────────────────── */

const buildMessage = ({ productId, productName, category, type }) => {
  if (type === "catalog") {
    return `Hi, I'd like to request the full product catalog${category ? ` for ${category}` : ""
      }. Please send it to me.`;
  }
  if (type === "distributor") {
    return "Hi, I'm interested in becoming a First Weather distributor/dealer. Please share details on dealership opportunities, pricing and the onboarding process.";
  }
  if (productId) {
    return `Hi, I'm interested in ${productName || "this product"
      }. Please share the best price and availability.`;
  }
  if (category) {
    return `Hi, I'm looking for ${category} products. Please share pricing and availability.`;
  }
  return "";
};

const getPageHeading = ({ type }) => {
  if (type === "catalog") return "Request Full Catalog";
  if (type === "distributor") return "Become a Distributor";
  return "Get Best Price";
};

const getPageSubtitle = ({ productName, category, type }) => {
  if (type === "catalog" && category) return `For: ${category}`;
  if (type === "distributor") return "Tell us about your business — we'll get back within 24 hours.";
  if (productName) return productName;
  if (category) return `For: ${category}`;
  return "We respond to every inquiry within 24 hours.";
};

/* ── Page ────────────────────────────────────────────────────────── */

const ContactUs = () => {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "";
  const category = searchParams.get("category") || "";
  const productName = searchParams.get("productName") || "";

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: buildMessage({ productId, productName, category, type }),
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (typeof window.gtag === "function") {
      window.gtag("event", "enquiry_submit", {
        event_category: "engagement",
        event_label: "form_submit",
      });
    }
    setLoading(true);
    try {
      await api.post("/enquiry", form);
      toast.success("Message sent! We'll be in touch within 24 hours.");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send. Please try again or call us directly.");
    } finally {
      setLoading(false);
    }
  };

  const heading = getPageHeading({ type });
  const subtitle = getPageSubtitle({ productName, category, type });
  const submitLabel = loading
    ? "Sending…"
    : type === "catalog" ? "Request Catalog" : "Send Request";

  return (
    <PageWrapper>
      {/* ── Page header ──────────────────────────────────────────── */}
      <section style={pageHeader}>
        <div style={pageHeaderInner}>
          <SectionLabel light>
            {type === "catalog" ? "Product Catalog"
              : type === "distributor" ? "Partnership"
                : "Inquiry"}
          </SectionLabel>
          <h1 style={pageTitle}>{heading}</h1>
          <p style={pageSubtitle}>{subtitle}</p>
        </div>
      </section>

      {/* ── Two-column body ──────────────────────────────────────── */}
      <Reveal as={Section} bg="var(--fw-white)">
        <div style={twoCol}>

          {/* Contact info */}
          <aside>
            <SectionLabel>Contact Details</SectionLabel>
            <SectionHeading style={{ margin: "0 0 var(--fw-space-8)" }}>
              First Weather
            </SectionHeading>

            <div style={infoList}>
              <InfoRow label="Phone" value="+91 7428088039" />
              <InfoRow label="Email" value="firstweather16@gmail.com" />
              <InfoRow
                label="Office Address"
                value={"WP-406 B, Wazirpur Village,\nAshok Vihar, Delhi – 110052"}
              />
              <InfoRow
                label="Shop Address"
                value={"245/1A, Punja Sharif Market, Kashmere Gate, Delhi - 110006"}
              />
              <InfoRow
                label="Hours"
                value={"Mon – Sat: 9 AM – 6 PM\nSunday: Closed"}
              />
            </div>

            <iframe
              title="Office Location"
              src="https://www.google.com/maps?q=Ashok+Vihar+Delhi&output=embed"
              width="100%"
              height="180"
              style={{
                border: 0,
                borderRadius: "var(--fw-radius-md)",
                display: "block",
                marginTop: "var(--fw-space-10)",
              }}
              loading="lazy"
            />
          </aside>

          {/* Inquiry form */}
          <form onSubmit={handleSubmit} style={formCard} noValidate>
            <p style={formIntro}>
              Fill in the details and our team will contact you within 24 hours.
            </p>

            <Field
              label="Name"
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Field
              label="Phone"
              name="phone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
            />
            <Field
              as="textarea"
              label="Message"
              name="message"
              rows={5}
              placeholder="Tell us your requirement…"
              value={form.message}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              style={submitStyle(loading)}
            >
              {submitLabel}
            </button>
          </form>

        </div>
      </Reveal>
    </PageWrapper>
  );
};

export default ContactUs;

/* ── InfoRow ─────────────────────────────────────────────────────── */

const InfoRow = ({ label, value }) => (
  <div style={infoRow}>
    <span style={infoLabel}>{label}</span>
    <span style={infoValue}>{value}</span>
  </div>
);

/* ── Field ───────────────────────────────────────────────────────── */

const Field = ({ label, name, as, rows, ...rest }) => {
  const El = as === "textarea" ? "textarea" : "input";
  return (
    <div style={fieldWrap}>
      <label htmlFor={name} style={fieldLabel}>{label}</label>
      <El
        id={name}
        name={name}
        rows={rows}
        style={as === "textarea"
          ? { ...fieldInput, resize: "vertical", minHeight: "100px" }
          : fieldInput}
        {...rest}
      />
    </div>
  );
};

/* ── Styles ──────────────────────────────────────────────────────── */

const pageHeader = {
  background: "var(--fw-navy)",
  padding: "var(--fw-space-20) var(--fw-section-px)",
};

const pageHeaderInner = {
  maxWidth: "var(--fw-container)",
  margin: "0 auto",
};

const pageTitle = {
  fontSize: "clamp(var(--fw-text-3xl), 5vw, var(--fw-text-5xl))",
  fontWeight: "var(--fw-weight-bold)",
  letterSpacing: "var(--fw-tracking-tight)",
  lineHeight: "var(--fw-leading-tight)",
  color: "var(--fw-white)",
  margin: "0 0 var(--fw-space-3)",
};

const pageSubtitle = {
  fontSize: "var(--fw-text-base)",
  color: "rgba(255,255,255,0.65)",
  margin: 0,
};

const twoCol = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "var(--fw-space-12)",
  alignItems: "start",
};

const infoList = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--fw-space-6)",
};

const infoRow = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--fw-space-1)",
};

const infoLabel = {
  fontSize: "var(--fw-text-xs)",
  fontWeight: "var(--fw-weight-semibold)",
  letterSpacing: "var(--fw-tracking-wide)",
  textTransform: "uppercase",
  color: "var(--fw-gray-500)",
};

const infoValue = {
  fontSize: "var(--fw-text-base)",
  color: "var(--fw-navy)",
  whiteSpace: "pre-line",
};

const formCard = {
  background: "var(--fw-surface-alt)",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-lg)",
  padding: "var(--fw-space-10)",
  display: "flex",
  flexDirection: "column",
  gap: "var(--fw-space-5)",
};

const formIntro = {
  fontSize: "var(--fw-text-sm)",
  color: "var(--fw-gray-500)",
  margin: 0,
};

const fieldWrap = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--fw-space-2)",
};

const fieldLabel = {
  fontSize: "var(--fw-text-sm)",
  fontWeight: "var(--fw-weight-semibold)",
  color: "var(--fw-navy)",
};

const fieldInput = {
  width: "100%",
  padding: "var(--fw-space-3) var(--fw-space-4)",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-sm)",
  fontSize: "var(--fw-text-base)",
  fontFamily: "var(--fw-font)",
  color: "var(--fw-navy)",
  background: "var(--fw-white)",
  boxSizing: "border-box",
};

const submitStyle = (loading) => ({
  display: "block",
  width: "100%",
  minHeight: "var(--fw-tap)",
  padding: "0 var(--fw-space-8)",
  background: "var(--fw-navy)",
  color: "var(--fw-white)",
  border: "none",
  borderRadius: "var(--fw-radius-sm)",
  fontSize: "var(--fw-text-sm)",
  fontWeight: "var(--fw-weight-semibold)",
  fontFamily: "var(--fw-font)",
  letterSpacing: "var(--fw-tracking-wide)",
  textTransform: "uppercase",
  cursor: loading ? "not-allowed" : "pointer",
  opacity: loading ? 0.65 : 1,
});
