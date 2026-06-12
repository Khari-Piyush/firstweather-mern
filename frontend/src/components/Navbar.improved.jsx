import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.improved.jsx";
import logo from "../../public/fwlogoblue.webp";
import "./Navbar.improved.css";

// 5 public nav items (roadmap-mandated)
const PUBLIC_NAV = [
  { label: "Home", to: "/" },
  { label: "Categories", to: "/categories" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const ADMIN_NAV = [
  { label: "Dashboard", to: "/admin/dashboard" },
  { label: "Products", to: "/admin/products" },
  { label: "Orders", to: "/admin/orders" },
  { label: "Enquiries", to: "/admin/enquiries" },
  { label: "Testimonials", to: "/admin/testimonials" },
];

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.isAdmin === true;

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  const close = () => setMenuOpen(false);

  return (
    <>
      <nav className="fw-nav">
        <div className="fw-nav__inner">

          {/* Logo */}
          <Link to="/" className="fw-nav__logo" onClick={close}>
            <img src={logo} alt="First Weather Wipers" />
          </Link>

          {/* Desktop links */}
          <div className="fw-nav__links">
            {PUBLIC_NAV.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  "fw-nav__link" + (isActive ? " fw-nav__link--active" : "")
                }
              >
                {item.label}
              </NavLink>
            ))}

            {isAdmin && (
              <>
                <span className="fw-nav__admin-chip">Admin</span>
                {ADMIN_NAV.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={({ isActive }) =>
                      "fw-nav__link" + (isActive ? " fw-nav__link--active" : "")
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </>
            )}

            {user ? (
              <button className="fw-nav__logout" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  "fw-nav__link" + (isActive ? " fw-nav__link--active" : "")
                }
              >
                Login
              </NavLink>
            )}
          </div>

          {/* Hamburger (mobile) */}
          <button
            className="fw-nav__hamburger"
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
      </nav>

      {/* Mobile slide-down menu */}
      <div className={`fw-nav__mobile${menuOpen ? " fw-nav__mobile--open" : ""}`}>
        <div className="fw-nav__mobile-inner">

          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="fw-nav__mobile-link"
              onClick={close}
            >
              {item.label}
            </Link>
          ))}

          {isAdmin && (
            <>
              <span className="fw-nav__mobile-divider">Admin</span>
              {ADMIN_NAV.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="fw-nav__mobile-link"
                  onClick={close}
                >
                  {item.label}
                </Link>
              ))}
            </>
          )}

          {user ? (
            <button className="fw-nav__mobile-logout" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="fw-nav__mobile-link" onClick={close}>
              Login
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
