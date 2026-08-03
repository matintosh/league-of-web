import type { ShowcaseEntry } from "../showcase";
import { MerchSearchBar } from "./merch-search-bar";
import { MerchSearchBarDemo } from "./merch-search-bar.demo";

export const merchSearchBarShowcase: ShowcaseEntry = {
  slug: "merch-search-bar",
  name: "Merch Search Bar",
  area: "merch",
  description:
    "Full-width search input band for the /merch/search page. Measured consistently with merch.riotgames.com: 56px tall, --color-merch-surface background, 1px --color-merch-border bottom. Left: 'Search Results' label (18px/700, uppercase). Center: text input (14px, 36px tall, focus ring = --color-merch-ink). Right: 36×36px --color-merch-red submit button with magnifier SVG.",
  variants: [
    {
      name: "Default — active query with results",
      notes:
        "query='jinx', resultCount=7. Shows the band in its typical in-use state.",
      backgrounds: ["light"],
      render: () => <MerchSearchBarDemo initialQuery="jinx" initialResultCount={7} />,
    },
    {
      name: "No results state",
      notes:
        "query='xyzzy', resultCount=0. Input still shows the entered term; results header above grid handles the zero-count message.",
      backgrounds: ["light"],
      render: () => (
        <MerchSearchBar
          query="xyzzy"
          resultCount={0}
        />
      ),
    },
    {
      name: "Empty query",
      notes:
        "query='', resultCount=0. Input shows placeholder text.",
      backgrounds: ["light"],
      render: () => (
        <MerchSearchBar
          query=""
          resultCount={0}
        />
      ),
    },
    {
      name: "Interactive demo — type and submit",
      notes:
        "Stateful demo: type a query and press Enter or the button to simulate a search.",
      backgrounds: ["light"],
      render: () => <MerchSearchBarDemo initialQuery="" initialResultCount={0} />,
    },
  ],
};
