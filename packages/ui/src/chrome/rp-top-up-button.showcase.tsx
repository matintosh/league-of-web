import type { ShowcaseEntry } from "../showcase";
import {
  RpTopUpButtonDefaultDemo,
  RpTopUpButtonRestingOnlyDemo,
  RpTopUpButtonLargeDemo,
} from "./rp-top-up-button.demo";

export const rpTopUpButtonShowcase: ShowcaseEntry = {
  slug: "rp-top-up-button",
  name: "RP Top-Up Button",
  area: "chrome",
  description:
    "The circular 'add RP' disc at the right end of the RP capsule in the current-era top bar — a 3-state (resting/hover/pressed) image state machine using the real CommunityDragon rp-top-up-nav-*.svg assets.",
  referenceImage: "client-current-home-activity-center.jpg",
  referenceNote:
    "docs/reference/client-current-home-activity-center.jpg — the gold + disc at the right of the RP row (2152), inside the currency block",
  variants: [
    {
      name: "Default (3 states)",
      notes:
        "resting/hover/pressed all wired from rpTopUpIconUrl(). Hover and press over the disc to see the state swap.",
      render: () => <RpTopUpButtonDefaultDemo />,
    },
    {
      name: "Resting only",
      notes: "Only restingSrc passed — hover/press fall back to resting (no swap).",
      render: () => <RpTopUpButtonRestingOnlyDemo />,
    },
    {
      name: "Large (28px)",
      notes: "size=28 — confirms the disc art scales with the size prop.",
      render: () => <RpTopUpButtonLargeDemo />,
    },
  ],
};
