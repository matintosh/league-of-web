"use client";

import { useState, useEffect } from "react";
import { MatchFoundModal } from "./match-found-modal";
import { HextechButton } from "../chrome/hextech-button";

const TOTAL = 10;

// ---------------------------------------------------------------------------
// Static showcase wrappers — handlers live in 'use client' scope
// ---------------------------------------------------------------------------

/** Static variant: full countdown (10 s) — countdown in text-blue-2. */
export function MatchFoundModalFullCountdownDemo() {
  return (
    <div className="relative overflow-hidden [transform:translateZ(0)] h-80">
      <MatchFoundModal
        open={true}
        secondsRemaining={10}
        totalSeconds={10}
        onAccept={() => {}}
        onDecline={() => {}}
      />
    </div>
  );
}

/** Static variant: nearly expired (2 s) — countdown turns text-gold-3. */
export function MatchFoundModalNearlyExpiredDemo() {
  return (
    <div className="relative overflow-hidden [transform:translateZ(0)] h-80">
      <MatchFoundModal
        open={true}
        secondsRemaining={2}
        totalSeconds={10}
        onAccept={() => {}}
        onDecline={() => {}}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Interactive ticking demo
// ---------------------------------------------------------------------------

/** Interactive demo: click "Find Match" to open the modal with a live countdown. */
export function MatchFoundModalDemo() {
  const [open, setOpen] = useState(false);
  const [seconds, setSeconds] = useState(TOTAL);

  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(id);
          setOpen(false);
          return TOTAL; // reset for next open
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [open]);

  function handleOpen() {
    setSeconds(TOTAL);
    setOpen(true);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <HextechButton onClick={handleOpen} disabled={open}>
        Find Match
      </HextechButton>
      <p className="font-body text-xs text-grey-2">
        Click to open. Countdown ticks; auto-declines at 0.
      </p>
      <MatchFoundModal
        open={open}
        secondsRemaining={seconds}
        totalSeconds={TOTAL}
        onAccept={() => { setOpen(false); setSeconds(TOTAL); }}
        onDecline={() => { setOpen(false); setSeconds(TOTAL); }}
      />
    </div>
  );
}
