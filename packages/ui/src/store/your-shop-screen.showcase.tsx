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
    "Two states: unrevealed (mystery hexagon tiles) and revealed (skin art + discount badge + price). " +
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
        "First 3 cards already revealed with skin art, badges and prices; last 3 still mystery. Click remaining cards to reveal.",
      render: () => <YourShopPartialDemo />,
    },
    {
      name: "All revealed — fully disclosed",
      notes:
        "All 6 skin cards shown with splash art, -20% to -60% discount badges, struck-through original prices, and final RP prices.",
      render: () => <YourShopRevealedDemo />,
    },
  ],
};
