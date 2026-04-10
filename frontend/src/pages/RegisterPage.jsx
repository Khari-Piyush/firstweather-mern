import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../contexts/AuthContext.jsx";

const RegisterPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!firstName || !lastName || !email || !password) return setError("All fields required");
    try {
      setLoading(true);
      const res = await api.post("/auth/register", { firstName,lastName, email, password });
      // res.data contains token and user
      login({ token: res.data.token, user: res.data.user });
      navigate("/products");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: 480, margin: "0 auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.5rem" }}>
        <input placeholder="First Name" value={firstName} onChange={(e) => setfirstName(e.target.value)} required />
        <input placeholder="Last Name" value={lastName} onChange={(e) => setlastName(e.target.value)} required />
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button disabled={loading} type="submit">{loading ? "Creating..." : "Register"}</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default RegisterPage;
