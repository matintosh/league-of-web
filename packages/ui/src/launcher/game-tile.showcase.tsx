/**
 * Showcase entry for GameTile.
 *
 * Server-safe — no 'use client'. Click handler provided via GameTileDemo
 * (client component). Variants cover all sizes × all statuses × both
 * statusLayout modes. Issue #689, #727.
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
    "Landscape game library tile: cover image + logo overlay + label row (icon + name) below art. Sizes: lg (My Games row), xl (All Games grid), sm (compact). statusLayout: coverBadge (Installed pill bottom-left of art) or labelStatus (colored text in label row). Issues #689, #727.",
  variants: [
    {
      name: "lg + labelStatus — Installed (League of Legends)",
      notes:
        'size="lg" statusLayout="labelStatus". My Games row tile — landscape cover, label below. No status text for installed.',
      render: () => (
        <div style={DARK_BG}>
          <GameTileDemo
            gameKey="lol"
            gameName="League of Legends"
            coverUrl={LOL_COVER}
            logoNode={<LolLogo size={68} />}
            status="installed"
            size="lg"
            statusLayout="labelStatus"
          />
        </div>
      ),
    },
    {
      name: "lg + labelStatus — Update (2XKO)",
      notes:
        'size="lg" statusLayout="labelStatus". Update shows as lime-colored text beside the name in the label row.',
      render: () => (
        <div style={DARK_BG}>
          <GameTileDemo
            gameKey="2xko"
            gameName="2XKO"
            coverUrl={TWOXKO_COVER}
            logoNode={<TwoXkoLogo size={56} />}
            status="update"
            size="lg"
            statusLayout="labelStatus"
          />
        </div>
      ),
    },
    {
      name: "xl + coverBadge — Installed (League of Legends)",
      notes:
        'size="xl" statusLayout="coverBadge". All Games grid tile — Installed pill bottom-left over gradient on cover art.',
      render: () => (
        <div style={DARK_BG}>
          <GameTileDemo
            gameKey="lol"
            gameName="League of Legends"
            coverUrl={LOL_COVER}
            logoNode={<LolLogo size={92} />}
            status="installed"
            size="xl"
            statusLayout="coverBadge"
          />
        </div>
      ),
    },
    {
      name: "xl + coverBadge — Install / no badge (Wild Rift)",
      notes:
        'size="xl" status="install" statusLayout="coverBadge". Install badge bottom-left.',
      render: () => (
        <div style={DARK_BG}>
          <GameTileDemo
            gameKey="wildrift"
            gameName="League of Legends Wild Rift"
            coverUrl={LOL_COVER}
            status="install"
            size="xl"
            statusLayout="coverBadge"
          />
        </div>
      ),
    },
    {
      name: "lg + coverBadge — Update (VALORANT)",
      notes: 'size="lg" statusLayout="coverBadge". Update pill bottom-left of cover.',
      render: () => (
        <div style={DARK_BG}>
          <GameTileDemo
            gameKey="valorant"
            gameName="VALORANT"
            coverUrl={VALORANT_COVER}
            logoNode={<ValorantLogo size={72} />}
            status="update"
            size="lg"
            statusLayout="coverBadge"
          />
        </div>
      ),
    },
    {
      name: "lg + coverBadge — Play / no badge (TFT)",
      notes: 'size="lg" status="play". No badge rendered.',
      render: () => (
        <div style={DARK_BG}>
          <GameTileDemo
            gameKey="tft"
            gameName="Teamfight Tactics"
            coverUrl={TFT_COVER}
            logoNode={<TftLogo size={60} />}
            status="play"
            size="lg"
            statusLayout="coverBadge"
          />
        </div>
      ),
    },
    {
      name: "sm — Installed (League of Legends)",
      notes: 'size="sm". Compact 100×93 tile.',
      render: () => (
        <div style={DARK_BG}>
          <GameTileDemo
            gameKey="lol"
            gameName="League of Legends"
            coverUrl={LOL_COVER}
            logoNode={<LolLogo size={36} />}
            status="installed"
            size="sm"
          />
        </div>
      ),
    },
    {
      name: "Long game name — truncation",
      notes: "Long gameName should truncate with ellipsis in the label row.",
      render: () => (
        <div style={DARK_BG}>
          <GameTileDemo
            gameKey="test"
            gameName="League of Legends: Classic Edition — The Return to Summoner's Rift"
            coverUrl={LOL_COVER}
            status="install"
            size="lg"
            statusLayout="labelStatus"
          />
        </div>
      ),
    },
  ],
};
