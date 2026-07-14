"use client";

import { useState } from "react";
import {
  playButtonVideoUrl,
  buttonParticlesVideoUrl,
  leagueLogoVideoUrl,
} from "@low/fixtures";
import { PlayButton } from "./play-button";

/**
 * Interactive demo — click to toggle between PLAY and STOP states.
 * Demonstrates the 500ms ease-in-out slide animation from the XAML spec.
 */
export function PlayButtonQueueingToggleDemo() {
  const [queueing, setQueueing] = useState(false);

  return (
    <div className="flex flex-col items-start gap-6 p-6">
      <PlayButton
        queueing={queueing}
        onClick={() => setQueueing((q) => !q)}
      />
      <p className="font-body text-sm text-grey-2">
        State: <span className="text-gold-1">{queueing ? "queueing (STOP)" : "ready (PLAY)"}</span>
        {" — "}click the button to toggle
      </p>
    </div>
  );
}

/**
 * v8 real-client video magic-layers demo (issue #309). Wires the WAD-corpus
 * PLAY-button frame videos + the league-logo medallion socket videos from
 * `@low/fixtures` onto the real emblem PlayButton. Hover to see the cyan border
 * trace + energetic socket swirl crossfade in; press-release to fire the magic
 * burst. Videos are additive alpha overlays over the CSS v7 button and vanish
 * under prefers-reduced-motion — try toggling your OS "reduce motion".
 */
export function PlayButtonVideoMagicDemo() {
  return (
    <div className="flex flex-col items-start gap-6 p-6">
      <PlayButton
        emblemSrc="/lol-emblem.png"
        videoSources={{
          enabledIntro: playButtonVideoUrl("enabled-intro"),
          hoverIntro: playButtonVideoUrl("hover-intro"),
          hoverLoop: playButtonVideoUrl("hover-loop"),
          hoverOutro: playButtonVideoUrl("hover-outro"),
          magicRelease: playButtonVideoUrl("magic-release"),
          release: playButtonVideoUrl("release"),
          particles: buttonParticlesVideoUrl("default"),
        }}
        medallionVideoSources={{
          intro: leagueLogoVideoUrl("intro"),
          loopIdle: leagueLogoVideoUrl("loop-idle"),
          loopActive: leagueLogoVideoUrl("loop-active"),
          magic: leagueLogoVideoUrl("magic"),
        }}
      />
      <p className="font-body text-sm text-grey-2">
        Hover for the cyan border trace + energetic socket swirl; press &amp; release
        for the magic burst. Static v7 button shows under reduced motion.
      </p>
    </div>
  );
}

/**
 * Medallion-only variant — the league-logo socket videos with the pure-CSS v7
 * frame (no frame videos). Shows the bronze→gold reveal handing off to the calm
 * idle swirl, with the energetic swirl engaging on hover.
 */
export function PlayButtonMedallionMagicDemo() {
  return (
    <div className="flex flex-col items-start gap-6 p-6">
      <PlayButton
        emblemSrc="/lol-emblem.png"
        medallionVideoSources={{
          intro: leagueLogoVideoUrl("intro"),
          loopIdle: leagueLogoVideoUrl("loop-idle"),
          loopActive: leagueLogoVideoUrl("loop-active"),
          magic: leagueLogoVideoUrl("magic"),
        }}
      />
      <p className="font-body text-sm text-grey-2">
        Medallion socket videos only — CSS v7 frame preserved. Hover to swap the
        calm swirl for the energetic one.
      </p>
    </div>
  );
}
