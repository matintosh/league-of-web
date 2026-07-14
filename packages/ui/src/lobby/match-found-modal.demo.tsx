"use client";

import { useState, useEffect } from "react";
import { MatchFoundModal } from "./match-found-modal";
import { HextechButton } from "../chrome/hextech-button";
import { championSplashUrl, gameModeMapUrl } from "@low/fixtures";

const SR_CREST = gameModeMapUrl("sr");

const TOTAL = 10;

// ---------------------------------------------------------------------------
// Static showcase wrappers
// ---------------------------------------------------------------------------

/** Static: full countdown, with map crest */
export function MatchFoundModalFullCountdownDemo() {
  return (
    <div className="relative overflow-hidden [transform:translateZ(0)] h-[560px] w-[520px]">
      <MatchFoundModal open={true} secondsRemaining={10} totalSeconds={10} crestSrc={SR_CREST} onAccept={() => {}} onDecline={() => {}} />
    </div>
  );
}

/** Static: halfway (arc at 50%), with map crest */
export function MatchFoundModalHalfwayDemo() {
  return (
    <div className="relative overflow-hidden [transform:translateZ(0)] h-[560px] w-[520px]">
      <MatchFoundModal open={true} secondsRemaining={5} totalSeconds={10} crestSrc={SR_CREST} onAccept={() => {}} onDecline={() => {}} />
    </div>
  );
}

/** Static: nearly expired (<=2s, countdown text gold-3), with map crest */
export function MatchFoundModalNearlyExpiredDemo() {
  return (
    <div className="relative overflow-hidden [transform:translateZ(0)] h-[560px] w-[520px]">
      <MatchFoundModal open={true} secondsRemaining={2} totalSeconds={10} crestSrc={SR_CREST} onAccept={() => {}} onDecline={() => {}} />
    </div>
  );
}

/** Static: no crestSrc — renders the HexCrest fallback placeholder */
export function MatchFoundModalNoCrestDemo() {
  return (
    <div className="relative overflow-hidden [transform:translateZ(0)] h-[560px] w-[520px]">
      <MatchFoundModal open={true} secondsRemaining={7} totalSeconds={10} onAccept={() => {}} onDecline={() => {}} />
    </div>
  );
}

/** Static: with champion keyart (Ahri splash) + map crest */
export function MatchFoundModalWithKeyartDemo() {
  return (
    <div className="relative overflow-hidden [transform:translateZ(0)] h-[560px] w-[520px]">
      <MatchFoundModal
        open={true}
        secondsRemaining={8}
        totalSeconds={10}
        keyartSrc={championSplashUrl("Ahri")}
        crestSrc={SR_CREST}
        subtitle="Summoner's Rift • Ranked • 5v5"
        onAccept={() => {}}
        onDecline={() => {}}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Interactive ticking demo
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Entrance replay demo — key-remount trick to replay the mount animation
// ---------------------------------------------------------------------------

/**
 * Entrance replay: clicking "Replay entrance" bumps a key so the modal fully
 * unmounts and remounts, re-firing the on-mount CSS entrance (ring sweep,
 * modal scale/fade snap-in, ACCEPT glow pulse). With prefers-reduced-motion
 * enabled the modal appears instantly, fully visible.
 */
export function MatchFoundModalEntranceReplayDemo() {
  const [replayKey, setReplayKey] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <HextechButton onClick={() => setReplayKey((k) => k + 1)}>
        Replay entrance
      </HextechButton>
      <p className="font-body text-xs text-grey-2">
        Remounts the modal so the on-mount entrance plays again: teal ring sweeps
        around, modal scales/fades in (snap easing), ACCEPT glow pulses.
      </p>
      <div className="relative overflow-hidden [transform:translateZ(0)] h-[560px] w-[520px]">
        <MatchFoundModal
          key={replayKey}
          open={true}
          secondsRemaining={10}
          totalSeconds={10}
          keyartSrc={championSplashUrl("Ahri")}
          crestSrc={SR_CREST}
          subtitle="Summoner's Rift • Ranked • 5v5"
          onAccept={() => {}}
          onDecline={() => {}}
        />
      </div>
    </div>
  );
}

/** Interactive: ticking demo with trigger button */
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
          return TOTAL;
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
        Click to open. Countdown ticks; arc drains; auto-declines at 0.
      </p>
      <MatchFoundModal
        open={open}
        secondsRemaining={seconds}
        totalSeconds={TOTAL}
        keyartSrc={championSplashUrl("Ahri")}
        crestSrc={SR_CREST}
        subtitle="Summoner's Rift • Ranked • 5v5"
        onAccept={() => { setOpen(false); setSeconds(TOTAL); }}
        onDecline={() => { setOpen(false); setSeconds(TOTAL); }}
      />
    </div>
  );
}
