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
 * Two rendering modes:
 *
 * darkSurface=false (default — standalone section with banner):
 *   Measured from merch.riotgames.com/en-us/product/<handle>/ at 1280px desktop
 *   prior to issue #859. Rendered on a light surface with a banner above.
 *   - Section:        full-width, pb 48px
 *   - Banner area:    320px tall, full-width, background-image cover
 *   - Banner logo:    ~200px wide, left-aligned with ~40px left inset
 *   - Banner CTA:     "Shop Now" — primary red button, right of logo ~24px gap
 *   - Franchise label: VERTICAL rotated uppercase wordmark on left edge of card row
 *   - Card track:     343px × 375px cards, 3 per view at 1280px, CSS scroll-snap
 *   - Pagination dots: --color-merch-dot-active-light / --color-merch-dot-inactive-light
 *
 * darkSurface=true (PDP related-products band — issue #859):
 *   Cards sit ON the blue franchise band (no separate banner — the band is rendered by
 *   MerchCollectionHero above). Cards have:
 *   - Transparent card bg (dark band shows through)
 *   - White title text (--color-merch-on-dark)
 *   - "LEAGUE OF LEGENDS" label top-left per card (small uppercase, white/muted-on-dark)
 *   - Heart icon top-right per card (white, --color-merch-heart-on-dark)
 *   - Optional teal "Special Edition" badge (--color-merch-badge-special)
 *   - Card image: 353×225px landscape, object-cover
 *   - Price: white, 14px/400
 *   - Red full-width "Add to Cart" 313×50 under price (--color-merch-red, always visible)
 *   - Pagination dots: white (--color-merch-dot-inactive / --color-merch-on-dark)
 *   - No banner, no rotated wordmark, no separate banner CTA
 */

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { MerchProduct } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchShopCarouselProps {
  /** Franchise name shown as the rotated vertical label on the left edge (light mode). */
  franchiseName: string;
  /**
   * Banner background image URL (supplied by page — 1680×400 WebP).
   * Only rendered in light (darkSurface=false) mode.
   */
  bannerImageUrl: string;
  /**
   * Franchise logo image URL shown in the banner (supplied by page).
   * Only rendered in light (darkSurface=false) mode.
   */
  franchiseLogoUrl?: string;
  /** Product cards to render in the scroll track. */
  products: MerchProduct[];
  /** Called when a product card is clicked; passes the product slug. */
  onProductClick?: (slug: string) => void;
  /** Called when the "Shop Now" CTA is clicked. */
  onShopNowClick?: () => void;
  /**
   * When true, renders in dark-surface mode for the PDP franchise band:
   * cards have transparent bg, white text, "LEAGUE OF LEGENDS" top-left,
   * heart top-right, optional teal badge, red 313×50 ATC. No banner.
   * @default false
   */
  darkSurface?: boolean;
}

// ---------------------------------------------------------------------------
// Constants (measured from merch.riotgames.com)
// ---------------------------------------------------------------------------

/**
 * Card width in px — light mode: 305px per issue #895 measurement.
 * Real: "cards ARTICLE 305×375" from merch.riotgames.com related strip.
 */
const CARD_W_LIGHT = 305;

/**
 * Card width in px — dark-surface mode.
 * Real: "353×225" per issue #859 measurement.
 */
const CARD_W_DARK = 353;

/** Card gap between cards in the scroll track (px). */
const CARD_GAP = 20;

/** Cards visible per page — 3-up as measured on the real site at 1280px. */
const CARDS_PER_PAGE = 3;

// ---------------------------------------------------------------------------
// Heart SVG (white outline for dark-surface cards)
// ---------------------------------------------------------------------------

function HeartIcon({ color }: { color: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, display: "block" }}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// DarkSurfaceCard — card rendered on the PDP blue franchise band
// ---------------------------------------------------------------------------

interface DarkSurfaceCardProps {
  product: MerchProduct;
  cardWidth: number;
  onProductClick?: (slug: string) => void;
  onAddToCart?: (slug: string) => void;
  onWishlist?: (slug: string) => void;
}

function DarkSurfaceCard({
  product,
  cardWidth,
  onProductClick,
  onAddToCart,
  onWishlist,
}: DarkSurfaceCardProps) {
  // Determine if "Special Edition" badge applies
  const isSpecialEdition =
    product.badge?.toLowerCase() === "special edition" ||
    product.badges?.some((b) => b.toLowerCase() === "special edition");

  return (
    <a
      href={`/merch/product/${product.slug}`}
      role="article"
      style={{
        display: "flex",
        flexDirection: "column",
        width: cardWidth,
        flexShrink: 0,
        textDecoration: "none",
        color: "inherit",
        /* Transparent bg — dark band shows through */
        backgroundColor: "transparent",
        /* Subtle white border so cards read as distinct cells */
        border: "1px solid var(--color-merch-card-border-on-dark)",
        fontFamily: "var(--font-merch)",
        cursor: "pointer",
      }}
      onClick={(e) => {
        onProductClick?.(product.slug);
        if (onProductClick) e.preventDefault();
      }}
    >
      {/* ── Header row: "LEAGUE OF LEGENDS" label top-left + heart top-right ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 12px 8px",
          minHeight: 40,
        }}
      >
        {/* Franchise label — small uppercase, muted white */}
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-merch-muted-on-dark)",
            lineHeight: 1,
          }}
        >
          LEAGUE OF LEGENDS
        </span>

        {/* Optional teal "Special Edition" badge */}
        {isSpecialEdition && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              backgroundColor: "var(--color-merch-badge-special)",
              color: "var(--color-merch-ink-dark)",
              padding: "3px 6px",
              borderRadius: 2,
              marginRight: 6,
              whiteSpace: "nowrap",
            }}
          >
            Special Edition
          </span>
        )}

        {/* Heart / wishlist icon — white on dark */}
        <button
          type="button"
          aria-label={`Add ${product.title} to wishlist`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWishlist?.(product.slug);
          }}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.7,
            flexShrink: 0,
          }}
        >
          <HeartIcon color="var(--color-merch-heart-on-dark)" />
        </button>
      </div>

      {/* ── Product image — 353×225 landscape, object-cover ── */}
      <div
        style={{
          width: "100%",
          height: 225,
          overflow: "hidden",
          flexShrink: 0,
          backgroundColor: "var(--color-merch-card-img-scrim)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
          }}
          draggable={false}
        />
      </div>

      {/* ── Info strip: title + price ── */}
      <div
        style={{
          padding: "12px 12px 8px",
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Title — white, 14px/600 riotSans */}
        <span
          style={{
            fontFamily: "var(--font-merch-display)",
            fontSize: 14,
            fontWeight: 600,
            lineHeight: "18px",
            color: "var(--color-merch-on-dark)",
            display: "block",
          }}
        >
          {product.title}
        </span>

        {/* Price — white muted, 14px/400 */}
        <span
          style={{
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "20px",
            color: "var(--color-merch-body-on-dark)",
          }}
        >
          {product.originalPrice && product.originalPrice !== product.price ? (
            <>
              <span
                style={{
                  textDecoration: "line-through",
                  color: "var(--color-merch-muted-on-dark)",
                  marginRight: 4,
                }}
              >
                {product.originalPrice}
              </span>
              {product.price}
            </>
          ) : (
            product.price
          )}
        </span>
      </div>

      {/* ── Red full-width Add to Cart — 313×50 (real measurement) ── */}
      {/* Real: red (#eb0029) fill, white text, 16px/600 uppercase riotSans, always visible */}
      <div style={{ padding: "0 12px 12px" }}>
        <button
          type="button"
          aria-label={`Add ${product.title} to cart`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart?.(product.slug);
          }}
          style={{
            width: "100%",
            height: 50,
            backgroundColor: "var(--color-merch-red)",
            color: "var(--color-merch-on-dark)",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-merch-display)",
            fontSize: 14,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Add to Cart
        </button>
      </div>
    </a>
  );
}

// ---------------------------------------------------------------------------
// CarouselArrow — prev/next nav button (shared)
// ---------------------------------------------------------------------------

function CarouselArrow({
  direction,
  ariaLabel,
  onClick,
  clipId,
  cardH,
  darkSurface,
}: {
  direction: "prev" | "next";
  ariaLabel: string;
  onClick: () => void;
  clipId: string;
  cardH: number;
  darkSurface: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className="absolute top-0 flex cursor-pointer items-center justify-center border-0 transition-opacity duration-150 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
      style={{
        height: cardH,
        width: 40,
        [direction === "prev" ? "left" : "right"]: 0,
        backgroundColor: darkSurface
          ? "var(--color-merch-carousel-arrow-dark)"
          : "var(--color-merch-overlay-soft)",
        color: "var(--color-merch-on-dark)",
        borderRadius: 0,
        zIndex: 2,
        outlineColor: "var(--color-merch-red)",
      }}
    >
      {/* Hidden SVG clip — useId exercised per button */}
      <svg width="0" height="0" aria-hidden className="absolute">
        <defs>
          <clipPath id={clipId}>
            <rect width="40" height={cardH} />
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
 * Light mode (darkSurface=false, default):
 *   1. 320px banner (bg image + optional logo + red "Shop Now" CTA)
 *   2. Rotated vertical franchise wordmark on LEFT edge + 3-up scroll-snap
 *      card track (343×375px each, gap 20px) with prev/next arrows
 *   3. Pagination dots — dark on light bg
 *
 * Dark-surface mode (darkSurface=true, PDP related-products band):
 *   No banner (the blue band is rendered by MerchCollectionHero above).
 *   Card track: 353×(header+225+info+ATC)px, transparent bg, white text,
 *   "LEAGUE OF LEGENDS" label + heart per card, teal Special Edition badge,
 *   red 313×50 per-card ATC. Pagination dots — white on dark.
 */
export function MerchShopCarousel({
  franchiseName,
  bannerImageUrl,
  franchiseLogoUrl,
  products,
  onProductClick,
  onShopNowClick,
  darkSurface = false,
}: MerchShopCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const prevClipId = `${uid}-prev-clip`;
  const nextClipId = `${uid}-next-clip`;

  const CARD_W = darkSurface ? CARD_W_DARK : CARD_W_LIGHT;
  // Light-surface card: 305×375 per issue #895 measurement.
  // Dark-surface card total height: header(40) + image(225) + info(~60) + ATC(62) ≈ 387px
  const CARD_H = darkSurface ? 387 : 375;

  // ---------------------------------------------------------------------------
  // Pagination state — track which "page" (group of CARDS_PER_PAGE) is active
  // ---------------------------------------------------------------------------
  const totalPages = Math.max(1, Math.ceil(products.length / CARDS_PER_PAGE));
  const [activePage, setActivePage] = useState(0);

  const scrollBy = useCallback(
    (dir: "prev" | "next") => {
      const track = trackRef.current;
      if (!track) return;
      const delta = (CARD_W + CARD_GAP) * CARDS_PER_PAGE * (dir === "prev" ? -1 : 1);
      track.scrollBy({ left: delta, behavior: "smooth" });
    },
    [CARD_W],
  );

  const scrollToPage = useCallback(
    (page: number) => {
      const track = trackRef.current;
      if (!track) return;
      const left = page * CARDS_PER_PAGE * (CARD_W + CARD_GAP);
      track.scrollTo({ left, behavior: "smooth" });
    },
    [CARD_W],
  );

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
  }, [totalPages, CARD_W]);

  return (
    <section
      aria-label={`${franchiseName} related products`}
      style={{
        width: "100%",
        paddingBottom: darkSurface ? 40 : 48,
        fontFamily: "var(--font-merch)",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Mobile overrides — real @media queries per constraint rules */}
      {!darkSurface && (
        <style>{`
          @media (max-width: 600px) {
            .merch-carousel-light-track {
              padding-inline: 12px !important;
            }
            .merch-carousel-light-banner {
              height: 200px !important;
            }
            .merch-carousel-light-banner-content {
              padding-inline: 16px !important;
              gap: 12px !important;
            }
          }
        `}</style>
      )}
      {/* ── Light mode only: franchise banner — 1280×320, black bg, blue splash art ─ */}
      {/*
       * Issue #895 franchise band (1280×320 at y=1520, real site):
       *   - Black bg with blue splash art behind
       *   - LEAGUE OF LEGENDS logo IMAGE left-aligned (~x=40 inset)
       *   - Shop Now = WHITE button, black riotSans 16/600 label, ls 0.32px,
       *     LEFT-aligned under the logo (span x=250)
       *   NOT the red CTA that was here before.
       */}
      {!darkSurface && (
        <div
          className="merch-carousel-light-banner"
          style={{
            width: "100%",
            height: 320,
            position: "relative",
            overflow: "hidden",
            backgroundColor: "var(--color-merch-ink-dark)",
          }}
        >
          {/* Background image (blue splash art from page) */}
          {bannerImageUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={bannerImageUrl}
              alt={`${franchiseName} collection banner`}
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
              draggable={false}
            />
          )}

          {/* Subtle left-edge scrim so logo reads over the art */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--color-merch-scrim-strong) 0%, transparent 55%)",
            }}
            aria-hidden
          />

          {/* Banner content — logo left-aligned, Shop Now below it */}
          <div
            className="merch-carousel-light-banner-content"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingInline: 40,
              gap: 20,
            }}
          >
            {/* Franchise logo — left-aligned, ~200px wide */}
            {franchiseLogoUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={franchiseLogoUrl}
                alt={`${franchiseName} logo`}
                style={{
                  width: 200,
                  objectFit: "contain",
                  objectPosition: "left center",
                  flexShrink: 0,
                  display: "block",
                }}
                loading="lazy"
                draggable={false}
              />
            )}

            {/* White "Shop Now" button — real: white bg, black riotSans 16/600, ls 0.32px, left-aligned */}
            <button
              type="button"
              onClick={onShopNowClick}
              style={{
                alignSelf: "flex-start",
                backgroundColor: "var(--color-merch-on-dark)",
                color: "var(--color-merch-ink-dark)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-merch-display)",
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "0.32px",
                padding: "12px 28px",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "0.88";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.opacity = "1";
              }}
            >
              Shop Now
            </button>
          </div>
        </div>
      )}

      {/* ── Card row ─────────────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "stretch",
          marginTop: darkSurface ? 0 : 24,
          paddingTop: darkSurface ? 32 : 0,
        }}
      >
        {/* Rotated franchise wordmark — light mode only */}
        {!darkSurface && (
          <div
            aria-hidden
            style={{
              width: 40,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
                position: "absolute",
              }}
            >
              {franchiseName}
            </span>
          </div>
        )}

        {/* Card track + arrows */}
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
            cardH={CARD_H}
            darkSurface={darkSurface}
          />

          {/* Scrollable card track */}
          <div
            ref={trackRef}
            className={darkSurface ? undefined : "merch-carousel-light-track"}
            style={{
              display: "flex",
              gap: CARD_GAP,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              height: CARD_H,
              paddingInline: darkSurface ? 24 : 40,
              boxSizing: "border-box",
            }}
          >
            {products.map((product) =>
              darkSurface ? (
                <div
                  key={product.slug}
                  style={{
                    flex: `0 0 ${CARD_W}px`,
                    width: CARD_W,
                    scrollSnapAlign: "start",
                  }}
                >
                  <DarkSurfaceCard
                    product={product}
                    cardWidth={CARD_W}
                    onProductClick={onProductClick}
                  />
                </div>
              ) : (
                /* Light mode: lazy import avoided — inline card rendering */
                <LightCard
                  key={product.slug}
                  product={product}
                  cardW={CARD_W}
                  cardH={CARD_H}
                  onProductClick={onProductClick}
                  onAddToCart={() => {}}
                />
              ),
            )}
          </div>

          {/* Next arrow */}
          <CarouselArrow
            direction="next"
            ariaLabel="Next products"
            onClick={() => scrollBy("next")}
            clipId={nextClipId}
            cardH={CARD_H}
            darkSurface={darkSurface}
          />
        </div>
      </div>

      {/* ── Pagination dots ───────────────────────────────────────────────── */}
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
                backgroundColor: darkSurface
                  ? i === activePage
                    ? "var(--color-merch-on-dark)"
                    : "var(--color-merch-dot-inactive)"
                  : i === activePage
                  ? "var(--color-merch-dot-active-light)"
                  : "var(--color-merch-dot-inactive-light)",
              }}
              onMouseEnter={(e) => {
                if (i !== activePage) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    darkSurface
                      ? "var(--color-merch-dot-inactive-hover)"
                      : "var(--color-merch-dot-inactive-light-hover)";
                }
              }}
              onMouseLeave={(e) => {
                if (i !== activePage) {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    darkSurface
                      ? "var(--color-merch-dot-inactive)"
                      : "var(--color-merch-dot-inactive-light)";
                }
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// CartIcon — icon-only cart button (light-surface cards)
// ---------------------------------------------------------------------------

function CartIcon() {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 18, height: 18, display: "block" }}
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// LightCard — inline card for light-surface mode (avoids circular import)
// ---------------------------------------------------------------------------

/**
 * Light-surface card — issue #895 spec:
 *   - ARTICLE 305×375, bg rgb(247,247,247) = --color-merch-surface-alt, 1px white border
 *   - Name: riotSans 16/700, rgb(0,0,0) = --color-merch-ink-dark
 *   - Price: Inter 16, --color-merch-ink-dark
 *   - Icon-only cart button (no full-width ATC)
 */
function LightCard({
  product,
  cardW,
  cardH,
  onProductClick,
  onAddToCart,
}: {
  product: MerchProduct;
  cardW: number;
  cardH: number;
  onProductClick?: (slug: string) => void;
  onAddToCart?: (slug: string) => void;
}) {
  return (
    <a
      href={`/merch/product/${product.slug}`}
      role="article"
      style={{
        flex: `0 0 ${cardW}px`,
        width: cardW,
        height: cardH,
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        color: "inherit",
        /* issue #895: 1px white border, surface-alt bg */
        border: "1px solid var(--color-merch-on-dark)",
        backgroundColor: "var(--color-merch-surface-alt)",
        fontFamily: "var(--font-merch)",
        cursor: "pointer",
        overflow: "hidden",
        flexShrink: 0,
      }}
      onClick={(e) => {
        onProductClick?.(product.slug);
        if (onProductClick) e.preventDefault();
      }}
    >
      {/* Product image — fills upper portion, object-cover */}
      <div
        style={{
          width: "100%",
          flex: "1 1 auto",
          overflow: "hidden",
          backgroundColor: "var(--color-merch-surface-alt)",
          minHeight: 0,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
          }}
          draggable={false}
        />
      </div>

      {/* Info + icon-only cart button */}
      <div
        style={{
          padding: "12px 12px 12px",
          flexShrink: 0,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ minWidth: 0 }}>
          {/* Title: riotSans 16/700, black */}
          <div
            style={{
              fontFamily: "var(--font-merch-display)",
              fontSize: 16,
              fontWeight: 700,
              lineHeight: "1.2",
              color: "var(--color-merch-ink-dark)",
              marginBottom: 4,
              /* clamp to 2 lines */
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.title}
          </div>

          {/* Price: Inter 16 */}
          <div
            style={{
              fontFamily: "var(--font-merch)",
              fontSize: 16,
              fontWeight: 400,
              lineHeight: "1.25",
              color: "var(--color-merch-ink-dark)",
            }}
          >
            {product.originalPrice && product.originalPrice !== product.price ? (
              <>
                <span
                  style={{
                    textDecoration: "line-through",
                    color: "var(--color-merch-muted)",
                    marginRight: 6,
                    fontSize: 14,
                  }}
                >
                  {product.originalPrice}
                </span>
                {product.price}
              </>
            ) : (
              product.price
            )}
          </div>
        </div>

        {/* Icon-only cart button — real: small icon, no label */}
        <button
          type="button"
          aria-label={`Add ${product.title} to cart`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart?.(product.slug);
          }}
          style={{
            flexShrink: 0,
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--color-merch-ink-dark)",
            color: "var(--color-merch-on-dark)",
            border: "none",
            cursor: "pointer",
            borderRadius: 0,
          }}
        >
          <CartIcon />
        </button>
      </div>
    </a>
  );
}
