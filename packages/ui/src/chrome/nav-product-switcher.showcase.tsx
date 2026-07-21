import type { ShowcaseEntry } from "../showcase";
import {
  NavProductSwitcherReferenceDemo,
  NavProductSwitcherTftActiveDemo,
  NavProductSwitcherPillActiveDemo,
  NavProductSwitcherDisabledPillDemo,
} from "./nav-product-switcher.demo";

export const navProductSwitcherShowcase: ShowcaseEntry = {
  slug: "nav-product-switcher",
  name: "Nav Product Switcher",
  area: "chrome",
  description:
    "The current-era product / mode switcher in the top nav band's left zone (right of PLAY): LEAGUE (active, near-white, raised backing + gold down-chevron) · TFT (muted) · [R] LoR ↗ (gold pill with external-link arrow). Presentational — products in, onSelect out. Screen routing stays on the TopNavbar nav-item row (issue #403 option 2, hybrid); the Runeterra R glyph is a #386-style placeholder until an asset is sourced. External ↗ uses lorArrowUrl() when passed, else a token-filled inline fallback (#462).",
  referenceImage: "client-current-navbar-product-tabs.png",
  referenceNote:
    "docs/reference/client-current-navbar-product-tabs.png — crop of client-current-home-activity-center.jpg (1280×720). Sampled: LEAGUE rgb(253,250,241), TFT rgb(210,210,200), LoR pill fill rgb(82,67,28) / border rgb(182,165,147) / label rgb(225,206,173).",
  variants: [
    {
      name: "Reference (LEAGUE active) — chevron + LoR ↗",
      notes:
        "The reference set left→right: LEAGUE active (gold-1, raised backing + gold down-chevron over the tab), TFT muted (grey-1), [R] LoR gold pill (gold-5 fill / gold-4 border / gold-2 label) followed by the external-link ↗ (#462). Click any tab to reselect.",
      render: () => <NavProductSwitcherReferenceDemo />,
    },
    {
      name: "TFT active",
      notes: "Middle text tab selected — LEAGUE reverts to the muted grey-1 inactive state.",
      render: () => <NavProductSwitcherTftActiveDemo />,
    },
    {
      name: "LoR pill active",
      notes:
        "The gold pill in its active treatment — brighter gold-3 border and gold-1 label vs the inactive gold-4 / gold-2.",
      render: () => <NavProductSwitcherPillActiveDemo />,
    },
    {
      name: "Disabled LoR pill",
      notes:
        "Routing edge case (#403): LoR has no destination in our client, so it is marked disabled (muted, no pointer). LEAGUE and TFT stay interactive.",
      render: () => <NavProductSwitcherDisabledPillDemo />,
    },
  ],
};
