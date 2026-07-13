"use client";

// ---------------------------------------------------------------------------
// StatsTab — Profile → STATS sub-tab content.
//
// Visual reference: docs/reference/client-profile-stats.jpg
//
// Layout:
//   Left sidebar (~280px):
//     - "PLAY STYLE" label
//     - SVG pentagon radar chart (5 axes: Fighter, Mage, Assassin, Support, Tank)
//     - "Season 2019" label
//     - Three stat values side-by-side with dividers (Games Played, Time Played, KDA Ratio)
//     - "Filter champions" search input
//     - Queues dropdown
//     - Current Season dropdown
//     - Most Played dropdown
//   Right column (flex-1):
//     - Summoner Search input (top-right within tab body)
//     - Empty state: Poro mascot SVG + two lines of body copy
//
// Presentational — props in, callbacks out, no data fetching.
// ---------------------------------------------------------------------------

import { useId } from "react";

// ---------------------------------------------------------------------------
// Public prop types
// ---------------------------------------------------------------------------

/** One vertex of the pentagon radar chart. */
export interface PlayStyleStat {
  /** Role label, e.g. "Fighter", "Mage". */
  role: string;
  /** 0–1 proportion for radar fill. */
  value: number;
}

/** Season aggregate stats. Null values render as "-" (empty state). */
export interface SeasonStats {
  gamesPlayed: number | null;
  /** Formatted string, e.g. "243h 12m". */
  timePlayed: string | null;
  /** Formatted string, e.g. "3.24". */
  kdaRatio: string | null;
}

export interface StatsTabProps {
  /** 5 play-style axes for the pentagon radar chart. */
  playstyle: PlayStyleStat[];
  /** Season label shown below the radar, e.g. "Season 2019". */
  seasonLabel: string;
  /** Aggregate season statistics. */
  seasonStats: SeasonStats;
  /** Value for the Summoner Search input (top-right). */
  searchValue: string;
  onSearchChange: (v: string) => void;
  /** Value for the "Filter champions" input. */
  championFilter: string;
  onChampionFilterChange: (v: string) => void;
}

// ---------------------------------------------------------------------------
// Inline SVG icons
// ---------------------------------------------------------------------------

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 8L10.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.5 3.5L5 6.5L7.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Globe-like icon representing a role vertex — used for the "Support" axis. */
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.1" />
      <path d="M8 1.5 Q10.5 5 10.5 8 Q10.5 11 8 14.5" stroke="currentColor" strokeWidth="0.9" />
      <path d="M8 1.5 Q5.5 5 5.5 8 Q5.5 11 8 14.5" stroke="currentColor" strokeWidth="0.9" />
      <path d="M1.5 8h13" stroke="currentColor" strokeWidth="0.9" />
    </svg>
  );
}

/** Sword crossed icon for Fighter */
function SwordIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M3 13L13 3M13 3H9.5M13 3V6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 9.5L2 12.5L5 11.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Staff / wand icon for Mage */
function StaffIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <line x1="8" y1="14" x2="8" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="3.5" r="2" stroke="currentColor" strokeWidth="1.1" />
      <path d="M5.5 6L3 7.5M10.5 6L13 7.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

/** Dagger icon for Assassin */
function DaggerIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M8 2L10 6H8.5V13H7.5V6H6L8 2Z" stroke="currentColor" strokeWidth="0.9" fill="none" strokeLinejoin="round" />
      <path d="M6 9H10" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

/** Shield icon for Tank */
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M8 2L3 4.5V8C3 11.5 5.5 13.5 8 14C10.5 13.5 13 11.5 13 8V4.5L8 2Z" stroke="currentColor" strokeWidth="1.1" fill="none" />
    </svg>
  );
}

/** Role vertex icons indexed to the 5 pentagon axes. */
const ROLE_ICONS = [SwordIcon, StaffIcon, DaggerIcon, GlobeIcon, ShieldIcon];

// ---------------------------------------------------------------------------
// Poro mascot SVG (empty state)
// ---------------------------------------------------------------------------

function PoroIcon() {
  return (
    <svg
      aria-hidden="true"
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-grey-2 opacity-50"
    >
      {/* Body */}
      <ellipse cx="60" cy="72" rx="34" ry="28" fill="currentColor" opacity="0.18" />
      <ellipse cx="60" cy="72" rx="34" ry="28" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Head */}
      <circle cx="60" cy="46" r="26" fill="currentColor" opacity="0.18" />
      <circle cx="60" cy="46" r="26" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Eyes */}
      <circle cx="50" cy="42" r="5" fill="currentColor" opacity="0.6" />
      <circle cx="70" cy="42" r="5" fill="currentColor" opacity="0.6" />
      <circle cx="52" cy="40" r="2" fill="currentColor" opacity="0.9" />
      <circle cx="72" cy="40" r="2" fill="currentColor" opacity="0.9" />
      {/* Nose */}
      <ellipse cx="60" cy="50" rx="5" ry="3" fill="currentColor" opacity="0.5" />
      {/* Ears */}
      <ellipse cx="35" cy="26" rx="8" ry="12" stroke="currentColor" strokeWidth="1.2" fill="none" transform="rotate(-20 35 26)" />
      <ellipse cx="85" cy="26" rx="8" ry="12" stroke="currentColor" strokeWidth="1.2" fill="none" transform="rotate(20 85 26)" />
      {/* Snout tufts */}
      <path d="M42 52 Q38 54 34 52" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M78 52 Q82 54 86 52" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      {/* Bottom paws */}
      <ellipse cx="42" cy="96" rx="10" ry="6" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.15" />
      <ellipse cx="78" cy="96" rx="10" ry="6" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Radar chart — circular ring redesign
//
// Reference: docs/reference/client-profile-stats.jpg
//
// Color mapping (reference hex → nearest token):
//   #494641  outer ring stroke  → var(--color-grey-3)  (#3c3c41, Δ≈7)
//   warm gold polygon stroke   → var(--color-gold-cream) (#cdbe91)
//   dark polygon fill          → color-mix(in srgb, var(--color-grey-4) 70%, transparent)
//   spoke lines                → var(--color-grey-3) (#3c3c41)
//   diamond ticks              → var(--color-grey-1) (#a09b8c)
//   role icons                 → var(--color-grey-1)
// ---------------------------------------------------------------------------

/** Compute (x, y) for a point on a circle at a given axis index (0–N). */
function circlePoint(
  cx: number,
  cy: number,
  r: number,
  idx: number,
  total: number,
): [number, number] {
  // Start from the top (−π/2) and go clockwise
  const angle = (2 * Math.PI * idx) / total - Math.PI / 2;
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

function pointsStr(pts: [number, number][]): string {
  return pts.map(([x, y]) => `${x},${y}`).join(" ");
}

interface RadarChartProps {
  playstyle: PlayStyleStat[];
  /** Radius of the outer ring (not including icon clearance). Default 68. */
  size?: number;
}

function RadarChart({ playstyle, size = 68 }: RadarChartProps) {
  // svgSize keeps the same 184×184 footprint that was review-verified against spec.
  // cx/cy = 92, ring radius = 68, leaving 24px margin on each side for icons.
  const cx = size + 24;
  const cy = size + 24;
  const svgSize = (size + 24) * 2; // 184 at default size=68
  const TOTAL = 5;

  // Diamond tick half-size (rotated square at each axis position)
  const TICK = 5;

  // Points where each axis meets the outer ring
  const ringPts = Array.from({ length: TOTAL }, (_, i) =>
    circlePoint(cx, cy, size, i, TOTAL),
  );

  // Filled polygon from playstyle values — clamped to [0.05, 1] so the shape
  // is always visible even in the empty/flat state.
  const fillPts = playstyle.slice(0, TOTAL).map((stat, i) =>
    circlePoint(
      cx,
      cy,
      size * Math.max(0.05, Math.min(1, stat.value)),
      i,
      TOTAL,
    ),
  );

  // Icon positions — slightly outside the ring
  const iconRadius = size + 14;
  const iconPts = Array.from({ length: TOTAL }, (_, i) =>
    circlePoint(cx, cy, iconRadius, i, TOTAL),
  );

  return (
    <svg
      aria-hidden="true"
      width={svgSize}
      height={svgSize}
      viewBox={`0 0 ${svgSize} ${svgSize}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Radial spoke lines — solid, center → ring edge */}
      {ringPts.map(([x, y], i) => (
        <line
          key={`spoke-${i}`}
          x1={cx}
          y1={cy}
          x2={x}
          y2={y}
          stroke="var(--color-grey-3)"
          strokeWidth="0.8"
        />
      ))}

      {/* Outer circular ring */}
      <circle
        cx={cx}
        cy={cy}
        r={size}
        stroke="var(--color-grey-3)"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Filled data polygon — dark fill + warm-gold stroke */}
      <polygon
        points={pointsStr(fillPts)}
        fill="color-mix(in srgb, var(--color-grey-4) 70%, transparent)"
        stroke="var(--color-gold-cream)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Diamond tick marks at each axis position on the ring */}
      {ringPts.map(([x, y], i) => (
        <rect
          key={`tick-${i}`}
          x={x - TICK / 2}
          y={y - TICK / 2}
          width={TICK}
          height={TICK}
          transform={`rotate(45 ${x} ${y})`}
          fill="var(--color-grey-3)"
          stroke="var(--color-grey-1)"
          strokeWidth="0.8"
        />
      ))}

      {/* Role icons outside the ring at each axis */}
      {iconPts.map(([x, y], i) => {
        const Icon = ROLE_ICONS[i % ROLE_ICONS.length] ?? SwordIcon;
        return (
          <foreignObject
            key={`icon-${i}`}
            x={x - 8}
            y={y - 8}
            width="16"
            height="16"
          >
            <Icon className="text-grey-1" />
          </foreignObject>
        );
      })}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// FilterDropdown — a thin select-styled dropdown button
// ---------------------------------------------------------------------------

interface FilterDropdownProps {
  label: string;
  id: string;
}

function FilterDropdown({ label, id }: FilterDropdownProps) {
  return (
    <div className="relative flex w-full items-center">
      <select
        id={id}
        aria-label={label}
        defaultValue=""
        className={[
          "w-full appearance-none rounded-none border border-grey-3 bg-blue-8 px-3 py-1.5 pr-8",
          "font-body text-xs text-grey-1 placeholder:text-grey-3",
          "outline-none focus:border-gold-4",
          "cursor-default",
        ].join(" ")}
      >
        <option value="" disabled>{label}</option>
        <option value="all">All</option>
      </select>
      <span className="pointer-events-none absolute right-2 text-grey-2">
        <ChevronIcon />
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// StatsTab
// ---------------------------------------------------------------------------

/**
 * StatsTab — Profile → STATS sub-tab content.
 *
 * Left sidebar: "PLAY STYLE" label, pentagon radar chart, season label,
 * three stat values (Games Played / Time Played / KDA Ratio), filter controls.
 *
 * Right column: Summoner Search input (top-right) + Poro empty-state mascot.
 *
 * Presentational — props in, callbacks out, no data fetching.
 *
 * @param playstyle            5 role/value pairs for the radar pentagon.
 * @param seasonLabel          Label below chart, e.g. "Season 2019".
 * @param seasonStats          Aggregate stats; null values render as "-".
 * @param searchValue          Summoner Search input value.
 * @param onSearchChange       Fired on each summoner search keystroke.
 * @param championFilter       Champion filter input value.
 * @param onChampionFilterChange Fired on each champion filter keystroke.
 */
export function StatsTab({
  playstyle,
  seasonLabel,
  seasonStats,
  searchValue,
  onSearchChange,
  championFilter,
  onChampionFilterChange,
}: StatsTabProps) {
  const searchId = useId();
  const champFilterId = useId();
  const queuesId = useId();
  const seasonDropId = useId();
  const mostPlayedId = useId();

  const { gamesPlayed, timePlayed, kdaRatio } = seasonStats;

  return (
    <div
      data-shot="profile-stats-tab"
      className="flex h-full min-h-0 w-full bg-blue-7"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Left sidebar (~280px)                                               */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex w-[280px] shrink-0 flex-col items-center border-r border-gold-5 bg-hextech-black px-4 pb-4 pt-4"
      >
        {/* "PLAY STYLE" heading */}
        <p className="mb-3 font-display text-sm uppercase tracking-widest text-grey-1 text-center">
          Play Style
        </p>

        {/* Radar chart */}
        <div className="flex items-center justify-center">
          <RadarChart playstyle={playstyle} size={68} />
        </div>

        {/* Season label */}
        <p className="mt-2 font-display text-xs uppercase tracking-wider text-grey-2">
          {seasonLabel}
        </p>

        {/* Decorative divider */}
        <div className="my-2 h-px w-full bg-gold-5 opacity-50" />

        {/* Stats row: Games Played / Time Played / KDA Ratio */}
        <div className="flex w-full items-start justify-center">
          {/* Games Played */}
          <div className="flex flex-1 flex-col items-center gap-0.5">
            <span className="font-display text-xl text-gold-1">
              {gamesPlayed !== null ? gamesPlayed : "-"}
            </span>
            <span className="font-body text-[10px] text-grey-2 text-center leading-tight">
              Games Played
            </span>
          </div>

          {/* Divider */}
          <div className="mx-1 mt-1 h-8 w-px shrink-0 bg-gold-5" />

          {/* Time Played */}
          <div className="flex flex-1 flex-col items-center gap-0.5">
            <span className="font-display text-xl text-gold-1">
              {timePlayed !== null ? timePlayed : "-"}
            </span>
            <span className="font-body text-[10px] text-grey-2 text-center leading-tight">
              Time Played
            </span>
          </div>

          {/* Divider */}
          <div className="mx-1 mt-1 h-8 w-px shrink-0 bg-gold-5" />

          {/* KDA Ratio */}
          <div className="flex flex-1 flex-col items-center gap-0.5">
            <span className="font-display text-xl text-gold-1">
              {kdaRatio !== null ? kdaRatio : "-"}
            </span>
            <span className="font-body text-[10px] text-grey-2 text-center leading-tight">
              KDA Ratio
            </span>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="my-3 h-px w-full bg-gold-5 opacity-50" />

        {/* Filter champions search input */}
        <div className="relative flex w-full items-center">
          <span className="pointer-events-none absolute left-3 text-grey-2">
            <SearchIcon />
          </span>
          <input
            id={champFilterId}
            type="text"
            placeholder="Filter champions"
            aria-label="Filter champions"
            value={championFilter}
            onChange={(e) => onChampionFilterChange(e.target.value)}
            className={[
              "w-full rounded-none border border-grey-3 bg-blue-8 py-1.5 pl-8 pr-3",
              "font-body text-xs text-grey-1 placeholder:text-grey-3",
              "outline-none focus:border-gold-4",
            ].join(" ")}
          />
        </div>

        {/* Dropdowns */}
        <div className="mt-2 flex w-full flex-col gap-2">
          <FilterDropdown label="Queues" id={queuesId} />
          <FilterDropdown label="Current Season" id={seasonDropId} />
          <FilterDropdown label="Most Played" id={mostPlayedId} />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Right column (flex-1)                                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="relative flex flex-1 min-w-0 flex-col">
        {/* Summoner Search — top-right within tab body */}
        <div className="absolute top-3 right-3 z-10 flex items-center">
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-2 text-grey-2">
              <SearchIcon />
            </span>
            <input
              id={searchId}
              type="text"
              placeholder="Summoner Search"
              aria-label="Summoner Search"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className={[
                "h-8 w-52 rounded-none border border-grey-3 bg-blue-8 pl-7 pr-3",
                "font-body text-xs text-grey-1 placeholder:text-grey-3",
                "outline-none focus:border-gold-4",
              ].join(" ")}
            />
          </div>
        </div>

        {/* Empty state — Poro mascot centred */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8">
          <PoroIcon />
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="font-body text-sm text-grey-2">
              No ranked or normal games played this season.
            </p>
            <p className="font-body text-sm text-grey-2">
              Play some games to unlock your stats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
