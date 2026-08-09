/**
 * LauncherEsportsNewsCard — article card for the Esports tab.
 *
 * Two layout modes controlled by the `size` prop:
 *
 *   "lg" (default) — portrait featured card: full-bleed image (~60% height)
 *     above a text block (title + description). Matches the left/hero slot of
 *     the magazine grid in image-3.png.
 *
 *   "sm" — compact card: thumbnail on left (~40% width), text (title +
 *     description) on right. Stacked in the right column of the magazine grid.
 *     Supports `category` (top-right pill badge) and `duration` (bottom-left
 *     duration badge) overlays on the thumbnail (issues #950, #951).
 *
 * Props-in / callback-out. No fetch. Server-safe. Tokens-only.
 * SVG ids via useId. Issue #691, #950, #951.
 */

"use client";

import { useId, useState } from "react";

export interface LauncherEsportsNewsCardProps {
  /** Unique article id. Passed to onClick. */
  id: string;
  /** Article thumbnail image URL. */
  thumbnailUrl: string;
  /** Article title, e.g. "MSI 2026: Moments and Memories". */
  title: string;
  /** Short article description / excerpt. */
  description: string;
  /**
   * Card layout size.
   * - "lg" — portrait featured card (image top, text below). Magazine grid hero slot.
   * - "sm" — compact horizontal card (thumbnail left, text right). Default.
   */
  size?: "lg" | "sm";
  /**
   * Category label shown as a pill badge in the top-right of the thumbnail.
   * Only rendered in `size="sm"` mode. E.g. "ESPORTS". Issue #951.
   */
  category?: string;
  /**
   * Video duration shown as a small badge in the bottom-left of the thumbnail.
   * Only rendered in `size="sm"` mode. E.g. "18:50". Issue #951.
   */
  duration?: string;
  /** Called when the card is clicked. */
  onClick?: (id: string) => void;
}

export function LauncherEsportsNewsCard({
  id,
  thumbnailUrl,
  title,
  description,
  size = "sm",
  category,
  duration,
  onClick,
}: LauncherEsportsNewsCardProps) {
  const uid = useId();
  const imgId = `${uid}-thumb`;
  const [hovered, setHovered] = useState(false);

  const bgColor = hovered
    ? "var(--color-launcher-esports-card-hover)"
    : "var(--color-launcher-esports-card-bg)";

  if (size === "lg") {
    return (
      <article
        aria-labelledby={imgId}
        onClick={() => onClick?.(id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          height: "100%",
          borderRadius: 4,
          cursor: onClick ? "pointer" : "default",
          overflow: "hidden",
          backgroundColor: "var(--color-launcher-thumb-bg)",
        }}
      >
        {/* Full-bleed image fills entire card */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          id={imgId}
          src={thumbnailUrl}
          alt={title}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 200ms ease",
            transform: hovered ? "scale(1.03)" : "scale(1)",
          }}
        />

        {/* Bottom gradient scrim — darkens bottom ~40% so title is readable */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, var(--color-launcher-esports-scrim-bottom) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />

        {/* Title + description overlaid on scrim */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "16px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              lineHeight: 1.25,
              color: "var(--color-launcher-ink)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontWeight: 400,
              lineHeight: 1.5,
              color: "var(--color-launcher-ink-muted)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        </div>
      </article>
    );
  }

  // size === "sm" — compact horizontal layout
  // flex:1 / minHeight:0 lets three cards share the full right-column height
  // evenly instead of being capped at the old fixed 120px. Issue #950.
  return (
    <article
      aria-labelledby={imgId}
      onClick={() => onClick?.(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        minHeight: 0,
        backgroundColor: bgColor,
        borderBottom: "1px solid var(--color-launcher-esports-card-border)",
        cursor: onClick ? "pointer" : "default",
        transition: "background-color 150ms ease",
        overflow: "hidden",
      }}
    >
      {/* Thumbnail — position:relative to contain badge overlays */}
      <div
        style={{
          flex: "0 0 38%",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "var(--color-launcher-thumb-bg)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          id={imgId}
          src={thumbnailUrl}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            borderRadius: 0,
          }}
        />

        {/* Category pill badge — top-right (issue #951) */}
        {category && (
          <span
            aria-label={category}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              borderRadius: 12,
              padding: "3px 8px",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              color: "var(--color-launcher-ink)",
              background: "var(--color-launcher-esports-badge-bg)",
              border: "1px solid var(--color-launcher-esports-badge-border)",
              lineHeight: 1.2,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {category}
          </span>
        )}

        {/* Duration badge — bottom-left (issue #951) */}
        {duration && (
          <span
            aria-label={`Duration: ${duration}`}
            style={{
              position: "absolute",
              bottom: 6,
              left: 6,
              fontSize: 11,
              fontWeight: 600,
              color: "var(--color-launcher-ink)",
              background: "var(--color-launcher-esports-badge-bg)",
              padding: "2px 5px",
              borderRadius: 2,
              lineHeight: 1.2,
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            {duration}
          </span>
        )}
      </div>

      {/* Text area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 6,
          padding: "12px 16px",
          minWidth: 0,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.3,
            color: "var(--color-launcher-ink)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 1.5,
            color: "var(--color-launcher-ink-muted)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {description}
        </p>
      </div>
    </article>
  );
}
