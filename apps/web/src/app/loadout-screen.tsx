"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  CountdownHeader,
  TeamPlayerRow,
  SkinCarousel,
  SkinThumbStrip,
  ChatPanel,
  ChampSelectActionBar,
} from "@low/ui";
import type { ChatMessage, SkinOption } from "@low/ui";
import {
  warwickLoadoutSkins,
  pickChampions,
  pickChampionSkins,
  pickTeam,
  championSplashUrl,
  loadingArtUrl,
  DEFAULT_PICK_CHAMPION_ID,
  summonerSpellIconUrl,
  championRingUrl,
} from "@low/fixtures";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Total seconds for the loadout phase countdown. */
const LOADOUT_SECONDS = 60;

// ---------------------------------------------------------------------------
// Skin helpers
// ---------------------------------------------------------------------------

/**
 * Build the SkinOption array for the chosen champion.
 *
 * Skin strategy:
 * - If the champion has entries in pickChampionSkins, use them.
 * - Otherwise fall back to base skin only (skinIndex 0).
 *
 * This covers all 30 pick-grid champions — only a subset have extended skins
 * (Morgana, Warwick, Kayle, Ryze). Others gracefully fall back to base.
 *
 * All grid champions use the DDragon loading-art URL pattern which only
 * requires verified base skin (index 0) — always returns 200.
 */
function buildSkins(championId: string): SkinOption[] {
  const skins = pickChampionSkins[championId];
  if (skins && skins.length > 0) {
    return skins.map((s) => ({
      name: s.name,
      thumbSrc: loadingArtUrl(championId, s.skinIndex),
      splashSrc: championSplashUrl(championId, s.skinIndex),
      locked: !s.owned,
    }));
  }
  // Fallback: base skin only
  const champEntry = pickChampions.find((c) => c.id === championId);
  const displayName = champEntry?.name ?? championId;
  return [
    {
      name: displayName,
      thumbSrc: loadingArtUrl(championId, 0),
      splashSrc: championSplashUrl(championId, 0),
      locked: false,
    },
  ];
}

/**
 * Warwick skins for the classic loadout (when loaded directly without a pick).
 * Kept for backward compatibility with the direct-loadout path.
 */
const WARWICK_SKINS: SkinOption[] = warwickLoadoutSkins.map((s) => ({
  name: s.name,
  thumbSrc: loadingArtUrl("Warwick", s.skinIndex),
  splashSrc: championSplashUrl("Warwick", s.skinIndex),
  locked: !s.owned,
}));

const DEFAULT_SKIN_INDEX = 2;

// ---------------------------------------------------------------------------
// Fixture spell assignments — one Flash+X combo per summoner (matches reference).
// ---------------------------------------------------------------------------

const PLAYER_SPELLS: Record<string, [string, string]> = {
  qlxHarlan:        [summonerSpellIconUrl("summoner_flash"), summonerSpellIconUrl("summoner_haste")],
  Oppeohtelar:      [summonerSpellIconUrl("summoner_flash"), summonerSpellIconUrl("summoner_exhaust")],
  cherwood:         [summonerSpellIconUrl("summoner_flash"), summonerSpellIconUrl("summonerignite")],
  HowarqLqUq:       [summonerSpellIconUrl("summoner_flash"), summonerSpellIconUrl("summonerbarrier")],
  CallMeCallMeStar: [summonerSpellIconUrl("summoner_flash"), summonerSpellIconUrl("summonermana")],
};

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
// Props
// ---------------------------------------------------------------------------

export interface LoadoutScreenProps {
  /** Called when countdown reaches 0 or after the brief "entering game" beat. */
  onComplete: () => void;
  /**
   * DDragon champion id chosen in the pick phase (e.g. "Morgana").
   * When provided: self row + SkinCarousel use this champion's skins.
   * When absent (direct-loadout path or regression): falls back to Warwick.
   */
  chosenChampionId?: string;
}

// ---------------------------------------------------------------------------
// LoadoutScreen
// ---------------------------------------------------------------------------

/**
 * LoadoutScreen — champ-select loadout phase composition (1280×720).
 *
 * Layout:
 * - CountdownHeader centered at top (60 s, screen owns the interval)
 * - Left rail: 5 TeamPlayerRow stacked
 *   - With pick phase: all 5 rows show locked champions from pickTeam fixture;
 *     self row shows the chosen champion.
 *   - Without pick phase (legacy/direct path): loadoutTeam fixture (Warwick).
 * - Center: SkinCarousel with the chosen champion's skins (or Warwick fallback)
 * - Bottom-left: ChatPanel with fixture join messages; onSend appends locally
 * - Bottom-right: "5V5 INTRO" label
 *
 * At 0 a brief "Entering game…" beat shows for 2 s, then onComplete fires.
 * All timers are owned by this screen; cleanup runs on unmount.
 *
 * Skin fallback: champions without entries in pickChampionSkins use base skin
 * only (skinIndex 0). This covers all 30 grid champions.
 */
export function LoadoutScreen({ onComplete, chosenChampionId }: LoadoutScreenProps) {
  // ── Skin data — computed from chosen champion (or Warwick fallback) ────
  const effectiveChampionId = chosenChampionId ?? "Warwick";
  const champSkins =
    chosenChampionId != null ? buildSkins(effectiveChampionId) : WARWICK_SKINS;
  const initialSkinIndex =
    chosenChampionId == null ? DEFAULT_SKIN_INDEX : 0;

  // ── State ────────────────────────────────────────────────────────────────
  const [secondsRemaining, setSecondsRemaining] = useState(LOADOUT_SECONDS);
  const [enteringGame, setEnteringGame] = useState(false);
  const [selectedSkinIndex, setSelectedSkinIndex] = useState(initialSkinIndex);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const enteringGameRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextMsgIdRef = useRef(INITIAL_MESSAGES.length + 1);

  // ── Timer cleanup ─────────────────────────────────────────────────────────

  const clearCountdown = useCallback(() => {
    if (countdownRef.current !== null) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  const clearEnteringGame = useCallback(() => {
    if (enteringGameRef.current !== null) {
      clearTimeout(enteringGameRef.current);
      enteringGameRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearCountdown();
      clearEnteringGame();
    };
  }, [clearCountdown, clearEnteringGame]);

  // ── Start countdown on mount ──────────────────────────────────────────────

  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setSecondsRemaining((s) => Math.max(0, s - 1));
    }, 1000);

    return () => {
      if (countdownRef.current !== null) {
        clearInterval(countdownRef.current);
      }
    };
    // Intentionally empty dep array — start once on mount only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Countdown reaches 0 → entering game beat → onComplete ────────────────

  useEffect(() => {
    if (secondsRemaining === 0 && !enteringGame) {
      clearCountdown();
      setEnteringGame(true);

      enteringGameRef.current = setTimeout(() => {
        setEnteringGame(false);
        onComplete();
      }, 2000);
    }
  }, [secondsRemaining, enteringGame, clearCountdown, onComplete]);

  // ── Chat handler ──────────────────────────────────────────────────────────

  const handleSend = useCallback((text: string) => {
    const id = `msg-${nextMsgIdRef.current++}`;
    setMessages((prev) => [...prev, { id, author: "cherwood", text }]);
  }, []);

  // ── Team rail data ─────────────────────────────────────────────────────────
  //
  // When a champion was chosen in the pick phase, use pickTeam fixture rows
  // (all locked, self row shows chosen champion). Otherwise use the original
  // loadoutTeam fixture for backward compatibility.
  const teamRows =
    chosenChampionId != null
      ? pickTeam.map((member) => {
          const champId = member.isSelf ? effectiveChampionId : member.lockedChampionId;
          const champName = member.isSelf
            ? (pickChampions.find((c) => c.id === effectiveChampionId)?.name ?? effectiveChampionId)
            : member.lockedChampionName;
          return {
            summonerName: member.summonerName,
            state: "locked" as const,
            championName: champName,
            championId: champId,
            isSelf: member.isSelf,
            spellSrcs: PLAYER_SPELLS[member.summonerName],
          };
        })
      : [
          { summonerName: "qlxHarlan", state: "picking" as const, championId: undefined, championName: undefined, isSelf: undefined, spellSrcs: PLAYER_SPELLS["qlxHarlan"] },
          { summonerName: "Oppeohtelar", state: "locked" as const, championName: "Ashe", championId: "Ashe", isSelf: undefined, spellSrcs: PLAYER_SPELLS["Oppeohtelar"] },
          { summonerName: "cherwood", state: "locked" as const, championName: "Warwick", championId: "Warwick", isSelf: true, spellSrcs: PLAYER_SPELLS["cherwood"] },
          { summonerName: "HowarqLqUq", state: "picking" as const, championId: undefined, championName: undefined, isSelf: undefined, spellSrcs: PLAYER_SPELLS["HowarqLqUq"] },
          { summonerName: "CallMeCallMeStar", state: "locked" as const, championName: "Kindred", championId: "Kindred", isSelf: undefined, spellSrcs: PLAYER_SPELLS["CallMeCallMeStar"] },
        ];

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-hextech-black">
      {/* Background: selected skin splash at low opacity */}
      <div className="pointer-events-none absolute inset-0">
        {champSkins[selectedSkinIndex] && (
          <img
            src={champSkins[selectedSkinIndex]!.splashSrc}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center opacity-30"
          />
        )}
        {/* Dark vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "linear-gradient(to bottom, var(--color-hextech-black) 0%, transparent 25%)",
              "linear-gradient(to top, var(--color-hextech-black) 0%, transparent 30%)",
              "linear-gradient(to right, var(--color-hextech-black) 0%, transparent 35%)",
              "linear-gradient(to left, var(--color-hextech-black) 0%, transparent 25%)",
            ].join(", "),
          }}
        />
      </div>

      {/* Top: CountdownHeader */}
      <div className="relative shrink-0 flex items-start justify-center pt-3 px-4">
        <div style={{ width: 480 }}>
          {enteringGame ? (
            <p className="font-display text-base uppercase tracking-widest text-gold-1 text-center py-4">
              Entering game…
            </p>
          ) : (
            <CountdownHeader
              title="Choose Your Loadout!"
              secondsRemaining={secondsRemaining}
              totalSeconds={LOADOUT_SECONDS}
            />
          )}
        </div>
      </div>

      {/* Main body: left rail + center carousel */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Left: team rail */}
        <aside
          className="flex flex-col justify-center divide-y divide-gold-5 px-3 shrink-0"
          style={{ width: 220 }}
          aria-label="Team"
        >
          {teamRows.map((member) => (
            <TeamPlayerRow
              key={member.summonerName}
              state={member.state}
              summonerName={member.summonerName}
              championName={member.championName}
              portraitSrc={
                member.championId ? loadingArtUrl(member.championId) : undefined
              }
              spellSrcs={member.spellSrcs}
              isSelf={member.isSelf}
            />
          ))}
        </aside>

        {/* Center: SkinCarousel */}
        <main className="flex flex-1 min-w-0 items-center justify-center py-2">
          <SkinCarousel
            skins={champSkins}
            selectedIndex={selectedSkinIndex}
            onSelect={setSelectedSkinIndex}
            showThumbStrip={false}
            ringRadius={140}
            ringDashedSrc={championRingUrl("dashed")}
            ringInnerLeftSrc={championRingUrl("inner-left")}
            ringOuterLeftSrc={championRingUrl("outer-left")}
          />
        </main>
      </div>

      {/* Bottom strip: ChatPanel left | action bar + thumb strip center | 5V5 label right */}
      <div
        className="relative flex shrink-0 items-stretch border-t border-gold-5"
        style={{ height: 130 }}
      >
        {/* ChatPanel */}
        <div className="flex flex-col shrink-0" style={{ width: 220 }}>
          <ChatPanel
            messages={messages}
            onSend={handleSend}
            placeholder="Send a message…"
          />
        </div>

        {/* Divider */}
        <div className="w-px bg-gold-5 shrink-0" />

        {/* Center: action bar (top) + skin thumb strip (bottom) */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Action bar row — ~52px */}
          <div className="flex items-center" style={{ height: 52 }}>
            <ChampSelectActionBar
              runePageName="Sorcery: The Calamity"
              spellSrcs={[
                summonerSpellIconUrl("summoner_flash"),
                summonerSpellIconUrl("summonerignite"),
              ]}
            />
          </div>
          {/* Horizontal separator */}
          <div className="h-px w-full bg-gold-5 shrink-0" />
          {/* Skin thumb strip row — remaining height */}
          <div className="flex flex-1 items-center justify-center min-w-0">
            <SkinThumbStrip
              skins={champSkins}
              selectedIndex={selectedSkinIndex}
              onSelect={setSelectedSkinIndex}
            />
          </div>
        </div>

        {/* 5V5 INTRO label */}
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
