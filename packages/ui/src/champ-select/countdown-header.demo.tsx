"use client";

import { useEffect, useState } from "react";
import { CountdownHeader } from "./countdown-header";

const DEMO_TOTAL = 30;

/**
 * TickingCountdownDemo — runs a live 30-second countdown with an interval.
 * Resets back to DEMO_TOTAL when it reaches 0, so it loops in the showcase.
 * Owns its interval with proper cleanup on unmount.
 */
export function TickingCountdownDemo() {
  const [remaining, setRemaining] = useState(DEMO_TOTAL);

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining((prev) => (prev <= 0 ? DEMO_TOTAL : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-hextech-black px-8 py-6 w-full max-w-lg">
      <CountdownHeader
        title="Choose Your Loadout!"
        secondsRemaining={remaining}
        totalSeconds={DEMO_TOTAL}
      />
    </div>
  );
}
