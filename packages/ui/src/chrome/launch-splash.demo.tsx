"use client";

import { useState } from "react";
import { LaunchSplash } from "./launch-splash";

/** Served path of the ident asset (see apps/web/public/media/). */
const SPLASH_SRC = "/media/riot-splash-jinx.webm";

/**
 * Interactive demo — owns splash visibility and provides a replay button.
 * Replay uses a changing `key` to fully remount LaunchSplash (re-triggering
 * autoplay + the reduced-motion check), mirroring how a hard reload relaunches
 * it in the real shell.
 */
export function LaunchSplashDemo() {
  const [playing, setPlaying] = useState(true);
  // Remount key — bumped on replay so the video element restarts from frame 0.
  const [runId, setRunId] = useState(0);

  return (
    <div className="relative h-96 w-full overflow-hidden border border-gold-5 [transform:translateZ(0)]">
      {/* Placeholder "client" underneath so you can see the reveal after fade. */}
      <div className="absolute inset-0 flex items-center justify-center bg-hextech-black">
        <span className="font-display text-sm uppercase tracking-widest text-gold-1">
          Client revealed
        </span>
      </div>

      {playing ? (
        <LaunchSplash
          key={runId}
          videoSrc={SPLASH_SRC}
          onFinished={() => setPlaying(false)}
        />
      ) : (
        <button
          type="button"
          onClick={() => {
            setRunId((n) => n + 1);
            setPlaying(true);
          }}
          className="absolute bottom-3 right-3 z-[110] cursor-pointer border border-grey-3 px-4 py-2 font-display text-xs uppercase tracking-widest text-grey-1 transition-colors duration-150 hover:border-gold-4 hover:text-gold-1"
        >
          Replay splash
        </button>
      )}
    </div>
  );
}
