'use client';

import { useState } from "react";
import { LauncherTabBar } from "./launcher-tab-bar";

const DEFAULT_TABS = [
  { id: "overview", label: "Overview" },
  { id: "patch-notes", label: "Patch Notes", showBadge: true },
  { id: "esports", label: "Esports" },
  { id: "merch", label: "Merch" },
];

/** Wrapper that mimics the dark hero surface the pill floats over. */
function PillWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: 600,
        height: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-launcher-content-bg)",
        borderRadius: 8,
      }}
    >
      {children}
    </div>
  );
}

/** Overview active — static display. */
export function TabBarOverviewDemo() {
  return (
    <PillWrapper>
      <LauncherTabBar tabs={DEFAULT_TABS} activeId="overview" onTabChange={() => undefined} />
    </PillWrapper>
  );
}

/** Patch Notes active — static display. */
export function TabBarPatchNotesDemo() {
  return (
    <PillWrapper>
      <LauncherTabBar tabs={DEFAULT_TABS} activeId="patch-notes" onTabChange={() => undefined} />
    </PillWrapper>
  );
}

/** Esports active — static display. */
export function TabBarEsportsDemo() {
  return (
    <PillWrapper>
      <LauncherTabBar tabs={DEFAULT_TABS} activeId="esports" onTabChange={() => undefined} />
    </PillWrapper>
  );
}

/** Merch active — static display. */
export function TabBarMerchDemo() {
  return (
    <PillWrapper>
      <LauncherTabBar tabs={DEFAULT_TABS} activeId="merch" onTabChange={() => undefined} />
    </PillWrapper>
  );
}

/** No active tab. */
export function TabBarNoActiveDemo() {
  return (
    <PillWrapper>
      <LauncherTabBar tabs={DEFAULT_TABS} onTabChange={() => undefined} />
    </PillWrapper>
  );
}

/** Interactive tab bar demo — stateful active tab switching. */
export function LauncherTabBarInteractiveDemo() {
  const [activeId, setActiveId] = useState("overview");

  return (
    <PillWrapper>
      <LauncherTabBar
        tabs={DEFAULT_TABS}
        activeId={activeId}
        onTabChange={setActiveId}
      />
    </PillWrapper>
  );
}
