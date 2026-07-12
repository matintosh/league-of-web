import type { ShowcaseEntry } from "../showcase";
import {
  RankedQueuePanelAllUnrankedDemo,
  RankedQueuePanelMixedDemo,
  RankedQueuePanelThreeQueuesDemo,
  RankedQueuePanelGrandmasterDemo,
} from "./ranked-queue-panel.demo";

export const rankedQueuePanelShowcase: ShowcaseEntry = {
  slug: "ranked-queue-panel",
  name: "Ranked Queue Panel",
  area: "chrome",
  description:
    "Bordered panel (gold-5 hairline frame) with 3 ranked queue cells + Last Season cell, separated by vertical hairlines. Unranked queues show a dimmed/greyscale mini-crest. Crest URLs resolved by caller's `crestSrcFor` prop — component stays fixture-value-free.",
  variants: [
    {
      name: "All unranked (reference state)",
      notes: "All 4 queues unranked — crests dimmed (opacity-25 + grayscale). Matches the reference screenshot.",
      render: () => <RankedQueuePanelAllUnrankedDemo />,
    },
    {
      name: "Mixed — some ranked, last season Gold",
      notes: "Flex 3v3 Silver II, Solo/Duo Gold I, Flex 5v5 unranked, Last Season Gold emblem.",
      render: () => <RankedQueuePanelMixedDemo />,
    },
    {
      name: "Three queues only (no last-season cell)",
      notes: "Renders without the Last Season cell — flexible queues array length.",
      render: () => <RankedQueuePanelThreeQueuesDemo />,
    },
    {
      name: "All ranked — Grandmaster / Master / Diamond",
      notes: "Fully ranked profile. Last Season uses rankedEmblemUrl (full-size shield PNG).",
      render: () => <RankedQueuePanelGrandmasterDemo />,
    },
  ],
};
