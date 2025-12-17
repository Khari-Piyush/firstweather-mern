import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-col">
          <h3 className="footer-brand">First Weather Store</h3>
          <p className="footer-text">
            Trusted supplier of wiper systems, power window parts and
            auto spare components across India.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-col">
          <h4 className="footer-heading">Contact</h4>
          <p>📍 Delhi, India</p>
          <p>📞 +91 7428088039</p>
          <a
            href="https://wa.me/917428088039"
            target="_blank"
            rel="noreferrer"
            className="footer-whatsapp"
          >
            WhatsApp Enquiry
          </a>
        </div>

      </div>

      {/* ================= FOOTER ================= */}
      <footer style={footer}>
        © {new Date().getFullYear()} First Weather. All Rights Reserved.
      </footer>
    </footer>
  );
};

const footer = {
  background: "#020617",
  color: "white",
  textAlign: "center",
  padding: "1.5rem",
};
export default Footer;
