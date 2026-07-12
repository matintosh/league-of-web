"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  QueueStatus,
  MatchFoundModal,
} from "@low/ui";
import { championSplashUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Dummy delay (ms) before auto-triggering match found: random 5–10 s */
function randomMatchDelay() {
  return (5 + Math.random() * 5) * 1000;
}

const MATCH_ACCEPT_SECONDS = 10;

/**
 * Fixture: keyart shown in the MatchFoundModal and vignette background.
 * Using Jinx splash as a demo champion pick.
 */
const DEMO_CHAMPION_ID = "Jinx";
const DEMO_KEYART_SRC = championSplashUrl(DEMO_CHAMPION_ID);

// ---------------------------------------------------------------------------
// Hex mode icon — inline SVG, gold tokens
// ---------------------------------------------------------------------------

function HexModeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <polygon
        points="12,2 21,7 21,17 12,22 3,17 3,7"
        fill="none"
        stroke="var(--color-gold-3)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <polygon
        points="12,6 17.5,9 17.5,15 12,18 6.5,15 6.5,9"
        fill="var(--color-gold-4)"
        opacity="0.6"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * State machine: queue → found (→ accepted transitions out of component).
 * The old pre-queue lobby phase has been removed — PartyLobbyScreen owns it.
 */
type LobbyState = "queue" | "found";

// ---------------------------------------------------------------------------
// MatchmakingScreen
// ---------------------------------------------------------------------------

export interface MatchmakingScreenProps {
  /** Called when the back arrow is clicked to return to home. */
  onBack: () => void;
  /**
   * Called when the player accepts a match, immediately after clearing timers.
   * When provided, the parent handles the transition (e.g. to the loadout
   * screen). When absent, the screen shows its own "entering game" beat and
   * resets — preserving standalone usability in the showcase.
   */
  onAccept?: () => void;
  /**
   * Called when the player cancels the queue or declines a match.
   * The parent (client-shell) routes back to party-lobby when provided.
   * When absent the component has no navigation target for those actions —
   * this prop is required in production wiring; optional only for showcase use.
   */
  onExitQueue?: () => void;
}

/**
 * MatchmakingScreen — queue → match-found state machine.
 *
 * The internal pre-queue lobby phase (role selectors + player card slots)
 * has been removed. PartyLobbyScreen now owns role selection and party setup;
 * this screen mounts directly into queue. Cancel and decline call onExitQueue
 * to return to party-lobby (1-click re-entry via FIND MATCH).
 *
 * State machine:
 * - queue: QueueStatus panel top-right; cancel → onExitQueue; auto match-found after 5–10 s
 * - found: MatchFoundModal counting down; accept → onAccept; decline/timeout → onExitQueue
 *
 * All timers are owned here (no intervals inside child components).
 * Every transition clears previous timers to avoid orphans.
 * Cleanup runs on unmount.
 *
 * Sized for exactly 1280×720 inside the WindowFrame content area (no
 * responsive units).
 */
export function MatchmakingScreen({ onBack, onAccept, onExitQueue }: MatchmakingScreenProps) {
  const [lobbyState, setLobbyState] = useState<LobbyState>("queue");

  // Queue timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Match found countdown
  const [secondsRemaining, setSecondsRemaining] = useState(MATCH_ACCEPT_SECONDS);

  // "Entering game" transient state after accept (standalone fallback only)
  const [enteringGame, setEnteringGame] = useState(false);

  // Stable refs for interval ids so cleanup is reliable
  const queueIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const matchDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const enteringGameTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ---------------------------------------------------------------------------
  // Timer cleanup helpers
  // ---------------------------------------------------------------------------

  const clearQueueTimers = useCallback(() => {
    if (queueIntervalRef.current !== null) {
      clearInterval(queueIntervalRef.current);
      queueIntervalRef.current = null;
    }
    if (matchDelayRef.current !== null) {
      clearTimeout(matchDelayRef.current);
      matchDelayRef.current = null;
    }
  }, []);

  const clearCountdownTimer = useCallback(() => {
    if (countdownIntervalRef.current !== null) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const clearEnteringGameTimer = useCallback(() => {
    if (enteringGameTimeoutRef.current !== null) {
      clearTimeout(enteringGameTimeoutRef.current);
      enteringGameTimeoutRef.current = null;
    }
  }, []);

  const clearAllTimers = useCallback(() => {
    clearQueueTimers();
    clearCountdownTimer();
    clearEnteringGameTimer();
  }, [clearQueueTimers, clearCountdownTimer, clearEnteringGameTimer]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // ---------------------------------------------------------------------------
  // Queue start — fires on mount (screen always enters queue immediately)
  // ---------------------------------------------------------------------------

  const startQueue = useCallback(() => {
    clearAllTimers();
    setElapsedSeconds(0);
    setLobbyState("queue");

    // Tick elapsed seconds
    queueIntervalRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    // Auto match-found after random 5–10 s
    matchDelayRef.current = setTimeout(() => {
      clearQueueTimers();
      setSecondsRemaining(MATCH_ACCEPT_SECONDS);
      setLobbyState("found");

      // Start the accept countdown (pure tick — timeout handled by effect below)
      countdownIntervalRef.current = setInterval(() => {
        setSecondsRemaining((r) => Math.max(0, r - 1));
      }, 1000);
    }, randomMatchDelay());
  }, [clearAllTimers, clearQueueTimers]);

  // Mount = enter queue immediately. Empty dep array: intentional single-fire.
  useEffect(() => {
    startQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------------------------------------------------------------------------
  // Transition handlers
  // ---------------------------------------------------------------------------

  const cancelQueue = useCallback(() => {
    clearAllTimers();
    setElapsedSeconds(0);
    onExitQueue?.();
  }, [clearAllTimers, onExitQueue]);

  const acceptMatch = useCallback(() => {
    clearAllTimers();

    if (onAccept) {
      setElapsedSeconds(0);
      setSecondsRemaining(MATCH_ACCEPT_SECONDS);
      onAccept();
      return;
    }

    // Standalone fallback: show "entering game" beat then restart queue.
    setEnteringGame(true);
    enteringGameTimeoutRef.current = setTimeout(() => {
      setEnteringGame(false);
      setElapsedSeconds(0);
      setSecondsRemaining(MATCH_ACCEPT_SECONDS);
      startQueue();
    }, 2000);
  }, [clearAllTimers, onAccept, startQueue]);

  const declineMatch = useCallback(() => {
    clearAllTimers();
    setSecondsRemaining(MATCH_ACCEPT_SECONDS);
    onExitQueue?.();
  }, [clearAllTimers, onExitQueue]);

  // Countdown timeout → exit queue (auto-decline path).
  // Fires when the pure tick reaches 0 while a match is still pending.
  // Transitioning lobbyState away from "found" immediately unsatisfies this
  // condition, so it cannot double-fire. Timer cleanup inside declineMatch
  // prevents orphaned intervals.
  useEffect(() => {
    if (secondsRemaining === 0 && lobbyState === "found") {
      declineMatch();
    }
  }, [secondsRemaining, lobbyState, declineMatch]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      {/* ------------------------------------------------------------------ */}
      {/* Layer 1: Keyart background                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="absolute inset-0">
        <img
          src={DEMO_KEYART_SRC}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-40"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Layer 2: Dark vignette overlay — radial dark edges                  */}
      {/* Using layered linear gradients (Tailwind v4 compatible, token-only) */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            /* top dark band */
            "linear-gradient(to bottom, var(--color-hextech-black) 0%, transparent 30%)",
            /* bottom dark band */
            "linear-gradient(to top, var(--color-hextech-black) 0%, transparent 35%)",
            /* left dark band */
            "linear-gradient(to right, var(--color-hextech-black) 0%, transparent 25%)",
            /* right dark band */
            "linear-gradient(to left, var(--color-hextech-black) 0%, transparent 25%)",
          ].join(", "),
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Layer 3: UI content                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative flex h-full flex-col">
        {/* ---- Header bar ---- */}
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-gold-5 bg-blue-7 px-4">
          {/* Back arrow */}
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="flex h-8 w-8 shrink-0 items-center justify-center text-grey-1 transition-colors duration-150 hover:text-gold-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 3L5 8L10 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Divider */}
          <span aria-hidden="true" className="h-5 w-px shrink-0 bg-gold-5" />

          {/* Mode icon */}
          <HexModeIcon />

          {/* Mode title */}
          <h1 className="font-display text-sm uppercase tracking-widest text-gold-1">
            Ranked Solo/Duo — Summoner&apos;s Rift
          </h1>
        </header>

        {/* ---- Main content area (flex-1, relative for absolute panel) ---- */}
        <div className="relative flex flex-1 flex-col">
          {/* Queue panel — top-right */}
          {lobbyState === "queue" && (
            <div className="absolute top-4 right-6 z-10">
              <QueueStatus
                elapsedSeconds={elapsedSeconds}
                estimatedSeconds={180}
                onCancel={cancelQueue}
                layout="panel"
              />
            </div>
          )}

          {/* ---- Bottom control strip ---- */}
          <div className="flex flex-1 items-center justify-center">
            {enteringGame && (
              <p className="font-display text-base uppercase tracking-widest text-gold-1">
                Entering game…
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Match Found modal (portal-like, fixed positioning)                  */}
      {/* ------------------------------------------------------------------ */}
      <MatchFoundModal
        open={lobbyState === "found"}
        secondsRemaining={secondsRemaining}
        totalSeconds={MATCH_ACCEPT_SECONDS}
        onAccept={acceptMatch}
        onDecline={declineMatch}
        subtitle="Summoner's Rift • Ranked • 5v5"
        keyartSrc={DEMO_KEYART_SRC}
      />
    </div>
  );
}
