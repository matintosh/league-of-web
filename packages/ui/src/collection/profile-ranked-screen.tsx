"use client";

// ---------------------------------------------------------------------------
// ProfileRankedScreen — Profile → RANKED sub-tab content.
//
// Visual reference: docs/reference/client-profile-ranked.jpg
//
// Layout (top → bottom):
//   1. Header zone: queue selector (SOLO/DUO + edit icon) left;
//      Summoner Search input + "League System FAQ ↗" link right.
//      Below that: season label ("2019 SEASON") with a small badge icon.
//   2. Feature strip: 3 equal-width columns, each with a thumbnail image,
//      uppercase title in gold-1, body copy in grey-1.
//   3. CTA zone: centred QUEUE UP button (LockInButton trapezoid geometry,
//      gold secondary style to match the reference's outlined gold look).
//   4. Progress bar zone (pinned to bottom): split label + time remaining left;
//      full-width track with 3 milestone stops; mini-crest icons; SP labels.
//
// Props-in / callbacks-out. No data fetching. All fixture values supplied by
// the page (profile-screen.tsx) per CLAUDE.md rule 2–3.
// ---------------------------------------------------------------------------

import { useId } from "react";

// ---------------------------------------------------------------------------
// Public prop types
// ---------------------------------------------------------------------------

export interface RankedMilestone {
  /** Display label below the milestone node, e.g. "0/150 SP". */
  label: string;
  /** Whether this milestone has been reached (fills the arc around icon). */
  reached: boolean;
  /** Mini-crest image URL for the milestone node icon. */
  iconSrc: string;
}

export interface RankedSplitProgress {
  /** Left label above the bar, e.g. "SPLIT 2 OF 2". */
  splitLabel: string;
  /** Time remaining below the split label, e.g. "12D 4H 16M". */
  timeRemaining: string;
  /** Current SP earned (used to position partial fill between milestones). */
  currentSP: number;
  /** Ordered milestone stops (3 per reference). */
  milestones: RankedMilestone[];
}

export interface RankedFeatureColumn {
  /** Large thumbnail image URL (~230×150 px art). */
  imageUrl: string;
  /** Uppercase column title, e.g. "Conquer the Rift". CSS handles uppercase. */
  title: string;
  /** Short body copy paragraph. */
  description: string;
}

export interface ProfileRankedScreenProps {
  /** Season label displayed below queue selector, e.g. "2019 Season". CSS uppercased. */
  season: string;
  /** Queue type label, e.g. "Solo/Duo". CSS uppercased. */
  queueType: string;
  /** Three feature columns for the main strip. */
  featureColumns: RankedFeatureColumn[];
  /** Split progress data for the bottom bar. */
  splitProgress: RankedSplitProgress;
  /** Fired when the player clicks QUEUE UP. */
  onQueueUp: () => void;
  /** Fired on each keystroke in the Summoner Search field. */
  onSearchSummoner?: (query: string) => void;
}

// ---------------------------------------------------------------------------
// Inline icon glyphs (aria-hidden, presentational)
// ---------------------------------------------------------------------------

/** Small pencil/edit glyph shown beside the queue selector. */
function EditIcon() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <path
        d="M8.5 1.5 L10.5 3.5 L4 10 L1.5 10.5 L2 8 L8.5 1.5Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** External link arrow glyph (↗) for the FAQ link. */
function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block translate-y-[-1px]"
    >
      <path
        d="M2 9L9 2M9 2H4M9 2V7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Small badge/shield glyph shown beside the season label. */
function SeasonBadgeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-gold-3"
    >
      <path
        d="M8 1.5 L2 4.5 V9 C2 12.5 5 14.5 8 15 C11 14.5 14 12.5 14 9 V4.5 L8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="8" cy="9" r="2.5" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  );
}

/** Magnifier glyph for the Summoner Search input. */
function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M9 9L11.5 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SummonerSearchInput — thin local input matching the profile tab strip style
// ---------------------------------------------------------------------------

interface SummonerSearchInputProps {
  onChange?: (value: string) => void;
}

function SummonerSearchInput({ onChange }: SummonerSearchInputProps) {
  return (
    <div className="relative flex items-center">
      <span className="pointer-events-none absolute left-2 text-grey-2">
        <SearchIcon />
      </span>
      <input
        type="text"
        placeholder="Summoner Search"
        aria-label="Summoner Search"
        onChange={(e) => onChange?.(e.target.value)}
        className={[
          "h-7 w-[180px] rounded-none border border-gold-5 bg-hextech-black pl-7 pr-2",
          "font-body text-[11px] text-grey-1 placeholder:text-grey-2",
          "outline-none focus:border-gold-4 focus:ring-0",
        ].join(" ")}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// QueueUpButton — Trapezoid-shaped QUEUE UP button.
// Reuses the same chevron clip-path geometry as LockInButton but with a
// gold secondary style matching the reference (outlined gold, dark fill).
// ---------------------------------------------------------------------------

const TRAP_CLIP = "polygon(0% 0%, 100% 0%, 88% 100%, 12% 100%)";
const BORDER_PX = 2;

function QueueUpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label="Queue Up"
      onClick={onClick}
      className={[
        "group relative flex h-10 w-[180px] cursor-pointer items-center justify-center",
        "[filter:drop-shadow(0_0_6px_color-mix(in_srgb,var(--color-gold-3)_40%,transparent))]",
        "hover:[filter:drop-shadow(0_0_12px_color-mix(in_srgb,var(--color-gold-2)_60%,transparent))]",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3 focus-visible:outline-offset-2",
      ].join(" ")}
    >
      {/* Border shell */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-colors duration-150 group-hover:[background:var(--color-gold-2)]"
        style={{
          clipPath: TRAP_CLIP,
          background: "var(--color-gold-4)",
        }}
      />
      {/* Fill layer */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute transition-colors duration-150 group-hover:[background:var(--color-gold-6)]"
        style={{
          inset: BORDER_PX,
          clipPath: TRAP_CLIP,
          background: "var(--color-hextech-black)",
        }}
      />
      {/* Label */}
      <span className="relative z-10 font-display text-sm tracking-[0.2em] uppercase text-gold-1 select-none transition-colors duration-150 group-hover:text-gold-cream group-active:text-gold-3">
        Queue Up
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// MilestoneNode — circular medallion at a track stop
// ---------------------------------------------------------------------------

interface MilestoneNodeProps {
  milestone: RankedMilestone;
  isCurrent: boolean;
}

function MilestoneNode({ milestone, isCurrent }: MilestoneNodeProps) {
  const arcSize = 36;
  const r = 15;
  const cx = arcSize / 2;
  const cy = arcSize / 2;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Circular container with optional arc ring */}
      <div className="relative flex h-9 w-9 items-center justify-center">
        {/* Arc SVG ring — full ring when reached, partial when current, none otherwise */}
        {(milestone.reached || isCurrent) && (
          <svg
            aria-hidden="true"
            width={arcSize}
            height={arcSize}
            viewBox={`0 0 ${arcSize} ${arcSize}`}
            className="absolute inset-0"
          >
            {/* Background ring track */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="var(--color-gold-5)"
              strokeWidth="2"
            />
            {/* Filled arc */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={milestone.reached ? "var(--color-gold-3)" : "var(--color-gold-4)"}
              strokeWidth="2"
              strokeDasharray={`${milestone.reached ? circumference : circumference * 0.35} ${circumference}`}
              strokeDashoffset={circumference / 4}
              strokeLinecap="round"
            />
          </svg>
        )}
        {/* Mini-crest icon */}
        <img
          src={milestone.iconSrc}
          alt=""
          aria-hidden="true"
          width={22}
          height={22}
          className={[
            "relative z-10 h-[22px] w-[22px] object-contain",
            milestone.reached ? "opacity-90" : "opacity-30 grayscale",
          ].join(" ")}
        />
      </div>
      {/* SP label */}
      <span
        className={[
          "font-display text-[10px] uppercase tracking-wider",
          isCurrent ? "text-gold-cream" : "text-grey-2",
        ].join(" ")}
      >
        {milestone.label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SplitProgressBar — the bottom zone
// ---------------------------------------------------------------------------

interface SplitProgressBarProps {
  progress: RankedSplitProgress;
}

function SplitProgressBar({ progress }: SplitProgressBarProps) {
  // Determine which milestone index is "current" (first not reached)
  const currentIdx = progress.milestones.findIndex((m) => !m.reached);

  return (
    <div className="relative shrink-0 border-t border-gold-5 bg-hextech-black px-6 py-3">
      {/* Left info block */}
      <div className="absolute left-6 top-3 flex flex-col gap-0.5">
        <span className="font-display text-[10px] uppercase tracking-widest text-grey-2">
          {progress.splitLabel}
        </span>
        <span className="font-body text-[10px] text-grey-2">
          {progress.timeRemaining}
        </span>
      </div>

      {/* Milestone track — centred with left padding for the info block */}
      <div className="mx-auto flex max-w-[520px] items-end gap-0 pl-[100px]">
        {progress.milestones.map((milestone, i) => (
          <div key={i} className="flex flex-1 items-center">
            {/* Connector line before each node except the first */}
            {i > 0 && (
              <div
                aria-hidden="true"
                className={[
                  "h-px flex-1",
                  milestone.reached ? "bg-gold-3" : "bg-gold-5",
                ].join(" ")}
              />
            )}
            <MilestoneNode
              milestone={milestone}
              isCurrent={i === currentIdx}
            />
            {/* Connector line after the node, before next milestone */}
            {i < progress.milestones.length - 1 && (
              <div
                aria-hidden="true"
                className={[
                  "h-px flex-1",
                  progress.milestones[i + 1]?.reached ? "bg-gold-3" : "bg-gold-5",
                ].join(" ")}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProfileRankedScreen
// ---------------------------------------------------------------------------

/**
 * ProfileRankedScreen — the content rendered under the RANKED sub-tab on the
 * Profile page.
 *
 * Layout (reference: docs/reference/client-profile-ranked.jpg):
 *  - Header zone: SOLO/DUO queue selector + edit icon (left), Summoner Search
 *    + League System FAQ link (right). Season label below queue selector.
 *  - Feature strip: 3 equal-width columns with thumbnail art, uppercase title,
 *    and body copy paragraph.
 *  - CTA: centred QUEUE UP trapezoid button.
 *  - Progress bar: SPLIT 2 OF 2 label + time remaining left; 3 milestone nodes
 *    with mini-crest icons and SP labels on a horizontal track.
 *
 * Presentational — props in, callbacks out, no data fetching.
 *
 * @param season           Season label, e.g. "2019 Season". CSS uppercased.
 * @param queueType        Queue type, e.g. "Solo/Duo". CSS uppercased.
 * @param featureColumns   Three feature columns (imageUrl, title, description).
 * @param splitProgress    Bottom progress bar data.
 * @param onQueueUp        Fired when the QUEUE UP button is clicked.
 * @param onSearchSummoner Fired on each keystroke in the Summoner Search input.
 */
export function ProfileRankedScreen({
  season,
  queueType,
  featureColumns,
  splitProgress,
  onQueueUp,
  onSearchSummoner,
}: ProfileRankedScreenProps) {
  const searchId = useId();

  return (
    <div
      data-shot="profile-ranked-screen"
      className="flex h-full flex-col bg-blue-7"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header zone                                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="shrink-0 px-6 pt-4 pb-3">
        {/* Row: queue selector left, search + FAQ right */}
        <div className="flex items-start justify-between">
          {/* Left: queue type + edit icon */}
          <div className="flex flex-col gap-1">
            <button
              type="button"
              aria-label={`Queue type: ${queueType}. Click to change.`}
              aria-disabled="true"
              disabled
              className="flex cursor-default items-center gap-1.5 text-grey-1 transition-colors duration-150"
            >
              <span className="font-display text-sm uppercase tracking-widest">
                {queueType}
              </span>
              <EditIcon />
            </button>
          </div>

          {/* Right: summoner search + FAQ link */}
          <div className="flex flex-col items-end gap-1">
            <SummonerSearchInput onChange={onSearchSummoner} />
            <button
              type="button"
              aria-label="League System FAQ (opens in new tab)"
              aria-disabled="true"
              disabled
              className="flex cursor-default items-center gap-0.5 font-body text-[11px] text-gold-3 transition-colors duration-150 hover:text-gold-1"
            >
              League System FAQ
              <ExternalLinkIcon />
            </button>
          </div>
        </div>

        {/* Season label with badge */}
        <div className="mt-1 flex items-center gap-2">
          <span className="font-display text-2xl uppercase tracking-wide text-gold-1">
            {season}
          </span>
          <SeasonBadgeIcon />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Feature strip — 3 columns, fills most of the content height          */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-1 min-h-0 flex-col">
        <div className="flex flex-1 min-h-0 px-4 pb-2 gap-0">
          {featureColumns.map((col, i) => (
            <div
              key={i}
              className="flex flex-1 flex-col gap-3 px-2"
            >
              {/* Thumbnail art */}
              <div className="relative h-[150px] w-full shrink-0 overflow-hidden bg-blue-6">
                <img
                  src={col.imageUrl}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Column title */}
              <h2 className="font-display text-sm uppercase tracking-widest text-gold-1">
                {col.title}
              </h2>

              {/* Body copy */}
              <p className="font-body text-xs leading-relaxed text-grey-1">
                {col.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA zone — centred QUEUE UP button */}
        <div className="flex shrink-0 justify-center py-4">
          <QueueUpButton onClick={onQueueUp} />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Split progress bar — pinned to bottom                               */}
      {/* ------------------------------------------------------------------ */}
      <SplitProgressBar progress={splitProgress} />
    </div>
  );
}
