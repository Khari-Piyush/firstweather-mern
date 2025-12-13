import { useEffect, useState } from "react";
import api from "../api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state
  const [form, setForm] = useState({
    productName: "",
    productId: "",
    slug: "",
    price: "",
    category: "",
    carModel: "",
    imageUrl: "",
  });

  const fetchProducts = async () => {
    try {
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products", {
        ...form,
        price: Number(form.price),
      });
      setForm({
        productName: "",
        productId: "",
        slug: "",
        price: "",
        category: "",
        carModel: "",
        imageUrl: "",
      });
      fetchProducts();
    } catch {
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

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1.5rem" }}>
      <h2>Admin Products</h2>

      {/* ADD PRODUCT FORM */}
      <form onSubmit={handleAddProduct} style={{ marginBottom: "2rem" }}>
        <h3>Add New Product</h3>

        <input name="productName" placeholder="Product Name" value={form.productName} onChange={handleChange} required />
        <input name="productId" placeholder="Product ID" value={form.productId} onChange={handleChange} required />
        <input name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} required />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input name="carModel" placeholder="Car Model" value={form.carModel} onChange={handleChange} />
        <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} />

        <button type="submit">Add Product</button>
      </form>

      {/* PRODUCT LIST */}
      <table border="1" cellPadding="8" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Product ID</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.productName}</td>
              <td>{p.productId}</td>
              <td>₹{p.price}</td>
              <td>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AdminProducts;
