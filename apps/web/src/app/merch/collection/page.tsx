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
 *
 * Delta #860:
 *   - Trim to exactly 4 strips (League Classic, Riftbound Vendetta, MSI 2026,
 *     Hot Choncc Summer) — Masters London + Arcane removed from real site
 *   - LOAD MORE: red fill --color-merch-red, white text, 239×50 @1280, 310×50 @390
 *   - SHOP label: Inter 14/600 gray, ls 0.28 (not riotSans red); no separator
 *   - Rotated tab visible at 390 (same matrix(0,-1,1,0)), remove horizontal overlay
 *   - Strip pitch 715px (paddingBottom 106px); prev arrow hidden at scrollLeft=0
 *   - 390 card cells 363px wide, first card x=85
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
 * Four curated collection strips matching the real /en-us/collection/ index (#860).
 * Real order: League Classic → Riftbound Vendetta → MSI 2026 → Hot Choncc Summer.
 * Masters London and Arcane removed (not present on real page).
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
          {/* H1: 48px desktop / 32px mobile single line (#827 fix).           */}
          {/* merch-collection-list-h1 class used by RESPONSIVE_STYLES in     */}
          {/* MerchCollectionList to apply the 32px mobile override.           */}
          <h1
            className="merch-collection-list-h1"
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
        {/* Collection strips — #860: 4 curated strips (real site order).     */}
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
