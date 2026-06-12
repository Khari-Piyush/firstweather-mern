import Meteors from "./Meteors.improved.jsx";

/* ── MeteorBackground ─────────────────────────────────────────────
   Drops a subtle Meteors layer behind its children, inside a
   section that already owns the background color. The parent
   section must have `position: relative` (and ideally
   `overflow: hidden`) so the meteor layer's `inset: 0` covers the
   section's full padded box and its background shows through:

     <Section bg="var(--fw-navy)" style={{ position: "relative", overflow: "hidden" }}>
       <MeteorBackground variant="onDark">
         ...section content...
       </MeteorBackground>
     </Section>

   The meteor layer is absolutely positioned, pointer-events: none,
   and z-index: 0 — it never affects layout (no CLS) and never
   blocks clicks/taps. Children are stacked above it via z-index: 1.
────────────────────────────────────────────────────────────────── */

const MeteorBackground = ({
  children,
  variant = "onDark",
  count = 14,
  angle,
  disableOnMobile = true,
}) => (
  <>
    <Meteors
      variant={variant}
      count={count}
      angle={angle}
      disableOnMobile={disableOnMobile}
    />
    <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
  </>
);

export default MeteorBackground;
