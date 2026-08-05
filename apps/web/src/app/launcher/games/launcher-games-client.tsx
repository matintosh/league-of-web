"use client";

/**
 * LauncherGamesClient — client shell for /launcher/games.
 *
 * Wires LauncherShell (window bar + rail, no social panel) together with
 * LauncherGamesPage content. Rail "games" item is active. All callbacks
 * are console stubs — presentational.
 *
 * Fixture data: champion splashes as key-art stand-ins.
 * Real game cover art (VALORANT, TFT, 2XKO) is official art not on Data Dragon.
 *
 * Closes #686, #689.
 */

import {
  LauncherShell,
  LauncherWindowBar,
  LauncherRail,
  LauncherGamesPage,
} from "@low/ui";
import type { LauncherRailItem } from "@low/ui";
import { championSplashUrl } from "@low/fixtures";
import type { GameTileData } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Rail icons
// ---------------------------------------------------------------------------

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
      <path d="M10 2L2 9h2v9h5v-5h2v5h5V9h2L10 2z" />
    </svg>
  );
}

function GamesGridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
      <rect x="2" y="2" width="7" height="7" rx="1" />
      <rect x="11" y="2" width="7" height="7" rx="1" />
      <rect x="2" y="11" width="7" height="7" rx="1" />
      <rect x="11" y="11" width="7" height="7" rx="1" />
    </svg>
  );
}

function LolIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" fill="none">
      <circle
        cx="16"
        cy="16"
        r="15"
        fill="var(--color-launcher-rail-bg)"
        stroke="var(--color-gold-3)"
        strokeWidth="1.5"
      />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fill="var(--color-gold-3)"
        fontSize="13"
        fontWeight="700"
        fontFamily="var(--font-display)"
        letterSpacing="0.02em"
      >
        LoL
      </text>
    </svg>
  );
}

function TftIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" fill="none">
      <circle
        cx="16"
        cy="16"
        r="15"
        fill="var(--color-launcher-rail-bg)"
        stroke="var(--color-launcher-text-dim)"
        strokeWidth="1"
      />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fill="var(--color-launcher-text-dim)"
        fontSize="11"
        fontWeight="700"
        fontFamily="var(--font-display)"
        letterSpacing="0.01em"
      >
        TFT
      </text>
    </svg>
  );
}

const RAIL_ITEMS: LauncherRailItem[] = [
  { id: "home", label: "Home", icon: <HomeIcon />, position: "top" },
  { id: "lol", label: "League of Legends", icon: <LolIcon />, position: "top" },
  { id: "tft", label: "Teamfight Tactics", icon: <TftIcon />, position: "top" },
  { id: "games", label: "All Games", icon: <GamesGridIcon />, position: "top" },
];

// ---------------------------------------------------------------------------
// Fixture data — game tiles
// ---------------------------------------------------------------------------

/**
 * "My Games" row: 4 installed/update tiles matching the ref.
 * Cover art: champion splashes as stand-ins for real game key-art.
 */
const MY_GAMES: GameTileData[] = [
  {
    gameKey: "2xko",
    gameName: "2XKO",
    // Ekko splash as stand-in (2XKO is a LoL-universe fighter — Ekko is in it)
    coverUrl: championSplashUrl("Ekko", 0),
    status: "update",
  },
  {
    gameKey: "lol",
    gameName: "League of Legends",
    // Jinx splash — iconic LoL champion
    coverUrl: championSplashUrl("Jinx", 0),
    status: "installed",
  },
  {
    gameKey: "tft",
    gameName: "Teamfight Tactics",
    // Lux splash as TFT cover placeholder
    coverUrl: championSplashUrl("Lux", 3),
    status: "installed",
  },
  {
    gameKey: "valorant",
    gameName: "VALORANT",
    // Ahri splash as VALORANT cover placeholder
    coverUrl: championSplashUrl("Ahri", 2),
    status: "installed",
  },
];

/**
 * "All Games" grid: 3 tiles with Installed / Install badges.
 * Wild Rift shows no badge (install variant) per the ref.
 */
const ALL_GAMES: GameTileData[] = [
  {
    gameKey: "2xko",
    gameName: "2XKO",
    coverUrl: championSplashUrl("Ekko", 0),
    status: "installed",
  },
  {
    gameKey: "lol",
    gameName: "League of Legends",
    coverUrl: championSplashUrl("Jinx", 0),
    status: "installed",
  },
  {
    gameKey: "wildrift",
    gameName: "League of Legends Wild Rift",
    coverUrl: championSplashUrl("Jinx", 2),
    status: "install",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * LauncherGamesClient — /launcher/games shell.
 *
 * Uses a 2-column layout (rail + content) — no social panel per the ref
 * (image-7.png shows no right-hand friends panel on the Games surface).
 * The LauncherShell socialPanel slot receives an empty fragment to satisfy
 * the required prop while rendering nothing.
 */
export function LauncherGamesClient() {
  return (
    <LauncherShell
      windowBar={
        <LauncherWindowBar
          onMinimize={() => console.log("[games] minimize")}
          onMaximize={() => console.log("[games] maximize")}
          onClose={() => console.log("[games] close")}
        />
      }
      rail={
        <LauncherRail
          items={RAIL_ITEMS}
          activeId="games"
          onSelect={(id) => console.log("[games] rail select:", id)}
        />
      }
      socialPanel={
        /* No social/friends panel on the Games surface per image-7.png ref.
           Rendering an empty transparent panel to satisfy the required slot. */
        <div
          aria-hidden="true"
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "var(--color-launcher-content-bg)",
          }}
        />
      }
    >
      <LauncherGamesPage
        myGames={MY_GAMES}
        allGames={ALL_GAMES}
        onGameAction={(key, action) =>
          console.log("[games] action:", key, action)
        }
      />
    </LauncherShell>
  );
}
