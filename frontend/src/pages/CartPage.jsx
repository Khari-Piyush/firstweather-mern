import { useContext, useState } from "react";
import { CartContext } from "../contexts/CartContext.jsx";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";

const CartPage = () => {
  const { items, updateQty, removeItem, totalAmount, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // form state
  const [customerName, setCustomerName] = useState(user ? (user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.firstName) : "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // inside CartPage.jsx — replace existing handlePlaceEnquiry with this
  const handlePlaceEnquiry = async () => {
    setError("");
    if (!user) return navigate("/login");
    if (!items || items.length === 0) return setError("Your cart is empty");

    // Normalize/migrate items so backend ALWAYS gets: product, productId, name, price, qty
    const normalizedItems = items.map((it) => {
      const productIdFromItem = it.product || it._id || it.id || it.productId || null;
      const name = it.name || it.productName || it.product_name || "";
      const price = Number(it.price ?? it.unitPrice ?? 0);
      const qty = Number(it.qty ?? it.quantity ?? 1);

      return {
        product: productIdFromItem,
        productId: it.productId || it.slug || productIdFromItem || "",
        name,
        price,
        qty,
      };
    });

    // client-side validation
    for (const [i, it] of normalizedItems.entries()) {
      if (!it.product || !it.name || it.price == null || it.qty == null) {
        setError(`Item at index ${i} is missing required fields (product, name, price, qty)`);
        return;
      }
      // optionally ensure qty > 0
      if (it.qty <= 0) {
        setError(`Invalid qty for item index ${i}`);
        return;
      }
    }

    const payload = {
      items: normalizedItems,
      customerName,
      customerPhone,
      customerAddress,
    };

    console.log("DEBUG: POST /api/orders payload:", payload); // remove after debugging

    try {
      setLoading(true);
      const res = await api.post("/orders", payload);
      setSuccessMsg("Enquiry submitted successfully");
      clearCart();
      navigate("/orders"); // or /admin/orders depending on your flow
    } catch (err) {
      console.error("Place enquiry error:", err);
      setError(err.response?.data?.message || "Server error creating order");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{ padding: "1rem", maxWidth: 900, margin: "0 auto" }}>
      <h2>Your Cart</h2>

      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div>
            {items.map((it) => (
              <div key={it.product} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
                {it.imageUrl && <img src={it.imageUrl} alt={it.productName} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 6 }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold" }}>{it.productName}</div>
                  <div>₹{it.price} x {it.qty} = ₹{it.price * it.qty}</div>
                  <div style={{ marginTop: 8 }}>
                    <button onClick={() => updateQty(it.product, Math.max(1, it.qty - 1))}>-</button>
                    <span style={{ margin: "0 0.5rem" }}>{it.qty}</span>
                    <button onClick={() => updateQty(it.product, it.qty + 1)}>+</button>
                    <button onClick={() => removeItem(it.product)} style={{ marginLeft: 12, color: "red" }}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, textAlign: "right", fontWeight: "bold" }}>
            Total: ₹{totalAmount}
          </div>

          <div style={{ marginTop: 20 }}>
            <h3>Customer Details</h3>
            <div style={{ display: "grid", gap: 8, maxWidth: 480 }}>
              <input placeholder="Full name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              <input placeholder="Phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              <textarea placeholder="Address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} rows={3} />
              {error && <div style={{ color: "red" }}>{error}</div>}
              {successMsg && <div style={{ color: "green" }}>{successMsg}</div>}
              <button disabled={loading} onClick={handlePlaceEnquiry}>
                {loading ? "Placing..." : "Place Enquiry"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
