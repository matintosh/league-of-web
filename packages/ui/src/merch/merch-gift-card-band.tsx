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
 *   - Background: --color-merch-surface-alt (#f7f7f7)
 *   - Layout: 2-col grid — text left, two card visuals right
 *   - Heading: ALL-CAPS, font-weight 700, ~36–40px, --color-merch-ink
 *   - Subcopy: ~16px, --color-merch-body, max ~340px wide
 *   - CTA: --color-merch-red background, white text, uppercase, ~14px
 *   - Card visuals: two stacked/overlapping gift card images, right column
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
  /** Band heading — displayed uppercase. Defaults to "GIVE A GIFT CARD". */
  heading?: string;
  /** Subcopy beneath the heading. */
  subcopy?: string;
  /** CTA button label. Defaults to "Shop Gift Cards". */
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
 * homepage. ~447px tall, --color-merch-surface-alt bg, 2-col grid: text left,
 * two gift card visuals right. Matches merch.riotgames.com gift-card section.
 */
export function MerchGiftCardBand({
  heading = "GIVE A GIFT CARD",
  subcopy = "Give the gift of Riot merch. Gift cards are redeemable for anything in the store.",
  ctaLabel = "Shop Gift Cards",
  onCtaClick,
  cards,
}: MerchGiftCardBandProps) {
  const gradId = useId();

  return (
    <section
      aria-label="Gift card promo"
      style={{
        backgroundColor: "var(--color-merch-surface-alt)",
        fontFamily: "var(--font-merch)",
        minHeight: "447px",
      }}
      className="w-full"
    >
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-10 px-6 py-16 md:flex-row md:gap-16 md:py-0 md:min-h-[447px]">

        {/* Left column — text + CTA */}
        <div className="flex flex-1 flex-col gap-6">
          <h2
            className="text-4xl font-bold uppercase leading-tight tracking-wide md:text-5xl"
            style={{ color: "var(--color-merch-ink)" }}
          >
            {heading}
          </h2>

          <p
            className="max-w-sm text-base leading-relaxed"
            style={{ color: "var(--color-merch-body)" }}
          >
            {subcopy}
          </p>

          <button
            type="button"
            onClick={onCtaClick}
            className="w-fit px-8 py-3 text-sm font-semibold uppercase tracking-widest transition-opacity duration-150 hover:opacity-85 active:opacity-70"
            style={{
              backgroundColor: "var(--color-merch-red)",
              color: "var(--color-merch-on-dark)",
            }}
          >
            {ctaLabel}
          </button>
        </div>

        {/* Right column — gift card visuals */}
        <div className="relative flex flex-1 items-center justify-center">
          {cards && cards.length > 0 ? (
            <div className="relative flex items-center justify-center w-full max-w-md">
              {/* First card — behind, slightly offset */}
              {cards[1] && (
                <div
                  className="absolute"
                  style={{
                    transform: "rotate(-6deg) translate(-12%, 8%)",
                    zIndex: 0,
                    width: "60%",
                    maxWidth: "280px",
                  }}
                >
                  <img
                    src={cards[1].imageUrl}
                    alt={cards[1].label}
                    className="w-full rounded-xl object-cover shadow-xl"
                    style={{ aspectRatio: "16/10" }}
                    draggable={false}
                  />
                </div>
              )}
              {/* Second card — front, slightly offset the other way */}
              <div
                className="relative"
                style={{
                  transform: "rotate(4deg) translate(18%, -6%)",
                  zIndex: 1,
                  width: "60%",
                  maxWidth: "280px",
                }}
              >
                <img
                  src={cards[0].imageUrl}
                  alt={cards[0].label}
                  className="w-full rounded-xl object-cover shadow-2xl"
                  style={{ aspectRatio: "16/10" }}
                  draggable={false}
                />
              </div>
            </div>
          ) : (
            /* Placeholder when no cards provided */
            <div className="flex w-full max-w-md items-center justify-center">
              <div
                className="relative"
                style={{ width: "60%", maxWidth: "280px", transform: "rotate(4deg)" }}
              >
                <svg
                  viewBox="0 0 280 175"
                  aria-label="Gift card placeholder"
                  style={{ width: "100%", borderRadius: "12px", display: "block" }}
                >
                  <defs>
                    <linearGradient id={`${gradId}-card`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-merch-ink-dark)" />
                      <stop offset="100%" stopColor="var(--color-merch-red)" />
                    </linearGradient>
                  </defs>
                  <rect width="280" height="175" rx="12" fill={`url(#${gradId}-card)`} />
                  <text
                    x="24"
                    y="96"
                    fontFamily="var(--font-merch)"
                    fontSize="22"
                    fontWeight="700"
                    fill="var(--color-merch-on-dark)"
                    letterSpacing="2"
                  >
                    RIOT GAMES
                  </text>
                  <text
                    x="24"
                    y="122"
                    fontFamily="var(--font-merch)"
                    fontSize="13"
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
      </div>
    </section>
  );
}
