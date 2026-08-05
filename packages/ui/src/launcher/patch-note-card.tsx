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
 * PatchNoteCard — 220 × 140 px card.
 *
 * Top ~100 px: thumbnail with game logo overlaid bottom-left.
 * Bottom ~40 px: title (max 2 lines, ellipsis) + meta line.
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
          width: 220,
          height: 140,
          flexShrink: 0,
          backgroundColor: "var(--color-launcher-surface)",
          border: "1px solid var(--color-launcher-border)",
          borderRadius: 6,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: "background-color 150ms ease",
          userSelect: "none",
        }}
      >
        {/* Thumbnail area — top ~100 px */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 100,
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

          {/* Game logo overlaid bottom-left of thumbnail */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={gameLogo}
            alt={gameName}
            style={{
              position: "absolute",
              bottom: 6,
              left: 8,
              height: 20,
              width: "auto",
              objectFit: "contain",
              objectPosition: "left center",
              filter: "brightness(0) invert(1)",
            }}
          />
        </div>

        {/* Card body — bottom ~40 px */}
        <div
          style={{
            flex: 1,
            padding: "6px 10px 8px 10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            minHeight: 0,
          }}
        >
          {/* Title */}
          <p
            style={{
              fontFamily: "var(--font-launcher)",
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 1.4,
              color: "var(--color-launcher-text-primary)",
              margin: 0,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </p>

          {/* Meta: game name · date */}
          <p
            style={{
              fontFamily: "var(--font-launcher)",
              fontSize: 10,
              color: "var(--color-launcher-text-muted)",
              margin: "4px 0 0 0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {gameName} · {formatDate(publishedAt)}
          </p>
        </div>
      </article>
    </>
  );
}
