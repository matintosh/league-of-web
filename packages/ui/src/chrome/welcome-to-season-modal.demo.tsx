"use client";

import { useState } from "react";
import { WelcomeToSeasonModal } from "./welcome-to-season-modal";
import { HextechButton } from "./hextech-button";

/**
 * Static always-open demo — contained in a transform wrapper so the fixed
 * backdrop is clipped to the showcase card boundary.
 * Width 980px × Height 580px matches ~80% of 1280×720 target viewport.
 */
export function WelcomeToSeasonModalStaticDemo() {
  return (
    <div
      className="relative overflow-hidden [transform:translateZ(0)]"
      style={{ width: 980, height: 580 }}
    >
      <WelcomeToSeasonModal
        open={true}
        season="2019"
        onStart={() => {}}
      />
    </div>
  );
}

/** Alternate season prop demo — shows "2020" in title and CTA. */
export function WelcomeToSeasonModal2020Demo() {
  return (
    <div
      className="relative overflow-hidden [transform:translateZ(0)]"
      style={{ width: 980, height: 580 }}
    >
      <WelcomeToSeasonModal
        open={true}
        season="2020"
        onStart={() => {}}
      />
    </div>
  );
}

/** Interactive demo — trigger button opens; CTA dismisses. */
export function WelcomeToSeasonModalInteractiveDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <HextechButton onClick={() => setOpen(true)}>
        Open Modal
      </HextechButton>
      <WelcomeToSeasonModal
        open={open}
        season="2019"
        onStart={() => setOpen(false)}
      />
    </div>
  );
}
