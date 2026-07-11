"use client";

import { useId, useState } from "react";
import { GameModeCard } from "./game-mode-card";

// ---------------------------------------------------------------------------
// Crest SVGs — content, not part of the component
// Each uses currentColor so the parent's text-gold-* tint is inherited.
// useId() is called at the top of each component to ensure unique SVG ids.
// ---------------------------------------------------------------------------

/** Diamond-square crest — Summoner's Rift (square rotated ~15°, inner slash). */
export function SummonersRiftCrest() {
  const id = useId();
  const filterId = `${id}-glow`;
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
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer rotated square frame */}
      <rect
        x="22"
        y="22"
        width="86"
        height="86"
        rx="2"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        transform="rotate(15 65 65)"
        filter={`url(#${filterId})`}
      />
      {/* Inner rotated square */}
      <rect
        x="32"
        y="32"
        width="66"
        height="66"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        transform="rotate(15 65 65)"
        opacity="0.5"
      />
      {/* Diagonal slash — top-left to bottom-right */}
      <line
        x1="38"
        y1="38"
        x2="92"
        y2="92"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.7"
      />
      {/* Corner accent marks */}
      <line x1="20" y1="65" x2="30" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <line x1="100" y1="65" x2="110" y2="65" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
    </svg>
  );
}

/** Hourglass crest — Twisted Treeline (hourglass shape with blue accent). */
export function TwistedTreelineCrest() {
  const id = useId();
  const gradId = `${id}-grad`;
  const filterId = `${id}-glow`;
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
        <linearGradient id={gradId} x1="65" y1="20" x2="65" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.15" />
        </linearGradient>
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer hourglass outline */}
      <path
        d="M28 18 L102 18 L102 26 Q102 38 65 55 Q28 38 28 26 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill={`url(#${gradId})`}
        filter={`url(#${filterId})`}
      />
      <path
        d="M28 112 L102 112 L102 104 Q102 92 65 75 Q28 92 28 104 Z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill={`url(#${gradId})`}
        filter={`url(#${filterId})`}
      />
      {/* Narrow waist connector */}
      <line x1="65" y1="55" x2="65" y2="75" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      {/* Inner blue-tinted oval at waist */}
      <ellipse cx="65" cy="65" rx="14" ry="8" stroke="currentColor" strokeWidth="1.5" opacity="0.8" />
      {/* Side brackets */}
      <line x1="28" y1="18" x2="28" y2="112" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
      <line x1="102" y1="18" x2="102" y2="112" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    </svg>
  );
}

/** Parallelogram crest — ARAM (skewed rhombus, inner slash). */
export function AramCrest() {
  const id = useId();
  const filterId = `${id}-glow`;
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
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer parallelogram/skewed rectangle */}
      <path
        d="M42 18 L102 18 L88 112 L28 112 Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        filter={`url(#${filterId})`}
      />
      {/* Inner parallelogram */}
      <path
        d="M48 28 L94 28 L80 102 L34 102 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      {/* Diagonal slash */}
      <line
        x1="40"
        y1="35"
        x2="88"
        y2="95"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.7"
      />
      {/* Top accent bar */}
      <line x1="42" y1="18" x2="102" y2="18" stroke="currentColor" strokeWidth="4" opacity="0.5" />
    </svg>
  );
}

/** Shield crest — Teamfight Tactics (shield with stylized "A" emblem). */
export function TftCrest() {
  const id = useId();
  const filterId = `${id}-glow`;
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
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Outer shield — flat top, angled sides, pointed bottom */}
      <path
        d="M20 18 L110 18 L110 70 Q110 105 65 118 Q20 105 20 70 Z"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        filter={`url(#${filterId})`}
      />
      {/* Inner shield inset */}
      <path
        d="M28 26 L102 26 L102 70 Q102 98 65 110 Q28 98 28 70 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.4"
      />
      {/* Stylized "A" emblem */}
      {/* Left leg */}
      <line x1="48" y1="92" x2="65" y2="42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Right leg */}
      <line x1="82" y1="92" x2="65" y2="42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      {/* Crossbar */}
      <line x1="53" y1="74" x2="77" y2="74" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Top cap */}
      <path
        d="M60 38 L65 28 L70 38"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
        opacity="0.8"
      />
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
  icon: React.ReactNode;
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
