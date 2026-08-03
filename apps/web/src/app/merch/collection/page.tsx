import { championSplashUrl, MERCH_PRODUCTS } from "@low/fixtures";
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
 * horizontal product-card row. MerchCategoryTileGrid is left intact and still
 * used by /merch/collection/[handle] (category pages).
 *
 * Heading change (#638): "All Collections", 48px, font-weight 600, uppercase,
 * --color-merch-ink. (Previous heading was "Collections", 36px/800/tracking-0.04em
 * inside MerchCategoryTileGrid — that grid remains unchanged for category pages.)
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
 * the exact asset id. We use champion splash art as representative stand-ins —
 * the same approach as existing hero/tile placeholders in this app.
 * A real integration would source the actual banner asset ids from the CMS.
 */

// ---------------------------------------------------------------------------
// Collection fixture — grouping by franchiseLabel from MERCH_PRODUCTS
// ---------------------------------------------------------------------------

/**
 * Derive named collections from the live MERCH_PRODUCTS fixture.
 * Groups: "League of Legends" and "Riftbound" (the two franchises in fixture).
 * Banner: wide landscape splash per franchise (stand-in for unavailable Sanity banners).
 */
const COLLECTIONS: MerchCollectionEntry[] = [
  {
    slug: "league-of-legends",
    name: "League of Legends",
    // Stand-in banner: Ahri splash (wide landscape, representative LoL art)
    bannerImageUrl: championSplashUrl("Ahri", 0),
    products: productsByFranchise("League of Legends"),
    href: "/merch/collection/league-of-legends",
  },
  {
    slug: "riftbound",
    name: "Riftbound",
    // Stand-in banner: Zed splash (thematically fits the Vendetta set)
    bannerImageUrl: championSplashUrl("Zed", 0),
    products: productsByFranchise("Riftbound"),
    href: "/merch/collection/riftbound",
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
        {/* Page heading — #638: "All Collections", 48px/600/uppercase/ink     */}
        {/* Real site: text-4xl equivalent ~48px, weight 600, uppercase, black */}
        {/* ------------------------------------------------------------------ */}
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1
            style={{
              fontSize: 48,
              fontWeight: 600,
              textTransform: "uppercase",
              color: "var(--color-merch-ink)",
              margin: 0,
              letterSpacing: 0,
            }}
          >
            All Collections
          </h1>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Collection strips — #637: stacked strips, one per franchise         */}
        {/* ------------------------------------------------------------------ */}
        <div className="mx-auto max-w-7xl px-6 pb-16">
          <MerchCollectionList
            collections={COLLECTIONS}
          />
        </div>
      </main>

      <MerchFooter copyrightText="Copyright Riot Games 2025" />
    </div>
  );
}
