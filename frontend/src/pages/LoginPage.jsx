import { useContext, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 👇 smooth page open animation trigger
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      login({ token: res.data.token, user: res.data.user });
      navigate("/products");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #f0f7ff 0%, #ffffff 60%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          padding: "1.8rem",
          borderRadius: "18px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.12)",

          /* 👇 smooth open */
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.6s ease",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "0.3rem" }}>
          Welcome Back
        </h2>
        <p
          style={{
            textAlign: "center",
            color: "#555",
            fontSize: "0.9rem",
            marginBottom: "1.4rem",
          }}
        >
          Login to manage products & orders
        </p>

        <form onSubmit={handleSubmit}>
          <label style={label}>Email Address</label>
          <input
            style={input}
            type="email"
            placeholder="admin@firstweather.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={label}>Password</label>
          <input
            style={input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p style={{ color: "#dc2626", fontSize: "0.85rem" }}>{error}</p>
          )}

          <button style={btn} disabled={loading} type="submit">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* 🔵 STYLES */
const label = {
  display: "block",
  fontSize: "0.85rem",
  marginBottom: "0.25rem",
  color: "#374151",
};

const input = {
  width: "100%",
  padding: "0.65rem",
  marginBottom: "0.9rem",
  borderRadius: "8px",
  border: "1px solid #c7d2fe",
  fontSize: "0.95rem",
  outline: "none",
};

const btn = {
  width: "100%",
  padding: "0.7rem",
  borderRadius: "10px",
  border: "none",
  fontSize: "1rem",
  cursor: "pointer",
  background: "linear-gradient(135deg, #2563eb, #1e40af)",
  color: "#fff",
  marginTop: "0.5rem",
};

export default LoginPage;
