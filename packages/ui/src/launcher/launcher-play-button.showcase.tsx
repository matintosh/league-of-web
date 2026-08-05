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
  referenceImage: "launcher-play-button-crop.png",
  referenceNote: "Real launcher — gold Play pill + dropdown caret (cropped from Overview): split button in lower-left of the hero area",
  description:
    "Launcher-specific two-pill button — a light gold 'Play' pill and a detached dark olive-gold caret pill (~6px gap). Caret opens a RIGHT-opening dropdown listing game modes. Selected row: red text, no bg fill. PBE: plain appended muted text. Uses --color-launcher-play-pill-*, --color-launcher-caret-pill, --color-launcher-selected-mode tokens. Distinct from the in-client PlayButton in src/chrome/.",
  variants: [
    {
      name: "Closed state",
      notes:
        "Default state: dropdown closed. Two detached pills: light warm-gold Play pill (h-52px) + dark olive-gold caret pill (~6px gap). Mixed-case 'Play' in sans font, black label.",
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
        "open=true: flat near-black dropdown panel opens to the RIGHT of the caret pill, top-aligned. 'League of Legends' selected — red text, no bg fill, no checkmark.",
      render: () => (
        <div
          className="flex items-start justify-start p-8"
          style={{ backgroundColor: "var(--color-launcher-content-bg)", minHeight: 120, minWidth: 480 }}
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
      notes: "PBE mode selected: red text on the PBE row. 'PBE' appended as plain muted text (no badge pill), whole row muted gray when not selected.",
      render: () => (
        <div
          className="flex items-start justify-start p-8"
          style={{ backgroundColor: "var(--color-launcher-content-bg)", minHeight: 120, minWidth: 480 }}
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
