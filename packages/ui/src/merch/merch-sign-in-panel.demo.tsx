"use client";

/**
 * MerchSignInPanelDemo — stateful interactive demo for the showcase.
 * Lives here (client component) so the showcase file stays server-safe.
 */

import { useState } from "react";
import { MerchSignInPanel } from "./merch-sign-in-panel";

export function MerchSignInPanelDemo() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div style={{ padding: "48px 24px", backgroundColor: "var(--color-merch-bg)" }}>
      <MerchSignInPanel
        onSignIn={() => setLastAction("onSignIn fired")}
        onTrackOrder={() => setLastAction("onTrackOrder fired")}
        onTerms={() => setLastAction("onTerms fired")}
        onPrivacy={() => setLastAction("onPrivacy fired")}
      />
      {lastAction && (
        <p
          className="mt-4 text-center text-xs"
          style={{ color: "var(--color-merch-muted)", fontFamily: "var(--font-merch)" }}
        >
          {lastAction}
        </p>
      )}
    </div>
  );
}
