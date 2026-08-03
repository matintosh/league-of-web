import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchProductCard } from "./merch-product-card";
import { MerchProductGrid } from "./merch-product-grid";
import {
  MerchProductGridWithShopAllDemo,
  MerchProductGridShopAllOnlyDemo,
  MerchProductGridEmptyDemo,
} from "./merch-product-grid.demo";

/** Placeholder images from Data Dragon CDN (ddragon.leagueoflegends.com). */
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

export const merchProductGridShowcase: ShowcaseEntry = {
  slug: "merch-product-grid",
  name: "Merch Product Grid",
  area: "merch",
  description:
    "Responsive section wrapper for MerchProductCard tiles. 4 columns at lg (≥1024px), 3 at md, 2 on mobile — 20px gap at md+, 12px below. Optional section heading and 'Shop All →' link row. Empty-state paragraph when no children. Measured from merch.riotgames.com shop-all and collection pages.",
  variants: [
    {
      name: "Full 4-col grid — heading + Shop All",
      notes:
        "8 cards, 4-column layout (default), with section heading and Shop All link.",
      backgrounds: ["light"],
      render: () => <MerchProductGridWithShopAllDemo />,
    },
    {
      name: "Heading only — no Shop All",
      notes: "Heading row without the Shop All link. No callback needed.",
      backgrounds: ["light"],
      render: () => (
        <MerchProductGrid heading="League Classic">
          <MerchProductCard slug="p1" title="Riftbound Origins Deck — Jinx" imageUrl={IMGS.jinx0} price="$24.99" badge="New" />
          <MerchProductCard slug="p2" title="Arcane Vi Graphic Hoodie" imageUrl={IMGS.vi} price="$39.99" originalPrice="$59.99" badge="Sale" />
          <MerchProductCard slug="p3" title="PROJECT: Lux Collector's Art Print (18×24)" imageUrl={IMGS.lux0} price="$34.99" />
          <MerchProductCard slug="p4" title="Poro Limited Edition Plush — Season 14" imageUrl={IMGS.jinx2} price="$29.99" badge="Out of Stock" />
          <MerchProductCard slug="p5" title="Arcane Jinx & Vi Enamel Pin Set" imageUrl={IMGS.jinx1} price="$14.99" badge="New" />
          <MerchProductCard slug="p6" title="Riot Games Wordmark Essential T-Shirt" imageUrl={IMGS.ahri} price="$24.99" />
          <MerchProductCard slug="p7" title="VALORANT Agent Collection Pullover Hoodie" imageUrl={IMGS.lux1} price="$54.99" badge="Limited" />
          <MerchProductCard slug="p8" title={'Ruined Teemo 12" Collector Plush'} imageUrl={IMGS.teemo} price="$19.99" />
        </MerchProductGrid>
      ),
    },
    {
      name: "Shop All only — no heading",
      notes: "Shop All link without a section heading; right-aligned.",
      backgrounds: ["light"],
      render: () => <MerchProductGridShopAllOnlyDemo />,
    },
    {
      name: "No heading, no Shop All",
      notes: "Grid only — no heading row at all.",
      backgrounds: ["light"],
      render: () => (
        <MerchProductGrid>
          <MerchProductCard slug="p1" title="Riftbound Origins Deck — Jinx" imageUrl={IMGS.jinx0} price="$24.99" badge="New" />
          <MerchProductCard slug="p2" title="Arcane Vi Graphic Hoodie" imageUrl={IMGS.vi} price="$39.99" originalPrice="$59.99" badge="Sale" />
          <MerchProductCard slug="p3" title="PROJECT: Lux Collector's Art Print (18×24)" imageUrl={IMGS.lux0} price="$34.99" />
          <MerchProductCard slug="p4" title="Poro Limited Edition Plush — Season 14" imageUrl={IMGS.jinx2} price="$29.99" />
        </MerchProductGrid>
      ),
    },
    {
      name: "3-column override",
      notes: "columns=3: 2-col mobile, 3-col at md+. Useful for collection pages.",
      backgrounds: ["light"],
      render: () => (
        <MerchProductGrid heading="League Classic" columns={3}>
          <MerchProductCard slug="c1" title="Riftbound Origins Deck" imageUrl={IMGS.jinx0} price="$24.99" badge="New" />
          <MerchProductCard slug="c2" title="Arcane Vi Hoodie" imageUrl={IMGS.vi} price="$39.99" originalPrice="$59.99" badge="Sale" />
          <MerchProductCard slug="c3" title="PROJECT Lux Art Print" imageUrl={IMGS.lux0} price="$34.99" />
          <MerchProductCard slug="c4" title="Poro Plush Season 14" imageUrl={IMGS.jinx2} price="$29.99" badge="Out of Stock" />
          <MerchProductCard slug="c5" title="Enamel Pin Set" imageUrl={IMGS.jinx1} price="$14.99" />
          <MerchProductCard slug="c6" title="Wordmark T-Shirt" imageUrl={IMGS.ahri} price="$24.99" />
        </MerchProductGrid>
      ),
    },
    {
      name: "2-column override",
      notes: "columns=2: fixed 2-col at all breakpoints.",
      backgrounds: ["light"],
      render: () => (
        <MerchProductGrid heading="Featured" columns={2}>
          <MerchProductCard slug="f1" title="Riftbound Origins Deck" imageUrl={IMGS.jinx0} price="$24.99" badge="New" />
          <MerchProductCard slug="f2" title="Arcane Vi Hoodie" imageUrl={IMGS.vi} price="$39.99" originalPrice="$59.99" badge="Sale" />
          <MerchProductCard slug="f3" title="PROJECT Lux Art Print" imageUrl={IMGS.lux0} price="$34.99" />
          <MerchProductCard slug="f4" title="Poro Plush Season 14" imageUrl={IMGS.jinx2} price="$29.99" />
        </MerchProductGrid>
      ),
    },
    {
      name: "Empty state",
      notes: "No children passed → centered empty-state paragraph.",
      backgrounds: ["light"],
      render: () => <MerchProductGridEmptyDemo />,
    },
  ],
};
