import { Fragment, useEffect, useRef, useState } from "react";
import "./KineticText.improved.css";

/* ── useInView ────────────────────────────────────────────────────
   Fires once when the element scrolls into view. Skips straight to
   "in view" under prefers-reduced-motion (handled separately below).
────────────────────────────────────────────────────────────────── */

const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

const STAGGER_STEP = 0.015; // seconds between each character

/* ── KineticText ──────────────────────────────────────────────────
   Splits `text` into per-character spans that fade and slide in
   once, when scrolled into view. Renders as `as` (default "span"),
   so it can be dropped inside an existing heading element without
   changing that heading's tag, font size, color or weight — all
   typography is inherited from the parent.

   Under prefers-reduced-motion, renders plain static text only.
────────────────────────────────────────────────────────────────── */

const KineticText = ({ text, className = "", as: Tag = "span" }) => {
  const [ref, inView] = useInView();
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  if (reducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(" ");
  let charIndex = 0;

  return (
    <Tag
      ref={ref}
      className={`${className} fw-kinetic${inView ? " fw-kinetic--in-view" : ""}`.trim()}
      aria-label={text}
    >
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <Fragment key={wi}>
            <span className="fw-kinetic-word">
              {[...word].map((char, ci) => {
                const delay = charIndex * STAGGER_STEP;
                charIndex += 1;
                return (
                  <span
                    key={ci}
                    className="fw-kinetic-char"
                    style={{ "--fw-kinetic-delay": `${delay}s` }}
                  >
                    {char}
                  </span>
                );
              })}
            </span>
            {wi < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
};

export default KineticText;
