"use client";

/**
 * MerchSupportTabStrip — wrapping red-band tab row for /merch/pages/[slug].
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client.
 * Presentational: props in, onSelect callback out — no data fetching in @low/ui.
 * Types (MerchSupportTab) are imported from @low/fixtures.
 *
 * Round-4 re-review (issue #897) — REVERSES round-3 pill treatment (#862):
 * Real support tabs are PLAIN BLACK LOWERCASE TEXT LINKS — NO pills, NO borders,
 * NO fill, NO radius. Measured from merch.riotgames.com/en-us/faqs/:
 *   - Strip: full-bleed --color-merch-support-band (#eb0029) background.
 *   - Band height: ~160px desktop with 9 tabs wrapping; 32px vertical padding.
 *   - Tab links: transparent bg, NO border, NO radius, NO padding.
 *     Color rgb(0,0,0) == --color-merch-ink-dark (black), weight 400, lowercase source text,
 *     no text-transform. ~165px natural width, 40px tall.
 *   - Active tab: no bordered-box state — real shows no active outline; underline on active/hover.
 *   - Row layout: flex-wrap, justify-center, gap 16 (gap-4); wrapper ~160px band.
 *   - 390: single-row horizontal-scroll strip ~92px tall; flex-nowrap + overflow-x-auto.
 *     overflowing right, NO wrap to multiple rows. scrollWidth === 390.
 */

import type { MerchSupportTab } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchSupportTabStripProps {
  /** Ordered list of support section tabs to render. */
  sections: MerchSupportTab[];
  /** Slug of the currently active section — that tab is underlined. */
  activeSlug: string;
  /**
   * Called when the user clicks a tab.
   * @param slug — the tab's slug value; the page should route to /merch/pages/{slug}
   */
  onSelect?: (slug: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchSupportTabStrip — plain black lowercase text-link tab row on the red band.
 * No pills, no borders, no fill. Tabs are centered with gap-16 on desktop and
 * horizontal-scroll (flex-nowrap + overflow-x-auto) at 390px.
 */
export function MerchSupportTabStrip({
  sections,
  activeSlug,
  onSelect,
}: MerchSupportTabStripProps) {
  return (
    /* Full-bleed red band — rgb(235,0,41) measured from real .support-page-hero_hero-nav-container */
    /* Desktop: ~160px tall with 9 tabs wrapping; 32px vertical padding */
    <div
      className="w-full"
      style={{ backgroundColor: "var(--color-merch-support-band)" }}
    >
      {/*
        Nav: centered flex row.
        Desktop (md+): flex-wrap, justify-center, gap-4 (16px), ~32px vertical padding → ~160px band.
        Mobile / 390: flex-nowrap + overflow-x-auto → single-row horizontal scroll, ~92px tall.
        No max-w container padding at narrow — the strip overflows right to let user scroll.
      */}
      <nav
        aria-label="Support sections"
        className="
          flex overflow-x-auto py-8
          flex-nowrap gap-4
          md:flex-wrap md:justify-center
        "
        style={{
          /* 32px left padding on desktop to match spec; slim scrollbar */
          scrollbarWidth: "none",
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
              className="cursor-pointer shrink-0 whitespace-nowrap transition-opacity duration-150 hover:opacity-80"
              style={{
                /*
                 * Plain text link — NO pill treatment.
                 * Color: rgb(0,0,0) == --color-merch-ink-dark (black), weight 400.
                 * No text-transform — source text is already lowercase.
                 * Active: underline only (no border/box).
                 * ~165px natural width, 40px tall, no padding, no border, no radius.
                 */
                height: 40,
                backgroundColor: "transparent",
                color: "var(--color-merch-ink-dark)",
                border: "none",
                borderRadius: 0,
                padding: 0,
                fontSize: 16,
                fontWeight: 400,
                fontFamily: "Inter, sans-serif",
                letterSpacing: "normal",
                textTransform: "none",
                textDecoration: isActive ? "underline" : "none",
                textUnderlineOffset: 3,
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
