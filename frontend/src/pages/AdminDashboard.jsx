import { useEffect, useState } from "react";
import api from "../api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        setError("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p style={{ padding: "1rem" }}>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red", padding: "1rem" }}>{error}</p>;

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2>Admin Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "1.5rem",
        }}
      >
        <div style={cardStyle}>
          <h3>Total Products</h3>
          <p style={numberStyle}>{stats.totalProducts}</p>
        </div>

        <div style={cardStyle}>
          <h3>Total Orders</h3>
          <p style={numberStyle}>{stats.totalOrders}</p>
        </div>

        <div style={cardStyle}>
          <h3>Pending Enquiries</h3>
          <p style={numberStyle}>{stats.pendingOrders}</p>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  background: "#f9fafb",
  padding: "1.2rem",
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  textAlign: "center",
};

const numberStyle = {
  fontSize: "2rem",
  fontWeight: "bold",
  marginTop: "0.5rem",
};

export default AdminDashboard;
