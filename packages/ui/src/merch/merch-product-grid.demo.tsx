"use client";

/**
 * MerchProductGridDemo — client-side showcase demos for MerchProductGrid.
 * Extracted from the showcase file so the showcase stays server-safe.
 */

import { championSplashUrl } from "@low/fixtures";
import { MerchProductCard } from "./merch-product-card";
import { MerchProductGrid } from "./merch-product-grid";

const IMGS = {
  jinx0: championSplashUrl("Jinx", 0),
  jinx1: championSplashUrl("Jinx", 1),
  jinx2: championSplashUrl("Jinx", 2),
  vi:    championSplashUrl("Vi", 0),
  lux0:  championSplashUrl("Lux", 0),
  lux1:  championSplashUrl("Lux", 1),
  ahri:  championSplashUrl("Ahri", 0),
  teemo: championSplashUrl("Teemo", 0),
};

function EightCards() {
  return (
    <>
      <MerchProductCard slug="p1" title="Riftbound Origins Deck — Jinx" imageUrl={IMGS.jinx0} price="$24.99" badge="New" />
      <MerchProductCard slug="p2" title="Arcane Vi Graphic Hoodie" imageUrl={IMGS.vi} price="$39.99" originalPrice="$59.99" badge="Sale" />
      <MerchProductCard slug="p3" title="PROJECT: Lux Collector's Art Print (18×24)" imageUrl={IMGS.lux0} price="$34.99" />
      <MerchProductCard slug="p4" title="Poro Limited Edition Plush — Season 14" imageUrl={IMGS.jinx2} price="$29.99" badge="Out of Stock" />
      <MerchProductCard slug="p5" title="Arcane Jinx & Vi Enamel Pin Set" imageUrl={IMGS.jinx1} price="$14.99" badge="New" />
      <MerchProductCard slug="p6" title="Riot Games Wordmark Essential T-Shirt" imageUrl={IMGS.ahri} price="$24.99" />
      <MerchProductCard slug="p7" title="VALORANT Agent Collection Pullover Hoodie" imageUrl={IMGS.lux1} price="$54.99" badge="Limited" />
      <MerchProductCard slug="p8" title={'Ruined Teemo 12" Collector Plush'} imageUrl={IMGS.teemo} price="$19.99" />
    </>
  );
}

/** Full 4-col grid with heading and Shop All callback. */
export function MerchProductGridWithShopAllDemo() {
  return (
    <MerchProductGrid heading="New Arrivals" onShopAll={() => {}}>
      <EightCards />
    </MerchProductGrid>
  );
}

/** Grid with Shop All only (no heading). */
export function MerchProductGridShopAllOnlyDemo() {
  return (
    <MerchProductGrid onShopAll={() => {}}>
      <EightCards />
    </MerchProductGrid>
  );
}

/** Empty state with Shop All callback. */
export function MerchProductGridEmptyDemo() {
  return (
    <MerchProductGrid
      heading="Sale Items"
      onShopAll={() => {}}
      emptyMessage="No products are currently on sale. Check back soon!"
    />
  );
}
