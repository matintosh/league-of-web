"use client";

/**
 * MerchCategoryStrip — horizontal franchise chip row beneath the /merch hero.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens
 * (add a token to @low/tokens if one is missing, sampled from the real store)
 * and a modern e-commerce layout. This is NOT the Hextech client — IGNORE the
 * client Hextech-only / no-default-Tailwind-palette guidance; still tokens-only
 * (no raw hex outside packages/tokens; NO hardcoded hex fallbacks in
 * var(--color-merch-*)), presentational (props in/callbacks out, NO fetching
 * in @low/ui), showcase server-safe (no 'use client'), SVG ids from useId.
 *
 * Measured from merch.riotgames.com/en-us/ (~1280px desktop):
 *   - Strip: full-width, ~56px tall, background black (--color-merch-ink-dark)
 *   - Tiles: skewed parallelogram via CSS `transform: skewX(-12deg)`, inner
 *     content counter-skewed `skewX(12deg)`, ~150–175px wide, 56px tall
 *   - Label: 13px, font-weight 700, uppercase, letter-spacing 0.06em
 *   - Tile colors: one CSS variable per franchise (--color-merch-cat-*)
 *   - Text color: white (--color-merch-on-dark) or dark (--color-merch-ink)
 *   - Scroll chevron: › at right edge, white, ~24px, visible when strip overflows
 *   - Gap between strip bottom and hero: ~0; small gap (~16px) to grid below
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single franchise chip entry. */
export interface MerchFranchiseChip {
  /** URL-safe slug, e.g. "league-of-legends". Passed to `onSelectFranchise`. */
  slug: string;
  /** Display label rendered in the chip, e.g. "LEAGUE OF LEGENDS". */
  label: string;
  /**
   * CSS custom property name for the tile background, e.g. `"--color-merch-cat-lol"`.
   * Must exist in the merch token set (packages/tokens/src/merch.css).
   */
  colorVar: string;
  /**
   * Optional CSS custom property for label text color.
   * Defaults to `"--color-merch-on-dark"` (white).
   * Use `"--color-merch-ink"` for chips with a light background (e.g. esports cyan, 2XKO lime).
   */
  textColorVar?: string;
  /**
   * Optional sub-label rendered below the main label in a smaller weight.
   * Used by Riftbound which shows "League of Legends" beneath the wordmark.
   */
  subLabel?: string;
}

export interface MerchCategoryStripProps {
  /** Ordered list of franchise chips to render. */
  categories: MerchFranchiseChip[];
  /**
   * Called when a chip is clicked.
   * @param slug — the chip's slug value
   */
  onSelectFranchise?: (slug: string) => void;
  /** Accessible label for the navigation landmark. @default "Shop by franchise" */
  ariaLabel?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchCategoryStrip — skewed parallelogram franchise chip row.
 * Sits directly under the hero carousel on the /merch homepage.
 * Horizontally scrollable on narrow viewports; › scroll affordance at right.
 */
export function MerchCategoryStrip({
  categories,
  onSelectFranchise,
  ariaLabel = "Shop by franchise",
}: MerchCategoryStripProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: "var(--color-merch-ink-dark)",
        fontFamily: "var(--font-merch)",
        height: 56,
      }}
    >
      {/* Scrollable chip row */}
      <ul
        className="flex h-full list-none items-stretch overflow-x-auto"
        style={{
          /* Hide scrollbar but allow scroll */
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          margin: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingLeft: 0,
          /* Right padding leaves space for the › affordance */
          paddingRight: 40,
        }}
        /* Webkit scrollbar hidden via inline style is insufficient; use a global
           CSS class if needed. Strip is self-contained so we leave it minimal. */
      >
        {categories.map((chip) => {
          const textVar = chip.textColorVar ?? "--color-merch-on-dark";
          return (
            <li
              key={chip.slug}
              className="flex shrink-0 items-stretch"
              /* Skewed tiles leave a thin dark sliver at their diagonal edges;
                 a small negative inline-end margin overlaps neighbours so the
                 parallelograms tessellate seamlessly like the real store. */
              style={{ marginInlineEnd: -8 }}
            >
              <button
                type="button"
                onClick={() => onSelectFranchise?.(chip.slug)}
                className="group relative flex cursor-pointer items-center justify-center border-0 transition-opacity duration-150 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px]"
                style={{
                  /* Skewed parallelogram tile */
                  transform: "skewX(-12deg)",
                  backgroundColor: `var(${chip.colorVar})`,
                  minWidth: 160,
                  paddingInline: 20,
                  /* No border-radius — skew creates the parallelogram shape */
                  borderRadius: 0,
                  outlineColor: `var(${textVar})`,
                }}
                aria-label={chip.label}
              >
                {/* Counter-skew wrapper so text stays upright */}
                <span
                  className="flex flex-col items-center justify-center gap-0"
                  style={{ transform: "skewX(12deg)" }}
                >
                  <span
                    className="text-[13px] font-bold uppercase leading-tight tracking-[0.06em]"
                    style={{ color: `var(${textVar})` }}
                  >
                    {chip.label}
                  </span>
                  {chip.subLabel && (
                    <span
                      className="text-[10px] font-medium uppercase leading-tight tracking-[0.04em]"
                      style={{ color: `var(${textVar})`, opacity: 0.75 }}
                    >
                      {chip.subLabel}
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* › scroll chevron — right edge affordance, always visible */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, var(--color-merch-ink-dark) 50%)",
          width: 48,
        }}
        aria-hidden
      >
        <svg
          width={10}
          height={16}
          viewBox="0 0 10 16"
          fill="none"
          className="absolute right-4"
          aria-hidden
          style={{ color: "var(--color-merch-on-dark)", opacity: 0.7 }}
        >
          <path
            d="M2 2l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </nav>
  );
}
