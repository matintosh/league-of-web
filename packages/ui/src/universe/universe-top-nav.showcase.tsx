import type { ShowcaseEntry } from "../showcase";
import { UniverseTopNavDemo } from "./universe-top-nav.demo";
import { UniverseTopNavStaticDemo } from "./universe-top-nav.demo";

export const universeTopNavShowcase: ShowcaseEntry = {
  slug: "universe-top-nav",
  name: "Universe Top Nav",
  area: "universe",
  description:
    "Global top navigation bar for universe.leagueoflegends.com — ~48 px near-black bar with Riot fist, Universe wordmark, gold-spaced nav links (idle gold-2 → hover gold-1), globe locale icon, SIGN IN, and PLAY NOW hextech-blue pill.",
  referenceImage: "universe-landing.png",
  referenceNote: "docs/reference/universe-landing.png — top nav row",
  variants: [
    {
      name: "Interactive (click to change active link)",
      notes: "Stateful client demo — click any nav link to update activeKey. Hover transitions gold-2 → gold-1.",
      backgrounds: ["dark"],
      render: () => <UniverseTopNavDemo />,
    },
    {
      name: "CHAMPIONS active",
      notes: "activeKey=\"champions\" — gold-1 active link, all others idle gold-2.",
      backgrounds: ["dark"],
      render: () => <UniverseTopNavStaticDemo activeKey="champions" />,
    },
    {
      name: "MAP active (with caret)",
      notes: "Shows the MAP▾ caret indicator in the active gold-1 state.",
      backgrounds: ["dark"],
      render: () => <UniverseTopNavStaticDemo activeKey="map" />,
    },
    {
      name: "No active key",
      notes: "All nav links in idle gold-2 state — as seen on non-section pages.",
      backgrounds: ["dark"],
      render: () => <UniverseTopNavStaticDemo />,
    },
  ],
};
