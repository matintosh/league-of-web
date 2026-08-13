import type { ShowcaseEntry } from "../showcase";
import { UniverseChampionCard } from "./universe-champion-card";
import { championSplashUrl } from "@low/fixtures";

export const universeChampionCardShowcase: ShowcaseEntry = {
  slug: "universe-champion-card",
  name: "Universe Champion Card",
  area: "universe",
  description:
    "Tall portrait champion card (~3:4) from the Champions index on universe.leagueoflegends.com. Full-bleed splash art, dark bottom gradient, region overline (gold-2 caps), champion name (font-display caps, near-white). Hover: splash zooms + thin gold frame brightens. Whole card is a link.",
  referenceImage: "universe-live-champions.png",
  referenceNote: "docs/reference/universe-live-champions.png — Champions grid",
  variants: [
    {
      name: "Single card — Ahri",
      notes: "Default portrait card: Ionia overline, Ahri name, splash art, hover zoom.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-48"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseChampionCard
            name="AHRI"
            region="IONIA"
            splashUrl={championSplashUrl("Ahri")}
          />
        </div>
      ),
    },
    {
      name: "Single card — Jinx",
      notes: "Zaun region overline, Jinx splash.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-48"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseChampionCard
            name="JINX"
            region="ZAUN"
            splashUrl={championSplashUrl("Jinx")}
          />
        </div>
      ),
    },
    {
      name: "Champion grid — 5 cards",
      notes: "5-column grid matching the live Champions index row. Hover each card to see zoom + gold hairline brighten.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="grid grid-cols-5 gap-2 p-4"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseChampionCard
            name="AHRI"
            region="IONIA"
            splashUrl={championSplashUrl("Ahri")}
          />
          <UniverseChampionCard
            name="JINX"
            region="ZAUN"
            splashUrl={championSplashUrl("Jinx")}
          />
          <UniverseChampionCard
            name="GAREN"
            region="DEMACIA"
            splashUrl={championSplashUrl("Garen")}
          />
          <UniverseChampionCard
            name="AZIR"
            region="SHURIMA"
            splashUrl={championSplashUrl("Azir")}
          />
          <UniverseChampionCard
            name="AURELION SOL"
            region="COSMIC"
            splashUrl={championSplashUrl("AurelionSol")}
          />
        </div>
      ),
    },
    {
      name: "Long name edge case",
      notes: "Long champion name truncates gracefully inside the card width.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-40"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseChampionCard
            name="MISS FORTUNE"
            region="BILGEWATER"
            splashUrl={championSplashUrl("MissFortune")}
          />
        </div>
      ),
    },
  ],
};
