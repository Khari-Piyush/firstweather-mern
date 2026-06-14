import { createContext, useContext, useEffect, useState } from "react";

export const InquiryCartContext = createContext(null);

const STORAGE_KEY = "fw_inquiry_cart";

// Session-scoped (per-tab) inquiry list — mirrors AuthContext's
// localStorage read/write pattern but uses sessionStorage so the
// list does not persist across browser sessions/tabs.
const readCart = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const InquiryCartProvider = ({ children }) => {
  const [items, setItems] = useState(readCart);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // sessionStorage unavailable (e.g. private mode) — cart stays in-memory
    }
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product._id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product._id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          code: product.productId || "",
          name: product.productName,
          imageUrl: product.imageUrl || "",
          category: product.category || "",
          qty,
        },
      ];
    });
  };

  const updateQty = (productId, qty) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty } : i))
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <InquiryCartContext.Provider
      value={{
        items,
        itemCount,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        drawerOpen,
        openDrawer: () => setDrawerOpen(true),
        closeDrawer: () => setDrawerOpen(false),
      }}
    >
      {children}
    </InquiryCartContext.Provider>
  );
};

export const useInquiryCart = () => useContext(InquiryCartContext);
