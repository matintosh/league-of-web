import { championSplashUrl } from "@low/fixtures";
import {
  MerchHeader,
  MerchCategoryTile,
  MerchCategoryTileGrid,
  MerchFooter,
} from "@low/ui";

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
    imageUrl: championSplashUrl("Jinx", 0),
  },
  {
    slug: "teamfight-tactics",
    name: "Teamfight Tactics",
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
      <MerchHeader activeCategory="collection" />

      <main className="flex-1">
        <MerchCategoryTileGrid heading="Collections">
          {COLLECTIONS.map((col) => (
            <a
              key={col.slug}
              href={`/merch/collection/${col.slug}`}
              style={{ textDecoration: "none", display: "block" }}
              aria-label={col.name}
            >
              <MerchCategoryTile
                slug={col.slug}
                name={col.name}
                imageUrl={col.imageUrl}
              />
            </a>
          ))}
        </MerchCategoryTileGrid>
      </main>

      <MerchFooter copyrightText="Copyright Riot Games 2025" />
    </div>
  );
}
