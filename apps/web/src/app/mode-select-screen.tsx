"use client";

import { useState, useId } from "react";
import { GameModeCard, QueueTypeList, HextechButton, TabBar } from "@low/ui";
import { gameModeMapUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Crest SVGs — duplicated from game-mode-card.demo.tsx (page-level content).
// Extract to a shared demo-assets module in apps/web if a third consumer emerges.
// ---------------------------------------------------------------------------

/** Diamond-square crest — Summoner's Rift (square rotated ~15°, inner slash). */
function SummonersRiftCrest() {
  return (
    <svg
      aria-hidden="true"
      width="130"
      height="130"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer rotated square frame — thick gold band, dark navy interior */}
      <rect
        x="24"
        y="24"
        width="82"
        height="82"
        rx="3"
        stroke="currentColor"
        strokeWidth="7"
        fill="var(--color-blue-7)"
        transform="rotate(15 65 65)"
      />
      {/* Inner thin frame line */}
      <rect
        x="34"
        y="34"
        width="62"
        height="62"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        transform="rotate(15 65 65)"
        opacity="0.7"
      />
      {/* Thick diagonal slash — top-left to bottom-right */}
      <line
        x1="43"
        y1="34"
        x2="94"
        y2="89"
        stroke="currentColor"
        strokeWidth="4"
        transform="rotate(15 65 65)"
      />
      {/* Edge tab notches (left/right of the frame, like the client crest) */}
      <rect x="16" y="60" width="10" height="10" fill="currentColor" transform="rotate(15 65 65)" />
      <rect x="104" y="60" width="10" height="10" fill="currentColor" transform="rotate(15 65 65)" />
    </svg>
  );
}

/** Hourglass crest — Twisted Treeline (hourglass shape with blue glowing core). */
function TwistedTreelineCrest() {
  const id = useId();
  const glowId = `${id}-blue-glow`;
  return (
    <svg
      aria-hidden="true"
      width="130"
      height="130"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Upper hourglass bulb — thick gold band, dark navy interior */}
      <path
        d="M26 16 L104 16 L104 26 Q104 40 65 58 Q26 40 26 26 Z"
        stroke="currentColor"
        strokeWidth="6"
        fill="var(--color-blue-7)"
        strokeLinejoin="round"
      />
      {/* Lower hourglass bulb */}
      <path
        d="M26 114 L104 114 L104 104 Q104 90 65 72 Q26 90 26 104 Z"
        stroke="currentColor"
        strokeWidth="6"
        fill="var(--color-blue-7)"
        strokeLinejoin="round"
      />
      {/* Blue glowing core at the waist */}
      <ellipse
        cx="65"
        cy="65"
        rx="18"
        ry="11"
        fill="var(--color-blue-3)"
        filter={`url(#${glowId})`}
      />
      <ellipse
        cx="65"
        cy="65"
        rx="18"
        ry="11"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Blue inner highlight */}
      <ellipse cx="60" cy="62" rx="7" ry="4" fill="var(--color-blue-2)" opacity="0.8" />
    </svg>
  );
}

/** Parallelogram crest — ARAM (skewed rhombus, inner slash). */
function AramCrest() {
  return (
    <svg
      aria-hidden="true"
      width="130"
      height="130"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer parallelogram — thick gold band, dark navy interior */}
      <path
        d="M44 18 L102 18 L86 112 L28 112 Z"
        stroke="currentColor"
        strokeWidth="7"
        fill="var(--color-blue-7)"
        strokeLinejoin="round"
      />
      {/* Inner thin frame line */}
      <path
        d="M51 28 L94 28 L79 102 L36 102 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      {/* Thick diagonal slash */}
      <line
        x1="46"
        y1="34"
        x2="86"
        y2="94"
        stroke="currentColor"
        strokeWidth="4"
      />
      {/* Corner notch accent — top-left */}
      <path d="M44 18 L56 18 L52 28 L51 28 Z" fill="currentColor" />
    </svg>
  );
}

/** Shield crest — Teamfight Tactics (shield with stylized "A" emblem). */
function TftCrest() {
  return (
    <svg
      aria-hidden="true"
      width="130"
      height="130"
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer shield — flat top with clipped corners, thick gold band, dark navy interior */}
      <path
        d="M32 16 L98 16 L108 26 L108 68 Q108 102 65 116 Q22 102 22 68 L22 26 Z"
        stroke="currentColor"
        strokeWidth="7"
        fill="var(--color-blue-7)"
        strokeLinejoin="round"
      />
      {/* Inner thin frame line */}
      <path
        d="M36 26 L94 26 L100 32 L100 66 Q100 94 65 106 Q30 94 30 66 L30 32 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      {/* Stylized "A" emblem — thick strokes */}
      <line x1="49" y1="92" x2="65" y2="40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="81" y1="92" x2="65" y2="40" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <line x1="54" y1="76" x2="76" y2="76" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// CdragonMapCrest — real map crest img from CommunityDragon parties plugin.
// The CDN PNGs are vertical two-frame atlases: active (lit) frame on top,
// inactive (dark) frame below. A fixed-size overflow-hidden container crops
// to one frame: the img is stretched to 200% height, top-anchored for the
// active frame, bottom-anchored for the inactive one. The active frame is
// shown when the card is selected or hovered (GameModeCard's root carries
// `group`; this crest renders as a descendant, so group-hover applies).
// ---------------------------------------------------------------------------

function CdragonMapCrest({
  map,
  active,
}: {
  map: "sr" | "ha" | "tft" | "tt";
  active: boolean;
}) {
  const frameClass =
    "absolute inset-x-0 h-[200%] w-full transition-opacity duration-150";
  return (
    <span
      aria-hidden="true"
      className="relative block h-32 w-32 overflow-hidden"
    >
      {/* Inactive (dark) frame — bottom half of the atlas */}
      <img
        src={gameModeMapUrl(map)}
        alt=""
        className={[
          frameClass,
          "bottom-0",
          active ? "opacity-0" : "opacity-100 group-hover:opacity-0",
        ].join(" ")}
        style={{ objectFit: "fill" }}
      />
      {/* Active (lit) frame — top half of the atlas */}
      <img
        src={gameModeMapUrl(map)}
        alt=""
        className={[
          frameClass,
          "top-0",
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        ].join(" ")}
        style={{ objectFit: "fill" }}
      />
    </span>
  );
}

// ---------------------------------------------------------------------------
// Mode data — page-level fixtures.
// Icons are real CommunityDragon map crests (parties plugin PNGs).
// ARAM maps to "ha" (Howling Abyss) in the parties CDN.
// ---------------------------------------------------------------------------

type ModeKey = "sr" | "tt" | "aram" | "tft";

const MODES = [
  { key: "sr" as ModeKey, countLabel: "5v5", name: "Summoner's Rift", map: "sr" as const },
  { key: "tt" as ModeKey, countLabel: "3v3", name: "Twisted Treeline", map: "tt" as const },
  { key: "aram" as ModeKey, countLabel: "5v5", name: "ARAM", map: "ha" as const },
  { key: "tft" as ModeKey, countLabel: "FFA", name: "Teamfight Tactics", map: "tft" as const },
];


const MODE_DESCRIPTIONS: Record<ModeKey, string> = {
  sr: "5v5 — Battle on the classic three-lane map. Destroy the enemy Nexus to win.",
  tt: "3v3 — Battle as a team of three to capture altars and siege the enemy nexus in this fast-paced game mode.",
  aram: "5v5 — All Random All Mid. One lane, random champions, non-stop teamfights.",
  tft: "FFA — Draft, position, and battle with champions and items in this auto-battler.",
};

const QUEUE_OPTIONS = [
  { id: "blind", label: "Blind Pick" },
  { id: "ranked-flex", label: "Ranked Flex", disabled: true, warning: true },
];

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
 * The user picks a game mode (Summoner's Rift, Twisted Treeline, ARAM, TFT)
 * and a queue type, then confirms to proceed to matchmaking.
 *
 * CO-OP VS AI and TRAINING tabs are "coming soon" — activeTab is always "pvp".
 *
 * Crest SVGs are duplicated from game-mode-card.demo.tsx (page-level content).
 * Extract to a shared demo-assets module in apps/web if a third consumer emerges.
 */
export function ModeSelectScreen({ onConfirm, onBack }: ModeSelectScreenProps) {
  const [selectedMode, setSelectedMode] = useState<ModeKey>("sr");
  const [selectedQueue, setSelectedQueue] = useState("blind");

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
              onSelect={() => setSelectedMode(mode.key)}
            />
          ))}
        </div>

        {/* Separator line — thin gold-5 horizontal line */}
        <div className="w-full max-w-3xl border-t border-gold-5 mb-6" />

        {/* Description + QueueTypeList — left-aligned under center cards */}
        <div className="w-full max-w-3xl">
          <p className="font-body text-sm text-grey-1 mb-4">
            {MODE_DESCRIPTIONS[selectedMode]}
          </p>
          <QueueTypeList
            options={QUEUE_OPTIONS}
            selectedId={selectedQueue}
            onSelect={setSelectedQueue}
            label="Queue type"
          />
        </div>
      </div>

      {/* Bottom CONFIRM strip */}
      <div className="relative z-10 flex h-20 shrink-0 items-center justify-center border-t border-gold-5">
        <HextechButton
          variant="primary"
          size="large"
          medallion={<ConfirmMedallion />}
          onClick={onConfirm}
        >
          Confirm
        </HextechButton>
      </div>
    </div>
  );
}
