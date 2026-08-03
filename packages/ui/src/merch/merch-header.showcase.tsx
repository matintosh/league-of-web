import type { ShowcaseEntry } from "../showcase";
import { MerchHeader } from "./merch-header";
import {
  MerchHeaderWithDismissDemo,
  MerchHeaderActiveCategoryDemo,
  MerchHeaderDropdownDemo,
} from "./merch-header.demo";

export const merchHeaderShowcase: ShowcaseEntry = {
  slug: "merch-header",
  name: "Merch Header",
  area: "merch",
  description:
    "Two-tier sticky header for the Riot merch store: ~80px black nav bar (Riot wordmark + fist emblem, left-aligned nav links with real dropdown menus for Categories▾ and Featured▾, right cluster with search · globe · SIGN IN · cart) plus an optional ~50px red dismissible announcement marquee strip below it. Mobile hamburger (<lg) opens a full-height nav drawer.",
  variants: [
    {
      name: "Default — two-tier with announcement",
      notes:
        "Full two-tier layout: dark nav bar + red marquee. No active category, empty cart.",
      render: () => (
        <div style={{ background: "var(--color-merch-surface)", minHeight: "160px" }}>
          <MerchHeader />
        </div>
      ),
    },
    {
      name: "Nav bar only — no announcement",
      notes: "Announcement omitted (undefined); only the ~80px nav tier renders.",
      render: () => (
        <div style={{ background: "var(--color-merch-surface)", minHeight: "120px" }}>
          <MerchHeader announcement={undefined} />
        </div>
      ),
    },
    {
      name: "Active category — Shop All",
      notes:
        "Shop All link has a red underline indicator. Cart badge shows 3 items.",
      render: () => (
        <div style={{ background: "var(--color-merch-surface)", minHeight: "160px" }}>
          <MerchHeader activeCategory="shop-all" cartCount={3} />
        </div>
      ),
    },
    {
      name: "Active category — Featured (dropdown link)",
      notes: "Featured link (has caret) is active; underline appears on dropdown links too.",
      render: () => (
        <div style={{ background: "var(--color-merch-surface)", minHeight: "160px" }}>
          <MerchHeader activeCategory="featured" />
        </div>
      ),
    },
    {
      name: "Active category — My Shop (gold link)",
      notes: "My Shop renders in --color-merch-gold; active underline is red.",
      render: () => (
        <div style={{ background: "var(--color-merch-surface)", minHeight: "160px" }}>
          <MerchHeader activeCategory="my-shop" />
        </div>
      ),
    },
    {
      name: "Cart badge overflow — 10+ items",
      notes: "Badge shows '9+' when cartCount exceeds 9.",
      render: () => (
        <div style={{ background: "var(--color-merch-surface)", minHeight: "160px" }}>
          <MerchHeader cartCount={12} activeCategory="sale" />
        </div>
      ),
    },
    {
      name: "Interactive — dismissible announcement (stateful)",
      notes:
        "Click ✕ to dismiss the announcement strip. State is held in the client demo wrapper.",
      render: () => (
        <div style={{ background: "var(--color-merch-surface)", minHeight: "160px" }}>
          <MerchHeaderWithDismissDemo />
        </div>
      ),
    },
    {
      name: "Interactive — active category toggle (stateful)",
      notes:
        "Click any nav link to make it active. Cart badge shows 3 items. Custom announcement text.",
      render: () => (
        <div style={{ background: "var(--color-merch-surface)", minHeight: "160px" }}>
          <MerchHeaderActiveCategoryDemo />
        </div>
      ),
    },
    {
      name: "Interactive — dropdown menus (stateful)",
      notes:
        "Click Categories▾ or Featured▾ to open real dropdown menus. Click a menu item to see its slug. Esc or outside-click closes the menu.",
      render: () => (
        <div style={{ background: "var(--color-merch-surface)", minHeight: "320px" }}>
          <MerchHeaderDropdownDemo />
        </div>
      ),
    },
  ],
};
