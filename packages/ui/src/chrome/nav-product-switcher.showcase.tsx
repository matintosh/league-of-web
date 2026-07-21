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
    "The current-era product / mode switcher in the top nav band's left zone (right of PLAY): LEAGUE (active, near-white, in a FULL-HEIGHT darker gradient cell with the gold down-chevron notching over its top) · TFT (muted) · [R] LoR ↗ (gold pill with external-link arrow). The active cell (#529, deepened from #523) is a strong vertical gradient — a translucent hextech-black wash spanning the whole band height, ~80% opaque at the top (under the chevron) easing to ~48% mid, then a gold-4 accent at the very bottom — so the selected tab reads as an OBVIOUSLY darker recessed cell vs the plain TFT tab; inactive tabs are text only. Presentational — products in, onSelect out. Screen routing stays on the TopNavbar nav-item row (issue #403 option 2, hybrid); the Runeterra R glyph is a #386-style placeholder until an asset is sourced. External ↗ uses lorArrowUrl() when passed, else a token-filled inline fallback (#462). (The cell only spans the true band height in-app, where the switcher stretches to the nav's h-22; on the showcase's flat surface it reads as a shorter panel.)",
  referenceImage: "client-current-navbar-product-tabs.png",
  referenceNote:
    "docs/reference/client-current-navbar-product-tabs.png — crop of client-current-home-activity-center.jpg (1280×720). Sampled: LEAGUE rgb(253,250,241), TFT rgb(210,210,200), LoR pill fill rgb(82,67,28) / border rgb(182,165,147) / label rgb(225,206,173).",
  variants: [
    {
      name: "Reference (LEAGUE active) — full-height cell + LoR ↗",
      notes:
        "The reference set left→right: LEAGUE active (gold-1, in a full-height clearly-darker gradient cell — #529 deepened it so the selected state is obvious — with the gold down-chevron notching over its top), TFT muted (grey-1), [R] LoR gold pill (gold-5 fill / gold-4 border / gold-2 label) followed by the external-link ↗ (#462). Click any tab to reselect.",
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
