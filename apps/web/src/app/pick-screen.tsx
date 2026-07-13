"use client";

/**
 * PickScreen — champ-select pick phase (1280×720).
 *
 * Layout mirrors the reference screenshot (docs/reference/client-champ-select-pick.jpg):
 * - CountdownHeader at top: "Choose Your Champion!" title, ~80s timer
 * - Left rail: 5 TeamPlayerRow stacked — all "Picking..." at start; self row shows
 *   a teal countdown chip at right edge (v1: chip always on self row)
 * - Center:
 *   - Filter bar: RoleSelector (left) + "Sort By Name" HextechSelect + SearchInput (right)
 *   - Champion grid: 6-column scrollable grid of ChampionPickTile
 *   - LockInButton: disabled until a champion is selected
 * - Bottom-left: ChatPanel (fixture join messages)
 * - Bottom-right: "5V5 INTRO" label
 *
 * RoleSelector reuse decision: The lobby RoleSelector contract (selected: Role | null,
 * onSelect, disabledRoles, label) fits the pick filter use-case directly. REUSED.
 * It renders as a horizontal row of 5 glyph buttons — exact match for reference.
 *
 * Grid champions: defined in @low/fixtures pickChampions (30 champions matching
 * reference screenshot). Role filtering via pickChampion.roles array intersection.
 * Search filters by name (case-insensitive substring match).
 *
 * Auto-lock on timer=0: when countdown reaches 0, the screen auto-locks the
 * currently selected champion (selectedChampionId) or falls back to
 * DEFAULT_PICK_CHAMPION_ID (Morgana) if nothing is selected. This fires onLockIn
 * immediately — no "entering game" beat on the pick screen itself.
 *
 * Out of scope (noted per issue #132):
 * - Rune/summoner-spell picker bar ("Sorcery: The Calamity")
 * - Emote slots
 * - Ban phase
 * - Real-time opponent picks
 * - Sort options beyond default "Name" ascending
 */

import { useState, useEffect, useCallback, useRef } from "react";
import {
  CountdownHeader,
  TeamPlayerRow,
  ChampionPickTile,
  LockInButton,
  SearchInput,
  HextechSelect,
  ChatPanel,
  RoleSelector,
  ChampSelectActionBar,
} from "@low/ui";
import type { ChatMessage, Role } from "@low/ui";
import {
  pickChampions,
  pickTeam,
  DEFAULT_PICK_CHAMPION_ID,
  championSquareUrl,
  positionIconUrl,
  summonerSpellIconUrl,
} from "@low/fixtures";
import type { ChampionRole } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Total seconds for the pick phase countdown. */
const PICK_SECONDS = 80;

// ---------------------------------------------------------------------------
// Role → CommunityDragon slug mapping (mid→middle, support→utility)
// ---------------------------------------------------------------------------

const ROLE_TO_CDRAGON: Record<Role, "top" | "jungle" | "middle" | "bottom" | "utility"> = {
  top: "top",
  jungle: "jungle",
  mid: "middle",
  bottom: "bottom",
  support: "utility",
};

/**
 * Supplies real CommunityDragon position SVG URLs for the RoleSelector.
 * Selected role gets the "-light" (near-white) variant; unselected gets
 * the default gold variant (hardcoded #c8aa6e fills on dark bg).
 */
function pickRoleIconSrc(role: Role, isSelected: boolean): string {
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
// Sort options for HextechSelect
// ---------------------------------------------------------------------------
const SORT_OPTIONS = [{ value: "name", label: "Sort By Name" }];

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface PickScreenProps {
  /**
   * Called when the player locks in their champion.
   * Receives the DDragon champion id that was locked.
   */
  onLockIn: (championId: string) => void;
}

// ---------------------------------------------------------------------------
// PickScreen
// ---------------------------------------------------------------------------

export function PickScreen({ onLockIn }: PickScreenProps) {
  // ── Filter / search state ──────────────────────────────────────────────
  const [roleFilter, setRoleFilter] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy] = useState("name");

  // ── Champion selection ──────────────────────────────────────────────────
  const [selectedChampionId, setSelectedChampionId] = useState<string | null>(null);

  // ── Timer ───────────────────────────────────────────────────────────────
  const [secondsRemaining, setSecondsRemaining] = useState(PICK_SECONDS);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoLockFiredRef = useRef(false);

  // ── Chat ────────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const nextMsgIdRef = useRef(INITIAL_MESSAGES.length + 1);

  // ── Timer cleanup ────────────────────────────────────────────────────────
  const clearCountdown = useCallback(() => {
    if (countdownRef.current !== null) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearCountdown();
    };
  }, [clearCountdown]);

  // ── Start countdown on mount ─────────────────────────────────────────────
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

  // ── Auto-lock at countdown = 0 ───────────────────────────────────────────
  //
  // Method: a ref guard (autoLockFiredRef) ensures exactly-once firing even
  // if the effect re-renders. When seconds hit 0 we immediately lock the
  // selected champion or fall back to DEFAULT_PICK_CHAMPION_ID (Morgana).
  // This calls onLockIn which transitions the view to the loadout screen.
  useEffect(() => {
    if (secondsRemaining === 0 && !autoLockFiredRef.current) {
      autoLockFiredRef.current = true;
      clearCountdown();
      onLockIn(selectedChampionId ?? DEFAULT_PICK_CHAMPION_ID);
    }
  }, [secondsRemaining, selectedChampionId, clearCountdown, onLockIn]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleLockIn = useCallback(() => {
    if (!selectedChampionId) return;
    clearCountdown();
    onLockIn(selectedChampionId);
  }, [selectedChampionId, clearCountdown, onLockIn]);

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

  // Sort: name ascending (only supported sort; "name" default)
  const sortedChampions = [...filteredChampions].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-hextech-black">
      {/* ------------------------------------------------------------------ */}
      {/* Background gradient — dark vignette, no splash (pre-lock)           */}
      {/* ------------------------------------------------------------------ */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 80% 60% at 50% 110%, color-mix(in srgb, var(--color-blue-7) 30%, transparent) 0%, transparent 70%)",
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
            title="Choose Your Champion!"
            secondsRemaining={secondsRemaining}
            totalSeconds={PICK_SECONDS}
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

          {/* Self-row countdown chip — teal "◀ NN" at right edge of self row */}
          {/* Absolutely positioned over the self row (v1: always visible)     */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-2"
            style={{
              // Self row is index 2 (cherwood). Rail height = 5 rows.
              // Each row ≈ 100%/5 of rail height (flex justified).
              // Position from top: 2/5 = 40% + half row height = 50% = 40% + 10% = 50% center.
              // Use absolute inset via percentage: self row starts at 40%, height 20%.
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

        {/* Center: filter bar + grid + lock-in */}
        <main className="flex flex-1 min-w-0 flex-col min-h-0 overflow-hidden px-3 py-2">
          {/* ── Filter bar ─────────────────────────────────────────────── */}
          <div className="flex shrink-0 items-center gap-2 pb-2">
            {/* Role filter buttons — real CommunityDragon position SVGs.
                Default variant = gold fills; selected = light (near-white) variant. */}
            <RoleSelector
              selected={roleFilter}
              onSelect={(role) =>
                setRoleFilter((prev) => (prev === role ? null : role))
              }
              label="Filter by role"
              iconSrcFor={pickRoleIconSrc}
            />

            {/* Spacer */}
            <div className="flex-1" />

            {/* Sort by name select */}
            <div style={{ width: 140 }}>
              <HextechSelect
                ariaLabel="Sort order"
                value={sortBy}
                onChange={() => {/* single option — no-op */}}
                options={SORT_OPTIONS}
              />
            </div>

            {/* Search input */}
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
          {/* min-h-0 chain: flex-col parent → flex-1 min-h-0 here → overflow-y-auto grid */}
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
                  selected={selectedChampionId === champ.id}
                  badge={champ.badge}
                  onSelect={() => setSelectedChampionId(champ.id)}
                />
              ))}
              {sortedChampions.length === 0 && (
                <div
                  className="col-span-6 py-8 text-center font-body text-sm text-grey-2"
                >
                  No champions match your filters.
                </div>
              )}
            </div>
          </div>

          {/* ── Lock In button ──────────────────────────────────────────── */}
          <div className="shrink-0 pt-2">
            <LockInButton
              disabled={!selectedChampionId}
              onLockIn={handleLockIn}
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

        {/* Center: action bar — rune page, summoner spells, emote */}
        <div className="flex flex-1 items-center min-w-0">
          <ChampSelectActionBar
            runePageName="Sorcery: The Calamity"
            spellSrcs={[
              summonerSpellIconUrl("summoner_flash"),
              summonerSpellIconUrl("summoner_dot"),
            ]}
          />
        </div>

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
