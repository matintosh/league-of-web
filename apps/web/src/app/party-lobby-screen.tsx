"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  LobbyHeader,
  PlayerBanner,
  RoleSlotRow,
  RolePickerPopover,
  LockInButton,
  ChatPanel,
  MatchFoundModal,
  formatQueueTime,
} from "@low/ui";
import type { ChatMessage, RoleSlot, WingTier, Role, PickableRole } from "@low/ui";
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
// Role icon resolvers — CommunityDragon position SVGs via positionIconUrl
// ---------------------------------------------------------------------------

const ROLE_TO_CDRAGON: Record<Role, "top" | "jungle" | "middle" | "bottom" | "utility"> = {
  top:     "top",
  jungle:  "jungle",
  mid:     "middle",
  bottom:  "bottom",
  support: "utility",
};

/** RoleSlotRow resolver: always gold (default) variant. */
function iconSrcFor(role: Role): string {
  return positionIconUrl(ROLE_TO_CDRAGON[role]);
}

/**
 * Maps PickableRole → CommunityDragon slug for the 5 named positions.
 * "fill" has no position icon; when this returns undefined the inline
 * FillGlyph (asterisk SVG) is rendered instead.
 */
const PICKABLE_TO_CDRAGON: Partial<Record<PickableRole, "top" | "jungle" | "middle" | "bottom" | "utility">> = {
  top:     "top",
  jungle:  "jungle",
  middle:  "middle",
  bottom:  "bottom",
  utility: "utility",
};

/**
 * RolePickerPopover iconSrcFor — returns CDragon URL with light variant for
 * hover/selected states. Returns undefined for "fill" (FillGlyph used).
 */
function pickerIconSrcFor(
  role: PickableRole,
  state: "default" | "hover" | "selected",
): string | undefined {
  const cdragonRole = PICKABLE_TO_CDRAGON[role];
  if (!cdragonRole) return undefined;
  return positionIconUrl(cdragonRole, state !== "default" ? "light" : undefined);
}

/**
 * Maps PickableRole → legacy RoleSlotRow Role type.
 * "fill" renders as an empty slot (undefined) since Role doesn't include fill.
 */
function pickableToSlotRole(r: PickableRole): Role | undefined {
  const map: Partial<Record<PickableRole, Role>> = {
    top:     "top",
    jungle:  "jungle",
    middle:  "mid",
    bottom:  "bottom",
    utility: "support",
  };
  return map[r];
}

// ---------------------------------------------------------------------------
// RolePickerTrigger — bottom-bar circle button that opens a role picker
// ---------------------------------------------------------------------------

/**
 * Circular trigger for a role slot.
 *
 * Shows the current role's CDragon icon when a role is picked; shows an
 * asterisk SVG for "fill"; shows a dashed empty-circle mark when unset.
 * Disabled while queueing — roles cannot change mid-queue.
 */
function RolePickerTrigger({
  role,
  label,
  isOpen,
  disabled,
  onClick,
}: {
  role: PickableRole | undefined;
  label: string;
  isOpen: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const cdragonRole = role && role !== "fill" ? PICKABLE_TO_CDRAGON[role] : undefined;
  const iconSrc = cdragonRole ? positionIconUrl(cdragonRole) : undefined;

  return (
    <button
      type="button"
      aria-label={`${label} role${role ? `: ${role}` : " (not set)"} — click to change`}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      disabled={disabled}
      onClick={onClick}
      className={[
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
        "border transition-colors duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
        disabled
          ? "cursor-not-allowed border-grey-4 bg-hextech-black text-grey-3 opacity-50"
          : isOpen
            ? "cursor-pointer border-gold-3 bg-gold-5/40 text-gold-1"
            : "cursor-pointer border-grey-3 bg-grey-4 text-grey-2 hover:border-gold-4 hover:text-gold-2",
      ].join(" ")}
    >
      {iconSrc ? (
        <img src={iconSrc} alt="" aria-hidden="true" width={20} height={20} />
      ) : role === "fill" ? (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none">
          <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="2.93" y1="6" x2="17.07" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="2.93" y1="14" x2="17.07" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ) : (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
        </svg>
      )}
    </button>
  );
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
// Self's initial role picks — fixture defaults (mutable via role picker)
// ---------------------------------------------------------------------------

const INITIAL_PRIORITY_ROLE: PickableRole = "middle";
const INITIAL_SECONDARY_ROLE: PickableRole = "utility";

// ---------------------------------------------------------------------------
// Queue constants
// ---------------------------------------------------------------------------

/** Dummy delay (ms) before auto-triggering match found: random 5–10 s */
function randomMatchDelay() {
  return (5 + Math.random() * 5) * 1000;
}

const MATCH_ACCEPT_SECONDS = 10;

/** Fixture estimated wait shown in FindingMatchPanel and ProfileChip. */

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
  // Role picker state
  //
  // openPicker: which slot's popover is open (null = none, 0 = Priority, 1 = Secondary).
  // Role picker triggers are disabled while queueing — the roles are already
  // submitted to matchmaking and cannot change mid-queue.
  // ---------------------------------------------------------------------------

  const [priorityRole, setPriorityRole] = useState<PickableRole>(INITIAL_PRIORITY_ROLE);
  const [secondaryRole, setSecondaryRole] = useState<PickableRole>(INITIAL_SECONDARY_ROLE);
  const [openPicker, setOpenPicker] = useState<0 | 1 | null>(null);

  // Outside-click ref — wraps the bottom-bar center section containing both
  // triggers and their popovers. Clicks outside this area close the open popover.
  const pickerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openPicker === null) return;
    function handleOutsideClick(e: MouseEvent) {
      if (pickerContainerRef.current && !pickerContainerRef.current.contains(e.target as Node)) {
        setOpenPicker(null);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openPicker]);

  const handlePickerTrigger = useCallback((slot: 0 | 1) => {
    setOpenPicker((prev) => (prev === slot ? null : slot));
  }, []);

  const handleRoleSelect = useCallback((slot: 0 | 1, role: PickableRole) => {
    if (slot === 0) setPriorityRole(role);
    else setSecondaryRole(role);
    setOpenPicker(null);
  }, []);

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
      {/*
       * Atmospheric background — party lobby dark forest art.
       *
       * CDragon asset search result (2026-07): no standalone lobby background is
       * exposed in rcp-fe-lol-parties, rcp-fe-lol-static-assets, or related plugins
       * (see the mode-select note in packages/fixtures/src/cdragon.ts — same result
       * applies here; rcp-fe-lol-parties only carries map crest PNGs + lottie/webm).
       * The forest art appears baked into the client shell.
       *
       * Fallback: layered CSS gradient approximation, sampled from
       * docs/reference/client-lobby-solo.jpg. Skews greener/teal than mode-select
       * (same family, different hue — forest greens vs. mode-select's purple).
       *
       * Tone map (reference sample → token composition):
       *   Upper sky      #050a0e → hextech-black   (#010a13, nearest darkest)
       *   Mid fog        #0b1a14 → color-mix(blue-5 #0a323c 50%, party-band #1a3a1a 50%)
       *   Ambient glow   #122416 → color-mix(party-band #1a3a1a 55%, hextech-black 45%)
       *   Tree silhouette #071209 → hextech-black   (near-black, absorbed at 100% stop)
       *
       * party-band (#1a3a1a) is the only forest-green token in the set — it was added
       * for the social rail's OPEN PARTY block and maps cleanly to the lobby's ambient hue.
       * No new tokens needed; all stops compose from existing palette.
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            /* Base: deep green-dark sky blending upward from near-black to forest-fog teal-green */
            `radial-gradient(ellipse 85% 65% at 50% 30%, color-mix(in srgb, var(--color-blue-5) 50%, var(--color-party-band) 50%) 0%, color-mix(in srgb, var(--color-party-band) 55%, var(--color-hextech-black) 45%) 45%, var(--color-hextech-black) 100%)`,
            /* Mid-depth atmospheric fog band — faint green ambient glow at horizon center */
            `radial-gradient(ellipse 55% 35% at 50% 55%, color-mix(in srgb, var(--color-party-band) 40%, var(--color-hextech-black) 60%) 0%, transparent 70%)`,
            /* Corner darkening vignette — pulls corners to near-black, keeps center readable */
            `radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, color-mix(in srgb, var(--color-hextech-black) 88%, transparent 12%) 100%)`,
          ].join(", "),
        }}
      />
      {/* Top-edge dark gradient — ensures LobbyHeader subbar text stays legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-20"
        style={{
          background: `linear-gradient(to bottom, var(--color-hextech-black), transparent)`,
        }}
      />
      {/* Bottom-edge dark gradient — ensures action bar / chat panel stays legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-28"
        style={{
          background: `linear-gradient(to top, var(--color-hextech-black), transparent)`,
        }}
      />

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
      <div className="relative z-10 flex flex-1 items-center justify-center gap-3 px-4">
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
            slots={[
              { role: pickableToSlotRole(priorityRole) },
              { role: pickableToSlotRole(secondaryRole) },
            ]}
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
        className="relative z-10 flex shrink-0 items-stretch border-t border-gold-5"
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

        {/* Center: cancel ✕ + [chips + FIND MATCH / In Queue] + Priority/Secondary role triggers */}
        {/* pickerContainerRef wraps all triggers + popovers for outside-click detection */}
        <div ref={pickerContainerRef} className="flex flex-1 items-center justify-center gap-3">
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

          {/* FIND MATCH slot: Autofill + Auto Accept chips stacked above button */}
          <div className="flex flex-col items-center gap-1" style={{ width: 200 }}>
            {/* Autofill activated chip — dead/decorative, aria-hidden */}
            <div
              aria-hidden="true"
              className="flex items-center gap-1 rounded-sm px-2 py-0.5 bg-blue-5/60"
            >
              {/* Blue info/warning triangle glyph */}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="shrink-0 text-blue-3"
              >
                <path
                  d="M5 1L9 8.5H1L5 1Z"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />
                <path
                  d="M5 4.5V6"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                />
                <circle cx="5" cy="7.2" r="0.4" fill="currentColor" />
              </svg>
              <span className="font-body text-[10px] text-grey-1 leading-none">
                Autofill activated
              </span>
            </div>

            {/* Auto Accept row — dead/decorative, aria-hidden */}
            <div
              aria-hidden="true"
              className="flex items-center gap-1 px-2 py-0.5"
            >
              {/* Diamond glyph */}
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="shrink-0 text-gold-2"
              >
                <path
                  d="M4 1L7 4L4 7L1 4Z"
                  stroke="currentColor"
                  strokeWidth="1.1"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-body text-[10px] text-grey-1 leading-none">
                Auto Accept
              </span>
            </div>

            {/* FIND MATCH / In Queue button */}
            <LockInButton
              label={isQueueing ? "In Queue" : "Find Match"}
              disabled={isQueueing}
              onLockIn={startQueue}
            />
          </div>

          {/* Priority role trigger + popover */}
          <div className="relative">
            <RolePickerTrigger
              role={priorityRole}
              label="Priority"
              isOpen={openPicker === 0}
              disabled={isQueueing}
              onClick={() => handlePickerTrigger(0)}
            />
            <RolePickerPopover
              open={openPicker === 0}
              slotLabel="Priority"
              selected={priorityRole}
              disabledRoles={[secondaryRole]}
              onSelect={(r) => handleRoleSelect(0, r)}
              onClose={() => setOpenPicker(null)}
              iconSrcFor={pickerIconSrcFor}
            />
          </div>

          {/* Secondary role trigger + popover */}
          <div className="relative">
            <RolePickerTrigger
              role={secondaryRole}
              label="Secondary"
              isOpen={openPicker === 1}
              disabled={isQueueing}
              onClick={() => handlePickerTrigger(1)}
            />
            <RolePickerPopover
              open={openPicker === 1}
              slotLabel="Secondary"
              selected={secondaryRole}
              disabledRoles={[priorityRole]}
              onSelect={(r) => handleRoleSelect(1, r)}
              onClose={() => setOpenPicker(null)}
              iconSrcFor={pickerIconSrcFor}
            />
          </div>
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
        crestSrc={gameModeMapUrl("sr")}
      />
    </div>
  );
}
