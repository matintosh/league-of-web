"use client";

/**
 * LauncherContentCarousel — horizontal thumbnail strip at the bottom of the Overview tab.
 *
 * Renders ~2 wide thumbnail cards (~460px) in a horizontal row. The band starts
 * near y≈652 (ref) — only ~68px of the card tops are visible before the 720px
 * window edge clips them, matching the ref image fold effect. The hero body is
 * fixed at 652px so the carousel always starts at that y-position.
 *
 * Cards support optional badge ("DEV") and duration ("16:50") overlays to match the
 * mixed-media content visible in the ref. Active index is controlled externally;
 * stateful demo in launcher-content-carousel.demo.tsx. No fetch — thumbnailUrl is
 * supplied by the page.
 *
 * Token source: packages/tokens/src/theme.css — --color-launcher-* set (issues #679, #685, #732, #743).
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
 * Layout (measured from lol-launcher-ref/image.png at ~1536px, ÷1.2 → our 1280×720):
 *   - Dark solid strip (--color-launcher-bg) with paddingLeft ~139px (first card
 *     x≈139-145, aligned with the hero featured-copy left inset)
 *   - Horizontal row of wide cards (~460px); only ~2 visible across the ~948px content width
 *   - Each card: 460px wide; 16/9 image area + title row below
 *   - Active card: gold border (--color-launcher-thumb-active)
 *   - Badge overlay top-right (light/white pill); duration overlay bottom-right on the thumbnail
 *   - Band starts at y≈652 (hero body is 652px fixed); fold clips the strip at y=720
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
        /* First card left edge x≈139 — aligned with the hero featured-copy inset (ref ÷1.2). */
        paddingLeft: 139,
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
        /* ~460px wide — matches ref where ~2 cards are visible in the ~948px content width */
        width: 460,
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

        {/* Badge overlay — top-right light/white rounded pill (e.g. "DEV").
            Ref shows a light pill toward the card's RIGHT side, not the gold top-left. */}
        {item.badge && (
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              backgroundColor: "color-mix(in srgb, var(--color-launcher-ink) 90%, transparent)",
              color: "var(--color-launcher-bg)",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "2px 6px",
              borderRadius: 10,
              lineHeight: 1.2,
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
