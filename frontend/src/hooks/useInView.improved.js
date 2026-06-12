import { useEffect, useRef, useState } from "react";

/* ── useInView ────────────────────────────────────────────────────
   Generic IntersectionObserver hook. Returns [ref, inView].

   - rootMargin: grow/shrink the viewport box used for the check
     (e.g. "200px 0px" to trigger before the element is on screen).
   - once: disconnect after the first intersection (default true).
   - Falls back to `inView = true` if IntersectionObserver isn't
     available, so content is never stuck hidden.
────────────────────────────────────────────────────────────────── */

export const useInView = ({ rootMargin = "0px", threshold = 0, once = true } = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return [ref, inView];
};
