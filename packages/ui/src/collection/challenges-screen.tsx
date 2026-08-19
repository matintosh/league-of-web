"use client";

// ChallengesScreen — Profile → CHALLENGES sub-tab (era: 2022+, Patch 12.9+).
// Reference: docs/reference/client-profile-challenges-tab.jpg (2560×1440).
// Presentational — props in, callbacks out, no data fetching.

import { useState } from "react";
import type { ChallengeCategory, ChallengeItem, ChallengeTier } from "@low/fixtures";

export type { ChallengeCategory, ChallengeItem, ChallengeTier };

/** Per-category score data for the sidebar progress bars (issue #1046). */
export interface CategoryScore {
  /** Category id — matches one of the non-"all" ChallengeCategory values. */
  category: Exclude<ChallengeCategory, "all">;
  /** Player's current score in this category. */
  current: number;
  /** Maximum possible score for this category. */
  max: number;
}

export interface ChallengesScreenProps {
  /** Player's total challenge score, e.g. 4725. */
  totalScore: number;
  /** Player's overall tier, e.g. "silver". */
  scoreTier: ChallengeTier;
  /**
   * Real-client crystal-level celebration webm URL (issue #319) for the player's
   * overall crystal, layered over the static sidebar crystal as an animated gem.
   * Optional and additive: when omitted (or when the clip fails to load) the
   * static `CrystalIcon` shows unchanged. The video is `pointer-events-none` and
   * fully suppressed under `prefers-reduced-motion: reduce`.
   *
   * Pages supply this from `@low/fixtures` (`challengeCrystalVideoUrl`); note the
   * catalog has no `iron` clip, so pages gate on the tier being a crystal level.
   */
  crystalVideoSrc?: string;
  /** Currently active category filter. Controlled by the page. */
  activeCategory: ChallengeCategory;
  /** Called when the player clicks a category filter. */
  onCategoryChange?: (cat: ChallengeCategory) => void;
  /**
   * Per-category score progress for the sidebar fill bars (issue #1046).
   * One entry per non-"all" category. When a category is absent the bar
   * renders empty (width 0%). The page owns score data — this component
   * just renders the 3px track + fill.
   */
  categoryScores?: CategoryScore[];
  /**
   * Challenges to display. The page pre-filters by activeCategory
   * (pass all when activeCategory === "all").
   */
  challenges: ChallengeItem[];
  /** Called when a challenge card is clicked. */
  onChallengeClick?: (id: string) => void;
  /**
   * Current search query string (issue #1047). Controlled by the page.
   * The filter row renders a search input; the page owns filter logic.
   */
  searchQuery?: string;
  /** Called when the search input value changes (issue #1047). */
  onSearchChange?: (query: string) => void;
  /**
   * Active category filter in the content header dropdown (issue #1047).
   * Controlled by the page. Distinct from `activeCategory` (sidebar) —
   * this drives the in-panel Category dropdown.
   */
  filterCategory?: string;
  /** Called when the Category dropdown selection changes (issue #1047). */
  onFilterChange?: (category: string) => void;
}

// ---------------------------------------------------------------------------
// Grid layout constant — used for tooltip-side computation.
// ---------------------------------------------------------------------------

/** Number of columns in the challenge card grid. */
const GRID_COLS = 5;

const CATEGORIES: { id: ChallengeCategory; label: string }[] = [
  { id: "all",               label: "ALL" },
  { id: "imagination",       label: "IMAGINATION" },
  { id: "expertise",         label: "EXPERTISE" },
  { id: "teamwork-strategy", label: "TEAMWORK & STRATEGY" },
  { id: "veterancy",         label: "VETERANCY" },
  { id: "collection",        label: "COLLECTION" },
  { id: "legacy",            label: "LEGACY" },
];

/** Category dropdown options — mirrors non-"all" entries in CATEGORIES. */
const FILTER_CATEGORIES = CATEGORIES.filter((c) => c.id !== "all");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatScore(n: number): string {
  return n.toLocaleString("en-US");
}

function tierTextClass(tier: ChallengeTier): string {
  switch (tier) {
    case "iron":        return "text-grey-1";
    case "bronze":      return "text-gold-2";
    case "silver":      return "text-grey-1";
    case "gold":        return "text-gold-cream";
    case "platinum":    return "text-blue-2";
    case "diamond":     return "text-blue-1";
    case "master":
    case "grandmaster": return "text-gold-1";
    case "challenger":  return "text-gold-coin";
    default:            return "text-grey-1";
  }
}

function tierBorderClass(tier: ChallengeTier): string {
  switch (tier) {
    case "iron":        return "border-grey-2";
    case "bronze":      return "border-gold-4";
    case "silver":      return "border-grey-1";
    case "gold":        return "border-gold-3";
    case "platinum":    return "border-blue-3";
    case "diamond":     return "border-blue-2";
    case "master":
    case "grandmaster":
    case "challenger":  return "border-gold-2";
    default:            return "border-grey-2";
  }
}

// ---------------------------------------------------------------------------
// CrystalIcon — hexagonal SVG placeholder for the challenge crystal
// ---------------------------------------------------------------------------

function CrystalIcon({ tier }: { tier: ChallengeTier }) {
  return (
    <svg aria-hidden="true" width="64" height="72" viewBox="0 0 64 72" fill="none" className={tierTextClass(tier)}>
      <polygon points="32,2 62,17 62,55 32,70 2,55 2,17" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
      <polygon points="32,12 52,22 52,50 32,60 12,50 12,22" stroke="currentColor" strokeWidth="1" fill="currentColor" fillOpacity="0.2" />
      <line x1="32" y1="2"  x2="32" y2="12" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="32" y1="60" x2="32" y2="70" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="2"  y1="17" x2="12" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="62" y1="17" x2="52" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="2"  y1="55" x2="12" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      <line x1="62" y1="55" x2="52" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// CrystalVideoLayer — real-client crystal celebration webm (issue #319)
//
// Overlays the animated crystal-level gem (straight alpha, ~900×720) on top of
// the static CrystalIcon glyph. Additive & non-regressing:
//   - Only mounts when a `src` is supplied; the static crystal always renders
//     beneath, so an absent/broken clip leaves the exact static look.
//   - `onError` drops the layer (video 404/decode fail → static crystal shows).
//   - pointer-events-none + aria-hidden: never interactive, never reaches AT.
//   - `motion-reduce:hidden` — suppressed entirely under prefers-reduced-motion
//     (pure CSS, SSR-safe, no first-frame flash); the static crystal remains.
//
// The clip is a one-shot celebration; it loops so the sidebar gem keeps a gentle
// ambient life rather than freezing on the last frame.
// ---------------------------------------------------------------------------

function CrystalVideoLayer({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <video
      key={src}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      aria-hidden="true"
      onError={() => setFailed(true)}
      className="pointer-events-none absolute inset-0 h-full w-full object-contain motion-reduce:hidden"
    />
  );
}

// ---------------------------------------------------------------------------
// CrystalDisplay — static crystal glyph + optional celebration video overlay
// ---------------------------------------------------------------------------

function CrystalDisplay({ tier, videoSrc }: { tier: ChallengeTier; videoSrc?: string }) {
  return (
    <div className="relative flex h-[72px] w-16 items-center justify-center">
      {/* Static crystal — always rendered; sole content under reduced motion or
          when no video is supplied / the clip fails to load. */}
      <CrystalIcon tier={tier} />
      {/* Real-client crystal-level celebration (issue #319). The gem is authored
          at 900×720 with straight alpha and scales down via object-contain,
          compositing over the static glyph beneath. */}
      {videoSrc && <CrystalVideoLayer src={videoSrc} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TokenIconSvg — inline hexagonal SVG placeholder (no network request).
//
// Rendered when tokenIconSrc is absent or after a real img fails to load.
// The placeholder shows a stylised gem shape inside the hexagonal clip region,
// in the card's tier colour, so the layout is always filled.
// ---------------------------------------------------------------------------

function TokenIconSvg({ tier }: { tier: ChallengeTier }) {
  return (
    <svg
      aria-hidden="true"
      width="68"
      height="68"
      viewBox="0 0 68 68"
      fill="none"
      className={["h-full w-full", tierTextClass(tier)].join(" ")}
    >
      {/* Outer hex fill */}
      <polygon points="34,4 64,19 64,49 34,64 4,49 4,19" fill="currentColor" fillOpacity="0.12" />
      {/* Inner gem facets */}
      <polygon points="34,14 54,24 54,44 34,54 14,44 14,24" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="0.8" />
      {/* Central diamond highlight */}
      <polygon points="34,20 46,30 34,46 22,30" fill="currentColor" fillOpacity="0.35" />
      <line x1="34" y1="4"  x2="34" y2="14" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
      <line x1="34" y1="54" x2="34" y2="64" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// TokenIcon — hexagonal token wrapper.
//
// Renders a real img when tokenIconSrc is provided; falls back to the inline
// SVG placeholder on load error (useState — React-safe, no DOM mutation).
// When no tokenIconSrc is supplied, renders the SVG placeholder directly.
// ---------------------------------------------------------------------------

function TokenIcon({ src, name, tier }: { src?: string; name: string; tier: ChallengeTier }) {
  const [imgFailed, setImgFailed] = useState(false);

  const inner =
    src && !imgFailed ? (
      <img
        src={src}
        alt={name}
        width={68}
        height={68}
        className="h-full w-full object-cover"
        onError={() => setImgFailed(true)}
      />
    ) : (
      <TokenIconSvg tier={tier} />
    );

  return (
    <div className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center">
      {/* Hexagonal clip */}
      <div
        className="h-[68px] w-[68px] overflow-hidden bg-blue-5"
        style={{ clipPath: "polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)" }}
      >
        {inner}
      </div>
      {/* Hexagonal border outline */}
      <svg
        aria-hidden="true"
        width="72"
        height="72"
        viewBox="0 0 72 72"
        fill="none"
        className="pointer-events-none absolute inset-0 text-gold-4"
      >
        <polygon points="36,2 70,19 70,53 36,70 2,53 2,19" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TierBadge
// ---------------------------------------------------------------------------

function TierBadge({ tier }: { tier: ChallengeTier }) {
  return (
    <span
      className={[
        "inline-flex items-center border px-1.5 py-0.5",
        "font-display text-[9px] uppercase tracking-widest leading-none",
        tierTextClass(tier),
        tierBorderClass(tier),
      ].join(" ")}
    >
      {tier.toUpperCase()}
    </span>
  );
}

// ---------------------------------------------------------------------------
// ChallengeTooltip — floating hover panel (pointer-events-none).
//
// Opens to the right for columns 1–3 and to the left for columns 4–5,
// so it never overflows the 1280px viewport. The side is passed as a prop
// from the grid render loop which knows the column index.
// ---------------------------------------------------------------------------

type TooltipSide = "right" | "left";

function ChallengeTooltip({
  challenge,
  side,
}: {
  challenge: ChallengeItem;
  side: TooltipSide;
}) {
  const { name, tier, progress, playerPercentage, nextRewardLabel, nextRewardIconSrc } = challenge;
  const isCompleted = progress ? progress.current >= progress.total : false;
  const progressPct = progress && progress.total > 0 ? Math.min(1, progress.current / progress.total) : 0;

  const positionClass =
    side === "right"
      ? "left-full top-1/2 -translate-y-1/2 ml-2"
      : "right-full top-1/2 -translate-y-1/2 mr-2";

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none",
        "absolute z-20",
        positionClass,
        "w-[200px]",
        "bg-blue-7 border border-gold-5",
        "px-3 py-3",
        "flex flex-col gap-2",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
      ].join(" ")}
    >
      <span className="font-display text-xs uppercase tracking-wider text-gold-cream leading-snug">
        {name}
      </span>

      <TierBadge tier={tier} />

      {playerPercentage !== undefined && (
        <p className="font-body text-[10px] text-grey-1 leading-tight">
          {playerPercentage.toFixed(1)}% of players have this
        </p>
      )}

      {progress && (
        <div className="flex flex-col gap-1">
          <div className="h-1.5 w-full rounded-sm bg-blue-5 overflow-hidden">
            <div
              className="h-full rounded-sm bg-blue-2 transition-[width] duration-300"
              style={{ width: `${progressPct * 100}%` }}
            />
          </div>
          {isCompleted ? (
            <span className="font-display text-[10px] uppercase tracking-wider text-blue-2">
              Completed
            </span>
          ) : (
            <span className="font-body text-[10px] text-grey-1">
              {progress.current} / {progress.total}
            </span>
          )}
        </div>
      )}

      <div className="border-t border-gold-5 pt-2">
        <p className="font-display text-[9px] uppercase tracking-widest text-gold-4 mb-1">
          Next Level Rewards
        </p>
        <div className="flex items-center gap-1.5">
          {nextRewardIconSrc ? (
            <img src={nextRewardIconSrc} alt="" width={16} height={16} className="shrink-0" />
          ) : (
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0 text-gold-3">
              <rect x="2" y="2" width="8" height="8" fill="currentColor" transform="rotate(45,6,6)" />
            </svg>
          )}
          <span className="font-body text-[10px] text-gold-cream leading-tight">
            {nextRewardLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ChallengeCard
// ---------------------------------------------------------------------------

function ChallengeCard({
  challenge,
  tooltipSide,
  onClick,
}: {
  challenge: ChallengeItem;
  /** "right" for cols 1–3, "left" for cols 4–5 to avoid viewport overflow. */
  tooltipSide: TooltipSide;
  onClick?: () => void;
}) {
  const { name, criteria, scoreContribution, tier, tokenIconSrc, nextRewardLabel, nextRewardIconSrc } = challenge;
  const isCompleted = challenge.progress
    ? challenge.progress.current >= challenge.progress.total
    : false;

  const content = (
    <>
      {/* Score chip + completed indicator */}
      <div className="mb-2 flex items-center justify-between gap-1">
        <span className="inline-flex items-center bg-blue-5 px-1.5 py-0.5 font-display text-[10px] text-gold-cream">
          {scoreContribution}
        </span>
        {isCompleted && (
          <span className="font-display text-[9px] uppercase tracking-wider text-blue-2 leading-none">
            Done
          </span>
        )}
      </div>

      {/* Token icon — real CDragon art when tokenIconSrc is provided (issue #1048) */}
      <TokenIcon src={tokenIconSrc} name={name} tier={tier} />

      {/* Tier badge */}
      <div className="mt-2 flex justify-center">
        <TierBadge tier={tier} />
      </div>

      {/* Challenge name */}
      <p className="mt-1.5 text-center font-display text-[11px] uppercase tracking-wider text-gold-cream leading-snug">
        {name}
      </p>

      {/* Criteria */}
      <p className="mt-1 text-center font-body text-[9px] text-grey-1 leading-snug line-clamp-2">
        {criteria}
      </p>

      {/* Next reward row */}
      <div className="mt-2 flex items-center justify-center gap-1 border-t border-gold-5/40 pt-1.5">
        {nextRewardIconSrc ? (
          <img src={nextRewardIconSrc} alt="" width={12} height={12} className="shrink-0" />
        ) : (
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0 text-gold-3">
            <rect x="2" y="2" width="6" height="6" fill="currentColor" transform="rotate(45,5,5)" />
          </svg>
        )}
        <span className="font-body text-[9px] text-grey-1 leading-none truncate">
          {nextRewardLabel}
        </span>
      </div>

      {/* Hover tooltip — side flips for last two columns */}
      <ChallengeTooltip challenge={challenge} side={tooltipSide} />
    </>
  );

  const sharedClass = [
    "group relative flex flex-col p-3",
    "bg-blue-7 border border-gold-5/40 hover:border-gold-4",
    "transition-colors duration-150",
    "overflow-visible",
    "hover:z-10",
    onClick ? "cursor-pointer" : "cursor-default",
  ].join(" ");

  if (onClick) {
    return (
      <button type="button" onClick={onClick} aria-label={name} className={sharedClass}>
        {content}
      </button>
    );
  }
  return <div className={sharedClass}>{content}</div>;
}

// ---------------------------------------------------------------------------
// ChallengesScreen
// ---------------------------------------------------------------------------

/**
 * ChallengesScreen — Profile → CHALLENGES tab content (era: 2022+).
 *
 * Left sidebar: hexagonal crystal icon, total score, tier label, 6 category
 * filter buttons each with a ~3px fill bar showing per-category score progress
 * (issue #1046 — pass `categoryScores` to render the bars).
 *
 * Right panel: ~36px filter row with Search input + Category dropdown (issue
 * #1047 — controlled via `searchQuery`/`onSearchChange` + `filterCategory`/
 * `onFilterChange`), then a 5-column ChallengeCard grid with hover tooltips.
 * Cards render real CDragon challenge token art from `tokenIconSrc` (issue #1048).
 *
 * When `crystalVideoSrc` is supplied the real-client crystal-level celebration
 * webm (issue #319) layers over the static sidebar crystal — additive
 * (pointer-events-none, static crystal beneath, hidden under reduced motion).
 *
 * Tooltip side: cards in the last two grid columns open their tooltip to the
 * left (right-full) so it stays within the 1280px viewport.
 *
 * State ownership: activeCategory is controlled by the page so it survives
 * main-nav switches. The page pre-filters challenges before passing them in.
 */
export function ChallengesScreen({
  totalScore,
  scoreTier,
  crystalVideoSrc,
  activeCategory,
  onCategoryChange,
  categoryScores,
  challenges,
  onChallengeClick,
  searchQuery = "",
  onSearchChange,
  filterCategory = "",
  onFilterChange,
}: ChallengesScreenProps) {
  // Build a quick lookup: category id → fill fraction (0–1).
  const scoreMap = new Map<string, number>(
    (categoryScores ?? []).map(({ category, current, max }) => [
      category,
      max > 0 ? Math.min(1, current / max) : 0,
    ])
  );

  return (
    <div className="flex h-full min-h-0 w-full">
      {/* ------------------------------------------------------------------ */}
      {/* Left sidebar                                                         */}
      {/* ------------------------------------------------------------------ */}
      <aside
        className="flex w-[205px] shrink-0 flex-col border-r border-gold-5 bg-blue-8 px-4 py-5"
        aria-label="Challenge score and categories"
      >
        <div className="flex justify-center">
          <CrystalDisplay tier={scoreTier} videoSrc={crystalVideoSrc} />
        </div>
        <div className="mt-3 text-center">
          <p className="font-display text-3xl leading-none text-gold-cream tracking-wide">
            {formatScore(totalScore)}
          </p>
          <p className="mt-0.5 font-display text-xs uppercase tracking-widest text-grey-1">
            {scoreTier.toUpperCase()}
          </p>
        </div>
        <div className="my-4 h-px bg-gold-5/40" />
        <nav aria-label="Challenge categories">
          <ul className="flex flex-col gap-1" role="list">
            {CATEGORIES.map(({ id, label }) => {
              const isActive = id === activeCategory;
              // Fill fraction for non-"all" categories; "all" has no bar.
              const fillFraction = id !== "all" ? (scoreMap.get(id) ?? 0) : null;
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => onCategoryChange?.(id)}
                    aria-pressed={isActive}
                    className={[
                      "flex w-full flex-col gap-1 px-2 py-1.5",
                      "font-display text-[10px] uppercase tracking-widest leading-none",
                      "transition-colors duration-150 text-left",
                      isActive
                        ? "text-blue-2 border-b border-blue-2"
                        : "text-grey-1 hover:text-gold-cream cursor-pointer",
                    ].join(" ")}
                  >
                    {/* Label row: dot + text */}
                    <span className="flex items-center gap-2">
                      <span
                        className={[
                          "inline-block h-1.5 w-1.5 rounded-full shrink-0",
                          isActive ? "bg-blue-2" : "bg-grey-2",
                        ].join(" ")}
                      />
                      {label}
                    </span>
                    {/* Per-category score fill bar (issue #1046) — only for
                        non-"all" categories; omitted when no categoryScores
                        prop is supplied (fillFraction remains null). */}
                    {fillFraction !== null && categoryScores !== undefined && (
                      <div
                        className="h-[3px] w-full overflow-hidden rounded-sm"
                        style={{ background: "color-mix(in srgb, var(--color-blue-6) 60%, transparent)" }}
                        aria-hidden="true"
                      >
                        <div
                          className="h-full rounded-sm bg-blue-2 transition-[width] duration-300"
                          style={{ width: `${fillFraction * 100}%` }}
                        />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Right content — filter row + 5-column card grid                      */}
      {/* ------------------------------------------------------------------ */}
      <main
        className="flex flex-1 min-w-0 flex-col overflow-y-auto bg-blue-8 p-4"
        aria-label="Challenges grid"
      >
        {/* Filter row (issue #1047): Search input + Category dropdown (~36px) */}
        <div className="mb-3 flex h-9 shrink-0 items-center gap-2">
          {/* Search input */}
          <div className="relative flex items-center">
            {/* Search icon */}
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="pointer-events-none absolute left-2.5 text-grey-2"
            >
              <circle cx="5" cy="5" r="3.5" stroke="currentColor" strokeWidth="1.2" />
              <line x1="8" y1="8" x2="11" y2="11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              aria-label="Search challenges"
              className={[
                "h-9 w-44 pl-8 pr-3",
                "bg-blue-7 border border-gold-5/60",
                "font-body text-[11px] text-gold-cream placeholder:text-grey-2",
                "focus:outline-none focus:border-gold-4",
                "transition-colors duration-150",
              ].join(" ")}
            />
          </div>

          {/* Category dropdown */}
          <select
            value={filterCategory}
            onChange={(e) => onFilterChange?.(e.target.value)}
            aria-label="Filter by category"
            className={[
              "h-9 px-3",
              "bg-blue-7 border border-gold-5/60",
              "font-body text-[11px] text-gold-cream",
              "focus:outline-none focus:border-gold-4",
              "transition-colors duration-150 cursor-pointer",
              "appearance-none pr-7",
            ].join(" ")}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a09b8c' stroke-width='1.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
            }}
          >
            <option value="">Category</option>
            {FILTER_CATEGORIES.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Card grid */}
        {challenges.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="font-display text-sm uppercase tracking-widest text-grey-2">
              No challenges in this category
            </p>
          </div>
        ) : (
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))` }}
          >
            {challenges.map((ch, idx) => {
              // Cards in the last 2 columns open tooltip to the left to avoid
              // overflowing the viewport right edge at 1280px.
              const colIdx = idx % GRID_COLS;
              const tooltipSide: TooltipSide = colIdx >= GRID_COLS - 2 ? "left" : "right";
              return (
                <ChallengeCard
                  key={ch.id}
                  challenge={ch}
                  tooltipSide={tooltipSide}
                  onClick={onChallengeClick ? () => onChallengeClick(ch.id) : undefined}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
