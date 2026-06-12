import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import logo from "../../public/fw-logo-blue.webp";
import "./Footer.improved.css";

// Same routes/order as the navbar's public nav
const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

// Only platforms First Weather actually has a presence on
const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/firstweatherwipers/", icon: FaInstagram },
  { label: "Facebook", href: "https://www.facebook.com/firstweatherwipers", icon: FaFacebookF },
  { label: "WhatsApp", href: "https://wa.me/917428088039", icon: FaWhatsapp },
];

const Footer = () => (
  <footer className="fw-footer">
    <div className="fw-footer__inner">
      <Link to="/" className="fw-footer__brand" aria-label="First Weather — Home">
        <img src={logo} alt="" className="fw-footer__brand-logo" />
        <span className="fw-footer__brand-name">
          First Weather<sup className="fw-footer__brand-tm">™</sup>
        </span>
      </Link>

      <nav className="fw-footer__nav" aria-label="Footer">
        {NAV_LINKS.map((item) => (
          <Link key={item.label} to={item.to} className="fw-footer__link">
            {item.label}
          </Link>
        ))}
      </nav>

      <hr className="fw-footer__divider" />

      <div className="fw-footer__bottom">
        <p className="fw-footer__copyright">
          © {new Date().getFullYear()} First Weather. All rights reserved.
        </p>

        <div className="fw-footer__socials">
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="fw-footer__social"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
