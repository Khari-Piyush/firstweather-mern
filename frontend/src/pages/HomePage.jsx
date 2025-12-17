import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaStar, FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

import wiperArm from "../assets/fw-wiper-arm.png";
import wiperBlade from "../assets/fw-wiper-blade.png";
import wiperLinkage from "../assets/fw-wiper-linkage.png";
import wiperGear from "../assets/fw-gear.png";
import wiperWheelBox from "../assets/fw-wiper-wheelbox.png";
import wiperRods from "../assets/fw-rods.png";
import testimonials from "../data/testimonial";
import heroImage from "../assets/hero-wiper-collage.png";

const HomePage = () => {
  const sliderRef = useRef(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  /* RESPONSIVE CHECK */
  useEffect(() => {
    const resize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* PRODUCT SLIDER */
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;

    let scroll = 0;
    const timer = setInterval(() => {
      scroll += 320;
      if (scroll >= el.scrollWidth - el.clientWidth) scroll = 0;
      el.scrollTo({ left: scroll, behavior: "smooth" });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  /* TESTIMONIAL */
  useEffect(() => {
    const t = setInterval(() => {
      setTestimonialIndex((p) => (p + 1) % testimonials.length);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* ================= HERO ================= */}
      <section style={heroSection}>
        <div style={overlay}></div>

        <div style={heroContent}>
          <h1 style={heroTitle}>
            First Weather – Auto Electrical <br />
            & Wiper Parts in India
          </h1>

          <p style={heroText}>
            Leading manufacturer & supplier of auto electrical and wiper spare
            parts across India.
          </p>

          <div style={heroBtns}>
            <Link to="/products" style={primaryBtn}>View Products</Link>
            <a
              href="https://wa.me/917428088039"
              target="_blank"
              rel="noreferrer"
              style={secondaryBtn}
            >
              WhatsApp Enquiry
            </a>
          </div>
        </div>
      </section>

      {/* ================= STATS (MINIMAL) ================= */}
      <section style={statsSection}>
        <div
          style={{
            ...statsContainer,
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)",
          }}
        >
          <StatBox value="2005" label="Established" isMobile={isMobile} />
          <StatBox value="20+" label="Years Experience" isMobile={isMobile} />
          <StatBox value="98%" label="Customer Retention" isMobile={isMobile} />
        </div>
      </section>

      {/* ================= PRODUCT RANGE ================= */}
      <section>
        <div style={container}>
          <h2 style={sectionTitle}>Product Range</h2>
          <div ref={sliderRef} style={productSlider}>
            <ProductCard title="Wiper Arm" img={wiperArm} />
            <ProductCard title="Wiper Blade" img={wiperBlade} />
            <ProductCard title="Wiper Linkage" img={wiperLinkage} />
            <ProductCard title="Wiper Gear" img={wiperGear} />
            <ProductCard title="Wheel Box" img={wiperWheelBox} />
            <ProductCard title="Wiper Rods" img={wiperRods} />
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIAL ================= */}
      <section style={{ background: "#f8fafc" }}>
        <div style={container}>
          <h2 style={sectionTitle}>Customer Reviews</h2>

          <div style={testimonialBox}>
            <div
              style={{
                ...testimonialTrack,
                transform: `translateX(-${testimonialIndex * 100}%)`,
              }}
            >
              {testimonials.map((t, i) => (
                <div key={i} style={testimonialSlide}>
                  <div style={testimonialCard}>
                    <div style={{ color: "#facc15" }}>
                      {[...Array(t.rating)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <p>“{t.text}”</p>
                    <strong>{t.name}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatBox = ({ value, label, isMobile }) => (
  <div
    style={{
      ...statCard,
      borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.15)",
      borderBottom: isMobile ? "1px solid rgba(255,255,255,0.15)" : "none",
    }}
  >
    <h2 style={statNumber}>{value}</h2>
    <p style={statLabel}>{label}</p>
  </div>
);

const ProductCard = ({ title, img }) => (
  <div style={productCard}>
    <img src={img} alt={title} style={productImg} />
    <div style={productLabel}>{title}</div>
  </div>
);

/* ================= STYLES ================= */

const container = { maxWidth: "1200px", margin: "auto", padding: "3rem 1.5rem" };

const heroSection = {
  position: "relative",
  minHeight: "85vh",
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
  background:
    "linear-gradient(90deg, rgba(15,42,68,0.85), rgba(15,42,68,0.35))",
};

const heroContent = {
  position: "relative",
  maxWidth: "1200px",
  padding: "4rem 1.5rem",
  color: "#fff",
};

const heroTitle = { fontSize: "2.6rem", lineHeight: 1.2, maxWidth: "650px" };
const heroText = { margin: "1.2rem 0 2.2rem", maxWidth: "520px" };
const heroBtns = { display: "flex", gap: "1rem", flexWrap: "wrap" };

const primaryBtn = {
  background: "#fff",
  color: "#0f2a44",
  padding: "12px 26px",
  border: "none",
  textDecoration: "none",
};

const secondaryBtn = {
  background: "transparent",
  border: "2px solid #fff",
  color: "#fff",
  padding: "12px 26px",
  textDecoration: "none",
};

const statsSection = {
  background: "linear-gradient(135deg, #0b1f3a, #102e52)",
  padding: "40px 0",
};

const statsContainer = {
  maxWidth: "1000px",
  margin: "auto",
  display: "grid",
};

const statCard = {
  textAlign: "center",
  padding: "1.5rem 1rem",
};

const statNumber = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#4da3ff",
};

const statLabel = { color: "#dbeafe", fontSize: "14px" };

const sectionTitle = {
  textAlign: "center",
  marginBottom: "2.5rem",
  color: "#0f2a44",
};

const productSlider = { display: "flex", gap: "2rem", overflowX: "auto" };
const productCard = { minWidth: "300px", border: "1px solid #e5e7eb" };
const productImg = { width: "100%", height: "220px", objectFit: "contain" };
const productLabel = {
  padding: "1rem",
  background: "#0f2a44",
  color: "white",
  textAlign: "center",
};

const testimonialBox = { overflow: "hidden" };
const testimonialTrack = { display: "flex", transition: "0.6s ease" };
const testimonialSlide = { minWidth: "100%", display: "flex", justifyContent: "center" };
const testimonialCard = {
  background: "white",
  padding: "2rem",
  maxWidth: "520px",
  textAlign: "center",
  border: "1px solid #e5e7eb",
};

export default HomePage;
