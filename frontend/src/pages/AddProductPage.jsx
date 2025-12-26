import { useState } from "react";
import api from "../api";

const AddProductPage = () => {
  const [form, setForm] = useState({
    productName: "",
    productId: "",
    slug: "",
    description: "",
    price: "",
    category: "",
    carModel: "",
  });

  const [image, setImage] = useState(null);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!image) {
    alert("Please select an image");
    return;
  }

  const formData = new FormData();

  Object.keys(form).forEach((key) => {
    formData.append(key, form[key]);
  });

  formData.append("image", image);

  try {
    await api.post("/products", formData); // ✅ NO HEADERS

    alert("✅ Product added successfully");

    setForm({
      productName: "",
      productId: "",
      slug: "",
      description: "",
      price: "",
      category: "",
      carModel: "",
    });
    setImage(null);
  } catch (err) {
    console.error(err.response?.data);
    alert(err.response?.data?.message || "❌ Failed to add product");
  }
};



  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: "420px",
        margin: "2rem auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
      }}
    >
      <input
        placeholder="Product Name"
        value={form.productName}
        onChange={(e) =>
          setForm({ ...form, productName: e.target.value })
        }
        required
      />

      <input
        placeholder="Product ID"
        value={form.productId}
        onChange={(e) =>
          setForm({ ...form, productId: e.target.value })
        }
        required
      />

      <input
        placeholder="Slug"
        value={form.slug}
        onChange={(e) =>
          setForm({ ...form, slug: e.target.value })
        }
        required
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        rows={3}
        required
      />

      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
        required
      />

      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
      />

      <input
        placeholder="Car Model"
        value={form.carModel}
        onChange={(e) =>
          setForm({ ...form, carModel: e.target.value })
        }
      />

      {/* ✅ IMAGE FROM PC */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />

      <button type="submit">Add Product</button>
    </form>
  );
};

export default AddProductPage;
