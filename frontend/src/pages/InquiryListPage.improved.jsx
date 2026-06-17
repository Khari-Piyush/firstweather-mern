import { useState } from "react";
import { Link } from "react-router-dom";
import { FaClipboardList, FaTrash, FaMinus, FaPlus, FaCheckCircle, FaWhatsapp } from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../api.improved.js";
import { useInquiryCart } from "../contexts/InquiryCartContext.improved.jsx";
import { PrimaryButton, SecondaryButton } from "../components/Button.improved.jsx";
import {
  PageWrapper,
  Section,
  SectionLabel,
  PageHeading,
  BodyText,
} from "../components/Layout.improved.jsx";
import "./InquiryListPage.improved.css";

const optimizeImg = (url) =>
  url ? url.replace("/upload/", "/upload/w_200,f_auto,q_auto/") : null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = {
  name: "",
  company: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  notes: "",
};

const InquiryListPage = () => {
  const { items, itemCount, updateQty, removeItem, clearCart } = useInquiryCart();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { inquiryId } on success

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => (er[name] ? { ...er, [name]: undefined } : er));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!EMAIL_RE.test(form.email.trim())) next.email = "Enter a valid email";
    if (!form.phone.trim()) next.phone = "Phone is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post("/inquiries", {
        customer: {
          name: form.name.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          country: form.country.trim(),
        },
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        notes: form.notes.trim(),
      });

      // Fire analytics in its own guard — a gtag throw must NOT fall into the
      // catch block below and show an error toast on a successful save.
      try {
        if (typeof window.gtag === "function") {
          window.gtag("event", "inquiry_submit", {
            event_category: "engagement",
            event_label: "inquiry_form_submit",
            value: itemCount,
          });
        }
      } catch (_) { /* analytics errors are non-fatal */ }

      const inquiryId = res.data?.inquiryId;
      const whatsappUrl = res.data?.whatsappUrl;

      // Immediate feedback — visible before the full success screen renders
      toast.success(
        inquiryId
          ? `Inquiry ${inquiryId} received! We'll be in touch within 24 hours.`
          : "Inquiry received! We'll be in touch within 24 hours."
      );

      setResult({ inquiryId, whatsappUrl });
      clearCart();
      setForm(EMPTY_FORM);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const message = err.response?.data?.message || "Failed to submit inquiry. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <PageWrapper>
        <Section bg="var(--fw-white)">
          <div className="fw-inquiry-success">
            <FaCheckCircle aria-hidden="true" />
            <h2 className="fw-inquiry-success__title">Inquiry Submitted</h2>
            <p className="fw-inquiry-success__id">{result.inquiryId}</p>
            <p className="fw-inquiry-success__text">
              Thank you! Our team has received your request and will get back
              to you within 24 hours with pricing and availability. A
              confirmation email with your Inquiry ID has been sent to you.
            </p>
            {result.whatsappUrl && (
              <p className="fw-inquiry-success__text">
                Want a faster response? Send us your inquiry details on
                WhatsApp too.
              </p>
            )}
            <div className="fw-inquiry-list__actions">
              <PrimaryButton to="/products">Continue Browsing</PrimaryButton>
              <SecondaryButton to="/">Back to Home</SecondaryButton>
              {result.whatsappUrl && (
                <a
                  href={result.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fw-btn fw-inquiry-success__whatsapp"
                >
                  <FaWhatsapp aria-hidden="true" />
                  Notify us on WhatsApp
                </a>
              )}
            </div>
          </div>
        </Section>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Section bg="var(--fw-white)">
        <SectionLabel>Request Quote List</SectionLabel>
        <PageHeading style={{ marginBottom: "var(--fw-space-3)" }}>
          Your Inquiry List
        </PageHeading>
        <BodyText style={{ maxWidth: "60ch" }}>
          Review the products you're interested in below. No prices are
          shown here &mdash; our team will get back to you with the best
          price for your selection.
        </BodyText>

        {items.length === 0 ? (
          <div className="fw-inquiry-list__empty">
            <FaClipboardList aria-hidden="true" />
            <p>Your inquiry list is empty.</p>
            <PrimaryButton to="/products">Browse Products</PrimaryButton>
          </div>
        ) : (
          <>
            <div className="fw-inquiry-list__items">
              {items.map((item) => (
                <div className="fw-inquiry-list__item" key={item.productId}>
                  <div className="fw-inquiry-list__item-main">
                    <img
                      className="fw-inquiry-list__item-img"
                      src={optimizeImg(item.imageUrl) || "/fw-logo-blue.webp"}
                      alt={item.name}
                      loading="lazy"
                    />

                    <div className="fw-inquiry-list__item-info">
                      <Link to={`/products/${item.productId}`} className="fw-inquiry-list__item-name">
                        {item.name}
                      </Link>
                      {(item.code || item.category) && (
                        <p className="fw-inquiry-list__item-meta">
                          {[item.code, item.category].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      <p className="fw-inquiry-list__item-price">Price on request</p>
                    </div>
                  </div>

                  <div className="fw-inquiry-list__item-actions">
                    <div className="fw-inquiry-list__qty">
                      <button
                        type="button"
                        className="fw-inquiry-list__qty-btn"
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label={`Decrease quantity of ${item.name}`}
                      >
                        <FaMinus />
                      </button>
                      <span className="fw-inquiry-list__qty-value">{item.qty}</span>
                      <button
                        type="button"
                        className="fw-inquiry-list__qty-btn"
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                      >
                        <FaPlus />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="fw-inquiry-list__remove"
                      onClick={() => removeItem(item.productId)}
                      aria-label={`Remove ${item.name} from inquiry list`}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="fw-inquiry-list__footer">
              <p className="fw-inquiry-list__count">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your list
              </p>
              <div className="fw-inquiry-list__actions">
                <SecondaryButton onClick={clearCart}>Clear All</SecondaryButton>
                <PrimaryButton to="/products">Add More Products</PrimaryButton>
              </div>
            </div>

            {/* ── Submit Inquiry form ─────────────────────────────── */}
            <form className="fw-inquiry-form" onSubmit={handleSubmit} noValidate>
              <SectionLabel>Request a Quote</SectionLabel>
              <h2 className="fw-inquiry-form__heading">Tell us how to reach you</h2>
              <p className="fw-inquiry-form__intro">
                Share your details below and our team will respond with
                pricing and availability for everything in your list.
              </p>

              <div className="fw-inquiry-form__row">
                <FormField
                  label="Name"
                  name="name"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                />
                <FormField
                  label="Company"
                  name="company"
                  placeholder="Company name (optional)"
                  value={form.company}
                  onChange={handleChange}
                />
              </div>

              <div className="fw-inquiry-form__row">
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />
                <FormField
                  label="Phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={form.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  required
                />
              </div>

              <div className="fw-inquiry-form__row">
                <FormField
                  label="City"
                  name="city"
                  placeholder="City (optional)"
                  value={form.city}
                  onChange={handleChange}
                />
                <FormField
                  label="Country"
                  name="country"
                  placeholder="Country (optional)"
                  value={form.country}
                  onChange={handleChange}
                />
              </div>

              <FormField
                as="textarea"
                label="Notes"
                name="notes"
                rows={4}
                placeholder="Any additional details about your requirement (optional)"
                value={form.notes}
                onChange={handleChange}
              />

              <button type="submit" className="fw-inquiry-form__submit" disabled={loading}>
                {loading ? "Submitting…" : "Submit Inquiry"}
              </button>
            </form>
          </>
        )}
      </Section>
    </PageWrapper>
  );
};

export default InquiryListPage;

/* ── FormField ───────────────────────────────────────────────────── */

const FormField = ({ label, name, as, rows, error, required, ...rest }) => {
  const El = as === "textarea" ? "textarea" : "input";
  return (
    <div className="fw-inquiry-form__field">
      <label htmlFor={name} className="fw-inquiry-form__label">
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      <El
        id={name}
        name={name}
        rows={rows}
        className={`fw-inquiry-form__input${as === "textarea" ? " fw-inquiry-form__input--textarea" : ""}${error ? " fw-inquiry-form__input--error" : ""}`}
        aria-invalid={error ? "true" : undefined}
        {...rest}
      />
      {error && <p className="fw-inquiry-form__error">{error}</p>}
    </div>
  );
};
