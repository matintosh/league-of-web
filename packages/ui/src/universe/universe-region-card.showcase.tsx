import type { ShowcaseEntry } from "../showcase";
import { UniverseRegionCard } from "./universe-region-card";
import { championSplashUrl } from "@low/fixtures";

// Region → champion splash stand-in mapping for editorial art
const REGION_ART: Record<string, string> = {
  demacia: championSplashUrl("Garen"),
  noxus: championSplashUrl("Darius"),
  ionia: championSplashUrl("Irelia"),
  piltover: championSplashUrl("Caitlyn"),
  zaun: championSplashUrl("Jinx"),
  freljord: championSplashUrl("Ashe"),
  shurima: championSplashUrl("Azir"),
  ixtal: championSplashUrl("Qiyana"),
  bilgewater: championSplashUrl("MissFortune"),
  "bandle-city": championSplashUrl("Tristana"),
  "shadow-isles": championSplashUrl("Thresh"),
  targon: championSplashUrl("Leona"),
  void: championSplashUrl("KhaZix"),
};

export const universeRegionCardShowcase: ShowcaseEntry = {
  slug: "universe-region-card",
  name: "Universe Region Card",
  area: "universe",
  description:
    "Landscape editorial region tile (~4:3) from the Regions index on universe.leagueoflegends.com. Full-bleed art, dark scrim, region name in font-display Beaufort caps (gold-1) centered at lower third. Hover: art zooms + subtle brightness lift. Whole card is a link.",
  referenceImage: "universe-live-regions.png",
  referenceNote: "docs/reference/universe-live-regions.png — Regions grid",
  variants: [
    {
      name: "Single card — Demacia",
      notes: "Default landscape tile: Demacia name, Garen splash stand-in, hover zoom.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-64"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseRegionCard
            name="DEMACIA"
            slug="demacia"
            art={REGION_ART.demacia}
            href="/universe/region/demacia"
          />
        </div>
      ),
    },
    {
      name: "Single card — Ionia",
      notes: "Ionia tile with Irelia splash, purple editorial mood.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-64"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseRegionCard
            name="IONIA"
            slug="ionia"
            art={REGION_ART.ionia}
            href="/universe/region/ionia"
          />
        </div>
      ),
    },
    {
      name: "No art — gradient fallback",
      notes: "When no art prop is supplied, a Hextech blue-to-black editorial gradient fills the tile.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-64"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseRegionCard
            name="THE VOID"
            slug="void"
            href="/universe/region/void"
          />
        </div>
      ),
    },
    {
      name: "Region grid — 4 × 3",
      notes: "Representative 4-column grid matching the Regions index layout. Hover each tile.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="grid grid-cols-4 gap-2 p-4"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          {[
            { name: "DEMACIA", slug: "demacia" },
            { name: "NOXUS", slug: "noxus" },
            { name: "IONIA", slug: "ionia" },
            { name: "PILTOVER", slug: "piltover" },
            { name: "ZAUN", slug: "zaun" },
            { name: "FRELJORD", slug: "freljord" },
            { name: "SHURIMA", slug: "shurima" },
            { name: "BILGEWATER", slug: "bilgewater" },
          ].map((r) => (
            <UniverseRegionCard
              key={r.slug}
              name={r.name}
              slug={r.slug}
              art={REGION_ART[r.slug]}
              href={`/universe/region/${r.slug}`}
            />
          ))}
        </div>
      ),
    },
    {
      name: "Long name — Bandle City",
      notes: "Two-word region name stays on one line, truncates if needed.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-56"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseRegionCard
            name="BANDLE CITY"
            slug="bandle-city"
            art={REGION_ART["bandle-city"]}
            href="/universe/region/bandle-city"
          />
        </div>
      ),
    },
  ],
};
