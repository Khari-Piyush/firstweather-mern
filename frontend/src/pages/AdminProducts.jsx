import { useEffect, useState } from "react";
import api from "../api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    productName: "",
    productId: "",
    description: "",
    slug: "",
    price: "",
    category: "",
    carModel: "",
    unit: "",
    imageFile: null,
  });

  const fetchProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    Object.keys(form).forEach((k) => {
      if (k !== "imageFile") fd.append(k, form[k]);
    });
    if (form.imageFile) fd.append("image", form.imageFile);

    if (editingId) {
      await api.put(`/products/${editingId}`, fd);
    } else {
      await api.post("/products", fd);
    }

    setEditingId(null);
    setForm({
      productName: "",
      productId: "",
      description: "",
      slug: "",
      price: "",
      category: "",
      carModel: "",
      unit: "",
      imageFile: null,
    });

    fetchProducts();
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setForm({ ...p, imageFile: null });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete product?")) {
      await api.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  return (
    <div style={page}>
      <h2 style={heading}>Admin Products</h2>

      {/* FORM */}
      <form style={card} onSubmit={handleSubmit}>
        <h3 style={{ marginBottom: "1rem", color: "#1e3a8a" }}>
          {editingId ? "✏️ Update Product" : "➕ Add New Product"}
        </h3>

        <div style={grid}>
          {[
            ["productName", "Product Name"],
            ["productId", "Product ID"],
            ["slug", "Slug"],
            ["price", "Price"],
            ["category", "Category"],
            ["carModel", "Car Model"],
          ].map(([n, p]) => (
            <input
              key={n}
              name={n}
              placeholder={p}
              value={form[n]}
              onChange={handleChange}
              required
              style={input}
            />
          ))}

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            style={{ ...input, gridColumn: "1 / -1" }}
          />

          <select
            value={form.unit}
            onChange={(e) =>
              setForm({ ...form, unit: e.target.value })
            }
            style={input}
          >
            <option value="">Select Unit</option>
            <option value="pc">Per Piece</option>
            <option value="set">Per Set</option>
            <option value="pair">Per Pair</option>
          </select>

          <input
            type="file"
            onChange={(e) =>
              setForm({ ...form, imageFile: e.target.files[0] })
            }
          />
        </div>

        <button style={primaryBtn}>
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* TABLE */}
      <div style={card}>
        <table style={table}>
          <thead>
            <tr style={thead}>
              <th>Name</th>
              <th>ID</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} style={row}>
                <td>{p.productName}</td>
                <td>{p.productId}</td>
                <td>₹{p.price}</td>
                <td>
                  <button
                    style={editBtn}
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    style={deleteBtn}
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
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

const heading = {
  marginBottom: "1rem",
  color: "#1e40af",
};

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
  marginTop: "1rem",
  background: "linear-gradient(135deg, #2563eb, #1e40af)",
  color: "#fff",
  padding: "0.55rem 1.5rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const thead = {
  background: "#eff6ff",
  textAlign: "left",
};

const row = {
  borderBottom: "1px solid #e5e7eb",
};

const editBtn = {
  background: "#dbeafe",
  color: "#1e40af",
  border: "1px solid #93c5fd",
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

export default AdminProducts;
