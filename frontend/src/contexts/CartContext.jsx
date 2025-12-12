import React, { createContext, useEffect, useReducer } from "react";

export const CartContext = createContext(null);

const CART_KEY = "fw_cart";

const initialState = {
  items: [], // { product, productId, name, price, qty, imageUrl }
};

// Reducer
function cartReducer(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, items: action.payload || [] };

    case "ADD_ITEM": {
      const item = action.payload;
      const existing = state.items.find((i) => i.product === item.product);
      let items;
      if (existing) {
        items = state.items.map((i) =>
          i.product === item.product ? { ...i, qty: i.qty + (item.qty || 1) } : i
        );
      } else {
        items = [{ ...item, qty: item.qty || 1 }, ...state.items];
      }
      return { ...state, items };
    }

    case "UPDATE_QTY": {
      const { product, qty } = action.payload;
      const items = state.items
        .map((i) => (i.product === product ? { ...i, qty } : i))
        .filter((i) => i.qty > 0);
      return { ...state, items };
    }

    case "REMOVE_ITEM": {
      const product = action.payload;
      const items = state.items.filter((i) => i.product !== product);
      return { ...state, items };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // init from localStorage
  useEffect(() => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const migrated = parsed.map((it) => {
        const productIdFromItem = it.product || it._id || it.id || it.productId || null;
        return {
          product: productIdFromItem,
          productId: it.productId || it.slug || productIdFromItem,
          name: it.name || it.productName || it.productName || "",
          price: Number(it.price || it.unitPrice || 0),
          qty: Number(it.qty || it.quantity || 1),
          imageUrl: it.imageUrl || it.img || "",
        };
      });
      dispatch({ type: "INIT", payload: migrated });
    }
  } catch (e) {
    console.error("Failed to load/migrate cart:", e);
  }
}, []);


  // persist
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(state.items));
    } catch (e) {
      console.error("Failed to save cart:", e);
    }
  }, [state.items]);

  // Actions
  const addItem = (item) => dispatch({ type: "ADD_ITEM", payload: item });
  const updateQty = (product, qty) => dispatch({ type: "UPDATE_QTY", payload: { product, qty } });
  const removeItem = (product) => dispatch({ type: "REMOVE_ITEM", payload: product });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const cartCount = state.items.reduce((s, it) => s + it.qty, 0);
  const totalAmount = state.items.reduce((s, it) => s + it.price * it.qty, 0);

  return (
    <CartContext.Provider value={{ items: state.items, addItem, updateQty, removeItem, clearCart, cartCount, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};
