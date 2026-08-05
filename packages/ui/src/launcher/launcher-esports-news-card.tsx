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
 *
 * Props-in / callback-out. No fetch. Server-safe. Tokens-only.
 * SVG ids via useId. Issue #691.
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
  /** Called when the card is clicked. */
  onClick?: (id: string) => void;
}

export function LauncherEsportsNewsCard({
  id,
  thumbnailUrl,
  title,
  description,
  size = "sm",
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

  // size === "sm" — compact horizontal layout (original design)
  return (
    <article
      aria-labelledby={imgId}
      onClick={() => onClick?.(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "row",
        height: 120,
        backgroundColor: bgColor,
        borderBottom: "1px solid var(--color-launcher-esports-card-border)",
        cursor: onClick ? "pointer" : "default",
        transition: "background-color 150ms ease",
        overflow: "hidden",
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          flex: "0 0 38%",
          aspectRatio: "16/9",
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
