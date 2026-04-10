import { useEffect, useState } from "react";
import api from "../api";

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await api.get("/enquiries");
        setEnquiries(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  if (loading) return <p style={{ padding: "1rem" }}>Loading enquiries...</p>;

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2>All Enquiries</h2>

      <table style={table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {enquiries.map((e) => (
            <tr key={e._id}>
              <td>{e.name}</td>
              <td>{e.phone}</td>
              <td>{e.email || "—"}</td>
              <td>{e.message || "—"}</td>
              <td>{new Date(e.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

export default AdminEnquiries;
