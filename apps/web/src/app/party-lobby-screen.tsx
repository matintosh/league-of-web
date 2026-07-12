"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  LobbyHeader,
  PlayerBanner,
  RoleSlotRow,
  LockInButton,
  ChatPanel,
  MatchFoundModal,
  formatQueueTime,
} from "@low/ui";
import type { ChatMessage, RoleSlot, WingTier, Role } from "@low/ui";
import {
  demoSummoner,
  demoFriends,
  pickTeam,
  profileIconUrl,
  positionIconUrl,
  gameModeMapUrl,
  championSplashUrl,
} from "@low/fixtures";

// ---------------------------------------------------------------------------
// Fixture: lobby chat messages
// ---------------------------------------------------------------------------

const LOBBY_MESSAGES: ChatMessage[] = [
  { id: "1", text: "Welcome to the lobby!" },
  { id: "2", author: demoSummoner.gameName, text: "Ready when you all are" },
  { id: "3", text: "Doublelift joined the party." },
];

// ---------------------------------------------------------------------------
// Fixture: invited players list — reference shows "INVITED (1)" tab active
// with a checkmark + one player name.
// ---------------------------------------------------------------------------

interface InvitedEntry {
  id: string;
  name: string;
}

const INVITED_FIXTURE: InvitedEntry[] = [
  { id: "invited-1", name: demoSummoner.gameName },
];

// ---------------------------------------------------------------------------
// Demo party — DEFAULT = empty banners (solo lobby).
//
// The real client shows empty slots when the player is solo, which is the
// correct default. Set SHOW_DEMO_PARTY = true to fill all four flanking
// slots with fixture teammates for screenshot / composition reference.
// This is a compile-time constant; no toggle UI is rendered in production.
// ---------------------------------------------------------------------------

const SHOW_DEMO_PARTY = false;

// ---------------------------------------------------------------------------
// Role icon resolver — CommunityDragon position SVGs via positionIconUrl
// ---------------------------------------------------------------------------

const ROLE_TO_CDRAGON: Record<Role, "top" | "jungle" | "middle" | "bottom" | "utility"> = {
  top:     "top",
  jungle:  "jungle",
  mid:     "middle",
  bottom:  "bottom",
  support: "utility",
};

function iconSrcFor(role: Role): string {
  return positionIconUrl(ROLE_TO_CDRAGON[role]);
}

// ---------------------------------------------------------------------------
// Demo party members — drawn from pickTeam + demoFriends icon IDs.
// wingTiers cycle to give visual variety matching the reference.
// ---------------------------------------------------------------------------

interface DemoPartyMember {
  name: string;
  avatarSrc: string;
  wingTier: WingTier;
  primaryRole: Role;
  secondaryRole: Role;
}

// demoFriends has 8 members and pickTeam has 5 — both verified in fixtures/src/summoner.ts
// and fixtures/src/champions.ts. Non-null assertions are safe; the arrays are compile-time
// constants with fixed lengths and the fixture file is the source of truth.
const DEMO_PARTY: [DemoPartyMember, DemoPartyMember, DemoPartyMember, DemoPartyMember] = [
  {
    name:          pickTeam[0]!.summonerName,
    avatarSrc:     profileIconUrl(demoFriends[0]!.summoner.profileIconId),
    wingTier:      "bronze",
    primaryRole:   "jungle",
    secondaryRole: "top",
  },
  {
    name:          pickTeam[1]!.summonerName,
    avatarSrc:     profileIconUrl(demoFriends[1]!.summoner.profileIconId),
    wingTier:      "teal",
    primaryRole:   "bottom",
    secondaryRole: "mid",
  },
  {
    name:          pickTeam[3]!.summonerName,
    avatarSrc:     profileIconUrl(demoFriends[2]!.summoner.profileIconId),
    wingTier:      "green",
    primaryRole:   "mid",
    secondaryRole: "support",
  },
  {
    name:          pickTeam[4]!.summonerName,
    avatarSrc:     profileIconUrl(demoFriends[3]!.summoner.profileIconId),
    wingTier:      "blue",
    primaryRole:   "support",
    secondaryRole: "mid",
  },
];

// ---------------------------------------------------------------------------
// Self's role slots — 2 fixture roles + 1 empty.
// ---------------------------------------------------------------------------

const SELF_ROLE_SLOTS: RoleSlot[] = [
  { role: "mid" },
  { role: "support" },
  { role: undefined },
];

// ---------------------------------------------------------------------------
// Queue constants
// ---------------------------------------------------------------------------

/** Dummy delay (ms) before auto-triggering match found: random 5–10 s */
function randomMatchDelay() {
  return (5 + Math.random() * 5) * 1000;
}

const MATCH_ACCEPT_SECONDS = 10;

/** Fixture estimated wait shown in FindingMatchPanel and ProfileChip. */
const ESTIMATED_LABEL = "Estimated: 3:00";

/** Fixture champion keyart for MatchFoundModal. */
const DEMO_KEYART_SRC = championSplashUrl("Jinx");

// ---------------------------------------------------------------------------
// Queue phase type (internal to this screen)
// ---------------------------------------------------------------------------

type QueuePhase = "idle" | "queue" | "found";

// ---------------------------------------------------------------------------
// PartyLobbyScreen
// ---------------------------------------------------------------------------

export interface PartyLobbyScreenProps {
  /**
   * Called when the back chevron or the ✕ cancel button is clicked
   * while the lobby is in the idle (pre-queue) state.
   * Navigates back to the mode-select screen.
   */
  onBack: () => void;
  /**
   * Called when the player accepts a match.
   * The shell transitions to the pick screen when this fires.
   */
  onAccept: () => void;
  /**
   * Party open/closed state — OWNED BY THE SHELL (single source of truth,
   * shared with the rail's PartyStatusPanel so the header pill and the
   * panel always agree).
   */
  partyOpen: boolean;
  onPartyToggle: (open: boolean) => void;
  /**
   * Called when the queue phase changes so the shell can update the
   * FindingMatchPanel in the rail column.
   *
   * Fired with:
   *   phase === "queue" | "found" — include elapsedLabel (pre-formatted "m:ss")
   *   phase === "idle"            — elapsedLabel is undefined (queue stopped)
   *
   * The shell uses this to decide whether to show FindingMatchPanel instead
   * of PartyStatusPanel, and to pass the correct elapsedLabel down.
   */
  onQueuePhaseChange: (phase: QueuePhase, elapsedLabel?: string) => void;
  /**
   * Called once on mount with a function that, when invoked, cancels the queue
   * and returns the lobby to the idle state. The shell stores this reference
   * so the FindingMatchPanel rail widget ✕ can trigger cancel without needing
   * to reach into the lobby screen's internal timer state.
   */
  onRegisterCancel?: (cancelFn: () => void) => void;
  /**
   * Called when the "Change Mode" button in the lobby header is clicked.
   * Defaults to onBack behavior when omitted — navigates to mode-select.
   */
  onChangeMode?: () => void;
}

/**
 * PartyLobbyScreen — the hi-fi pre-game party lobby phase.
 *
 * This screen owns the full queue state machine (idle → queue → found) and
 * all associated timers. The real client never leaves the lobby while
 * queueing; navigation away only happens on accept (→ pick) or back (→
 * mode-select from idle). The shell receives phase change notifications via
 * onQueuePhaseChange and renders FindingMatchPanel or PartyStatusPanel in
 * the rail column accordingly.
 *
 * State machine:
 *   idle → FIND MATCH click → queue (timer starts, auto match-found 5–10 s)
 *   queue → ✕ cancel → idle (timers cleared, lobby stays mounted)
 *   queue → match found (auto) → found (accept countdown starts)
 *   found → ACCEPT → onAccept() (shell → pick)
 *   found → DECLINE / countdown→0 → idle (timers cleared, lobby stays mounted)
 *
 * Timer rigor (issue #161 standard):
 *   All intervals/timeouts are stored in stable refs.
 *   clearAllTimers() is called at every state transition and on unmount.
 *   Every exit path (cancel, decline, accept, auto-decline, unmount) clears
 *   all timers before any state update, preventing orphaned callbacks.
 *
 * Composition zones:
 * - LobbyHeader (top): mode title + crest + back chevron. Party-open pill toggle.
 * - Center: 5 banner slots (L2 · L1 · SELF · R1 · R2).
 *   In idle: empty slots show + circles (standard). In queue: blue-glow circles + self asterisk.
 * - Bottom bar (height 120):
 *   Left (280px): ChatPanel with lobby fixture messages, input appends.
 *   Center (flex-1): ✕ cancel circle (behavior: idle→back, queue→cancel);
 *   FIND MATCH / "In Queue" button (LockInButton, 200px wide, disabled while queuing);
 *   2 dead circular icon buttons (role shield + ward eye glyphs, aria-disabled).
 *   Right (200px): "Suggested | Invited (1)" tab strip.
 * - MatchFoundModal renders over the lobby (z-50) in the "found" phase.
 */
export function PartyLobbyScreen({
  onBack,
  onAccept,
  partyOpen,
  onPartyToggle,
  onQueuePhaseChange,
  onRegisterCancel,
  onChangeMode,
}: PartyLobbyScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(LOBBY_MESSAGES);
  const [inviteTab, setInviteTab] = useState<"suggested" | "invited">("invited");

  // ---------------------------------------------------------------------------
  // Queue state machine
  // ---------------------------------------------------------------------------

  const [queuePhase, setQueuePhase] = useState<QueuePhase>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(MATCH_ACCEPT_SECONDS);

  // Stable refs for all timers — allows clearAllTimers() to work reliably
  // regardless of closure age.
  const queueIntervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const matchDelayRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  const clearAllTimers = useCallback(() => {
    clearQueueTimers();
    clearCountdownTimer();
  }, [clearQueueTimers, clearCountdownTimer]);

  // Clean up all timers on unmount.
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);


  // ---------------------------------------------------------------------------
  // Notify shell whenever phase or elapsed seconds changes
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (queuePhase === "idle") {
      onQueuePhaseChange("idle");
    } else {
      // Notify for both "queue" and "found" phases so the shell always
      // has the current elapsed label for FindingMatchPanel.
      onQueuePhaseChange(queuePhase, formatQueueTime(elapsedSeconds));
    }
    // onQueuePhaseChange is stable (useCallback in ClientShell); safe dep.
  }, [queuePhase, elapsedSeconds, onQueuePhaseChange]);

  // ---------------------------------------------------------------------------
  // Queue start
  // ---------------------------------------------------------------------------

  const startQueue = useCallback(() => {
    clearAllTimers();
    setElapsedSeconds(0);
    setQueuePhase("queue");

    // Tick the elapsed counter every second.
    queueIntervalRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    // Auto match-found after a random 5–10 s delay.
    matchDelayRef.current = setTimeout(() => {
      clearQueueTimers();
      setSecondsRemaining(MATCH_ACCEPT_SECONDS);
      setQueuePhase("found");

      // Accept countdown — pure tick; the effect below handles the timeout.
      countdownIntervalRef.current = setInterval(() => {
        setSecondsRemaining((r) => Math.max(0, r - 1));
      }, 1000);
    }, randomMatchDelay());
  }, [clearAllTimers, clearQueueTimers]);

  // ---------------------------------------------------------------------------
  // Transition handlers
  // ---------------------------------------------------------------------------

  /** Cancel queue from widget ✕ or bottom-bar ✕ while in queue phase. */
  const handleCancelQueue = useCallback(() => {
    clearAllTimers();
    setElapsedSeconds(0);
    setQueuePhase("idle");
    // onQueuePhaseChange("idle") fires via the effect above.
  }, [clearAllTimers]);

  // Register the cancel function with the shell so the FindingMatchPanel rail
  // widget ✕ can trigger queue cancellation without reaching into this screen's
  // internal timer state. handleCancelQueue is stable (useCallback), so this
  // effect only ever runs once (like componentDidMount).
  useEffect(() => {
    onRegisterCancel?.(handleCancelQueue);
  }, [onRegisterCancel, handleCancelQueue]);

  /** Accept the match — clear timers, notify shell to navigate to pick. */
  const handleAcceptMatch = useCallback(() => {
    clearAllTimers();
    setElapsedSeconds(0);
    setSecondsRemaining(MATCH_ACCEPT_SECONDS);
    setQueuePhase("idle");
    onAccept();
  }, [clearAllTimers, onAccept]);

  /** Decline or auto-decline — clear timers, return to idle lobby in place. */
  const handleDeclineMatch = useCallback(() => {
    clearAllTimers();
    setSecondsRemaining(MATCH_ACCEPT_SECONDS);
    setQueuePhase("idle");
    // onQueuePhaseChange("idle") fires via the effect above.
  }, [clearAllTimers]);

  // Auto-decline when the countdown reaches 0 while in the "found" phase.
  // Transitioning queuePhase away from "found" immediately prevents double-fire.
  useEffect(() => {
    if (secondsRemaining === 0 && queuePhase === "found") {
      handleDeclineMatch();
    }
  }, [secondsRemaining, queuePhase, handleDeclineMatch]);

  // ---------------------------------------------------------------------------
  // Bottom-bar cancel ✕ — navigates back in idle, cancels queue when queuing
  // ---------------------------------------------------------------------------

  const handleCancelOrBack = useCallback(() => {
    if (queuePhase === "idle") {
      onBack();
    } else {
      handleCancelQueue();
    }
  }, [queuePhase, onBack, handleCancelQueue]);

  // ---------------------------------------------------------------------------
  // Chat
  // ---------------------------------------------------------------------------

  const handleSend = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), author: demoSummoner.gameName, text },
    ]);
  }, []);

  const handleTabKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      setInviteTab(prev => prev === "suggested" ? "invited" : "suggested");
    }
  }, []);

  // ---------------------------------------------------------------------------
  // Banner slot arrays (L2, L1 | SELF | R1, R2)
  // ---------------------------------------------------------------------------

  const leftMembers:  (DemoPartyMember | null)[] = SHOW_DEMO_PARTY
    ? [DEMO_PARTY[0] as DemoPartyMember, DEMO_PARTY[1] as DemoPartyMember]
    : [null, null];
  const rightMembers: (DemoPartyMember | null)[] = SHOW_DEMO_PARTY
    ? [DEMO_PARTY[2] as DemoPartyMember, DEMO_PARTY[3] as DemoPartyMember]
    : [null, null];

  const isQueueing = queuePhase !== "idle";

  return (
    <div className="relative flex h-full flex-col bg-hextech-black" data-shot="party-lobby">
      {/* ------------------------------------------------------------------ */}
      {/* LobbyHeader                                                          */}
      {/* ------------------------------------------------------------------ */}
      <LobbyHeader
        title="Summoner's Rift · Normal"
        segments={["Intro", "Blind", "Summoner's Rift 5v5"]}
        queueCount={30}
        crestSrc={gameModeMapUrl("sr")}
        onBack={onBack}
        onChangeMode={onChangeMode ?? onBack}
        partyOpen={partyOpen}
        onPartyToggle={onPartyToggle}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Banner zone — 5 slots centered                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-1 items-center justify-center gap-3 px-4">
        {/* Left flankers */}
        {leftMembers.map((member, i) =>
          member ? (
            <PlayerBanner
              key={`l${i}`}
              name={member.name}
              avatarSrc={member.avatarSrc}
              wingTier={member.wingTier}
            >
              <RoleSlotRow
                size="sm"
                slots={[{ role: member.primaryRole }, { role: member.secondaryRole }]}
                iconSrcFor={iconSrcFor}
              />
            </PlayerBanner>
          ) : (
            <PlayerBanner key={`le${i}`} name="" avatarSrc="" empty queueing={isQueueing} />
          ),
        )}

        {/* Self banner (center) */}
        <PlayerBanner
          name={demoSummoner.gameName}
          avatarSrc={profileIconUrl(demoSummoner.profileIconId)}
          wingTier="gold"
          isSelf
          level={demoSummoner.level}
          autofillProtected
          queueing={isQueueing}
        >
          <RoleSlotRow
            size="md"
            slots={SELF_ROLE_SLOTS}
            iconSrcFor={iconSrcFor}
          />
        </PlayerBanner>

        {/* Right flankers */}
        {rightMembers.map((member, i) =>
          member ? (
            <PlayerBanner
              key={`r${i}`}
              name={member.name}
              avatarSrc={member.avatarSrc}
              wingTier={member.wingTier}
            >
              <RoleSlotRow
                size="sm"
                slots={[{ role: member.primaryRole }, { role: member.secondaryRole }]}
                iconSrcFor={iconSrcFor}
              />
            </PlayerBanner>
          ) : (
            <PlayerBanner key={`re${i}`} name="" avatarSrc="" empty queueing={isQueueing} />
          ),
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Bottom bar (120px)                                                   */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex shrink-0 items-stretch border-t border-gold-5"
        style={{ height: 120 }}
      >
        {/* Chat panel — left */}
        <div className="shrink-0" style={{ width: 280 }}>
          <ChatPanel
            messages={messages}
            onSend={handleSend}
            placeholder="Type a message…"
          />
        </div>

        {/* Center: cancel ✕ + FIND MATCH / In Queue + 2 dead icon buttons */}
        <div className="flex flex-1 items-center justify-center gap-3">
          {/* ✕ cancel — in idle: goes back to mode-select; in queue: cancels queue */}
          <button
            type="button"
            aria-label={isQueueing ? "Cancel queue" : "Cancel — return to mode select"}
            onClick={handleCancelOrBack}
            className={[
              "flex shrink-0 items-center justify-center rounded-full",
              "h-10 w-10",
              "border border-grey-3 bg-grey-4 text-grey-1",
              "cursor-pointer transition-colors duration-150",
              "hover:border-gold-4 hover:text-gold-1",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
            ].join(" ")}
          >
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 2l10 10M12 2L2 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* FIND MATCH / In Queue (LockInButton, 200px wide) */}
          <div style={{ width: 200 }}>
            <LockInButton
              label={isQueueing ? "In Queue" : "Find Match"}
              disabled={isQueueing}
              onLockIn={startQueue}
            />
          </div>

          {/* Dead: role preferences button */}
          <button
            type="button"
            aria-label="Role preferences (unavailable)"
            aria-disabled="true"
            disabled
            className={[
              "flex shrink-0 items-center justify-center rounded-full",
              "h-10 w-10",
              "border border-grey-4 bg-hextech-black text-grey-3",
              "cursor-default opacity-50",
            ].join(" ")}
          >
            {/* Shield / role glyph */}
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 1L12.5 3.5V7.5Q12.5 12 7 13.5Q1.5 12 1.5 7.5V3.5Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M4.5 7L6.5 9L9.5 5.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Dead: ward skin button */}
          <button
            type="button"
            aria-label="Ward skin preferences (unavailable)"
            aria-disabled="true"
            disabled
            className={[
              "flex shrink-0 items-center justify-center rounded-full",
              "h-10 w-10",
              "border border-grey-4 bg-hextech-black text-grey-3",
              "cursor-default opacity-50",
            ].join(" ")}
          >
            {/* Ward / eye glyph */}
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 2C3.5 2 1 7 1 7s2.5 5 6 5 6-5 6-5-2.5-5-6-5Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <circle cx="7" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        {/* Suggested | Invited panel — right */}
        <div
          className="flex shrink-0 flex-col border-l border-gold-5"
          style={{ width: 200 }}
        >
          {/* Tab strip */}
          <div
            role="tablist"
            aria-label="Invite options"
            className="flex shrink-0 border-b border-gold-5"
            onKeyDown={handleTabKeyDown}
          >
            <button
              type="button"
              role="tab"
              id="tab-suggested"
              aria-controls="panel-suggested"
              aria-selected={inviteTab === "suggested"}
              tabIndex={inviteTab === "suggested" ? 0 : -1}
              onClick={() => setInviteTab("suggested")}
              className={[
                "flex-1 px-2 py-1.5 font-display text-xs uppercase tracking-wider cursor-pointer",
                "border-b-2 transition-colors duration-150",
                inviteTab === "suggested"
                  ? "border-gold-4 text-gold-1"
                  : "border-transparent text-grey-2 hover:text-grey-1",
              ].join(" ")}
            >
              Suggested
            </button>
            <button
              type="button"
              role="tab"
              id="tab-invited"
              aria-controls="panel-invited"
              aria-selected={inviteTab === "invited"}
              tabIndex={inviteTab === "invited" ? 0 : -1}
              onClick={() => setInviteTab("invited")}
              className={[
                "flex-1 px-2 py-1.5 font-display text-xs uppercase tracking-wider cursor-pointer",
                "border-b-2 transition-colors duration-150",
                inviteTab === "invited"
                  ? "border-gold-4 text-gold-1"
                  : "border-transparent text-grey-2 hover:text-grey-1",
              ].join(" ")}
            >
              {`Invited (${INVITED_FIXTURE.length})`}
            </button>
          </div>

          {/* Panel body */}
          <div
            id={`panel-${inviteTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${inviteTab}`}
            className="flex flex-1 flex-col bg-blue-7/30 overflow-y-auto"
          >
            {inviteTab === "invited" ? (
              INVITED_FIXTURE.length > 0 ? (
                <ul className="flex flex-col py-1">
                  {INVITED_FIXTURE.map((entry) => (
                    <li
                      key={entry.id}
                      className="flex items-center gap-2 px-3 py-1.5"
                    >
                      {/* Checkmark */}
                      <svg
                        aria-hidden="true"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0 text-gold-2"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="truncate font-body text-xs text-grey-1">
                        {entry.name}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-1 items-center justify-center">
                  <span className="font-body text-xs text-grey-3 px-2 text-center">
                    No pending invites
                  </span>
                </div>
              )
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <span className="font-body text-xs text-grey-3 px-2 text-center">
                  No suggestions
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Match Found modal — renders over the lobby at z-50 in "found" phase  */}
      {/* ------------------------------------------------------------------ */}
      <MatchFoundModal
        open={queuePhase === "found"}
        secondsRemaining={secondsRemaining}
        totalSeconds={MATCH_ACCEPT_SECONDS}
        onAccept={handleAcceptMatch}
        onDecline={handleDeclineMatch}
        subtitle="Summoner's Rift • Normal • 5v5"
        keyartSrc={DEMO_KEYART_SRC}
      />
    </div>
  );
}
