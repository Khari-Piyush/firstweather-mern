import { Link } from "react-router-dom";
import "./Button.improved.css";

/**
 * Thin wrapper that always shows "Get Best Price" and fires the enquiry_click
 * gtag event. Routing is derived from props — no navigate() needed at call sites.
 *
 * Props:
 *   productId    — MongoDB _id; routes to /enquire/:productId
 *   productName  — displayed in the form pre-fill (passed as URL param)
 *   category     — category name; used when no productId
 *   to           — explicit URL override (skips all derivation)
 *   variant      — "primary" | "secondary" | "ghost"  (default: "primary")
 *   full / sm    — size modifiers
 *   className / style — passthrough
 */
const GetBestPriceButton = ({
  productId,
  productName,
  category,
  to,
  variant   = "primary",
  full      = false,
  sm        = false,
  className,
  style,
}) => {
  const cls = [
    "fw-btn",
    `fw-btn--${variant}`,
    full && "fw-btn--full",
    sm   && "fw-btn--sm",
    className,
  ].filter(Boolean).join(" ");

  const href = to
    || (productId
          ? `/enquire/${productId}${productName ? `?productName=${encodeURIComponent(productName)}` : ""}`
          : category
            ? `/contact?category=${encodeURIComponent(category)}`
            : "/contact");

  const handleClick = () => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "enquiry_click", {
        event_category: "engagement",
        event_label: "get_best_price",
      });
    }
  };

  return (
    <Link to={href} className={cls} style={style} onClick={handleClick}>
      Get Best Price
    </Link>
  );
};

export default GetBestPriceButton;
