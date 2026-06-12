import { useMemo } from "react";
import "./Meteors.improved.css";

/* ── Variants ─────────────────────────────────────────────────────
   Colors are derived from the T20 design tokens via color-mix
   (same technique already used in Navbar.scrollaware.improved.css)
   so no new hex values are introduced.

   onDark  — for navy/blue sections   → whitish meteors
   onLight — for white/light sections → blue-navy meteors
────────────────────────────────────────────────────────────────── */

const VARIANTS = {
  onDark: {
    "--fw-meteor-color": "var(--fw-white)",
    "--fw-meteor-trail": "color-mix(in srgb, var(--fw-white) 65%, transparent)",
  },
  onLight: {
    "--fw-meteor-color": "var(--fw-navy-mid)",
    "--fw-meteor-trail": "color-mix(in srgb, var(--fw-navy-mid) 45%, transparent)",
  },
};

/* ── Meteors ──────────────────────────────────────────────────────
   variant         "onDark" | "onLight" — meteor color (default onDark)
   count           number of meteors on desktop (default 14)
   angle           streak angle in degrees (default 215, matches the
                   classic top-right -> bottom-left meteor direction)
   disableOnMobile hide all meteors below 768px (default true)
   className       extra class names for the wrapper

   Positions/timings are randomized once per mount via useMemo, then
   driven entirely by CSS animation — no per-frame re-renders.
────────────────────────────────────────────────────────────────── */

const Meteors = ({
  variant = "onDark",
  count = 14,
  angle = 215,
  disableOnMobile = true,
  className = "",
}) => {
  const meteors = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        left: `${Math.round(Math.random() * 100)}%`,
        top: `${Math.round(Math.random() * 20 - 10)}%`,
        delay: `${(Math.random() * 6).toFixed(2)}s`,
        duration: `${(5 + Math.random() * 5).toFixed(2)}s`,
      })),
    [count]
  );

  const wrapperStyle = {
    ...(VARIANTS[variant] || VARIANTS.onDark),
    "--fw-meteor-angle": `${angle}deg`,
  };

  const wrapperClass = [
    "fw-meteors",
    disableOnMobile && "fw-meteors--mobile-disabled",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClass} style={wrapperStyle} aria-hidden="true">
      {meteors.map((m, i) => (
        <span
          key={i}
          className="fw-meteor"
          style={{
            left: m.left,
            top: m.top,
            animationDelay: m.delay,
            animationDuration: m.duration,
          }}
        />
      ))}
    </div>
  );
};

export default Meteors;
