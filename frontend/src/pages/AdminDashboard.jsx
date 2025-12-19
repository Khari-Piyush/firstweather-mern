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
      } catch {
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
    <div
      style={{
        padding: "1.5rem",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0f7ff 0%, #ffffff 65%)",
      }}
    >
      <h2 style={{ marginBottom: "0.25rem" }}>Admin Dashboard</h2>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>
        Overview of First Weather system
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.2rem",
        }}
      >
        <DashboardCard
          title="Total Products"
          value={stats.totalProducts}
          gradient="linear-gradient(135deg, #2563eb, #1e40af)"
        />

        <DashboardCard
          title="Total Orders"
          value={stats.totalOrders}
          gradient="linear-gradient(135deg, #0ea5e9, #0369a1)"
        />

        <DashboardCard
          title="Pending Enquiries"
          value={stats.pendingOrders}
          gradient="linear-gradient(135deg, #f59e0b, #b45309)"
        />
      </div>
    </div>
  );
};

/* 🔹 REUSABLE CARD */
const DashboardCard = ({ title, value, gradient }) => {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(8px)",
        borderRadius: "16px",
        padding: "1.2rem",
        boxShadow: "0 14px 35px rgba(0,0,0,0.08)",
        border: "1px solid #e0ecff",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow =
          "0 20px 45px rgba(37,99,235,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 14px 35px rgba(0,0,0,0.08)";
      }}
    >
      {/* TOP GRADIENT STRIP */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "5px",
          background: gradient,
        }}
      />

      <h3 style={{ fontSize: "1rem", color: "#444", marginBottom: "0.4rem" }}>
        {title}
      </h3>

      <p
        style={{
          fontSize: "2.4rem",
          fontWeight: "bold",
          background: gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {value}
      </p>
    </div>
  );
};

export default AdminDashboard;
