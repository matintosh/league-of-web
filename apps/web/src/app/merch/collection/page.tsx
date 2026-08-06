import { championSplashUrl, MERCH_PRODUCTS, merchAssetUrl } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import { MerchCollectionList, MerchFooter } from "@low/ui";
import type { MerchCollectionEntry } from "@low/ui";
import { CollectionIndexHeader } from "./collection-index-client";

/**
 * /merch/collection — Collections index page.
 * 1:1 clone of merch.riotgames.com/en-us/collection/.
 * Server component — layout is static; links use <a> href.
 * Merch tokens (--color-merch-*) are loaded by the /merch layout.
 *
 * Layout change (#637): replaced 3-col tile grid with stacked collection
 * strips (MerchCollectionList). Each strip: 4:1 banner + rotated name tab +
 * horizontal product-card row.
 *
 * Delta #804:
 *   - 282px portrait cards, 8px gaps
 *   - Curated tab names ("LEAGUE CLASSIC", "RIFTBOUND VENDETTA", etc.) + Shop link
 *   - 6+ strips (matches real page docHeight 4076)
 *   - LOAD MORE pill below strips
 *   - Heading rhythm: mt 60 / mb 40 (was py-10)
 *   - 390 tab overlap fixed (mobile tab above banner)
 */

// ---------------------------------------------------------------------------
// Helpers — group MERCH_PRODUCTS by franchiseLabel
// ---------------------------------------------------------------------------

/** Products that carry a specific franchise label, filtered from MERCH_PRODUCTS. */
function productsByFranchise(label: string): MerchProduct[] {
  return MERCH_PRODUCTS.filter((p) => p.franchiseLabel === label);
}

/**
 * BANNER ASSET NOTE: Real merch.riotgames.com banners are Sanity-fingerprinted
 * CDN URLs (cdn.sanity.io/images/dsfx7636/…) that are not reproducible without
 * the exact asset id. We use champion splash art and existing Sanity assets as
 * representative stand-ins. A real integration would source these from the CMS.
 */

// ---------------------------------------------------------------------------
// Collection fixture — 6 curated strips mirroring the real collection index
// ---------------------------------------------------------------------------

/**
 * Six curated collection strips derived from MERCH_PRODUCTS.
 * Tab labels match the real collection index naming conventions:
 *   "LEAGUE CLASSIC" / "RIFTBOUND VENDETTA" / "MSI 2026" / "HOT CHONCC SUMMER" / etc.
 *
 * Banner URLs: wide Sanity CDN assets where available; champion splash art for others.
 */
const COLLECTIONS: MerchCollectionEntry[] = [
  {
    slug: "league-classic",
    name: "League of Legends",
    tabLabel: "LEAGUE CLASSIC",
    /* Sanity banner — wide 3296×1030 promotional art for League Classic campaign */
    bannerImageUrl: merchAssetUrl("3dbbf5ce0d30940b0db3741cdb9d1bed12afce48-3296x1030.png", {
      w: 1280,
      dataset: "consumer_products_live",
    }),
    products: productsByFranchise("League of Legends"),
    href: "/merch/collection/league-of-legends",
  },
  {
    slug: "riftbound-vendetta",
    name: "Riftbound",
    tabLabel: "RIFTBOUND VENDETTA",
    /* Sanity banner — wide 3296×1030 Riftbound TCG campaign art */
    bannerImageUrl: merchAssetUrl("a01262bae9dcf03621b7f850c89b86535b76638a-3296x1030.jpg", {
      w: 1280,
      dataset: "consumer_products_live",
    }),
    products: productsByFranchise("Riftbound"),
    href: "/merch/collection/riftbound",
  },
  {
    slug: "msi-2026",
    name: "LoL Esports",
    tabLabel: "MSI 2026",
    /* Stand-in: Lux splash (wide, thematically esports) */
    bannerImageUrl: championSplashUrl("Lux", 6),
    products: productsByFranchise("LoL Esports"),
    href: "/merch/collection/league-of-legends",
  },
  {
    slug: "hot-choncc-summer",
    name: "Teamfight Tactics",
    tabLabel: "HOT CHONCC SUMMER",
    /* Stand-in: Lulu splash (TFT whimsical theme) */
    bannerImageUrl: championSplashUrl("Lulu", 0),
    products: productsByFranchise("Teamfight Tactics"),
    href: "/merch/collection/league-of-legends",
  },
  {
    slug: "valorant-masters-london",
    name: "VALORANT",
    tabLabel: "MASTERS LONDON",
    /* Stand-in: Vi splash (VALORANT energy) */
    bannerImageUrl: championSplashUrl("Vi", 0),
    products: productsByFranchise("VALORANT"),
    href: "/merch/collection/league-of-legends",
  },
  {
    slug: "arcane",
    name: "Arcane",
    tabLabel: "ARCANE",
    /* Stand-in: Jinx splash (Arcane protagonist) */
    bannerImageUrl: championSplashUrl("Jinx", 5),
    products: productsByFranchise("Arcane"),
    href: "/merch/collection/league-of-legends",
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
        {/* ------------------------------------------------------------------ */}
        {/* Page heading — "All Collections", 48px/600/uppercase, mt 60 mb 40 */}
        {/* Real site: ink-dark (pure black), x=40 → px-10.                  */}
        {/* ------------------------------------------------------------------ */}
        <div className="mx-auto max-w-7xl px-10">
          <h1
            style={{
              fontSize: 48,
              fontWeight: 600,
              textTransform: "uppercase",
              /* ink-dark = pure black, matching real site */
              color: "var(--color-merch-ink-dark)",
              margin: 0,
              letterSpacing: 0,
              lineHeight: 1.08,
              marginTop: 60,
              marginBottom: 40,
            }}
          >
            All Collections
          </h1>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Collection strips — #804: 6 curated strips                         */}
        {/* px-10 keeps container x=40 at 1280 (matching card inset math).    */}
        {/* ------------------------------------------------------------------ */}
        <div className="mx-auto max-w-7xl px-10 pb-0">
          <MerchCollectionList
            collections={COLLECTIONS}
            showLoadMore
          />
        </div>
      </main>

      <MerchFooter copyrightText="Copyright Riot Games 2025" />
    </div>
  );
}
