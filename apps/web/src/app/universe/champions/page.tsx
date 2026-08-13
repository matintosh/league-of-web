/**
 * /universe/champions — Universe Champions index page.
 *
 * Ref: docs/reference/universe-live-champions.png
 *
 * Composition:
 *   - UniverseCrestDivider label="Champions"
 *   - Sort row (decorative label + A–Z indicator)
 *   - Grid of UniverseChampionCard (tall 3:4 splash cards)
 *
 * Server component — no 'use client'. All fixture data supplied here.
 */

import { UniverseCrestDivider, UniverseChampionCard } from "@low/ui";
import { championSplashUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Fixture data — champion list with region labels
// ---------------------------------------------------------------------------

const CHAMPIONS = [
  { id: "Aatrox", name: "AATROX", region: "RUNETERRA", slug: "aatrox" },
  { id: "Ahri", name: "AHRI", region: "IONIA", slug: "ahri" },
  { id: "Akali", name: "AKALI", region: "IONIA", slug: "akali" },
  { id: "Ashe", name: "ASHE", region: "FRELJORD", slug: "ashe" },
  { id: "Caitlyn", name: "CAITLYN", region: "PILTOVER", slug: "caitlyn" },
  { id: "Darius", name: "DARIUS", region: "NOXUS", slug: "darius" },
  { id: "Ekko", name: "EKKO", region: "ZAUN", slug: "ekko" },
  { id: "Fiora", name: "FIORA", region: "DEMACIA", slug: "fiora" },
  { id: "Garen", name: "GAREN", region: "DEMACIA", slug: "garen" },
  { id: "Irelia", name: "IRELIA", region: "IONIA", slug: "irelia" },
  { id: "Jinx", name: "JINX", region: "ZAUN", slug: "jinx" },
  { id: "Kayn", name: "KAYN", region: "IONIA", slug: "kayn" },
  { id: "Lux", name: "LUX", region: "DEMACIA", slug: "lux" },
  { id: "Nasus", name: "NASUS", region: "SHURIMA", slug: "nasus" },
  { id: "Riven", name: "RIVEN", region: "NOXUS", slug: "riven" },
  { id: "Senna", name: "SENNA", region: "RUNETERRA", slug: "senna" },
  { id: "Thresh", name: "THRESH", region: "SHADOW ISLES", slug: "thresh" },
  { id: "Vi", name: "VI", region: "PILTOVER", slug: "vi" },
  { id: "Xayah", name: "XAYAH", region: "IONIA", slug: "xayah" },
  { id: "Yasuo", name: "YASUO", region: "IONIA", slug: "yasuo" },
] as const;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChampionsPage() {
  return (
    <div style={{ backgroundColor: "var(--color-universe-bg)" }}>
      {/* Section header */}
      <div className="mx-auto max-w-6xl px-6 pt-10 pb-4">
        <UniverseCrestDivider label="Champions" />

        {/* Sort row — decorative, matches ref (A–Z indicator right-aligned) */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <span
            className="text-[11px] uppercase tracking-[0.14em]"
            style={{
              color: "var(--color-gold-4)",
              fontFamily: "var(--font-body)",
            }}
          >
            SORTING BY
          </span>
          <span
            className="text-[11px] uppercase tracking-[0.14em]"
            style={{
              color: "var(--color-gold-2)",
              fontFamily: "var(--font-body)",
            }}
          >
            A – Z
          </span>
          {/* Sort caret icon */}
          <svg
            aria-hidden="true"
            width="10"
            height="14"
            viewBox="0 0 10 14"
            fill="none"
            style={{ color: "var(--color-gold-2)" }}
          >
            <path
              d="M1 5 L5 1 L9 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 9 L5 13 L9 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Champion card grid — 5 columns on large screens */}
      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {CHAMPIONS.map((champ) => (
            <UniverseChampionCard
              key={champ.id}
              name={champ.name}
              region={champ.region}
              splashUrl={championSplashUrl(champ.id)}
              href={`/universe/champion/${champ.slug}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
