'use client';

import { useState } from "react";
import { LauncherRail } from "./launcher-rail";

/** Settings gear icon */
function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
      />
    </svg>
  );
}

function RiotFistIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 4h10v2H7V4zm-1 3h12v1.5l1 2v4.5H5v-4.5l1-2V7zm2 6.5h8V11H8v2.5zm-2 2h12v1H6v-1zm1 2h10v1H7v-1z" />
    </svg>
  );
}

function GameIconPlaceholder({ letter, color }: { letter: string; color: string }) {
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 6,
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-display)",
        fontSize: 14,
        fontWeight: 700,
        color: "var(--color-launcher-ink)",
      }}
    >
      {letter}
    </div>
  );
}

const ALL_ITEMS = [
  { id: "home", label: "Home", icon: <RiotFistIcon />, position: "top" as const },
  { id: "lol", label: "League of Legends", icon: <GameIconPlaceholder letter="L" color="var(--color-gold-3)" />, position: "top" as const },
  { id: "tft", label: "Teamfight Tactics", icon: <GameIconPlaceholder letter="T" color="var(--color-blue-2)" />, position: "top" as const },
  { id: "valorant", label: "Valorant", icon: <GameIconPlaceholder letter="V" color="var(--color-riot-red)" />, position: "top" as const },
  { id: "settings", label: "Settings", icon: <GearIcon />, position: "bottom" as const },
];

/** LoL active — static display. */
export function RailLolActiveDemo() {
  return (
    <div style={{ height: 400, width: 56, display: "flex" }}>
      <LauncherRail items={ALL_ITEMS} activeId="lol" onSelect={() => undefined} />
    </div>
  );
}

/** Home active — static display. */
export function RailHomeActiveDemo() {
  return (
    <div style={{ height: 400, width: 56, display: "flex" }}>
      <LauncherRail items={ALL_ITEMS} activeId="home" onSelect={() => undefined} />
    </div>
  );
}

/** No active item — all icons at 60% opacity. */
export function RailNoActiveDemo() {
  return (
    <div style={{ height: 400, width: 56, display: "flex" }}>
      <LauncherRail items={ALL_ITEMS} onSelect={() => undefined} />
    </div>
  );
}

/** Interactive rail demo — stateful active selection. */
export function LauncherRailInteractiveDemo() {
  const [activeId, setActiveId] = useState("lol");

  return (
    <div style={{ height: 400, width: 56, display: "flex" }}>
      <LauncherRail
        items={ALL_ITEMS}
        activeId={activeId}
        onSelect={setActiveId}
      />
    </div>
  );
}
