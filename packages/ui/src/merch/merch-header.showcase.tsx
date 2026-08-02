import type { ShowcaseEntry } from "../showcase";
import { MerchHeader } from "./merch-header";

export const merchHeaderShowcase: ShowcaseEntry = {
  slug: "merch-header",
  name: "Merch Header",
  area: "merch",
  description:
    "Sticky top navigation bar for the Riot merch store: Riot wordmark (left), category nav links (center), search + cart + account icons (right). Dark near-black background matching merch.riotgames.com. Cart badge renders when cartCount > 0.",
  variants: [
    {
      name: "Default — no active category, empty cart",
      notes: "Base state: all links white, no badge on cart icon.",
      render: () => (
        <div style={{ background: "var(--color-merch-surface)", minHeight: "120px" }}>
          <MerchHeader />
        </div>
      ),
    },
    {
      name: "Active category — Apparel",
      notes: "Active category link shows red color + underline.",
      render: () => (
        <div style={{ background: "var(--color-merch-surface)", minHeight: "120px" }}>
          <MerchHeader activeCategory="apparel" />
        </div>
      ),
    },
    {
      name: "Cart badge — 3 items",
      notes: "Cart icon shows red count badge when cartCount > 0.",
      render: () => (
        <div style={{ background: "var(--color-merch-surface)", minHeight: "120px" }}>
          <MerchHeader cartCount={3} />
        </div>
      ),
    },
    {
      name: "Cart badge overflow — 10+ items",
      notes: "Badge shows 9+ when count exceeds 9.",
      render: () => (
        <div style={{ background: "var(--color-merch-surface)", minHeight: "120px" }}>
          <MerchHeader cartCount={12} activeCategory="sale" />
        </div>
      ),
    },
  ],
};
