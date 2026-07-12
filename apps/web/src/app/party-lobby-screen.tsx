"use client";

import { useState, useCallback } from "react";
import {
  LobbyHeader,
  PlayerBanner,
  RoleSlotRow,
  LockInButton,
  ChatPanel,
} from "@low/ui";
import type { ChatMessage, RoleSlot, WingTier, Role } from "@low/ui";
import {
  demoSummoner,
  demoFriends,
  pickTeam,
  profileIconUrl,
  positionIconUrl,
  gameModeMapUrl,
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
//
// Queue entry decision: the two picked roles (mid + support) are passed to
// the queue flow as-is. Role popover is out of scope per issue spec.
// Slot clicks cycle the displayed slot state but do not alter queue entry.
// ---------------------------------------------------------------------------

const SELF_ROLE_SLOTS: RoleSlot[] = [
  { role: "mid" },
  { role: "support" },
  { role: undefined },
];

// ---------------------------------------------------------------------------
// PartyLobbyScreen
// ---------------------------------------------------------------------------

export interface PartyLobbyScreenProps {
  /**
   * Called when the back chevron or the ✕ cancel button is clicked.
   * Both navigate back to the mode-select screen.
   */
  onBack: () => void;
  /**
   * Called when FIND MATCH is clicked. Transitions the parent to the queue
   * phase (queue → found → accept → pick chain is handled elsewhere).
   */
  onFindMatch: () => void;
  /**
   * Party open/closed state — OWNED BY THE SHELL (single source of truth,
   * shared with the rail's PartyStatusPanel so the header pill and the
   * panel always agree).
   */
  partyOpen: boolean;
  onPartyToggle: (open: boolean) => void;
}

/**
 * PartyLobbyScreen — the hi-fi pre-game party lobby phase.
 *
 * Composition zones:
 * - LobbyHeader (top): "SR · Normal Draft", SR map crest, back → mode-select,
 *   party-open pill toggle (page-level state).
 * - Center: 5 banner slots (L2 · L1 · SELF · R1 · R2).
 *   Self: isSelf=true, gold wings, crown, autofill chip, RoleSlotRow md
 *   (2 picked roles + 1 empty). Flanking 4: empty by default (SHOW_DEMO_PARTY=false).
 * - Bottom bar (height 120):
 *   Left (280px): ChatPanel with lobby fixture messages, input appends.
 *   Center (flex-1): ✕ cancel circle → mode-select; FIND MATCH (LockInButton, 200px
 *   wide); 2 dead circular icon buttons (role shield + ward eye glyphs, aria-disabled).
 *   Right (200px): "Suggested | Invited" tab strip (Suggested active, Invited dead)
 *   over an empty dark panel.
 *
 * Role strategy: self fixture roles are mid + support. Queue entry uses these
 * two roles. Popover picker is out of scope — documented here and in issue #155.
 *
 * Default: SHOW_DEMO_PARTY = false (solo lobby). Set to true at compile-time
 * for full composition screenshots. No runtime toggle UI is exposed.
 */
export function PartyLobbyScreen({ onBack, onFindMatch, partyOpen, onPartyToggle }: PartyLobbyScreenProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(LOBBY_MESSAGES);
  const [inviteTab, setInviteTab] = useState<"suggested" | "invited">("suggested");

  const handleSend = useCallback((text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: String(Date.now()), author: demoSummoner.gameName, text },
    ]);
  }, []);

  // Banner slot arrays (L2, L1 | SELF | R1, R2)
  // DEMO_PARTY is a 4-tuple so element access is always DemoPartyMember (not undefined).
  const leftMembers:  (DemoPartyMember | null)[] = SHOW_DEMO_PARTY
    ? [DEMO_PARTY[0] as DemoPartyMember, DEMO_PARTY[1] as DemoPartyMember]
    : [null, null];
  const rightMembers: (DemoPartyMember | null)[] = SHOW_DEMO_PARTY
    ? [DEMO_PARTY[2] as DemoPartyMember, DEMO_PARTY[3] as DemoPartyMember]
    : [null, null];

  return (
    <div className="flex h-full flex-col bg-hextech-black" data-shot="party-lobby">
      {/* ------------------------------------------------------------------ */}
      {/* LobbyHeader                                                          */}
      {/* ------------------------------------------------------------------ */}
      <LobbyHeader
        title="SR · Normal Draft"
        crestSrc={gameModeMapUrl("sr")}
        onBack={onBack}
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
            <PlayerBanner key={`le${i}`} name="" avatarSrc="" empty />
          ),
        )}

        {/* Self banner (center) */}
        <PlayerBanner
          name={demoSummoner.gameName}
          avatarSrc={profileIconUrl(demoSummoner.profileIconId)}
          wingTier="gold"
          isSelf
          autofillProtected
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
            <PlayerBanner key={`re${i}`} name="" avatarSrc="" empty />
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

        {/* Center: cancel ✕ + FIND MATCH + 2 dead icon buttons */}
        <div className="flex flex-1 items-center justify-center gap-3">
          {/* ✕ cancel → mode-select */}
          <button
            type="button"
            aria-label="Cancel — return to mode select"
            onClick={onBack}
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

          {/* FIND MATCH (LockInButton, 200px wide) */}
          <div style={{ width: 200 }}>
            <LockInButton label="Find Match" onLockIn={onFindMatch} />
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
          >
            <button
              type="button"
              role="tab"
              aria-selected={inviteTab === "suggested"}
              onClick={() => setInviteTab("suggested")}
              className={[
                "flex-1 px-2 py-1.5 font-display text-xs uppercase tracking-wider",
                "border-b-2 transition-colors duration-150 cursor-pointer",
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
              aria-selected={inviteTab === "invited"}
              aria-disabled="true"
              disabled
              className={[
                "flex-1 px-2 py-1.5 font-display text-xs uppercase tracking-wider",
                "border-b-2 border-transparent text-grey-3",
                "cursor-default opacity-50",
              ].join(" ")}
            >
              Invited
            </button>
          </div>

          {/* Empty dark list body */}
          <div className="flex flex-1 items-center justify-center bg-blue-7 bg-opacity-30">
            <span className="font-body text-xs text-grey-3 px-2 text-center">
              {inviteTab === "suggested"
                ? "No suggestions"
                : "No pending invites"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
