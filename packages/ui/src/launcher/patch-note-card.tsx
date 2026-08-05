"use client";

/**
 * PatchNoteCard — compact cross-game patch note card used in the "Latest
 * Patch Notes" horizontal row on the Riot launcher Home page.
 *
 * Shows a game thumbnail (top), an overlaid game logo, and a card body with
 * title + meta (game name · publish month/year).
 *
 * Token source: packages/tokens/src/theme.css — --color-launcher-* set.
 * No hardcoded hex outside packages/tokens. Server-safe.
 *
 * Closes #682.
 */

import { useId } from "react";
import type { PatchNoteData } from "@low/fixtures";

export interface PatchNoteCardProps extends PatchNoteData {
  /** Called with the card's id when the card is clicked. */
  onClick?: (id: string) => void;
  className?: string;
}

/** Strip non-alphanumeric characters so useId values are valid CSS class suffixes. */
function safeCssId(id: string) {
  return id.replace(/[^a-zA-Z0-9]/g, "");
}

/** Format ISO date string as "MMM YYYY", e.g. "Jul 2026". */
function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

/**
 * PatchNoteCard — horizontal ~367 × 100 px card per image-5.png ref.
 *
 * Left body (~57%): game logo small top-left, title (max 2 lines), meta below.
 * Right key-art (~43%): thumbnail image fills height.
 *
 * Hover surface brightens to --color-launcher-surface-alt.
 */
export function PatchNoteCard({
  id,
  gameKey,
  gameName,
  gameLogo,
  title,
  thumbUrl,
  publishedAt,
  onClick,
  className,
}: PatchNoteCardProps) {
  const uid = useId();
  const cardClass = `pnc-${safeCssId(uid)}`;

  return (
    <>
      <style>{`
        .${cardClass}:hover {
          background-color: var(--color-launcher-surface-alt) !important;
          cursor: pointer;
        }
      `}</style>

      <article
        className={`${cardClass}${className ? ` ${className}` : ""}`}
        role="button"
        tabIndex={0}
        aria-label={title}
        onClick={() => onClick?.(id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick?.(id);
          }
        }}
        style={{
          width: 367,
          height: 100,
          flexShrink: 0,
          backgroundColor: "var(--color-launcher-surface)",
          border: "1px solid var(--color-launcher-border)",
          borderRadius: 6,
          overflow: "hidden",
          display: "flex",
          flexDirection: "row",
          transition: "background-color 150ms ease",
          userSelect: "none",
        }}
      >
        {/* Left body — game logo + title + meta */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            padding: "10px 12px 10px 12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Game logo — small wordmark top of body */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gameLogo}
            alt={gameName}
            style={{
              height: 16,
              width: "auto",
              objectFit: "contain",
              objectPosition: "left center",
              filter: "brightness(0) invert(1)",
              marginBottom: 6,
              flexShrink: 0,
            }}
          />

          {/* Title */}
          <p
            style={{
              fontFamily: "var(--font-launcher)",
              fontSize: 12,
              fontWeight: 600,
              lineHeight: 1.35,
              color: "var(--color-launcher-text-primary)",
              margin: 0,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              flex: 1,
            }}
          >
            {title}
          </p>

          {/* Meta: date */}
          <p
            style={{
              fontFamily: "var(--font-launcher)",
              fontSize: 10,
              color: "var(--color-launcher-text-muted)",
              margin: "6px 0 0 0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              flexShrink: 0,
            }}
          >
            {formatDate(publishedAt)}
          </p>
        </div>

        {/* Right key-art thumbnail — fills card height */}
        <div
          style={{
            width: 140,
            flexShrink: 0,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-thumb-bg)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbUrl}
            alt=""
            aria-hidden="true"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
            }}
          />
        </div>
      </article>
    </>
  );
}
