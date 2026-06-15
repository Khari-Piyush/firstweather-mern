import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaClipboardList } from "react-icons/fa";
import { AuthContext } from "../contexts/AuthContext.improved.jsx";
import { useInquiryCart } from "../contexts/InquiryCartContext.improved.jsx";
import logoIcon from "../../public/fw-logo-blue.webp";
import "./Navbar.scrollaware.improved.css";

// Same 5 public nav items + routes as Navbar.improved.jsx (T21)
const PUBLIC_NAV = [
  { label: "Home",       to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "Products",   to: "/products" },
  { label: "About",      to: "/about" },
  { label: "Contact",    to: "/contact" },
];

const ADMIN_NAV = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Products",  to: "/admin/products" },
  { label: "Orders",    to: "/admin/orders" },
  { label: "Enquiries", to: "/admin/enquiries" },
  { label: "Testimonials", to: "/admin/testimonials" },
];

// Scroll past this point switches the bar to its compact state
const COMPACT_AT = 40;
// Cumulative downward scroll (px) before the bar hides
const HIDE_AFTER = 80;

const NavbarScrollAware = () => {
  const { user, logout } = useContext(AuthContext);
  const { itemCount, openDrawer } = useInquiryCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);
  const menuOpenRef = useRef(false);

  const isAdmin = user?.isAdmin === true;

  // Drive the bar via class toggles + CSS transitions, not React state,
  // so scrolling never triggers a re-render.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    let lastY = window.scrollY;
    let downAccum = 0;
    let ticking = false;

    const apply = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      nav.classList.toggle("fw-nav-sa--compact", y > COMPACT_AT);

      if (menuOpenRef.current) {
        nav.classList.remove("fw-nav-sa--hidden");
      } else if (delta > 0) {
        downAccum += delta;
        if (downAccum > HIDE_AFTER && y > COMPACT_AT) {
          nav.classList.add("fw-nav-sa--hidden");
        }
      } else if (delta < 0) {
        downAccum = 0;
        nav.classList.remove("fw-nav-sa--hidden");
      }

      lastY = y;
      ticking = false;
    };

    apply(); // set initial state (handles reload mid-scroll / anchor links)

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(apply);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keep the bar visible while the mobile menu is open
  useEffect(() => {
    menuOpenRef.current = menuOpen;
    if (menuOpen) navRef.current?.classList.remove("fw-nav-sa--hidden");
  }, [menuOpen]);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav ref={navRef} className="fw-nav-sa">
        <div className="fw-nav-sa__bar">
          <div className="fw-nav-sa__inner">

            {/* Logo */}
            <Link to="/" className="fw-nav-sa__logo" onClick={close} aria-label="First Weather Wipers">
              <img src={logoIcon} alt="" className="fw-nav-sa__logo-icon" />
              <span className="fw-nav-sa__logo-text">
                First Weather<sup className="fw-nav-sa__logo-tm">™</sup>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="fw-nav-sa__links">
              {PUBLIC_NAV.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    "fw-nav-sa__link" + (isActive ? " fw-nav-sa__link--active" : "")
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              {isAdmin && (
                <>
                  <span className="fw-nav-sa__admin-chip">Admin</span>
                  {ADMIN_NAV.map((item) => (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      className={({ isActive }) =>
                        "fw-nav-sa__link" + (isActive ? " fw-nav-sa__link--active" : "")
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </>
              )}

              {user ? (
                <button className="fw-nav-sa__logout" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    "fw-nav-sa__link" + (isActive ? " fw-nav-sa__link--active" : "")
                  }
                >
                  Login
                </NavLink>
              )}

              <button
                className="fw-nav-sa__cart-btn"
                onClick={openDrawer}
                aria-label={`Inquiry list${itemCount > 0 ? `, ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}`}
              >
                <FaClipboardList />
                {itemCount > 0 && <span className="fw-nav-sa__cart-badge">{itemCount}</span>}
              </button>
            </div>

            {/* Hamburger (mobile) */}
            <button
              className="fw-nav-sa__hamburger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay menu */}
      <div className={`fw-nav-sa__mobile${menuOpen ? " fw-nav-sa__mobile--open" : ""}`}>
        <div className="fw-nav-sa__mobile-inner">

          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="fw-nav-sa__mobile-link"
              onClick={close}
            >
              {item.label}
            </Link>
          ))}

          <button
            className="fw-nav-sa__mobile-cart-btn"
            onClick={() => { openDrawer(); close(); }}
          >
            <FaClipboardList aria-hidden="true" />
            Inquiry List
            {itemCount > 0 && <span className="fw-nav-sa__cart-badge">{itemCount}</span>}
          </button>

          {isAdmin && (
            <>
              <span className="fw-nav-sa__mobile-divider">Admin</span>
              {ADMIN_NAV.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="fw-nav-sa__mobile-link"
                  onClick={close}
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}

          {user ? (
            <button className="fw-nav-sa__mobile-logout" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="fw-nav-sa__mobile-link" onClick={close}>
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default NavbarScrollAware;
