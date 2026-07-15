"use client";

import { useState } from "react";
import { MasteryCelebrationOverlay } from "./mastery-celebration-overlay";
import { HextechButton } from "../chrome/hextech-button";
import {
  masteryCelebrationVideoUrl,
  masteryCelebrationBackgroundUrl,
  type MasteryCelebrationLevel,
} from "@low/fixtures";

// Celebration variants, resolved to CDN URLs here (fixture values live in
// demo/page files, never in the component). Each is one level clip over the
// shared starfield backdrop. See docs/reference/VIDEO-ASSETS.md, champion-mastery/.
type Variant = {
  key: string;
  label: string;
  level: MasteryCelebrationLevel;
  subtitle?: string;
};

const VARIANTS: Variant[] = [
  { key: "l1", label: "Level 1", level: 1, subtitle: "You've mastered Ahri" },
  { key: "l5", label: "Level 5", level: 5, subtitle: "You've mastered Ahri" },
  { key: "l10", label: "Level 10", level: 10, subtitle: "You've mastered Ahri" },
];

const backdropVideo = masteryCelebrationBackgroundUrl();

/**
 * Replay demo: pick a mastery level to play its celebration overlay in a framed
 * stage. Each play key-remounts the overlay so the crest clip restarts from frame
 * 0. A finished counter proves `onFinished` fires once per run (on OK, backdrop
 * click, or Escape — the fade starts immediately, it never waits for the clip).
 * Under prefers-reduced-motion the overlay still renders in full (static crest +
 * starfield) and waits for an explicit dismiss — it never auto-closes.
 */
export function MasteryCelebrationOverlayReplayDemo() {
  const [variant, setVariant] = useState<Variant | null>(null);
  // Bumped on each play so the overlay fully unmounts/remounts (restarts the
  // clip). Also lets replays of the same variant replay.
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
        Plays the mastery crest reveal (it end-holds on its resting pose). Click
        OK, click the backdrop, or press Escape to finish — the fade starts
        immediately.
      </p>
      <p className="font-body text-xs text-gold-2" data-testid="finished-count">
        onFinished fired: {finishedCount}
      </p>
      <div className="relative aspect-video w-[560px] overflow-hidden rounded-sm border border-gold-4 bg-hextech-black [transform:translateZ(0)]">
        {variant && (
          <MasteryCelebrationOverlay
            key={playKey}
            level={variant.level}
            subtitle={variant.subtitle}
            crestVideo={masteryCelebrationVideoUrl(variant.level)}
            backdropVideo={backdropVideo}
            ariaLabel={`Mastery level ${variant.level}`}
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
 * positioning is clipped to the frame). `crestVideo`/`backdropVideo` are optional
 * so a preview with none supplied shows exactly the reduced-motion / videos-absent
 * look (static crest glyph + gradient). onFinished is a no-op here so the preview
 * stays mounted for inspection.
 */
export function MasteryCelebrationOverlayStaticPreview({
  level,
  subtitle,
  withVideo = true,
}: {
  level: MasteryCelebrationLevel;
  subtitle?: string;
  withVideo?: boolean;
}) {
  return (
    <div className="relative aspect-video w-[560px] overflow-hidden rounded-sm border border-gold-4 bg-hextech-black [transform:translateZ(0)]">
      <MasteryCelebrationOverlay
        level={level}
        subtitle={subtitle}
        crestVideo={withVideo ? masteryCelebrationVideoUrl(level) : undefined}
        backdropVideo={withVideo ? backdropVideo : undefined}
        ariaLabel={`Mastery level ${level}`}
        onFinished={() => {}}
      />
    </div>
  );
}
