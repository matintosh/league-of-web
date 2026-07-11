"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";
import { GameModeCard } from "./game-mode-card";

// ---------------------------------------------------------------------------
// Crest SVGs — content, not part of the component
// Each uses currentColor so the parent's text-gold-* tint is inherited.
// TwistedTreelineCrest calls useId() to scope its SVG filter id; the other
// crests have no defs and don't need it.
// ---------------------------------------------------------------------------

/** Diamond-square crest — Summoner's Rift (square rotated ~15°, inner slash). */
export function SummonersRiftCrest() {
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
export function TwistedTreelineCrest() {
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
export function AramCrest() {
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
export function TftCrest() {
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
// Mode card row demo — clickable, 4 cards
// ---------------------------------------------------------------------------

type ModeKey = "sr" | "tt" | "aram" | "tft";

const MODES: Array<{
  key: ModeKey;
  countLabel: string;
  name: string;
  icon: ReactNode;
}> = [
  { key: "sr", countLabel: "5v5", name: "Summoner's Rift", icon: <SummonersRiftCrest /> },
  { key: "tt", countLabel: "3v3", name: "Twisted Treeline", icon: <TwistedTreelineCrest /> },
  { key: "aram", countLabel: "5v5", name: "ARAM", icon: <AramCrest /> },
  { key: "tft", countLabel: "FFA", name: "Teamfight Tactics", icon: <TftCrest /> },
];

/** Clickable 4-card game mode row — mirrors the PvP mode-select screen. */
export function GameModeCardRowDemo() {
  const [selected, setSelected] = useState<ModeKey>("tt");

  return (
    <div
      role="radiogroup"
      aria-label="Game mode"
      data-shot="mode-card-row"
      className="flex items-start justify-center gap-12 px-8 py-10 bg-hextech-black"
    >
      {MODES.map((mode) => (
        <GameModeCard
          key={mode.key}
          icon={mode.icon}
          countLabel={mode.countLabel}
          name={mode.name}
          selected={selected === mode.key}
          onSelect={() => setSelected(mode.key)}
        />
      ))}
    </div>
  );
}
