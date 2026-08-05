'use client';

import { useState } from "react";
import { LauncherRail } from "./launcher-rail";
import { LolLogo } from "./game-logos/lol-logo";
import { TftLogo } from "./game-logos/tft-logo";
import { ValorantLogo } from "./game-logos/valorant-logo";
import { TwoXkoLogo } from "./game-logos/two-xko-logo";
import { WildRiftLogo } from "./game-logos/wild-rift-logo";
import { RuneterraLogo } from "./game-logos/runeterra-logo";
import { RiotShieldLogo } from "./game-logos/riot-shield-logo";

/** Riot fist / brand icon */
function RiotFistIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4h10v2H7V4zm-1 3h12v1.5l1 2v4.5H5v-4.5l1-2V7zm2 6.5h8V11H8v2.5zm-2 2h12v1H6v-1zm1 2h10v1H7v-1z" />
    </svg>
  );
}

/** Home house icon */
function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 12L12 3l9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** All-games 2×2 grid icon */
function GamesGridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor">
      <rect x="2" y="2" width="7" height="7" rx="1" />
      <rect x="11" y="2" width="7" height="7" rx="1" />
      <rect x="2" y="11" width="7" height="7" rx="1" />
      <rect x="11" y="11" width="7" height="7" rx="1" />
    </svg>
  );
}

/**
 * Full Riot roster — 9 items matching image.png left rail.
 * Top section: Riot fist, Home, All-games grid, LoL, Valorant, Wild Rift, 2XKO, Runeterra.
 * Bottom pinned: Riot R shield.
 *
 * Rail emblems use the compact `variant="emblem"` mode at size=28 to fit the 64px rail.
 */
const ALL_ITEMS = [
  {
    id: "riot",
    label: "Riot Games",
    icon: <RiotFistIcon />,
    position: "top" as const,
  },
  {
    id: "home",
    label: "Home",
    icon: <HomeIcon />,
    position: "top" as const,
  },
  {
    id: "games",
    label: "All Games",
    icon: <GamesGridIcon />,
    position: "top" as const,
  },
  {
    id: "lol",
    label: "League of Legends",
    icon: <LolLogo size={28} variant="emblem" />,
    position: "top" as const,
  },
  {
    id: "valorant",
    label: "VALORANT",
    icon: <ValorantLogo size={28} variant="emblem" />,
    position: "top" as const,
  },
  {
    id: "wildrift",
    label: "Wild Rift",
    icon: <WildRiftLogo size={28} variant="emblem" />,
    position: "top" as const,
  },
  {
    id: "2xko",
    label: "2XKO",
    icon: <TwoXkoLogo size={28} variant="emblem" />,
    position: "top" as const,
  },
  {
    id: "tft",
    label: "Teamfight Tactics",
    icon: <TftLogo size={28} variant="emblem" />,
    position: "top" as const,
  },
  {
    id: "riot-shield",
    label: "Riot",
    icon: <RiotShieldLogo size={28} />,
    position: "bottom" as const,
  },
];

/** LoL active — static display. */
export function RailLolActiveDemo() {
  return (
    <div style={{ height: 560, width: 64, display: "flex" }}>
      <LauncherRail items={ALL_ITEMS} activeId="lol" onSelect={() => undefined} />
    </div>
  );
}

/** Home active — static display. */
export function RailHomeActiveDemo() {
  return (
    <div style={{ height: 560, width: 64, display: "flex" }}>
      <LauncherRail items={ALL_ITEMS} activeId="home" onSelect={() => undefined} />
    </div>
  );
}

/** No active item — all icons at 60% opacity. */
export function RailNoActiveDemo() {
  return (
    <div style={{ height: 560, width: 64, display: "flex" }}>
      <LauncherRail items={ALL_ITEMS} onSelect={() => undefined} />
    </div>
  );
}

/** Interactive rail demo — stateful active selection. */
export function LauncherRailInteractiveDemo() {
  const [activeId, setActiveId] = useState("lol");

  return (
    <div style={{ height: 560, width: 64, display: "flex" }}>
      <LauncherRail
        items={ALL_ITEMS}
        activeId={activeId}
        onSelect={setActiveId}
      />
    </div>
  );
}
