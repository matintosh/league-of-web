# Merch PDP + Cart Shopping Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build three merch shopping-flow components — MerchProductGallery (PDP image gallery), MerchPurchasePanel (PDP right column), and MerchCartDrawer (slide-in cart) — matching the real merch.riotgames.com store's measured layout.

**Architecture:** Three fully presentational components in `packages/ui/src/merch/`, each with a server-safe showcase and a `'use client'` demo file. Types for new shapes (MerchVariant, MerchCartItem) live in `packages/fixtures/src/types.ts`. An optional PDP route at `apps/web/src/app/merch/[handle]/page.tsx` wires the components together.

**Tech Stack:** Next.js App Router (React 18), Tailwind v4 (token classes via inline CSS vars), TypeScript strict mode, pnpm monorepo; images from Data Dragon CDN via `championSplashUrl`.

## Global Constraints

- WORKTREE: `/Users/matintosh/dev/low-wt-merch3`, branch `feat/merch-pdp-cart` — work ONLY here, never touch `/Users/matintosh/dev/league-of-web`.
- TOKEN HYGIENE: `grep -rnE "#[0-9a-fA-F]{3,8}" packages/ui/src/merch apps/web/src/app/merch` MUST be empty after all tasks (only exempt: merch.css token definitions + the scrim `rgba(0,0,0,0.4)` inline style).
- NO hex fallbacks: write `var(--color-merch-ink)` not `var(--color-merch-ink, #1a1a1a)`. NO bare hex like `#ffffff` — use `var(--color-merch-on-dark)`.
- Scrim `rgba(0,0,0,0.4)` is an exempt compositing value (inline style). Alternatively use `color-mix(in srgb, black 40%, transparent)`.
- Presentational contract: no `useState`/`useEffect`/`fetch` in component files. All state via props+callbacks.
- Showcase files: NO `'use client'`. Stateful demos go in `*.demo.tsx` (`'use client'`).
- Types from `@low/fixtures` — do NOT duplicate type shapes inside `@low/ui`.
- SVG ids via `useId()` hook.
- Gates: `pnpm typecheck` then `pnpm --filter web build` — both must pass before commit.
- Commit trailers: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01XpW4tnNqor2RLUhr8ybARZ`.

---

## File Map

**New files to create:**
- `packages/fixtures/src/types.ts` — EXTEND (add `MerchVariant`, `MerchCartItem` interfaces below `MerchProduct`)
- `packages/ui/src/merch/merch-product-gallery.tsx` — new component
- `packages/ui/src/merch/merch-product-gallery.showcase.tsx` — server-safe showcase
- `packages/ui/src/merch/merch-product-gallery.demo.tsx` — `'use client'` stateful demo
- `packages/ui/src/merch/merch-purchase-panel.tsx` — new component
- `packages/ui/src/merch/merch-purchase-panel.showcase.tsx` — server-safe showcase
- `packages/ui/src/merch/merch-purchase-panel.demo.tsx` — `'use client'` stateful demo
- `packages/ui/src/merch/merch-cart-drawer.tsx` — new component
- `packages/ui/src/merch/merch-cart-drawer.showcase.tsx` — server-safe showcase
- `packages/ui/src/merch/merch-cart-drawer.demo.tsx` — `'use client'` stateful demo
- `apps/web/src/app/merch/[handle]/page.tsx` — optional PDP demo route (simple)

**Files to modify:**
- `packages/fixtures/src/types.ts` — add `MerchVariant` + `MerchCartItem` interfaces
- `packages/ui/src/registry.ts` — add 3 new showcase imports + entries (alphabetical under merch)
- `packages/ui/src/index.ts` — add 3 new component exports (alphabetical under merch)

---

### Task 1: Extend fixtures types — MerchVariant + MerchCartItem

**Files:**
- Modify: `packages/fixtures/src/types.ts` (after line 270, after `MerchProduct`)

**Interfaces:**
- Produces:
  - `MerchVariant { label: string; available: boolean }`
  - `MerchCartItem { id: string; title: string; imageUrl: string; variantLabel?: string; unitPrice: string; quantity: number }`

- [ ] **Step 1: Read the current end of MerchProduct in types.ts**

  Open `packages/fixtures/src/types.ts`, find the closing `}` of `MerchProduct` at line ~270.

- [ ] **Step 2: Append MerchVariant and MerchCartItem after MerchProduct**

  Add immediately after the closing `}` of `MerchProduct` (after line 270):

  ```ts
  /**
   * A size or colour variant chip on the PDP purchase panel.
   */
  export interface MerchVariant {
    /** Chip label, e.g. "S", "M", "L", "XL". */
    label: string;
    /** Whether this variant is available to purchase. */
    available: boolean;
  }

  /**
   * A line item in the merch cart drawer.
   */
  export interface MerchCartItem {
    /** Unique line item id. */
    id: string;
    /** Product title. */
    title: string;
    /** Thumbnail URL (80×80, object-fit: cover). */
    imageUrl: string;
    /** Variant label shown below title, e.g. "Size: M" or "Color: Black / Size: L". */
    variantLabel?: string;
    /** Display price for one unit, e.g. "$39.99". */
    unitPrice: string;
    /** Current quantity (min 1). */
    quantity: number;
  }
  ```

- [ ] **Step 3: Verify types.ts exports via fixtures index**

  Check that `packages/fixtures/src/index.ts` re-exports from `./types`. If the file uses a wildcard `export * from "./types"`, no change needed. If it uses named exports, add:

  ```ts
  export type { MerchVariant, MerchCartItem } from "./types";
  ```

- [ ] **Step 4: Typecheck fixtures package**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3 && pnpm typecheck 2>&1 | head -40
  ```

  Expected: 0 errors.

- [ ] **Step 5: Commit**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3
  git add packages/fixtures/src/types.ts packages/fixtures/src/index.ts
  git commit -m "feat(fixtures): add MerchVariant + MerchCartItem types for PDP/cart (#577 #578 #579)

  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01XpW4tnNqor2RLUhr8ybARZ"
  ```

---

### Task 2: MerchProductGallery component + showcase + demo

**Files:**
- Create: `packages/ui/src/merch/merch-product-gallery.tsx`
- Create: `packages/ui/src/merch/merch-product-gallery.showcase.tsx`
- Create: `packages/ui/src/merch/merch-product-gallery.demo.tsx`

**Interfaces:**
- Consumes: none (images are plain URLs from props)
- Produces:
  ```ts
  MerchProductGalleryProps {
    images: string[];
    alt: string;
    aspectRatio?: string;     // default "4 / 5"
    selectedIndex?: number;   // default 0
    onSelect?: (index: number) => void;
  }
  ```

**Key measurements (from issue #577):**
- Main image: ~560px wide, `aspect-ratio: 4/5`, `object-fit: cover`, bg `var(--color-merch-surface)`
- Thumbnail strip: `display: flex; gap: 8px; margin-top: 12px`
- Thumbnail: 72×72px, `object-fit: cover`
- Active thumb border: `2px solid var(--color-merch-ink)`
- Inactive thumb border: `1px solid var(--color-merch-border)`
- Hover thumb border: `1px solid var(--color-merch-ink)`, `cursor: pointer`
- Strip hidden when `images.length <= 1`

- [ ] **Step 1: Create merch-product-gallery.tsx**

  ```tsx
  /**
   * MerchProductGallery — PDP left column: main image + thumbnail strip.
   *
   * Measured from merch.riotgames.com apparel PDPs (~1280px desktop):
   *   Main image: ~560px wide, 4:5 aspect, object-fit cover, --color-merch-surface bg
   *   Thumbnail strip: flex, 8px gap, margin-top 12px
   *   Thumbnail: 72×72px, 1:1, object-fit cover
   *   Active border: 2px solid --color-merch-ink
   *   Inactive border: 1px solid --color-merch-border
   *   Hover border: 1px solid --color-merch-ink, cursor pointer
   *   Strip hidden when images.length <= 1
   *
   * Controlled: pass selectedIndex + onSelect from a parent demo/page.
   * Uncontrolled-safe: selectedIndex defaults to 0; without onSelect, thumbs are no-ops.
   */
  import React from "react";

  export interface MerchProductGalleryProps {
    /** Ordered list of image URLs. First is shown as the initial main image. */
    images: string[];
    /** Alt text for the main image (product title). */
    alt: string;
    /** Aspect ratio for the main image container. Default "4 / 5". */
    aspectRatio?: string;
    /** Index of the currently selected image — controlled. Defaults to 0. */
    selectedIndex?: number;
    /** Called when a thumbnail is clicked — pass new index. */
    onSelect?: (index: number) => void;
  }

  /**
   * MerchProductGallery — image gallery for the PDP left column.
   * Place inside a flex/grid PDP layout alongside MerchPurchasePanel.
   */
  export function MerchProductGallery({
    images,
    alt,
    aspectRatio = "4 / 5",
    selectedIndex = 0,
    onSelect,
  }: MerchProductGalleryProps) {
    const activeIdx = Math.max(0, Math.min(selectedIndex, images.length - 1));
    const showStrip = images.length > 1;

    return (
      <div style={{ fontFamily: "var(--font-merch)", width: "100%" }}>
        {/* ── Main image ─────────────────────────────────────────────────── */}
        <div
          style={{
            aspectRatio,
            width: "100%",
            overflow: "hidden",
            backgroundColor: "var(--color-merch-surface)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeIdx]}
            alt={alt}
            loading="eager"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>

        {/* ── Thumbnail strip — hidden for single image ───────────────────── */}
        {showStrip && (
          <div
            role="list"
            aria-label="Product images"
            style={{
              display: "flex",
              gap: 8,
              marginTop: 12,
            }}
          >
            {images.map((src, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={idx}
                  role="listitem"
                  type="button"
                  aria-label={`View image ${idx + 1}`}
                  aria-pressed={isActive}
                  onClick={() => onSelect?.(idx)}
                  style={{
                    padding: 0,
                    background: "none",
                    cursor: onSelect ? "pointer" : "default",
                    flexShrink: 0,
                    width: 72,
                    height: 72,
                    overflow: "hidden",
                    border: isActive
                      ? "2px solid var(--color-merch-ink)"
                      : "1px solid var(--color-merch-border)",
                    outline: "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "var(--color-merch-ink)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "var(--color-merch-border)";
                    }
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Product thumbnail ${idx + 1}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Create merch-product-gallery.showcase.tsx (server-safe)**

  Note: `championSplashUrl` is used to supply placeholder image URLs. No `'use client'`.

  ```tsx
  import { championSplashUrl } from "@low/fixtures";
  import type { ShowcaseEntry } from "../showcase";
  import { MerchProductGallery } from "./merch-product-gallery";

  const IMG_A = championSplashUrl("Jinx", 0);
  const IMG_B = championSplashUrl("Lux", 0);
  const IMG_C = championSplashUrl("Vi", 0);
  const IMG_D = championSplashUrl("Ahri", 0);
  const IMG_E = championSplashUrl("Ashe", 0);
  const IMG_F = championSplashUrl("Ezreal", 0);

  export const merchProductGalleryShowcase: ShowcaseEntry = {
    slug: "merch-product-gallery",
    name: "Merch Product Gallery",
    area: "merch",
    description:
      "PDP left column: main image (4:5 portrait, ~560px) + thumbnail strip (72×72, 8px gap). Active thumb: 2px ink border. Inactive: 1px border. Strip hidden for single image. Controlled via selectedIndex + onSelect. Measured from merch.riotgames.com apparel PDPs.",
    variants: [
      {
        name: "4-image gallery — first selected (static)",
        notes: "selectedIndex=0; thumbnail strip visible with 4 thumbs. No interactivity in server-safe mode — use the demo for clicks.",
        backgrounds: ["light"],
        render: () => (
          <div style={{ maxWidth: 480, fontFamily: "system-ui, sans-serif" }}>
            <MerchProductGallery
              images={[IMG_A, IMG_B, IMG_C, IMG_D]}
              alt="MSI 2026 Tee"
              selectedIndex={0}
            />
          </div>
        ),
      },
      {
        name: "4-image gallery — second thumbnail selected (static)",
        notes: "selectedIndex=1 to show active border on second thumb.",
        backgrounds: ["light"],
        render: () => (
          <div style={{ maxWidth: 480, fontFamily: "system-ui, sans-serif" }}>
            <MerchProductGallery
              images={[IMG_A, IMG_B, IMG_C, IMG_D]}
              alt="MSI 2026 Tee"
              selectedIndex={1}
            />
          </div>
        ),
      },
      {
        name: "Single image — no strip",
        notes: "images.length === 1 so thumbnail strip is hidden.",
        backgrounds: ["light"],
        render: () => (
          <div style={{ maxWidth: 480, fontFamily: "system-ui, sans-serif" }}>
            <MerchProductGallery
              images={[IMG_A]}
              alt="Single product image"
              selectedIndex={0}
            />
          </div>
        ),
      },
      {
        name: "6-image gallery — fourth selected (static)",
        notes: "selectedIndex=3 shows fourth thumb active-bordered.",
        backgrounds: ["light"],
        render: () => (
          <div style={{ maxWidth: 480, fontFamily: "system-ui, sans-serif" }}>
            <MerchProductGallery
              images={[IMG_A, IMG_B, IMG_C, IMG_D, IMG_E, IMG_F]}
              alt="MSI 2026 Jacket"
              selectedIndex={3}
            />
          </div>
        ),
      },
      {
        name: "1:1 aspect ratio override",
        notes: "aspectRatio='1 / 1' for non-apparel products (e.g. accessories).",
        backgrounds: ["light"],
        render: () => (
          <div style={{ maxWidth: 480, fontFamily: "system-ui, sans-serif" }}>
            <MerchProductGallery
              images={[IMG_B, IMG_C, IMG_D]}
              alt="Collector's Print"
              aspectRatio="1 / 1"
              selectedIndex={0}
            />
          </div>
        ),
      },
    ],
  };
  ```

- [ ] **Step 3: Create merch-product-gallery.demo.tsx (client — stateful)**

  ```tsx
  "use client";

  import { useState } from "react";
  import { championSplashUrl } from "@low/fixtures";
  import { MerchProductGallery } from "./merch-product-gallery";

  const IMAGES = [
    championSplashUrl("Jinx", 0),
    championSplashUrl("Lux", 0),
    championSplashUrl("Vi", 0),
    championSplashUrl("Ahri", 0),
  ];

  /** Interactive demo for the showcase — click thumbnails to swap the main image. */
  export function MerchProductGalleryDemo() {
    const [selected, setSelected] = useState(0);
    return (
      <div style={{ maxWidth: 480, fontFamily: "system-ui, sans-serif" }}>
        <MerchProductGallery
          images={IMAGES}
          alt="MSI 2026 Tee — Interactive Demo"
          selectedIndex={selected}
          onSelect={setSelected}
        />
      </div>
    );
  }
  ```

- [ ] **Step 4: Run typecheck**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3 && pnpm typecheck 2>&1 | head -60
  ```

  Expected: 0 errors.

- [ ] **Step 5: Hex grep check for gallery files**

  ```bash
  grep -rnE "#[0-9a-fA-F]{3,8}" /Users/matintosh/dev/low-wt-merch3/packages/ui/src/merch/merch-product-gallery*.tsx
  ```

  Expected: no output.

- [ ] **Step 6: Commit gallery files (before wiring)**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3
  git add packages/ui/src/merch/merch-product-gallery.tsx \
           packages/ui/src/merch/merch-product-gallery.showcase.tsx \
           packages/ui/src/merch/merch-product-gallery.demo.tsx
  git commit -m "feat(merch): MerchProductGallery — PDP image gallery + thumbnail strip (#577)

  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01XpW4tnNqor2RLUhr8ybARZ"
  ```

---

### Task 3: MerchPurchasePanel component + showcase + demo

**Files:**
- Create: `packages/ui/src/merch/merch-purchase-panel.tsx`
- Create: `packages/ui/src/merch/merch-purchase-panel.showcase.tsx`
- Create: `packages/ui/src/merch/merch-purchase-panel.demo.tsx`

**Interfaces:**
- Consumes: `MerchVariant` from `@low/fixtures`
- Produces:
  ```ts
  MerchPurchasePanelProps {
    title: string;
    price: string;
    originalPrice?: string;
    badges?: string[];
    description?: string;
    breadcrumb?: string[];
    variants?: MerchVariant[];
    variantLabel?: string;
    selectedVariant?: string;
    onVariantChange?: (label: string) => void;
    quantity?: number;
    onQuantityChange?: (qty: number) => void;
    onAddToCart?: () => void;
    outOfStock?: boolean;
  }
  ```

**Key measurements (from issue #578):**
- Title: `font-size: 28–32px`, `font-weight: 700`, `color: var(--color-merch-ink)`, `line-height: 1.2`
- Badge chips: `font-size: 10px`, `padding: 2px 8px`, `uppercase`, `letter-spacing: 0.08em`, bg `var(--color-merch-ink)`, text `var(--color-merch-on-dark)`, `margin-top: 8px`
- Price: `font-size: 20px`, `font-weight: 600`; sale = struck original muted + red current
- Variant label: `font-size: 12px`, `font-weight: 600`, `uppercase`, `letter-spacing: 0.06em`, `color: var(--color-merch-body)`
- Variant chips: `padding: 8px 16px`, `border: 1px solid var(--color-merch-border)`, `font-size: 13px`, `gap: 8px`, `flex-wrap`
- Active chip: `border: 2px solid var(--color-merch-ink)`, `background: var(--color-merch-ink)`, `color: var(--color-merch-on-dark)`
- Disabled chip: `opacity: 0.35`, `cursor: not-allowed`, `text-decoration: line-through`
- Hover chip: `border-color: var(--color-merch-ink)`
- Quantity stepper: 3 elements ~40×40px each, `border: 1px solid var(--color-merch-border)`; minus disabled at qty=1
- Add to Cart: full-width, `height: 52px`, bg `var(--color-merch-red)`, hover bg `var(--color-merch-red-dark)`, `color: var(--color-merch-on-dark)`, `font-size: 14px`, `font-weight: 700`, `uppercase`, `letter-spacing: 0.1em`
- Dividers: `1px solid var(--color-merch-border)` between sections

- [ ] **Step 1: Create merch-purchase-panel.tsx**

  ```tsx
  /**
   * MerchPurchasePanel — PDP right column: title, badges, price, variant chips,
   * quantity stepper, Add to Cart CTA, optional description.
   *
   * Measured from merch.riotgames.com (~1280px desktop):
   *   Panel width: ~520–560px (flex-1 right column)
   *   Title: 28–32px / 700 / line-height 1.2 / var(--color-merch-ink)
   *   Badges: 10px uppercase / 2px 8px padding / ink bg / on-dark text
   *   Price: 20px / 600; sale = struck original (muted) + red current
   *   Variant chips: 8px 16px padding / 13px / flex-wrap / 8px gap
   *   Active chip: ink bg + on-dark text + 2px ink border
   *   Disabled chip: 0.35 opacity + line-through + not-allowed cursor
   *   Qty stepper: 40×40px per cell / 1px border
   *   Add to Cart: 52px tall / full-width / merch-red bg / 700 uppercase 14px
   *
   * Fully presentational — no internal useState.
   */
  import React from "react";
  import type { MerchVariant } from "@low/fixtures";

  export type { MerchVariant };

  export interface MerchPurchasePanelProps {
    /** Product title. */
    title: string;
    /** Display price, e.g. "$39.99". */
    price: string;
    /** Pre-sale price if on sale, e.g. "$59.99". Shown struck-through. */
    originalPrice?: string;
    /** Badges beneath the title, e.g. ["New", "Limited Edition"]. */
    badges?: string[];
    /** Short description below the CTA button. */
    description?: string;
    /** Breadcrumb segments, e.g. ["Home", "Tops", "MSI 2026 Tee"]. */
    breadcrumb?: string[];
    /** Size/variant chips. Omit for products with no variant selector. */
    variants?: MerchVariant[];
    /** Label above the chips, e.g. "Size". Defaults to "Size". */
    variantLabel?: string;
    /** Currently selected variant label — controlled. */
    selectedVariant?: string;
    /** Called when a variant chip is clicked. */
    onVariantChange?: (label: string) => void;
    /** Current quantity — controlled. Defaults to 1. */
    quantity?: number;
    /** Called when quantity changes (stepper ±). */
    onQuantityChange?: (qty: number) => void;
    /** Called when "Add to Cart" is clicked. */
    onAddToCart?: () => void;
    /** If true, CTA is disabled and shows "Out of Stock". */
    outOfStock?: boolean;
  }

  const DIVIDER: React.CSSProperties = {
    borderTop: "1px solid var(--color-merch-border)",
    margin: "16px 0",
  };

  /**
   * MerchPurchasePanel — right-column PDP purchase UI.
   * Compose with MerchProductGallery in a 2-column flex layout.
   */
  export function MerchPurchasePanel({
    title,
    price,
    originalPrice,
    badges,
    description,
    breadcrumb,
    variants,
    variantLabel = "Size",
    selectedVariant,
    onVariantChange,
    quantity = 1,
    onQuantityChange,
    onAddToCart,
    outOfStock = false,
  }: MerchPurchasePanelProps) {
    const isSale = Boolean(originalPrice && originalPrice !== price);
    const safeQty = Math.max(1, quantity);

    return (
      <div
        style={{
          fontFamily: "var(--font-merch)",
          color: "var(--color-merch-ink)",
          width: "100%",
        }}
      >
        {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" style={{ marginBottom: 16 }}>
            <ol
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: 11,
                color: "var(--color-merch-muted)",
              }}
            >
              {breadcrumb.map((seg, idx) => (
                <li key={idx} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {idx > 0 && <span aria-hidden="true">›</span>}
                  <span>{seg}</span>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* ── Title ───────────────────────────────────────────────────────── */}
        <h1
          style={{
            fontSize: "clamp(28px, 2.5vw, 32px)",
            fontWeight: 700,
            lineHeight: 1.2,
            color: "var(--color-merch-ink)",
            margin: 0,
          }}
        >
          {title}
        </h1>

        {/* ── Badges ──────────────────────────────────────────────────────── */}
        {badges && badges.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginTop: 8,
            }}
          >
            {badges.map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  padding: "2px 8px",
                  backgroundColor: "var(--color-merch-ink)",
                  color: "var(--color-merch-on-dark)",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        <div style={DIVIDER} />

        {/* ── Price ───────────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isSale ? (
            <>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "var(--color-merch-muted)",
                  textDecoration: "line-through",
                }}
              >
                {originalPrice}
              </span>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 600,
                  color: "var(--color-merch-red)",
                }}
              >
                {price}
              </span>
            </>
          ) : (
            <span
              style={{
                fontSize: 20,
                fontWeight: 600,
                color: "var(--color-merch-ink)",
              }}
            >
              {price}
            </span>
          )}
        </div>

        {/* ── Variant selector ────────────────────────────────────────────── */}
        {variants && variants.length > 0 && (
          <>
            <div style={DIVIDER} />
            <div>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--color-merch-body)",
                  marginBottom: 10,
                }}
              >
                {variantLabel}
                {selectedVariant && `: ${selectedVariant}`}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {variants.map((v) => {
                  const isActive = v.label === selectedVariant;
                  return (
                    <button
                      key={v.label}
                      type="button"
                      disabled={!v.available}
                      onClick={() => v.available && onVariantChange?.(v.label)}
                      style={{
                        padding: "8px 16px",
                        fontSize: 13,
                        fontWeight: isActive ? 600 : 400,
                        border: isActive
                          ? "2px solid var(--color-merch-ink)"
                          : "1px solid var(--color-merch-border)",
                        backgroundColor: isActive
                          ? "var(--color-merch-ink)"
                          : "var(--color-merch-bg)",
                        color: isActive
                          ? "var(--color-merch-on-dark)"
                          : "var(--color-merch-ink)",
                        cursor: v.available ? "pointer" : "not-allowed",
                        opacity: v.available ? 1 : 0.35,
                        textDecoration: v.available ? "none" : "line-through",
                        fontFamily: "inherit",
                        transition: "border-color 120ms ease",
                      }}
                      onMouseEnter={(e) => {
                        if (v.available && !isActive) {
                          (e.currentTarget as HTMLButtonElement).style.borderColor =
                            "var(--color-merch-ink)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (v.available && !isActive) {
                          (e.currentTarget as HTMLButtonElement).style.borderColor =
                            "var(--color-merch-border)";
                        }
                      }}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <div style={DIVIDER} />

        {/* ── Quantity stepper ────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={safeQty <= 1}
            onClick={() => onQuantityChange?.(Math.max(1, safeQty - 1))}
            style={{
              width: 40,
              height: 40,
              border: "1px solid var(--color-merch-border)",
              backgroundColor: "var(--color-merch-bg)",
              color: "var(--color-merch-ink)",
              fontSize: 18,
              cursor: safeQty <= 1 ? "not-allowed" : "pointer",
              opacity: safeQty <= 1 ? 0.4 : 1,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            −
          </button>
          <div
            aria-label={`Quantity: ${safeQty}`}
            style={{
              width: 40,
              height: 40,
              border: "1px solid var(--color-merch-border)",
              borderLeft: "none",
              borderRight: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              color: "var(--color-merch-ink)",
              userSelect: "none",
            }}
          >
            {safeQty}
          </div>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => onQuantityChange?.(safeQty + 1)}
            style={{
              width: 40,
              height: 40,
              border: "1px solid var(--color-merch-border)",
              backgroundColor: "var(--color-merch-bg)",
              color: "var(--color-merch-ink)",
              fontSize: 18,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
        </div>

        <div style={{ marginTop: 16 }}>
          {/* ── Add to Cart ───────────────────────────────────────────────── */}
          <button
            type="button"
            disabled={outOfStock}
            onClick={() => !outOfStock && onAddToCart?.()}
            style={{
              display: "block",
              width: "100%",
              height: 52,
              backgroundColor: outOfStock
                ? "var(--color-merch-muted)"
                : "var(--color-merch-red)",
              color: "var(--color-merch-on-dark)",
              fontSize: 14,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              border: "none",
              cursor: outOfStock ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "background-color 150ms ease",
            }}
            onMouseEnter={(e) => {
              if (!outOfStock) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-merch-red-dark)";
              }
            }}
            onMouseLeave={(e) => {
              if (!outOfStock) {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-merch-red)";
              }
            }}
          >
            {outOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>

        {/* ── Description ─────────────────────────────────────────────────── */}
        {description && (
          <>
            <div style={DIVIDER} />
            <p
              style={{
                fontSize: 14,
                color: "var(--color-merch-body)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {description}
            </p>
          </>
        )}
      </div>
    );
  }
  ```

- [ ] **Step 2: Create merch-purchase-panel.showcase.tsx (server-safe)**

  ```tsx
  import type { ShowcaseEntry } from "../showcase";
  import { MerchPurchasePanel } from "./merch-purchase-panel";

  const SIZES = [
    { label: "XS", available: true },
    { label: "S", available: true },
    { label: "M", available: true },
    { label: "L", available: false },
    { label: "XL", available: true },
    { label: "XXL", available: false },
  ];

  export const merchPurchasePanelShowcase: ShowcaseEntry = {
    slug: "merch-purchase-panel",
    name: "Merch Purchase Panel",
    area: "merch",
    description:
      "PDP right column: title (28–32px/700), inline badge chips, price (sale = struck original + red), size chip strip (active ink bg+border, disabled 0.35 opacity+line-through), qty stepper (40×40, minus disabled at 1), full-width Add to Cart (52px, merch-red). Measured from merch.riotgames.com PDP.",
    variants: [
      {
        name: "Normal — sizes, one selected",
        notes: "M selected (active chip); XS/S/XL available; L/XXL disabled (out of stock). Qty=1 so minus is disabled.",
        backgrounds: ["light"],
        render: () => (
          <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
            <MerchPurchasePanel
              breadcrumb={["Home", "Tops", "MSI 2026 Tee"]}
              title="MSI 2026 Tee"
              price="$39.99"
              badges={["New"]}
              variants={SIZES}
              variantLabel="Size"
              selectedVariant="M"
              quantity={1}
              description="Celebrate Midseason Showdown with this officially licensed apparel. 100% cotton preshrunk jersey tee."
            />
          </div>
        ),
      },
      {
        name: "Sale — struck original + red price",
        notes: "originalPrice shown struck-through in muted; price in red.",
        backgrounds: ["light"],
        render: () => (
          <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
            <MerchPurchasePanel
              title="MSI 2026 Bomber Jacket"
              price="$79.99"
              originalPrice="$129.99"
              badges={["Sale", "Limited Edition"]}
              variants={SIZES}
              variantLabel="Size"
              selectedVariant="S"
              quantity={2}
            />
          </div>
        ),
      },
      {
        name: "No variants — selector hidden",
        notes: "Product has no size options; variant row not rendered.",
        backgrounds: ["light"],
        render: () => (
          <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
            <MerchPurchasePanel
              title="Riftbound Origins Champion Deck - Jinx"
              price="$24.99"
              quantity={1}
              description="A 60-card competitive champion deck featuring Jinx."
            />
          </div>
        ),
      },
      {
        name: "Out of stock — CTA disabled",
        notes: "outOfStock=true; button greyed with 'Out of Stock' label.",
        backgrounds: ["light"],
        render: () => (
          <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
            <MerchPurchasePanel
              title="Poro Limited Edition Plush"
              price="$49.99"
              badges={["Limited Edition"]}
              variants={[
                { label: "S", available: false },
                { label: "M", available: false },
                { label: "L", available: false },
              ]}
              selectedVariant="M"
              quantity={1}
              outOfStock
            />
          </div>
        ),
      },
    ],
  };
  ```

- [ ] **Step 3: Create merch-purchase-panel.demo.tsx (client — stateful)**

  ```tsx
  "use client";

  import { useState } from "react";
  import { MerchPurchasePanel } from "./merch-purchase-panel";

  const SIZES = [
    { label: "XS", available: true },
    { label: "S", available: true },
    { label: "M", available: true },
    { label: "L", available: false },
    { label: "XL", available: true },
    { label: "XXL", available: false },
  ];

  /** Interactive demo — variant selection + qty stepper + Add to Cart alert. */
  export function MerchPurchasePanelDemo() {
    const [variant, setVariant] = useState("M");
    const [qty, setQty] = useState(1);

    return (
      <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
        <MerchPurchasePanel
          breadcrumb={["Home", "Tops", "MSI 2026 Tee"]}
          title="MSI 2026 Tee — Interactive Demo"
          price="$39.99"
          badges={["New"]}
          variants={SIZES}
          variantLabel="Size"
          selectedVariant={variant}
          onVariantChange={setVariant}
          quantity={qty}
          onQuantityChange={setQty}
          onAddToCart={() => alert(`Added to cart: Size ${variant} × ${qty}`)}
          description="Click a size chip, adjust quantity, then Add to Cart."
        />
      </div>
    );
  }
  ```

- [ ] **Step 4: Typecheck**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3 && pnpm typecheck 2>&1 | head -60
  ```

  Expected: 0 errors.

- [ ] **Step 5: Hex grep check**

  ```bash
  grep -rnE "#[0-9a-fA-F]{3,8}" /Users/matintosh/dev/low-wt-merch3/packages/ui/src/merch/merch-purchase-panel*.tsx
  ```

  Expected: no output.

- [ ] **Step 6: Commit panel files**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3
  git add packages/ui/src/merch/merch-purchase-panel.tsx \
           packages/ui/src/merch/merch-purchase-panel.showcase.tsx \
           packages/ui/src/merch/merch-purchase-panel.demo.tsx
  git commit -m "feat(merch): MerchPurchasePanel — PDP purchase panel with variants, qty, CTA (#578)

  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01XpW4tnNqor2RLUhr8ybARZ"
  ```

---

### Task 4: MerchCartDrawer component + showcase + demo

**Files:**
- Create: `packages/ui/src/merch/merch-cart-drawer.tsx`
- Create: `packages/ui/src/merch/merch-cart-drawer.showcase.tsx`
- Create: `packages/ui/src/merch/merch-cart-drawer.demo.tsx`

**Interfaces:**
- Consumes: `MerchCartItem` from `@low/fixtures`
- Produces:
  ```ts
  MerchCartDrawerProps {
    open: boolean;
    items: MerchCartItem[];
    subtotal: string;
    onClose?: () => void;
    onQuantityChange?: (itemId: string, qty: number) => void;
    onRemoveItem?: (itemId: string) => void;
    onCheckout?: () => void;
    onContinueShopping?: () => void;
  }
  ```

**Key measurements (from issue #579):**
- Drawer: `width: 400px`, slides from right; `position: fixed`, `top: 0`, `right: 0`, `height: 100%`, `z-index: 50`
- Scrim: `fixed`, full-screen, `z-index: 40`, `background: rgba(0,0,0,0.4)` (inline style — exempt compositing value)
- Header: `height: 56px`, `border-bottom: 1px solid var(--color-merch-border)`, "YOUR CART" `14px/700/uppercase/letter-spacing 0.1em/ink`
- Line item: `padding: 16px 0`, `border-bottom: 1px solid var(--color-merch-border)`, flex row, `gap: 12px`
- Thumbnail: `80×80px`, `object-fit: cover`, bg `var(--color-merch-surface)`
- Item title: `13px/500/ink`; variant label: `12px/muted/margin-top 2px`
- Price: `13px/600/ink`, right-aligned
- Compact qty stepper: each cell `28×28px`, `border: 1px solid var(--color-merch-border)`, `12px`; minus disabled at qty=1
- Remove button: muted `×` or "Remove", `11px`
- Subtotal: `14px/600/ink`
- Shipping note: `12px/muted`
- Checkout button: full-width, `52px`, red bg, hover red-dark, on-dark text, `14px/700/uppercase/letter-spacing 0.1em`
- Empty state: centered, icon SVG, "Your cart is empty" `15px/muted`, "Continue Shopping" link in red
- Items area: `overflow-y: auto`, `flex: 1`; footer sticky bottom

- [ ] **Step 1: Create merch-cart-drawer.tsx**

  ```tsx
  /**
   * MerchCartDrawer — slide-in cart panel from the right edge.
   *
   * Measured from merch.riotgames.com (~1280px desktop):
   *   Drawer: 400px wide, fixed right-0, full height, z-50
   *   Scrim: fixed full-screen, z-40, rgba(0,0,0,0.4) — compositing value, exempt from token rule
   *   Header: 56px tall, border-bottom 1px merch-border; "YOUR CART" 14px/700/uppercase/0.1em ls
   *   Line item: padding 16px 0, border-bottom; thumb 80×80, title 13px/500, variant 12px/muted
   *   Compact stepper: 28×28px cells, 12px, 1px border; minus disabled at qty=1
   *   Subtotal/footer: sticky bottom; checkout btn 52px red full-width
   *   Empty: center icon + "Your cart is empty" 15px muted + "Continue Shopping" red link
   *
   * Fully presentational — no internal useState.
   */
  import React, { useId } from "react";
  import type { MerchCartItem } from "@low/fixtures";

  export type { MerchCartItem };

  export interface MerchCartDrawerProps {
    /** Whether the drawer is currently open. */
    open: boolean;
    /** Line items in the cart. Empty array renders the empty state. */
    items: MerchCartItem[];
    /** Subtotal string, e.g. "$79.98". Computed by the page, not the component. */
    subtotal: string;
    /** Called when the close button or scrim is clicked. */
    onClose?: () => void;
    /** Called when a line item's qty stepper changes. */
    onQuantityChange?: (itemId: string, qty: number) => void;
    /** Called when the remove button is clicked for an item. */
    onRemoveItem?: (itemId: string) => void;
    /** Called when the checkout button is clicked. */
    onCheckout?: () => void;
    /** Called when "Continue Shopping" (empty state) is clicked. */
    onContinueShopping?: () => void;
  }

  /** Compact quantity stepper for cart line items (28×28). */
  function CompactStepper({
    itemId,
    quantity,
    onQuantityChange,
  }: {
    itemId: string;
    quantity: number;
    onQuantityChange?: (itemId: string, qty: number) => void;
  }) {
    const cellStyle = (disabled?: boolean): React.CSSProperties => ({
      width: 28,
      height: 28,
      border: "1px solid var(--color-merch-border)",
      backgroundColor: "var(--color-merch-bg)",
      color: disabled ? "var(--color-merch-muted)" : "var(--color-merch-ink)",
      fontSize: 12,
      cursor: disabled ? "not-allowed" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "inherit",
      opacity: disabled ? 0.4 : 1,
      flexShrink: 0,
    });

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
          onClick={() => onQuantityChange?.(itemId, Math.max(1, quantity - 1))}
          style={cellStyle(quantity <= 1)}
        >
          −
        </button>
        <div
          style={{
            ...cellStyle(),
            borderLeft: "none",
            borderRight: "none",
            cursor: "default",
            userSelect: "none",
          }}
        >
          {quantity}
        </div>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onQuantityChange?.(itemId, quantity + 1)}
          style={cellStyle()}
        >
          +
        </button>
      </div>
    );
  }

  /** Shopping bag icon SVG for the empty state. */
  function BagIcon({ id }: { id: string }) {
    return (
      <svg
        aria-hidden="true"
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={`${id}-clip`}>
            <rect width="64" height="64" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}-clip)`}>
          <rect x="10" y="22" width="44" height="34" rx="2" stroke="var(--color-merch-muted)" strokeWidth="2" fill="none" />
          <path d="M22 22v-6a10 10 0 0 1 20 0v6" stroke="var(--color-merch-muted)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      </svg>
    );
  }

  /**
   * MerchCartDrawer — slide-in cart panel.
   * Rendered at the page/layout level; visibility controlled by `open` prop.
   */
  export function MerchCartDrawer({
    open,
    items,
    subtotal,
    onClose,
    onQuantityChange,
    onRemoveItem,
    onCheckout,
    onContinueShopping,
  }: MerchCartDrawerProps) {
    const iconId = useId().replace(/:/g, "");
    const isEmpty = items.length === 0;

    return (
      <>
        {/* ── Scrim (compositing value — not a brand color) ──────────────── */}
        {open && (
          <div
            aria-hidden="true"
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 40,
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          />
        )}

        {/* ── Drawer ──────────────────────────────────────────────────────── */}
        <aside
          aria-label="Cart"
          aria-hidden={!open}
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: 400,
            zIndex: 50,
            backgroundColor: "var(--color-merch-bg)",
            display: "flex",
            flexDirection: "column",
            fontFamily: "var(--font-merch)",
            transform: open ? "translateX(0)" : "translateX(100%)",
            transition: "transform 250ms ease",
          }}
        >
          {/* ── Header ────────────────────────────────────────────────────── */}
          <div
            style={{
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px",
              borderBottom: "1px solid var(--color-merch-border)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--color-merch-ink)",
              }}
            >
              Your Cart
            </span>
            <button
              type="button"
              aria-label="Close cart"
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 4,
                fontSize: 20,
                color: "var(--color-merch-ink)",
                lineHeight: 1,
                fontFamily: "inherit",
              }}
            >
              ×
            </button>
          </div>

          {/* ── Items area ────────────────────────────────────────────────── */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0 20px",
            }}
          >
            {isEmpty ? (
              /* ── Empty state ──────────────────────────────────────────── */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  gap: 16,
                  textAlign: "center",
                }}
              >
                <BagIcon id={iconId} />
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--color-merch-muted)",
                    margin: 0,
                  }}
                >
                  Your cart is empty
                </p>
                <button
                  type="button"
                  onClick={onContinueShopping}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-merch-red)",
                    fontFamily: "inherit",
                    padding: 0,
                    textDecoration: "underline",
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              /* ── Line items ───────────────────────────────────────────── */
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {items.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: "16px 0",
                      borderBottom: "1px solid var(--color-merch-border)",
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: 80,
                        height: 80,
                        flexShrink: 0,
                        overflow: "hidden",
                        backgroundColor: "var(--color-merch-surface)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 8,
                        }}
                      >
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "var(--color-merch-ink)",
                            margin: 0,
                            lineHeight: 1.3,
                          }}
                        >
                          {item.title}
                        </p>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--color-merch-ink)",
                            flexShrink: 0,
                          }}
                        >
                          {item.unitPrice}
                        </span>
                      </div>
                      {item.variantLabel && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--color-merch-muted)",
                            margin: "2px 0 0",
                          }}
                        >
                          {item.variantLabel}
                        </p>
                      )}
                      <div
                        style={{
                          marginTop: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <CompactStepper
                          itemId={item.id}
                          quantity={item.quantity}
                          onQuantityChange={onQuantityChange}
                        />
                        <button
                          type="button"
                          aria-label={`Remove ${item.title} from cart`}
                          onClick={() => onRemoveItem?.(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 11,
                            color: "var(--color-merch-muted)",
                            padding: 0,
                            fontFamily: "inherit",
                            textDecoration: "underline",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Sticky footer (only when items present) ─────────────────── */}
          {!isEmpty && (
            <div
              style={{
                flexShrink: 0,
                padding: "16px 20px",
                borderTop: "1px solid var(--color-merch-border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-merch-ink)",
                  }}
                >
                  Subtotal
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--color-merch-ink)",
                  }}
                >
                  {subtotal}
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--color-merch-muted)",
                  margin: "0 0 16px",
                }}
              >
                Shipping calculated at checkout
              </p>
              <button
                type="button"
                onClick={onCheckout}
                style={{
                  display: "block",
                  width: "100%",
                  height: 52,
                  backgroundColor: "var(--color-merch-red)",
                  color: "var(--color-merch-on-dark)",
                  fontSize: 14,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background-color 150ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--color-merch-red-dark)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--color-merch-red)";
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </aside>
      </>
    );
  }
  ```

- [ ] **Step 2: Create merch-cart-drawer.showcase.tsx (server-safe)**

  ```tsx
  import { championSplashUrl } from "@low/fixtures";
  import type { ShowcaseEntry } from "../showcase";
  import { MerchCartDrawer } from "./merch-cart-drawer";

  const ITEMS = [
    {
      id: "item-1",
      title: "MSI 2026 Tee",
      imageUrl: championSplashUrl("Jinx", 0),
      variantLabel: "Size: M",
      unitPrice: "$39.99",
      quantity: 1,
    },
    {
      id: "item-2",
      title: "MSI 2026 Bomber Jacket",
      imageUrl: championSplashUrl("Vi", 0),
      variantLabel: "Size: S",
      unitPrice: "$129.99",
      quantity: 2,
    },
  ];

  export const merchCartDrawerShowcase: ShowcaseEntry = {
    slug: "merch-cart-drawer",
    name: "Merch Cart Drawer",
    area: "merch",
    description:
      "400px right slide-in cart: scrim rgba(0,0,0,0.4), header 'YOUR CART' (14px/700/uppercase), line items (80×80 thumb + title + variant + compact 28×28 stepper + price + remove), sticky footer (subtotal + shipping note + 52px red checkout btn), empty state (bag icon + muted text + red 'Continue Shopping'). Controlled via open/items/onClose/onQtyChange/onRemove/onCheckout.",
    variants: [
      {
        name: "Open — 2 line items",
        notes: "Shows full line item list with subtotal, shipping note, and checkout button.",
        backgrounds: ["light"],
        render: () => (
          <div style={{ position: "relative", height: 600, overflow: "hidden" }}>
            <MerchCartDrawer
              open={true}
              items={ITEMS}
              subtotal="$299.97"
            />
          </div>
        ),
      },
      {
        name: "Open — empty cart",
        notes: "items=[] renders the empty state: bag icon + message + Continue Shopping.",
        backgrounds: ["light"],
        render: () => (
          <div style={{ position: "relative", height: 600, overflow: "hidden" }}>
            <MerchCartDrawer
              open={true}
              items={[]}
              subtotal="$0.00"
            />
          </div>
        ),
      },
      {
        name: "Closed — not visible",
        notes: "open=false: drawer translated off-screen (translateX(100%)).",
        backgrounds: ["light"],
        render: () => (
          <div
            style={{
              position: "relative",
              height: 120,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p
              style={{
                color: "var(--color-merch-muted)",
                fontSize: 13,
                fontFamily: "system-ui, sans-serif",
              }}
            >
              Drawer is closed (open=false) — no visible content
            </p>
            <MerchCartDrawer open={false} items={ITEMS} subtotal="$299.97" />
          </div>
        ),
      },
    ],
  };
  ```

- [ ] **Step 3: Create merch-cart-drawer.demo.tsx (client — stateful)**

  ```tsx
  "use client";

  import { useState } from "react";
  import { championSplashUrl } from "@low/fixtures";
  import type { MerchCartItem } from "@low/fixtures";
  import { MerchCartDrawer } from "./merch-cart-drawer";

  const INITIAL_ITEMS: MerchCartItem[] = [
    {
      id: "item-1",
      title: "MSI 2026 Tee",
      imageUrl: championSplashUrl("Jinx", 0),
      variantLabel: "Size: M",
      unitPrice: "$39.99",
      quantity: 1,
    },
    {
      id: "item-2",
      title: "MSI 2026 Bomber Jacket",
      imageUrl: championSplashUrl("Vi", 0),
      variantLabel: "Size: S",
      unitPrice: "$129.99",
      quantity: 1,
    },
  ];

  function calcSubtotal(items: MerchCartItem[]): string {
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.unitPrice.replace(/[^0-9.]/g, ""));
      return sum + price * item.quantity;
    }, 0);
    return `$${total.toFixed(2)}`;
  }

  /** Interactive cart drawer demo — open/close, qty changes, remove items. */
  export function MerchCartDrawerDemo() {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<MerchCartItem[]>(INITIAL_ITEMS);

    function handleQtyChange(itemId: string, qty: number) {
      setItems((prev) =>
        prev.map((it) => (it.id === itemId ? { ...it, quantity: Math.max(1, qty) } : it))
      );
    }

    function handleRemove(itemId: string) {
      setItems((prev) => prev.filter((it) => it.id !== itemId));
    }

    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            padding: "10px 24px",
            backgroundColor: "var(--color-merch-red)",
            color: "var(--color-merch-on-dark)",
            border: "none",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontFamily: "inherit",
          }}
        >
          Open Cart ({items.length} item{items.length !== 1 ? "s" : ""})
        </button>
        <MerchCartDrawer
          open={open}
          items={items}
          subtotal={calcSubtotal(items)}
          onClose={() => setOpen(false)}
          onQuantityChange={handleQtyChange}
          onRemoveItem={handleRemove}
          onCheckout={() => alert("Proceeding to checkout!")}
          onContinueShopping={() => setOpen(false)}
        />
      </div>
    );
  }
  ```

- [ ] **Step 4: Typecheck**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3 && pnpm typecheck 2>&1 | head -60
  ```

  Expected: 0 errors.

- [ ] **Step 5: Hex grep check**

  ```bash
  grep -rnE "#[0-9a-fA-F]{3,8}" /Users/matintosh/dev/low-wt-merch3/packages/ui/src/merch/merch-cart-drawer*.tsx
  ```

  Expected: no output.

- [ ] **Step 6: Commit drawer files**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3
  git add packages/ui/src/merch/merch-cart-drawer.tsx \
           packages/ui/src/merch/merch-cart-drawer.showcase.tsx \
           packages/ui/src/merch/merch-cart-drawer.demo.tsx
  git commit -m "feat(merch): MerchCartDrawer — 400px slide-in cart with line items + checkout (#579)

  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01XpW4tnNqor2RLUhr8ybARZ"
  ```

---

### Task 5: Wire registry.ts + index.ts

**Files:**
- Modify: `packages/ui/src/registry.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes:
  - `merchProductGalleryShowcase` from `./merch/merch-product-gallery.showcase`
  - `merchPurchasePanelShowcase` from `./merch/merch-purchase-panel.showcase`
  - `merchCartDrawerShowcase` from `./merch/merch-cart-drawer.showcase`
- Produces: nothing downstream

**Alphabetical order** for new entries under merch area:
`MerchCartDrawer < MerchCollectionHero < MerchFooter < MerchHeader < MerchHeroBanner < MerchProductCard < MerchProductGallery < MerchProductGrid < MerchPurchasePanel < MerchStore`

- [ ] **Step 1: Add 3 imports to registry.ts (after line 112, before the closing import block)**

  In `packages/ui/src/registry.ts`, find the existing merch import block (lines ~106–112):

  ```ts
  import { merchCollectionHeroShowcase } from "./merch/merch-collection-hero.showcase";
  import { merchFooterShowcase } from "./merch/merch-footer.showcase";
  import { merchHeaderShowcase } from "./merch/merch-header.showcase";
  import { merchHeroBannerShowcase } from "./merch/merch-hero-banner.showcase";
  import { merchProductCardShowcase } from "./merch/merch-product-card.showcase";
  import { merchProductGridShowcase } from "./merch/merch-product-grid.showcase";
  import { merchStoreShowcase } from "./merch/merch-store.showcase";
  ```

  Replace with:

  ```ts
  import { merchCartDrawerShowcase } from "./merch/merch-cart-drawer.showcase";
  import { merchCollectionHeroShowcase } from "./merch/merch-collection-hero.showcase";
  import { merchFooterShowcase } from "./merch/merch-footer.showcase";
  import { merchHeaderShowcase } from "./merch/merch-header.showcase";
  import { merchHeroBannerShowcase } from "./merch/merch-hero-banner.showcase";
  import { merchProductCardShowcase } from "./merch/merch-product-card.showcase";
  import { merchProductGalleryShowcase } from "./merch/merch-product-gallery.showcase";
  import { merchProductGridShowcase } from "./merch/merch-product-grid.showcase";
  import { merchPurchasePanelShowcase } from "./merch/merch-purchase-panel.showcase";
  import { merchStoreShowcase } from "./merch/merch-store.showcase";
  ```

- [ ] **Step 2: Add 3 entries to the registry array in registry.ts**

  Find the merch array section (lines ~230–237):

  ```ts
  // merch — alphabetical: MerchCollectionHero < MerchFooter < MerchHeader < MerchHeroBanner < MerchProductCard < MerchProductGrid < MerchStore
  merchCollectionHeroShowcase,
  merchFooterShowcase,
  merchHeaderShowcase,
  merchHeroBannerShowcase,
  merchProductCardShowcase,
  merchProductGridShowcase,
  merchStoreShowcase,
  ```

  Replace with:

  ```ts
  // merch — alphabetical: MerchCartDrawer < MerchCollectionHero < MerchFooter < MerchHeader < MerchHeroBanner < MerchProductCard < MerchProductGallery < MerchProductGrid < MerchPurchasePanel < MerchStore
  merchCartDrawerShowcase,
  merchCollectionHeroShowcase,
  merchFooterShowcase,
  merchHeaderShowcase,
  merchHeroBannerShowcase,
  merchProductCardShowcase,
  merchProductGalleryShowcase,
  merchProductGridShowcase,
  merchPurchasePanelShowcase,
  merchStoreShowcase,
  ```

- [ ] **Step 3: Add exports to index.ts**

  Find the merch export block in `packages/ui/src/index.ts` (lines ~246–264):

  ```ts
  // merch — alphabetical: MerchCollectionHero < MerchFooter < MerchHeader < MerchHeroBanner < MerchProductCard < MerchProductGrid < MerchStore
  export { MerchCollectionHero } from "./merch/merch-collection-hero";
  ...
  export { MerchStore } from "./merch/merch-store";
  export type { MerchStoreProps, MerchNavLink } from "./merch/merch-store";
  ```

  After `export type { MerchStoreProps, MerchNavLink } ...`, add at the end (keeping alphabetical order — CartDrawer comes first, Gallery + PurchasePanel slot in):

  Actually, insert alphabetically. The full merch block in index.ts should be replaced to read:

  ```ts
  // merch — alphabetical: MerchCartDrawer < MerchCollectionHero < MerchFooter < MerchHeader < MerchHeroBanner < MerchProductCard < MerchProductGallery < MerchProductGrid < MerchPurchasePanel < MerchStore
  export { MerchCartDrawer } from "./merch/merch-cart-drawer";
  export type { MerchCartDrawerProps, MerchCartItem } from "./merch/merch-cart-drawer";
  export { MerchCollectionHero } from "./merch/merch-collection-hero";
  export type { MerchCollectionHeroProps, MerchBreadcrumb } from "./merch/merch-collection-hero";
  export { MerchFooter } from "./merch/merch-footer";
  export type {
    MerchFooterProps,
    MerchFooterLink,
    MerchFooterLinkGroup,
  } from "./merch/merch-footer";
  export { MerchHeader } from "./merch/merch-header";
  export type { MerchHeaderProps } from "./merch/merch-header";
  export { MerchHeroBanner } from "./merch/merch-hero-banner";
  export type { MerchHeroBannerProps, MerchHeroSlide } from "./merch/merch-hero-banner";
  export { MerchProductCard } from "./merch/merch-product-card";
  export type { MerchProductCardProps } from "./merch/merch-product-card";
  export { MerchProductGallery } from "./merch/merch-product-gallery";
  export type { MerchProductGalleryProps } from "./merch/merch-product-gallery";
  export { MerchProductGrid } from "./merch/merch-product-grid";
  export type { MerchProductGridProps } from "./merch/merch-product-grid";
  export { MerchPurchasePanel } from "./merch/merch-purchase-panel";
  export type { MerchPurchasePanelProps, MerchVariant } from "./merch/merch-purchase-panel";
  export { MerchStore } from "./merch/merch-store";
  export type { MerchStoreProps, MerchNavLink } from "./merch/merch-store";
  ```

  Note: `MerchVariant` is re-exported from `merch-purchase-panel.tsx` which itself imports and re-exports it from `@low/fixtures` — so this is safe (no duplicate definition).

- [ ] **Step 4: Typecheck**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3 && pnpm typecheck 2>&1 | head -60
  ```

  Expected: 0 errors.

- [ ] **Step 5: Commit registry wiring**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3
  git add packages/ui/src/registry.ts packages/ui/src/index.ts
  git commit -m "feat(merch): wire MerchProductGallery + MerchPurchasePanel + MerchCartDrawer to registry + index (#577 #578 #579)

  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01XpW4tnNqor2RLUhr8ybARZ"
  ```

---

### Task 6: Optional PDP route — apps/web/src/app/merch/[handle]/page.tsx

**Files:**
- Create: `apps/web/src/app/merch/[handle]/page.tsx`

**Interfaces:**
- Consumes: `MerchProductGallery`, `MerchPurchasePanel` from `@low/ui`; `championSplashUrl` from `@low/fixtures`
- Produces: static PDP demo at `/merch/<any-handle>`

This is a minimal server component — no cart integration at the page level (cart lives in a future layout-level demo or the showcase). The gallery and panel are rendered server-side with static props.

- [ ] **Step 1: Create [handle]/page.tsx**

  ```tsx
  /**
   * /merch/[handle] — minimal PDP demo route.
   * Wires MerchProductGallery (left column) + MerchPurchasePanel (right column)
   * with static fixture data. The merch layout.tsx already imports merch.css.
   *
   * For interactive demos (variant switching, qty stepper) see the /showcase entries.
   */
  import { championSplashUrl } from "@low/fixtures";
  import { MerchProductGallery, MerchPurchasePanel } from "@low/ui";

  /** Static fixture product for PDP demo. */
  const DEMO_PRODUCT = {
    title: "MSI 2026 Tee",
    price: "$39.99",
    originalPrice: undefined as string | undefined,
    badges: ["New"] as string[],
    description:
      "Celebrate Midseason Showdown with this officially licensed apparel. 100% cotton preshrunk jersey tee. Machine washable. Unisex sizing.",
    breadcrumb: ["Home", "Apparel", "MSI 2026 Tee"],
    variants: [
      { label: "XS", available: true },
      { label: "S", available: true },
      { label: "M", available: true },
      { label: "L", available: false },
      { label: "XL", available: true },
      { label: "XXL", available: false },
    ],
    images: [
      championSplashUrl("Jinx", 0),
      championSplashUrl("Lux", 0),
      championSplashUrl("Vi", 0),
      championSplashUrl("Ahri", 0),
    ],
  };

  export default function MerchProductPage() {
    return (
      <main
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "40px 32px",
          fontFamily: "var(--font-merch)",
          backgroundColor: "var(--color-merch-bg)",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 48,
            alignItems: "flex-start",
          }}
        >
          {/* Left: gallery — ~560px */}
          <div style={{ flex: "0 0 560px", maxWidth: 560 }}>
            <MerchProductGallery
              images={DEMO_PRODUCT.images}
              alt={DEMO_PRODUCT.title}
              selectedIndex={0}
            />
          </div>

          {/* Right: purchase panel — flex-1 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <MerchPurchasePanel
              title={DEMO_PRODUCT.title}
              price={DEMO_PRODUCT.price}
              originalPrice={DEMO_PRODUCT.originalPrice}
              badges={DEMO_PRODUCT.badges}
              description={DEMO_PRODUCT.description}
              breadcrumb={DEMO_PRODUCT.breadcrumb}
              variants={DEMO_PRODUCT.variants}
              variantLabel="Size"
              selectedVariant="M"
              quantity={1}
            />
          </div>
        </div>

        <p
          style={{
            marginTop: 32,
            fontSize: 12,
            color: "var(--color-merch-muted)",
          }}
        >
          Demo route — static props. For interactive variant/qty/cart demo see{" "}
          <a
            href="/showcase/merch-purchase-panel"
            style={{ color: "var(--color-merch-red)" }}
          >
            /showcase/merch-purchase-panel
          </a>
          .
        </p>
      </main>
    );
  }
  ```

- [ ] **Step 2: Typecheck**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3 && pnpm typecheck 2>&1 | head -60
  ```

  Expected: 0 errors.

- [ ] **Step 3: Hex grep check (PDP route)**

  ```bash
  grep -rnE "#[0-9a-fA-F]{3,8}" /Users/matintosh/dev/low-wt-merch3/apps/web/src/app/merch/
  ```

  Expected: no output.

- [ ] **Step 4: Commit PDP route**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3
  git add apps/web/src/app/merch/
  git commit -m "feat(merch): minimal PDP demo route /merch/[handle] composing gallery + panel (#577 #578)

  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01XpW4tnNqor2RLUhr8ybARZ"
  ```

---

### Task 7: Full gate — typecheck + build + hex grep + preview

- [ ] **Step 1: Full typecheck**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3 && pnpm typecheck 2>&1
  ```

  Expected: 0 errors across all packages.

- [ ] **Step 2: Production build**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3 && pnpm --filter web build 2>&1 | tail -30
  ```

  Expected: `✓ Compiled successfully` / exit 0. If it fails, check for import errors or missing types and fix them.

- [ ] **Step 3: Final hex grep — must be clean**

  ```bash
  grep -rnE "#[0-9a-fA-F]{3,8}" \
    /Users/matintosh/dev/low-wt-merch3/packages/ui/src/merch \
    /Users/matintosh/dev/low-wt-merch3/apps/web/src/app/merch
  ```

  Expected: no output (only merch.css token definitions + any exempt scrim inline style are allowed).

  If `rgba(0,0,0,0.4)` appears in the grep output — that's expected and exempt. The grep pattern `#[0-9a-fA-F]{3,8}` does NOT match `rgba(...)`, so there should be zero hits regardless.

- [ ] **Step 4: Preview server smoke-test**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3
  pnpm --filter web exec next start -p 3607 &
  sleep 5
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3607/showcase/merch-product-gallery
  echo ""
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3607/showcase/merch-purchase-panel
  echo ""
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3607/showcase/merch-cart-drawer
  echo ""
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3607/merch
  echo ""
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3607/merch/msi-2026-tee
  echo ""
  lsof -ti:3607 | xargs kill -9
  ```

  Expected: all responses are `200`. If any return `404` or `500`, diagnose from the next build output.

- [ ] **Step 5: Squash fixup commit if any build corrections were needed**

  If steps 1–4 required code fixes, commit those fixes:

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3
  git add -A
  git commit -m "fix(merch): gate fixes — typecheck + build corrections (#577 #578 #579)

  Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01XpW4tnNqor2RLUhr8ybARZ"
  ```

---

### Task 8: Push + PR

- [ ] **Step 1: Push branch**

  ```bash
  cd /Users/matintosh/dev/low-wt-merch3 && git push -u origin feat/merch-pdp-cart
  ```

- [ ] **Step 2: Create PR**

  ```bash
  gh pr create \
    --title "feat(merch): MerchProductGallery + MerchPurchasePanel + MerchCartDrawer (#577 #578 #579)" \
    --body "$(cat <<'EOF'
  ## Summary

  Implements the Riot merch store PDP shopping flow — three new presentational components.

  Closes #577
  Closes #578
  Closes #579

  ## MerchProductGallery (#577)

  PDP left column — main image + thumbnail strip.

  - Main image: 4:5 portrait aspect (override via `aspectRatio` prop), `object-fit: cover`, `var(--color-merch-surface)` bg
  - Thumbnail strip: 72×72px, 8px gap, hidden for single image
  - Active thumb: `2px solid var(--color-merch-ink)` border
  - Inactive thumb: `1px solid var(--color-merch-border)`; hover → ink border
  - Controlled (selectedIndex + onSelect); stateful demo in `.demo.tsx`
  - Showcase: 4-image (selected=0), 4-image (selected=1), 1-image (no strip), 6-image (selected=3), 1:1 override

  ## MerchPurchasePanel (#578)

  PDP right column — title, badges, price, variant chips, qty stepper, Add to Cart.

  - Title: `clamp(28px, 2.5vw, 32px)` / 700 / line-height 1.2
  - Badge chips: 10px uppercase / `var(--color-merch-ink)` bg / `var(--color-merch-on-dark)` text
  - Price: 20px / 600; sale = struck muted original + `var(--color-merch-red)` current
  - Variant chips: 8px 16px padding / flex-wrap / active = ink bg + on-dark + 2px border / disabled = 0.35 opacity + line-through + not-allowed
  - Qty stepper: 40×40px / 1px border / minus disabled at qty=1
  - Add to Cart: full-width 52px / `var(--color-merch-red)` → hover `var(--color-merch-red-dark)` / 14px 700 uppercase 0.1em ls
  - `outOfStock=true` → greyed button + "Out of Stock" label
  - Showcase: normal+sizes, sale, no-variants, out-of-stock

  ## MerchCartDrawer (#579)

  Right slide-in cart panel.

  - 400px wide, `position: fixed right-0`, z-50; scrim z-40 `rgba(0,0,0,0.4)` (exempt inline compositing value)
  - Header: 56px / "YOUR CART" 14px 700 uppercase 0.1em / × close
  - Line items: 80×80 thumb + title 13px/500 + variant 12px/muted + compact 28×28 stepper + 13px/600 price + "Remove" link
  - Compact stepper: minus disabled at qty=1 per item
  - Sticky footer: subtotal + "Shipping calculated at checkout" (12px muted) + 52px red checkout btn
  - Empty state: bag SVG icon + "Your cart is empty" 15px muted + "Continue Shopping" red link
  - Controlled: open/items/onClose/onQtyChange/onRemove/onCheckout/onContinueShopping
  - Showcase: open-with-2-items, open-empty, closed

  ## Tokens added/corrected

  No new tokens required — all measurements matched with existing `--color-merch-*` tokens from `packages/tokens/src/merch.css`.

  ## Type additions (packages/fixtures/src/types.ts)

  - `MerchVariant { label: string; available: boolean }` — size/colour chip shape
  - `MerchCartItem { id, title, imageUrl, variantLabel?, unitPrice, quantity }` — cart line item shape

  ## Raw-hex grep

  `grep -rnE "#[0-9a-fA-F]{3,8}" packages/ui/src/merch apps/web/src/app/merch` → CLEAN (zero hits).

  ## Gates

  - `pnpm typecheck` → PASS
  - `pnpm --filter web build` → PASS

  ---

  🤖 Generated with [Claude Code](https://claude.com/claude-code)
  https://claude.ai/code/session_01XpW4tnNqor2RLUhr8ybARZ
  EOF
  )"
  ```

- [ ] **Step 3: Label PR as status:review**

  ```bash
  gh pr edit <PR_NUMBER> --add-label "status:review"
  ```

  Replace `<PR_NUMBER>` with the number returned by `gh pr create`.

---

## Self-Review

### Spec coverage

| Spec requirement | Task |
|---|---|
| MerchProductGallery: 4:5 portrait main image | Task 2 |
| Thumbnail strip: 72×72, 8px gap | Task 2 |
| Active thumb: 2px ink border | Task 2 |
| Single image hides strip | Task 2 |
| Gallery controlled (selectedIndex + onSelect) | Task 2 |
| Gallery showcase: 4-image, 1-image, 6-image | Task 2 |
| MerchPurchasePanel: title 28–32px/700 | Task 3 |
| Badge chips: ink bg, on-dark text | Task 3 |
| Price: 20px/600; sale = struck original + red | Task 3 |
| Variant chips: active ink bg, disabled 0.35 opacity+line-through | Task 3 |
| Qty stepper: 40×40, minus disabled at 1 | Task 3 |
| Add to Cart: 52px red → red-dark hover | Task 3 |
| outOfStock: greyed button, "Out of Stock" label | Task 3 |
| Panel showcase: normal, sale, no-variants, out-of-stock | Task 3 |
| MerchCartDrawer: 400px, right slide-in | Task 4 |
| Scrim rgba(0,0,0,0.4) inline style (exempt) | Task 4 |
| Header 56px, "YOUR CART" 14px/700/uppercase | Task 4 |
| Line items: 80×80 thumb + details + compact stepper + remove | Task 4 |
| Compact stepper: 28×28, minus disabled at qty=1 per item | Task 4 |
| Sticky footer: subtotal + shipping note + checkout btn | Task 4 |
| Empty state: icon + message + "Continue Shopping" red link | Task 4 |
| Drawer showcase: open-items, open-empty, closed | Task 4 |
| MerchVariant + MerchCartItem types in @low/fixtures | Task 1 |
| registry.ts + index.ts wired (alphabetical) | Task 5 |
| Optional PDP route /merch/[handle] | Task 6 |
| Token hygiene hex grep clean | Task 7 |
| typecheck + build gates pass | Task 7 |
| Push + PR + label status:review | Task 8 |

All spec requirements covered.

### Placeholder scan

No TBDs, todos, or placeholder steps. All code blocks are complete.

### Type consistency

- `MerchVariant` defined in Task 1 (`packages/fixtures/src/types.ts`), imported in Task 3 component, re-exported in Task 5 index.ts — consistent.
- `MerchCartItem` defined in Task 1, imported in Task 4 component (`import type { MerchCartItem } from "@low/fixtures"`), re-exported in Task 5 — consistent.
- `MerchProductGalleryProps.selectedIndex` (Task 2) defaults to 0 — used as `selectedIndex={0}` in showcase (Task 2) and PDP route (Task 6) — consistent.
- `MerchPurchasePanelProps.quantity` (Task 3) defaults to 1 — consistent across showcase and demo.
- `MerchCartDrawerProps.items` is `MerchCartItem[]` — used as such in showcase (Task 4) and demo (Task 4) — consistent.
