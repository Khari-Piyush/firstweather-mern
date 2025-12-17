import { useState } from "react";
import api from "../api";

const AddProductPage = () => {
  const [form, setForm] = useState({});
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach((key) =>
      formData.append(key, form[key])
    );
    formData.append("image", image);

    await api.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Product added");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Product Name" onChange={(e) => setForm({ ...form, productName: e.target.value })} />
      <input placeholder="Product ID" onChange={(e) => setForm({ ...form, productId: e.target.value })} />
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button>Add Product</button>
    </form>
  );
};

export default AddProductPage;
