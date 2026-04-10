import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const ImageSearch = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!file) {
      toast.warn("Please upload a product image");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      const res = await api.post("/ai/search", formData);

      if (!res.data.length) {
        toast.error("No matching product found");
        return;
      }

      // 🔥 TOP MATCH
      const topProduct = res.data[0];

      toast.success(`Product detected: ${category}`);

      setTimeout(() => {
        navigate(`/products?category=${encodeURIComponent(category)}`);
      }, 1500);
    } catch (err) {
      toast.error("AI search failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>Search by Product Image</h3>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Analyzing image..." : "Find Product"}
      </button>
    </div>
  );
};

export default ImageSearch;
