import { useState } from "react";
import { FaCartPlus, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { useInquiryCart } from "../contexts/InquiryCartContext.improved.jsx";
import "./Button.improved.css";
import "./AddToInquiryButton.improved.css";

/**
 * Add-to-Inquiry-List button. No prices — adds the product (qty 1,
 * or increments if already present) to the session inquiry list.
 *
 * Props:
 *   product   — product object ({ _id, productName, productId, imageUrl, category })
 *   variant   — "primary" | "secondary" | "ghost"  (default: "secondary")
 *   full / sm — size modifiers (ignored when floating)
 *   floating  — renders a small circular icon-only button, absolutely
 *               positioned by the parent (used as a ProductCard overlay)
 *   className / style — passthrough
 */
const AddToInquiryButton = ({
  product,
  variant = "secondary",
  full = false,
  sm = false,
  floating = false,
  className,
  style,
}) => {
  const { addItem, items } = useInquiryCart();
  const [justAdded, setJustAdded] = useState(false);

  const inList = items.some((i) => i.productId === product._id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setJustAdded(true);
    toast.success(`${product.productName} added to inquiry list`);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  if (floating) {
    const floatingCls = ["fw-add-inquiry-fab", className].filter(Boolean).join(" ");
    return (
      <button
        type="button"
        onClick={handleClick}
        className={floatingCls}
        style={style}
        aria-label={inList ? "In your inquiry list" : "Add to inquiry list"}
        title={inList ? "In your inquiry list" : "Add to inquiry list"}
      >
        {justAdded || inList ? <FaCheck /> : <FaCartPlus />}
      </button>
    );
  }

  const cls = [
    "fw-btn",
    `fw-btn--${variant}`,
    full && "fw-btn--full",
    sm && "fw-btn--sm",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button type="button" onClick={handleClick} className={cls} style={style}>
      {justAdded ? (
        <>
          <FaCheck aria-hidden="true" /> Added
        </>
      ) : inList ? (
        <>
          <FaCheck aria-hidden="true" /> In Inquiry List
        </>
      ) : (
        <>
          <FaCartPlus aria-hidden="true" /> Add to Inquiry
        </>
      )}
    </button>
  );
};

export default AddToInquiryButton;
