import { useState } from "react";
import "./Marquee.improved.css";

/* ── Marquee ──────────────────────────────────────────────────────
   Pure-CSS infinite scrolling strip built from repeated copies of
   `children`. No framer-motion / Tailwind required — the loop runs
   on CSS keyframes + transform (GPU-friendly, transform-only).

   Props:
     reverse       - scroll in the opposite direction
     pauseOnHover  - pause the scroll while the pointer is over it
     vertical      - scroll top-to-bottom instead of left-to-right
     repeat        - number of duplicated groups (default 4 — enough
                      for the loop to tile seamlessly across most
                      viewport widths)
     duration      - CSS time for one full loop (default "40s")
     gap           - CSS gap between items and between groups
     fade          - add left/right gradient masks over the edges
     fadeColor     - solid colour the fade blends into (match the
                      section background it sits on)

   Respects prefers-reduced-motion: renders a single, non-animated,
   centred, wrapping set of `children` instead of the looping strip,
   so every item stays visible and nothing moves.
────────────────────────────────────────────────────────────────── */

const Marquee = ({
  children,
  className = "",
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  duration = "40s",
  gap = "1rem",
  fade = false,
  fadeColor,
  style,
  ...rest
}) => {
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  const cssVars = {
    "--fw-marquee-duration": duration,
    "--fw-marquee-gap": gap,
    ...(fadeColor ? { "--fw-marquee-fade-color": fadeColor } : null),
    ...style,
  };

  if (reducedMotion) {
    return (
      <div className={`fw-marquee fw-marquee--static ${className}`.trim()} style={cssVars} {...rest}>
        {children}
      </div>
    );
  }

  const groupClass = [
    "fw-marquee__group",
    vertical ? "fw-marquee__group--vertical" : "fw-marquee__group--row",
    reverse ? "fw-marquee__group--reverse" : "",
  ].filter(Boolean).join(" ");

  const outerClass = [
    "fw-marquee",
    vertical ? "fw-marquee--vertical" : "",
    pauseOnHover ? "fw-marquee--pause-on-hover" : "",
    fade ? "fw-marquee--fade" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={outerClass} style={cssVars} {...rest}>
      {Array.from({ length: repeat }).map((_, i) => (
        <div className={groupClass} key={i} aria-hidden={i > 0 ? "true" : undefined}>
          {children}
        </div>
      ))}
    </div>
  );
};

export default Marquee;
