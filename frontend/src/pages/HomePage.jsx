import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FaStar, FaUserCircle, FaQuoteLeft } from "react-icons/fa";
import { FaCalendarAlt, FaBriefcase, FaUserCheck } from "react-icons/fa";
import bgImage from "/bg-image.png";

import wiperArm from "/fw-wiper-arm.png";
import wiperBlade from "/fw-wiper-blade.png";
import wiperLinkage from "/fw-wiper-linkage.png";
import wiperGear from "/fw-gear.png";
import testimonials from "../data/testimonial";
import heroImage from "/hero-wiper-collage.png";

import tata from "/brands/tata.png";
import hyundai from "/brands/hyundai.png";
import mahindra from "/brands/mahindra.png";
import ashoka from "/brands/ashok-leyland.png";
import ford from "/brands/ford.png";
import eicher from "/brands/eicher.png";
import volvo from "/brands/volvo.png"
import toyota from "/brands/toyota.png";
import maruti from "/brands/maruti.png";
import force from "/brands/force.png";
import piaggio from "/brands/piaggo.png";
import sml from "/brands/sml.png";


const brands = [
  { name: "Tata", logo: tata },
  { name: "Hyundai", logo: hyundai },
  { name: "Mahindra", logo: mahindra },
  { name: "Ashok Leyland", logo: ashoka },
  { name: "Eicher", logo: eicher },
  { name: "Volvo", logo: volvo },
  { name: "Toyota", logo: toyota },
  { name: "Maruti", logo: maruti },
  { name: "Force", logo: force },
  { name: "Ford", logo: ford },
  { name: "Piaggio", logo: piaggio },
  { name: "SML", logo: sml },
];


const HomePage = () => {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 100);
  }, []);

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
    <div style={{
      opacity: pageLoaded ? 1 : 0,
      transform: pageLoaded ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.6s ease",
    }}>
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
            <Link
              to="/products"
              style={primaryBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1e88e5";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(30,136,229,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#ffffff";
                e.currentTarget.style.color = "#0f2a44";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              View Products
            </Link>

            <a
              href="https://wa.me/917428088039"
              target="_blank"
              rel="noreferrer"
              style={secondaryBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#25D366";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(37,211,102,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#25D366";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
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
          <StatBox
            value="2005"
            label="Established"
            icon={<FaCalendarAlt />}
            isMobile={isMobile}
          />

          <StatBox
            value="20+"
            label="Years Experience"
            icon={<FaBriefcase />}
            isMobile={isMobile}
          />

          <StatBox
            value="98%"
            label="Customer Retention"
            icon={<FaUserCheck />}
            isMobile={isMobile}
          />
        </div>
      </section>


      {/* ================= PRODUCT RANGE (GRID LIKE IMAGE) ================= */}
      <section style={{ background: "#fff" }}>
        <div style={container}>
          <h2 style={productTitle}>Our Product Range</h2>
          <p style={productSubtitle}>Have a look on our products</p>

          <div style={productGrid}>
            <ProductRangeCard
              img={wiperArm}
              title="Wiper Arm"
              category="wiper-arm"
              desc="We sell a wide range of Wiper Arms like Bayonet, Hook Type, Double Pipe and many more."
            />

            <ProductRangeCard
              img={wiperBlade}
              title="Wiper Blade"
              category="wiper-blade"
              desc="Our range of Wiper Blades includes imported U-Hook, Soft ( Frameless Blades) and Hybrid Blades."
            />

            <ProductRangeCard
              img={wiperLinkage}
              title="Wiper Linkage Assembly"
              category="wiper-linkage"
              desc="We offer a comprehensive solution for Wiper Linkage Assembly used in the automobile industry."
            />

            <ProductRangeCard
              img={wiperGear}
              title="Wiper Motor Gear"
              category="wiper-motor-gear"
              desc="We offer wide variety of wiper motor gear with best quality."
            />

          </div>

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link to="/products"
              style={viewAllBtn}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#1e88e5";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(30,136,229,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#140a7bff";
                e.currentTarget.style.color = "#ffffff";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}>
              View All Products
            </Link>
          </div>
        </div>
      </section>


      {/* ================= VEHICLE BRANDS (BLUE THEME) ================= */}
      <section style={brandSection}>
        <div style={brandOverlay}></div>

        <div style={brandContainer}>
          <h2 style={brandTitle}>
            Complete Range of Commercial and Passenger Vehicles
          </h2>
          <p style={brandSubtitle}>Have a look on our products</p>

          <div style={brandDivider}></div>

          <div style={brandGrid}>
            {brands.map((b, i) => (
              <div
                key={i}
                style={brandCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#4da3ff";
                  e.currentTarget.style.background = "rgba(77,163,255,0.08)";
                  e.currentTarget.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <img src={b.logo} alt={b.name} style={brandLogo} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section style={testimonialSection}>
        <div style={container}>
          <h2 style={testimonialTitle}>Customer Testimonials</h2>

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
                    {/* Quote */}
                    <FaQuoteLeft style={quoteIcon} />

                    {/* Stars */}
                    <div style={testimonialStars}>
                      {[...Array(t.rating)].map((_, idx) => (
                        <FaStar key={idx} />
                      ))}
                    </div>

                    {/* Text */}
                    <p style={testimonialText}>“{t.text}”</p>

                    {/* User */}
                    <div style={testimonialUser}>
                      <FaUserCircle style={userIcon} />
                      <span>{t.name}</span>
                    </div>
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
const StatBox = ({ value, label, icon, isMobile }) => {
  return (
    <div style={statCard}>
      {/* ICON */}
      <div style={iconStyle}>{icon}</div>

      {/* NUMBER */}
      <div
        style={{
          ...statNumber,
          fontSize: isMobile ? "28px" : "32px",
        }}
      >
        {value}
      </div>

      {/* LABEL */}
      <div style={statLabel}>{label}</div>
    </div>
  );
};

const ProductRangeCard = ({ img, title, desc, category }) => {
  return (
    <div
      style={rangeCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 14px 30px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
      }}
    >
      <img src={img} alt={title} style={rangeImg} loading="lazy" />

      <h3 style={rangeTitle}>{title}</h3>
      <p style={rangeDesc}>{desc}</p>

      {/* ✅ CATEGORY BASED REDIRECT */}
      <Link
        to={`/products?category=${category}`}
        style={rangeBtn}
      >
        View Product
      </Link>
    </div>
  );
};



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
  background: "#ffffff",
  color: "#0f2a44",
  padding: "12px 26px",
  borderRadius: "6px",
  border: "2px solid transparent",
  textDecoration: "none",
  fontWeight: "600",
  transition: "all 0.35s ease",
};


const secondaryBtn = {
  background: "transparent",
  border: "2px solid #25D366",
  color: "#25D366",
  padding: "12px 26px",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "600",
  transition: "all 0.35s ease",
};

const iconStyle = {
  fontSize: "28px",
  color: "#1e88e5",
  marginBottom: "6px",
};


const statsSection = {
  background:
    "linear-gradient(135deg, rgba(10,40,80,0.92), rgba(15,70,130,0.85))",
  // background: "linear-gradient(135deg, #13325cff, #102e52)",
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
  color: "#fff",
};

const statLabel = { color: "#dbeafe", fontSize: "14px" };

const sectionTitle = {
  textAlign: "center",
  marginBottom: "2.5rem",
  color: "#0f2a44",
};

const productTitle = {
  textAlign: "center",
  fontSize: "2.2rem",
  marginBottom: "0.4rem",
};

const productSubtitle = {
  textAlign: "center",
  color: "#6b7280",
  marginBottom: "2.5rem",
};

const productGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "2rem",
};

const rangeCard = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "1.5rem",
  transition: "all 0.35s ease",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
};

const rangeImg = {
  width: "100%",
  height: "180px",
  objectFit: "contain",
  marginBottom: "1rem",
};

const rangeTitle = {
  fontSize: "1.2rem",
  marginBottom: "0.6rem",
};

const rangeDesc = {
  fontSize: "0.95rem",
  color: "#4b5563",
  lineHeight: 1.5,
  marginBottom: "0.8rem",
};


const rangeBtn = {
  display: "inline-block",
  background: "#0f2a44",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: "6px",
  textDecoration: "none",
  fontSize: "0.9rem",
  transition: "all 0.35s ease",
};

const viewAllBtn = {
  background: "#120750ff",
  borderRadius: "6px",
  border: "2px solid transparent",
  transition: "all 0.35s ease",
  color: "#fff",
  padding: "12px 30px",
  textDecoration: "none",
  fontWeight: "600",
};

const brandSection = {
  position: "relative",
  padding: "5rem 1.5rem",
  backgroundSize: "cover",
  backgroundImage: `url(${bgImage})`,
  backgroundPosition: "center",
};

const brandOverlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(135deg, rgba(10,40,80,0.92), rgba(15,70,130,0.85))",
};

const brandContainer = {
  position: "relative",
  maxWidth: "1200px",
  margin: "auto",
  textAlign: "center",
  color: "#fff",
};

const brandTitle = {
  fontSize: "2.3rem",
  fontWeight: "700",
  marginBottom: "0.6rem",
};

const brandSubtitle = {
  color: "#cfe6ff",
  marginBottom: "1.2rem",
};

const brandDivider = {
  width: "140px",
  height: "3px",
  background: "#4da3ff",
  margin: "0 auto 3rem",
};

const brandGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "1.8rem",
};

const brandCard = {
  border: "1px solid rgba(255,255,255,0.25)",
  padding: "1.6rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.35s ease",
  background: "rgba(255,255,255,0.03)",
  backdropFilter: "blur(4px)",
};

const brandLogo = {
  maxWidth: "110px",
  maxHeight: "60px",
  filter: "brightness(0) invert(1)",
  opacity: 0.85,
};

const testimonialSection = {
  background: "#f8fafc",
};

const testimonialTitle = {
  textAlign: "center",
  marginBottom: "2.5rem",
  color: "#0f2a44",
};

const testimonialBox = {
  overflow: "hidden",
};

const testimonialTrack = {
  display: "flex",
  transition: "0.6s ease",
};

const testimonialSlide = {
  minWidth: "100%",
  display: "flex",
  justifyContent: "center",
};

const testimonialCard = {
  background: "linear-gradient(135deg, #0f2a44, #123b66)",
  padding: "2.5rem 2rem",
  maxWidth: "560px",
  textAlign: "center",
  borderRadius: "14px",
  color: "#fff",
  position: "relative",
  boxShadow: "0 15px 40px rgba(15,42,68,0.35)",
};

const testimonialStars = {
  color: "#facc15",
  marginBottom: "1rem",
};

const testimonialText = {
  color: "#e0f2fe",
  lineHeight: 1.6,
  fontSize: "1rem",
  marginBottom: "1.4rem",
};

const testimonialUser = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  fontWeight: "600",
};

const userIcon = {
  fontSize: "28px",
  color: "#4da3ff",
};

const quoteIcon = {
  position: "absolute",
  top: "18px",
  left: "18px",
  fontSize: "28px",
  color: "rgba(77,163,255,0.25)",
};



export default HomePage;
