"use client";

/**
 * MerchProductGallery — PDP left column: main image + secondary images.
 *
 * Measured from merch.riotgames.com PDPs (~1280px desktop):
 *   Main image: ~616–690×690 SQUARE (1:1), object-fit contain (art floats on surface, not cropped)
 *   Thumbnail strip (default): flex, 8px gap, margin-top 12px; 72×72px, 1:1, object-fit cover
 *   Large-tile layout (largeTiles=true, matches real PDP):
 *     Secondary images rendered as ~640×640 tiles in a full-width row below the hero.
 *     Hero constrained to ~616px wide. Tiles are full-width column on mobile.
 *   Active border: 2px solid --color-merch-ink
 *   Inactive border: 1px solid --color-merch-border
 *   Hover border: 1px solid --color-merch-ink, cursor pointer
 *   Strip/tiles hidden when images.length <= 1
 *
 * Controlled: pass selectedIndex + onSelect from a parent demo/page.
 * Uncontrolled-safe: selectedIndex defaults to 0; without onSelect, thumbs are no-ops.
 */
import React from "react";

export interface MerchProductGalleryProps {
  /** Ordered list of image URLs. First is shown as the initial main image. */
  images: string[];
  /** Alt text for the main image (product title). */
  alt: string;
  /** Aspect ratio for the main image container. Default "1 / 1" (square, matching real PDP). */
  aspectRatio?: string;
  /** Index of the currently selected image — controlled. Defaults to 0. */
  selectedIndex?: number;
  /** Called when a thumbnail is clicked — pass new index. */
  onSelect?: (index: number) => void;
  /**
   * When true, renders secondary images as large ~640×640 tiles in a full-width row below the hero
   * rather than a 72px thumbnail strip. Matches the real PDP gallery layout (verified 2026-08).
   * Hero is constrained to ~616px wide in this mode. Mobile: single column, tiles stack below.
   */
  largeTiles?: boolean;
}

/**
 * MerchProductGallery — image gallery for the PDP left column.
 * Place inside a flex/grid PDP layout alongside MerchPurchasePanel.
 */
export function MerchProductGallery({
  images,
  alt,
  aspectRatio = "1 / 1",
  selectedIndex = 0,
  onSelect,
  largeTiles = false,
}: MerchProductGalleryProps) {
  const activeIdx = Math.max(0, Math.min(selectedIndex, images.length - 1));
  const hasSecondary = images.length > 1;
  const secondaryImages = images.slice(1);

  return (
    <div style={{ fontFamily: "var(--font-merch)", width: "100%" }}>
      {/* ── Main image ─────────────────────────────────────────────────── */}
      <div
        style={{
          aspectRatio,
          width: "100%",
          maxWidth: largeTiles ? 640 : undefined,
          overflow: "hidden",
          backgroundColor: "var(--color-merch-surface)",
        }}
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

      {hasSecondary && largeTiles ? (
        /* ── Large-tile row — matches real PDP (~640×640 tiles below hero) ── */
        <div
          role="list"
          aria-label="Product images"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            marginTop: 4,
            width: "100%",
          }}
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
                  /* Each tile takes ~50% of the row so 2 fit side by side */
                  flex: "1 1 calc(50% - 2px)",
                  minWidth: 0,
                  aspectRatio: "1 / 1",
                  overflow: "hidden",
                  border: isActive
                    ? "2px solid var(--color-merch-ink)"
                    : "1px solid var(--color-merch-border)",
                  outline: "none",
                  backgroundColor: "var(--color-merch-surface)",
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
      ) : hasSecondary ? (
        /* ── Thumbnail strip — 72px, original layout ───────────────────── */
        <div
          role="list"
          aria-label="Product images"
          style={{
            display: "flex",
            gap: 8,
            marginTop: 12,
          }}
        >
          {images.map((src, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={idx}
                role="listitem"
                type="button"
                aria-label={`View image ${idx + 1}`}
                aria-pressed={isActive}
                onClick={() => onSelect?.(idx)}
                style={{
                  padding: 0,
                  background: "none",
                  cursor: onSelect ? "pointer" : "default",
                  flexShrink: 0,
                  width: 72,
                  height: 72,
                  overflow: "hidden",
                  border: isActive
                    ? "2px solid var(--color-merch-ink)"
                    : "1px solid var(--color-merch-border)",
                  outline: "none",
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
                  alt={`Product thumbnail ${idx + 1}`}
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
      ) : null}
    </div>
  );
}
