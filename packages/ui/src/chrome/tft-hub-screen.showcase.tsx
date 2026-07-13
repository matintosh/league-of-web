import type { ShowcaseEntry } from "../showcase";
import {
  TftHubScreenDefaultDemo,
  TftHubScreenClaimableDemo,
  TftHubScreenSingleCounterDemo,
  TftHubScreenPartialPassDemo,
} from "./tft-hub-screen.demo";

export const tftHubScreenShowcase: ShowcaseEntry = {
  slug: "tft-hub-screen",
  name: "TftHubScreen",
  area: "chrome",
  description:
    "Teamfight Tactics hub — four-zone layout: Orb of Enlightenment, rank banner, weekly missions, and beta pass track.",
  variants: [
    {
      name: "Default (countdown, OR mission row, locked pass items)",
      notes: "Matches docs/reference/client-tft-hub.jpg",
      render: () => <TftHubScreenDefaultDemo />,
    },
    {
      name: "Orb claimable — READY TO CLAIM state",
      notes: "Countdown label replaced with READY TO CLAIM, CLAIM button enabled",
      render: () => <TftHubScreenClaimableDemo />,
    },
    {
      name: "Single-counter mission rows",
      notes: "All missions use a single 0/N counter pill (no OR variant)",
      render: () => <TftHubScreenSingleCounterDemo />,
    },
    {
      name: "Pass with partial progress (42/100 pts)",
      notes: "Progress bar filled proportionally; some items unlocked",
      render: () => <TftHubScreenPartialPassDemo />,
    },
  ],
};
