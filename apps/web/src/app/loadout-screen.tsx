"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  CountdownHeader,
  TeamPlayerRow,
  SkinCarousel,
  SkinThumbStrip,
  ChatPanel,
} from "@low/ui";
import type { ChatMessage, SkinOption } from "@low/ui";
import {
  warwickLoadoutSkins,
  loadoutTeam,
  championSplashUrl,
  loadingArtUrl,
  championSquareUrl,
} from "@low/fixtures";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Total seconds for the loadout phase countdown. */
const LOADOUT_SECONDS = 60;

/**
 * Warwick skins for the carousel, built from the verified fixture.
 * splashSrc = championSplashUrl (1215×717 full splash)
 * thumbSrc  = loadingArtUrl     (308×560 loading art, used as thumb)
 * NOTE: spells are out of scope — champion square icons serve as
 * spell slot placeholders per issue #90.
 */
const WARWICK_SKINS: SkinOption[] = warwickLoadoutSkins.map((s) => ({
  name: s.name,
  thumbSrc: loadingArtUrl("Warwick", s.skinIndex),
  splashSrc: championSplashUrl("Warwick", s.skinIndex),
  locked: !s.owned,
}));

/**
 * Default selected index — Feral Warwick (index 2 in WARWICK_SKINS, skinIndex 5)
 * matches the reference screenshot.
 */
const DEFAULT_SKIN_INDEX = 2;

// ---------------------------------------------------------------------------
// Fixture chat messages — initial lobby join messages
// ---------------------------------------------------------------------------
const INITIAL_MESSAGES: ChatMessage[] = [
  { id: "m1", text: "CallMeCallMeStar joined the lobby" },
  { id: "m2", text: "cherwood joined the lobby" },
  { id: "m3", text: "qlxHarlan joined the lobby" },
  { id: "m4", text: "HowarqLqUq joined the lobby" },
];

// ---------------------------------------------------------------------------
// LoadoutScreen
// ---------------------------------------------------------------------------

export interface LoadoutScreenProps {
  /** Called when countdown reaches 0 or after the brief "entering game" beat. */
  onComplete: () => void;
}

/**
 * LoadoutScreen — champ-select loadout phase composition (1280×720).
 *
 * Layout:
 * - CountdownHeader centered at top (60 s, screen owns the interval)
 * - Left rail: 5 TeamPlayerRow stacked (fixture team from @low/fixtures)
 * - Center: SkinCarousel with 5 Warwick skins (selectedIndex lifted here)
 * - Bottom-left: ChatPanel with fixture join messages; onSend appends locally
 * - Bottom-right: "5V5 INTRO" label
 *
 * At 0 a brief "Entering game…" beat shows for 2 s, then onComplete fires.
 * All timers are owned by this screen; cleanup runs on unmount.
 *
 * Spell icons are out of scope — champion square icons serve as placeholders
 * in the spell slots per the issue spec.
 */
export function LoadoutScreen({ onComplete }: LoadoutScreenProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(LOADOUT_SECONDS);
  const [enteringGame, setEnteringGame] = useState(false);
  const [selectedSkinIndex, setSelectedSkinIndex] = useState(DEFAULT_SKIN_INDEX);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const enteringGameRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextMsgIdRef = useRef(INITIAL_MESSAGES.length + 1);

  // ---------------------------------------------------------------------------
  // Timer cleanup
  // ---------------------------------------------------------------------------

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

  // Unmount cleanup
  useEffect(() => {
    return () => {
      clearCountdown();
      clearEnteringGame();
    };
  }, [clearCountdown, clearEnteringGame]);

  // ---------------------------------------------------------------------------
  // Start countdown on mount
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Countdown reaches 0 → entering game beat → onComplete
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Chat send handler
  // ---------------------------------------------------------------------------

  const handleSend = useCallback((text: string) => {
    const id = `msg-${nextMsgIdRef.current++}`;
    setMessages((prev) => [
      ...prev,
      { id, author: "cherwood", text },
    ]);
  }, []);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-hextech-black">
      {/* ------------------------------------------------------------------ */}
      {/* Background: selected skin splash at low opacity                     */}
      {/* ------------------------------------------------------------------ */}
      <div className="pointer-events-none absolute inset-0">
        {WARWICK_SKINS[selectedSkinIndex] && (
          <img
            src={WARWICK_SKINS[selectedSkinIndex]!.splashSrc}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-center opacity-30"
          />
        )}
        {/* Dark vignette — heavier at edges, lighter in center */}
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

      {/* ------------------------------------------------------------------ */}
      {/* Top: CountdownHeader — centered, ~280px wide                        */}
      {/* ------------------------------------------------------------------ */}
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

      {/* ------------------------------------------------------------------ */}
      {/* Main body: left rail + center carousel                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
        {/* Left: team rail — ~220px wide, vertically stacked */}
        <aside
          className="flex flex-col justify-center divide-y divide-gold-5 px-3 shrink-0"
          style={{ width: 220 }}
          aria-label="Team"
        >
          {loadoutTeam.map((member) => (
            <TeamPlayerRow
              key={member.summonerName}
              state={member.state}
              summonerName={member.summonerName}
              championName={member.championName}
              portraitSrc={
                member.championId
                  ? championSquareUrl(member.championId)
                  : undefined
              }
              spellSrcs={
                member.championId
                  ? [
                      championSquareUrl(member.championId),
                      championSquareUrl(member.championId),
                    ]
                  : undefined
              }
              isSelf={member.isSelf}
            />
          ))}
        </aside>

        {/* Center: SkinCarousel — fills remaining space; thumb strip moves to bottom bar */}
        <main className="flex flex-1 min-w-0 items-center justify-center py-2">
          <SkinCarousel
            skins={WARWICK_SKINS}
            selectedIndex={selectedSkinIndex}
            onSelect={setSelectedSkinIndex}
            showThumbStrip={false}
            ringRadius={140}
          />
        </main>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Bottom strip: ChatPanel left | thumb strip center | 5V5 label right */}
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

        {/* Center: thumb strip — fills remaining space, vertically centered */}
        <div className="flex flex-1 items-center justify-center min-w-0">
          <SkinThumbStrip
            skins={WARWICK_SKINS}
            selectedIndex={selectedSkinIndex}
            onSelect={setSelectedSkinIndex}
          />
        </div>

        {/* 5V5 INTRO label — bottom-right, display font, CSS uppercase */}
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
