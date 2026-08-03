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
 *   - Strip: white/light background, padding 12px 16px
 *   - Pills: outlined (1px --color-merch-border); active pill = --color-merch-ink fill
 *     + --color-merch-on-dark text (white); inactive = transparent bg +
 *     --color-merch-ink text + --color-merch-border border
 *   - Label: 13px, font-weight 600, uppercase, letter-spacing 0.04em; no-wrap
 *   - Gap between pills: 8px
 *   - Container: horizontally scrollable at narrow viewports (no-wrap); bounded
 *     to viewport width so docWidth never exceeds 390px at mobile
 *   - Border-radius per pill: 9999px (full pill shape)
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
    <div
      className="w-full"
      style={{
        backgroundColor: "var(--color-merch-bg)",
        borderBottom: "1px solid var(--color-merch-border)",
      }}
    >
      {/* Scrollable row — overflow-x-auto with no-wrap keeps pills on one line */}
      <div
        className="overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        <nav
          aria-label="Support sections"
          className="flex items-center gap-2 px-6 py-3 md:px-10 lg:px-16"
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
                className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full px-4 py-2 transition-colors duration-150"
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--color-merch-ink)",
                        color: "var(--color-merch-on-dark)",
                        border: "1px solid var(--color-merch-ink)",
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }
                    : {
                        backgroundColor: "transparent",
                        color: "var(--color-merch-ink)",
                        border: "1px solid var(--color-merch-border)",
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
  );
}
