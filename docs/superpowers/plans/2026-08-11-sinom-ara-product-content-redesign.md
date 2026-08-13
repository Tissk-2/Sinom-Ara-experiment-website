# Sinom ARA Product Content Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace only the content below the existing bottle animation with a responsive editorial tasting journey that builds product trust and sends visitors to the verified Sinom ARA Instagram account.

**Architecture:** Keep `components/LandingContent.tsx` as the client boundary that registers Motion Components. Store verified copy in an immutable content module, render five semantic sections from a focused presentational component, and scope every new visual rule to the product content so the hero remains untouched. Motion is progressive enhancement and is verified alongside unit, integration, coverage, and Playwright browser tests.

**Tech Stack:** Next.js 16.3, React 19.2, TypeScript 5, Tailwind CSS 4, Motion Components 0.5, Vitest, Testing Library, Playwright.

## Global Constraints

- Do not modify `components/DrinkAnimation.tsx`, the bottle sequence, or its loading and scrolling behavior.
- Redesign only `components/LandingContent.tsx` and page-specific supporting files below the animation.
- Preserve the charcoal background, amber `#c9a96e` accent, and Outfit typeface.
- The only ingredients are young tamarind leaves, fresh turmeric, and palm sugar.
- Claims are limited to Javanese heritage, Malang origin, small-batch preparation, no artificial preservatives, and weekly brewing.
- Do not add prices, testimonials, stockists, certifications, phone numbers, health claims, checkout, or a new runtime dependency.
- Merge package and component edits into the dirty worktree; never overwrite or revert unrelated pre-existing user changes.
- The primary CTA must use `https://www.instagram.com/sinomaramalang/`.
- Motion Components must be progressive enhancement and respect `prefers-reduced-motion`.
- Maintain WCAG AA text contrast, visible focus, and a logical heading order below the existing `h1`.
- Maintain at least 80% statement, branch, function, and line coverage for new product component code.

## File map

- Create `components/product/productContent.ts` for immutable verified facts.
- Create `components/product/ProductSections.tsx` for the five semantic sections.
- Create `components/product/ProductSections.module.css` for product-only responsive styling and motion fallbacks.
- Modify `components/LandingContent.tsx` to register Motion Components and render the sections.
- Create `types/motion-elements.d.ts` for new custom-element JSX types.
- Modify `package.json` and `package-lock.json` only for test tooling and scripts.
- Create `vitest.config.ts`, `vitest.setup.ts`, unit tests, and integration tests.
- Create `playwright.config.ts`, `tests/e2e/product-content.spec.ts`, and reviewed visual snapshots.

---

### Task 1: Test harness and verified content contract

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `tests/unit/productContent.test.ts`
- Create: `components/product/productContent.ts`

**Interfaces:**
- Consumes: the factual limits in the approved specification.
- Produces: readonly `PRODUCT_FACTS`, `INGREDIENTS`, `TASTE_NOTES`, and `PROCESS_STEPS` exports.

- [ ] **Step 1: Install test-only dependencies and add scripts**

Run:

```bash
npm install --save-dev vitest @vitest/coverage-v8 vite @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @playwright/test
```

Add these scripts without removing the existing ones:

```json
{
  "test": "vitest run",
  "test:coverage": "vitest run --coverage",
  "test:e2e": "playwright test",
  "verify": "npm run lint && npm run test:coverage && npm run build && npm run test:e2e"
}
```

- [ ] **Step 2: Configure Vitest**

Create `vitest.config.ts`:

```ts
import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["components/product/**/*.{ts,tsx}", "components/LandingContent.tsx"],
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Write the failing unit contract**

Create `tests/unit/productContent.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  INGREDIENTS,
  PROCESS_STEPS,
  PRODUCT_FACTS,
  TASTE_NOTES,
} from "@/components/product/productContent";

describe("verified Sinom ARA content", () => {
  it("contains exactly the verified ingredients", () => {
    expect(INGREDIENTS.map(({ name }) => name)).toEqual([
      "Young tamarind leaves",
      "Fresh turmeric",
      "Palm sugar",
    ]);
  });

  it("uses the verified Instagram destination", () => {
    expect(PRODUCT_FACTS.instagramUrl).toBe(
      "https://www.instagram.com/sinomaramalang/",
    );
  });

  it("contains the approved taste and process vocabulary", () => {
    expect(TASTE_NOTES).toEqual(["Bright", "Earthy", "Rounded"]);
    expect(PROCESS_STEPS.map(({ title }) => title)).toEqual([
      "Fresh ingredients",
      "Small batches",
      "Brewed weekly",
    ]);
  });

  it("contains no unsupported health language", () => {
    const copy = JSON.stringify({
      PRODUCT_FACTS,
      INGREDIENTS,
      PROCESS_STEPS,
      TASTE_NOTES,
    });
    expect(copy).not.toMatch(
      /antioxid|vitamin|anti-inflammatory|digestive|glycemic|cure|heal/i,
    );
  });
});
```

- [ ] **Step 4: Run RED**

Run `npm test -- tests/unit/productContent.test.ts`.

Expected: FAIL because `components/product/productContent.ts` does not exist.

- [ ] **Step 5: Implement the immutable content model**

Create `components/product/productContent.ts`:

```ts
export type NumberedItem = Readonly<{
  number: "01" | "02" | "03";
  title: string;
  description: string;
}>;

export const PRODUCT_FACTS = Object.freeze({
  brand: "Sinom ARA",
  location: "Malang, East Java",
  originEyebrow: "Brewed in Malang",
  originHeading: "A Javanese classic, brewed for right now.",
  originBody:
    "Sinom ARA brings a familiar Javanese refreshment into a careful small-batch ritual. Three natural ingredients, no artificial preservatives, and no shortcuts.",
  ingredientHeading: "Three ingredients, held in balance.",
  tasteHeading: "Sweet. Sour. Earthy.",
  tasteBody:
    "Bright tamarind leaf meets turmeric warmth and the rounded sweetness of palm sugar. Refreshing, grounded, and unmistakably sinom.",
  orderEyebrow: "This week's batch",
  orderHeading: "Freshly brewed. Ready when the batch is.",
  orderBody:
    "Sinom ARA is brewed weekly in Malang. Ask about the current batch and order directly through Instagram.",
  orderLabel: "Order this week on Instagram",
  instagramUrl: "https://www.instagram.com/sinomaramalang/",
} as const);

export const INGREDIENTS = Object.freeze([
  Object.freeze({
    number: "01",
    name: "Young tamarind leaves",
    description: "A bright, clean sourness that gives sinom its unmistakable lift.",
  }),
  Object.freeze({
    number: "02",
    name: "Fresh turmeric",
    description: "Earthy warmth and a deep golden tone.",
  }),
  Object.freeze({
    number: "03",
    name: "Palm sugar",
    description: "A rounded caramel sweetness that brings the blend into balance.",
  }),
] as const);

export const TASTE_NOTES = Object.freeze(["Bright", "Earthy", "Rounded"] as const);

export const PROCESS_STEPS = Object.freeze<readonly NumberedItem[]>([
  Object.freeze({
    number: "01",
    title: "Fresh ingredients",
    description: "Young tamarind leaves, fresh turmeric, and palm sugar.",
  }),
  Object.freeze({
    number: "02",
    title: "Small batches",
    description: "Prepared with the attention a short ingredient list deserves.",
  }),
  Object.freeze({
    number: "03",
    title: "Brewed weekly",
    description: "Fresh batches made in Malang and announced on Instagram.",
  }),
]);
```

- [ ] **Step 6: Run GREEN and commit**

Run:

```bash
npm test -- tests/unit/productContent.test.ts
npm run test:coverage
```

Expected: four tests PASS and all coverage thresholds are at least 80%.

Commit:

```bash
git add package.json package-lock.json vitest.config.ts vitest.setup.ts tests/unit/productContent.test.ts components/product/productContent.ts
git commit -m "test: define verified product content contract"
```

---

### Task 2: Semantic editorial product journey

**Files:**
- Create: `tests/integration/LandingContent.test.tsx`
- Create: `components/product/ProductSections.tsx`
- Create: `components/product/ProductSections.module.css`
- Modify: `components/LandingContent.tsx`

**Interfaces:**
- Consumes: all readonly exports from `productContent.ts`.
- Produces: `ProductSections(): React.JSX.Element` and the stable hooks `#heritage`, `#ingredients`, `#taste-craft`, `#order`, and `[data-product-content]`.

- [ ] **Step 1: Write the failing integration contract**

Create `tests/integration/LandingContent.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LandingContent from "@/components/LandingContent";

vi.mock("motion-components", () => ({}));

describe("LandingContent", () => {
  it("renders the five-part editorial journey", () => {
    render(<LandingContent />);
    expect(screen.getByRole("heading", { name: "A Javanese classic, brewed for right now." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Three ingredients, held in balance." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sweet. Sour. Earthy." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Freshly brewed. Ready when the batch is." })).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("shows the verified ingredients and preparation facts", () => {
    render(<LandingContent />);
    for (const name of ["Young tamarind leaves", "Fresh turmeric", "Palm sugar"]) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
    expect(screen.getByText("Small batches")).toBeInTheDocument();
    expect(screen.getByText("Brewed weekly")).toBeInTheDocument();
  });

  it("uses one primary verified order action", () => {
    render(<LandingContent />);
    const link = screen.getByRole("link", { name: "Order this week on Instagram" });
    expect(link).toHaveAttribute("href", "https://www.instagram.com/sinomaramalang/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("removes unverified contact and health copy", () => {
    const { container } = render(<LandingContent />);
    expect(container.textContent).not.toMatch(/WhatsApp|wa\.me|antioxid|vitamin/i);
    expect(container.textContent).not.toMatch(/anti-inflammatory|digestive|glycemic/i);
  });
});
```

- [ ] **Step 2: Run RED**

Run `npm test -- tests/integration/LandingContent.test.tsx`.

Expected: FAIL on the approved headings and on the existing WhatsApp content.

- [ ] **Step 3: Build `ProductSections.tsx`**

Implement these exact section contracts in this order:

```tsx
import { INGREDIENTS, PROCESS_STEPS, PRODUCT_FACTS, TASTE_NOTES } from "./productContent";
import styles from "./ProductSections.module.css";

function SectionLabel({ children }: Readonly<{ children: React.ReactNode }>) {
  return <p className={styles.label}>{children}</p>;
}

export default function ProductSections() {
  return (
    <div data-product-content className={styles.surface}>
      <section id="heritage" aria-labelledby="origin-heading" className={styles.origin}>
        <div>
          <SectionLabel>{PRODUCT_FACTS.originEyebrow}</SectionLabel>
          <h2 id="origin-heading">{PRODUCT_FACTS.originHeading}</h2>
        </div>
        <div className={styles.originCopy}>
          <p>{PRODUCT_FACTS.originBody}</p>
          <p className={styles.location}>{PRODUCT_FACTS.location} · Indonesia</p>
        </div>
      </section>

      <section id="ingredients" aria-labelledby="ingredients-heading" className={styles.ingredients}>
        <div>
          <SectionLabel>What goes in</SectionLabel>
          <h2 id="ingredients-heading">{PRODUCT_FACTS.ingredientHeading}</h2>
        </div>
        <div role="list" className={styles.numberedList}>
          {INGREDIENTS.map((item) => (
            <article key={item.number} role="listitem" className={styles.numberedItem}>
              <span aria-hidden="true">{item.number}</span>
              <div><h3>{item.name}</h3><p>{item.description}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section id="taste-craft" aria-labelledby="taste-heading" className={styles.craft}>
        <div>
          <SectionLabel>In the glass</SectionLabel>
          <h2 id="taste-heading">{PRODUCT_FACTS.tasteHeading}</h2>
          <p>{PRODUCT_FACTS.tasteBody}</p>
          <ul className={styles.tasteNotes}>
            {TASTE_NOTES.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </div>
        <div>
          <SectionLabel>Made with care</SectionLabel>
          <div role="list" className={styles.numberedList}>
            {PROCESS_STEPS.map((item) => (
              <article key={item.number} role="listitem" className={styles.numberedItem}>
                <span aria-hidden="true">{item.number}</span>
                <div><h3>{item.title}</h3><p>{item.description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="order" aria-labelledby="order-heading" className={styles.order}>
        <div className={styles.orderCopy}>
          <SectionLabel>{PRODUCT_FACTS.orderEyebrow}</SectionLabel>
          <h2 id="order-heading">{PRODUCT_FACTS.orderHeading}</h2>
          <p>{PRODUCT_FACTS.orderBody}</p>
          <a href={PRODUCT_FACTS.instagramUrl} target="_blank" rel="noopener noreferrer" className={styles.primaryCta}>
            {PRODUCT_FACTS.orderLabel}
          </a>
        </div>
        <div aria-hidden="true" className={styles.sun} />
      </section>

      <footer className={styles.footer}>
        <div><p>{PRODUCT_FACTS.brand}</p><p>{PRODUCT_FACTS.location} · Indonesia</p></div>
        <div>
          <a href={PRODUCT_FACTS.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit Sinom ARA on Instagram">Instagram</a>
          <p>© {new Date().getFullYear()} Sinom ARA</p>
        </div>
      </footer>
    </div>
  );
}
```

- [ ] **Step 4: Add the scoped editorial stylesheet**

Create `components/product/ProductSections.module.css` with the following required rules and values:

```css
.surface {
  --product-surface: #0d0c0b;
  --product-surface-warm: #13100c;
  --product-text: #e8e6e3;
  --product-muted: #aaa29a;
  --product-line: rgba(232, 230, 227, 0.13);
  --product-accent: #c9a96e;
  position: relative;
  isolation: isolate;
  color: var(--product-text);
  background-color: var(--product-surface);
  background-image: radial-gradient(circle, rgba(232, 230, 227, 0.035) 0.55px, transparent 0.7px);
  background-size: 5px 5px;
}

.origin, .ingredients, .craft, .order, .footer {
  width: min(100% - 3rem, 80rem);
  margin-inline: auto;
}

.origin, .ingredients, .craft { padding-block: 9rem; }
.origin, .craft { display: grid; grid-template-columns: 7fr 4fr; gap: 8%; }
.ingredients { position: relative; isolation: isolate; display: grid; grid-template-columns: 5fr 6fr; gap: 8%; border-block: 1px solid var(--product-line); }
.ingredients::before { content: ""; position: absolute; top: 0; left: 50%; width: 100vw; height: 100%; z-index: -1; transform: translateX(-50%); background: var(--product-surface-warm); }
.ingredients > div:first-child::after { content: ""; display: block; width: min(16rem, 70%); aspect-ratio: 1; margin-top: 4rem; border: 1px solid color-mix(in srgb, var(--product-accent) 28%, transparent); border-radius: 70% 30% 65% 35%; transform: rotate(-12deg); }
.label { margin-bottom: 1.25rem; color: var(--product-accent); font-size: .68rem; font-weight: 500; letter-spacing: .28em; text-transform: uppercase; }
.surface h2 { max-width: 12ch; font-size: clamp(3rem, 7vw, 6.25rem); font-weight: 500; line-height: .98; letter-spacing: -.055em; text-wrap: balance; }
.surface h3 { font-size: 1.35rem; font-weight: 500; letter-spacing: -.025em; }
.surface p { max-width: 58ch; color: var(--product-muted); font-weight: 300; line-height: 1.85; text-wrap: pretty; }
.originCopy { align-self: end; border-left: 1px solid color-mix(in srgb, var(--product-accent) 40%, transparent); padding-left: 1.5rem; }
.location { margin-top: 2rem; font-size: .75rem; letter-spacing: .18em; text-transform: uppercase; }
.numberedList { border-top: 1px solid var(--product-line); }
.numberedItem { display: grid; grid-template-columns: 4rem 1fr; gap: 1rem; padding-block: 2rem; border-bottom: 1px solid var(--product-line); }
.numberedItem > span { color: color-mix(in srgb, var(--product-accent) 72%, transparent); font-family: monospace; font-size: clamp(1rem, 2.5vw, 2.25rem); line-height: 1; font-variant-numeric: tabular-nums; }
.numberedItem p { margin-top: .75rem; font-size: .9rem; }
.tasteNotes { display: flex; flex-wrap: wrap; gap: .75rem 2rem; margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--product-line); color: var(--product-accent); font-size: .75rem; letter-spacing: .2em; text-transform: uppercase; }
.order { display: grid; grid-template-columns: 8fr 4fr; margin-bottom: 8rem; overflow: hidden; border: 1px solid color-mix(in srgb, var(--product-accent) 30%, transparent); background: var(--product-surface-warm); border-radius: .25rem 2rem .25rem .25rem; }
.orderCopy { padding: clamp(2rem, 7vw, 5rem); }
.orderCopy p { margin-top: 1.75rem; }
.primaryCta { display: inline-flex; min-height: 3rem; margin-top: 2.5rem; align-items: center; justify-content: center; padding: .8rem 1.75rem; color: var(--product-surface); background: var(--product-accent); font-size: .75rem; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; }
.primaryCta:focus-visible, .footer a:focus-visible { outline: 2px solid var(--product-text); outline-offset: 5px; }
.sun { min-height: 18rem; border-left: 1px solid color-mix(in srgb, var(--product-accent) 25%, transparent); background: radial-gradient(circle, rgba(201,169,110,.92) 0 16%, transparent 16.5%), repeating-radial-gradient(circle, transparent 0 9%, rgba(201,169,110,.12) 9.5% 10%, transparent 10.5% 18%); }
.footer { display: flex; justify-content: space-between; gap: 2rem; padding-block: 3rem; border-top: 1px solid var(--product-line); }
.footer > div:last-child { display: flex; align-items: center; gap: 2rem; }

@media (max-width: 767px) {
  .origin, .ingredients, .craft { grid-template-columns: 1fr; gap: 4rem; padding-block: 7rem; }
  .order { grid-template-columns: 1fr; }
  .sun { border-top: 1px solid var(--product-line); border-left: 0; }
  .footer, .footer > div:last-child { align-items: flex-start; flex-direction: column; }
}
```

- [ ] **Step 5: Narrow `LandingContent.tsx` and run GREEN**

Replace it with:

```tsx
"use client";

import { useEffect } from "react";
import ProductSections from "./product/ProductSections";

export default function LandingContent() {
  useEffect(() => { void import("motion-components"); }, []);
  return <ProductSections />;
}
```

Run:

```bash
npm test -- tests/integration/LandingContent.test.tsx
npm run lint
npm run build
```

Expected: four integration tests PASS; lint and build PASS.

- [ ] **Step 6: Commit the semantic redesign**

```bash
git add tests/integration/LandingContent.test.tsx components/product/ProductSections.tsx components/product/ProductSections.module.css components/LandingContent.tsx
git commit -m "feat: redesign product story below animation"
```

---

### Task 3: Motion Components progressive enhancement

**Files:**
- Modify: `tests/integration/LandingContent.test.tsx`
- Create: `types/motion-elements.d.ts`
- Modify: `components/product/ProductSections.tsx`
- Modify: `components/product/ProductSections.module.css`

**Interfaces:**
- Consumes: the semantic sections and CTA from Task 2 and the installed `motion-components` package.
- Produces: `motion-reveal`, `motion-stagger`, `motion-hover`, `motion-press`, and `motion-magnetic` wrappers while preserving visible fallback content.

- [ ] **Step 1: Write the failing motion contract**

Append this test inside the existing `describe`:

```tsx
it("uses all approved Motion Components primitives without hiding the CTA", () => {
  const { container } = render(<LandingContent />);
  expect(container.querySelectorAll("motion-reveal").length).toBeGreaterThan(0);
  expect(container.querySelectorAll("motion-stagger")).toHaveLength(2);
  expect(container.querySelector("motion-hover")).toBeInTheDocument();
  expect(container.querySelector("motion-press")).toBeInTheDocument();
  expect(container.querySelector("motion-magnetic")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Order this week on Instagram" })).toBeVisible();
});
```

- [ ] **Step 2: Run RED**

Run `npm test -- tests/integration/LandingContent.test.tsx`.

Expected: FAIL because Task 2 contains no Motion Components wrappers.

- [ ] **Step 3: Add only the missing JSX declarations**

Create `types/motion-elements.d.ts`:

```ts
import type React from "react";

type MotionProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "motion-hover": MotionProps & {
        scale?: string;
        y?: string;
        bounce?: string;
        duration?: string;
      };
      "motion-press": MotionProps & {
        scale?: string;
        duration?: string;
        disabled?: boolean;
      };
    }
  }
}

export {};
```

Do not redeclare `motion-reveal`, `motion-stagger`, or `motion-magnetic`; the untouched animation file already declares those tags.

- [ ] **Step 4: Wrap the existing semantic groups**

In `ProductSections.tsx`, make these exact structural changes without changing copy, IDs, semantic roles, keys, or section order:

```tsx
// Wrap the origin headline group and originCopy group separately.
<motion-reveal>
  <SectionLabel>{PRODUCT_FACTS.originEyebrow}</SectionLabel>
  <h2 id="origin-heading">{PRODUCT_FACTS.originHeading}</h2>
</motion-reveal>

// Replace each numberedList wrapper around ingredients/process with
// motion-stagger, preserving its class and direct article children.
<motion-stagger interval="0.12" className={styles.numberedList}>
  {INGREDIENTS.map((item) => (
    <article key={item.number} role="listitem" className={styles.numberedItem}>
      <span aria-hidden="true">{item.number}</span>
      <div><h3>{item.name}</h3><p>{item.description}</p></div>
    </article>
  ))}
</motion-stagger>

<motion-stagger interval="0.1" className={styles.numberedList}>
  {PROCESS_STEPS.map((item) => (
    <article key={item.number} role="listitem" className={styles.numberedItem}>
      <span aria-hidden="true">{item.number}</span>
      <div><h3>{item.title}</h3><p>{item.description}</p></div>
    </article>
  ))}
</motion-stagger>

// Wrap each taste/order headline-copy group in motion-reveal. Nest the
// existing primary anchor exactly as follows.
<motion-magnetic>
  <motion-hover y="-2" scale="1.01" bounce="0.12">
    <motion-press scale="0.97" duration="0.15">
      <a
        href={PRODUCT_FACTS.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.primaryCta}
      >
        {PRODUCT_FACTS.orderLabel}
      </a>
    </motion-press>
  </motion-hover>
</motion-magnetic>
```

The explanatory comments in this step are plan instructions and must not be copied into the component.

- [ ] **Step 5: Add display and failure-safe CSS**

Append to `ProductSections.module.css`:

```css
.surface motion-reveal,
.surface motion-stagger { display: block; }

.surface motion-hover,
.surface motion-press,
.surface motion-magnetic { display: inline-block; }

.surface motion-reveal:not(:defined),
.surface motion-stagger:not(:defined),
.surface motion-stagger:not(:defined) > * {
  opacity: 1 !important;
  transform: none !important;
  visibility: visible !important;
}

@media (prefers-reduced-motion: reduce) {
  .surface *, .surface *::before, .surface *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
```

This scoped `:not(:defined)` override is mandatory because `motion-components/preload.css` may otherwise hide reveal/stagger content until the custom elements register.

- [ ] **Step 6: Run GREEN and commit**

Run:

```bash
npm test -- tests/integration/LandingContent.test.tsx
npm run test:coverage
npm run lint
npm run build
```

Expected: five integration tests PASS, coverage remains at least 80%, and lint/build PASS.

Commit:

```bash
git add tests/integration/LandingContent.test.tsx types/motion-elements.d.ts components/product/ProductSections.tsx components/product/ProductSections.module.css
git commit -m "feat: add restrained product content motion"
```

---

### Task 4: Responsive browser tests and final verification

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/product-content.spec.ts`
- Create: `tests/e2e/product-content.spec.ts-snapshots/`

**Interfaces:**
- Consumes: the final page plus `#heritage`, `#order`, and `[data-product-content]`.
- Produces: desktop/mobile evidence for layout, ordering, focus, reduced motion, JavaScript-disabled fallback, and visual composition.

- [ ] **Step 1: Record the protected animation hash**

Run:

```bash
git hash-object components/DrinkAnimation.tsx
```

Save the printed hash in the task notes. The worktree already contains user changes, so a hash comparison is more reliable than comparing only to `HEAD`.

- [ ] **Step 2: Configure Playwright**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: { baseURL: "http://127.0.0.1:3000", trace: "on-first-retry" },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    { name: "mobile-chromium", use: devices["Pixel 7"] },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 3: Write the browser contract**

Create `tests/e2e/product-content.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.locator("#heritage").scrollIntoViewIfNeeded();
});

test("shows the product story and verified order action", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "A Javanese classic, brewed for right now." })).toBeVisible();
  for (const name of ["Young tamarind leaves", "Fresh turmeric", "Palm sugar"]) {
    await expect(page.getByText(name)).toBeVisible();
  }
  const link = page.getByRole("link", { name: "Order this week on Instagram" });
  await link.scrollIntoViewIfNeeded();
  await expect(link).toHaveAttribute("href", "https://www.instagram.com/sinomaramalang/");
});

test("has no horizontal overflow and exposes keyboard focus", async ({ page }) => {
  const link = page.getByRole("link", { name: "Order this week on Instagram" });
  await link.scrollIntoViewIfNeeded();
  await link.focus();
  await expect(link).toBeFocused();
  await expect(link).toHaveCSS("outline-style", "solid");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("keeps content visible with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.locator("#order").scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Freshly brewed. Ready when the batch is." })).toBeVisible();
});

test("keeps content and ordering usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await page.locator("#order").scrollIntoViewIfNeeded();
  await expect(page.getByRole("link", { name: "Order this week on Instagram" })).toBeVisible();
  await context.close();
});

test("matches the reviewed below-animation composition", async ({ page }) => {
  const content = page.locator("[data-product-content]");
  await content.scrollIntoViewIfNeeded();
  await expect(content).toHaveScreenshot("product-content.png", {
    animations: "disabled",
  });
});
```

- [ ] **Step 4: Generate and inspect the baselines**

Run:

```bash
npx playwright test tests/e2e/product-content.spec.ts --update-snapshots
```

Inspect both generated PNGs. Confirm no clipping or overlaps; the ingredients read as one composition; the order panel is dominant; mobile has a logical single column; and the animation itself is absent from the captured product-content element. Correct only product component files, then regenerate if any check fails.

- [ ] **Step 5: Run the complete verification loop**

Run:

```bash
npm run lint
npm run test:coverage
npm run build
npm run test:e2e
rg -n "WhatsApp|wa\.me|antioxid|vitamin|anti-inflammatory|digestive|glycemic|price|testimonial" components/LandingContent.tsx components/product
git hash-object components/DrinkAnimation.tsx
git diff --check
```

Expected: lint/build/E2E PASS; all coverage categories are at least 80%; `rg` has no matches; the animation hash exactly matches Step 1; and `git diff --check` prints nothing.

- [ ] **Step 6: Review scope and commit browser evidence**

Run `git status --short` and `git diff --stat`. Confirm unrelated pre-existing user changes are not staged.

Commit:

```bash
git add playwright.config.ts tests/e2e
git commit -m "test: verify responsive product ordering journey"
```
