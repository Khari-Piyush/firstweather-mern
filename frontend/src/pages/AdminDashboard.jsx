import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.improved";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const STATUS_ORDER = ["New", "Contacted", "Quotation Sent", "Negotiation", "Confirmed", "Closed"];

const STATUS_COLORS = {
  New: "#3b82f6",
  Contacted: "#eab308",
  "Quotation Sent": "#8b5cf6",
  Negotiation: "#f97316",
  Confirmed: "#22c55e",
  Closed: "#9ca3af",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [chart, setChart] = useState({
    labels: [],
    data: [],
  });

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalInquiries: 0,
    totalEnquiries: 0,
  });

  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [analytics, setAnalytics] = useState({
    visitors: 0,
    enquiryClicks: 0,
    enquirySubmit: 0,
  });

  const [inqAnalytics, setInqAnalytics] = useState({
    statusSummary: {},
    monthly: { current: 0, previous: 0, trend: 0 },
    mostRequestedProducts: [],
    recentInquiries: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [statsRes, inqRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/inquiries/analytics"),
        ]);
        setStats(statsRes.data);
        setInqAnalytics(inqRes.data);
      } catch {
        setError("Failed to load admin stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    api.get("/enquiry")
      .then((res) => setRecentEnquiries(res.data.slice(0, 5)))
      .catch((err) => console.error("Failed to load recent enquiries:", err));
  }, []);

  useEffect(() => {
    fetch("https://first-weather-webapp-h05a.onrender.com/analytics-chart")
      .then(res => res.json())
      .then(data => {
        console.log("📊 CHART DATA:", data);

        const labels = data.rows?.map(row =>
          row.dimensionValues[0].value
        ) || [];
        const formattedLabels = labels.map(d => {
          const date = new Date(
            d.slice(0, 4),
            d.slice(4, 6) - 1,
            d.slice(6, 8)
          );
          return date.toLocaleDateString("en-IN", { weekday: "short" });
        });

        const values = data.rows?.map(row =>
          Number(row.metricValues[0].value)
        ) || [];

        setChart({
          labels: formattedLabels,
          data: values,
        });
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
  fetch("https://first-weather-webapp-h05a.onrender.com/analytics-events")
    .then(res => res.json())
    .then(data => {
      console.log("🔥 EVENTS:", data);

      let clicks = 0;
      let submit = 0;

      data.rows?.forEach(row => {
        const name = row.dimensionValues[0].value;
        const value = Number(row.metricValues[0].value);

        if (name === "enquiry_click") clicks += value;
        if (name === "enquiry_submit") submit += value;
      });

      setAnalytics(prev => ({
        ...prev,
        enquiryClicks: clicks,
        enquirySubmit: submit,
      }));
    });
}, []);

  useEffect(() => {
    fetch("https://first-weather-webapp-h05a.onrender.com/analytics")
      .then((res) => res.json())
      .then((data) => {
        console.log("🔥 GA DATA:", data);

        const visitors =
          data.rows?.[0]?.metricValues?.[0]?.value || 0;

        setAnalytics((prev) => ({
          ...prev,
          visitors: Number(visitors),
        }));
      })
      .catch((err) => {
        console.error("❌ GA ERROR:", err);
      });
  }, []);

  const conversionRate =
    analytics.visitors > 0
      ? ((analytics.enquirySubmit / analytics.visitors) * 100).toFixed(1)
      : 0;


  if (loading) return <p style={{ padding: "1rem" }}>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red", padding: "1rem" }}>{error}</p>;

  const chartData = {
    labels: chart.labels,
    datasets: [
      {
        label: "Visitors",
        data: chart.data,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #eef5ff, #ffffff)",
      }}
    >
      <h2>Admin Dashboard</h2>
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
          onClick={() => navigate("/admin/products")}
        />

        <DashboardCard
          title="Inquiries"
          value={stats.totalInquiries}
          gradient="linear-gradient(135deg, #14b8a6, #0f766e)"
          onClick={() => navigate("/admin/inquiries")}
        />

        <DashboardCard
          title="Inquiries This Month"
          value={inqAnalytics.monthly.current}
          gradient="linear-gradient(135deg, #6366f1, #4338ca)"
          trend={inqAnalytics.monthly.trend}
          onClick={() => navigate("/admin/inquiries")}
        />

        <DashboardCard
          title="Enquiries"
          value={stats.totalEnquiries}
          gradient="linear-gradient(135deg, #f59e0b, #b45309)"
        />

        <DashboardCard
          title="Total Visitors"
          value={analytics.visitors}
          gradient="linear-gradient(135deg, #10b981, #047857)"
        />

        <DashboardCard
          title="Enquiry Clicks"
          value={analytics.enquiryClicks}
          gradient="linear-gradient(135deg, #8b5cf6, #5b21b6)"
        />

        <DashboardCard
          title="Conversion Rate"
          value={conversionRate + "%"}
          gradient="linear-gradient(135deg, #ef4444, #991b1b)"
        />
      </div>

      <div
        style={{
          marginTop: "2rem",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* 📈 GRAPH */}
        <div
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(12px)",
            padding: "1.5rem",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          }}
        >
          <h3>📈 Traffic Overview</h3>

          <div style={{ height: "300px" }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* 🎯 FUNNEL */}
        <div
          style={{
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(12px)",
            padding: "1.5rem",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          }}
        >
          <h3>🎯 Conversion Funnel</h3>

          <div style={{ marginTop: "1rem", lineHeight: "2" }}>
            <div>👤 Visitors: {analytics.visitors}</div>
            <div>👉 Clicks: {analytics.enquiryClicks}</div>
            <div>📩 Submit: {analytics.enquirySubmit}</div>
          </div>

          <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
            {analytics.visitors} → {analytics.enquiryClicks} → {analytics.enquirySubmit}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* 📥 RECENT INQUIRIES */}
        <div style={glassCard}>
          <h3>📥 Recent Inquiries</h3>

          {inqAnalytics.recentInquiries.length === 0 ? (
            <p style={{ color: "#888", marginTop: "0.75rem" }}>No inquiries yet.</p>
          ) : (
            <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ textAlign: "left", color: "#888" }}>
                    <th style={{ padding: "0.4rem 0.5rem" }}>Inquiry ID</th>
                    <th style={{ padding: "0.4rem 0.5rem" }}>Customer</th>
                    <th style={{ padding: "0.4rem 0.5rem" }}>Items</th>
                    <th style={{ padding: "0.4rem 0.5rem" }}>Status</th>
                    <th style={{ padding: "0.4rem 0.5rem" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {inqAnalytics.recentInquiries.map((inq) => (
                    <tr
                      key={inq._id}
                      onClick={() => navigate(`/admin/inquiries/${inq._id}`)}
                      style={{ cursor: "pointer", borderTop: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <td style={{ padding: "0.5rem", fontFamily: "monospace" }}>{inq.inquiryId}</td>
                      <td style={{ padding: "0.5rem" }}>{inq.customerName}</td>
                      <td style={{ padding: "0.5rem" }}>{inq.itemCount}</td>
                      <td style={{ padding: "0.5rem" }}>{inq.status}</td>
                      <td style={{ padding: "0.5rem" }}>{formatDate(inq.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 📊 STATUS SUMMARY */}
        <div style={glassCard}>
          <h3>📊 Inquiry Status Summary</h3>

          <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
            {STATUS_ORDER.map((status) => {
              const count = inqAnalytics.statusSummary[status] || 0;
              const pct = stats.totalInquiries ? (count / stats.totalInquiries) * 100 : 0;
              return (
                <div key={status}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span>{status}</span>
                    <span style={{ fontWeight: "bold" }}>{count}</span>
                  </div>
                  <div style={{ height: "6px", borderRadius: "4px", background: "rgba(0,0,0,0.06)", marginTop: "4px" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        borderRadius: "4px",
                        background: STATUS_COLORS[status],
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 🏆 MOST REQUESTED PRODUCTS */}
      <div style={{ ...glassCard, marginTop: "1.5rem" }}>
        <h3>🏆 Most Requested Products</h3>

        {inqAnalytics.mostRequestedProducts.length === 0 ? (
          <p style={{ color: "#888", marginTop: "0.75rem" }}>No product requests yet.</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#888" }}>
                  <th style={{ padding: "0.4rem 0.5rem" }}>Product Code</th>
                  <th style={{ padding: "0.4rem 0.5rem" }}>Product Name</th>
                  <th style={{ padding: "0.4rem 0.5rem" }}>Total Qty Requested</th>
                  <th style={{ padding: "0.4rem 0.5rem" }}>In # Inquiries</th>
                </tr>
              </thead>
              <tbody>
                {inqAnalytics.mostRequestedProducts.map((p, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <td style={{ padding: "0.5rem", fontFamily: "monospace" }}>{p.productCode || "-"}</td>
                    <td style={{ padding: "0.5rem" }}>{p.productName}</td>
                    <td style={{ padding: "0.5rem" }}>{p.totalQty}</td>
                    <td style={{ padding: "0.5rem" }}>{p.inquiryCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 📩 RECENT ENQUIRIES */}
      <div style={{ ...glassCard, marginTop: "1.5rem" }}>
        <h3>📩 Recent Enquiries</h3>

        {recentEnquiries.length === 0 ? (
          <p style={{ color: "#888", marginTop: "0.75rem" }}>No enquiries yet.</p>
        ) : (
          <div style={{ overflowX: "auto", marginTop: "0.75rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ textAlign: "left", color: "#888" }}>
                  <th style={{ padding: "0.4rem 0.5rem" }}>Name</th>
                  <th style={{ padding: "0.4rem 0.5rem" }}>Phone</th>
                  <th style={{ padding: "0.4rem 0.5rem" }}>Email</th>
                  <th style={{ padding: "0.4rem 0.5rem" }}>Message</th>
                  <th style={{ padding: "0.4rem 0.5rem" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.map((enq) => (
                  <tr key={enq._id} style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <td style={{ padding: "0.5rem" }}>{enq.name}</td>
                    <td style={{ padding: "0.5rem" }}>{enq.phone}</td>
                    <td style={{ padding: "0.5rem" }}>{enq.email || "-"}</td>
                    <td style={{ padding: "0.5rem", maxWidth: "260px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {enq.message || "-"}
                    </td>
                    <td style={{ padding: "0.5rem" }}>{formatDate(enq.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* 🔹 SHARED GLASS CARD STYLE */
const glassCard = {
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(12px)",
  padding: "1.5rem",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
};

/* 🔹 TREND BADGE */
const TrendBadge = ({ trend }) => {
  if (trend === undefined) return null;

  if (trend === null) {
    return (
      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#2563eb" }}>
        New this month
      </span>
    );
  }

  const color = trend > 0 ? "#16a34a" : trend < 0 ? "#dc2626" : "#6b7280";
  const arrow = trend > 0 ? "▲" : trend < 0 ? "▼" : "—";

  return (
    <span style={{ fontSize: "0.8rem", fontWeight: 600, color }}>
      {arrow} {Math.abs(trend)}% vs last month
    </span>
  );
};

/* 🔹 CARD COMPONENT */
const DashboardCard = ({ title, value, gradient, onClick, trend }) => {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        background: "linear-gradient(135deg, #ffffff, #f8fbff)",
        border: "1px solid rgba(37,99,235,0.1)",
        boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
        backdropFilter: "blur(8px)",
        borderRadius: "16px",
        padding: "1.2rem",
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

      <h3 style={{ fontSize: "1rem", color: "#444" }}>{title}</h3>

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

      <TrendBadge trend={trend} />
    </div>
  );
};

export default AdminDashboard;
