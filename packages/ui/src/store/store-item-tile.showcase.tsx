import type { ShowcaseEntry } from "../showcase";
import {
  StoreItemTileGridDemo,
  StoreItemTileStripDemo,
  StoreItemTileInsufficientDemo,
  StoreItemTileWishlistedDemo,
  StoreItemTileBundleChromeDemo,
} from "./store-item-tile.demo";

export const storeItemTileShowcase: ShowcaseEntry = {
  slug: "store-item-tile",
  name: "Store Item Tile",
  area: "store",
  description:
    "Purchasable item tile for the Store. Two size variants: grid (230×130px, used in 2×2 featured grid) and strip (105px wide, used in TOP SELLERS row). Shows RP price, plain-text quantity badge, wishlist heart, bundle/pass pennant marker, right-edge sub-item glyph column, and optional insufficient-RP warning.",
  variants: [
    {
      name: "Grid — 2×2 (all states)",
      notes:
        "Four grid tiles: default skin, 10x bundle, 25x bundle with insufficient-RP warning, and pre-wishlisted skin. Click the heart icon to toggle wishlist.",
      render: () => <StoreItemTileGridDemo />,
    },
    {
      name: "Strip — Top Sellers row",
      notes:
        "Five strip tiles in a horizontal row. 105px wide × 120px tall each. Click the heart icon to wishlist.",
      render: () => <StoreItemTileStripDemo />,
    },
    {
      name: "Grid — Bundle chrome (pennant · quantity · sub-items)",
      notes:
        "Marker + column states. Left→right: pass with 2-glyph column, bundle with 10x quantity + 1 glyph, insufficient bundle with 25x + 4 glyphs (shows '+1' overflow), bundle with quantity but no column, plain skin (no pennant/quantity/column). Quantity is plain gold text (no red pill); the pennant is a dark-red notched ribbon with a clock glyph.",
      render: () => <StoreItemTileBundleChromeDemo />,
    },
    {
      name: "Grid — Insufficient RP",
      notes:
        "Single tile with insufficientRP=true — red '* Not enough RP' label appears below price.",
      render: () => <StoreItemTileInsufficientDemo />,
    },
    {
      name: "Grid — Wishlisted (toggle)",
      notes:
        "Single tile with isWishlisted=true — heart icon filled in gold. Click heart to toggle off/on.",
      render: () => <StoreItemTileWishlistedDemo />,
    },
  ],
};
