"use client";

/**
 * MerchShopCarousel — franchise-branded product carousel for the merch PDP.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens
 * (add a token to @low/tokens if one is missing, sampled from the real store)
 * and a modern e-commerce layout. This is NOT the Hextech client — IGNORE the
 * client Hextech-only / no-default-Tailwind-palette guidance; still tokens-only
 * (no raw hex outside packages/tokens; NO hex fallbacks in var(); NO bare hex
 * like #ffffff — use --color-merch-on-dark), presentational (props in/callbacks
 * out, NO fetching in @low/ui, types from @low/fixtures), showcase server-safe
 * (no 'use client'; stateful demos in *.demo.tsx), SVG ids from useId.
 *
 * Measured from merch.riotgames.com/en-us/product/league-classic-collectors-box/
 * at 1280px desktop:
 *   - Section:      full-width, padding-bottom: 48px
 *   - Banner area:  320px tall, full-width, background-image cover
 *   - Banner logo:  ~200px wide, left-aligned with ~40px left inset
 *   - Banner CTA:   "Shop Now" — primary red button, right of logo ~24px gap
 *   - Label h2:     16px / 700 / --color-merch-ink, left-aligned, ~24px padding
 *   - Card track:   355px × 375px cards, ~3+ visible at 1280px, CSS scroll-snap
 *   - Nav arrows:   prev/next positioned at vertical center of card track
 *   - Bottom pad:   48px
 */

import { useId, useRef } from "react";
import type { MerchProduct } from "@low/fixtures";
import { MerchProductCard } from "./merch-product-card";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchShopCarouselProps {
  /** Franchise name shown as the h2 label, e.g. "League of Legends". */
  franchiseName: string;
  /** Banner background image URL (supplied by page — 1680×400 WebP). */
  bannerImageUrl: string;
  /** Franchise logo image URL shown in the banner (supplied by page). */
  franchiseLogoUrl?: string;
  /** Product cards to render in the scroll track. */
  products: MerchProduct[];
  /** Called when a product card is clicked; passes the product slug. */
  onProductClick?: (slug: string) => void;
  /** Called when the "Shop Now" CTA is clicked. */
  onShopNowClick?: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Card width in px (measured from merch.riotgames.com). */
const CARD_W = 355;

/** Card height in px. */
const CARD_H = 375;

/** Gap between cards in the scroll track (px). */
const CARD_GAP = 16;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * CarouselArrow — prev/next nav button.
 * Uses a unique SVG id to avoid collisions when multiple carousels mount.
 */
function CarouselArrow({
  direction,
  ariaLabel,
  onClick,
  clipId,
}: {
  direction: "prev" | "next";
  ariaLabel: string;
  onClick: () => void;
  clipId: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="absolute top-0 flex cursor-pointer items-center justify-center border-0 transition-opacity duration-150 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
      style={{
        /* Vertically centered over the card track (CARD_H = 375px) */
        height: CARD_H,
        width: 40,
        [direction === "prev" ? "left" : "right"]: 0,
        backgroundColor: "var(--color-merch-overlay-soft)",
        color: "var(--color-merch-on-dark)",
        borderRadius: 0,
        zIndex: 2,
        outlineColor: "var(--color-merch-red)",
      }}
    >
      {/* Hidden SVG clip — included so useId is exercised for each button */}
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <clipPath id={clipId}>
            <rect width="40" height={CARD_H} />
          </clipPath>
        </defs>
      </svg>

      <svg
        width={10}
        height={16}
        viewBox="0 0 10 16"
        fill="none"
        aria-hidden
        style={{
          transform: direction === "prev" ? "none" : "scaleX(-1)",
        }}
      >
        <path
          d="M8 2L2 8l6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchShopCarousel — franchise-branded product carousel.
 * Composes a 320px banner area (bg image + optional logo + "Shop Now" CTA),
 * a franchise h2 label, and a CSS scroll-snap card track of MerchProductCards
 * (355×375px each, ~3+ visible at 1280px) with prev/next arrow controls.
 *
 * Place below the gallery+panel row on /merch/product/[handle] pages.
 */
export function MerchShopCarousel({
  franchiseName,
  bannerImageUrl,
  franchiseLogoUrl,
  products,
  onProductClick,
  onShopNowClick,
}: MerchShopCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const prevClipId = `${uid}-prev-clip`;
  const nextClipId = `${uid}-next-clip`;

  /** Scroll the card track by approximately one card width. */
  function scrollBy(dir: "prev" | "next") {
    const track = trackRef.current;
    if (!track) return;
    const delta = (CARD_W + CARD_GAP) * (dir === "prev" ? -1 : 1);
    track.scrollBy({ left: delta, behavior: "smooth" });
  }

  return (
    <section
      aria-label={`${franchiseName} shop carousel`}
      style={{
        width: "100%",
        paddingBottom: 48,
        fontFamily: "var(--font-merch)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Banner area — 320px tall, full-width, bg-image cover               */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          width: "100%",
          height: 320,
          position: "relative",
          overflow: "hidden",
          backgroundColor: "var(--color-merch-surface)",
        }}
      >
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerImageUrl}
          alt={`${franchiseName} collection banner`}
          className="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
          draggable={false}
        />

        {/* Subtle left-to-center scrim so logo + CTA read clearly */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, var(--color-merch-scrim-strong) 0%, var(--color-merch-scrim-soft) 55%, transparent 100%)",
          }}
          aria-hidden
        />

        {/* Banner content — logo + CTA, left-anchored */}
        <div
          className="absolute inset-0 flex items-center"
          style={{ paddingInline: 40 }}
        >
          {/* Franchise logo */}
          {franchiseLogoUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={franchiseLogoUrl}
              alt={`${franchiseName} logo`}
              style={{
                width: 200,
                objectFit: "contain",
                objectPosition: "center left",
                flexShrink: 0,
              }}
              loading="lazy"
              draggable={false}
            />
          )}

          {/* "Shop Now" CTA */}
          <button
            type="button"
            onClick={onShopNowClick}
            className="cursor-pointer border-0 text-[13px] font-bold uppercase tracking-[0.1em] transition-colors duration-150"
            style={{
              marginLeft: franchiseLogoUrl ? 24 : 0,
              backgroundColor: "var(--color-merch-red)",
              color: "var(--color-merch-on-dark)",
              padding: "10px 28px",
              borderRadius: 2,
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
            Shop Now
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Franchise label h2                                                  */}
      {/* ------------------------------------------------------------------ */}
      <h2
        style={{
          fontSize: 16,
          fontWeight: 700,
          color: "var(--color-merch-ink)",
          margin: 0,
          padding: "16px 24px 12px",
        }}
      >
        {franchiseName}
      </h2>

      {/* ------------------------------------------------------------------ */}
      {/* Card track + arrow controls                                          */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          position: "relative",
          height: CARD_H,
        }}
      >
        {/* Prev arrow */}
        <CarouselArrow
          direction="prev"
          ariaLabel="Previous products"
          onClick={() => scrollBy("prev")}
          clipId={prevClipId}
        />

        {/* Scrollable card track — CSS scroll-snap */}
        <div
          ref={trackRef}
          style={{
            display: "flex",
            gap: CARD_GAP,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            height: CARD_H,
            paddingInline: 40,
            boxSizing: "border-box",
          }}
        >
          {products.map((product) => (
            <div
              key={product.slug}
              style={{
                flex: `0 0 ${CARD_W}px`,
                width: CARD_W,
                height: CARD_H,
                scrollSnapAlign: "start",
              }}
            >
              <MerchProductCard
                slug={product.slug}
                title={product.title}
                imageUrl={product.imageUrl}
                price={product.price}
                originalPrice={product.originalPrice}
                badge={product.badge}
                onClick={onProductClick}
              />
            </div>
          ))}
        </div>

        {/* Next arrow */}
        <CarouselArrow
          direction="next"
          ariaLabel="Next products"
          onClick={() => scrollBy("next")}
          clipId={nextClipId}
        />
      </div>
    </section>
  );
}
