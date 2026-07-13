"use client";

/**
 * BanPhaseScreen — champion ban phase (1280×720).
 *
 * Sits between ACCEPT and the pick screen in the matchmaking flow:
 *   ACCEPT → BanPhaseScreen → PickScreen → LoadoutScreen → home
 *
 * Layout mirrors the pick screen (docs/reference/client-champ-select-pick.jpg):
 * - CountdownHeader at top: "Ban a Champion!" title, ~30s timer
 * - Left rail: 5 TeamPlayerRow stacked (same as pick screen)
 * - Center panel:
 *   - BanStatusStrip: 10 ban slots (5 ally + 5 enemy)
 *   - Filter bar: RoleSelector + "Sort By Name" HextechSelect + SearchInput
 *   - Champion grid: 6-column scrollable grid of ChampionPickTile
 *   - Selected champion name label + LockInButton variant="ban" (BAN button)
 * - Bottom strip: ChatPanel (220px, aligned with team rail) + 5V5 INTRO label
 *
 * v1 simplification (#275):
 *   - Ally team bans slot 0 (local player) then immediately transitions to PickScreen.
 *   - Slots 1–4 ally + all 5 enemy bans are pre-filled from banPhaseFixture.
 *   - Auto-ban fires at timer=0 (selected champion or DEFAULT_PICK_CHAMPION_ID).
 *
 * LockInButton reuse decision: variant="ban" prop added to LockInButton to
 * maintain the same trapezoid geometry while switching to the red gradient fill.
 * Colors use ban-red-1/2/3/press tokens from @low/tokens (added in this issue).
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  CountdownHeader,
  TeamPlayerRow,
  ChampionPickTile,
  LockInButton,
  BanStatusStrip,
  SearchInput,
  HextechSelect,
  ChatPanel,
  RoleSelector,
} from "@low/ui";
import type { ChatMessage, Role } from "@low/ui";
import {
  pickChampions,
  pickTeam,
  banPhaseFixture,
  DEFAULT_PICK_CHAMPION_ID,
  championSquareUrl,
  positionIconUrl,
} from "@low/fixtures";
import type { ChampionRole } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Total seconds for the ban phase countdown per turn. */
const BAN_SECONDS = 30;

// ---------------------------------------------------------------------------
// Role → CommunityDragon slug mapping (same as pick-screen)
// ---------------------------------------------------------------------------

const ROLE_TO_CDRAGON: Record<Role, "top" | "jungle" | "middle" | "bottom" | "utility"> = {
  top: "top",
  jungle: "jungle",
  mid: "middle",
  bottom: "bottom",
  support: "utility",
};

function banRoleIconSrc(role: Role, isSelected: boolean): string {
  return positionIconUrl(ROLE_TO_CDRAGON[role], isSelected ? "light" : undefined);
}

// ---------------------------------------------------------------------------
// Fixture chat messages
// ---------------------------------------------------------------------------

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "m1", text: "CallMeCallMeStar joined the lobby" },
  { id: "m2", text: "cherwood joined the lobby" },
  { id: "m3", text: "qlxHarlan joined the lobby" },
  { id: "m4", text: "HowarqLqUq joined the lobby" },
];

// ---------------------------------------------------------------------------
// Sort options
// ---------------------------------------------------------------------------

const SORT_OPTIONS = [{ value: "name", label: "Sort By Name" }];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BanPhaseScreenProps {
  /**
   * Called when the player has completed their ban (or the timer fires).
   * Transitions the shell to the pick screen.
   */
  onBanComplete: () => void;
}

// ---------------------------------------------------------------------------
// BanPhaseScreen
// ---------------------------------------------------------------------------

export function BanPhaseScreen({ onBanComplete }: BanPhaseScreenProps) {
  // ── Filter / search state ──────────────────────────────────────────────
  const [roleFilter, setRoleFilter] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy] = useState("name");

  // ── Champion selection ──────────────────────────────────────────────────
  const [selectedBanChampionId, setSelectedBanChampionId] = useState<string | null>(null);

  // ── Timer ───────────────────────────────────────────────────────────────
  const [secondsRemaining, setSecondsRemaining] = useState(BAN_SECONDS);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoBanFiredRef = useRef(false);

  // ── Chat ────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const nextMsgIdRef = useRef(INITIAL_MESSAGES.length + 1);

  // ── Timer start + cleanup ────────────────────────────────────────────────
  // Single effect: starts the interval on mount; return cleanup clears it on unmount.
  // This is the sole cleanup path — no separate cleanup-only effect needed.
  const clearCountdown = useCallback(() => {
    if (countdownRef.current !== null) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setSecondsRemaining((s) => Math.max(0, s - 1));
    }, 1000);

    return () => {
      if (countdownRef.current !== null) {
        clearInterval(countdownRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Auto-ban at countdown = 0 ─────────────────────────────────────────────
  useEffect(() => {
    if (secondsRemaining === 0 && !autoBanFiredRef.current) {
      autoBanFiredRef.current = true;
      clearCountdown();
      onBanComplete();
    }
  }, [secondsRemaining, clearCountdown, onBanComplete]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleBan = useCallback(() => {
    if (!selectedBanChampionId) return;
    clearCountdown();
    onBanComplete();
  }, [selectedBanChampionId, clearCountdown, onBanComplete]);

  const handleSend = useCallback((text: string) => {
    const id = `msg-${nextMsgIdRef.current++}`;
    setMessages((prev) => [...prev, { id, author: "cherwood", text }]);
  }, []);

  // ── Filtered / sorted champion list ──────────────────────────────────────

  const filteredChampions = pickChampions.filter((champ) => {
    if (roleFilter && !champ.roles.includes(roleFilter as ChampionRole)) {
      return false;
    }
    if (
      searchQuery.trim() &&
      !champ.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const sortedChampions = [...filteredChampions].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // ── Ban strip data — convert champion IDs to square image URLs ────────────

  const allyBanSrcs = banPhaseFixture.allyBans.map((id) =>
    id !== null ? championSquareUrl(id) : null
  );
  const enemyBanSrcs = banPhaseFixture.enemyBans.map((id) =>
    championSquareUrl(id)
  );

  // ── Selected champion display name ────────────────────────────────────────

  const selectedChampion = selectedBanChampionId
    ? pickChampions.find((c) => c.id === selectedBanChampionId)
    : null;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-hextech-black">
      {/* ------------------------------------------------------------------ */}
      {/* Background gradient — same dark vignette as pick screen             */}
      {/* ------------------------------------------------------------------ */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 80% 60% at 50% 110%, color-mix(in srgb, var(--color-blue-7) 20%, transparent) 0%, transparent 70%)",
              // Red tint overlay for ban phase context — uses ban-red-3 token
              "radial-gradient(ellipse 60% 40% at 50% 0%, color-mix(in srgb, var(--color-ban-red-3) 10%, transparent) 0%, transparent 60%)",
            ].join(", "),
          }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Top: CountdownHeader                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative shrink-0 flex items-start justify-center pt-3 px-4">
        <div style={{ width: 480 }}>
          <CountdownHeader
            title="Ban a Champion!"
            secondsRemaining={secondsRemaining}
            totalSeconds={BAN_SECONDS}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main body: left rail + center content                                */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Left: team rail — ~220px wide */}
        <aside
          className="relative flex flex-col justify-center divide-y divide-gold-5 px-3 shrink-0"
          style={{ width: 220 }}
          aria-label="Team"
        >
          {pickTeam.map((member) => (
            <TeamPlayerRow
              key={member.summonerName}
              state="picking"
              summonerName={member.summonerName}
              isSelf={member.isSelf}
            />
          ))}

          {/* Self-row countdown chip — same treatment as pick screen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-2"
            style={{
              top: "calc(40% + 10%)",
              transform: "translateY(-50%)",
            }}
          >
            <span
              className="flex items-center gap-0.5 bg-blue-2 px-1 py-0.5 font-display text-xs text-hextech-black"
              style={{ whiteSpace: "nowrap" }}
            >
              ◀ {secondsRemaining}
            </span>
          </div>
        </aside>

        {/* Center: ban strip + filter bar + grid + ban button */}
        <main className="flex flex-1 min-w-0 flex-col min-h-0 overflow-hidden px-3 py-2">
          {/* ── Ban status strip ──────────────────────────────────────────── */}
          <div className="shrink-0 border-b border-gold-5 pb-1 mb-2">
            <BanStatusStrip
              allyBanSrcs={allyBanSrcs}
              enemyBanSrcs={enemyBanSrcs}
              activeAllySlot={banPhaseFixture.activeAllySlot}
            />
          </div>

          {/* ── Filter bar ─────────────────────────────────────────────── */}
          <div className="flex shrink-0 items-center gap-2 pb-2">
            <RoleSelector
              selected={roleFilter}
              onSelect={(role) =>
                setRoleFilter((prev) => (prev === role ? null : role))
              }
              label="Filter by role"
              iconSrcFor={banRoleIconSrc}
            />
            <div className="flex-1" />
            <div style={{ width: 140 }}>
              <HextechSelect
                ariaLabel="Sort order"
                value={sortBy}
                onChange={() => {/* single option — no-op */}}
                options={SORT_OPTIONS}
              />
            </div>
            <div style={{ width: 160 }}>
              <SearchInput
                ariaLabel="Search champions"
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search"
              />
            </div>
          </div>

          {/* ── Champion grid — scrollable, 6 columns ──────────────────── */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}
              role="listbox"
              aria-label="Champion list"
            >
              {sortedChampions.map((champ) => (
                <ChampionPickTile
                  key={champ.id}
                  name={champ.name}
                  imageSrc={championSquareUrl(champ.id)}
                  selected={selectedBanChampionId === champ.id}
                  badge={champ.badge}
                  onSelect={() => setSelectedBanChampionId(champ.id)}
                />
              ))}
              {sortedChampions.length === 0 && (
                <div className="col-span-6 py-8 text-center font-body text-sm text-grey-2">
                  No champions match your filters.
                </div>
              )}
            </div>
          </div>

          {/* ── Selected champion name + BAN button ────────────────────── */}
          <div className="shrink-0 pt-2">
            {/* Champion name label — appears when a champion is hovered/selected */}
            <div className="pb-1 text-center" style={{ minHeight: "1.25rem" }}>
              {selectedChampion && (
                <span className="font-display text-sm tracking-widest uppercase text-gold-1">
                  {selectedChampion.name}
                </span>
              )}
            </div>
            <LockInButton
              disabled={!selectedBanChampionId}
              onLockIn={handleBan}
              label="Ban"
              variant="ban"
            />
          </div>
        </main>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Bottom strip: ChatPanel left | divider | center spacer | 5V5 right  */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative flex shrink-0 items-stretch border-t border-gold-5"
        style={{ height: 130 }}
      >
        {/* ChatPanel — left portion, 220px, aligned with team rail */}
        <div className="flex flex-col shrink-0" style={{ width: 220 }}>
          <ChatPanel
            messages={messages}
            onSend={handleSend}
            placeholder="Send a message…"
          />
        </div>

        {/* Divider */}
        <div className="w-px bg-gold-5 shrink-0" />

        {/* Center spacer */}
        <div className="flex-1" />

        {/* 5V5 INTRO label — bottom-right */}
        <div className="flex items-end justify-end px-4 pb-3 shrink-0">
          <span
            className="font-display tracking-widest text-gold-cream"
            style={{ fontSize: "0.9rem", textTransform: "uppercase" }}
          >
            5V5
            <br />
            Intro
          </span>
        </div>
      </div>
    </div>
  );
}
