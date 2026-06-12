import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../api.improved";

const EMPTY_FORM = {
  customerName: "",
  rating: 5,
  text: "",
  location: "",
  vehicle: "",
  source: "Google",
  order: "",
  isVisible: true,
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get("/testimonials/admin");
      setTestimonials(res.data);
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      rating: Number(form.rating),
      order: form.order === "" ? undefined : Number(form.order),
    };

    try {
      if (editingId) {
        await api.put(`/testimonials/${editingId}`, payload);
        toast.success("Testimonial updated");
      } else {
        await api.post("/testimonials", payload);
        toast.success("Testimonial added");
      }
      resetForm();
      fetchTestimonials();
    } catch {
      toast.error("Failed to save testimonial");
    }
  };

  const handleEdit = (t) => {
    setEditingId(t._id);
    setForm({
      customerName: t.customerName || "",
      rating: t.rating || 5,
      text: t.text || "",
      location: t.location || "",
      vehicle: t.vehicle || "",
      source: t.source || "Google",
      order: t.order ?? "",
      isVisible: t.isVisible !== false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await api.delete(`/testimonials/${id}`);
      toast.success("Testimonial deleted");
      fetchTestimonials();
    } catch {
      toast.error("Failed to delete testimonial");
    }
  };

  const toggleVisible = async (t) => {
    try {
      await api.put(`/testimonials/${t._id}`, { isVisible: !t.isVisible });
      fetchTestimonials();
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  if (loading) return <p style={{ padding: "1rem" }}>Loading testimonials...</p>;

  return (
    <div style={page}>
      <h2 style={heading}>Admin Testimonials</h2>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>
        Manage customer testimonials shown on the site
      </p>

      {/* ================= FORM ================= */}
      <form style={card} onSubmit={handleSubmit}>
        <h3 style={{ color: "#1e3a8a" }}>
          {editingId ? "✏️ Update Testimonial" : "➕ Add Testimonial"}
        </h3>

        <div style={grid}>
          <input
            name="customerName"
            placeholder="Customer Name"
            value={form.customerName}
            onChange={handleChange}
            required
            style={input}
          />

          <select name="rating" value={form.rating} onChange={handleChange} style={input}>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{"★".repeat(r) + "☆".repeat(5 - r)}</option>
            ))}
          </select>

          <input
            name="location"
            placeholder="Location (optional)"
            value={form.location}
            onChange={handleChange}
            style={input}
          />

          <input
            name="vehicle"
            placeholder="Vehicle (optional)"
            value={form.vehicle}
            onChange={handleChange}
            style={input}
          />

          <input
            name="source"
            placeholder="Source"
            value={form.source}
            onChange={handleChange}
            style={input}
          />

          <input
            name="order"
            type="number"
            placeholder="Display Order (optional)"
            value={form.order}
            onChange={handleChange}
            style={input}
          />

          <textarea
            name="text"
            placeholder="Testimonial text"
            value={form.text}
            onChange={handleChange}
            rows={3}
            required
            style={{ ...input, gridColumn: "1 / -1" }}
          />

          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              name="isVisible"
              checked={form.isVisible}
              onChange={handleChange}
            />
            Visible on site
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem" }}>
          <button style={primaryBtn}>
            {editingId ? "Update Testimonial" : "Add Testimonial"}
          </button>
          {editingId && (
            <button type="button" style={cancelBtn} onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ================= TABLE ================= */}
      <div style={card}>
        <table style={table}>
          <thead>
            <tr style={thead}>
              <th>Name</th>
              <th>Rating</th>
              <th>Text</th>
              <th>Location / Vehicle</th>
              <th>Source</th>
              <th>Visible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t._id} style={row}>
                <td>{t.customerName}</td>
                <td>{"★".repeat(t.rating)}</td>
                <td style={{ maxWidth: "320px" }}>{t.text}</td>
                <td>{[t.location, t.vehicle].filter(Boolean).join(" · ") || "—"}</td>
                <td>{t.source}</td>
                <td>{t.isVisible ? "Yes" : "No"}</td>
                <td>
                  <button style={editBtn} onClick={() => handleEdit(t)}>Edit</button>
                  <button style={visBtn} onClick={() => toggleVisible(t)}>
                    {t.isVisible ? "Hide" : "Show"}
                  </button>
                  <button style={deleteBtn} onClick={() => handleDelete(t._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {testimonials.length === 0 && (
              <tr>
                <td colSpan={7} style={{ padding: "1rem", textAlign: "center", color: "#888" }}>
                  No testimonials yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const page = {
  padding: "1.5rem",
  minHeight: "100vh",
  background: "linear-gradient(180deg, #eff6ff, #ffffff)",
};

const heading = { marginBottom: "1rem", color: "#1e40af" };

const card = {
  background: "#fff",
  borderRadius: "14px",
  padding: "1.2rem",
  marginBottom: "2rem",
  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "0.7rem",
};

const input = {
  padding: "0.55rem",
  borderRadius: "8px",
  border: "1px solid #c7d2fe",
};

const primaryBtn = {
  background: "linear-gradient(135deg, #2563eb, #1e40af)",
  color: "#fff",
  padding: "0.55rem 1.5rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const cancelBtn = {
  background: "#f1f5f9",
  color: "#334155",
  padding: "0.55rem 1.5rem",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  cursor: "pointer",
};

const table = { width: "100%", borderCollapse: "collapse" };
const thead = { background: "#eff6ff", textAlign: "left" };
const row = { borderBottom: "1px solid #e5e7eb" };

const editBtn = {
  background: "#dbeafe",
  color: "#1e40af",
  border: "1px solid #93c5fd",
  padding: "0.3rem 0.6rem",
  borderRadius: "6px",
  marginRight: "6px",
  cursor: "pointer",
};

const visBtn = {
  background: "#fef9c3",
  color: "#854d0e",
  border: "1px solid #fde68a",
  padding: "0.3rem 0.6rem",
  borderRadius: "6px",
  marginRight: "6px",
  cursor: "pointer",
};

const deleteBtn = {
  background: "#fee2e2",
  color: "#b91c1c",
  border: "1px solid #fecaca",
  padding: "0.3rem 0.6rem",
  borderRadius: "6px",
  cursor: "pointer",
};

export default AdminTestimonials;
