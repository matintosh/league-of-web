import { championSplashUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { MerchProductCard } from "./merch-product-card";
import { MerchProductGrid } from "./merch-product-grid";
import {
  MerchProductGrid2ColDemo,
  MerchProductGrid2ColWithHeadingDemo,
  MerchProductGrid2ColEmptyDemo,
  MerchProductGridWithShopAllDemo,
  MerchProductGridShopAllOnlyDemo,
  MerchProductGridEmptyDemo,
  MerchProductGridBrandRailDemo,
  MerchProductGridBrandRailFilterDemo,
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
    "Responsive section wrapper for MerchProductCard tiles. The default (columns=2) is the real 2-col flush listing from merch.riotgames.com/en-us/shop-all/: gap-0, cards share 1px border dividers, REFINE button top-right (red, sliders icon), result count in header. Also supports brand-rail (homepage vertical label + filter chips) and legacy heading+Shop All modes. Mobile: 2-col at all widths; no horizontal overflow at 390px.",
  variants: [
    {
      name: "2-col flush listing — real shop-all / collection design",
      notes:
        "Real 2-col layout (columns=2): 8 cards, gap-0, border dividers, REFINE button + result count. Matches merch.riotgames.com at 1280px.",
      backgrounds: ["light"],
      render: () => <MerchProductGrid2ColDemo />,
    },
    {
      name: "2-col listing — heading + result count + REFINE",
      notes:
        "Optional heading prop alongside result count — useful for collection pages with a named category.",
      backgrounds: ["light"],
      render: () => <MerchProductGrid2ColWithHeadingDemo />,
    },
    {
      name: "2-col listing — empty state",
      notes: "No children → empty message; REFINE button still shown.",
      backgrounds: ["light"],
      render: () => <MerchProductGrid2ColEmptyDemo />,
    },
    {
      name: "Brand-rail — League of Legends collection grid",
      notes:
        "Homepage model: left vertical 'LEAGUE OF LEGENDS' label + full product grid. Matches the real store's homepage body layout.",
      backgrounds: ["light"],
      render: () => <MerchProductGridBrandRailDemo />,
    },
    {
      name: "Brand-rail + filter badges (New / Limited Edition / Preorder)",
      notes:
        "Brand-rail with top-right filter chip row. Active badge has ink background.",
      backgrounds: ["light"],
      render: () => <MerchProductGridBrandRailFilterDemo />,
    },
    {
      name: "Full 4-col grid — heading + Shop All",
      notes:
        "Legacy model: 8 cards, 4-column layout (default), with section heading and Shop All link.",
      backgrounds: ["light"],
      render: () => <MerchProductGridWithShopAllDemo />,
    },
    {
      name: "Heading only — no Shop All",
      notes: "Heading row without the Shop All link. No callback needed.",
      backgrounds: ["light"],
      render: () => (
        <MerchProductGrid heading="League Classic">
          <MerchProductCard slug="p1" title="Riftbound Origins Deck — Jinx" imageUrl={IMGS.jinx0} price="$24.99" badges={["New"]} franchiseLabel="Riftbound" />
          <MerchProductCard slug="p2" title="Arcane Vi Graphic Hoodie" imageUrl={IMGS.vi} price="$39.99" originalPrice="$59.99" badges={["Sale"]} franchiseLabel="Arcane" />
          <MerchProductCard slug="p3" title="PROJECT: Lux Collector's Art Print (18×24)" imageUrl={IMGS.lux0} price="$34.99" />
          <MerchProductCard slug="p4" title="Poro Limited Edition Plush — Season 14" imageUrl={IMGS.jinx2} price="$29.99" badges={["Out of Stock"]} franchiseLabel="League of Legends" />
          <MerchProductCard slug="p5" title="Arcane Jinx & Vi Enamel Pin Set" imageUrl={IMGS.jinx1} price="$14.99" badges={["New"]} franchiseLabel="Arcane" />
          <MerchProductCard slug="p6" title="Riot Games Wordmark Essential T-Shirt" imageUrl={IMGS.ahri} price="$24.99" />
          <MerchProductCard slug="p7" title="VALORANT Agent Collection Pullover Hoodie" imageUrl={IMGS.lux1} price="$54.99" badges={["Limited Edition"]} franchiseLabel="Valorant" />
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
      name: "3-column override",
      notes: "columns=3: 2-col mobile, 3-col at md+. Useful for collection pages.",
      backgrounds: ["light"],
      render: () => (
        <MerchProductGrid heading="League Classic" columns={3}>
          <MerchProductCard slug="c1" title="Riftbound Origins Deck" imageUrl={IMGS.jinx0} price="$24.99" badges={["New"]} franchiseLabel="Riftbound" />
          <MerchProductCard slug="c2" title="Arcane Vi Hoodie" imageUrl={IMGS.vi} price="$39.99" originalPrice="$59.99" badges={["Sale"]} franchiseLabel="Arcane" />
          <MerchProductCard slug="c3" title="PROJECT Lux Art Print" imageUrl={IMGS.lux0} price="$34.99" />
          <MerchProductCard slug="c4" title="Poro Plush Season 14" imageUrl={IMGS.jinx2} price="$29.99" badges={["Out of Stock"]} franchiseLabel="League of Legends" />
          <MerchProductCard slug="c5" title="Enamel Pin Set" imageUrl={IMGS.jinx1} price="$14.99" />
          <MerchProductCard slug="c6" title="Wordmark T-Shirt" imageUrl={IMGS.ahri} price="$24.99" />
        </MerchProductGrid>
      ),
    },
    {
      name: "Legacy empty state",
      notes: "No children passed → centered empty-state paragraph (legacy layout).",
      backgrounds: ["light"],
      render: () => <MerchProductGridEmptyDemo />,
    },
  ],
};
