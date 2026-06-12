import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api.improved";
import { Section, SectionLabel, SectionHeading } from "../components/Layout.improved.jsx";
import MeteorBackground from "../components/MeteorBackground.improved.jsx";
import "./TestimonialsSection.improved.css";

/* ── useInView ────────────────────────────────────────────────────
   Fires once when the element scrolls into view. Skips the
   animation entirely under prefers-reduced-motion.
────────────────────────────────────────────────────────────────── */

const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

/* ── StarIcon ─────────────────────────────────────────────────────  */

const StarIcon = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "var(--fw-navy)" : "var(--fw-gray-300)"}>
    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279L12 19.771l-7.416 3.642 1.48-8.279L0 9.306l8.332-1.151z" />
  </svg>
);

/* ── TestimonialCard ──────────────────────────────────────────────  */

const TestimonialCard = ({ testimonial }) => {
  const [ref, inView] = useInView();
  const meta = [testimonial.location, testimonial.vehicle].filter(Boolean).join(" · ");

  return (
    <div
      ref={ref}
      className={`fw-fade-in${inView ? " fw-fade-in--visible" : ""}`}
      style={card}
    >
      <div style={starsRow}>
        {[1, 2, 3, 4, 5].map((n) => (
          <StarIcon key={n} filled={n <= testimonial.rating} />
        ))}
      </div>

      <p style={quote}>&ldquo;{testimonial.text}&rdquo;</p>

      <div style={cardFooter}>
        <p style={name}>{testimonial.customerName}</p>
        {meta && <p style={subMeta}>{meta}</p>}
        {testimonial.source && <p style={source}>via {testimonial.source}</p>}
      </div>
    </div>
  );
};

/* ── SkeletonCard ─────────────────────────────────────────────────  */

const SkeletonCard = () => (
  <div style={{ ...card, opacity: 0.55 }} aria-hidden="true">
    <div style={skeletonStarsRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <div key={n} style={skeletonStar} />
      ))}
    </div>

    <div style={{ ...skeletonLine, width: "100%" }} />
    <div style={{ ...skeletonLine, width: "92%" }} />
    <div style={{ ...skeletonLine, width: "70%", marginBottom: "var(--fw-space-6)" }} />

    <div style={cardFooter}>
      <div style={{ ...skeletonLine, width: "40%" }} />
      <div style={{ ...skeletonLine, width: "55%", height: "10px", marginTop: "var(--fw-space-1)", marginBottom: 0 }} />
    </div>
  </div>
);

/* ── TestimonialsSection ──────────────────────────────────────────  */

const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    api
      .get("/testimonials?limit=6")
      .then((res) => {
        if (!cancelled) setTestimonials(res.data);
      })
      .catch((err) => {
        console.error("Failed to load testimonials:", err);
        if (!cancelled) setTestimonials([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section style={{ position: "relative", overflow: "hidden" }}>
      <MeteorBackground variant="onLight">
        <div style={{ textAlign: "center", marginBottom: "var(--fw-space-12)" }}>
          <SectionLabel>Customer Feedback</SectionLabel>
          <SectionHeading style={{ margin: "0 auto" }}>
            What Our Customers Say
          </SectionHeading>
        </div>

        {loading && (
          <div style={grid}>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && testimonials.length === 0 && (
          <p style={emptyText}>
            Customer reviews are coming soon. In the meantime,{" "}
            <Link to="/contact" style={emptyLink}>get in touch</Link>{" "}
            to share your experience with First Weather products.
          </p>
        )}

        {!loading && testimonials.length > 0 && (
          <div style={grid}>
            {testimonials.map((t) => (
              <TestimonialCard key={t._id} testimonial={t} />
            ))}
          </div>
        )}
      </MeteorBackground>
    </Section>
  );
};

export default TestimonialsSection;

/* ── Styles ───────────────────────────────────────────────────────  */

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "var(--fw-space-6)",
};

const card = {
  display: "flex",
  flexDirection: "column",
  padding: "var(--fw-space-6)",
  background: "var(--fw-white)",
  border: "1px solid var(--fw-gray-300)",
  borderRadius: "var(--fw-radius-md)",
  boxShadow: "var(--fw-shadow-sm)",
};

const starsRow = {
  display: "flex",
  gap: "var(--fw-space-1)",
  marginBottom: "var(--fw-space-4)",
};

const quote = {
  fontSize: "var(--fw-text-base)",
  lineHeight: "var(--fw-leading-normal)",
  color: "var(--fw-gray-700)",
  margin: "0 0 var(--fw-space-6)",
  flex: 1,
};

const cardFooter = {
  borderTop: "1px solid var(--fw-gray-300)",
  paddingTop: "var(--fw-space-4)",
};

const name = {
  fontSize: "var(--fw-text-sm)",
  fontWeight: "var(--fw-weight-semibold)",
  color: "var(--fw-navy)",
  margin: "0",
};

const subMeta = {
  fontSize: "var(--fw-text-xs)",
  color: "var(--fw-gray-500)",
  margin: "var(--fw-space-1) 0 0",
};

const source = {
  fontSize: "var(--fw-text-xs)",
  color: "var(--fw-gray-500)",
  letterSpacing: "var(--fw-tracking-wide)",
  textTransform: "uppercase",
  margin: "var(--fw-space-1) 0 0",
};

const skeletonStarsRow = {
  display: "flex",
  gap: "var(--fw-space-1)",
  marginBottom: "var(--fw-space-4)",
};

const skeletonStar = {
  width: "16px",
  height: "16px",
  borderRadius: "3px",
  background: "var(--fw-gray-300)",
};

const skeletonLine = {
  height: "12px",
  background: "var(--fw-gray-300)",
  borderRadius: "4px",
  margin: "0 0 var(--fw-space-2)",
};

const emptyText = {
  textAlign: "center",
  fontSize: "var(--fw-text-base)",
  lineHeight: "var(--fw-leading-normal)",
  color: "var(--fw-gray-500)",
  maxWidth: "520px",
  margin: "0 auto",
};

const emptyLink = {
  color: "var(--fw-navy-mid)",
  fontWeight: "var(--fw-weight-semibold)",
  textDecoration: "underline",
};
