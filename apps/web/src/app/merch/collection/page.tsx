import { championSplashUrl } from "@low/fixtures";
import {
  MerchCategoryTile,
  MerchCategoryTileGrid,
  MerchFooter,
} from "@low/ui";
import { CollectionIndexHeader } from "./collection-index-client";

/**
 * /merch/collection — Collections index page.
 * 1:1 clone of merch.riotgames.com/en-us/collection/.
 * Server component — no interactive state needed; tile navigation uses <a> href links.
 * Merch tokens (--color-merch-*) are loaded by the /merch layout.
 */

// ---------------------------------------------------------------------------
// Fixture data — real collection names + representative splash art
// ---------------------------------------------------------------------------

interface CollectionEntry {
  slug: string;
  name: string;
  imageUrl: string;
}

/**
 * FIXTURE NOTE: Data Dragon (ddragon.leagueoflegends.com) only hosts League of
 * Legends assets — there is no Riot-hosted VALORANT or TFT CDN equivalent.
 * Non-LoL collections (VALORANT, Teamfight Tactics) therefore use thematically
 * representative LoL champion splashes as stand-ins:
 *   - VALORANT   → Jinx 0  (energy, gunslinger theme)
 *   - TFT        → Teemo 0 (tactical/cute mascot theme)
 * These are fixture placeholders only; a real implementation would source
 * per-game assets from each title's own CDN.
 */
const COLLECTIONS: CollectionEntry[] = [
  {
    slug: "league-classic",
    name: "League Classic",
    imageUrl: championSplashUrl("Ahri", 0),
  },
  {
    slug: "arcane",
    name: "Arcane",
    imageUrl: championSplashUrl("Vi", 0),
  },
  {
    slug: "valorant",
    name: "VALORANT",
    // Stand-in: Jinx (gunslinger energy) — no VALORANT CDN available via Data Dragon
    imageUrl: championSplashUrl("Jinx", 0),
  },
  {
    slug: "teamfight-tactics",
    name: "Teamfight Tactics",
    // Stand-in: Teemo (TFT mascot theme) — no TFT-specific CDN available via Data Dragon
    imageUrl: championSplashUrl("Teemo", 0),
  },
  {
    slug: "league-of-legends",
    name: "League of Legends",
    imageUrl: championSplashUrl("Lux", 0),
  },
  {
    slug: "ruination",
    name: "Ruination",
    imageUrl: championSplashUrl("Vi", 1),
  },
  {
    slug: "project",
    name: "PROJECT",
    imageUrl: championSplashUrl("Lux", 1),
  },
  {
    slug: "star-guardian",
    name: "Star Guardian",
    imageUrl: championSplashUrl("Lux", 2),
  },
  {
    slug: "spirit-blossom",
    name: "Spirit Blossom",
    imageUrl: championSplashUrl("Ahri", 1),
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/** /merch/collection — server component shell. */
export default function CollectionIndexPage() {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: "var(--color-merch-bg)",
        fontFamily: "var(--font-merch)",
      }}
    >
      <CollectionIndexHeader />

      <main className="flex-1">
        <MerchCategoryTileGrid heading="Collections">
          {COLLECTIONS.map((col, index) => (
            // The <a> is the sole interactive/focusable element.
            // CategoryTile renders as a plain presentational article (no onClick prop).
            // aria-label is intentionally omitted — the visible tile text names the link.
            <a
              key={col.slug}
              href={`/merch/collection/${col.slug}`}
              style={{ textDecoration: "none", display: "block" }}
            >
              <MerchCategoryTile
                slug={col.slug}
                name={col.name}
                imageUrl={col.imageUrl}
                // First 3 tiles (top row at lg) are LCP candidates — load eagerly.
                // Remaining tiles are below the fold and can lazy-load.
                loading={index < 3 ? "eager" : "lazy"}
              />
            </a>
          ))}
        </MerchCategoryTileGrid>
      </main>

      <MerchFooter copyrightText="Copyright Riot Games 2025" />
    </div>
  );
}
