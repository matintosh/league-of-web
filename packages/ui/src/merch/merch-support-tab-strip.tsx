"use client";

/**
 * MerchSupportTabStrip — wrapping red-band tab row for /merch/pages/[slug].
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client.
 * Presentational: props in, onSelect callback out — no data fetching in @low/ui.
 * Types (MerchSupportTab) are imported from @low/fixtures.
 *
 * Measured from merch.riotgames.com/en-us/faqs/ (9 section tabs):
 *   - Strip: full-bleed --color-merch-support-band (#eb0029) background.
 *   - Band padding: 32px top/bottom (py-8); ~160px tall desktop with 9 wrapping tabs.
 *   - Pills: TRANSPARENT bg, 1px solid --color-merch-on-dark border, --color-merch-on-dark text.
 *     Active pill: same transparent bg with 2px solid white border (slightly stronger).
 *   - Pill layout: flex-wrap — 9 real tabs WRAP onto two rows; NO overflow-x scroll.
 *   - Label: Inter 16px, font-weight 600 on ALL pills (capitalize), mixed-case.
 *   - Padding per pill: 4px 8px inside a 40px-tall container.
 *   - Gap between pills: 8px.
 *   - Border-radius per pill: 2px (near-square chip, NOT rounded-full).
 *   - NO 390 overflow — wrapping prevents off-screen pills at any viewport.
 */

import type { MerchSupportTab } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchSupportTabStripProps {
  /** Ordered list of support section tabs to render. */
  sections: MerchSupportTab[];
  /** Slug of the currently active section — that pill is highlighted. */
  activeSlug: string;
  /**
   * Called when the user clicks a pill.
   * @param slug — the tab's slug value; the page should route to /merch/pages/{slug}
   */
  onSelect?: (slug: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchSupportTabStrip — transparent-pill tab row matching the real support portal
 * tab navigation on the red band. Pills are transparent with a white border and
 * white text — the inverse of the old white-filled treatment. Near-square 2px
 * radius chips, not rounded-full. Wraps to multiple rows at narrow viewports.
 */
export function MerchSupportTabStrip({
  sections,
  activeSlug,
  onSelect,
}: MerchSupportTabStripProps) {
  return (
    /* Full-bleed red band — rgb(235,0,41) measured from real .support-page-hero_hero-nav-container */
    /* Desktop: ~160px tall with 9 pills wrapping; 32px vertical padding */
    <div
      className="w-full"
      style={{ backgroundColor: "var(--color-merch-support-band)" }}
    >
      {/* Inner wrapper: centred container, 32px top/bottom padding */}
      <nav
        aria-label="Support sections"
        className="mx-auto flex max-w-screen-xl flex-wrap items-center gap-2 px-6 py-8 md:px-10 lg:px-16"
      >
        {sections.map((tab) => {
          const isActive = tab.slug === activeSlug;
          return (
            <button
              key={tab.slug}
              type="button"
              onClick={() => onSelect?.(tab.slug)}
              aria-current={isActive ? "page" : undefined}
              className="inline-flex cursor-pointer items-center justify-center transition-colors duration-150"
              style={
                /*
                 * Real: TRANSPARENT pills, white border, white text.
                 * Active pill: same transparent bg with 2px border (stronger outline).
                 * Label: Inter 16px/600 mixed-case (capitalize) on ALL pills — NOT uppercase.
                 * Padding: 4px 8px inside 40px-tall pill.
                 * Border-radius: 2px (near-square chip, NOT 9999px).
                 */
                isActive
                  ? {
                      height: 40,
                      backgroundColor: "transparent",
                      color: "var(--color-merch-on-dark)",
                      border: "2px solid var(--color-merch-on-dark)",
                      borderRadius: 2,
                      padding: "4px 8px",
                      fontSize: 16,
                      fontWeight: 600,
                      fontFamily: "Inter, sans-serif",
                      letterSpacing: "normal",
                      textTransform: "capitalize",
                    }
                  : {
                      height: 40,
                      backgroundColor: "transparent",
                      color: "var(--color-merch-on-dark)",
                      border:
                        "1px solid color-mix(in srgb, var(--color-merch-on-dark) 70%, transparent)",
                      borderRadius: 2,
                      padding: "4px 8px",
                      fontSize: 16,
                      fontWeight: 600,
                      fontFamily: "Inter, sans-serif",
                      letterSpacing: "normal",
                      textTransform: "capitalize",
                    }
              }
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
