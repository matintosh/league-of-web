/**
 * LauncherEsportsNewsCard — horizontal article card for the Esports tab.
 *
 * Layout: thumbnail (left, ~38% width, 16/9 aspect, object-cover) +
 * text area (right, title 2-line clamp + description 3-line clamp).
 * Cards stack vertically with a 1px bottom border hairline separator.
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
  /** Called when the card is clicked. */
  onClick?: (id: string) => void;
}

export function LauncherEsportsNewsCard({
  id,
  thumbnailUrl,
  title,
  description,
  onClick,
}: LauncherEsportsNewsCardProps) {
  const uid = useId();
  const imgId = `${uid}-thumb`;
  const [hovered, setHovered] = useState(false);

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
        backgroundColor: hovered
          ? "var(--color-launcher-esports-card-hover)"
          : "var(--color-launcher-esports-card-bg)",
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
