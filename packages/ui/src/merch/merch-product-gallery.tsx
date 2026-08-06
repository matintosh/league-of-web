"use client";

/**
 * MerchProductGallery — PDP left column: themed diagonal hero surface +
 * main image + secondary image carousel below.
 *
 * Measured from merch.riotgames.com (amumu-plush, 1280px + 390px via Playwright):
 *
 *   Desktop (1280px):
 *     Hero zone: 828×800px, two-layer background —
 *       Upper layer (bg): light/white textured webp, full 828×800.
 *       Lower layer (fg): dark navy webp, 828×360 at y=440, clipped by
 *         polygon(0 0, 100% 102.4px, 100% 100%, 0 100%) → diagonal cut.
 *     League of Legends wordmark: absolute, top-left, SOLID BLACK opacity 1.
 *     Product image container: 664×664, positioned at (82, 68) inside hero.
 *     Actual <img>: 616×616 within that container.
 *     Secondary carousel: Swiper-style, 4 slides × 590×590 on grey (#f7f7f7)
 *       below the hero at y=800, full-width 1280px.
 *
 *   Mobile (390px):
 *     Hero zone: 390×674px, same two-layer structure.
 *     fg band: 390×303 at y=371. Diagonal top-right offset: 39px.
 *     Product image: 342×573, positioned at (24, 247).
 *     Secondary carousel: same tiles below hero.
 *
 *   NOT present on the real site:
 *     - Grey padded surface panel (--color-merch-surface-alt)
 *     - Rotated vertical "LEAGUE OF LEGENDS" side label
 *     - Green "New" badge overlay in the gallery (badge is in purchase panel)
 *
 *   Background assets: two Sanity webp files from the "consumer_products"
 *   dataset (campaign-specific), supplied via bgImageUrl / fgImageUrl props.
 *   The page provides these URLs; the component is presentational.
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
   * Measured: 828×360 webp dark navy from Sanity consumer_products dataset.
   * Falls back to --color-merch-pdp-hero-navy when omitted.
   */
  fgImageUrl?: string;
}

/** Known Sanity asset IDs for the PDP hero background layers (consumer_products dataset). */
export const PDP_HERO_BG_ID = "b8551562d7525bee89839714bb667923f7515d6e-2176x1912.webp";
export const PDP_HERO_FG_ID = "2ed0b8698a386ef2ceaf35a679ddf0fa2c93f917-2176x814.webp";

/**
 * MerchProductGallery — themed diagonal hero surface + product image + secondary carousel.
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
  const secondaryImages = images.slice(1);

  function advance() {
    if (!hasSecondary || !onSelect) return;
    const nextIdx = activeIdx >= images.length - 1 ? 0 : activeIdx + 1;
    onSelect(nextIdx);
  }

  return (
    <div style={{ fontFamily: "var(--font-merch)", width: "100%" }}>

      {/* ── Themed diagonal hero surface ─────────────────────────────────── */}
      {/*
       * Two stacked background layers reproduce the real PDP hero surface:
       *   bg layer  — upper white/light textured webp, full height
       *   fg layer  — dark navy webp band, lower ~45%, clipped diagonally
       * The clip-path matches the measured polygon from the real site.
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
        {/* Upper background layer — light textured surface */}
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

        {/* Lower diagonal band — dark navy, clipped */}
        {/*
         * clip-path measured at 1280px: polygon(0 0, 100% 102.4px, 100% 100%, 0 100%)
         * Creates a diagonal slash from top-left (y=0) to top-right (y=102.4px).
         * At mobile (390px): top-right offset shrinks to 39px.
         * Height: 360px at desktop (sits at y=440 inside 800px hero).
         */}
        <div
          aria-hidden="true"
          className="merch-gallery-hero-fg"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 360,
            backgroundImage: fgImageUrl ? `url(${fgImageUrl})` : undefined,
            backgroundColor: fgImageUrl ? undefined : "var(--color-merch-pdp-hero-navy)",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            clipPath: "polygon(0 0, 100% 102.4px, 100% 100%, 0 100%)",
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

        {/* ── Main hero product image ──────────────────────────────────── */}
        {/*
         * Desktop: 664×664px container at (82, 68), actual img 616×616.
         * Mobile: 342×573px img at (24, 247) inside a shorter hero.
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

      {/* ── Secondary images — horizontal carousel ────────────────────────── */}
      {/*
       * Real: Swiper.js asset-carousel, 590×590 grey tiles at y=800 (below hero).
       * We render a scrollable flex row with 160px thumbnails + › arrow nav.
       * Grey tile bg (#f7f7f7) matches the real carousel slide background.
       */}
      {hasSecondary && (
        <div
          style={{
            position: "relative",
            marginTop: 4,
            width: "100%",
          }}
        >
          <div
            id={`${uid}-carousel`}
            role="list"
            aria-label="Product images"
            style={{
              display: "flex",
              gap: 4,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
            } as React.CSSProperties}
          >
            {secondaryImages.map((src, idx) => {
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
                    background: "none",
                    cursor: onSelect ? "pointer" : "default",
                    flexShrink: 0,
                    width: 160,
                    height: 160,
                    overflow: "hidden",
                    border: isActive
                      ? "2px solid var(--color-merch-ink)"
                      : "1px solid var(--color-merch-border)",
                    outline: "none",
                    backgroundColor: "var(--color-merch-surface-alt)",
                    scrollSnapAlign: "start",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "var(--color-merch-ink)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "var(--color-merch-border)";
                    }
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
                      objectFit: "contain",
                      display: "block",
                    }}
                  />
                </button>
              );
            })}
          </div>

          {/* › arrow control — only when >2 images */}
          {images.length > 2 && onSelect && (
            <button
              type="button"
              aria-label="Next image"
              onClick={advance}
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: "translateY(-50%)",
                width: 36,
                height: 36,
                borderRadius: "50%",
                border: "1px solid var(--color-merch-border)",
                backgroundColor: "var(--color-merch-bg)",
                color: "var(--color-merch-ink)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                zIndex: 2,
                boxShadow: "0 1px 4px var(--color-merch-overlay-soft)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-merch-surface)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-merch-bg)";
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
       *   hero zone: 674px tall.
       *   fg diagonal band: 303px, top-right offset 39px.
       *   product image: 342×573, positioned at (24, 247).
       */}
      <style>{`
        @media (max-width: 480px) {
          .merch-gallery-hero-zone {
            height: 674px !important;
          }
          .merch-gallery-hero-fg {
            height: 303px !important;
            clip-path: polygon(0 0, 100% 39px, 100% 100%, 0 100%) !important;
          }
          .merch-gallery-product-image {
            top: 247px !important;
            left: 24px !important;
            width: 342px !important;
            height: 573px !important;
          }
          .merch-gallery-product-image img {
            width: 342px !important;
            height: 573px !important;
          }
        }
      `}</style>
    </div>
  );
}
