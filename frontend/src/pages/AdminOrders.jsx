import { useEffect, useState } from "react";
import api from "../api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const res = await api.get("/orders");
    setOrders(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    fetchOrders();
  };

  if (loading) return <p style={{ padding: "1rem" }}>Loading orders...</p>;

  return (
    <div
      style={{
        padding: "1.5rem",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0f7ff 0%, #ffffff 65%)",
      }}
    >
      <h2 style={{ marginBottom: "0.25rem" }}>Admin Orders</h2>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>
        Manage customer enquiries & orders
      </p>

      {orders.map((o) => (
        <div
          key={o._id}
          style={{
            background: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(8px)",
            borderRadius: "16px",
            padding: "1.2rem",
            marginBottom: "1.2rem",
            boxShadow: "0 14px 35px rgba(0,0,0,0.08)",
            border: "1px solid #e0ecff",
          }}
        >
          {/* TOP ROW */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            <div>
              <p style={label}><b>Customer:</b> {o.customerName}</p>
              <p style={label}><b>Phone:</b> {o.customerPhone}</p>
              <p style={label}><b>Address:</b> {o.customerAddress}</p>
            </div>

            {/* STATUS */}
            <div style={{ minWidth: "160px" }}>
              <select
                value={o.status}
                onChange={(e) => updateStatus(o._id, e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.4rem",
                  borderRadius: "8px",
                  border: "1px solid #c7d2fe",
                  background: statusBg(o.status),
                  color: "#1f2937",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                <option value="enquiry">Enquiry</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* ITEMS */}
          <div
            style={{
              background: "#f8fafc",
              borderRadius: "10px",
              padding: "0.75rem",
              marginBottom: "0.75rem",
            }}
          >
            <ul style={{ margin: 0, paddingLeft: "1.2rem" }}>
              {o.items.map((it, idx) => (
                <li key={idx} style={{ fontSize: "0.9rem", marginBottom: "0.25rem" }}>
                  {it.productName} — ₹{it.price} × {it.qty}
                </li>
              ))}
            </ul>
          </div>

          {/* TOTAL */}
          <p
            style={{
              fontWeight: "bold",
              fontSize: "1.05rem",
              color: "#1e40af",
            }}
          >
            Total: ₹{o.totalAmount}
          </p>
        </div>
      ))}
    </div>
  );
};

/* 🔹 HELPERS */
const label = {
  margin: "0.15rem 0",
  fontSize: "0.9rem",
};

const statusBg = (status) => {
  switch (status) {
    case "confirmed":
      return "#ecfeff";
    case "shipped":
      return "#eff6ff";
    case "delivered":
      return "#ecfdf5";
    case "cancelled":
      return "#fee2e2";
    default:
      return "#fefce8";
  }
};

export default AdminOrders;
