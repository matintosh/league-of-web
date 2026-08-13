import type { ShowcaseEntry } from "../showcase";
import { UniverseFilterTabs } from "./universe-filter-tabs";
import { UniverseFilterTabsDemo } from "./universe-filter-tabs.demo";

const DEFAULT_FILTERS = [
  { key: "everything", label: "Everything" },
  { key: "short-stories", label: "Short Stories" },
  { key: "comics", label: "Comics" },
  { key: "videos", label: "Videos" },
  { key: "music", label: "Music" },
];

export const universeFilterTabsShowcase: ShowcaseEntry = {
  slug: "universe-filter-tabs",
  name: "Universe Filter Tabs",
  area: "universe",
  description:
    "Explore page filter + sort bar from universe.leagueoflegends.com. Left: FILTER BY label + tabs (Everything · Short Stories · Comics · Videos · Music). Active tab = near-white + short gold underline; inactive = gold-2. Right: SORT BY label + current sort value + up/down caret. font-display, letter-spaced caps, transparent over hero.",
  referenceImage: "universe-filter-tabs.png",
  referenceNote: "docs/reference/universe-filter-tabs.png — Explore filter bar detail crop",
  variants: [
    {
      name: "Everything active (default)",
      notes: "Active tab = Everything; all other tabs inactive gold-2.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-full max-w-3xl"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseFilterTabs
            filters={DEFAULT_FILTERS}
            activeFilter="everything"
            sort="Newest"
          />
        </div>
      ),
    },
    {
      name: "Short Stories active",
      notes: "Active tab = Short Stories; gold underline beneath.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-full max-w-3xl"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseFilterTabs
            filters={DEFAULT_FILTERS}
            activeFilter="short-stories"
            sort="Newest"
          />
        </div>
      ),
    },
    {
      name: "Comics active",
      notes: "Active tab = Comics.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-full max-w-3xl"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseFilterTabs
            filters={DEFAULT_FILTERS}
            activeFilter="comics"
            sort="Oldest"
          />
        </div>
      ),
    },
    {
      name: "Interactive demo",
      notes: "Stateful demo — click tabs to switch filter; toggle sort label.",
      backgrounds: ["dark"],
      render: () => <UniverseFilterTabsDemo />,
    },
  ],
};
