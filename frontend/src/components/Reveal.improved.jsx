import { useInView } from "../hooks/useInView.improved.js";
import "./Reveal.improved.css";

/* ── Reveal ───────────────────────────────────────────────────────
   Wraps a section so it fades + slides up into place once, the
   first time it scrolls within `margin` of the viewport. Content
   is always rendered — only opacity/transform are animated, so it
   stays in the DOM and readable regardless of JS/animation state.

   Props:
   - as: tag to render (default "div")
   - delay: optional stagger delay in ms
   - margin: IntersectionObserver rootMargin (default "-10% 0px",
     matching framer-motion's whileInView margin convention)

   Respects prefers-reduced-motion (content shows immediately,
   no animation) — see Reveal.improved.css.
────────────────────────────────────────────────────────────────── */

const Reveal = ({ children, as: Tag = "div", delay = 0, margin = "-10% 0px", className = "", style, ...rest }) => {
  const [ref, inView] = useInView({ rootMargin: margin, threshold: 0.1 });

  return (
    <Tag
      ref={ref}
      className={`fw-reveal${inView ? " fw-reveal--in-view" : ""}${className ? ` ${className}` : ""}`}
      style={{ "--fw-reveal-delay": `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
