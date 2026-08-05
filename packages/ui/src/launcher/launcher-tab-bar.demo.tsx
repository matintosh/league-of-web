'use client';

import { useState } from "react";
import { LauncherTabBar } from "./launcher-tab-bar";

const DEFAULT_TABS = [
  { id: "overview", label: "Overview" },
  { id: "patch-notes", label: "Patch Notes" },
  { id: "esports", label: "Esports" },
  { id: "merch", label: "Merch" },
];

/** Overview active — static display. */
export function TabBarOverviewDemo() {
  return (
    <div style={{ width: 600, backgroundColor: "var(--color-launcher-content-bg)" }}>
      <LauncherTabBar tabs={DEFAULT_TABS} activeId="overview" onTabChange={() => undefined} />
    </div>
  );
}

/** Patch Notes active — static display. */
export function TabBarPatchNotesDemo() {
  return (
    <div style={{ width: 600, backgroundColor: "var(--color-launcher-content-bg)" }}>
      <LauncherTabBar tabs={DEFAULT_TABS} activeId="patch-notes" onTabChange={() => undefined} />
    </div>
  );
}

/** Esports active — static display. */
export function TabBarEsportsDemo() {
  return (
    <div style={{ width: 600, backgroundColor: "var(--color-launcher-content-bg)" }}>
      <LauncherTabBar tabs={DEFAULT_TABS} activeId="esports" onTabChange={() => undefined} />
    </div>
  );
}

/** Merch active — static display. */
export function TabBarMerchDemo() {
  return (
    <div style={{ width: 600, backgroundColor: "var(--color-launcher-content-bg)" }}>
      <LauncherTabBar tabs={DEFAULT_TABS} activeId="merch" onTabChange={() => undefined} />
    </div>
  );
}

/** No active tab. */
export function TabBarNoActiveDemo() {
  return (
    <div style={{ width: 600, backgroundColor: "var(--color-launcher-content-bg)" }}>
      <LauncherTabBar tabs={DEFAULT_TABS} onTabChange={() => undefined} />
    </div>
  );
}

/** Interactive tab bar demo — stateful active tab switching. */
export function LauncherTabBarInteractiveDemo() {
  const [activeId, setActiveId] = useState("overview");

  return (
    <div style={{ width: 600, backgroundColor: "var(--color-launcher-content-bg)" }}>
      <LauncherTabBar
        tabs={DEFAULT_TABS}
        activeId={activeId}
        onTabChange={setActiveId}
      />
    </div>
  );
}
