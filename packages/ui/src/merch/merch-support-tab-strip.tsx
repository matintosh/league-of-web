"use client";

/**
 * MerchSupportTabStrip — wrapping white-pill tab row for /merch/pages/[slug].
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client.
 * Presentational: props in, onSelect callback out — no data fetching in @low/ui.
 * Types (MerchSupportTab) are imported from @low/fixtures.
 *
 * Measured from merch.riotgames.com/en-us/faqs/ (9 section tabs):
 *   - Strip: full-bleed --color-merch-support-band (#eb0029) background.
 *   - Band padding: 32px top/bottom (py-8); ~160px tall desktop with 9 wrapping tabs.
 *   - Pills: WHITE-filled (--color-merch-on-dark bg), white/light border (#ffffff80), DARK text (--color-merch-ink-dark).
 *     Active pill: same white fill with slightly stronger border or shadow.
 *   - Pill layout: flex-wrap — 9 real tabs WRAP onto two rows; NO overflow-x scroll.
 *   - Label: Inter 16px, font-weight ~400, mixed-case (NOT uppercase, NOT riotSans).
 *   - Gap between pills: 8px.
 *   - Border-radius per pill: 9999px (full pill shape).
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
 * MerchSupportTabStrip — white-pill tab row matching the real support portal
 * tab navigation. Pills WRAP to multiple rows at narrow viewports — no horizontal
 * scroll. Active pill shares the same white fill as inactive; all pills are
 * white-filled with dark text on the red band.
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
              className="inline-flex cursor-pointer items-center justify-center rounded-full px-4 transition-colors duration-150"
              style={
                /*
                 * Real: WHITE-filled pills, white/light border, dark ink text.
                 * Active pill gets a slightly stronger border to distinguish it.
                 * Label: Inter 16px/400 mixed-case — NOT uppercase, NOT riotSans.
                 */
                isActive
                  ? {
                      height: 40,
                      backgroundColor: "var(--color-merch-on-dark)",
                      color: "var(--color-merch-ink-dark)",
                      border: "2px solid var(--color-merch-on-dark)",
                      fontSize: 16,
                      fontWeight: 600,
                      fontFamily: "Inter, sans-serif",
                      letterSpacing: "normal",
                      textTransform: "none",
                    }
                  : {
                      height: 40,
                      backgroundColor: "var(--color-merch-on-dark)",
                      color: "var(--color-merch-ink)",
                      border:
                        "1px solid color-mix(in srgb, var(--color-merch-on-dark) 50%, transparent)",
                      fontSize: 16,
                      fontWeight: 400,
                      fontFamily: "Inter, sans-serif",
                      letterSpacing: "normal",
                      textTransform: "none",
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
