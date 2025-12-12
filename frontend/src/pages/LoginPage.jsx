import { useContext, useState } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Enter email and password");
    try {
      setLoading(true);
      const res = await api.post("/auth/login", { email, password });
      // res.data: { token, user, message }
      login({ token: res.data.token, user: res.data.user });
      navigate("/products");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: 480, margin: "0 auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.5rem" }}>
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button disabled={loading} type="submit">
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
