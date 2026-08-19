"use client";

import { useState } from "react";
import { HonorCheckpointOverlay } from "./honor-checkpoint-overlay";
import type { HonorCheckpointCrestVideo } from "./honor-checkpoint-overlay";
import { HextechButton } from "../chrome/hextech-button";
import {
  honorCheckpointVideoUrl,
  honorLevelUpVideoUrl,
  honorUnlockVideoUrl,
  honorTransitionVideoUrl,
} from "@low/fixtures";

// Celebration variants, resolved to CDN URLs here (fixture values live in
// demo/page files, never in the component). Each is one intro → loop → outro
// crest sequence. See docs/reference/VIDEO-ASSETS.md, honor/celebration/.
type Variant = {
  key: string;
  label: string;
  title: string;
  subtitle: string;
  crestVideo: HonorCheckpointCrestVideo;
  backdropVideo?: string;
};

const VARIANTS: Variant[] = [
  {
    key: "checkpoint",
    label: "Checkpoint reached",
    title: "CHECKPOINT REACHED",
    subtitle: "You've reached the last checkpoint before Honor level 3",
    crestVideo: {
      intro: honorCheckpointVideoUrl("intro", "3-3"),
      loop: honorCheckpointVideoUrl("loop", "3-3"),
      outro: honorCheckpointVideoUrl("outro", 3),
    },
    backdropVideo: honorTransitionVideoUrl(),
  },
  {
    key: "levelup",
    label: "Honor level up",
    title: "HONOR LEVEL UP",
    subtitle: "You've reached Honor level 4",
    crestVideo: {
      intro: honorLevelUpVideoUrl("intro", 4),
      loop: honorLevelUpVideoUrl("loop", 4),
    },
  },
  {
    key: "unlock",
    label: "Honor unlocked",
    title: "HONOR UNLOCKED",
    subtitle: "Your Honor has been restored — rewards are available again",
    crestVideo: {
      intro: honorUnlockVideoUrl(2),
    },
  },
];

/**
 * Replay demo: pick a celebration to play its overlay in a framed stage. Each
 * play key-remounts the overlay so the intro → loop sequence restarts from frame
 * 0. A finished counter proves `onFinished` fires once per run (on OK, backdrop
 * click, or Escape — the fade starts immediately, the outro clip if any plays
 * underneath). Under prefers-reduced-motion
 * the overlay still renders in full (static crest + gradient) and waits for an
 * explicit dismiss — it never auto-closes.
 */
export function HonorCheckpointOverlayReplayDemo() {
  const [variant, setVariant] = useState<Variant | null>(null);
  // Bumped on each play so the overlay fully unmounts/remounts (restarts the
  // sequence). Also part of the counter proof so replays of the same variant replay.
  const [playKey, setPlayKey] = useState(0);
  const [finishedCount, setFinishedCount] = useState(0);

  function play(next: Variant) {
    setVariant(next);
    setPlayKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="flex flex-wrap justify-center gap-2">
        {VARIANTS.map((v) => (
          <HextechButton key={v.key} onClick={() => play(v)}>
            {v.label}
          </HextechButton>
        ))}
      </div>
      <p className="font-body text-xs text-grey-2">
        Plays the crest intro, idles on the loop, then on dismiss the fade starts
        immediately (the outro, if any, plays underneath). Click OK, click the
        backdrop, or press Escape to finish.
      </p>
      <p className="font-body text-xs text-gold-2" data-testid="finished-count">
        onFinished fired: {finishedCount}
      </p>
      <div className="relative aspect-video w-[560px] overflow-hidden rounded-sm border border-gold-4 bg-hextech-black [transform:translateZ(0)]">
        {variant && (
          <HonorCheckpointOverlay
            key={playKey}
            title={variant.title}
            subtitle={variant.subtitle}
            crestVideo={variant.crestVideo}
            backdropVideo={variant.backdropVideo}
            ariaLabel={variant.title}
            onFinished={() => {
              // Consumer owns visibility: unmount on finish, and count the fire.
              setFinishedCount((c) => c + 1);
              setVariant(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Static preview: mounts one overlay variant persistently in a framed stage
 * (`translateZ(0)` establishes a containing block so the overlay's `fixed`
 * positioning is clipped to the frame). Titles/subtitles are the three
 * celebration surfaces; `crestVideo`/`backdropVideo` are optional so a preview
 * with none supplied shows exactly the reduced-motion / videos-absent look
 * (static crest glyph + gradient). onFinished is a no-op here so the preview
 * stays mounted for inspection.
 */
export function HonorCheckpointOverlayStaticPreview({
  title,
  subtitle,
  crestVideo,
  backdropVideo,
  reward,
}: {
  title: string;
  subtitle: string;
  crestVideo?: HonorCheckpointCrestVideo;
  backdropVideo?: string;
  /** Forward to HonorCheckpointOverlay `reward` — shows "OK +{reward}" CTA when > 0. */
  reward?: number;
}) {
  return (
    <div className="relative aspect-video w-[560px] overflow-hidden rounded-sm border border-gold-4 bg-hextech-black [transform:translateZ(0)]">
      <HonorCheckpointOverlay
        title={title}
        subtitle={subtitle}
        crestVideo={crestVideo}
        backdropVideo={backdropVideo}
        ariaLabel={title}
        reward={reward}
        onFinished={() => {}}
      />
    </div>
  );
}

// Convenience: the checkpoint crest URLs, exported so the server-safe showcase
// can render a static preview with the live crest video (fixture values still
// resolved here in a client/demo module, never in the showcase itself).
export const checkpointCrestVideo: HonorCheckpointCrestVideo = {
  intro: honorCheckpointVideoUrl("intro", "3-3"),
  loop: honorCheckpointVideoUrl("loop", "3-3"),
  outro: honorCheckpointVideoUrl("outro", 3),
};
