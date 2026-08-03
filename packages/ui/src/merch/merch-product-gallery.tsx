"use client";

/**
 * MerchProductGallery — PDP left column: main image + thumbnail strip.
 *
 * Measured from merch.riotgames.com PDPs (~1280px desktop):
 *   Main image: ~690×690 SQUARE (1:1), object-fit contain (art floats on surface, not cropped)
 *   Thumbnail strip: flex, 8px gap, margin-top 12px
 *   Thumbnail: 72×72px, 1:1, object-fit cover
 *   Active border: 2px solid --color-merch-ink
 *   Inactive border: 1px solid --color-merch-border
 *   Hover border: 1px solid --color-merch-ink, cursor pointer
 *   Strip hidden when images.length <= 1
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
}: MerchProductGalleryProps) {
  const activeIdx = Math.max(0, Math.min(selectedIndex, images.length - 1));
  const showStrip = images.length > 1;

  return (
    <div style={{ fontFamily: "var(--font-merch)", width: "100%" }}>
      {/* ── Main image ─────────────────────────────────────────────────── */}
      <div
        style={{
          aspectRatio,
          width: "100%",
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

      {/* ── Thumbnail strip — hidden for single image ───────────────────── */}
      {showStrip && (
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
      )}
    </div>
  );
}
