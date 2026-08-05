/**
 * Showcase entry for LauncherGamesPage.
 *
 * Server-safe — no 'use client'. Game action handler is in
 * launcher-games-page.demo.tsx (client component).
 * Issue #686.
 */

import { championSplashUrl } from "@low/fixtures";
import type { GameTileData } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { LauncherGamesPageDemo } from "./launcher-games-page.demo";

// ---------------------------------------------------------------------------
// Fixture data — champion splashes as key-art stand-ins
// NOTE: Real game cover art (VALORANT, TFT, 2XKO) is not available via
// Data Dragon. Champion splashes are used as placeholders.
// ---------------------------------------------------------------------------

const MY_GAMES: GameTileData[] = [
  {
    gameKey: "2xko",
    gameName: "2XKO",
    coverUrl: championSplashUrl("Ekko", 0),
    status: "update",
  },
  {
    gameKey: "lol",
    gameName: "League of Legends",
    coverUrl: championSplashUrl("Jinx", 0),
    status: "installed",
  },
  {
    gameKey: "tft",
    gameName: "Teamfight Tactics",
    coverUrl: championSplashUrl("Lux", 3),
    status: "installed",
  },
  {
    gameKey: "valorant",
    gameName: "VALORANT",
    coverUrl: championSplashUrl("Ahri", 2),
    status: "installed",
  },
];

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

export const launcherGamesPageShowcase: ShowcaseEntry = {
  slug: "launcher-games-page",
  name: "LauncherGamesPage",
  area: "launcher",
  description:
    "Games tab content: 'Games' heading + 'My Games' row (4 tiles with update/installed badges) + 'All Games' grid (3 tiles). Issue #686.",
  variants: [
    {
      name: "Games page composition (1080×660)",
      notes:
        "Full Games tab at approximate launcher content area dimensions. My Games: 2XKO (Update), LoL, TFT, VALORANT. All Games: 2XKO, LoL, Wild Rift. Champion splashes used as cover-art placeholders.",
      render: () => (
        <div
          style={{
            width: 1080,
            height: 660,
            overflow: "hidden",
            backgroundColor: "var(--color-launcher-bg)",
            position: "relative",
          }}
        >
          <LauncherGamesPageDemo myGames={MY_GAMES} allGames={ALL_GAMES} />
        </div>
      ),
    },
  ],
};
