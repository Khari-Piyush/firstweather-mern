import { Link } from "react-router-dom";
import "./Button.improved.css";

/**
 * PrimaryButton — "Send Inquiry" and other primary actions.
 * SecondaryButton — "Download Catalog" / "Request Catalog".
 * GhostButton — secondary actions on dark/hero backgrounds.
 *
 * Each accepts: children, onClick, to (React Router), href (external),
 * disabled, full (full-width), sm (small size), className, style.
 */

const buildClass = (variant, { full, sm, className }) =>
  ["fw-btn", `fw-btn--${variant}`, full && "fw-btn--full", sm && "fw-btn--sm", className]
    .filter(Boolean)
    .join(" ");

export const PrimaryButton = ({ children, onClick, to, href, disabled, full, sm, className, style }) => {
  const cls = buildClass("primary", { full, sm, className });
  if (to)   return <Link to={to} className={cls} style={style}>{children}</Link>;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{children}</a>;
  return (
    <button onClick={onClick} disabled={disabled} className={cls} style={style}>
      {children}
    </button>
  );
};

export const SecondaryButton = ({ children, onClick, to, href, disabled, full, sm, className, style }) => {
  const cls = buildClass("secondary", { full, sm, className });
  if (to)   return <Link to={to} className={cls} style={style}>{children}</Link>;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{children}</a>;
  return (
    <button onClick={onClick} disabled={disabled} className={cls} style={style}>
      {children}
    </button>
  );
};

export const GhostButton = ({ children, onClick, to, href, disabled, full, sm, className, style }) => {
  const cls = buildClass("ghost", { full, sm, className });
  if (to)   return <Link to={to} className={cls} style={style}>{children}</Link>;
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" className={cls} style={style}>{children}</a>;
  return (
    <button onClick={onClick} disabled={disabled} className={cls} style={style}>
      {children}
    </button>
  );
};
