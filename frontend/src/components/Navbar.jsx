import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0.75rem 1.5rem",
        borderBottom: "1px solid #ddd",
        marginBottom: "1rem",
      }}
    >
      <div>
        <Link to="/" style={{ textDecoration: "none", fontWeight: "bold", fontSize: "1.2rem" }}>
          FirstWeather
        </Link>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/login">Login</Link>
        <Link to="/admin/products">Admin</Link>
      </div>
    </nav>
  );
};

export default Navbar;
