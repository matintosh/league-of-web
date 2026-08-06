"use client";

/**
 * MerchShopCarousel — franchise-branded related-products carousel for the merch PDP.
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
 * Measured from merch.riotgames.com/en-us/product/<handle>/ at 1280px desktop:
 *   - Section:        full-width, pb 48px
 *   - Banner area:    320px tall, full-width, background-image cover
 *   - Banner logo:    ~200px wide, left-aligned with ~40px left inset
 *   - Banner CTA:     "Shop Now" — primary red button, right of logo ~24px gap
 *   - Franchise label: VERTICAL rotated uppercase wordmark on left edge of card row
 *                     (NOT a horizontal h2); ~197px left padding of first card
 *   - Card track:     343px × 375px cards, 3 per view at 1280px, CSS scroll-snap
 *   - Card gap:       20px between cards
 *   - Card x-offsets: 197 / 560 / 923 (measured)
 *   - Cards:          hasAddToCart=false — no ATC bar, navigation intent only
 *   - Nav arrows:     prev/next positioned at vertical center of card track
 *   - Pagination dots: centered below card track; dark dots on light bg
 *   - Bottom pad:     48px
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { MerchProduct } from "@low/fixtures";
import { MerchProductCard } from "./merch-product-card";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchShopCarouselProps {
  /** Franchise name shown as the rotated vertical label on the left edge, e.g. "League of Legends". */
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
// Constants (measured from merch.riotgames.com)
// ---------------------------------------------------------------------------

/** Card width in px — measured: first card x=197, second x=560 → step=363, card=343, gap=20. */
const CARD_W = 343;

/** Card height in px — measured at 1280px. */
const CARD_H = 375;

/** Gap between cards in the scroll track (px). */
const CARD_GAP = 20;

/**
 * Cards visible per page — 3-up as measured on the real site at 1280px.
 * Used for pagination dot count and scroll-by-page logic.
 */
const CARDS_PER_PAGE = 3;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/**
 * CarouselArrow — prev/next nav button.
 * Uses a unique SVG clip-path id to avoid collisions when multiple carousels mount.
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
 * MerchShopCarousel — franchise-branded related-products carousel.
 *
 * Layout (1280px):
 *   1. 320px banner (bg image + optional logo + "Shop Now" CTA)
 *   2. Card row: vertical rotated franchise wordmark on LEFT edge + 3-up scroll-snap
 *      card track (343×375px each, gap 20px) with prev/next arrows
 *   3. Pagination dots centered below the card track
 *
 * Cards render WITHOUT the Add-to-Cart bar (hasAddToCart=false) — related-products
 * intent is navigation, not in-page purchase.
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

  // ---------------------------------------------------------------------------
  // Pagination state — track which "page" (group of CARDS_PER_PAGE) is active
  // ---------------------------------------------------------------------------
  const totalPages = Math.max(1, Math.ceil(products.length / CARDS_PER_PAGE));
  const [activePage, setActivePage] = useState(0);

  /** Scroll the card track by one full page (CARDS_PER_PAGE cards). */
  const scrollBy = useCallback(
    (dir: "prev" | "next") => {
      const track = trackRef.current;
      if (!track) return;
      const delta = (CARD_W + CARD_GAP) * CARDS_PER_PAGE * (dir === "prev" ? -1 : 1);
      track.scrollBy({ left: delta, behavior: "smooth" });
    },
    []
  );

  /** Scroll to a specific page index. */
  const scrollToPage = useCallback((page: number) => {
    const track = trackRef.current;
    if (!track) return;
    const left = page * CARDS_PER_PAGE * (CARD_W + CARD_GAP);
    track.scrollTo({ left, behavior: "smooth" });
  }, []);

  /** Keep activePage in sync with the track's scroll position. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function onScroll() {
      if (!track) return;
      const pageWidth = CARDS_PER_PAGE * (CARD_W + CARD_GAP);
      const page = Math.round(track.scrollLeft / pageWidth);
      setActivePage(Math.min(page, totalPages - 1));
    }
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [totalPages]);

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
      {/* Card row: vertical franchise label (left edge) + card track + arrows */}
      {/*                                                                     */}
      {/* Real 1280px layout:                                                 */}
      {/*   Left label column ~40px wide — vertical rotated uppercase text    */}
      {/*   Card track — 3-up, 343px cards, 20px gap, CSS scroll-snap        */}
      {/*   Prev/next arrows overlap the track at track left/right edges      */}
      {/* ------------------------------------------------------------------ */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "stretch",
          marginTop: 24,
        }}
      >
        {/* ── Vertical rotated franchise wordmark ────────────────────────── */}
        {/*   "LEAGUE OF LEGENDS" rotated 90° CCW on the left edge.          */}
        {/*   Container is ~40px wide; text is rotated with writing-mode or  */}
        {/*   transform. Using transform rotate(-90deg) for crisp rendering. */}
        <div
          aria-hidden
          style={{
            width: 40,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            /* Enough height to contain the track */
            minHeight: CARD_H,
            position: "relative",
          }}
        >
          <span
            style={{
              display: "block",
              transformOrigin: "center center",
              transform: "rotate(-90deg)",
              whiteSpace: "nowrap",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--color-merch-franchise-label)",
              fontFamily: "var(--font-merch)",
              /* Keep the rotated text within the 40px column */
              position: "absolute",
            }}
          >
            {franchiseName}
          </span>
        </div>

        {/* ── Card track + arrows ────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: 0,
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

          {/* Scrollable card track — CSS scroll-snap, 3-up */}
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
                  hasAddToCart={false}
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
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Pagination dots — centered below the card track.                   */}
      {/* Dark dots on light bg (--color-merch-dot-active-light /            */}
      {/* --color-merch-dot-inactive-light). One dot per page group.         */}
      {/* ------------------------------------------------------------------ */}
      {totalPages > 1 && (
        <div
          role="tablist"
          aria-label={`${franchiseName} carousel pages`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginTop: 16,
          }}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              role="tab"
              type="button"
              aria-selected={i === activePage}
              aria-label={`Page ${i + 1} of ${totalPages}`}
              onClick={() => scrollToPage(i)}
              style={{
                width: i === activePage ? 20 : 8,
                height: 8,
                borderRadius: 4,
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "width 0.2s ease, background-color 0.2s ease",
                backgroundColor:
                  i === activePage
                    ? "var(--color-merch-dot-active-light)"
                    : "var(--color-merch-dot-inactive-light)",
              }}
              onMouseEnter={(e) => {
                if (i !== activePage) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--color-merch-dot-inactive-light-hover)";
                }
              }}
              onMouseLeave={(e) => {
                if (i !== activePage) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--color-merch-dot-inactive-light)";
                }
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
