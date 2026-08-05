"use client";

/**
 * GameTile — cover-art game library tile for the Riot launcher Games page.
 *
 * Renders a landscape cover image with an optional game logo overlay, a label
 * row (game icon + name) BELOW the art, and an optional status treatment:
 *   - "coverBadge" layout (default for All Games): Installed pill sits
 *     bottom-left over the art on top of a gradient footer.
 *   - "labelStatus" layout (for My Games): colored status text + small round
 *     download control sit inline in the label row beside the game name.
 *
 * Two size presets:
 *   "lg"  — My Games row tile  (~243 × 190 px outer)
 *   "xl"  — All Games grid tile (~333 × 240 px outer)
 *   "sm"  — compact tile       (100 × 80 px cover + 26 px label)
 *
 * Props-in / callback-out. No data fetching. Server-safe in static usage; the
 * hover state requires client-side JS so this file is 'use client'.
 * Tokens-only — all colors via `--color-launcher-*`. Issue #689, #727.
 */

import { useState } from "react";
import type { ReactNode } from "react";
import type { GameTileData } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Size config — landscape covers (width > height)
// ---------------------------------------------------------------------------

interface SizeDims {
  width: number;
  /** Outer card height = coverHeight + labelHeight */
  coverHeight: number;
  labelHeight: number;
  fontSize: number;
  iconSize: number;
  badgeHeight: number;
  badgeFontSize: number;
}

const SIZE_DIMS: Record<"sm" | "lg" | "xl", SizeDims> = {
  /** Compact row tile — used in My Games row */
  lg: {
    width: 243,
    coverHeight: 162,
    labelHeight: 36,
    fontSize: 12,
    iconSize: 18,
    badgeHeight: 18,
    badgeFontSize: 9,
  },
  /** All Games grid tile — larger 3-up presentation */
  xl: {
    width: 333,
    coverHeight: 222,
    labelHeight: 40,
    fontSize: 13,
    iconSize: 20,
    badgeHeight: 20,
    badgeFontSize: 9.5,
  },
  /** Compact thumbnail — legacy small preset */
  sm: {
    width: 100,
    coverHeight: 67,
    labelHeight: 26,
    fontSize: 9,
    iconSize: 12,
    badgeHeight: 14,
    badgeFontSize: 7.5,
  },
};

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export interface GameTileProps extends GameTileData {
  /** Visual size preset. Default "lg". */
  size?: "sm" | "lg" | "xl";
  /**
   * How the status indicator is rendered.
   * - "coverBadge" (default) — full-width brand bar at tile bottom in All Games grid.
   *   Used for All Games tiles.
   * - "labelStatus" — colored text in the label row beside the game name.
   *   Used for My Games tiles.
   */
  statusLayout?: "coverBadge" | "labelStatus";
  /**
   * Inline SVG logo node overlaid on the cover art (vertically centered).
   * Takes precedence over `logoUrl` when both are set.
   * Use for the SVG game-logo components in `game-logos/`.
   */
  logoNode?: ReactNode;
  /**
   * Small square icon node rendered beside the game name in the label row.
   * Typically a 16–20 px game emblem SVG.
   */
  iconNode?: ReactNode;
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
 * GameTile — landscape game library tile with label below art.
 *
 * @example
 * // All Games — large tile with bottom-left Installed badge
 * <GameTile
 *   gameKey="lol"
 *   gameName="League of Legends"
 *   coverUrl={championSplashUrl("Jinx", 0)}
 *   logoNode={<LolLogo size={80} />}
 *   iconNode={<GameLolLogo size={20} variant="emblem" />}
 *   status="installed"
 *   size="xl"
 *   statusLayout="coverBadge"
 *   onAction={(key, action) => console.log(key, action)}
 * />
 *
 * @example
 * // My Games — row tile with Update text in label
 * <GameTile
 *   gameKey="2xko"
 *   gameName="2XKO"
 *   coverUrl={championSplashUrl("Ekko", 0)}
 *   logoNode={<TwoXkoLogo size={56} />}
 *   iconNode={<GameTwoXkoLogo size={18} variant="emblem" />}
 *   status="update"
 *   size="lg"
 *   statusLayout="labelStatus"
 *   onAction={(key, action) => console.log(key, action)}
 * />
 */
export function GameTile({
  gameKey,
  gameName,
  coverUrl,
  logoNode,
  iconNode,
  status,
  installedBarColor,
  size = "lg",
  statusLayout = "coverBadge",
  onAction,
  className,
}: GameTileProps) {
  const [hovered, setHovered] = useState(false);

  const dims = SIZE_DIMS[size];
  const action = deriveAction(status);
  const outerHeight = dims.coverHeight + dims.labelHeight;

  return (
    <button
      type="button"
      aria-label={`${gameName} — ${status}`}
      onClick={() => onAction?.(gameKey, action)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        width: dims.width,
        height: outerHeight,
        flexShrink: 0,
        backgroundColor: "var(--color-launcher-surface)",
        border: "1px solid var(--color-launcher-border)",
        borderRadius: 6,
        overflow: "hidden",
        cursor: "pointer",
        padding: 0,
        textAlign: "left",
      }}
      className={className}
    >
      {/* Cover image area — landscape */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: dims.coverHeight,
          overflow: "hidden",
          backgroundColor: "var(--color-launcher-surface)",
          borderRadius: "6px 6px 0 0",
          flexShrink: 0,
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

        {/* Game logo overlay — vertically centered in cover art */}
        {logoNode && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "var(--color-launcher-ink)",
              pointerEvents: "none",
              filter:
                "drop-shadow(0 1px 3px color-mix(in srgb, var(--color-launcher-bg) 70%, transparent))",
            }}
          >
            {logoNode}
          </span>
        )}

        {/* coverBadge layout — full-width brand bar at tile bottom (ref image-7.png) */}
        {statusLayout === "coverBadge" && status !== "play" && (
          <div
            aria-label={status}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              /* ~25px tall per ref (no radius, no scrim, spans full width) */
              height: 25,
              backgroundColor:
                status === "installed"
                  ? installedBarColor ?? "var(--color-launcher-installed-bar-default)"
                  : status === "update"
                  ? "var(--color-launcher-badge-update)"
                  : "var(--color-launcher-surface-alt)",
              display: "flex",
              alignItems: "center",
              paddingLeft: 12,
              pointerEvents: "none",
            }}
          >
            <span
              style={{
                fontSize: dims.badgeFontSize,
                fontFamily: "var(--font-launcher)",
                /* mixed-case, weight 600, no tracking — per ref */
                fontWeight: 600,
                letterSpacing: 0,
                textTransform: "none",
                whiteSpace: "nowrap",
                color:
                  status === "installed"
                    ? "var(--color-launcher-home-content-bg)"
                    : status === "update"
                    ? "var(--color-launcher-chip-game-updates-ink)"
                    : "var(--color-launcher-text-muted)",
                lineHeight: 1,
              }}
            >
              {status === "installed"
                ? "Installed"
                : status === "update"
                ? "Update"
                : status === "install"
                ? "Install"
                : "Coming Soon"}
            </span>
          </div>
        )}
      </div>

      {/* Label row — below the art, on the tile's surface bg */}
      <div
        style={{
          height: dims.labelHeight,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: `0 8px`,
          backgroundColor: "var(--color-launcher-surface)",
        }}
      >
        {/* Small game icon */}
        {iconNode && (
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: dims.iconSize,
              height: dims.iconSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-launcher-text-primary)",
            }}
          >
            {iconNode}
          </span>
        )}

        {/* Game name */}
        <span
          style={{
            flex: 1,
            minWidth: 0,
            fontSize: dims.fontSize,
            fontFamily: "var(--font-launcher)",
            fontWeight: 600,
            color: "var(--color-launcher-text-primary)",
            lineHeight: 1.3,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            letterSpacing: "0.02em",
          }}
        >
          {gameName}
        </span>

        {/* labelStatus layout — Update/Install colored text in label row (My Games) */}
        {statusLayout === "labelStatus" && status === "update" && (
          <span
            aria-label="Update available"
            style={{
              flexShrink: 0,
              fontSize: dims.fontSize - 1,
              fontFamily: "var(--font-launcher)",
              fontWeight: 700,
              /* lime Update text — matches ref rgb(195,233,96) via launcher token */
              color: "var(--color-launcher-badge-installed)",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
          >
            Update
          </span>
        )}
        {statusLayout === "labelStatus" && (status === "install" || status === "coming-soon") && (
          <span
            aria-label={status === "coming-soon" ? "Coming Soon" : "Install"}
            style={{
              flexShrink: 0,
              fontSize: dims.fontSize - 1,
              fontFamily: "var(--font-launcher)",
              fontWeight: 600,
              color: "var(--color-launcher-text-muted)",
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
          >
            {status === "coming-soon" ? "Coming Soon" : "Install"}
          </span>
        )}
      </div>
    </button>
  );
}
