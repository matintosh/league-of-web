"use client";

import { useState } from "react";
import type { UniverseNavKey } from "./universe-top-nav";
import { UniverseTopNav } from "./universe-top-nav";

/**
 * Interactive demo — stateful wrapper that holds activeKey.
 * Used in the showcase to avoid passing function callbacks from server → client.
 */
export function UniverseTopNavDemo() {
  const [activeKey, setActiveKey] = useState<UniverseNavKey>("explore");

  return (
    <div className="w-full">
      <UniverseTopNav
        activeKey={activeKey}
        onNavigate={(key) => setActiveKey(key)}
        onSignIn={() => {}}
        onPlayNow={() => {}}
      />
      <p
        className="mt-2 text-center text-xs"
        style={{ color: "var(--color-gold-2)", fontFamily: "var(--font-body)" }}
      >
        Active: {activeKey} — click any nav link to change
      </p>
    </div>
  );
}

/**
 * Static demo — renders the nav with a fixed activeKey (or none).
 * All callbacks are no-ops held inside this client component so they
 * never cross the server/client boundary.
 */
export function UniverseTopNavStaticDemo({
  activeKey,
}: {
  activeKey?: UniverseNavKey;
}) {
  return (
    <UniverseTopNav
      activeKey={activeKey}
      onNavigate={() => {}}
      onSignIn={() => {}}
      onPlayNow={() => {}}
    />
  );
}
