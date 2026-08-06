"use client";

/**
 * MerchProductGallery — PDP left column: grey surface panel + logo watermark +
 * badge overlay + main image + secondary image carousel.
 *
 * Measured from merch.riotgames.com (amumu-plush, 1280px + 390px):
 *   Desktop:
 *     Grey surface panel: 664×664px, bg --color-merch-surface-alt (#f7f7f7), 24px padding.
 *     Hero inside: 616×616 square (1:1), object-fit contain, art floats on grey.
 *     Franchise wordmark: absolute top-left ~16px inset, white fill.
 *     "New" badge overlay: green --color-merch-badge-new, black text, radius 2, top-right.
 *     Vertical franchise label: rotated "LEAGUE OF LEGENDS" along left edge.
 *     Secondary images: horizontal carousel of 640×640 square tiles on grey, › arrow.
 *   Mobile (390px):
 *     Hero: 342×629 portrait (~1:1.84) on grey surface.
 *     Secondary strip: 351×351 square tiles in horizontal scroll below hero.
 *
 * Controlled: pass selectedIndex + onSelect from parent demo/page.
 */
import React, { useId } from "react";
import { LolWordmark } from "./franchise-logos";

export interface MerchProductGalleryProps {
  /** Ordered list of image URLs. First is shown as the initial main image. */
  images: string[];
  /** Alt text for the main image (product title). */
  alt: string;
  /** Index of the currently selected image — controlled. Defaults to 0. */
  selectedIndex?: number;
  /** Called when a secondary image is clicked — pass new index. */
  onSelect?: (index: number) => void;
  /**
   * Badge label to overlay on the top-right of the surface panel.
   * Typically the first badge from the product (e.g. "New").
   */
  badgeLabel?: string;
  /**
   * When true, renders secondary images as a horizontal carousel with › arrow.
   * Default true (matches real PDP gallery layout).
   */
  carousel?: boolean;
}

/**
 * MerchProductGallery — grey-surface image gallery for the PDP left column.
 * Place inside the 64.7% left cell of the PDP grid alongside MerchPurchasePanel.
 */
export function MerchProductGallery({
  images,
  alt,
  selectedIndex = 0,
  onSelect,
  badgeLabel,
  carousel = true,
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

      {/* ── Grey surface panel ─────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          backgroundColor: "var(--color-merch-surface-alt)",
          padding: 24,
          /* Desktop: 664×664 panel; shrinks naturally on smaller viewports */
          maxWidth: 664,
          width: "100%",
          /* Responsive: square on desktop, portrait on mobile via aspect-ratio trick */
        }}
      >
        {/* Franchise wordmark — top-left overlay */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            color: "var(--color-merch-ink)",
            opacity: 0.35,
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <LolWordmark />
        </div>

        {/* "New" badge overlay — top-right */}
        {badgeLabel && (
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              zIndex: 1,
              fontSize: 16,
              fontWeight: 400,
              padding: "4px 8px",
              borderRadius: 2,
              backgroundColor: "var(--color-merch-badge-new)",
              color: "var(--color-merch-ink-dark)",
              lineHeight: 1.2,
              pointerEvents: "none",
            }}
          >
            {badgeLabel}
          </div>
        )}

        {/* Vertical franchise label — left edge */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateX(-50%) translateY(-50%) rotate(-90deg)",
            transformOrigin: "center center",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--color-merch-ink)",
            opacity: 0.25,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          League of Legends
        </div>

        {/* ── Main hero image ──────────────────────────────────────────── */}
        {/* Desktop: 1:1 square. Mobile: portrait ~1:1.84 via responsive trick */}
        <div
          style={{
            /* Desktop square */
            aspectRatio: "1 / 1",
            width: "100%",
            overflow: "hidden",
            position: "relative",
          }}
          className="merch-gallery-hero"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeIdx]}
            alt={alt}
            loading="eager"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* ── Secondary images — horizontal carousel ───────────────────── */}
      {hasSecondary && carousel && (
        <div
          style={{
            position: "relative",
            marginTop: 4,
            maxWidth: 664,
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
              /* msOverflowStyle is not typed; set via string in JSX style */
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

          {/* › arrow control */}
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

      {/* ── Mobile portrait hero + secondary strip styles ─────────────── */}
      {/*
       * On 390px viewports: hero becomes portrait (342×629, ~1:1.84).
       * Secondary tiles: 351×351 in horizontal scroll strip.
       * Implemented via a <style> tag scoped to this component.
       */}
      <style>{`
        @media (max-width: 480px) {
          .merch-gallery-hero {
            aspect-ratio: 342 / 629 !important;
          }
        }
      `}</style>
    </div>
  );
}
