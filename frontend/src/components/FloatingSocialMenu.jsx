import { useState } from "react";
import {
  FaShareAlt,
  FaWhatsapp,
  FaPhoneAlt,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";

const FloatingSocialMenu = () => {
  const [open, setOpen] = useState(false);
  const phone = "917428088039";

  return (
    <div style={wrapper}>
      {/* CHILD BUTTONS */}
      <div
        style={{
          ...childWrapper,
          transform: open ? "translateY(0)" : "translateY(20px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      >
        <a
          href={`https://wa.me/${phone}`}
          style={{ ...childBtn, background: "#25D366" }}
          aria-label="WhatsApp"
        >
          <FaWhatsapp />
        </a>

        <a
          href={`tel:+${phone}`}
          style={{ ...childBtn, background: "#1e88e5" }}
          aria-label="Call"
        >
          <FaPhoneAlt />
        </a>

        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noreferrer"
          style={{
            ...childBtn,
            background:
              "radial-gradient(circle at 30% 110%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
          }}
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>

        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noreferrer"
          style={{ ...childBtn, background: "#1877F2" }}
          aria-label="Facebook"
        >
          <FaFacebookF />
        </a>
      </div>

      {/* MAIN BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          ...mainBtn,
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
        }}
        aria-label="Open social menu"
      >
        <FaShareAlt />
      </button>
    </div>
  );
};

export default FloatingSocialMenu;

const wrapper = {
  position: "fixed",
  right: "22px",
  bottom: "22px",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const mainBtn = {
  width: "62px",
  height: "62px",
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
  background: "linear-gradient(135deg, #1e88e5, #0f2a44)",
  color: "#fff",
  fontSize: "22px",
  boxShadow: "0 12px 30px rgba(30,136,229,0.45)",
  transition: "all 0.4s ease",
};

const childWrapper = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  marginBottom: "14px",
  transition: "all 0.45s cubic-bezier(.68,-0.55,.27,1.55)",
};

const childBtn = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  boxShadow: "0 8px 22px rgba(0,0,0,0.25)",
  textDecoration: "none",
};
