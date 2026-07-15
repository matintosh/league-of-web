"use client";

import { useState } from "react";
import type { SocialAction } from "./social-header";
import { SocialHeader } from "./social-header";

/**
 * Interactive demo that logs which action button was last clicked.
 * Demonstrates onAction callback wiring.
 */
export function SocialHeaderActionLogDemo() {
  const [last, setLast] = useState<SocialAction | null>(null);

  return (
    <div className="w-64 bg-blue-7">
      <SocialHeader onAction={setLast} />
      {last !== null && (
        <p className="px-3 py-1 font-body text-xs text-grey-1">
          Last action: <span className="text-gold-2">{last}</span>
        </p>
      )}
    </div>
  );
}

/**
 * Demo of the collapse chevron affordance (#401). Wiring onToggleCollapse
 * renders the leading « button; clicking it here logs the collapse intent.
 */
export function SocialHeaderCollapseDemo() {
  const [collapsedCount, setCollapsedCount] = useState(0);

  return (
    <div className="w-64 bg-blue-7">
      <SocialHeader onToggleCollapse={() => setCollapsedCount((n) => n + 1)} />
      <p className="px-3 py-1 font-body text-xs text-grey-1">
        Collapse clicked: <span className="text-gold-2">{collapsedCount}</span>
      </p>
    </div>
  );
}
