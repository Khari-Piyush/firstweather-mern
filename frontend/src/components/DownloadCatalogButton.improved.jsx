import { Link } from "react-router-dom";
import "./Button.improved.css";

/**
 * Single source of truth for the catalog CTA.
 * catalogPdfUrl present  → "Download Full Catalog & Price List" (opens PDF)
 * catalogPdfUrl absent   → "Request Full Catalog" (routes to inquiry form pre-filled)
 *
 * Props:
 *   catalogPdfUrl  — string | null | undefined
 *   category       — display name passed as URL param for form pre-fill
 *   variant        — "primary" | "secondary" | "ghost"  (default: "secondary")
 *   full           — boolean, full-width
 *   sm             — boolean, small size
 *   className / style — passthrough
 */
const DownloadCatalogButton = ({
  catalogPdfUrl,
  category,
  variant = "secondary",
  full    = false,
  sm      = false,
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

  const requestUrl = `/contact?type=catalog${
    category ? `&category=${encodeURIComponent(category)}` : ""
  }`;

  if (catalogPdfUrl) {
    return (
      <a
        href={catalogPdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        style={style}
      >
        Download Full Catalog &amp; Price List
      </a>
    );
  }

  return (
    <Link to={requestUrl} className={cls} style={style}>
      Request Full Catalog
    </Link>
  );
};

export default DownloadCatalogButton;
