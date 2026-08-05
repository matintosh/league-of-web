/**
 * LauncherGamesPage — Games tab content for the Riot multi-game launcher.
 *
 * Renders:
 *   1. "Games" page heading
 *   2. "My Games" section — horizontal scrolling row of landscape GameTile (size="lg")
 *      with statusLayout="labelStatus" (Update/Install text in the label row)
 *   3. "All Games" section — 3-column CSS grid of larger GameTile (size="xl")
 *      with statusLayout="coverBadge" (Installed pill at bottom-left of art)
 *
 * Full-width content: no right social panel on the Games surface (per image-7.png).
 * The caller's LauncherShell omits the socialPanel slot; this component fills
 * the available center column.
 *
 * Props-in / callback-out. Server-safe: no 'use client'. No data fetching.
 * Tokens-only — all colors via `--color-launcher-*`. Issues #686, #727.
 */

import type { ReactNode } from "react";
import type { GameTileData } from "@low/fixtures";
import { GameTile } from "./game-tile";
import { LolLogo } from "./game-logos/lol-logo";
import { ValorantLogo } from "./game-logos/valorant-logo";
import { TftLogo } from "./game-logos/tft-logo";
import { TwoXkoLogo } from "./game-logos/two-xko-logo";
import { WildRiftLogo } from "./game-logos/wild-rift-logo";

// ---------------------------------------------------------------------------
// Logo + icon node maps — maps gameKey → overlay art + label icon
// ---------------------------------------------------------------------------

/** Inline SVG wordmark/logo for the cover art overlay. */
function logoForGame(gameKey: string): ReactNode {
  switch (gameKey) {
    case "lol":
      return <LolLogo size={68} />;
    case "valorant":
      return <ValorantLogo size={72} />;
    case "tft":
      return <TftLogo size={60} />;
    case "2xko":
      return <TwoXkoLogo size={56} />;
    case "wildrift":
      return <WildRiftLogo size={72} />;
    default:
      return null;
  }
}

/** Larger logo for xl-size All Games tiles. */
function logoForGameXl(gameKey: string): ReactNode {
  switch (gameKey) {
    case "lol":
      return <LolLogo size={92} />;
    case "valorant":
      return <ValorantLogo size={96} />;
    case "tft":
      return <TftLogo size={80} />;
    case "2xko":
      return <TwoXkoLogo size={76} />;
    case "wildrift":
      return <WildRiftLogo size={96} />;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        margin: 0,
        /* ~20px semibold per ref bbox h 19/15 (ref÷1.2) — sentence-case, no tracking */
        fontSize: 20,
        fontWeight: 600,
        fontFamily: "var(--font-launcher)",
        /* white text on dark Games surface (image-7.png ref) */
        color: "var(--color-launcher-text-primary)",
        letterSpacing: 0,
        textTransform: "none",
      }}
    >
      {children}
    </h2>
  );
}

// ---------------------------------------------------------------------------
// Component props
// ---------------------------------------------------------------------------

export interface LauncherGamesPageProps {
  /** Games shown in the "My Games" horizontal row (typically 3–5 tiles). */
  myGames: GameTileData[];
  /** Games shown in the "All Games" grid. */
  allGames: GameTileData[];
  /** Called when a tile is clicked. Passed through to GameTile.onAction. */
  onGameAction?: (gameKey: string, action: "play" | "update" | "install") => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * LauncherGamesPage — full Games tab content.
 *
 * @example
 * <LauncherGamesPage
 *   myGames={MY_GAMES}
 *   allGames={ALL_GAMES}
 *   onGameAction={(key, action) => console.log(key, action)}
 * />
 */
export function LauncherGamesPage({ myGames, allGames, onGameAction }: LauncherGamesPageProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflowY: "auto",
        /* left padding ~82px effective to align with ref x=147 (64px rail already accounted) */
        padding: "28px 36px 28px 82px",
        gap: 0,
        boxSizing: "border-box",
        backgroundColor: "var(--color-launcher-home-content-bg)",
      }}
    >
      {/* Page heading — ~28px per ref H1 bbox h (ref÷1.2) */}
      <h1
        style={{
          margin: "0 0 50px 0",
          fontSize: 28,
          fontWeight: 700,
          fontFamily: "var(--font-launcher)",
          color: "var(--color-launcher-text-primary)",
          letterSpacing: "0.02em",
        }}
      >
        Games
      </h1>

      {/* My Games section — horizontal scrolling row, landscape lg tiles.
          Inter-section gap: H1 bottom y50 → "My Games" heading y121 = 71px in our space.
          margin-bottom ~64px so "All Games" heading lands ~y460 (ref-measured ÷1.2 ≈ 383px). */}
      <section aria-label="My Games" style={{ marginBottom: 64 }}>
        <SectionHeading>My Games</SectionHeading>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            /* ~27px inter-tile gap per measured delta */
            gap: 27,
            marginTop: 14,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {myGames.map((game) => (
            <GameTile
              key={game.gameKey}
              {...game}
              size="lg"
              statusLayout="labelStatus"
              logoNode={logoForGame(game.gameKey)}
              onAction={onGameAction}
            />
          ))}
        </div>
      </section>

      {/* All Games section — 3-column grid, landscape xl tiles */}
      <section aria-label="All Games">
        <SectionHeading>All Games</SectionHeading>
        <div
          style={{
            display: "grid",
            /* 3-up grid: xl tiles are 333px; gap ~27px */
            gridTemplateColumns: "repeat(3, 333px)",
            gap: 27,
            marginTop: 14,
          }}
        >
          {allGames.map((game) => (
            <GameTile
              key={game.gameKey}
              {...game}
              size="xl"
              statusLayout="coverBadge"
              logoNode={logoForGameXl(game.gameKey)}
              onAction={onGameAction}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
