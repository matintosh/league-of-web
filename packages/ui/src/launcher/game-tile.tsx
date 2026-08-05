"use client";

/**
 * GameTile — cover-art game library tile for the Riot launcher Games page.
 *
 * Renders a full-art cover image with an optional game logo overlay, a status
 * badge (top-left of cover), and a game name label below. Two sizes: "lg"
 * (default, 160×200 px) and "sm" (100×126 px).
 *
 * Props-in / callback-out. No data fetching. Server-safe in static usage; the
 * hover state requires client-side JS so this file is 'use client'.
 * Tokens-only — all colors via `--color-launcher-*`. Issue #689.
 */

import { useState } from "react";
import type { ReactNode } from "react";
import type { GameTileData } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Badge config — maps GameStatus → badge label + colors
// ---------------------------------------------------------------------------

type BadgeVariant = "installed" | "update" | "play" | "install" | "coming-soon";

interface BadgeConfig {
  label: string;
  bg: string;
  color: string;
}

const BADGE_CONFIG: Record<BadgeVariant, BadgeConfig> = {
  installed: {
    label: "Installed",
    bg: "var(--color-launcher-badge-installed)",
    color: "#ffffff",
  },
  update: {
    label: "Update",
    bg: "var(--color-launcher-badge-update)",
    color: "#1a1200",
  },
  play: {
    label: "Play",
    bg: "transparent",
    color: "var(--color-launcher-text-primary)",
  },
  install: {
    label: "Install",
    bg: "var(--color-launcher-surface-alt)",
    color: "var(--color-launcher-text-muted)",
  },
  "coming-soon": {
    label: "Coming Soon",
    bg: "var(--color-launcher-surface-alt)",
    color: "var(--color-launcher-text-dim)",
  },
};

// ---------------------------------------------------------------------------
// Size config
// ---------------------------------------------------------------------------

interface SizeDims {
  width: number;
  height: number;
  /** Cover art height (remainder is the name label area). */
  coverHeight: number;
  fontSize: number;
  badgeHeight: number;
  badgeFontSize: number;
}

const SIZE_DIMS: Record<"sm" | "lg", SizeDims> = {
  lg: { width: 160, height: 200, coverHeight: 168, fontSize: 11, badgeHeight: 18, badgeFontSize: 9 },
  sm: { width: 100, height: 126, coverHeight: 104, fontSize: 9, badgeHeight: 14, badgeFontSize: 7.5 },
};

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export interface GameTileProps extends GameTileData {
  /** Visual size preset. Default "lg". */
  size?: "sm" | "lg";
  /**
   * Inline SVG logo node. Takes precedence over `logoUrl` when both are set.
   * Use for the SVG game-logo components in `game-logos/`.
   */
  logoNode?: ReactNode;
  /** Called when the tile is clicked. `action` derives from `status`. */
  onAction?: (gameKey: string, action: "play" | "update" | "install") => void;
  className?: string;
}

/** Maps status → click action fired to onAction. */
function deriveAction(status: GameTileProps["status"]): "play" | "update" | "install" {
  if (status === "update") return "update";
  if (status === "install" || status === "coming-soon") return "install";
  return "play"; // installed | play
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * GameTile — full-art game library tile.
 *
 * @example
 * <GameTile
 *   gameKey="lol"
 *   gameName="League of Legends"
 *   coverUrl={championSplashUrl("Jinx", 0)}
 *   logoNode={<LolLogo size={64} />}
 *   status="installed"
 *   onAction={(key, action) => console.log(key, action)}
 * />
 */
export function GameTile({
  gameKey,
  gameName,
  coverUrl,
  logoNode,
  status,
  size = "lg",
  onAction,
  className,
}: GameTileProps) {
  const [hovered, setHovered] = useState(false);

  const dims = SIZE_DIMS[size];
  // Badge rendered for all statuses except "play" (no badge, just implicit action)
  const badge = status !== "play" ? BADGE_CONFIG[status] : null;
  const action = deriveAction(status);

  return (
    <button
      type="button"
      aria-label={`${gameName} — ${badge?.label ?? "Play"}`}
      onClick={() => onAction?.(gameKey, action)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        width: dims.width,
        height: dims.height,
        flexShrink: 0,
        backgroundColor: "var(--color-launcher-surface)",
        border: "1px solid var(--color-launcher-border)",
        borderRadius: 6,
        overflow: "hidden",
        cursor: "pointer",
        padding: 0,
        textAlign: "center",
      }}
      className={className}
    >
      {/* Cover image area */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: dims.coverHeight,
          overflow: "hidden",
          backgroundColor: "var(--color-launcher-surface)",
          borderRadius: "6px 6px 0 0",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverUrl}
          alt={gameName}
          width={dims.width}
          height={dims.coverHeight}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: hovered ? "scale(1.04)" : "scale(1)",
            filter: hovered ? "brightness(1.12)" : "brightness(1)",
            transition: "transform 150ms ease, filter 150ms ease",
          }}
        />

        {/* Status badge — top-left, omitted for "play" status */}
        {badge && status !== "play" && (
          <span
            aria-label={badge.label}
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              height: dims.badgeHeight,
              padding: `0 ${Math.round(dims.badgeHeight * 0.4)}px`,
              backgroundColor: badge.bg,
              color: badge.color,
              borderRadius: 3,
              fontSize: dims.badgeFontSize,
              fontFamily: "var(--font-launcher)",
              fontWeight: 700,
              lineHeight: `${dims.badgeHeight}px`,
              letterSpacing: "0.03em",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {badge.label}
          </span>
        )}

        {/* Game logo overlay — bottom-center of cover */}
        {logoNode && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 8,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#ffffff",
              pointerEvents: "none",
              filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.7))",
            }}
          >
            {logoNode}
          </span>
        )}
      </div>

      {/* Game name label */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: `0 4px 6px`,
          backgroundColor: "var(--color-launcher-surface)",
        }}
      >
        <span
          style={{
            fontSize: dims.fontSize,
            fontFamily: "var(--font-launcher)",
            fontWeight: 600,
            color: "var(--color-launcher-text-primary)",
            lineHeight: 1.3,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
            letterSpacing: "0.02em",
          }}
        >
          {gameName}
        </span>
      </div>
    </button>
  );
}
