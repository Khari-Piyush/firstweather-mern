import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { CartContext } from "../contexts/CartContext.jsx";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 1.5rem", borderBottom: "1px solid #ddd", marginBottom: "1rem" }}>
      <div>
        <Link to="/" style={{ textDecoration: "none", fontWeight: "bold", fontSize: "1.2rem" }}>FirstWeather</Link>
      </div>

      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart ({cartCount})</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span>Hi, {user.firstName || user.lastName}</span>
            {user?.isAdmin && (
              <>
                <Link to="/admin">Dashboard</Link>
                <Link to="/admin/products">Products</Link>
                <Link to="/admin/orders">Orders</Link>
              </>
            )}

            <button onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
