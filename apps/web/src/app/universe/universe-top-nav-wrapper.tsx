"use client";

/**
 * UniverseTopNavWrapper — client component that wires up the UniverseTopNav
 * with routing state for the /universe layout.
 *
 * Kept separate from the layout so the layout itself stays a server component.
 * The wrapper holds activeKey state and maps nav clicks to window.location
 * pushes for the /universe sub-routes (all currently scaffolded as the same
 * landing page — routing stubs only at this stage).
 */

import { useState } from "react";
import { UniverseTopNav } from "@low/ui";
import type { UniverseNavKey } from "@low/ui";

export function UniverseTopNavWrapper() {
  const [activeKey, setActiveKey] = useState<UniverseNavKey | undefined>(
    undefined,
  );

  return (
    <UniverseTopNav
      activeKey={activeKey}
      onNavigate={(key) => setActiveKey(key)}
      onSignIn={() => {
        /* no-op — presentational */
      }}
      onPlayNow={() => {
        /* no-op — presentational */
      }}
    />
  );
}
