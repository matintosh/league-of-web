"use client";

import { useState } from "react";
import { GameModeCard, QueueTypeList, HextechButton, TabBar, MapCrestImg } from "@low/ui";
import type { QueueOption } from "@low/ui";
import { gameModeMapUrl, lobbyButtonVideoUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// CdragonMapCrest — real map crest img from the CommunityDragon parties plugin.
//
// The CDN PNGs are vertical two-frame atlases: active (gold, lit) frame on top,
// inactive (grey) frame below. Per the current client (2025 reference,
// docs/reference/client-current-mode-select-2025.png) ALL cards show the GOLD
// (active) frame — unselected emblems are gold-lit, not grey (#467). We always
// render the active frame and distinguish the SELECTED card with extra
// brightness plus a subtle blue glow; unselected cards are gently dimmed and
// brighten on hover (GameModeCard's root carries `group`, so group-hover
// applies to this descendant).
// ---------------------------------------------------------------------------

function CdragonMapCrest({
  map,
  active,
}: {
  map: "sr" | "ha" | "tft" | "21";
  active: boolean;
}) {
  return (
    <MapCrestImg
      src={gameModeMapUrl(map)}
      frame="active"
      size={128}
      className={[
        "transition-[filter,opacity] duration-150",
        active
          ? // Selected: brightened + a soft blue drop-shadow glow (token var).
            "brightness-125 [filter:drop-shadow(0_0_10px_color-mix(in_srgb,var(--color-blue-2)_45%,transparent))]"
          : // Unselected: gold-lit but slightly dimmed; brighten on hover.
            "opacity-80 group-hover:opacity-100 group-hover:brightness-110",
      ].join(" ")}
    />
  );
}

// ---------------------------------------------------------------------------
// Mode data — page-level fixtures (VALUES here; the QueueOption *type* is
// imported from @low/ui). Icons are real CommunityDragon map crests (parties
// plugin PNGs): ARAM → "ha" (Howling Abyss), Arena → "21", per the current
// client lineup (docs/reference/client-current-mode-select-2025.png):
// Summoner's Rift · ARAM · Arena · Teamfight Tactics, with ARAM selected.
// ---------------------------------------------------------------------------

type ModeKey = "sr" | "aram" | "arena" | "tft";

const MODES: Array<{
  key: ModeKey;
  /** Player-count chip. Empty for Arena (2v2v2v2 FFA shows no chip in-client). */
  countLabel: string;
  name: string;
  map: "sr" | "ha" | "21" | "tft";
}> = [
  { key: "sr", countLabel: "5v5", name: "Summoner's Rift", map: "sr" },
  { key: "aram", countLabel: "5v5", name: "ARAM", map: "ha" },
  // Arena is 2v2v2v2 FFA — the client shows no count chip. A non-breaking space
  // reserves the chip line height so "ARENA" stays vertically aligned with its
  // siblings while displaying nothing.
  { key: "arena", countLabel: " ", name: "Arena", map: "21" },
  { key: "tft", countLabel: "FFA", name: "Teamfight Tactics", map: "tft" },
];

// Per-mode description body — matches the client's official mode-blurb tone.
// ARAM copy is verbatim from the reference (docs/reference/…mode-select-2025.png).
const MODE_DESCRIPTIONS: Record<ModeKey, string> = {
  sr: "Two teams of five battle across three lanes and the jungle to push through the enemy defenses and destroy their Nexus.",
  aram: "Ten randomly-selected champions assemble on a narrow bridge. Cross to the other side and destroy everything in your path.",
  arena: "Team up two-by-two and fight through a gauntlet of 2v2v2v2 rounds, upgrading with Augments until one duo is left standing.",
  tft: "Draft a squad of champions, arrange them on a board, and watch them auto-battle seven other players in a free-for-all last-one-standing race.",
};

// Per-mode featured queues (VALUES). The list is mode-specific, not a fixed
// global Blind/Ranked pair — the load-bearing case is ARAM's MAYHEM/ARAM pair
// (#468). First entry of each list is the default-selected queue on mode switch.
const MODE_QUEUES: Record<ModeKey, QueueOption[]> = {
  sr: [
    { id: "sr-draft", label: "Draft Pick" },
    { id: "sr-solo", label: "Ranked Solo/Duo" },
    { id: "sr-flex", label: "Ranked Flex" },
    { id: "sr-quick", label: "Quick Play" },
  ],
  aram: [
    { id: "aram-mayhem", label: "ARAM: Mayhem" },
    { id: "aram", label: "ARAM" },
  ],
  arena: [{ id: "arena", label: "Arena" }],
  tft: [
    { id: "tft-ranked", label: "Ranked TFT" },
    { id: "tft-normal", label: "Normal TFT" },
    { id: "tft-hyper", label: "Hyper Roll" },
    { id: "tft-double", label: "Double Up" },
  ],
};

/** Default (first) featured-queue id for a mode. Every list is non-empty. */
function defaultQueueId(mode: ModeKey): string {
  return MODE_QUEUES[mode][0]!.id;
}

const TABS = [
  { id: "pvp", label: "PVP" },
  { id: "coop", label: "CO-OP VS AI", disabled: true },
  { id: "training", label: "TRAINING", disabled: true },
  { id: "create", label: "CREATE CUSTOM", disabled: true, dividerBefore: true },
  { id: "join", label: "JOIN CUSTOM", disabled: true },
];

// ---------------------------------------------------------------------------
// ConfirmMedallion — decorative badge shown on the CONFIRM button
// ---------------------------------------------------------------------------

function ConfirmMedallion() {
  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-4 bg-blue-7 text-gold-1"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <line x1="3" y1="3" x2="11" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="11" y1="3" x2="3" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

// Real-client lobby (CONFIRM) button state videos (issue #454) — the native
// rcp-fe-lol-patcher lobby-button webms (CDragon patch 7.5), mapped 1:1 to the
// HextechButton `lobbyVideoSources` state machine. Module-level constant (stable
// identity) so the button's one-shot intro fires exactly once per mount.
const CONFIRM_VIDEO_SOURCES = {
  intro: lobbyButtonVideoUrl("intro"),
  hoverIntro: lobbyButtonVideoUrl("hoverIntro"),
  hoverLoop: lobbyButtonVideoUrl("hoverLoop"),
  hoverOutro: lobbyButtonVideoUrl("hoverOutro"),
  release: lobbyButtonVideoUrl("release"),
  magicRelease: lobbyButtonVideoUrl("magicRelease"),
  disabledIntro: lobbyButtonVideoUrl("disabledIntro"),
};

// ---------------------------------------------------------------------------
// ModeSelectScreen
// ---------------------------------------------------------------------------

export interface ModeSelectScreenProps {
  /** Called when CONFIRM is clicked — parent switches to matchmaking view */
  onConfirm: () => void;
  /** Called when back arrow is clicked — parent returns to home */
  onBack: () => void;
}

/**
 * ModeSelectScreen — PvP game mode selection step.
 *
 * Sits between the home screen and the matchmaking lobby.
 * The user picks a game mode (Summoner's Rift, ARAM, Arena, Teamfight Tactics)
 * and a featured queue, then confirms to proceed to matchmaking. ARAM is the
 * default-selected mode, matching the current client.
 *
 * CO-OP VS AI and TRAINING tabs are "coming soon" — activeTab is always "pvp".
 */
export function ModeSelectScreen({ onConfirm, onBack }: ModeSelectScreenProps) {
  const [selectedMode, setSelectedMode] = useState<ModeKey>("aram");
  // Featured queue is mode-specific — default to the first queue of the mode.
  const [selectedQueue, setSelectedQueue] = useState(defaultQueueId("aram"));

  // Switching mode adopts that mode's first (default) featured queue.
  function handleSelectMode(mode: ModeKey) {
    setSelectedMode(mode);
    setSelectedQueue(defaultQueueId(mode));
  }

  // CO-OP / TRAINING are coming soon — activeTab is always "pvp"
  const activeTab = "pvp";

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-hextech-black">
      {/*
       * Atmospheric background — Twisted Treeline / mode-select dark forest art.
       *
       * CDragon asset search result (2026-07): no standalone mode-select
       * background is exposed in rcp-fe-lol-parties, rcp-fe-lol-static-assets,
       * rcp-fe-lol-navigation, or rcp-fe-lol-game-select. The reference art
       * (bare tree silhouettes against a moonlit purple sky) appears to be baked
       * into the client shell and is not mirrored by CommunityDragon.
       *
       * Fallback: layered CSS gradient approximation, sampled from
       * docs/reference/client-pvp-mode-select.jpg. No raw hex values — all stops
       * use var(--color-*) references to @low/tokens custom properties.
       *
       * Tone map (reference sample → nearest token):
       *   Upper sky       #070711 → arcade-bg-dark  (#0d0520, deep purple)
       *   Mid-sky mist    #12101e → color-mix(arcade-bg-dark + blue-7, 50%)
       *   Tree silhouette #1d1c18 → grey-4           (#1e2328)
       *   Lower corners   #010a13 → hextech-black    (#010a13)
       *   Center glow     #1a1530 → color-mix(arcade-bg-dark + grey-4, 40%)
       */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: [
            /* Base: deep purple-dark sky (arcade-bg-dark = #0d0520, the purple tone in the reference) */
            `radial-gradient(ellipse 80% 60% at 50% 35%, color-mix(in srgb, var(--color-arcade-bg-dark) 60%, var(--color-blue-7) 40%) 0%, var(--color-arcade-bg-dark) 55%, var(--color-hextech-black) 100%)`,
            /* Mid-tone atmospheric fog band — faint warm-purple glow at center horizon */
            `radial-gradient(ellipse 50% 30% at 50% 55%, color-mix(in srgb, var(--color-arcade-bg-dark) 40%, var(--color-grey-4) 60%) 0%, transparent 70%)`,
            /* Corner darkening vignette — pulls corners to near-black */
            `radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, color-mix(in srgb, var(--color-hextech-black) 90%, transparent 10%) 100%)`,
          ].join(", "),
        }}
      />
      {/* Top-edge dark gradient — ensures header/tabbar text stays legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24"
        style={{
          background: `linear-gradient(to bottom, var(--color-hextech-black), transparent)`,
        }}
      />
      {/* Bottom-edge dark gradient — ensures CONFIRM strip text stays legible */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-32"
        style={{
          background: `linear-gradient(to top, var(--color-hextech-black), transparent)`,
        }}
      />

      {/* Back arrow header — above TabBar */}
      <header className="relative z-10 flex h-12 shrink-0 items-center gap-3 border-b border-gold-5 bg-blue-7/80 px-4">
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

        {/* Screen title */}
        <h1 className="font-display text-sm uppercase tracking-widest text-gold-1">
          Select Game Mode
        </h1>
      </header>

      {/* TabBar — full width, category navigation */}
      <div className="relative z-10">
        <TabBar
          tabs={TABS}
          activeId={activeTab}
          onSelect={() => {
            // Non-PVP tabs are coming soon — no-op (disabled tabs suppress onSelect anyway)
            console.log("Coming soon");
          }}
          label="Game category"
          trailing={
            <button
              type="button"
              aria-label="Ranked history"
              className="flex h-7 w-7 items-center justify-center border border-gold-5 text-grey-2 transition-colors duration-150 hover:text-gold-2 hover:border-gold-3"
            >
              {/* Trophy cup icon — approximate of the real client ranked history glyph */}
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Cup body */}
                <path
                  d="M4 2h8v5a4 4 0 0 1-8 0V2Z"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinejoin="round"
                />
                {/* Left handle */}
                <path
                  d="M4 3.5H2.5A1.5 1.5 0 0 0 2.5 6.5H4"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
                {/* Right handle */}
                <path
                  d="M12 3.5h1.5a1.5 1.5 0 0 1 0 3H12"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
                {/* Stem */}
                <line
                  x1="8"
                  y1="11"
                  x2="8"
                  y2="13"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
                {/* Base */}
                <line
                  x1="5.5"
                  y1="13"
                  x2="10.5"
                  y2="13"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          }
        />
      </div>

      {/* Main content — flex-1, centered */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8">
        {/* 4 GameModeCards row */}
        <div
          role="radiogroup"
          aria-label="Game mode"
          className="flex items-start justify-center gap-12 w-full mb-8"
        >
          {MODES.map((mode) => (
            <GameModeCard
              key={mode.key}
              icon={<CdragonMapCrest map={mode.map} active={selectedMode === mode.key} />}
              countLabel={mode.countLabel}
              name={mode.name}
              selected={selectedMode === mode.key}
              onSelect={() => handleSelectMode(mode.key)}
            />
          ))}
        </div>

        {/* Separator line — thin gold-5 horizontal line under the card row */}
        <div className="w-full max-w-3xl border-t border-gold-5 mb-6" />

        {/*
         * Description + featured-queue rows — left-aligned under center cards.
         * Per-mode body copy, then a thin gold rule, then the mode's featured
         * queues (e.g. ARAM: MAYHEM / ARAM) — matches the current client.
         */}
        <div className="w-full max-w-3xl">
          <p className="font-body text-sm text-grey-1 mb-4">
            {MODE_DESCRIPTIONS[selectedMode]}
          </p>
          {/* Gold rule between body and featured-queue rows */}
          <div className="border-t border-gold-5 mb-4" />
          <QueueTypeList
            options={MODE_QUEUES[selectedMode]}
            selectedId={selectedQueue}
            onSelect={setSelectedQueue}
            label="Featured queues"
          />
        </div>
      </div>

      {/* Bottom CONFIRM strip */}
      <div className="relative z-10 flex h-20 shrink-0 items-center justify-center border-t border-gold-5">
        <HextechButton
          variant="primary"
          size="large"
          medallion={<ConfirmMedallion />}
          lobbyVideoSources={CONFIRM_VIDEO_SOURCES}
          onClick={onConfirm}
        >
          Confirm
        </HextechButton>
      </div>
    </div>
  );
}
