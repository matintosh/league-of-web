import type { ShowcaseEntry } from "../showcase";
import {
  HomeContentRailDefaultDemo,
  HomeContentRailAltActiveDemo,
  HomeContentRailNoThumbDemo,
  HomeContentRailLongLabelDemo,
} from "./home-content-rail.demo";

export const homeContentRailShowcase: ShowcaseEntry = {
  slug: "home-content-rail",
  name: "Home Content Rail",
  area: "chrome",
  description:
    "Left content-link rail of the current-era LEAGUE HOME — a vertical stack of gem-bulleted featured rows (active row brighter gold + champion thumbnail) with PATCH NOTES pinned to the bottom. Rows swap the featured splash on the right. The rail has NO background/scrim at all (#529) — it is fully transparent so the featured splash bleeds completely through; a single 1px white/50% right border (via the --color-white token) is the only divider from the splash. Per-label text-shadows keep the gold labels legible over the busy art.",
  referenceImage: "client-current-home-2025-mf.png",
  referenceNote:
    "docs/reference/client-current-home-2025-mf.png — the rail is the far-left vertical column (MVP T1 Miss Fortune active).",
  variants: [
    {
      name: "Default — MVP MF active",
      notes:
        "The 6 featured rows + pinned PATCH NOTES from the reference. Miss Fortune active, showing her champion thumbnail. Click rows to switch (interactive via useState in demo).",
      render: () => <HomeContentRailDefaultDemo />,
    },
    {
      name: "Different active",
      notes:
        "Sahn-Uzal Mordekaiser active — the thumbnail moves to his row; the previously-active row falls back to its gem bullet.",
      render: () => <HomeContentRailAltActiveDemo />,
    },
    {
      name: "No-thumbnail item active",
      notes:
        "RANKED active — it has no thumbnailSrc, so the active row keeps its gem bullet (brighter gold, no portrait).",
      render: () => <HomeContentRailNoThumbDemo />,
    },
    {
      name: "Long-label wrap",
      notes:
        "Labels without explicit line breaks wrap across multiple lines — verifies gem/thumb top-alignment and column width hold.",
      render: () => <HomeContentRailLongLabelDemo />,
    },
  ],
};
