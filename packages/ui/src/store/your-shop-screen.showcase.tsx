import type { ShowcaseEntry } from "../showcase";
import {
  YourShopUnrevealedDemo,
  YourShopPartialDemo,
  YourShopRevealedDemo,
} from "./your-shop-screen.demo";

export const yourShopScreenShowcase: ShowcaseEntry = {
  slug: "your-shop-screen",
  name: "YourShopScreen",
  area: "store",
  description:
    "Full-screen overlay for the personalised skin sale (2024-era). " +
    "Shows 6 discounted skin/champion offers per player. " +
    "Two states: unrevealed (mystery hexagon tiles) and revealed (tall skin-art card + dark price band). " +
    "Revealed cards are art-only in a tall narrow frame (aspect ≈ 0.40): no skin-name overlay and no " +
    "per-card button — the whole card is the purchase click target (onPurchase). Discount shows as large " +
    "gold text with a teal ▼ pointer above the struck original and final RP price. " +
    "Accessed via chest/bag icon in the top nav. Shell owns open/close and revealed state.",
  variants: [
    {
      name: "All unrevealed — mystery state",
      notes:
        "All 6 cards show mystery hexagonal tiles. Click any card to reveal it individually, or click Reveal All for all at once.",
      render: () => <YourShopUnrevealedDemo />,
    },
    {
      name: "Partially revealed — 3 revealed, 3 mystery",
      notes:
        "First 3 cards already revealed with skin art + price band; last 3 still mystery. Revealed and mystery cards share the same tall frame. Click remaining cards to reveal; click a revealed card to purchase.",
      render: () => <YourShopPartialDemo />,
    },
    {
      name: "All revealed — fully disclosed",
      notes:
        "All 6 tall art cards shown with splash art, -20% to -60% gold discount text + teal ▼ pointer, struck-through original prices, and final RP prices. No name overlay, no per-card button — clicking a card fires onPurchase.",
      render: () => <YourShopRevealedDemo />,
    },
  ],
};
