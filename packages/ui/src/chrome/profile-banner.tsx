"use client";

import { useId } from "react";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// ProfileBanner — left column on the Profile Overview page (~260px wide)
//
// Shows: summoner name (gold-1 display), level XP bar, large ornate medallion
// (~180px) holding the profile icon + level badge, V-ornament at banner bottom,
// and an optional small stat icon row at the very bottom.
//
// Ring implementation: scales the OrnateRing pattern from ProfileChip up to
// 180px. Uses useId() so SVG IDs are unique even if multiple instances mount
// (e.g. showcase variants on the same page).
// ---------------------------------------------------------------------------

export interface ProfileBannerStat {
  /** Small aria-hidden decorative icon node. */
  icon: ReactNode;
  /** Numeric count displayed next to the icon. */
  value: number;
  /** Accessible label for the stat (used on the wrapping element). */
  label: string;
}

export interface ProfileBannerProps {
  /** Summoner display name — gold-1, centered above the medallion. */
  name: string;
  /** Current summoner level — shown in XP bar pill and medallion badge. */
  level: number;
  /**
   * XP progress fraction in [0, 1]. 0 = empty bar, 1 = full bar.
   * Clamped to [0, 1] internally.
   */
  xpFraction: number;
  /** Resolved profile icon URL (pass `profileIconUrl(id)` from @low/fixtures). */
  profileIconSrc: string;
  /**
   * Optional stat row at the bottom of the banner.
   * Each entry: icon (ReactNode) + numeric value + accessible label.
   * Typically 3 entries (champions mastered, honor, rerolls etc.).
   */
  stats?: ProfileBannerStat[];
}

// ---------------------------------------------------------------------------
// OrnateRing — scaled up from profile-chip.tsx (~48px) to ~180px
// ---------------------------------------------------------------------------

function OrnateRingLarge({ size, uid }: { size: number; uid: string }) {
  const cx = size / 2;
  const cy = size / 2;

  // Two concentric rings: outer and inner, proportional to size.
  // Scaled from ProfileChip: outerR = size*0.5 - 2, innerR = outerR - 5
  const outerR = size * 0.5 - 3;
  const innerR = outerR - 6;
  const clipR  = innerR - 3; // clip circle for avatar

  const clipId = `${uid}-pbc`;
  const gradId = `${uid}-pbg`;

  // Finial ticks: cardinal pairs (6° apart) extending ~8px beyond outerR
  const tickStart = outerR + 3;
  const tickEnd   = outerR + 11;
  const cardinals = [0, 90, 180, 270];
  const tickOffsets = [-4, 4];

  const toXY = (angleDeg: number, r: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + Math.cos(rad) * r, y: cy + Math.sin(rad) * r };
  };

  // Ornamental corner arcs at 45° diagonals: small curved decorative marks
  const diagonals = [45, 135, 225, 315];
  const arcR = outerR + 6;
  const arcHalf = 8; // degrees spanning each small arc

  const ticks = cardinals.flatMap((base) =>
    tickOffsets.map((offset) => {
      const angle = base + offset;
      const s = toXY(angle, tickStart);
      const e = toXY(angle, tickEnd);
      return { x1: s.x, y1: s.y, x2: e.x, y2: e.y };
    }),
  );

  const cornerArcs = diagonals.map((base) => {
    const start = toXY(base - arcHalf, arcR);
    const end   = toXY(base + arcHalf, arcR);
    return `M ${start.x} ${start.y} A ${arcR} ${arcR} 0 0 1 ${end.x} ${end.y}`;
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--color-gold-3)" />
          <stop offset="60%"  stopColor="var(--color-gold-4)" />
          <stop offset="100%" stopColor="var(--color-gold-5)" />
        </linearGradient>
        <clipPath id={clipId}>
          <circle cx={cx} cy={cy} r={clipR} />
        </clipPath>
      </defs>

      {/* Outer ring */}
      <circle
        cx={cx} cy={cy} r={outerR}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={2.5}
      />
      {/* Inner ring */}
      <circle
        cx={cx} cy={cy} r={innerR}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={1.5}
        strokeOpacity={0.7}
      />
      {/* Cardinal finial tick pairs */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1} y1={t.y1}
          x2={t.x2} y2={t.y2}
          stroke={`url(#${gradId})`}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      ))}
      {/* Diagonal corner arcs */}
      {cornerArcs.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeOpacity={0.6}
        />
      ))}
    </svg>
  );
}

// Expose the clip radius formula so the parent can position the avatar image.
function ornateRingClipR(size: number): number {
  const outerR = size * 0.5 - 3;
  const innerR = outerR - 6;
  return innerR - 3;
}

// ---------------------------------------------------------------------------
// VOrnamant — decorative gold V-chevron at the bottom of the banner column
// ---------------------------------------------------------------------------

function VOrnament() {
  return (
    <svg
      aria-hidden="true"
      width="80"
      height="24"
      viewBox="0 0 80 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gold-4"
    >
      {/* Left arm */}
      <line x1="1" y1="1" x2="39" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Right arm */}
      <line x1="79" y1="1" x2="41" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Horizontal cap on left */}
      <line x1="1" y1="1" x2="12" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Horizontal cap on right */}
      <line x1="79" y1="1" x2="68" y2="1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx="40" cy="23" r="2" fill="currentColor" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// ProfileBanner
// ---------------------------------------------------------------------------

const MEDALLION_SIZE = 180;

/**
 * ProfileBanner — the left-column identity panel on the Profile Overview page.
 *
 * Renders: summoner name (font-display gold-1), level XP bar (blue-2 fill on
 * grey-3 track with gold level pill), large ornate ring medallion holding the
 * profile icon + level badge pill, a V-ornament at the bottom of the dark
 * banner card, and an optional small stat icon row.
 *
 * Presentational: all data is supplied via props. No data fetching.
 * Follows the ProfileChip OrnateRing pattern scaled to 180px, using useId()
 * for safe SVG ID namespacing.
 */
export function ProfileBanner({
  name,
  level,
  xpFraction,
  profileIconSrc,
  stats,
}: ProfileBannerProps) {
  const uid  = useId();
  const xpPct = `${Math.round(Math.min(1, Math.max(0, xpFraction)) * 100)}%`;
  const clipR = ornateRingClipR(MEDALLION_SIZE);

  return (
    <div
      data-shot="profile-banner"
      className="flex flex-col items-center"
      style={{ width: 260 }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Summoner name                                                        */}
      {/* ------------------------------------------------------------------ */}
      <h2 className="w-full truncate text-center font-display text-2xl text-gold-1 mt-4 mb-3 px-2">
        {name}
      </h2>

      {/* ------------------------------------------------------------------ */}
      {/* Level + XP bar row                                                  */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex w-full items-center gap-2 px-4 mb-5">
        {/* Level pill */}
        <span className="shrink-0 rounded-sm border border-gold-4 bg-grey-4 px-1.5 py-0.5 font-body text-xs leading-none text-gold-1 tabular-nums">
          {level}
        </span>
        {/* XP bar track */}
        <div
          aria-label={`XP: ${xpPct}`}
          role="progressbar"
          aria-valuenow={Math.round(xpFraction * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-grey-3"
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-blue-2 transition-[width] duration-300"
            style={{ width: xpPct }}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Dark banner card — holds medallion + V-ornament                     */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative flex w-full flex-col items-center border border-gold-5 bg-blue-7"
        style={{ minHeight: 260 }}
      >
        {/* Medallion — large ornate ring holding profile icon */}
        <div
          className="relative my-6 shrink-0"
          style={{ width: MEDALLION_SIZE, height: MEDALLION_SIZE }}
        >
          {/* Profile icon */}
          <img
            src={profileIconSrc}
            alt={`${name} profile icon`}
            width={MEDALLION_SIZE}
            height={MEDALLION_SIZE}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              borderRadius: "50%",
              clipPath: `circle(${Math.round(clipR)}px at center)`,
            }}
          />
          {/* Ornate ring overlay */}
          <OrnateRingLarge size={MEDALLION_SIZE} uid={uid} />
          {/* Level badge pill — bottom-center, overlapping ring bottom */}
          <span
            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-sm border border-gold-4 bg-grey-4 px-2 py-0.5 font-body text-xs leading-none text-gold-1 tabular-nums whitespace-nowrap"
            style={{ zIndex: 2 }}
          >
            {level}
          </span>
        </div>

        {/* V-ornament — gold hairlines at bottom of the dark panel */}
        <div className="mt-auto mb-3">
          <VOrnament />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Stat icon row — small glyphs + counts at very bottom of column      */}
      {/* ------------------------------------------------------------------ */}
      {stats && stats.length > 0 && (
        <div className="mt-3 flex items-center justify-center gap-5 px-2">
          {stats.map((s, i) => (
            <div
              key={i}
              aria-label={`${s.label}: ${s.value}`}
              className="flex flex-col items-center gap-0.5"
            >
              <span aria-hidden="true" className="text-grey-1">
                {s.icon}
              </span>
              <span className="font-body text-xs tabular-nums text-grey-2">
                {s.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
