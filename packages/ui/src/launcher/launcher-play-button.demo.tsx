"use client";

/**
 * Stateful interactive demo for LauncherPlayButton.
 * Lives in a separate client component so the showcase file stays server-safe.
 */

import { useState } from "react";
import { LauncherPlayButton } from "./launcher-play-button";

/** Minimal LoL icon placeholder for the demo. */
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

/** Interactive demo: manages open/close and selectedModeId internally. */
export function LauncherPlayButtonDemo() {
  const [open, setOpen] = useState(false);
  const [selectedModeId, setSelectedModeId] = useState("lol");
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <LauncherPlayButton
        gameModes={DEMO_MODES}
        selectedModeId={selectedModeId}
        open={open}
        onPlay={() => {
          setLastAction(`▶ Play clicked — mode: ${selectedModeId}`);
          setOpen(false);
        }}
        onToggleDropdown={() => setOpen((prev) => !prev)}
        onSelectMode={(id) => {
          setSelectedModeId(id);
          setOpen(false);
          setLastAction(`Mode selected: ${id}`);
        }}
      />
      {lastAction != null && (
        <p
          className="font-body text-[11px]"
          style={{ color: "var(--color-launcher-text-muted)" }}
        >
          {lastAction}
        </p>
      )}
    </div>
  );
}
