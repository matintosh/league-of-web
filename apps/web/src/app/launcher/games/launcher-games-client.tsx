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
  GameLolLogo,
  GameTftLogo,
  GameValorantLogo,
  GameTwoXkoLogo,
  GameWildRiftLogo,
  GameRiotShieldLogo,
} from "@low/ui";
import type { LauncherRailItem } from "@low/ui";
import { championSplashUrl } from "@low/fixtures";
import type { GameTileData } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Rail icons
// ---------------------------------------------------------------------------

function RiotFistIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4h10v2H7V4zm-1 3h12v1.5l1 2v4.5H5v-4.5l1-2V7zm2 6.5h8V11H8v2.5zm-2 2h12v1H6v-1zm1 2h10v1H7v-1z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12L12 3l9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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

/**
 * Full Riot roster — 10 items matching the ref (image.png left rail).
 * Top: Riot fist (130px slot), Home, All-games grid (active), LoL, LoL Classic,
 *   Valorant, Wild Rift, 2XKO, TFT, Riot R shield.
 * All top-stacked — no bottom-pinned items. Riot R shield is the last top item
 * (ref: flows directly after TFT, empty rail below it — no flex-push gap).
 *
 * Fixes #756 (Riot R top-stacked), #757 (Riot fist 130px slot), #758 (LoL Classic).
 */
const RAIL_ITEMS: LauncherRailItem[] = [
  { id: "riot",        label: "Riot Games",         icon: <RiotFistIcon />,                            position: "top", height: 130 },
  { id: "home",        label: "Home",               icon: <HomeIcon />,                                position: "top"    },
  { id: "games",       label: "All Games",          icon: <GamesGridIcon />,                           position: "top"    },
  { id: "lol",         label: "League of Legends",  icon: <GameLolLogo size={28} variant="emblem" />,  position: "top"    },
  { id: "lol-classic", label: "LoL Classic",        icon: <GameLolLogo size={28} variant="emblem" />,  position: "top"    },
  { id: "valorant",    label: "VALORANT",           icon: <GameValorantLogo size={28} variant="emblem" />, position: "top" },
  { id: "wildrift",    label: "Wild Rift",          icon: <GameWildRiftLogo size={28} variant="emblem" />, position: "top" },
  { id: "2xko",        label: "2XKO",               icon: <GameTwoXkoLogo size={28} variant="emblem" />,  position: "top"  },
  { id: "tft",         label: "Teamfight Tactics",  icon: <GameTftLogo size={28} variant="emblem" />,  position: "top"    },
  { id: "riot-shield", label: "Riot",               icon: <GameRiotShieldLogo size={28} />,            position: "top"    },
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
 * installedBarColor uses per-brand launcher tokens (issue #748).
 * Wild Rift shows install (not installed) per the ref.
 */
const ALL_GAMES: GameTileData[] = [
  {
    gameKey: "2xko",
    gameName: "2XKO",
    coverUrl: championSplashUrl("Ekko", 0),
    status: "installed",
    installedBarColor: "var(--color-launcher-installed-bar-2xko)",
  },
  {
    gameKey: "lol",
    gameName: "League of Legends",
    coverUrl: championSplashUrl("Jinx", 0),
    status: "installed",
    installedBarColor: "var(--color-launcher-installed-bar-lol)",
  },
  {
    gameKey: "wildrift",
    gameName: "League of Legends Wild Rift",
    coverUrl: championSplashUrl("Jinx", 2),
    status: "install",
    installedBarColor: "var(--color-launcher-installed-bar-wildrift)",
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
 * socialPanel prop is omitted; the shell handles its absence gracefully.
 */
export function LauncherGamesClient() {
  return (
    <LauncherShell
      windowBar={
        <LauncherWindowBar
          onMinimize={() => console.log("[games] minimize")}
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
