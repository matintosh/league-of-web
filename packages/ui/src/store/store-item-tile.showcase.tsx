import type { ShowcaseEntry } from "../showcase";
import {
  StoreItemTileGridDemo,
  StoreItemTileStripDemo,
  StoreItemTileInsufficientDemo,
  StoreItemTileWishlistedDemo,
} from "./store-item-tile.demo";

export const storeItemTileShowcase: ShowcaseEntry = {
  slug: "store-item-tile",
  name: "Store Item Tile",
  area: "store",
  description:
    "Purchasable item tile for the Store. Two size variants: grid (230×130px, used in 2×2 featured grid) and strip (105px wide, used in TOP SELLERS row). Shows RP price, quantity badge, wishlist heart, and optional insufficient-RP warning.",
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
