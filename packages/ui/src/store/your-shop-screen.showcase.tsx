import { championSplashUrl, rpIconUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { YourShopScreen, type YourShopCard } from "./your-shop-screen";
import {
  YourShopUnrevealedDemo,
  YourShopPartialDemo,
  YourShopRevealedDemo,
} from "./your-shop-screen.demo";

// Static-card variant: all cards revealed with NO onPurchase, so each revealed
// card renders as a non-interactive <div> (not a <button>) — the static tile path
// (issue #368). Render-only, no state, so it lives inline in this server-safe
// showcase (fixture values are resolved here, never inside @low/ui).
const STATIC_CARDS: YourShopCard[] = [
  { id: "static-vi", revealed: true, artSrc: championSplashUrl("Vi", 4), discountPct: 20, originalRpPrice: 1350, rpPrice: 1080, skinName: "Neon Strike Vi" },
  { id: "static-sona", revealed: true, artSrc: championSplashUrl("Sona", 6), discountPct: 50, originalRpPrice: 1350, rpPrice: 675, skinName: "Arcade Sona" },
  { id: "static-jinx", revealed: true, artSrc: championSplashUrl("Jinx", 2), discountPct: 40, originalRpPrice: 1350, rpPrice: 810, skinName: "PROJECT: Jinx" },
  { id: "static-nidalee", revealed: true, artSrc: championSplashUrl("Nidalee", 3), discountPct: 50, originalRpPrice: 1350, rpPrice: 675, skinName: "Challenger Nidalee" },
  { id: "static-amumu", revealed: true, artSrc: championSplashUrl("Amumu", 5), discountPct: 60, originalRpPrice: 520, rpPrice: 208, skinName: "Little Knight Amumu" },
  { id: "static-annie", revealed: true, artSrc: championSplashUrl("Annie", 3), discountPct: 40, originalRpPrice: 1350, rpPrice: 810, skinName: "Goth Annie" },
];

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
    {
      name: "Static cards — onPurchase omitted (non-interactive)",
      notes:
        "All 6 cards revealed with NO onPurchase handler, so each revealed card renders as a static <div> (aria-label only) instead of a purchase <button> — the non-interactive tile path (issue #368). Same art + price band; no hover/focus affordance, no button role. onClose is also omitted so no close × shows.",
      render: () => (
        <div style={{ width: 1200, height: 560 }}>
          <YourShopScreen
            cards={STATIC_CARDS}
            expiryLabel="Offers expire October 30 at 18:00 EET"
            includesChampionNote
            rpIconSrc={rpIconUrl()}
          />
        </div>
      ),
    },
  ],
};
