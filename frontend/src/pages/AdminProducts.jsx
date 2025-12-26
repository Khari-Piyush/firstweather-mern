import { useEffect, useState } from "react";
import api from "../api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    productName: "",
    productId: "",
    description: "",
    slug: "",
    price: "",
    category: "",
    carModel: "",
    imageFile: null, // ✅ IMPORTANT
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("productName", form.productName);
    formData.append("productId", form.productId);
    formData.append("slug", form.slug);
    formData.append("description", form.description);
    formData.append("price", Number(form.price));
    formData.append("category", form.category);
    formData.append("carModel", form.carModel);

    // 🔥 EXACT KEY
    formData.append("image", form.imageFile);

    // 🚫 DO NOT SET HEADERS HERE
    await api.post("/products", formData);

    setForm({
      productName: "",
      productId: "",
      description: "",
      slug: "",
      price: "",
      category: "",
      carModel: "",
      imageFile: null,
    });

    fetchProducts();
  } catch (err) {
    console.error(err);
    alert("Failed to add product");
  }
};



  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <p style={{ padding: "1rem" }}>Loading...</p>;

  return (
    <div
      style={{
        padding: "1.5rem",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f0f7ff 0%, #ffffff 60%)",
      }}
    >
      <h2 style={{ marginBottom: "0.25rem" }}>Admin Products</h2>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>
        Manage First Weather product listings
      </p>

      {/* ADD PRODUCT FORM */}
      <form
        onSubmit={handleAddProduct}
        style={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          borderRadius: "14px",
          padding: "1.2rem",
          marginBottom: "2rem",
          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h3 style={{ marginBottom: "1rem" }}>➕ Add New Product</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {[
            ["productName", "Product Name"],
            ["productId", "Product ID"],
            ["slug", "Slug"],
            ["price", "Price"],
            ["category", "Category"],
            ["carModel", "Car Model"],
          ].map(([name, placeholder]) => (
            <input
              key={name}
              name={name}
              placeholder={placeholder}
              value={form[name]}
              onChange={handleChange}
              required={["productName", "productId", "slug", "price"].includes(name)}
              style={inputStyle}
            />
          ))}

          <textarea
            name="description"
            placeholder="Product Description"
            value={form.description}
            onChange={handleChange}
            required
            rows={3}
            style={{ ...inputStyle, gridColumn: "1 / -1", resize: "vertical" }}
          />
          {/* IMAGE UPLOAD */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                imageFile: e.target.files[0],
              }))
            }
            style={{
              marginTop: "0.8rem",
              fontSize: "0.85rem",
            }}
          />

        </div>

        <button type="submit" style={primaryBtn}>
          Add Product
        </button>
      </form>

      {/* PRODUCT TABLE */}
      <div
        style={{
          background: "#fff",
          borderRadius: "14px",
          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#eff6ff" }}>
              <th style={th}>Name</th>
              <th style={th}>Product ID</th>
              <th style={th}>Price</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={td}>{p.productName}</td>
                <td style={td}>{p.productId}</td>
                <td style={td}>₹{p.price}</td>
                <td style={td}>
                  <button
                    onClick={() => handleDelete(p._id)}
                    style={{
                      background: "#fee2e2",
                      color: "#b91c1c",
                      border: "1px solid #fecaca",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

const inputStyle = {
  padding: "0.5rem 0.6rem",
  borderRadius: "8px",
  border: "1px solid #c7d2fe",
  fontSize: "0.9rem",
};

const primaryBtn = {
  marginTop: "1rem",
  background: "linear-gradient(135deg, #2563eb, #1e40af)",
  color: "#fff",
  padding: "0.45rem 1.2rem",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
};

const th = {
  textAlign: "left",
  padding: "0.75rem",
  fontSize: "0.85rem",
};

const td = {
  padding: "0.7rem",
  fontSize: "0.85rem",
};

export default AdminProducts;
