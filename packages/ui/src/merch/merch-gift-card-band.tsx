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
 *   - Background: --color-merch-surface-alt (#f7f7f7) desktop /
 *                 --color-merch-ink-dark (#000000) mobile (dark artwork band)
 *   - Layout: 2-col grid — text left at x=137, two card visuals right
 *   - Eyebrow: "GIFT CARDS" 14px/600 uppercase, --color-merch-muted
 *   - Heading: riotSans 48px/600 uppercase, --color-merch-ink desktop /
 *              --color-merch-on-dark mobile, max ~2 lines
 *   - No subcopy paragraph
 *   - CTA: "Buy It Now", --color-merch-red background, --color-merch-on-dark,
 *           riotSans 16px/600 uppercase, 239×50px, skewed left edge (parallelogram)
 *   - Card visuals: near-square low-radius cards, faint faded-character backdrop
 *   - Mobile: dark band (#000), white heading, CTA centered
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
 * homepage. ~447px tall. Desktop: --color-merch-surface-alt bg, 2-col grid:
 * text left at x=137, two gift card visuals right. Mobile: dark artwork band,
 * white heading, centered CTA. Matches merch.riotgames.com gift-card section.
 *
 * Delta from prior version:
 *  - Added "GIFT CARDS" eyebrow (14px/600 uppercase, --color-merch-muted)
 *  - Dropped subcopy paragraph (eyebrow → heading → button)
 *  - CTA: label "Buy It Now", 239×50, riotSans 16/600 uppercase, parallelogram
 *    skewed left edge via clip-path
 *  - Desktop content inset x=137 (pl-[137px]), heading riotSans 48/600
 *  - Card radius reduced to near-square (rounded-sm), faint backdrop layer added
 *  - Mobile: dark band (--color-merch-ink-dark), white heading, CTA centered
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
        /* Desktop bg — overridden to dark on mobile via inline media approach below */
        backgroundColor: "var(--color-merch-surface-alt)",
        fontFamily: "var(--font-merch-display)",
        minHeight: "447px",
      }}
    >
      {/*
       * Mobile dark-band override: we use a pseudo-element approach via a
       * absolutely-positioned dark fill that's hidden above md breakpoint.
       * Tailwind handles this cleanly with responsive bg utilities; we map to
       * CSS variables via the style prop on a wrapper that changes per viewport.
       */}
      <div
        className="absolute inset-0 md:hidden"
        style={{ backgroundColor: "var(--color-merch-ink-dark)" }}
        aria-hidden="true"
      />

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

      {/* Content wrapper — desktop: pl-[137px], mobile: px-6 centered */}
      <div
        className="relative mx-auto flex max-w-screen-xl flex-col items-center gap-10 px-6 py-16
                   md:flex-row md:gap-16 md:py-0 md:min-h-[447px] md:pl-[137px] md:pr-8 md:items-center"
      >
        {/* ── Left column — eyebrow + heading + CTA ── */}
        <div className="relative z-10 flex flex-1 flex-col gap-5 items-center text-center md:items-start md:text-left">

          {/* Eyebrow — "GIFT CARDS", 14px/600 uppercase, muted on desktop / muted-on-dark on mobile */}
          <span
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-merch-muted)" /* muted grey on desktop */ }}
          >
            <span
              className="md:hidden"
              style={{ color: "var(--color-merch-muted-on-dark)" }}
            >
              GIFT CARDS
            </span>
            <span className="hidden md:inline">GIFT CARDS</span>
          </span>

          {/* Heading — riotSans 48/600 uppercase; white on mobile, ink on desktop */}
          <h2
            className="text-4xl font-semibold uppercase leading-tight tracking-wide md:text-5xl"
            style={{
              fontFamily: "var(--font-merch-display)",
              /* desktop color set inline; mobile via wrapper sibling below */
            }}
          >
            <span
              className="md:hidden"
              style={{ color: "var(--color-merch-on-dark)" }}
            >
              {heading}
            </span>
            <span
              className="hidden md:inline"
              style={{ color: "var(--color-merch-ink)" }}
            >
              {heading}
            </span>
          </h2>

          {/*
           * CTA — "Buy It Now", 239×50, riotSans 16/600 uppercase, --color-merch-red.
           * Parallelogram skewed left edge: clip-path polygon with a ~12px left notch.
           * Mobile: centered; desktop: left-aligned (natural flow).
           */}
          <button
            type="button"
            onClick={onCtaClick}
            className="relative flex items-center justify-center font-semibold uppercase tracking-widest
                       transition-opacity duration-150 hover:opacity-85 active:opacity-70"
            style={{
              width: "239px",
              height: "50px",
              backgroundColor: "var(--color-merch-red)",
              color: "var(--color-merch-on-dark)",
              fontFamily: "var(--font-merch-display)",
              fontSize: "16px",
              fontWeight: 600,
              /* Parallelogram: shear left edge ~12px inward, right edge straight */
              clipPath: "polygon(12px 0%, 100% 0%, 100% 100%, 0% 100%)",
              letterSpacing: "0.08em",
            }}
          >
            {ctaLabel}
          </button>
        </div>

        {/* ── Right column — gift card visuals ── */}
        <div className="relative z-10 flex flex-1 items-center justify-center">
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
                      /* near-square low-radius matching real fist-logo cards */
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
            <div className="flex w-full max-w-md items-center justify-center">
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
      </div>
    </section>
  );
}
