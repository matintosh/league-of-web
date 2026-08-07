/**
 * MerchGiftCardBand — "Give a Gift Card" promo band for the Riot merch store.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens
 * (add a token to @low/tokens if one is missing, sampled from the real store)
 * and a modern e-commerce layout. This is NOT the Hextech client — IGNORE the
 * client Hextech-only / no-default-Tailwind-palette guidance; still tokens-only
 * (no raw hex outside packages/tokens), presentational (props in/callbacks out,
 * NO fetching in @low/ui, types from @low/fixtures), showcase server-safe
 * (no 'use client'), SVG/gradient ids from useId.
 *
 * Measured from merch.riotgames.com (band above footer, ~1280px desktop):
 *   - Height: ~447px
 *   - Background: --color-merch-surface-alt (#f7f7f7) at ALL viewports (light band)
 *   - Layout: 2-col grid — text left at x=137, two card visuals right
 *   - Eyebrow: "GIFT CARDS" Inter (--font-merch) 14px/600, lh18, ls0.28px,
 *              --color-merch-franchise-label (#666666)
 *   - Heading: riotSans 48px/600, lh52, text-transform none (source uppercase), pure black
 *              (--color-merch-ink-dark), left-aligned at all viewports, x=137 @1280
 *   - No subcopy paragraph
 *   - CTA: "Buy It Now", --color-merch-red background, --color-merch-on-dark,
 *           riotSans 16px/600 uppercase, lh18, ls0.32px, 239×50px at md+, w-full at <md,
 *           corner-notch clip-path: 20px diagonal cuts on top-left + bottom-right
 *   - Mobile container inset: x=17px
 *   - Card visuals: near-square low-radius cards, faint faded-character backdrop
 *   - Mobile element order: heading → cards image → full-width CTA below image
 */

"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A single gift-card visual shown in the right column of the band. */
export interface MerchGiftCard {
  /** URL of the card image. */
  imageUrl: string;
  /** Accessible label for the card image. */
  label: string;
}

export interface MerchGiftCardBandProps {
  /** Band heading — rendered all-caps via CSS. Defaults to "GIVE A GIFT CARD". */
  heading?: string;
  /** CTA button label. Defaults to "Buy It Now". */
  ctaLabel?: string;
  /** Callback when CTA is clicked. */
  onCtaClick?: () => void;
  /**
   * Up to 2 gift card images displayed in the right column.
   * Supplied by the page — never fetched in @low/ui.
   */
  cards?: [MerchGiftCard] | [MerchGiftCard, MerchGiftCard];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchGiftCardBand — promo band rendered above the footer on the /merch
 * homepage. ~447px tall. Light band (--color-merch-surface-alt) at ALL
 * viewports. Desktop: 2-col grid, text left at x=137, two gift card visuals
 * right. Mobile layout: heading → card image → full-width CTA.
 * Matches merch.riotgames.com gift-card section at 1280 and 390.
 *
 *  - Band is LIGHT at all viewports — removed mobile dark override
 *  - Heading: pure black (--color-merch-ink-dark), all-caps (text-transform: uppercase), lh52
 *  - Eyebrow: --font-merch (Inter) 14px/600, lh18, ls0.28px, --color-merch-franchise-label
 *  - Vertical gaps: eyebrow→heading 16px, heading→CTA 32px
 *  - Mobile inset: 17px (down from 24px/px-6)
 *  - CTA: ls0.32px, lh18, corner-notch clip (20px TL+BR diagonal cuts); w-full at <md, 239×50 at md+
 */
export function MerchGiftCardBand({
  heading = "GIVE A GIFT CARD",
  ctaLabel = "Buy It Now",
  onCtaClick,
  cards,
}: MerchGiftCardBandProps) {
  const gradId = useId();

  return (
    <section
      aria-label="Gift card promo"
      className="w-full relative overflow-hidden"
      style={{
        /* Light band at ALL viewports — matches real merch.riotgames.com */
        backgroundColor: "var(--color-merch-surface-alt)",
        minHeight: "447px",
      }}
    >
      {/*
       * Faint faded-character backdrop layer (desktop only) — very low opacity
       * gradient wash suggesting the faded artwork visible behind the cards on
       * the real merch.riotgames.com gift-card section.
       */}
      <div
        className="absolute inset-0 hidden md:block pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to right, transparent 55%, color-mix(in srgb, var(--color-merch-ink) 6%, transparent) 100%)",
        }}
      />

      {/*
       * Content wrapper.
       *
       * Mobile (column): three children stacked — text group (eyebrow+heading),
       * image column, CTA — in that visual order via CSS order properties.
       * Desktop (row): text group left, image column right; CTA lives inside the
       * text group and flows naturally after heading.
       *
       * We achieve mobile order without DOM duplication by splitting the text
       * group into two parts: (1) eyebrow+heading [order-1 mobile], (2) CTA [order-3 mobile],
       * with the image column [order-2 mobile] between them.
       */}
      <div
        className="relative mx-auto flex max-w-screen-xl flex-col gap-8 px-[17px] py-12
                   md:flex-row md:gap-16 md:py-0 md:min-h-[447px] md:px-0 md:pl-[137px] md:pr-8 md:items-center"
      >
        {/*
         * ── Left / text area ──
         * Desktop: flex-col with eyebrow → heading → CTA all in one column.
         * Mobile: eyebrow+heading (order-1) plus CTA (order-3) are siblings of the
         * image column (order-2). We achieve this by wrapping only the eyebrow and
         * heading here, and placing the CTA as a separate top-level child.
         */}

        {/* Text group: eyebrow + heading (mobile order: 1 → top) */}
        <div
          className="relative z-10 flex flex-col items-start text-left
                     md:flex-1 md:flex-col"
          style={{ order: 1 }}
        >
          {/*
           * Eyebrow — "GIFT CARDS", Inter 14px/600, lh18, ls0.28px, color #666666.
           * --color-merch-franchise-label = #666666 = rgb(102,102,102) measured from real site.
           * Uppercase per real site.
           */}
          <span
            className="text-sm font-semibold uppercase"
            style={{
              fontFamily: "var(--font-merch)",
              color: "var(--color-merch-franchise-label)",
              lineHeight: "18px",
              letterSpacing: "0.28px",
            }}
          >
            GIFT CARDS
          </span>

          {/*
           * Heading — riotSans 48px/600, lh52, all-caps via text-transform,
           * pure black (--color-merch-ink-dark), left-aligned.
           * Gap from eyebrow: 16px (mt-4).
           */}
          <h2
            className="mt-4"
            style={{
              fontFamily: "var(--font-merch-display)",
              color: "var(--color-merch-ink-dark)",
              fontSize: "48px",
              fontWeight: 600,
              lineHeight: "52px",
              letterSpacing: "normal",
              /* Real site: text-transform none; source text is uppercase */
              textTransform: "none",
            }}
          >
            {heading}
          </h2>

          {/*
           * CTA — desktop only in this slot (natural flow after heading).
           * Hidden on mobile; the CTA sibling below shows at mobile order-3.
           * Gap from heading: 32px (mt-8).
           * Arrow-notch left edge (inward chevron) + slanted right edge.
           * ls 0.32px, lh 18px.
           */}
          <button
            type="button"
            onClick={onCtaClick}
            className="mt-8 hidden md:flex items-center justify-center font-semibold uppercase
                       transition-opacity duration-150 hover:opacity-85 active:opacity-70"
            style={{
              width: "239px",
              height: "50px",
              backgroundColor: "var(--color-merch-red)",
              color: "var(--color-merch-on-dark)",
              fontFamily: "var(--font-merch-display)",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "18px",
              letterSpacing: "0.32px",
              /* Corner-notch: 20px diagonal cuts on top-left + bottom-right */
              clipPath: "polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)",
            }}
          >
            {ctaLabel}
          </button>
        </div>

        {/* ── Right column — gift card visuals (mobile order: 2 → middle) ── */}
        <div
          className="relative z-10 flex flex-1 items-center justify-center"
          style={{ order: 2 }}
        >
          {cards && cards.length > 0 ? (
            <div className="relative flex items-center justify-center w-full max-w-md">
              {/* Back card — rotated behind, slightly offset */}
              {cards[1] && (
                <div
                  className="absolute"
                  style={{
                    transform: "rotate(-5deg) translate(-10%, 10%)",
                    zIndex: 0,
                    width: "58%",
                    maxWidth: "275px",
                  }}
                >
                  <img
                    src={cards[1].imageUrl}
                    alt={cards[1].label}
                    className="w-full object-cover shadow-lg"
                    style={{
                      aspectRatio: "85/54",
                      borderRadius: "4px",
                    }}
                    draggable={false}
                  />
                </div>
              )}
              {/* Front card */}
              <div
                className="relative"
                style={{
                  transform: "rotate(3deg) translate(16%, -8%)",
                  zIndex: 1,
                  width: "58%",
                  maxWidth: "275px",
                }}
              >
                <img
                  src={cards[0].imageUrl}
                  alt={cards[0].label}
                  className="w-full object-cover shadow-xl"
                  style={{
                    aspectRatio: "85/54",
                    borderRadius: "4px",
                  }}
                  draggable={false}
                />
              </div>
            </div>
          ) : (
            /* Placeholder SVG when no cards provided — near-square, low-radius */
            <div className="flex w-full max-w-md items-center justify-center" style={{ minHeight: "172px" }}>
              {/* Back placeholder card */}
              <div
                className="absolute"
                style={{ transform: "rotate(-5deg) translate(-10%, 10%)", zIndex: 0, width: "58%", maxWidth: "275px" }}
              >
                <svg
                  viewBox="0 0 275 172"
                  aria-hidden="true"
                  style={{ width: "100%", borderRadius: "4px", display: "block", opacity: 0.7 }}
                >
                  <defs>
                    <linearGradient id={`${gradId}-card-b`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-merch-ink)" />
                      <stop offset="100%" stopColor="var(--color-merch-ink-dark)" />
                    </linearGradient>
                  </defs>
                  <rect width="275" height="172" rx="4" fill={`url(#${gradId}-card-b)`} />
                </svg>
              </div>
              {/* Front placeholder card */}
              <div
                className="relative"
                style={{ transform: "rotate(3deg) translate(16%, -8%)", zIndex: 1, width: "58%", maxWidth: "275px" }}
              >
                <svg
                  viewBox="0 0 275 172"
                  aria-label="Gift card placeholder"
                  style={{ width: "100%", borderRadius: "4px", display: "block" }}
                >
                  <defs>
                    <linearGradient id={`${gradId}-card-f`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-merch-ink-dark)" />
                      <stop offset="100%" stopColor="var(--color-merch-red)" />
                    </linearGradient>
                  </defs>
                  <rect width="275" height="172" rx="4" fill={`url(#${gradId}-card-f)`} />
                  <text
                    x="20"
                    y="92"
                    fontFamily="var(--font-merch-display)"
                    fontSize="20"
                    fontWeight="600"
                    fill="var(--color-merch-on-dark)"
                    letterSpacing="2"
                  >
                    RIOT GAMES
                  </text>
                  <text
                    x="20"
                    y="116"
                    fontFamily="var(--font-merch-display)"
                    fontSize="12"
                    fill="var(--color-merch-on-dark)"
                    opacity="0.7"
                    letterSpacing="1"
                  >
                    GIFT CARD
                  </text>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/*
         * CTA — mobile only (order-3, below image). Hidden on md+ where the
         * desktop CTA inside the text group is shown instead.
         * w-full at mobile. Arrow-notch left (inward V) + slanted right edge.
         * ls 0.32px, lh 18px.
         */}
        <button
          type="button"
          onClick={onCtaClick}
          className="md:hidden relative flex items-center justify-center w-full font-semibold uppercase
                     transition-opacity duration-150 hover:opacity-85 active:opacity-70"
          style={{
            order: 3,
            height: "50px",
            backgroundColor: "var(--color-merch-red)",
            color: "var(--color-merch-on-dark)",
            fontFamily: "var(--font-merch-display)",
            fontSize: "16px",
            fontWeight: 600,
            lineHeight: "18px",
            letterSpacing: "0.32px",
            /* Corner-notch: 20px diagonal cuts on top-left + bottom-right */
            clipPath: "polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)",
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </section>
  );
}
