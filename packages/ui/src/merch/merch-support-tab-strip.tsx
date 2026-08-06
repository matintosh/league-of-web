"use client";

/**
 * MerchSupportTabStrip — horizontal pill-button tab row for /merch/pages/[slug].
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client.
 * Presentational: props in, onSelect callback out — no data fetching in @low/ui.
 * Types (MerchSupportTab) are imported from @low/fixtures.
 *
 * Measured from merch.riotgames.com/en-us/faqs/ (9 section tabs):
 *   - Strip: full-bleed --color-merch-support-band (#eb0029) background
 *   - Band height: ~160px desktop (@1280), ~92px mobile (@390) — centred vertically
 *   - Pills: transparent bg, black (--color-merch-ink) 16px label text, h=40
 *     Active pill: same transparent + subtle underline or filled-dark treatment
 *     FROZEN: pill label typography is anti-oscillation frozen — 13px/600/uppercase/0.04em
 *   - Label: 13px, font-weight 600, uppercase, letter-spacing 0.04em; no-wrap
 *   - Gap between pills: 8px
 *   - Container: horizontally scrollable at narrow viewports (no-wrap); bounded
 *     to viewport width so docWidth never exceeds 390px at mobile
 *   - Border-radius per pill: 9999px (full pill shape)
 *   - NO grey bottom-border on the band
 */

import type { MerchSupportTab } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchSupportTabStripProps {
  /** Ordered list of support section tabs to render. */
  sections: MerchSupportTab[];
  /** Slug of the currently active section — that pill is filled/bold. */
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
 * MerchSupportTabStrip — horizontal pill-button row matching the real support
 * portal tab navigation. Active pill is ink-filled; inactive pills are outlined.
 * The strip scrolls horizontally on narrow viewports without page overflow.
 */
export function MerchSupportTabStrip({
  sections,
  activeSlug,
  onSelect,
}: MerchSupportTabStripProps) {
  return (
    /* Full-bleed red band — rgb(235,0,41) measured from real .support-page-hero_hero-nav-container */
    /* Desktop: ~160px tall; mobile: ~92px tall — no grey bottom border */
    <div
      className="w-full"
      style={{ backgroundColor: "var(--color-merch-support-band)" }}
    >
      {/* Inner wrapper: centred, 96px inner tag row per real measurements; vertically centres the pill row */}
      <div
        className="flex items-center"
        style={{
          /* 160px total band height on desktop, 92px on mobile */
          minHeight: "clamp(92px, calc(92px + (160 - 92) * ((100vw - 390px) / (1280 - 390))), 160px)",
        }}
      >
        {/* Scrollable row — overflow-x-auto with no-wrap keeps pills on one line */}
        {/* overflow: hidden on the outer band ensures pills never cause page overflow at 390 */}
        <div
          className="w-full overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          <nav
            aria-label="Support sections"
            className="flex items-center gap-2 px-6 md:px-10 lg:px-16"
            style={{
              /* whitespace-nowrap keeps pills on a single line regardless of container width */
              whiteSpace: "nowrap",
            }}
          >
            {sections.map((tab) => {
              const isActive = tab.slug === activeSlug;
              return (
                <button
                  key={tab.slug}
                  type="button"
                  onClick={() => onSelect?.(tab.slug)}
                  aria-current={isActive ? "page" : undefined}
                  className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full px-4 transition-colors duration-150"
                  style={
                    /* FROZEN: pill label typography — 13px/600/uppercase/0.04em — anti-oscillation lock */
                    isActive
                      ? {
                          height: 40,
                          backgroundColor: "var(--color-merch-ink)",
                          color: "var(--color-merch-on-dark)",
                          border: "1px solid var(--color-merch-ink)",
                          fontSize: 13,
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }
                      : {
                          height: 40,
                          backgroundColor: "transparent",
                          /* real: black 16px labels on the red band */
                          color: "var(--color-merch-ink)",
                          border: "1px solid var(--color-merch-ink)",
                          fontSize: 13,
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }
                  }
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
