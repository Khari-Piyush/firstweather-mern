import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const EnquiryPage = () => {
  const { productId } = useParams();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await api.post("/enquiry", {
      ...form,
      productId
    });

    alert("Enquiry sent successfully!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Product Enquiry</h2>

      <input
        name="name"
        placeholder="Your Name"
        onChange={handleChange}
        required
      />

      <input
        name="phone"
        placeholder="Phone Number"
        onChange={handleChange}
        required
      />

      <textarea
        name="message"
        placeholder="Your Message"
        onChange={handleChange}
      />

      <button type="submit">Send Enquiry</button>
    </form>
  );
};

export default EnquiryPage;
