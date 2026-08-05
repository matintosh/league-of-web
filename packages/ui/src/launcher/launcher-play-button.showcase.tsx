/**
 * Showcase for LauncherPlayButton — server-safe (no 'use client').
 * Stateful / interactive demo lives in launcher-play-button.demo.tsx.
 */

import type { ShowcaseEntry } from "../showcase";
import { LauncherPlayButton } from "./launcher-play-button";
import { LauncherPlayButtonDemo } from "./launcher-play-button.demo";

/** Inline LoL logo placeholder SVG used in static variants. */
function LolIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="9" fill="var(--color-gold-4)" />
      <circle cx="10" cy="10" r="6" fill="none" stroke="var(--color-gold-2)" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2.5" fill="var(--color-gold-2)" />
    </svg>
  );
}

const DEMO_MODES = [
  { id: "lol", label: "League of Legends", icon: <LolIcon /> },
  { id: "lol-pbe", label: "League of Legends PBE", icon: <LolIcon />, isPbe: true },
];

export const launcherPlayButtonShowcase: ShowcaseEntry = {
  slug: "launcher-play-button",
  name: "LauncherPlayButton",
  area: "launcher",
  referenceImage: "launcher-overview.png",
  referenceNote: "Real League launcher — gold pill Play button visible bottom-left of the center content area",
  description:
    "Launcher-specific gold pill split button — main 'Play' action on the left, caret on the right opens an upward game-mode dropdown. Uses --color-launcher-* tokens for the dark dropdown and gold tokens for the pill. Distinct from the in-client PlayButton in src/chrome/.",
  variants: [
    {
      name: "Closed state",
      notes:
        "Default state: dropdown closed. Gold gradient pill with ▶ Play + ▾ caret segment. 'League of Legends' is the selected mode.",
      render: () => (
        <div
          className="flex items-end justify-start p-8"
          style={{ backgroundColor: "var(--color-launcher-content-bg)", minHeight: 120 }}
        >
          <LauncherPlayButton
            gameModes={DEMO_MODES}
            selectedModeId="lol"
            open={false}
          />
        </div>
      ),
    },
    {
      name: "Dropdown open — League of Legends selected",
      notes:
        "open=true: dark dropdown panel opens upward, lists 2 modes. 'League of Legends' selected (checkmark + divider bg).",
      render: () => (
        <div
          className="flex items-end justify-start p-8"
          style={{ backgroundColor: "var(--color-launcher-content-bg)", minHeight: 180 }}
        >
          <LauncherPlayButton
            gameModes={DEMO_MODES}
            selectedModeId="lol"
            open
          />
        </div>
      ),
    },
    {
      name: "Dropdown open — PBE selected",
      notes: "PBE mode selected: gold checkmark on the PBE row; PBE badge renders in gold.",
      render: () => (
        <div
          className="flex items-end justify-start p-8"
          style={{ backgroundColor: "var(--color-launcher-content-bg)", minHeight: 180 }}
        >
          <LauncherPlayButton
            gameModes={DEMO_MODES}
            selectedModeId="lol-pbe"
            open
          />
        </div>
      ),
    },
    {
      name: "Interactive demo",
      notes: "Fully interactive — click the caret to open/close, click a mode to select it.",
      render: () => (
        <div
          className="flex items-end justify-start p-8"
          style={{ backgroundColor: "var(--color-launcher-content-bg)", minHeight: 200 }}
        >
          <LauncherPlayButtonDemo />
        </div>
      ),
    },
  ],
};
