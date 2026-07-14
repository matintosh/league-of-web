"use client";

import { useState } from "react";
import { FindingMatchPanel } from "./finding-match-panel";
import { gameModeMapUrl, partiesBgLoopUrl } from "@low/fixtures";

const SR_CREST = gameModeMapUrl("sr");
const QUEUE_LOOP = partiesBgLoopUrl("queue-delay");

// ---------------------------------------------------------------------------
// Static demos — 'use client' wrappers that supply the required onCancel prop.
// The showcase is server-rendered so it cannot pass function literals directly
// to a 'use client' component; all FindingMatchPanel instances live here.
// ---------------------------------------------------------------------------

/** Default — with crest + estimate (data-shot variant, matches close-up reference). */
export function FindingMatchDefaultDemo() {
  return (
    <div className="w-[200px] bg-blue-7" data-shot="finding-match-panel">
      <FindingMatchPanel
        elapsedLabel="20:03"
        estimatedLabel="Estimated: 5:02"
        crestSrc={SR_CREST}
        onCancel={() => {}}
      />
    </div>
  );
}

/**
 * With ambient "magic" loop — queue-delay-bg-loop.webm behind the panel.
 * Compare against the "Default" variant (no video) to confirm the loop is
 * additive and subtle. Hidden under prefers-reduced-motion.
 */
export function FindingMatchAmbientDemo() {
  return (
    <div className="w-[200px] bg-blue-7">
      <FindingMatchPanel
        elapsedLabel="20:03"
        estimatedLabel="Estimated: 5:02"
        crestSrc={SR_CREST}
        ambientVideoSrc={QUEUE_LOOP}
        onCancel={() => {}}
      />
    </div>
  );
}

/** Long elapsed — h:mm:ss format must not clip or wrap. */
export function FindingMatchLongElapsedDemo() {
  return (
    <div className="w-[200px] bg-blue-7">
      <FindingMatchPanel
        elapsedLabel="1:23:45"
        estimatedLabel="Estimated: 2:00"
        crestSrc={SR_CREST}
        onCancel={() => {}}
      />
    </div>
  );
}

/** No estimate — estimatedLabel omitted; estimate line is absent. */
export function FindingMatchNoEstimateDemo() {
  return (
    <div className="w-[200px] bg-blue-7">
      <FindingMatchPanel
        elapsedLabel="0:48"
        crestSrc={SR_CREST}
        onCancel={() => {}}
      />
    </div>
  );
}

/** No crest — crestSrc omitted; timer starts from left edge. */
export function FindingMatchNoCrestDemo() {
  return (
    <div className="w-[200px] bg-blue-7">
      <FindingMatchPanel
        elapsedLabel="3:14"
        estimatedLabel="Estimated: 4:30"
        onCancel={() => {}}
      />
    </div>
  );
}

/** In-rail-width context — 200px with gold-5 rail border (client-queue-in-lobby.png context). */
export function FindingMatchInRailDemo() {
  return (
    <div
      className="bg-blue-7"
      style={{ width: 200, border: "1px solid var(--color-gold-5)" }}
    >
      <FindingMatchPanel
        elapsedLabel="0:27"
        estimatedLabel="Estimated: 5:02"
        crestSrc={SR_CREST}
        onCancel={() => {}}
      />
    </div>
  );
}

/** Interactive — ✕ fires onCancel; cancelled state shown with re-queue option. */
export function FindingMatchCancelDemo() {
  const [cancelled, setCancelled] = useState(false);

  if (cancelled) {
    return (
      <div className="flex w-[200px] flex-col items-center gap-3 bg-blue-7 p-4">
        <p className="font-body text-xs text-grey-1">Queue cancelled.</p>
        <button
          type="button"
          onClick={() => setCancelled(false)}
          className="font-body text-xs text-blue-2 underline"
        >
          Re-queue
        </button>
      </div>
    );
  }

  return (
    <div className="w-[200px] bg-blue-7">
      <FindingMatchPanel
        elapsedLabel="0:27"
        estimatedLabel="Estimated: 5:02"
        crestSrc={SR_CREST}
        onCancel={() => setCancelled(true)}
      />
    </div>
  );
}
