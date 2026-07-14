"use client";

import { useState } from "react";
import { RankPromotionOverlay } from "./rank-promotion-overlay";
import { HextechButton } from "../chrome/hextech-button";
import { tierPromotionVideoUrl } from "@low/fixtures";

// Tier pairs, resolved to CDN URLs here (fixture values live in demo/page files,
// never in the component). Each pair is one "from" (old tier) → "to" (new tier)
// celebration. See docs/reference/VIDEO-ASSETS.md, ranked/.
const PAIRS = [
  {
    key: "gold-platinum",
    label: "Promoted to Platinum",
    fromSrc: tierPromotionVideoUrl("from", "gold"),
    toSrc: tierPromotionVideoUrl("to", "platinum"),
  },
  {
    key: "diamond-master",
    label: "Promoted to Master",
    fromSrc: tierPromotionVideoUrl("from", "diamond"),
    toSrc: tierPromotionVideoUrl("to", "master"),
  },
  {
    key: "grandmaster-challenger",
    label: "Promoted to Challenger",
    fromSrc: tierPromotionVideoUrl("from", "grandmaster"),
    toSrc: tierPromotionVideoUrl("to", "challenger"),
  },
] as const;

/**
 * Replay demo: pick a tier pair to play its promotion celebration in a framed
 * stage. Each play key-remounts the overlay so the from → crossfade → to
 * sequence restarts from frame 0. A finished counter proves `onFinished` fires
 * once per run (on natural end or skip). Click the stage or press Escape to
 * skip. Under prefers-reduced-motion the overlay renders nothing and fires
 * `onFinished` immediately (the counter still increments).
 */
export function RankPromotionOverlayReplayDemo() {
  const [pair, setPair] = useState<(typeof PAIRS)[number] | null>(null);
  // Bumped on each play so the overlay fully unmounts/remounts (restarts the
  // sequence). Also part of the counter key so replays of the same pair replay.
  const [playKey, setPlayKey] = useState(0);
  const [finishedCount, setFinishedCount] = useState(0);

  function play(next: (typeof PAIRS)[number]) {
    setPair(next);
    setPlayKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="flex flex-wrap justify-center gap-2">
        {PAIRS.map((p) => (
          <HextechButton key={p.key} onClick={() => play(p)}>
            {p.label}
          </HextechButton>
        ))}
      </div>
      <p className="font-body text-xs text-grey-2">
        Plays the old-tier clip, crossfades, then the new-tier payoff; onFinished
        fires on the last frame. Click the stage or press Escape to skip.
      </p>
      <p className="font-body text-xs text-gold-2" data-testid="finished-count">
        onFinished fired: {finishedCount}
      </p>
      <div className="relative aspect-video w-[520px] overflow-hidden rounded-sm border border-gold-4 bg-hextech-black [transform:translateZ(0)]">
        {pair && (
          <RankPromotionOverlay
            key={playKey}
            fromSrc={pair.fromSrc}
            toSrc={pair.toSrc}
            tierLabel={pair.label}
            onFinished={() => {
              // Consumer owns visibility: unmount on finish, and count the fire.
              setFinishedCount((c) => c + 1);
              setPair(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
