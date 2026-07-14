"use client";

/**
 * DeclarePhaseScreen — declare-intent (position assignment) phase wrapper.
 *
 * The first champ-select beat, before bans:
 *   ACCEPT → DeclarePhaseScreen → BanPhaseScreen → PickScreen → LoadoutScreen → home
 *
 * This app-level wrapper owns the phase timer + auto-advance (mirroring
 * BanPhaseScreen / PickScreen) and supplies the presentational
 * DeclareIntentScreen (@low/ui) with roster, video URLs, and labels built from
 * @low/fixtures. The screen itself never fetches — pages supply values.
 *
 * The team roster reuses the champ-select fixture team (pickTeam), each row
 * mapped to a role. The local player (cherwood) declares MID and floats to the
 * top of the roster per the reference.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { DeclareIntentScreen } from "@low/ui";
import type { DeclareRosterEntry, DeclareRole } from "@low/ui";
import {
  positionIconUrl,
  summonerSpellIconUrl,
  declareMapIntroUrl,
  declarePathUrl,
  declarePinUrl,
} from "@low/fixtures";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * Seconds for the declare phase. The real client's declare beat is brief; we
 * use 12s so the map reveal + pin drops play out before auto-advancing to bans.
 */
const DECLARE_SECONDS = 12;

/** Which team side's map reveal to show (north = blue-side, matches reference). */
const SIDE = "north" as const;

// ---------------------------------------------------------------------------
// Roster — 5 role rows, local player (cherwood, MID) floated to the top.
// ---------------------------------------------------------------------------

const ROSTER: DeclareRosterEntry[] = (
  [
    { summonerName: "cherwood", role: "middle", isSelf: true },
    { summonerName: "qlxHarlan", role: "bottom" },
    { summonerName: "Oppeohtelar", role: "top" },
    { summonerName: "HowarqLqUq", role: "jungle" },
    { summonerName: "CallMeCallMeStar", role: "utility" },
  ] as Array<{ summonerName: string; role: DeclareRole; isSelf?: boolean }>
).map((r) => ({ ...r, roleIconSrc: positionIconUrl(r.role) }));

// Video sources — champ-select plugin video/ subtree via @low/fixtures helpers.
const VIDEO = {
  mapIntroSrc: declareMapIntroUrl(SIDE),
  pathSrcs: {
    top: declarePathUrl(SIDE, "top"),
    jungle: declarePathUrl(SIDE, "jungle"),
    middle: declarePathUrl(SIDE, "middle"),
    bottom: declarePathUrl(SIDE, "bottom"),
  },
  pinSrc: declarePinUrl("ally"),
  mePinSrc: declarePinUrl("me"),
};

const SPELLS: [string, string] = [
  summonerSpellIconUrl("summoner_flash"),
  summonerSpellIconUrl("summonerignite"),
];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface DeclarePhaseScreenProps {
  /**
   * Called when the declare phase ends (timer fires).
   * Transitions the shell to the ban phase.
   */
  onDeclareComplete: () => void;
}

// ---------------------------------------------------------------------------
// DeclarePhaseScreen
// ---------------------------------------------------------------------------

export function DeclarePhaseScreen({ onDeclareComplete }: DeclarePhaseScreenProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(DECLARE_SECONDS);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advancedRef = useRef(false);

  const clearCountdown = useCallback(() => {
    if (countdownRef.current !== null) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  // Start the countdown on mount; clear on unmount.
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setSecondsRemaining((s) => Math.max(0, s - 1));
    }, 1000);
    return () => {
      if (countdownRef.current !== null) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);

  // Auto-advance to the ban phase at countdown = 0 (exactly once).
  useEffect(() => {
    if (secondsRemaining === 0 && !advancedRef.current) {
      advancedRef.current = true;
      clearCountdown();
      onDeclareComplete();
    }
  }, [secondsRemaining, clearCountdown, onDeclareComplete]);

  return (
    <DeclareIntentScreen
      secondsRemaining={secondsRemaining}
      totalSeconds={DECLARE_SECONDS}
      roster={ROSTER}
      video={VIDEO}
      side={SIDE}
      queueLabel="5V5"
      queueSublabel="Ranked Solo/Duo"
      runePageName="Sorcery: The Calamity"
      spellSrcs={SPELLS}
    />
  );
}
