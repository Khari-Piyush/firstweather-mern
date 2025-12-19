import { useState } from "react";
import api from "../api";

const ContactUs = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/enquiry", form);
    alert("Thank you! We will contact you shortly.");
    setForm({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "1.5rem",
        background: "linear-gradient(180deg, #f0f7ff 0%, #ffffff 65%)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* LEFT – CONTACT INFO */}
        <div
          style={{
            background: "rgba(255,255,255,0.9)",
            borderRadius: "18px",
            padding: "1.5rem",
            boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginBottom: "0.5rem" }}>Get in Touch</h2>
          <p style={{ color: "#555", marginBottom: "1rem" }}>
            We’d love to hear from you
          </p>

          <p><b>Business Name:</b> First Weather</p>
          <p><b>Phone:</b> +91 7428088039</p>
          <p><b>Email:</b> connect@firstweather.in</p>

          <p style={{ marginTop: "0.5rem" }}>
            <b>Address:</b><br />
            WP-406 B, Wazirpur Village,<br />
            Ashok Vihar, Delhi – 110052
          </p>

          <p style={{ marginTop: "0.5rem" }}>
            ⏰ <b>Timings:</b><br />
            Mon–Sat: 9:30 AM – 8:00 PM<br />
            Sunday: Closed
          </p>

          {/* SOCIAL LINKS */}
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.75rem" }}>
            <a href="#" style={socialBtn}>Instagram</a>
            <a href="#" style={socialBtn}>Facebook</a>
          </div>

          {/* MAP */}
          <div style={{ marginTop: "1rem" }}>
            <iframe
              title="Office Location"
              src="https://www.google.com/maps?q=Ashok+Vihar+Delhi&output=embed"
              width="100%"
              height="200"
              style={{ border: 0, borderRadius: "12px" }}
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* RIGHT – FORM */}
        <form
          onSubmit={handleSubmit}
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "1.5rem",
            boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ marginBottom: "0.5rem" }}>Drop Us a Line</h2>
          <p style={{ color: "#555", marginBottom: "1rem" }}>
            Fill the form and our team will contact you
          </p>

          <input
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            style={input}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
            style={input}
          />

          <input
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            style={input}
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            style={{ ...input, resize: "vertical" }}
          />

          <button type="submit" style={submitBtn}>
            Submit Enquiry
          </button>
        </form>
      </div>
    </div>
  );
};

/* STYLES */
const input = {
  width: "100%",
  padding: "0.6rem",
  marginBottom: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #c7d2fe",
  fontSize: "0.95rem",
};

const submitBtn = {
  width: "100%",
  padding: "0.75rem",
  background: "linear-gradient(135deg, #2563eb, #1e40af)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontSize: "1rem",
  cursor: "pointer",
};

const socialBtn = {
  padding: "0.4rem 0.8rem",
  borderRadius: "999px",
  background: "#eff6ff",
  border: "1px solid #bfdbfe",
  textDecoration: "none",
  fontSize: "0.85rem",
  color: "#1e40af",
};

export default ContactUs;
