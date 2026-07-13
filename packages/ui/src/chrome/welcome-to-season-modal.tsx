/**
 * WelcomeToSeasonModal — full-screen season-intro overlay.
 *
 * Appears the first time a player visits Profile → STATS at the start of a
 * new season. Covers ~80% of the viewport, dims the background, and must be
 * dismissed before the stats content is shown.
 *
 * Standalone component (not ModalFrame): the custom title/feature-column/CTA
 * layout is incompatible with ModalFrame's header+body+footer slot contract,
 * and dismiss is via the CTA only (no ✕ close button).
 *
 * Presentational: props in, callbacks out — no internal state.
 */
"use client";

import type { ReactElement } from "react";
import { HextechButton } from "./hextech-button";

/** Props for the WelcomeToSeasonModal overlay. */
export interface WelcomeToSeasonModalProps {
  /** Whether the modal is visible. When false, renders nothing. */
  open: boolean;
  /**
   * Season label, e.g. "2019". Drives title + CTA text.
   * Displayed uppercase via CSS; pass natural case.
   */
  season: string;
  /** Called when the player clicks "START SEASON!" — parent hides the modal. */
  onStart: () => void;
}

// ---------------------------------------------------------------------------
// Feature column data — fixed per the issue spec; not prop-driven because
// the content is season-invariant (position/history/rank features always shown).
// ---------------------------------------------------------------------------

const FEATURE_COLUMNS = [
  {
    id: "click",
    header: "CLICK",
    body: "Choose a position or a champion",
  },
  {
    id: "previous-seasons",
    header: "PREVIOUS SEASONS",
    body: "Check out and compare against stats of previous seasons",
  },
  {
    id: "compare",
    header: "COMPARE",
    body: "Click on a rank tier or the experts crown to compare with them",
  },
] as const;

// ---------------------------------------------------------------------------
// Art placeholders — three distinct placeholder tiles per the issue spec.
// CDragon rune-grid and rank-crown assets are not available; bg-blue-6 boxes
// with a decorative SVG glyph match the dark-tone look of the reference.
// ---------------------------------------------------------------------------

function ChampionRuneArt() {
  return (
    <div
      className="w-[130px] h-[130px] bg-blue-6 border border-gold-5 flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Rune grid placeholder — 3×3 grid of small diamond glyphs */}
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        {[0, 1, 2].flatMap((row) =>
          [0, 1, 2].map((col) => {
            const cx = 16 + col * 24;
            const cy = 16 + row * 24;
            return (
              <polygon
                key={`${row}-${col}`}
                points={`${cx},${cy - 8} ${cx + 8},${cy} ${cx},${cy + 8} ${cx - 8},${cy}`}
                fill="var(--color-blue-3)"
                stroke="var(--color-gold-5)"
                strokeWidth="0.75"
                opacity="0.7"
              />
            );
          })
        )}
      </svg>
    </div>
  );
}

function SeasonDropdownArt() {
  return (
    <div
      className="w-[140px] bg-blue-6 border border-grey-3 flex flex-col"
      aria-hidden="true"
    >
      {/* Dropdown open mock — list items + selected item below */}
      {["Current Season", "Recent 25 Games", "Recent 10 Games"].map((label) => (
        <div
          key={label}
          className="px-3 py-2 border-b border-grey-3/50 font-display text-[10px] uppercase tracking-wider text-gold-cream flex items-center justify-between"
        >
          <span>{label}</span>
          {label === "Current Season" && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
              <path d="M1 3.5L4 6.5L9 1" stroke="var(--color-gold-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      ))}
      {/* Selected item box */}
      <div className="px-3 py-2 bg-grey-4 border-t border-grey-3 font-display text-[10px] uppercase tracking-wider text-gold-cream">
        Season 2018
      </div>
    </div>
  );
}

function RankCrownArt() {
  return (
    <div
      className="w-[130px] h-[130px] bg-blue-6 border border-gold-5 flex items-center justify-center"
      aria-hidden="true"
    >
      {/* Crown orb placeholder — circular glow ring + crown silhouette */}
      <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
        {/* Outer glow ring */}
        <circle cx="45" cy="45" r="38" stroke="var(--color-blue-3)" strokeWidth="1.5" opacity="0.4" />
        <circle cx="45" cy="45" r="32" stroke="var(--color-gold-4)" strokeWidth="1" opacity="0.5" />
        {/* Crown shape */}
        <path
          d="M22 60 L22 42 L33 54 L45 30 L57 54 L68 42 L68 60 Z"
          fill="var(--color-gold-3)"
          stroke="var(--color-gold-2)"
          strokeWidth="1"
          strokeLinejoin="round"
          opacity="0.85"
        />
        {/* Crown base bar */}
        <rect x="21" y="60" width="48" height="5" rx="1" fill="var(--color-gold-4)" opacity="0.9" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Art component map — aligns with FEATURE_COLUMNS ids
// ---------------------------------------------------------------------------

const COLUMN_ART: Record<string, () => ReactElement> = {
  "click": ChampionRuneArt,
  "previous-seasons": SeasonDropdownArt,
  "compare": RankCrownArt,
};

// ---------------------------------------------------------------------------
// WelcomeToSeasonModal
// ---------------------------------------------------------------------------

export function WelcomeToSeasonModal({ open, season, onStart }: WelcomeToSeasonModalProps) {
  if (!open) return null;

  return (
    /* Backdrop scrim — z-50 paints above all app-level fixed elements */
    <div
      className="fixed inset-0 z-50 bg-hextech-black/70 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={`Welcome to Season ${season}`}
    >
      {/*
       * Panel — ~80% of viewport width, ~80% height.
       * bg-blue-7 matches the deep midnight-blue of the reference panel.
       * border-gold-5 gives the thin gold border visible in the screenshot.
       * max-w/max-h cap so it doesn't overflow at large viewports.
       */}
      <div className="w-[80vw] max-w-[980px] max-h-[80vh] bg-blue-7 border border-gold-5 flex flex-col items-center px-12 py-10 gap-8">

        {/* Header block */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="font-display uppercase tracking-widest text-gold-1 text-2xl">
            Welcome to Season {season}
          </h1>
          <p className="text-gold-cream text-sm">
            It&apos;s a brand new season, don&apos;t forget to use stats to find areas to improve on!
          </p>
        </div>

        {/* Three-column feature strip */}
        <div className="flex items-start justify-around w-full gap-8">
          {FEATURE_COLUMNS.map((col) => {
            const Art = COLUMN_ART[col.id];
            return (
              <div key={col.id} className="flex flex-col items-center gap-4 flex-1 min-w-0">
                {/* Art tile — centered, consistent height */}
                <div className="flex items-center justify-center h-[140px]">
                  {Art ? <Art /> : null}
                </div>
                {/* Column header */}
                <span className="font-display text-sm uppercase tracking-widest text-gold-2 text-center">
                  {col.header}
                </span>
                {/* Column body copy */}
                <p className="text-grey-1 text-xs leading-relaxed text-center max-w-[180px]">
                  {col.body}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA — gold-border rectangle via HextechButton secondary */}
        <HextechButton
          variant="secondary"
          size="large"
          onClick={onStart}
        >
          Start Season {season}!
        </HextechButton>
      </div>
    </div>
  );
}
