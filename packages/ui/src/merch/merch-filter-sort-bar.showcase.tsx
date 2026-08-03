import type { ShowcaseEntry } from "../showcase";
import { MerchFilterSortBar } from "./merch-filter-sort-bar";

export const merchFilterSortBarShowcase: ShowcaseEntry = {
  slug: "merch-filter-sort-bar",
  name: "Merch Filter Sort Bar",
  area: "merch",
  description:
    "Sticky filter/sort toolbar for collection and shop-all pages. Measured from merch.riotgames.com: 52px tall, sticky top:64px (below the 64px header), --color-merch-surface background, 1px --color-merch-border bottom. Left: product count (13px muted). Center: filter chip pills (11px uppercase, 32px tall). Right: 'Sort by' label + sort select with chevron.",
  variants: [
    {
      name: "Default — no active filter, Featured sort",
      notes:
        "All filter chips in default state. Sort shows 'Featured'. Count left-aligned.",
      backgrounds: ["light"],
      render: () => (
        <MerchFilterSortBar
          productCount={24}
          filterOptions={["All", "New", "Sale", "Limited"]}
          activeFilter="All"
          activeSort="featured"
        />
      ),
    },
    {
      name: "Active filter chip — Sale selected",
      notes:
        "The 'Sale' chip is active: filled --color-merch-ink background, --color-merch-on-dark text, border transparent.",
      backgrounds: ["light"],
      render: () => (
        <MerchFilterSortBar
          productCount={8}
          filterOptions={["All", "New", "Sale", "Limited"]}
          activeFilter="Sale"
          activeSort="price-asc"
        />
      ),
    },
    {
      name: "Shop All filter options + custom sort",
      notes:
        "Shop-all uses a different filter set (All / New / Sale / Limited / Out of Stock). Sort set to Newest.",
      backgrounds: ["light"],
      render: () => (
        <MerchFilterSortBar
          productCount={48}
          filterOptions={["All", "New", "Sale", "Limited", "Out of Stock"]}
          activeFilter="New"
          activeSort="newest"
        />
      ),
    },
    {
      name: "No filter chips — count + sort only",
      notes:
        "filterOptions omitted: only result count and sort dropdown render. Spacer fills the gap.",
      backgrounds: ["light"],
      render: () => (
        <MerchFilterSortBar
          productCount={12}
          activeSort="alpha-asc"
        />
      ),
    },
    {
      name: "Single product",
      notes: "Edge case: singular 'Product' label when count is 1.",
      backgrounds: ["light"],
      render: () => (
        <MerchFilterSortBar
          productCount={1}
          filterOptions={["All", "Limited"]}
          activeFilter="Limited"
          activeSort="featured"
        />
      ),
    },
  ],
};
