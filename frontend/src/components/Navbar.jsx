import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import logo from "../../public/fw-logo-blue.png";
import { useContext, useState, useEffect } from "react";

// Icons
import {
  FiMenu,
  FiX,
  FiBox,
  FiLogIn,
  FiLogOut,
  FiHome,
  FiPhone,
  FiGrid,
  FiClipboard,
  FiInbox,
} from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const isAdmin =
  user?.role === "admin" ||
  user?.role === "ADMIN" ||
  user?.isAdmin === true;


  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav style={navOuter}>
        <div style={navInner}>
          {/* LOGO */}
          <Link to="/" style={logoWrap} onClick={() => setMenuOpen(false)}>
            <img src={logo} alt="First Weather Logo" style={logoStyle} />
            <span style={logoText}>FIRST WEATHER</span>
          </Link>

          {/* SEARCH (DESKTOP)
          {!isMobile && (
            <input
              type="text"
              placeholder="Search products..."
              style={searchInput}
            />
          )} */}

          {/* LINKS */}
          {!isMobile ? (
            <div style={linksWrap}>
              <NavLink to="/" label="Home" />
              <NavLink to="/products" label="Products" />
              <NavLink to="/contact" label="Contact Us" />

              {/* ===== ADMIN LINKS ===== */}
              {isAdmin && (
                <>
                  <NavLink to="/admin/dashboard" label="Dashboard" />
                  <NavLink to="/admin/products" label="Admin Products" />
                  <NavLink to="/admin/orders" label="Orders" />
                  <NavLink to="/admin/enquiries" label="Enquiries" />
                </>
              )}

              {!user ? (
                <NavLink to="/login" label="Login" />
              ) : (
                <button onClick={handleLogout} style={logoutBtn}>
                  Logout
                </button>
              )}
            </div>
          ) : (
            <button onClick={() => setMenuOpen(!menuOpen)} style={hamburgerBtn}>
              {menuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
            </button>
          )}
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && isMobile && (
        <div style={mobileMenu}>
          <input
            type="text"
            placeholder="Search products..."
            style={mobileSearch}
          />

          <MobileLink
            to="/"
            icon={<FiHome />}
            label="Home"
            setMenuOpen={setMenuOpen}
          />
          <MobileLink
            to="/products"
            icon={<FiBox />}
            label="Products"
            setMenuOpen={setMenuOpen}
          />
          <MobileLink
            to="/contact"
            icon={<FiPhone />}
            label="Contact Us"
            setMenuOpen={setMenuOpen}
          />

          {/* ===== ADMIN LINKS (MOBILE) ===== */}
          {isAdmin && (
            <>
              <MobileLink
                to="/admin/dashboard"
                icon={<FiGrid />}
                label="Dashboard"
                setMenuOpen={setMenuOpen}
              />
              <MobileLink
                to="/admin/products"
                icon={<FiBox />}
                label="Admin Products"
                setMenuOpen={setMenuOpen}
              />
              <MobileLink
                to="/admin/orders"
                icon={<FiClipboard />}
                label="Orders"
                setMenuOpen={setMenuOpen}
              />
              <MobileLink
                to="/admin/enquiries"
                icon={<FiInbox />}
                label="Enquiries"
                setMenuOpen={setMenuOpen}
              />
            </>
          )}

          {!user ? (
            <MobileLink
              to="/login"
              icon={<FiLogIn />}
              label="Login"
              setMenuOpen={setMenuOpen}
            />
          ) : (
            <button onClick={handleLogout} style={mobileLogout}>
              <FiLogOut /> Logout
            </button>
          )}
        </div>
      )}
    </>
  );
};

/* ================= SMALL COMPONENTS ================= */

const NavLink = ({ to, label }) => (
  <Link to={to} style={navLink}>
    {label}
  </Link>
);

const MobileLink = ({ to, icon, label, setMenuOpen }) => (
  <Link to={to} style={mobileLink} onClick={() => setMenuOpen(false)}>
    {icon}
    <span>{label}</span>
  </Link>
);

/* ================= STYLES ================= */

const navOuter = {
  width: "100%",
  background: "#ffffff",
  borderBottom: "1px solid #e5e7eb",
};

const navInner = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "0.75rem 1rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const logoWrap = {
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
};

const logoStyle = { height: "44px" };

const logoText = {
  marginLeft: "10px",
  fontWeight: "700",
  fontSize: "1.1rem",
  color: "#1E40AF",
  letterSpacing: "1px",
};

const searchInput = {
  padding: "7px 16px",
  borderRadius: "20px",
  border: "1px solid #cbd5e1",
  outline: "none",
  width: "240px",
};

const linksWrap = {
  display: "flex",
  alignItems: "center",
  gap: "1.2rem",
};

const navLink = {
  textDecoration: "none",
  color: "#2563eb",
  fontWeight: "600",
};

const logoutBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "6px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

const hamburgerBtn = {
  background: "transparent",
  border: "none",
  color: "#2563eb",
  cursor: "pointer",
};

const mobileMenu = {
  maxWidth: "1200px",
  margin: "0 auto",
  background: "#ffffff",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
  gap: "1rem",
};

const mobileSearch = {
  padding: "8px 14px",
  borderRadius: "20px",
  border: "1px solid #cbd5e1",
  outline: "none",
};

const mobileLink = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  textDecoration: "none",
  color: "#2563eb",
  fontWeight: "500",
};

const mobileLogout = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default Navbar;
