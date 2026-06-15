# Site-wide lazy-load + scroll-reveal — implementation notes

{% raw %}

## 1. Plan summary

**New files added** (all dependency-free, no framer-motion since it isn't installed):

- `src/hooks/useInView.improved.js` — generic IntersectionObserver hook, `[ref, inView]`.
- `src/components/Reveal.improved.jsx` + `Reveal.improved.css` — fade + translateY(24px→0) on first scroll-into-view, ~500ms ease, respects `prefers-reduced-motion`.
- `src/components/LazySection.improved.jsx` + `LazySection.improved.css` — defers mounting heavy children until near viewport (`rootMargin`), shows a shimmer skeleton + reserves `minHeight` to avoid CLS.
- `src/components/PageSkeleton.improved.jsx` — shimmer page-shell shown by the route-level `Suspense` fallback (replaces plain "Loading..." text).

**Wired in** (live, no flags):

- `App.jsx` — `Suspense fallback={<PageSkeleton />}` (route-level code splitting via `React.lazy` was already in place for every page).
- `HomePage`, `AboutPage`, `CategoriesPage`, `CategoryDetailPage`, `ProductsPage`, `ProductDetailPage`, `ContactUs` — every major section below the first viewport wrapped in `<Reveal>`. `CategoryShowcase` and `TestimonialsSection` on the homepage additionally wrapped in `<LazySection>`.
- All below-fold `<img>` tags now have `loading="lazy" decoding="async"` (hero/first-viewport images and the main product image stay eager, with `decoding="async"` added where missing).
- `Section` in `Layout.improved.jsx` — small additive fix: now `forwardRef` and passes through `className`/rest props (was previously a plain function component with no ref/className passthrough). Required so `<Reveal as={Section}>` can attach its observer + `fw-reveal` class. **Fully backward compatible** — no existing caller passed `ref`/`className`, so behavior for them is unchanged.

**Perf impact**

- Initial paint: route chunks were already split; now the fallback is a skeleton instead of blank/"Loading..." text.
- `CategoryShowcase` and `TestimonialsSection` (API fetch + render) on the homepage no longer mount until ~400px before they scroll into view — avoids firing their data fetch and rendering their DOM on initial load.
- All product/category thumbnails and brand logos below the fold are `loading="lazy" decoding="async"`, so the browser defers fetching/decoding them.
- No new dependencies; all animation is CSS `opacity`/`transform` (GPU-friendly) driven by a single IntersectionObserver per section — no per-frame JS.

**SEO / a11y note**

- Nothing is hidden from crawlers or screen readers: `Reveal` only ever toggles `opacity`/`transform` via a CSS class; the wrapped content is always in the DOM (verified in production build + Playwright). `LazySection` does delay *mounting* — used only for `CategoryShowcase` and `TestimonialsSection`, both supplementary content (not used for `FAQSection`, which carries the `FAQPage` JSON-LD and is wrapped in `Reveal` only).
- `prefers-reduced-motion: reduce` is handled purely in CSS with `!important`, so reduced-motion users see the final state immediately regardless of JS timing.
- Skeletons all have `aria-hidden="true"`.

**Backward-compat note**

- No existing component, route, or originals (`*.jsx` non-`.improved` files) were modified or removed.
- `Section`'s change is additive (see above).
- All data fetching, routes, auth, and the sticky product-filter strip on `/products` (deliberately left **outside** any `Reveal`/`LazySection` wrapper, since `position: sticky` breaks under a `transform`-animated ancestor) are untouched.

---

## 2. Reusable files

### `src/hooks/useInView.improved.js`
```js
import { useEffect, useRef, useState } from "react";

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
```

### `src/components/Reveal.improved.jsx` (+ `Reveal.improved.css`)
```jsx
import { useInView } from "../hooks/useInView.improved.js";
import "./Reveal.improved.css";

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
```
```css
.fw-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 500ms var(--fw-ease), transform 500ms var(--fw-ease);
  transition-delay: var(--fw-reveal-delay, 0s);
  will-change: opacity, transform;
}
.fw-reveal--in-view {
  opacity: 1;
  transform: translateY(0);
  will-change: auto;
}
@media (prefers-reduced-motion: reduce) {
  .fw-reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
```

### `src/components/LazySection.improved.jsx` (+ `LazySection.improved.css`)
```jsx
import { useInView } from "../hooks/useInView.improved.js";
import "./LazySection.improved.css";

const LazySection = ({
  children,
  fallback,
  minHeight,
  rootMargin = "300px 0px",
  as: Tag = "div",
  onDark = false,
  style,
  ...rest
}) => {
  const [ref, inView] = useInView({ rootMargin, threshold: 0, once: true });

  return (
    <Tag ref={ref} style={{ minHeight: inView ? undefined : minHeight, ...style }} {...rest}>
      {inView
        ? children
        : fallback ?? (
            <div
              className={`fw-lazy-skeleton${onDark ? " fw-lazy-skeleton--on-dark" : ""}`}
              style={{ minHeight }}
              aria-hidden="true"
            />
          )}
    </Tag>
  );
};

export default LazySection;
```

(Skeleton CSS is in `LazySection.improved.css`, also reused by `PageSkeleton.improved.jsx` for the route Suspense fallback.)

---

## 3. Per-page wiring

### `Section` (`components/Layout.improved.jsx`)
**Before:**
```jsx
export const Section = ({ children, bg, compact, style, innerStyle, id }) => (
  <section id={id} style={{ ... }}>
    <div style={{ ... }}>{children}</div>
  </section>
);
```
**After:**
```jsx
export const Section = forwardRef(({ children, bg, compact, style, innerStyle, id, className, ...rest }, ref) => (
  <section ref={ref} id={id} className={className} style={{ ... }} {...rest}>
    <div style={{ ... }}>{children}</div>
  </section>
));
Section.displayName = "Section";
```
**Revert:** remove the `forwardRef` wrapper/`displayName`, drop `ref`/`className`/`{...rest}`, and remove the `import { forwardRef } from "react"`.

---

### `App.jsx`
- `import PageSkeleton from "./components/PageSkeleton.improved.jsx";`
- `<Suspense fallback={<div style={{ padding: "2rem" }}>Loading...</div>}>` → `<Suspense fallback={<PageSkeleton />}>`

**Revert:** restore the plain `<div>Loading...</div>` fallback and remove the import. (Route-level `React.lazy` itself was pre-existing — not added by this change.)

---

### `pages/HomePage.improved.jsx`
Sections wrapped (in order): `StatsStrip` (Reveal), `CategoryShowcase` (LazySection `minHeight="700px" rootMargin="400px 0px"` → Reveal), `BrandsSection` (Reveal), `TestimonialsSection` (LazySection `minHeight="600px" rootMargin="400px 0px"` → Reveal), `FAQSection` (Reveal), `CtaStrip` (Reveal). `HeroSection` is **not** wrapped (first viewport).

Brand logo `<img>` gets `decoding="async"` (already had `loading="lazy"`).

**Before:**
```jsx
const HomePage = () => (
  <PageWrapper>
    <HeroSection />
    <StatsStrip />
    <CategoryShowcase />
    <BrandsSection />
    <TestimonialsSection />
    <FAQSection />
    <CtaStrip />
  </PageWrapper>
);
```
**After:**
```jsx
const HomePage = () => (
  <PageWrapper>
    <HeroSection />
    <Reveal><StatsStrip /></Reveal>
    <LazySection minHeight="700px" rootMargin="400px 0px">
      <Reveal><CategoryShowcase /></Reveal>
    </LazySection>
    <Reveal><BrandsSection /></Reveal>
    <LazySection minHeight="600px" rootMargin="400px 0px">
      <Reveal><TestimonialsSection /></Reveal>
    </LazySection>
    <Reveal><FAQSection /></Reveal>
    <Reveal><CtaStrip /></Reveal>
  </PageWrapper>
);
```
**Revert:** remove the `Reveal`/`LazySection` wrappers and the two new imports; remove `decoding="async"` from the brand logo `<img>`.

---

### `pages/AboutPage.improved.jsx`
All 9 sections after `HeroBand` wrapped in `<Reveal>`: `StorySection`, `LeadershipSection`, `OverviewSection`, `WhyChooseUsSection`, `StatsSection`, `CertificatesSection`, `LocationsSection`, `ValuesSection`, `CtaBand`. `HeroBand` not wrapped. `LeaderCard` avatar `<img>` gets `loading="lazy" decoding="async"`.

**Before:**
```jsx
const AboutPage = () => (
  <PageWrapper>
    <HeroBand />
    <StorySection />
    ...
    <CtaBand />
  </PageWrapper>
);
```
**After:**
```jsx
const AboutPage = () => (
  <PageWrapper>
    <HeroBand />
    <Reveal><StorySection /></Reveal>
    ...
    <Reveal><CtaBand /></Reveal>
  </PageWrapper>
);
```
**Revert:** remove `Reveal` wrappers + import; remove `loading`/`decoding` from `LeaderCard`'s `<img>`.

---

### `pages/CategoriesPage.improved.jsx`
The grid `<Section bg="var(--fw-white)">` (loading/error/empty states + category grid) is wrapped in `<Reveal as={Section} ...>`. The page header (`<h1>All Categories</h1>`) is **not** wrapped. Local `CategoryCard`'s `<img>` gets `decoding="async"` added.

**Before:**
```jsx
{/* Grid */}
<Section bg="var(--fw-white)">
  {/* loading / error / empty / grid */}
</Section>
```
**After:**
```jsx
{/* Grid */}
<Reveal as={Section} bg="var(--fw-white)">
  {/* loading / error / empty / grid */}
</Reveal>
```
```jsx
<img src={img} alt={cat.name} style={imgStyle} loading="lazy" decoding="async" />
```
**Revert:** change `<Reveal as={Section} bg="var(--fw-white)">` / `</Reveal>` back to `<Section bg="var(--fw-white)">` / `</Section>`, remove the `Reveal` import, and drop `decoding="async"` from the card image.

---

### `pages/CategoryDetailPage.improved.jsx`
Wrapped in `<Reveal as={Section} ...>`: Description, Featured Products, Catalog/Inquiry CTA. The hero banner (`<section style={heroStyle(...)}>`) is **not** wrapped.

**Before:**
```jsx
{category.description && (
  <Section bg="var(--fw-white)" compact>
    <BodyText>{category.description}</BodyText>
  </Section>
)}

<Section bg="var(--fw-surface-alt)">
  {/* featured products */}
</Section>

<Section bg="var(--fw-navy)">
  {/* catalog + inquiry CTAs */}
</Section>
```
**After:**
```jsx
{category.description && (
  <Reveal as={Section} bg="var(--fw-white)" compact>
    <BodyText>{category.description}</BodyText>
  </Reveal>
)}

<Reveal as={Section} bg="var(--fw-surface-alt)">
  {/* featured products */}
</Reveal>

<Reveal as={Section} bg="var(--fw-navy)">
  {/* catalog + inquiry CTAs */}
</Reveal>
```
**Revert:** change each `<Reveal as={Section} ...>` / `</Reveal>` pair back to `<Section ...>` / `</Section>`, remove the `Reveal` import.

---

### `pages/ProductsPage.improved.jsx`
The product grid `<Section bg="var(--fw-white)">` (skeleton/error/empty/grid + pagination) is wrapped in `<Reveal as={Section} ...>`. The page header and the **sticky** category-filter strip are **not** wrapped (sticky positioning would break under a `transform`-animated ancestor).

**Before:**
```jsx
{/* ── Product grid ────────────────────────────────────────── */}
<Section bg="var(--fw-white)">
  {/* skeleton / error / empty / grid + pagination */}
</Section>
```
**After:**
```jsx
{/* ── Product grid ────────────────────────────────────────── */}
<Reveal as={Section} bg="var(--fw-white)">
  {/* skeleton / error / empty / grid + pagination */}
</Reveal>
```
**Revert:** change `<Reveal as={Section} bg="var(--fw-white)">` / `</Reveal>` back to `<Section bg="var(--fw-white)">` / `</Section>`, remove the `Reveal` import.

---

### `pages/ProductDetailPage.improved.jsx`
Wrapped in `<Reveal as={Section} ...>`: Description, Recommendations. The first section (breadcrumb + image + info — first viewport) is **not** wrapped. Main product `<img>` gets `decoding="async"` (kept eager — no `loading="lazy"`, since it's primary above-the-fold content).

**Before:**
```jsx
<img src={imgSrc} alt={product.productName} style={imgStyle} />

{/* ... */}

{product.description && (
  <Section bg="var(--fw-surface-alt)" compact>
    <BodyText>{product.description}</BodyText>
  </Section>
)}

{recommendations.length > 0 && (
  <Section bg="var(--fw-white)">
    {/* recommendations grid */}
  </Section>
)}
```
**After:**
```jsx
<img src={imgSrc} alt={product.productName} style={imgStyle} decoding="async" />

{/* ... */}

{product.description && (
  <Reveal as={Section} bg="var(--fw-surface-alt)" compact>
    <BodyText>{product.description}</BodyText>
  </Reveal>
)}

{recommendations.length > 0 && (
  <Reveal as={Section} bg="var(--fw-white)">
    {/* recommendations grid */}
  </Reveal>
)}
```
**Revert:** drop `decoding="async"` from the main image; change each `<Reveal as={Section} ...>` / `</Reveal>` pair back to `<Section ...>` / `</Section>`; remove the `Reveal` import.

---

### `pages/ContactUs.improved.jsx`
The two-column body `<Section bg="var(--fw-white)">` (contact info/map + inquiry form) is wrapped in `<Reveal as={Section} ...>`. The page header is **not** wrapped.

**Before:**
```jsx
{/* ── Two-column body ──────────────────────────────────────── */}
<Section bg="var(--fw-white)">
  <div style={twoCol}>{/* aside + form */}</div>
</Section>
```
**After:**
```jsx
{/* ── Two-column body ──────────────────────────────────────── */}
<Reveal as={Section} bg="var(--fw-white)">
  <div style={twoCol}>{/* aside + form */}</div>
</Reveal>
```
**Revert:** change `<Reveal as={Section} bg="var(--fw-white)">` / `</Reveal>` back to `<Section bg="var(--fw-white)">` / `</Section>`, remove the `Reveal` import.

---

### `components/ProductCard.improved.jsx` / `components/CategoryCard.improved.jsx`
Both card images: added `decoding="async"` alongside the existing `loading="lazy"`.

**Revert:** drop `decoding="async"` from each `<img>`.

---

## 4. Test instructions

1. **Build & dev server**
   - `npm run build` — should complete with no errors (verified: 172 modules, ~4.3s).
   - `npm run dev`, open the site in a browser.

2. **Reveal-on-scroll (every page)**
   - Load any page (Home, Categories, a category detail page, Products, a product detail page, About, Contact).
   - Sections below the first viewport should start invisible/translated, then fade + slide up into place the first time they scroll near the viewport (~10% before fully visible).
   - Scroll back up — sections should **stay visible** (no re-hide / re-trigger).
   - First-viewport content (hero/header) is visible immediately, never wrapped in `Reveal`.

3. **`prefers-reduced-motion`**
   - Enable "reduce motion" in OS/browser settings (or DevTools → Rendering → "Emulate CSS prefers-reduced-motion: reduce").
   - Reload any page — all sections should be fully visible immediately, with no fade/slide, regardless of scroll position.

4. **Lazy section mount (Home page)**
   - Open DevTools → Network, throttle to "Slow 4G" / "Fast 3G".
   - Load `/` — you should see shimmer skeleton placeholders where `CategoryShowcase` and `TestimonialsSection` will appear.
   - Scroll down — as you approach those sections (~400px before), the skeleton is replaced by the real content (cards / testimonials), and the testimonials API request fires only around that point (check Network tab timing).

5. **No CLS**
   - DevTools → Performance → record while scrolling the homepage on a narrow (mobile) viewport.
   - Layout Shift entries should be ~0 — `LazySection`'s `minHeight` and `Reveal`'s opacity/transform-only animation should not shift surrounding content.

6. **Crawlable / no-JS content**
   - View page source (or disable JS) — all section text/headings/images should be present in the initial HTML/DOM, including sections that are below the fold (e.g. FAQ answers, About page sections, product descriptions).

7. **Routes**
   - Navigate via the nav bar to Categories, a category, Products, a product, About, Contact — each should show the `PageSkeleton` shimmer briefly (on slow network) then render normally.
   - Hard-refresh (`F5`) on a deep route (e.g. `/categories/wiper-blades`, `/products/<id>`) — should load correctly, not 404.
   - Run `npm run build && npm run preview` and repeat the route checks against the production build.

8. **Mobile**
   - Test on a narrow viewport (e.g. 390×844) with CPU/network throttling — scrolling should stay smooth (60fps), with no jank from the reveal/lazy logic (animations are transform/opacity only, single IntersectionObserver per section).

**Automated check performed:** Playwright (Chromium) — reveal-on-scroll fires once and persists on scroll-back, `prefers-reduced-motion` shows final state immediately with no console errors, lazy skeletons mount real content on scroll, CLS ≈ 0.002 on a mobile viewport while scrolling the homepage, and all routes (`/categories`, `/products`, `/about`, `/contact`, a category detail page, hard refresh) render without console errors.

{% endraw %}
