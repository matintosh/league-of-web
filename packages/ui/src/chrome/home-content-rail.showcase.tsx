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
    "Left content-link rail of the current-era LEAGUE HOME — a vertical stack of gem-bulleted featured rows (active row brighter gold + champion thumbnail) with PATCH NOTES pinned to the bottom. Rows swap the featured splash on the right.",
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
