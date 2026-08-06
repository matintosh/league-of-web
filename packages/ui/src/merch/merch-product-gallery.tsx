"use client";

/**
 * MerchProductGallery — PDP left column: themed diagonal hero surface +
 * main image + secondary 2-up detail-image carousel below.
 *
 * Measured from merch.riotgames.com (amumu-plush, 1280px + 390px via Playwright):
 *
 *   Desktop (1280px):
 *     Hero zone: 828×800px, single background layer —
 *       Light/white textured webp, full 828×800.
 *       The dark-navy diagonal band is faint/absent on the real site.
 *     League of Legends wordmark: absolute, top-left, SOLID BLACK opacity 1.
 *     Product image container: 664×664, positioned at (82, 68) inside hero.
 *     Actual <img>: 616×616 within that container.
 *     Secondary carousel: full-bleed Swiper of 640×640 object-fit:cover slides,
 *       2-up edge-to-edge (x=0 and x=644 at y=930), ‹ › chevron overlays,
 *       flush under the hero. No thumbnails, no gaps between slides.
 *
 *   Mobile (390px):
 *     Hero zone: 390×629px.
 *     Product image: 342×629, positioned at x=24, y=0 (fills hero).
 *     Secondary carousel: same 2-up tiles below hero.
 *
 *   NOT present on the real site:
 *     - Heavy navy diagonal band overlay (faint/absent on real amumu-plush)
 *     - Grey padded surface panel (--color-merch-surface-alt)
 *     - Rotated vertical "LEAGUE OF LEGENDS" side label
 *     - Green "New" badge overlay in the gallery (badge is in purchase panel)
 *
 *   Background assets: Sanity webp from the "consumer_products" dataset,
 *   supplied via bgImageUrl prop. The page provides URLs; the component is presentational.
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
   * Measured: barely visible on the real amumu-plush PDP — omit or set opacity low.
   * Falls back to nothing (transparent) when omitted to match real site.
   */
  fgImageUrl?: string;
}

/** Known Sanity asset IDs for the PDP hero background layers (consumer_products dataset). */
export const PDP_HERO_BG_ID = "b8551562d7525bee89839714bb667923f7515d6e-2176x1912.webp";
export const PDP_HERO_FG_ID = "2ed0b8698a386ef2ceaf35a679ddf0fa2c93f917-2176x814.webp";

/**
 * MerchProductGallery — themed hero surface + product image + 2-up detail carousel.
 * Matches the real merch.riotgames.com PDP gallery (verified 2026-08 via Playwright).
 * Place inside the 64.7% left cell of the PDP grid alongside MerchPurchasePanel.
 */
export function MerchProductGallery({
  images,
  alt,
  selectedIndex = 0,
  onSelect,
  bgImageUrl,
  fgImageUrl: _fgImageUrl,
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

  return (
    <div style={{ fontFamily: "var(--font-merch)", width: "100%" }}>

      {/* ── Themed hero surface ──────────────────────────────────────────── */}
      {/*
       * Single background layer: light/white textured webp, full 828×800.
       * The real site's faint navy band is NOT rendered here — it's too subtle
       * to reproduce without the exact Sanity asset and would look incorrect
       * with a plain color fallback. The fgImageUrl prop is accepted but unused,
       * preserving the prop contract for callers that pass it.
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
        {/* Background layer — light textured surface */}
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
         * Mobile: 342×629 img at x=24 (hero is 629px tall on mobile).
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

      {/* ── Secondary images — 2-up 640×640 detail carousel ─────────────── */}
      {/*
       * Real: full-bleed Swiper, 640×640 object-fit:cover slides, 2-up
       * edge-to-edge (x=0 and x=644 at y=930), ‹ › chevron overlays,
       * LoL wordmark bottom-left, flush under the hero.
       * We render a relative container clipped to show 2 slides at a time,
       * with prev/next chevron buttons overlaid.
       */}
      {hasSecondary && (
        <div
          style={{
            position: "relative",
            width: "100%",
            marginTop: 0,
          }}
        >
          {/* Slide window — clips to exactly 2 slide widths */}
          <div
            style={{
              overflow: "hidden",
              width: "100%",
            }}
          >
            <div
              id={`${uid}-carousel`}
              role="list"
              aria-label="Product detail images"
              style={{
                display: "flex",
                /* Each slide = 50% of container width for 2-up layout */
                transition: "transform 0.3s ease",
                transform: `translateX(calc(-${carouselOffset} * 50%))`,
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
                      /* 2-up: each slide = 50% of container */
                      width: "50%",
                      /* 640×640 aspect: height matches measured 640px */
                      aspectRatio: "1 / 1",
                      overflow: "hidden",
                      outline: isActive
                        ? "2px solid var(--color-merch-ink)"
                        : "none",
                      outlineOffset: -2,
                      backgroundColor: "var(--color-merch-surface-alt)",
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
       *   hero zone: 629px tall (matches real 342×629 image measurement).
       *   product image: 342×629, positioned at x=24, y=0.
       */}
      <style>{`
        @media (max-width: 480px) {
          .merch-gallery-hero-zone {
            height: 629px !important;
          }
          .merch-gallery-product-image {
            top: 0 !important;
            left: 24px !important;
            width: 342px !important;
            height: 629px !important;
          }
          .merch-gallery-product-image img {
            width: 342px !important;
            height: 629px !important;
          }
        }
      `}</style>
    </div>
  );
}
