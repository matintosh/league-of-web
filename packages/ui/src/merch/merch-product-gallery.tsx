"use client";

/**
 * MerchProductGallery — PDP left column: themed diagonal hero surface +
 * main image + secondary full-bleed 640px carousel below.
 *
 * Measured from merch.riotgames.com (amumu-plush, 1280px + 390px via Playwright):
 *
 *   Desktop (1280px):
 *     Hero zone: 828×800px, two background layers:
 *       1. Light/white textured webp, full 828×800 (bgImageUrl).
 *       2. Dark navy diagonal band across the bottom-left third (fgImageUrl),
 *          clip-path polygon: clear triangle top-right, navy bottom-left.
 *          Both layers continue into the secondary carousel surface.
 *     League of Legends wordmark: absolute, top-left, SOLID BLACK opacity 1.
 *     Product image container: 664×664, positioned at (82, 68) inside hero.
 *     Actual <img>: 616×616 within that container.
 *     Secondary carousel: full-bleed 100vw track, 2-up 640×640 slides at
 *       x=0 and x=644 (measured: x=−594/0 when scrolled), horizontal carousel
 *       with ‹ › chevron overlays, flush under the hero.
 *       Slides sit on the SAME themed surface (light bg + navy band).
 *
 *   Mobile (390px):
 *     Hero zone: 390×573px (product image ~342×573, navy band at bottom).
 *     Product image: 342×573, positioned at x=24, y=0 (fills hero height).
 *     Secondary carousel: same full-bleed 2-up 640×640 tiles below hero.
 *
 * Controlled: pass selectedIndex + onSelect from parent demo/page.
 */
import React, { useId } from "react";
import { LolWordmark } from "./franchise-logos";

export interface MerchProductGalleryProps {
  /** Ordered list of product image URLs. First is shown as the initial hero image. */
  images: string[];
  /** Alt text for the main/hero image (product title). */
  alt: string;
  /** Index of the currently selected image — controlled. Defaults to 0. */
  selectedIndex?: number;
  /** Called when a secondary image tile is clicked — pass the new index. */
  onSelect?: (index: number) => void;
  /**
   * URL for the upper/background layer of the diagonal hero surface.
   * Measured: 828×800 webp textured light surface from Sanity consumer_products dataset.
   * Falls back to --color-merch-surface when omitted.
   */
  bgImageUrl?: string;
  /**
   * URL for the lower/foreground layer of the diagonal hero surface (dark navy band).
   * Measured: clear triangle top-right, dark navy bottom-left third of the hero.
   * Falls back to --color-merch-pdp-hero-navy (solid navy) when omitted.
   * Rendered on both desktop and mobile, continuing into the secondary carousel surface.
   */
  fgImageUrl?: string;
}

/** Known Sanity asset IDs for the PDP hero background layers (consumer_products dataset). */
export const PDP_HERO_BG_ID = "b8551562d7525bee89839714bb667923f7515d6e-2176x1912.webp";
export const PDP_HERO_FG_ID = "2ed0b8698a386ef2ceaf35a679ddf0fa2c93f917-2176x814.webp";

/**
 * MerchProductGallery — themed hero surface + product image + full-bleed 640px detail carousel.
 * Matches the real merch.riotgames.com PDP gallery (verified 2026-08 via Playwright).
 * Place inside the 64.7% left cell of the PDP grid alongside MerchPurchasePanel.
 */
export function MerchProductGallery({
  images,
  alt,
  selectedIndex = 0,
  onSelect,
  bgImageUrl,
  fgImageUrl,
}: MerchProductGalleryProps) {
  const uid = useId();
  const activeIdx = Math.max(0, Math.min(selectedIndex, images.length - 1));
  const hasSecondary = images.length > 1;

  /* ── Carousel navigation ──────────────────────────────────────────────── */
  /* 2-up carousel: each "page" shows 2 images side-by-side at 640x640 each. */
  const carouselImages = images.slice(1);
  const totalCarouselSlides = carouselImages.length;

  /* carouselOffset: index into secondary images array of the LEFT slide in view */
  const carouselOffset = hasSecondary
    ? Math.max(0, Math.min(activeIdx - 1, totalCarouselSlides - 1))
    : 0;

  function advance() {
    if (!hasSecondary || !onSelect) return;
    const next = activeIdx >= images.length - 1 ? 1 : activeIdx + 1;
    onSelect(next);
  }

  function retreat() {
    if (!hasSecondary || !onSelect) return;
    const prev = activeIdx <= 1 ? images.length - 1 : activeIdx - 1;
    onSelect(prev);
  }

  /*
   * Diagonal navy band clip-path.
   * Real site: navy band occupies bottom-left third; diagonal cuts from
   * roughly top-center to bottom-right of the band layer.
   * polygon: top-left → diagonal cut from ~(55%,0%) down to (100%,45%) → bottom-right → bottom-left
   * This clips the fgImage or fallback navy colour into a triangular wedge.
   */
  const diagonalClip = "polygon(0% 0%, 55% 0%, 100% 45%, 100% 100%, 0% 100%)";

  return (
    <div
      className="merch-gallery-root"
      style={{ fontFamily: "var(--font-merch)", width: "100%" }}
    >

      {/* ── Themed hero surface ──────────────────────────────────────────── */}
      {/*
       * Two absolute background layers:
       *   1. Light textured surface (bgImageUrl or --color-merch-surface).
       *   2. Navy diagonal band (fgImageUrl or --color-merch-pdp-hero-navy),
       *      clipped by diagonalClip to the bottom-left triangle.
       * Both layers apply on desktop AND mobile; real site confirms the navy
       * band is present on both viewports.
       */}
      <div
        className="merch-gallery-hero-zone"
        style={{
          position: "relative",
          width: "100%",
          /* Desktop: 800px tall (828×800 measured). Mobile override via <style>. */
          height: 800,
          overflow: "hidden",
        }}
      >
        {/* Layer 1: upper light textured surface */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : undefined,
            backgroundColor: bgImageUrl ? undefined : "var(--color-merch-surface)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Layer 2: dark navy diagonal band — bottom-left triangle */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: fgImageUrl ? `url(${fgImageUrl})` : undefined,
            backgroundColor: fgImageUrl ? undefined : "var(--color-merch-pdp-hero-navy)",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
            clipPath: diagonalClip,
          }}
        />

        {/* League of Legends wordmark — top-left, solid black opacity 1 */}
        {/*
         * Real site: black wordmark at top-left of hero, fully opaque.
         * NOT a watermark (no reduced opacity). NOT a coloured fill.
         */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            color: "var(--color-merch-ink)",
            opacity: 1,
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          <LolWordmark />
        </div>

        {/* ── Main hero product image ────────────────────────────────────── */}
        {/*
         * Desktop: 664×664px container at (82, 68), actual img 616×616.
         * Mobile: 342×573 img at x=24 (hero is 573px tall on mobile).
         * object-fit: contain so art floats naturally on the background.
         */}
        <div
          className="merch-gallery-product-image"
          style={{
            position: "absolute",
            top: 68,
            left: 82,
            width: 664,
            height: 664,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 5,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeIdx]}
            alt={alt}
            loading="eager"
            style={{
              width: 616,
              height: 616,
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* ── Secondary images — full-bleed 2-up 640×640 detail carousel ───── */}
      {/*
       * Real: full-bleed 100vw Swiper track, 640×640 object-fit:cover slides
       * at x=0 and x=644 (4px gap) at y=930, ‹ › chevron overlays,
       * LoL wordmark bottom-left, flush under the hero.
       * The slide surface continues the themed bg (light + navy band).
       *
       * Implementation:
       *   - position:relative wrapper with left:50%; transform:translateX(-50%)
       *     to break out of the 64.7% grid column and stretch 100vw.
       *   - Each slide is 640px wide with 4px gap, 640px tall.
       *   - translateX shift = -carouselOffset * 644px (slide width + gap).
       *
       * IMPORTANT: We use a real @media query (not Tailwind arbitrary breakpoints)
       * to swap to 100% width on mobile where 100vw === container width.
       */}
      {hasSecondary && (
        <div
          className="merch-gallery-carousel-outer"
          style={{
            position: "relative",
            /* Full-bleed: break out of 64.7% column */
            width: "100vw",
            left: "50%",
            transform: "translateX(-50%)",
            marginTop: 0,
            overflow: "hidden",
          }}
        >
          {/* Themed slide surface — mirrors the hero background layers */}
          {/* Layer 1: light background */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : undefined,
              backgroundColor: bgImageUrl ? undefined : "var(--color-merch-surface)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
          {/* Layer 2: navy diagonal band on slide surface */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: fgImageUrl ? `url(${fgImageUrl})` : undefined,
              backgroundColor: fgImageUrl ? undefined : "var(--color-merch-pdp-hero-navy)",
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
              clipPath: diagonalClip,
              zIndex: 0,
            }}
          />

          {/* Slide track */}
          <div
            id={`${uid}-carousel`}
            role="list"
            aria-label="Product detail images"
            style={{
              display: "flex",
              gap: 4,
              transition: "transform 0.3s ease",
              transform: `translateX(calc(-${carouselOffset} * 644px))`,
              position: "relative",
              zIndex: 1,
            }}
          >
            {carouselImages.map((src, idx) => {
              const imgIdx = idx + 1;
              const isActive = imgIdx === activeIdx;
              return (
                <button
                  key={imgIdx}
                  role="listitem"
                  type="button"
                  aria-label={`View image ${imgIdx + 1}`}
                  aria-pressed={isActive}
                  onClick={() => onSelect?.(imgIdx)}
                  style={{
                    padding: 0,
                    border: "none",
                    cursor: onSelect ? "pointer" : "default",
                    flexShrink: 0,
                    /* Real: 640×640 slides measured at x=0 and x=644 */
                    width: 640,
                    height: 640,
                    overflow: "hidden",
                    outline: isActive
                      ? "2px solid var(--color-merch-ink)"
                      : "none",
                    outlineOffset: -2,
                    /* Transparent — slide surface shows through from the outer layers */
                    backgroundColor: "transparent",
                    position: "relative",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Product image ${imgIdx + 1}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* LoL wordmark — bottom-left of carousel, matching real site */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              color: "var(--color-merch-ink)",
              opacity: 0.6,
              pointerEvents: "none",
              zIndex: 10,
            }}
          >
            <LolWordmark />
          </div>

          {/* ‹ Prev chevron overlay */}
          {totalCarouselSlides > 2 && onSelect && carouselOffset > 0 && (
            <button
              type="button"
              aria-label="Previous images"
              onClick={retreat}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "none",
                backgroundColor: "var(--color-merch-bg)",
                color: "var(--color-merch-ink)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                zIndex: 20,
                boxShadow: "0 2px 8px var(--color-merch-overlay-soft)",
              }}
            >
              ‹
            </button>
          )}

          {/* › Next chevron overlay */}
          {totalCarouselSlides > 2 && onSelect && carouselOffset < totalCarouselSlides - 2 && (
            <button
              type="button"
              aria-label="Next images"
              onClick={advance}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: "none",
                backgroundColor: "var(--color-merch-bg)",
                color: "var(--color-merch-ink)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                zIndex: 20,
                boxShadow: "0 2px 8px var(--color-merch-overlay-soft)",
              }}
            >
              ›
            </button>
          )}
        </div>
      )}

      {/* ── Responsive overrides ──────────────────────────────────────────── */}
      {/*
       * Desktop (828px hero) is the default above.
       * Mobile (390px):
       *   hero zone: 573px tall (product image ~342×573, navy band at bottom).
       *   product image: 342×573, positioned at x=24, y=0 (fills hero height).
       *   carousel: width:100% (100vw === container on single-column mobile),
       *     slides remain 640px but viewport clips at 390px — no horizontal overflow.
       *
       * NOTE: Real @media queries used here (not Tailwind arbitrary breakpoints
       * like max-[639px]: — those may not emit, causing double-render issues).
       */}
      <style>{`
        @media (max-width: 480px) {
          .merch-gallery-hero-zone {
            height: 573px !important;
          }
          .merch-gallery-product-image {
            top: 0 !important;
            left: 24px !important;
            width: 342px !important;
            height: 573px !important;
          }
          .merch-gallery-product-image img {
            width: 342px !important;
            height: 573px !important;
          }
          .merch-gallery-carousel-outer {
            /* On mobile the page is single-column so 100vw === container width.
               Override the break-out technique to avoid double-render / scrollWidth mismatch. */
            width: 100% !important;
            left: 0 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
