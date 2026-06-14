import { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTimes, FaTrash, FaMinus, FaPlus, FaClipboardList } from "react-icons/fa";
import { useInquiryCart } from "../contexts/InquiryCartContext.improved.jsx";
import { SecondaryButton } from "./Button.improved.jsx";
import "./InquiryCartDrawer.improved.css";

const optimizeImg = (url) =>
  url ? url.replace("/upload/", "/upload/w_120,f_auto,q_auto/") : null;

const InquiryCartDrawer = () => {
  const { items, itemCount, updateQty, removeItem, clearCart, drawerOpen, closeDrawer } =
    useInquiryCart();

  // Lock page scroll while the drawer is open
  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
    }
  }, [drawerOpen]);

  return (
    <>
      <div
        className={`fw-cart-drawer__backdrop${drawerOpen ? " fw-cart-drawer__backdrop--open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside
        className={`fw-cart-drawer${drawerOpen ? " fw-cart-drawer--open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Inquiry list"
      >
        <div className="fw-cart-drawer__header">
          <h2 className="fw-cart-drawer__title">
            Inquiry List {itemCount > 0 && <span>({itemCount})</span>}
          </h2>
          <button
            type="button"
            className="fw-cart-drawer__close"
            onClick={closeDrawer}
            aria-label="Close inquiry list"
          >
            <FaTimes />
          </button>
        </div>

        <div className="fw-cart-drawer__body">
          {items.length === 0 ? (
            <div className="fw-cart-drawer__empty">
              <FaClipboardList aria-hidden="true" />
              <p>Your inquiry list is empty.</p>
              <Link to="/products" className="fw-btn fw-btn--primary" onClick={closeDrawer}>
                Browse Products
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div className="fw-cart-drawer__item" key={item.productId}>
                <img
                  className="fw-cart-drawer__item-img"
                  src={optimizeImg(item.imageUrl) || "/fw-logo-blue.webp"}
                  alt={item.name}
                  loading="lazy"
                />
                <div className="fw-cart-drawer__item-info">
                  <p className="fw-cart-drawer__item-name">{item.name}</p>
                  {item.code && <p className="fw-cart-drawer__item-code">{item.code}</p>}

                  <div className="fw-cart-drawer__qty">
                    <button
                      type="button"
                      className="fw-cart-drawer__qty-btn"
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      disabled={item.qty <= 1}
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <FaMinus />
                    </button>
                    <span className="fw-cart-drawer__qty-value">{item.qty}</span>
                    <button
                      type="button"
                      className="fw-cart-drawer__qty-btn"
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="fw-cart-drawer__remove"
                  onClick={() => removeItem(item.productId)}
                  aria-label={`Remove ${item.name} from inquiry list`}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="fw-cart-drawer__footer">
            <p className="fw-cart-drawer__note">
              No prices listed — our team will share the best price after reviewing your list.
            </p>
            <SecondaryButton sm onClick={clearCart}>
              Clear All
            </SecondaryButton>
            <Link to="/inquiry" className="fw-btn fw-btn--primary fw-btn--full" onClick={closeDrawer}>
              View Inquiry List
            </Link>
          </div>
        )}
      </aside>
    </>
  );
};

export default InquiryCartDrawer;
