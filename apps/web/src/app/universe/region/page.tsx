/**
 * /universe/region — Universe Regions index page.
 *
 * Ref: docs/reference/universe-live-regions.png
 *
 * Composition:
 *   - UniverseCrestDivider label="Regions"
 *   - Responsive grid of UniverseRegionCard (landscape 4:3 editorial tiles)
 *     covering all 13 canonical Runeterra regions
 *
 * Server component — no 'use client'. All fixture data supplied here.
 * Champion splashes from @low/fixtures are used as stand-in region art
 * until dedicated region artwork is available.
 */

import { UniverseCrestDivider, UniverseRegionCard } from "@low/ui";
import { championSplashUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Fixture data — all Runeterra regions with champion splash stand-ins
// ---------------------------------------------------------------------------

const REGIONS = [
  {
    name: "DEMACIA",
    slug: "demacia",
    championId: "Garen",
  },
  {
    name: "NOXUS",
    slug: "noxus",
    championId: "Darius",
  },
  {
    name: "IONIA",
    slug: "ionia",
    championId: "Irelia",
  },
  {
    name: "PILTOVER",
    slug: "piltover",
    championId: "Caitlyn",
  },
  {
    name: "ZAUN",
    slug: "zaun",
    championId: "Jinx",
  },
  {
    name: "FRELJORD",
    slug: "freljord",
    championId: "Ashe",
  },
  {
    name: "SHURIMA",
    slug: "shurima",
    championId: "Azir",
  },
  {
    name: "IXTAL",
    slug: "ixtal",
    championId: "Qiyana",
  },
  {
    name: "BILGEWATER",
    slug: "bilgewater",
    championId: "MissFortune",
  },
  {
    name: "BANDLE CITY",
    slug: "bandle-city",
    championId: "Tristana",
  },
  {
    name: "SHADOW ISLES",
    slug: "shadow-isles",
    championId: "Thresh",
  },
  {
    name: "TARGON",
    slug: "targon",
    championId: "Leona",
  },
  {
    name: "THE VOID",
    slug: "void",
    championId: "KhaZix",
  },
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RegionPage() {
  return (
    <div style={{ backgroundColor: "var(--color-universe-bg)" }}>
      {/* Section header */}
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-4">
        <UniverseCrestDivider label="Regions" />
      </div>

      {/* Region card grid — responsive: 2 cols mobile → 3 cols md → 4 cols lg */}
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
          {REGIONS.map((region) => (
            <UniverseRegionCard
              key={region.slug}
              name={region.name}
              slug={region.slug}
              art={championSplashUrl(region.championId)}
              href={`/universe/region/${region.slug}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
