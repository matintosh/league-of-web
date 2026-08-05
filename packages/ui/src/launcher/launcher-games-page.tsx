/**
 * LauncherGamesPage — Games tab content for the Riot multi-game launcher.
 *
 * Renders:
 *   1. "Games" page heading
 *   2. "My Games" section — horizontal scrolling row of GameTile (size="lg") with
 *      status badges (update / installed / play)
 *   3. "All Games" section — CSS grid of GameTile (size="lg") with Installed badges
 *
 * Fixture data is supplied by the caller (page). This component is NOT a full
 * page shell — it renders only the content area; the caller wraps it in
 * LauncherShell (or the /launcher/games route wraps in the launcher layout).
 *
 * Props-in / callback-out. Server-safe: no 'use client'. No data fetching.
 * Tokens-only — all colors via `--color-launcher-*`. Issue #686.
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
// Logo node map — maps gameKey → inline SVG logo ReactNode
// ---------------------------------------------------------------------------

/** Inline SVG logo for a given gameKey. Returns null if no logo defined. */
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

// ---------------------------------------------------------------------------
// Section heading
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2
      style={{
        margin: 0,
        fontSize: 12,
        fontWeight: 500,
        fontFamily: "var(--font-launcher)",
        /* dark ink on light content surface (issue #719) */
        color: "var(--color-launcher-home-content-ink)",
        letterSpacing: "0.02em",
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
        padding: "24px 28px",
        gap: 0,
        boxSizing: "border-box",
        /* light content surface per image-7.png ref (issue #719) */
        backgroundColor: "var(--color-launcher-home-content-bg)",
      }}
    >
      {/* Page heading — dark ink on light surface */}
      <h1
        style={{
          margin: "0 0 20px 0",
          fontSize: 22,
          fontWeight: 700,
          fontFamily: "var(--font-launcher)",
          color: "var(--color-launcher-home-content-ink)",
          letterSpacing: "0.02em",
        }}
      >
        Games
      </h1>

      {/* My Games section */}
      <section aria-label="My Games" style={{ marginBottom: 32 }}>
        <SectionHeading>My Games</SectionHeading>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
            marginTop: 12,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {myGames.map((game) => (
            <GameTile
              key={game.gameKey}
              {...game}
              size="lg"
              logoNode={logoForGame(game.gameKey)}
              onAction={onGameAction}
            />
          ))}
        </div>
      </section>

      {/* All Games section */}
      <section aria-label="All Games">
        <SectionHeading>All Games</SectionHeading>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 160px))",
            gap: 12,
            marginTop: 12,
          }}
        >
          {allGames.map((game) => (
            <GameTile
              key={game.gameKey}
              {...game}
              size="lg"
              logoNode={logoForGame(game.gameKey)}
              onAction={onGameAction}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
