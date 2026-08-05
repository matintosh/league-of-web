/**
 * Showcase entry for GameTile.
 *
 * Server-safe — no 'use client'. Click handler provided via GameTileDemo
 * (client component). Six variants covering all sizes × all statuses.
 * Issue #689.
 */

import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { GameTileDemo } from "./game-tile.demo";
import { LolLogo } from "./game-logos/lol-logo";
import { ValorantLogo } from "./game-logos/valorant-logo";
import { TftLogo } from "./game-logos/tft-logo";
import { TwoXkoLogo } from "./game-logos/two-xko-logo";

/** LoL Jinx splash as stand-in cover. Real LoL cover is official art (not on Data Dragon). */
const LOL_COVER = championSplashUrl("Jinx", 0);
/** Ahri for VALORANT placeholder */
const VALORANT_COVER = championSplashUrl("Ahri", 2);
/** Jinx alt for TFT placeholder */
const TFT_COVER = championSplashUrl("Lux", 3);
/** Ekko for 2XKO placeholder */
const TWOXKO_COVER = championSplashUrl("Ekko", 0);

const DARK_BG: React.CSSProperties = {
  backgroundColor: "var(--color-launcher-content-bg)",
  padding: 24,
  display: "flex",
  flexDirection: "row",
  gap: 16,
  flexWrap: "wrap",
  alignItems: "flex-start",
};

export const gameTileShowcase: ShowcaseEntry = {
  slug: "game-tile",
  name: "GameTile",
  area: "launcher",
  description:
    "Full-art game library tile: cover image + logo overlay + status badge + name label. Two sizes (lg/sm), four badge variants. Issue #689.",
  variants: [
    {
      name: "lg — Installed (League of Legends)",
      notes: 'size="lg", status="installed". Green Installed badge. LoL logo overlay.',
      render: () => (
        <div style={DARK_BG}>
          <GameTileDemo
            gameKey="lol"
            gameName="League of Legends"
            coverUrl={LOL_COVER}
            logoNode={<LolLogo size={72} />}
            status="installed"
          />
        </div>
      ),
    },
    {
      name: "lg — Update (2XKO)",
      notes: 'size="lg", status="update". Yellow Update badge. 2XKO wordmark logo.',
      render: () => (
        <div style={DARK_BG}>
          <GameTileDemo
            gameKey="2xko"
            gameName="2XKO"
            coverUrl={TWOXKO_COVER}
            logoNode={<TwoXkoLogo size={60} />}
            status="update"
          />
        </div>
      ),
    },
    {
      name: "lg — Play / no badge (VALORANT)",
      notes: 'size="lg", status="play". No badge rendered.',
      render: () => (
        <div style={DARK_BG}>
          <GameTileDemo
            gameKey="valorant"
            gameName="VALORANT"
            coverUrl={VALORANT_COVER}
            logoNode={<ValorantLogo size={72} />}
            status="play"
          />
        </div>
      ),
    },
    {
      name: "lg — Install (TFT)",
      notes: 'size="lg", status="install". Muted Install badge.',
      render: () => (
        <div style={DARK_BG}>
          <GameTileDemo
            gameKey="tft"
            gameName="Teamfight Tactics"
            coverUrl={TFT_COVER}
            logoNode={<TftLogo size={60} />}
            status="install"
          />
        </div>
      ),
    },
    {
      name: "sm — Installed (League of Legends)",
      notes: 'size="sm". Compact 100×126 tile.',
      render: () => (
        <div style={DARK_BG}>
          <GameTileDemo
            gameKey="lol"
            gameName="League of Legends"
            coverUrl={LOL_COVER}
            logoNode={<LolLogo size={48} />}
            status="installed"
            size="sm"
          />
        </div>
      ),
    },
    {
      name: "Long game name — truncation",
      notes: "Long gameName should clamp at 2 lines.",
      render: () => (
        <div style={DARK_BG}>
          <GameTileDemo
            gameKey="test"
            gameName="League of Legends: Classic Edition — The Return to Summoner's Rift"
            coverUrl={LOL_COVER}
            status="install"
          />
        </div>
      ),
    },
  ],
};
