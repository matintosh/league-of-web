"use client";

/**
 * LauncherContentCarousel — horizontal thumbnail strip at the bottom of the Overview tab.
 *
 * Renders 4–5 small thumbnail cards in a horizontal row. Active index is controlled
 * externally; stateful demo in launcher-content-carousel.demo.tsx. No fetch —
 * thumbnailUrl is supplied by the page.
 *
 * Token source: packages/tokens/src/theme.css — --color-launcher-* set (issues #679, #685).
 */

/** A single content item in the carousel thumbnail strip. */
export interface LauncherContentItem {
  id: string;
  /** Thumbnail image URL. Supplied by the page (e.g. championSplashUrl). */
  thumbnailUrl: string;
  /** Short title shown below the thumbnail image. */
  title: string;
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
 * Layout (measured from lol-launcher-ref/image.png at ~1536px):
 *   - Dark solid strip (--color-launcher-bg) separating from the hero splash
 *   - Padding 12px 16px; horizontal row of cards; gap ≈ 8px; no scrollbar
 *   - Each card: 160px wide; 16/9 image area + 22px title row below
 *   - Active card: gold border (--color-launcher-thumb-active)
 *   - Hover: slightly lighter border
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
        padding: "12px 16px",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
        // Hide webkit scrollbar via className below — can't use style prop for pseudo-elements
        className="launcher-carousel-strip"
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
        width: 160,
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      {/* Thumbnail image area */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: 2,
          overflow: "hidden",
          backgroundColor: "var(--color-launcher-thumb-bg)",
          border: isActive
            ? "1px solid var(--color-launcher-thumb-active)"
            : "1px solid var(--color-launcher-thumb-border)",
          transition: "border-color 150ms ease",
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(200,155,60,0.6)";
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
      </div>

      {/* Title below thumbnail */}
      <p
        style={{
          color: "var(--color-launcher-ink-muted)",
          fontSize: 11,
          fontWeight: 500,
          lineHeight: "22px",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
          margin: 0,
          paddingTop: 2,
        }}
      >
        {item.title}
      </p>
    </button>
  );
}
