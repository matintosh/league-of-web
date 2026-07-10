"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  LobbyPlayerCard,
  QueueStatus,
  MatchFoundModal,
  RoleSelector,
  HextechButton,
} from "@low/ui";
import type { Role } from "@low/ui";
import { demoSummoner, profileIconUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LobbyState = "lobby" | "queue" | "found";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Dummy delay (ms) before auto-triggering match found: random 5–10 s */
function randomMatchDelay() {
  return (5 + Math.random() * 5) * 1000;
}

const MATCH_ACCEPT_SECONDS = 10;

// ---------------------------------------------------------------------------
// MatchmakingScreen
// ---------------------------------------------------------------------------

export interface MatchmakingScreenProps {
  /** Called when the back arrow is clicked to return to home. */
  onBack: () => void;
}

/**
 * MatchmakingScreen — lobby → queue → match-found state machine.
 *
 * State machine:
 * - lobby: player cards + role selectors; FIND MATCH gated on primary role
 * - queue: QueueStatus ticking; cancel → lobby; auto match-found after 5–10 s
 * - found: MatchFoundModal counting down; accept/decline/timeout → lobby
 *
 * All timers are owned here (no intervals inside child components).
 * Every transition clears previous timers to avoid orphans.
 * Cleanup runs on unmount.
 *
 * Sized for exactly 1280×720 inside the WindowFrame content area (no
 * responsive units).
 */
export function MatchmakingScreen({ onBack }: MatchmakingScreenProps) {
  const [lobbyState, setLobbyState] = useState<LobbyState>("lobby");
  const [primaryRole, setPrimaryRole] = useState<Role | null>(null);
  const [secondaryRole, setSecondaryRole] = useState<Role | null>(null);

  // Queue timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Match found countdown
  const [secondsRemaining, setSecondsRemaining] = useState(MATCH_ACCEPT_SECONDS);

  // "Entering game" transient state after accept
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
  // Transition handlers
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

      // Start the accept countdown
      countdownIntervalRef.current = setInterval(() => {
        setSecondsRemaining((r) => {
          if (r <= 1) {
            // Timeout → back to lobby
            clearCountdownTimer();
            setLobbyState("lobby");
            return MATCH_ACCEPT_SECONDS;
          }
          return r - 1;
        });
      }, 1000);
    }, randomMatchDelay());
  }, [clearAllTimers, clearQueueTimers, clearCountdownTimer]);

  const cancelQueue = useCallback(() => {
    clearAllTimers();
    setLobbyState("lobby");
    setElapsedSeconds(0);
  }, [clearAllTimers]);

  const acceptMatch = useCallback(() => {
    clearAllTimers();
    setLobbyState("lobby"); // hide the modal immediately
    setEnteringGame(true);

    // Show "entering game" text briefly then reset fully
    enteringGameTimeoutRef.current = setTimeout(() => {
      setEnteringGame(false);
      setPrimaryRole(null);
      setSecondaryRole(null);
      setElapsedSeconds(0);
      setSecondsRemaining(MATCH_ACCEPT_SECONDS);
    }, 2000);
  }, [clearAllTimers]);

  const declineMatch = useCallback(() => {
    clearAllTimers();
    setSecondsRemaining(MATCH_ACCEPT_SECONDS);
    setLobbyState("lobby");
  }, [clearAllTimers]);

  // ---------------------------------------------------------------------------
  // Role constraints: secondary cannot equal primary
  // ---------------------------------------------------------------------------

  const handlePrimarySelect = useCallback(
    (role: Role) => {
      setPrimaryRole(role);
      if (secondaryRole === role) setSecondaryRole(null);
    },
    [secondaryRole],
  );

  const handleSecondarySelect = useCallback(
    (role: Role) => {
      if (role === primaryRole) return; // no-op
      setSecondaryRole(role);
    },
    [primaryRole],
  );

  const secondaryDisabled: Role[] = primaryRole ? [primaryRole] : [];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="relative flex h-full w-full flex-col bg-blue-7">
      {/* Background gradient — subtle dark gradient instead of full keyart */}
      <div className="absolute inset-0 bg-linear-to-b from-hextech-black via-blue-7 to-hextech-black" />

      {/* Content */}
      <div className="relative flex h-full flex-col">
        {/* ---- Header ---- */}
        <div className="flex h-12 items-center gap-4 border-b border-gold-5 px-6">
          {/* Back arrow */}
          <button
            type="button"
            aria-label="Back"
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center text-grey-1 transition-colors duration-150 hover:text-gold-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3"
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

          {/* Mode title */}
          <h1 className="font-display text-sm uppercase tracking-widest text-gold-1">
            Ranked Solo/Duo — Summoner&apos;s Rift
          </h1>
        </div>

        {/* ---- Player cards row ---- */}
        <div className="flex flex-1 items-center justify-center gap-4 px-6">
          {/* Slot 1 — local player, emphasized */}
          <LobbyPlayerCard
            summoner={demoSummoner}
            profileIconSrc={profileIconUrl(demoSummoner.profileIconId)}
            emphasized
            roleSlot={
              <div className="flex flex-col gap-2 w-full">
                {/* Primary role */}
                <div className="flex flex-col gap-0.5 items-center">
                  <span className="font-body text-[10px] uppercase tracking-widest text-grey-2 leading-none">
                    Primary
                  </span>
                  <RoleSelector
                    label="Primary role"
                    selected={primaryRole}
                    onSelect={handlePrimarySelect}
                  />
                </div>
                {/* Secondary role */}
                <div className="flex flex-col gap-0.5 items-center">
                  <span className="font-body text-[10px] uppercase tracking-widest text-grey-2 leading-none">
                    Secondary
                  </span>
                  <RoleSelector
                    label="Secondary role"
                    selected={secondaryRole}
                    onSelect={handleSecondarySelect}
                    disabledRoles={secondaryDisabled}
                  />
                </div>
              </div>
            }
          />

          {/* Slots 2–5 — empty invite slots */}
          {([2, 3, 4, 5] as const).map((n) => (
            <LobbyPlayerCard
              key={n}
              onInvite={() => console.log(`Invite slot ${n}`)}
            />
          ))}
        </div>

        {/* ---- Bottom control strip ---- */}
        <div className="flex h-20 items-center justify-center border-t border-gold-5">
          {enteringGame ? (
            <p className="font-display text-base uppercase tracking-widest text-gold-1">
              Entering game…
            </p>
          ) : lobbyState === "lobby" ? (
            <HextechButton
              variant="primary"
              size="large"
              disabled={primaryRole === null}
              onClick={startQueue}
            >
              Find Match
            </HextechButton>
          ) : lobbyState === "queue" ? (
            <QueueStatus
              elapsedSeconds={elapsedSeconds}
              estimatedSeconds={180}
              onCancel={cancelQueue}
            />
          ) : null /* "found" — modal handles the UI */}
        </div>
      </div>

      {/* ---- Match Found modal (portal-like, fixed positioning) ---- */}
      <MatchFoundModal
        open={lobbyState === "found"}
        secondsRemaining={secondsRemaining}
        totalSeconds={MATCH_ACCEPT_SECONDS}
        onAccept={acceptMatch}
        onDecline={declineMatch}
      />
    </div>
  );
}
