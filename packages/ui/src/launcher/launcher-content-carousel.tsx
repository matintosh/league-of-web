"use client";

/**
 * LauncherContentCarousel — horizontal thumbnail strip at the bottom of the Overview tab.
 *
 * Renders 2–3 wide thumbnail cards (~300px) in a horizontal row. The band starts
 * near y≈652 (ref) and is intentionally ~68px visible before the 720px window edge
 * clips it — matching the ref image where cards are cut off at the bottom fold.
 *
 * Cards support optional badge ("DEV") and duration ("16:50") overlays to match the
 * mixed-media content visible in the ref. Active index is controlled externally;
 * stateful demo in launcher-content-carousel.demo.tsx. No fetch — thumbnailUrl is
 * supplied by the page.
 *
 * Token source: packages/tokens/src/theme.css — --color-launcher-* set (issues #679, #685, #732).
 */

/** A single content item in the carousel thumbnail strip. */
export interface LauncherContentItem {
  id: string;
  /** Thumbnail image URL. Supplied by the page (e.g. championSplashUrl). */
  thumbnailUrl: string;
  /** Short title shown below the thumbnail image. */
  title: string;
  /**
   * Optional badge overlay label (e.g. "DEV"). Displayed top-left of the thumbnail.
   * Matches the "DEV" badge on the first card in lol-launcher-ref/image.png.
   */
  badge?: string;
  /**
   * Optional duration overlay (e.g. "16:50"). Displayed bottom-right of the thumbnail.
   * Matches the video duration overlay on the second card in the ref.
   */
  duration?: string;
}

export interface LauncherContentCarouselProps {
  /** Array of content items to display as thumbnails. */
  items: LauncherContentItem[];
  /** Index of the currently active/selected thumbnail. */
  activeIndex?: number;
  /** Called with the item index when a thumbnail is clicked. */
  onSelect?: (index: number) => void;
}

/**
 * Bottom thumbnail strip for the launcher Overview tab.
 *
 * Layout (measured from lol-launcher-ref/image.png at ~1536px, ÷1.2):
 *   - Dark solid strip (--color-launcher-bg) with padding left ~120px (first card
 *     x≈121 aligned with the featured copy inset)
 *   - Horizontal row of wide cards (~300px); only 2–3 visible; overflow hidden (clipped)
 *   - Each card: ~300px wide; 16/9 image area + title row below
 *   - Active card: gold border (--color-launcher-thumb-active)
 *   - Badge overlay top-left; duration overlay bottom-right on the thumbnail image
 */
export function LauncherContentCarousel({
  items,
  activeIndex = 0,
  onSelect,
}: LauncherContentCarouselProps) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-launcher-bg)",
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 120,
        paddingRight: 24,
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          overflow: "hidden",
        }}
      >
        {items.map((item, index) => (
          <LauncherThumbCard
            key={item.id}
            item={item}
            isActive={index === activeIndex}
            onClick={() => onSelect?.(index)}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal subcomponent — not exported from the package index

interface ThumbCardProps {
  item: LauncherContentItem;
  isActive: boolean;
  onClick: () => void;
}

function LauncherThumbCard({ item, isActive, onClick }: ThumbCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flexShrink: 0,
        width: 300,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {/* Thumbnail image area — 16:9 */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "var(--color-launcher-thumb-bg)",
          border: isActive
            ? "2px solid var(--color-launcher-thumb-active)"
            : "1px solid var(--color-launcher-thumb-border)",
          transition: "border-color 150ms ease",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.borderColor =
              "color-mix(in srgb, var(--color-launcher-thumb-active) 60%, transparent)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.borderColor =
              "var(--color-launcher-thumb-border)";
          }
        }}
      >
        <img
          src={item.thumbnailUrl}
          alt={item.title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* Badge overlay — top-left (e.g. "DEV") */}
        {item.badge && (
          <span
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              backgroundColor: "var(--color-launcher-accent)",
              color: "var(--color-launcher-bg)",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "2px 5px",
              borderRadius: 2,
              lineHeight: 1,
              fontFamily: "var(--font-launcher)",
            }}
          >
            {item.badge}
          </span>
        )}

        {/* Duration overlay — bottom-right (e.g. "16:50") */}
        {item.duration && (
          <span
            style={{
              position: "absolute",
              bottom: 5,
              right: 5,
              backgroundColor: "var(--color-launcher-badge-overlay)",
              color: "var(--color-launcher-ink)",
              fontSize: 10,
              fontWeight: 600,
              padding: "1px 4px",
              borderRadius: 2,
              lineHeight: 1.4,
              fontFamily: "var(--font-launcher)",
            }}
          >
            {item.duration}
          </span>
        )}
      </div>

      {/* Title below thumbnail */}
      <p
        style={{
          color: "var(--color-launcher-ink-muted)",
          fontSize: 11,
          fontWeight: 500,
          lineHeight: "20px",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          margin: "3px 0 0",
          fontFamily: "var(--font-launcher)",
        }}
      >
        {item.title}
      </p>
    </button>
  );
}
