"use client";

import { useState, useEffect } from "react";
import { QueueStatus } from "./queue-status";

// ---------------------------------------------------------------------------
// Ticking demo — interval lives here, NOT in QueueStatus
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
