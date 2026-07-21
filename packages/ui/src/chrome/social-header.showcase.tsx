import { friendFinderImageUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { SocialHeader } from "./social-header";
import {
  SocialHeaderActionLogDemo,
  SocialHeaderCollapseDemo,
} from "./social-header.demo";

/** Real-client add-friend mask glyph, patch-7.5 pinned (#434). */
const ADD_ICON_SRC = friendFinderImageUrl("add_person_mask");

export const socialHeaderShowcase: ShowcaseEntry = {
  slug: "social-header",
  name: "SocialHeader",
  area: "chrome",
  description:
    'Top strip of the social sidebar — "SOCIAL" label (font-display xs uppercase grey-1) on the left and four icon buttons (add friend, groups, list, search) on the right.',
  variants: [
    {
      name: "Default (real add-friend glyph)",
      notes:
        'Shows the "SOCIAL" label and all four 16px icon buttons. The add-friend button uses the real-client `add_person_mask` glyph (#434) via `addIconSrc={friendFinderImageUrl("add_person_mask")}` — the authentic filled person-bust + `+` silhouette, tinted through CSS mask-image so it keeps the grey-1 → gold-1 hover. Hover any button to see the transition. data-shot target for visual verification.',
      render: () => (
        <div data-shot="social-header" className="w-64 bg-blue-7">
          <SocialHeader addIconSrc={ADD_ICON_SRC} />
        </div>
      ),
    },
    {
      name: "SVG fallback (no addIconSrc)",
      notes:
        "Omit `addIconSrc` and the add-friend button falls back to the hand-drawn outline SVG (unchanged behaviour for consumers that don't supply the mask URL). Compare the outline here against the filled raster glyph in the variant above.",
      render: () => (
        <div className="w-64 bg-blue-7">
          <SocialHeader />
        </div>
      ),
    },
    {
      name: "With action logging",
      notes:
        "Click any icon button — the last fired action key is shown below. Demonstrates onAction callback wiring.",
      render: () => <SocialHeaderActionLogDemo />,
    },
    {
      name: "With collapse toggle",
      notes:
        'onToggleCollapse supplied — a leading « chevron renders before the "SOCIAL" label. This is where the social-rail collapse toggle folds into the header (#401); the reference has no beside-chip toggle. Omit onToggleCollapse and the chevron is absent (default variant above). Click it to increment the collapse counter.',
      render: () => <SocialHeaderCollapseDemo />,
    },
  ],
};
