import { Link } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import "./Footer.css";
import logo from "../../public/fwlogowhite.webp";

const Footer = () => {
  return (
    <footer className="footer">
      {/* 🌧️ Rain Layer */}
      <div className="footer-rain">
        <span className="rain-drop r1"></span>
        <span className="rain-drop r2"></span>
        <span className="rain-drop r3"></span>
        <span className="rain-drop r4"></span>
        <span className="rain-drop r5"></span>
      </div>
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-col">
          <img src={logo} alt="First Weather Logo" style={logoStyle} />
          <p className="footer-text">
            Leading manufacturer & supplier of car wiper blades, wiper arms,
            wiper motor gears and auto electrical spare parts across India.
          </p>

          {/* SOCIAL ICONS */}
          <div className="footer-socials">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
              <FaFacebookF />
            </a>
            <a
              href="https://wa.me/917428088039"
              target="_blank"
              rel="noreferrer"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="footer-col">
          <h4 className="footer-heading">Contact Us</h4>
          <p><FaMapMarkerAlt /> Delhi, India</p>
          <p><FaPhoneAlt /> +91 7428088039</p>

          <a
            href="https://wa.me/917428088039"
            target="_blank"
            rel="noreferrer"
            className="footer-whatsapp"
          >
            <FaWhatsapp /> WhatsApp Enquiry
          </a>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} <strong>First Weather</strong>. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;


const logoStyle = { height: "50px" };
