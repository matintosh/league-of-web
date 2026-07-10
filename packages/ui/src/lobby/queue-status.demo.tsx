"use client";

import { useState, useEffect } from "react";
import { QueueStatus } from "./queue-status";

// ---------------------------------------------------------------------------
// Strip demos — interval lives here, NOT in QueueStatus
// ---------------------------------------------------------------------------

/** Live demo: starts at 0:00 and ticks every second. Cleans up on unmount. */
export function QueueStatusTickingDemo() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <QueueStatus
        elapsedSeconds={elapsed}
        estimatedSeconds={30}
        onCancel={() => setElapsed(0)}
      />
      <p className="font-body text-xs text-grey-2">
        Timer ticks in real-time. Cancel resets to 0:00.
      </p>
    </div>
  );
}

/** Static snapshot: fresh queue (3 s elapsed, 30 s estimated). */
export function QueueStatusFreshDemo() {
  return (
    <div className="p-6">
      <QueueStatus
        elapsedSeconds={3}
        estimatedSeconds={30}
        onCancel={() => {}}
      />
    </div>
  );
}

/** Static snapshot: long queue (7:42) past the estimate — elapsed turns gold-3. */
export function QueueStatusOverEstimateDemo() {
  return (
    <div className="p-6">
      <QueueStatus
        elapsedSeconds={462}
        estimatedSeconds={120}
        onCancel={() => {}}
      />
    </div>
  );
}

/** Static snapshot: no estimate provided. */
export function QueueStatusNoEstimateDemo() {
  return (
    <div className="p-6">
      <QueueStatus elapsedSeconds={15} onCancel={() => {}} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Panel demos
// ---------------------------------------------------------------------------

/** Live ticking panel demo — interval runs here, NOT in QueueStatus. */
export function QueueStatusPanelTickingDemo() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-start gap-4 p-6">
      <QueueStatus
        layout="panel"
        elapsedSeconds={elapsed}
        estimatedSeconds={180}
        onCancel={() => setElapsed(0)}
      />
      <p className="font-body text-xs text-grey-2">
        Timer ticks in real-time. Cancel resets to 0:00.
      </p>
    </div>
  );
}

/** Static panel snapshot: fresh queue (0:03, estimated 3:00). */
export function QueueStatusPanelFreshDemo() {
  return (
    <div className="p-6">
      <QueueStatus
        layout="panel"
        elapsedSeconds={3}
        estimatedSeconds={180}
        onCancel={() => {}}
      />
    </div>
  );
}

/** Static panel snapshot: over-estimate (7:42 > 2:00) — elapsed turns gold-3. */
export function QueueStatusPanelOverEstimateDemo() {
  return (
    <div className="p-6">
      <QueueStatus
        layout="panel"
        elapsedSeconds={462}
        estimatedSeconds={120}
        onCancel={() => {}}
      />
    </div>
  );
}

/** Static panel snapshot: no estimate provided. */
export function QueueStatusPanelNoEstimateDemo() {
  return (
    <div className="p-6">
      <QueueStatus layout="panel" elapsedSeconds={15} onCancel={() => {}} />
    </div>
  );
}
