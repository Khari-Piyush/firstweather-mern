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

  if (loading) return <p>Loading orders...</p>;

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2>Admin Orders</h2>

      {orders.map((o) => (
        <div key={o._id} style={{ border: "1px solid #ddd", padding: "1rem", marginBottom: "1rem" }}>
          <p><b>Customer:</b> {o.customerName}</p>
          <p><b>Phone:</b> {o.customerPhone}</p>
          <p><b>Address:</b> {o.customerAddress}</p>

          <ul>
            {o.items.map((it, idx) => (
              <li key={idx}>
                {it.productName} — ₹{it.price} × {it.qty}
              </li>
            ))}
          </ul>

          <p><b>Total:</b> ₹{o.totalAmount}</p>

          <select value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
            <option value="enquiry">Enquiry</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;
