"use client";

import { useId, useState } from "react";
import type { ChampionIconEntry, LevelRewardCard } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Prop-interface types — live here, not in @low/fixtures.
// Fixtures own data shapes (ChampionIconEntry, LevelRewardCard); components
// own their prop contracts.
// ---------------------------------------------------------------------------

/** Props for the Champion Starter Pack card (Zone L1). */
export interface StarterPackProps {
  /** Pack display name, e.g. "Bot Lane Pack". */
  label: string;
  /** Champion icons to display in the carousel. */
  champions: ChampionIconEntry[];
  /**
   * Number of champion icons shown per carousel page.
   * Defaults to 3 — matching the reference's visible slot count.
   * Carousel is only shown when champions.length > pageSize.
   */
  pageSize?: number;
  /** Short sub-copy, e.g. "3 Champions + Skins and more!" */
  subCopy: string;
  /** Original (crossed-out) price in BE. */
  originalPrice: number;
  /** Discount percentage, e.g. 89. */
  discountPct: number;
  /** Final (discounted) price in BE. */
  discountedPrice: number;
  /** Called when the buy button is clicked. */
  onPurchase?: () => void;
}

/** Props for the Awakening Missions chain card (Zone L2). */
export interface AwakeningMissionsProps {
  /** Completed missions count. */
  completedCount: number;
  /** Total missions in the chain. */
  totalCount: number;
  /** Reward description copy. */
  rewardCopy: string;
  /** Called when VIEW MISSIONS is clicked. */
  onViewMissions?: () => void;
}

/**
 * Props for a Level Up / Daily Play progress panel (Zones R1 and R2).
 * `onViewRewards` is omitted from the Daily Play panel (no detail screen in scope
 * for the 2021 NPE era). Pass `undefined` to disable the button and log a
 * console note; pass a handler to wire up a future detail route.
 */
export interface ProgressPanelProps {
  /** Panel heading, e.g. "Level Up Rewards". */
  heading: string;
  /** Sub-copy line. */
  subCopy: string;
  /** Short reward labels, e.g. ["6 Summoner Spells", "Blue Essence"]. */
  rewardLines: string[];
  /** Progress numerator, e.g. 9. */
  current: number;
  /** Progress denominator, e.g. 10. */
  total: number;
  /** Unit label rendered after the counts, e.g. "LEVELS" or "DAYS". */
  unitLabel: string;
  /** Primary icon URL for the circular icon cluster (~64px). */
  iconSrc: string;
  /** Optional second icon URL for a 2×2 grid cluster. */
  iconSrc2?: string;
  /** Optional third icon URL. */
  iconSrc3?: string;
  /** Optional fourth icon URL. */
  iconSrc4?: string;
  /** Background atmospheric art URL (blurred, dark). */
  bgSrc?: string;
  /**
   * Called when VIEW REWARDS is clicked. When undefined the button is rendered
   * as a no-op (cursor-default, tooltip-free) — used for Daily Play which has
   * no detail screen in the 2021 NPE era scope.
   */
  onViewRewards?: () => void;
}

/**
 * Props for the JourneyTab screen (the Journey OVERVIEW).
 *
 * JourneyTab renders only the overview. The level-rewards detail is a separate
 * component (LevelUpRewardsDetail) that the shell renders directly, keeping
 * view routing and selected-level state in the shell.
 */
export interface JourneyTabProps {
  /** Left column Zone L1: Champion Starter Pack card. */
  starterPack: StarterPackProps;
  /** Left column Zone L2: Awakening Missions chain card. */
  awakeningMissions: AwakeningMissionsProps;
  /** Right column Zone R1: Level Up Rewards progress panel. */
  levelUpRewards: ProgressPanelProps;
  /** Right column Zone R2: Daily Play Rewards progress panel. */
  dailyPlayRewards: ProgressPanelProps;
  /**
   * Called when VIEW REWARDS (Level Up) is clicked, requesting a view change.
   * The shell owns the actual routing; this is the callback contract.
   */
  onViewLevelRewards?: () => void;
}

/** Props for the Level Up Rewards detail view. */
export interface LevelUpRewardsDetailProps {
  /** All 10 level reward cards. */
  levels: LevelRewardCard[];
  /** Currently selected level (1-based). */
  selectedLevel: number;
  /** Called when a level card is clicked. */
  onSelectLevel?: (level: number) => void;
  /** Called when the back chevron / breadcrumb is clicked. */
  onBack?: () => void;
}

// ---------------------------------------------------------------------------
// Private SVG helpers
// ---------------------------------------------------------------------------

/** Blue Essence diamond coin icon — inline SVG approximation. */
function BlueEssenceIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 2L13 8L8 14L3 8Z"
        fill="var(--color-blue-3)"
        stroke="var(--color-blue-2)"
        strokeWidth="0.75"
      />
      <path
        d="M8 4L11 8L8 12L5 8Z"
        fill="var(--color-blue-2)"
        opacity="0.6"
      />
    </svg>
  );
}

/** Gold coin icon — inline SVG for price display. */
function GoldCoinIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="7" cy="7" r="6" fill="var(--color-gold-4)" stroke="var(--color-gold-3)" strokeWidth="1" />
      <text
        x="7"
        y="10"
        textAnchor="middle"
        fontSize="7"
        fontWeight="bold"
        fill="var(--color-gold-1)"
        fontFamily="serif"
      >
        BE
      </text>
    </svg>
  );
}

/** Poro chest icon — simple Hextech chest outline used in Awakening Missions. */
function HextechChestIcon({ size = 64 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Chest body */}
      <rect
        x="8"
        y="20"
        width="48"
        height="34"
        rx="2"
        fill="var(--color-blue-6)"
        stroke="var(--color-gold-4)"
        strokeWidth="1.5"
      />
      {/* Chest lid */}
      <rect
        x="8"
        y="12"
        width="48"
        height="14"
        rx="2"
        fill="var(--color-blue-5)"
        stroke="var(--color-gold-3)"
        strokeWidth="1.5"
      />
      {/* Horizontal divider line */}
      <line x1="8" y1="26" x2="56" y2="26" stroke="var(--color-gold-4)" strokeWidth="1" />
      {/* Lock hex */}
      <polygon
        points="32,28 37,31 37,37 32,40 27,37 27,31"
        fill="var(--color-blue-4)"
        stroke="var(--color-blue-2)"
        strokeWidth="1"
      />
      <circle cx="32" cy="33" r="2.5" fill="var(--color-blue-2)" />
      {/* Gold trim lines */}
      <line x1="14" y1="18" x2="50" y2="18" stroke="var(--color-gold-5)" strokeWidth="0.75" opacity="0.7" />
    </svg>
  );
}

/** Back chevron for navigation. */
function BackChevron() {
  return (
    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Gold checkmark inside a dark circle — completed level overlay. */
function CompletedBadge() {
  return (
    <div
      className="flex h-6 w-6 items-center justify-center rounded-full border border-gold-3"
      style={{
        background: "color-mix(in srgb, var(--color-hextech-black) 70%, transparent)",
      }}
      aria-hidden="true"
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M2.5 6l2.5 2.5 4.5-5"
          stroke="var(--color-gold-2)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * Padlock icon — locked level overlay.
 * NOTE: LockBadge is duplicated across 4 components in the codebase (journey-tab,
 * battle-pass-screen, etc.). A shared <LockIcon> in @low/ui/chrome would be the
 * right extraction — tracked for a future cleanup PR, not done here to keep this
 * PR scoped.
 */
function LockBadge() {
  return (
    <div
      className="flex h-6 w-6 items-center justify-center rounded-full border border-grey-3"
      style={{
        background: "color-mix(in srgb, var(--color-hextech-black) 70%, transparent)",
      }}
      aria-hidden="true"
    >
      <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
        <rect x="2" y="4.5" width="6" height="5" rx="0.75" fill="var(--color-grey-2)" />
        <path d="M3 4.5V3a2 2 0 0 1 4 0v1.5" stroke="var(--color-grey-2)" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CarouselChevron — prev/next arrow button for the starter pack carousel
// ---------------------------------------------------------------------------

interface CarouselChevronProps {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  label: string;
}

function CarouselChevron({ direction, disabled, onClick, label }: CarouselChevronProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={[
        "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center transition-colors duration-150",
        disabled
          ? "cursor-default text-grey-3 opacity-40"
          : "cursor-pointer text-grey-2 hover:text-gold-2",
      ].join(" ")}
    >
      <svg
        aria-hidden="true"
        width="10"
        height="14"
        viewBox="0 0 10 14"
        fill="none"
      >
        {direction === "prev" ? (
          <path
            d="M7 1L2 7l5 6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M3 1l5 6-5 6"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

// ---------------------------------------------------------------------------
// ChampionStarterPackCard — Zone L1
//
// Carousel state is component-internal (ephemeral UI — resets on unmount/nav,
// which is intentional for the NPE-era home screen). When champions.length <=
// pageSize the chevrons are omitted and dots are not rendered (single-page mode).
// ---------------------------------------------------------------------------

function ChampionStarterPackCard({ starterPack }: { starterPack: StarterPackProps }) {
  const pageSize = starterPack.pageSize ?? 3;
  const totalPages = Math.ceil(starterPack.champions.length / pageSize);
  const [page, setPage] = useState(0);

  const isMultiPage = totalPages > 1;
  const isFirstPage = page === 0;
  const isLastPage = page >= totalPages - 1;

  const visibleChampions = starterPack.champions.slice(
    page * pageSize,
    page * pageSize + pageSize,
  );

  return (
    <div
      className="flex flex-col overflow-hidden border border-gold-4"
      style={{
        background: "color-mix(in srgb, var(--color-hextech-black) 80%, var(--color-blue-7) 20%)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-gold-5"
        style={{
          background: "color-mix(in srgb, var(--color-hextech-black) 90%, var(--color-gold-6) 10%)",
        }}
      >
        <span className="font-display text-xs uppercase tracking-widest text-gold-2">
          {starterPack.label}
        </span>
        {/* Bookmark icon */}
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2h10v10L7 9 2 12V2Z" fill="none" stroke="var(--color-gold-3)" strokeWidth="1.25" />
        </svg>
      </div>

      {/* Champion icon carousel row */}
      <div className="flex items-center gap-1 px-2 pt-3 pb-1">
        {/* Prev chevron — only rendered in multi-page mode */}
        {isMultiPage && (
          <CarouselChevron
            direction="prev"
            disabled={isFirstPage}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            label="Previous champions"
          />
        )}

        {/* Champion icons for current page */}
        <div className="flex flex-1 items-center justify-center gap-1.5">
          {visibleChampions.map((champ) => (
            <img
              key={champ.id}
              src={champ.iconSrc}
              alt={champ.name}
              width={56}
              height={56}
              className="border border-gold-5 object-cover"
            />
          ))}
          {/* Blue Essence bonus icon — shown persistently (not paginated) */}
          <div
            className="flex h-14 w-14 items-center justify-center border border-blue-4"
            style={{ background: "color-mix(in srgb, var(--color-blue-7) 80%, var(--color-hextech-black) 20%)" }}
            aria-label="Blue Essence bonus"
          >
            <BlueEssenceIcon size={28} />
          </div>
          {/* Mastery bonus icon — shown persistently (not paginated) */}
          <div
            className="flex h-14 w-14 items-center justify-center border border-gold-5"
            style={{ background: "color-mix(in srgb, var(--color-hextech-black) 70%, var(--color-gold-6) 30%)" }}
            aria-label="Champion Mastery bonus"
          >
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon
                points="14,2 18,10 27,11 21,17 22.5,26 14,22 5.5,26 7,17 1,11 10,10"
                fill="var(--color-gold-4)"
                stroke="var(--color-gold-3)"
                strokeWidth="1"
              />
            </svg>
          </div>
        </div>

        {/* Next chevron — only rendered in multi-page mode */}
        {isMultiPage && (
          <CarouselChevron
            direction="next"
            disabled={isLastPage}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            label="Next champions"
          />
        )}
      </div>

      {/* Pagination dots — only rendered in multi-page mode */}
      {isMultiPage && (
        <div
          className="flex items-center justify-center gap-1.5 pb-2"
          role="tablist"
          aria-label="Carousel page"
        >
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === page}
              aria-label={`Page ${i + 1} of ${totalPages}`}
              onClick={() => setPage(i)}
              className="cursor-pointer rounded-full transition-colors duration-150"
              style={{
                width: 6,
                height: 6,
                background: i === page
                  ? "var(--color-gold-3)"
                  : "var(--color-grey-4)",
                border: "none",
                padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* Sub-copy */}
      <p className="px-3 pb-2 text-center font-body text-xs text-grey-1">
        {starterPack.subCopy}
      </p>

      {/* Price row */}
      <div className="flex items-center justify-between border-t border-gold-5 px-3 py-2.5">
        {/* Strike-through original price */}
        <div className="flex items-baseline gap-1">
          <span
            className="font-display text-xs font-semibold"
            style={{ color: "var(--color-riot-red)", textDecoration: "line-through" }}
          >
            -{starterPack.discountPct}%
          </span>
          <span
            className="font-display text-xs"
            style={{ color: "var(--color-riot-red)", textDecoration: "line-through" }}
          >
            {starterPack.originalPrice.toLocaleString()}
          </span>
        </div>

        {/* Buy button */}
        <button
          type="button"
          onClick={starterPack.onPurchase}
          aria-label={`Buy ${starterPack.label} for ${starterPack.discountedPrice} Blue Essence`}
          className="flex items-center gap-1.5 border border-gold-4 bg-gold-5 px-4 py-1.5 font-display text-xs uppercase tracking-widest text-gold-1 transition-colors duration-150 hover:bg-gold-4 cursor-pointer"
        >
          <GoldCoinIcon size={13} />
          {starterPack.discountedPrice.toLocaleString()}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AwakenMissionsCard — Zone L2
// ---------------------------------------------------------------------------

function AwakenMissionsCard({ missions }: { missions: AwakeningMissionsProps }) {
  const pct = missions.totalCount > 0
    ? Math.min(1, missions.completedCount / missions.totalCount) * 100
    : 0;

  return (
    <div className="flex flex-col">
      {/* Heading */}
      <h2
        className="mb-3 font-display text-base uppercase tracking-widest"
        style={{ color: "var(--color-gold-cream)" }}
      >
        Awakening Missions
      </h2>

      {/* Progress bar */}
      <div className="mb-4 flex items-center gap-3">
        <div
          role="progressbar"
          aria-valuenow={missions.completedCount}
          aria-valuemin={0}
          aria-valuemax={missions.totalCount}
          aria-label="Awakening Missions progress"
          className="relative h-1.5 flex-1 bg-grey-4"
        >
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 transition-all duration-300"
            style={{
              width: `${pct}%`,
              background: "var(--color-gold-3)",
            }}
          />
        </div>
        <span className="shrink-0 font-display text-xs text-gold-2">
          {missions.completedCount}/{missions.totalCount}
        </span>
      </div>

      {/* Icon + copy row */}
      <div className="mb-5 flex items-start gap-4">
        <HextechChestIcon size={64} />
        <p className="font-body text-sm text-grey-1 leading-snug">
          {missions.rewardCopy}
        </p>
      </div>

      {/* VIEW MISSIONS button */}
      <button
        type="button"
        onClick={missions.onViewMissions}
        className="border border-gold-4 px-6 py-2.5 font-display text-xs uppercase tracking-widest text-gold-2 transition-colors duration-150 hover:border-gold-2 hover:text-gold-1 cursor-pointer"
        style={{ alignSelf: "stretch" }}
      >
        View Missions
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProgressBar — teal segmented bar used in progress panels
// ---------------------------------------------------------------------------

function ProgressBar({ current, total }: { current: number; total: number }) {
  // Total ≤ 10 segments.
  return (
    <div
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      className="flex items-center gap-0.5"
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className="h-2"
          style={{
            flex: 1,
            background: i < current ? "var(--color-blue-3)" : "var(--color-grey-4)",
            opacity: i < current ? 1 : 0.6,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ProgressPanel — Zones R1 and R2
// ---------------------------------------------------------------------------

function ProgressPanel({ panel }: { panel: ProgressPanelProps }) {
  const hasMultiIcon = Boolean(panel.iconSrc2);

  return (
    <div
      className="relative flex flex-1 flex-col overflow-hidden border border-gold-5"
      style={{ minHeight: 0 }}
    >
      {/* Background art — blurred, dark */}
      {panel.bgSrc && (
        <img
          src={panel.bgSrc}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{ filter: "brightness(0.25) saturate(0.4)", objectPosition: "center" }}
        />
      )}

      {/* Dark scrim overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, color-mix(in srgb, var(--color-hextech-black) 75%, transparent) 0%, color-mix(in srgb, var(--color-hextech-black) 50%, transparent) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-1 flex-col px-5 py-4">
        {/* Top row: heading + icon cluster + rewards list */}
        <div className="flex items-start gap-5">
          {/* Left: heading + sub-copy */}
          <div className="flex-1 min-w-0">
            <h3
              className="mb-1 font-display text-xl leading-tight"
              style={{ color: "var(--color-gold-1)" }}
            >
              {panel.heading}
            </h3>
            <p className="font-body text-sm text-grey-1 leading-snug">
              {panel.subCopy}
            </p>
          </div>

          {/* Icon cluster */}
          <div
            className="relative shrink-0 rounded-full border-2 border-gold-4 overflow-hidden"
            style={{ width: 72, height: 72 }}
            aria-hidden="true"
          >
            {hasMultiIcon ? (
              /* 2×2 grid of icons */
              <div className="grid grid-cols-2 h-full w-full">
                {[panel.iconSrc, panel.iconSrc2, panel.iconSrc3, panel.iconSrc4].map(
                  (src, i) =>
                    src ? (
                      <img key={i} src={src} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div key={i} className="h-full w-full bg-grey-4" />
                    ),
                )}
              </div>
            ) : (
              <img src={panel.iconSrc} alt="" className="h-full w-full object-cover" />
            )}
          </div>

          {/* Rewards list */}
          <div className="shrink-0 flex flex-col gap-1">
            <span className="font-display text-xs uppercase tracking-widest text-grey-2">
              Rewards
            </span>
            {panel.rewardLines.map((line) => (
              <div key={line} className="flex items-center gap-1.5">
                <BlueEssenceIcon size={12} />
                <span className="font-body text-xs text-grey-1">{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress row */}
        <div className="mt-auto pt-4">
          <div className="mb-1 flex items-baseline gap-2">
            <span
              className="font-display leading-none"
              style={{
                fontSize: 40,
                color: "var(--color-blue-3)",
                textShadow: "0 0 16px color-mix(in srgb, var(--color-blue-2) 60%, transparent)",
              }}
            >
              {String(panel.current).padStart(2, "0")}
            </span>
            <span className="font-display text-xs text-grey-2 uppercase tracking-widest">
              of {panel.total} {panel.unitLabel}
            </span>
          </div>
          <ProgressBar current={panel.current} total={panel.total} />
        </div>
      </div>

      {/* VIEW REWARDS button — bottom-right.
          When onViewRewards is undefined (Daily Play has no detail screen in the
          2021 NPE era), the button renders as decorative/no-op per the reference
          screenshot where the button visually exists but is not in scope. */}
      <div className="relative z-10 flex justify-end border-t border-gold-5 px-4 py-2">
        <button
          type="button"
          onClick={panel.onViewRewards ?? undefined}
          disabled={!panel.onViewRewards}
          className={[
            "border border-gold-4 px-5 py-2 font-display text-xs uppercase tracking-widest text-gold-2 transition-colors duration-150",
            panel.onViewRewards
              ? "hover:border-gold-2 hover:text-gold-1 cursor-pointer"
              : "cursor-default opacity-60",
          ].join(" ")}
        >
          View Rewards
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// JourneyOverview — two-column layout (the default tab view)
// ---------------------------------------------------------------------------

interface JourneyOverviewProps {
  starterPack: StarterPackProps;
  awakeningMissions: AwakeningMissionsProps;
  levelUpRewards: ProgressPanelProps;
  dailyPlayRewards: ProgressPanelProps;
  onViewLevelRewards?: () => void;
}

function JourneyOverview({
  starterPack,
  awakeningMissions,
  levelUpRewards,
  dailyPlayRewards,
  onViewLevelRewards,
}: JourneyOverviewProps) {
  return (
    <div className="flex h-full gap-6 px-5 py-4">
      {/* Left column — Starter Pack + Awakening Missions */}
      <div className="flex w-72 shrink-0 flex-col gap-6">
        {/* Zone L1 — Starter Pack */}
        <ChampionStarterPackCard starterPack={starterPack} />

        {/* Ornament divider */}
        <div
          className="flex shrink-0 items-center gap-2"
          aria-hidden="true"
        >
          <div className="h-px flex-1 bg-gold-5 opacity-50" />
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <polygon
              points="7,1 9,5 13,6 10,9.5 10.8,13.5 7,11.5 3.2,13.5 4,9.5 1,6 5,5"
              fill="none"
              stroke="var(--color-gold-4)"
              strokeWidth="0.75"
            />
          </svg>
          <div className="h-px flex-1 bg-gold-5 opacity-50" />
        </div>

        {/* Zone L2 — Awakening Missions */}
        <AwakenMissionsCard missions={awakeningMissions} />
      </div>

      {/* Right column — Level Up Rewards + Daily Play Rewards */}
      <div className="flex flex-1 min-w-0 flex-col gap-4">
        {/* Zone R1 — Level Up Rewards: VIEW REWARDS routes to level detail. */}
        <ProgressPanel
          panel={{ ...levelUpRewards, onViewRewards: onViewLevelRewards }}
        />
        {/* Zone R2 — Daily Play Rewards: no detail screen in 2021 NPE era scope.
            Button renders as disabled no-op per the reference design. */}
        <ProgressPanel
          panel={{ ...dailyPlayRewards, onViewRewards: undefined }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LevelCardGrid — one cell in the 5×2 grid of Level Up Rewards detail
// ---------------------------------------------------------------------------

interface LevelCardGridItemProps {
  card: LevelRewardCard;
  isSelected: boolean;
  onSelect: () => void;
}

function LevelCardGridItem({ card, isSelected, onSelect }: LevelCardGridItemProps) {
  const borderStyle = isSelected
    ? "border-gold-2"
    : card.isLocked
    ? "border-grey-3 opacity-60"
    : "border-gold-5 hover:border-gold-3";

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={`Level ${card.level}${card.isCompleted ? " (completed)" : card.isLocked ? " (locked)" : ""}`}
      onClick={onSelect}
      className={[
        "relative flex flex-col overflow-hidden border transition-colors duration-150 cursor-pointer",
        borderStyle,
      ].join(" ")}
      style={{
        boxShadow: isSelected
          ? "0 0 12px color-mix(in srgb, var(--color-gold-2) 50%, transparent)"
          : undefined,
      }}
    >
      {/* Art */}
      <div className="relative" style={{ height: 100 }}>
        <img
          src={card.artSrc}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
        {/* Scrim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-10"
          style={{
            background:
              "linear-gradient(to top, color-mix(in srgb, var(--color-hextech-black) 90%, transparent), transparent)",
          }}
        />
        {/* Badge: completed or locked */}
        <div className="absolute left-1.5 top-1.5">
          {card.isCompleted ? <CompletedBadge /> : card.isLocked ? <LockBadge /> : null}
        </div>
      </div>

      {/* Level label */}
      <div
        className="flex items-center justify-center py-1.5"
        style={{
          background: "color-mix(in srgb, var(--color-hextech-black) 90%, var(--color-gold-6) 10%)",
        }}
      >
        <span className="font-display text-xs uppercase tracking-widest text-gold-cream">
          Lvl {card.level}
        </span>
      </div>

      {/* Bonus icons row */}
      {card.bonusIcons && card.bonusIcons.length > 0 && (
        <div className="flex justify-center gap-1 py-1">
          {card.bonusIcons.map((src, i) => (
            <img key={i} src={src} alt="" aria-hidden="true" width={14} height={14} className="object-contain" />
          ))}
          <BlueEssenceIcon size={12} />
        </div>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// LevelDetailPanel — right side of Level Up Rewards detail view
// ---------------------------------------------------------------------------

function LevelDetailPanel({ card }: { card: LevelRewardCard }) {
  return (
    <div
      className="flex flex-col border border-gold-4"
      style={{
        background: "color-mix(in srgb, var(--color-hextech-black) 85%, var(--color-blue-7) 15%)",
      }}
    >
      {/* Heading */}
      <div
        className="border-b border-gold-5 px-5 py-3"
        style={{
          background: "color-mix(in srgb, var(--color-hextech-black) 90%, var(--color-gold-6) 10%)",
        }}
      >
        <h3 className="font-display text-xl uppercase tracking-wider text-gold-1">
          Level {card.level}
        </h3>
      </div>

      {/* Divider line */}
      <div
        className="mx-5 my-2 h-px"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--color-gold-5), transparent)",
        }}
      />

      {/* Art tiles */}
      <div className="flex flex-wrap gap-2 px-5 py-3">
        {card.detailArtSrcs.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            aria-hidden="true"
            width={96}
            height={96}
            className="border border-gold-5 object-cover"
          />
        ))}
      </div>

      {/* Milestone label + description */}
      <div className="flex-1 px-5 pb-5">
        <p
          className="mb-1 font-display text-sm uppercase tracking-widest"
          style={{ color: "var(--color-gold-2)" }}
        >
          {card.milestoneLabel}
        </p>
        <p className="font-body text-sm text-grey-1 leading-snug">
          {card.description}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LevelUpRewardsDetail — full-width View 2
//
// Era: 2021 NPE redesign (V11.8). Reference: docs/reference/client-home-journey-level-rewards.jpg
// ---------------------------------------------------------------------------

export function LevelUpRewardsDetail({
  levels,
  selectedLevel,
  onSelectLevel,
  onBack,
}: LevelUpRewardsDetailProps) {
  const selectedCard = levels.find((l) => l.level === selectedLevel) ?? levels[0];

  // Split into two rows of 5
  const row1 = levels.slice(0, 5);
  const row2 = levels.slice(5, 10);

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 30%, color-mix(in srgb, var(--color-blue-7) 25%, var(--color-hextech-black) 75%) 0%, var(--color-hextech-black) 70%)",
      }}
    >
      {/* Back navigation */}
      <div
        className="flex shrink-0 items-center gap-2 border-b border-gold-5 px-5 py-2"
        style={{
          background: "color-mix(in srgb, var(--color-hextech-black) 90%, var(--color-gold-6) 10%)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Journey overview"
          className="flex items-center gap-1.5 font-display text-xs uppercase tracking-widest text-gold-2 hover:text-gold-1 transition-colors duration-150 cursor-pointer"
        >
          <BackChevron />
          Journey
        </button>
        <span aria-hidden="true" className="font-display text-xs text-grey-2">
          {" › "}
        </span>
        <span className="font-display text-xs uppercase tracking-widest text-gold-1">
          Level Up Rewards
        </span>
      </div>

      {/* Page heading */}
      <div className="shrink-0 py-6 text-center">
        <h1
          className="font-display uppercase tracking-widest"
          style={{
            fontSize: 32,
            color: "var(--color-gold-1)",
            textShadow:
              "0 0 40px color-mix(in srgb, var(--color-gold-3) 40%, transparent), 0 2px 6px color-mix(in srgb, var(--color-hextech-black) 80%, transparent)",
          }}
        >
          Level Up Rewards
        </h1>
        <p className="mt-2 font-body text-sm text-grey-1">
          There&apos;s a lot more to League than just champions—here&apos;s what else you&apos;ll unlock.
        </p>
      </div>

      {/* Main content: grid + detail panel */}
      <div className="flex flex-1 min-h-0 gap-5 px-5 pb-4">
        {/* 5×2 reward grid */}
        <div
          role="list"
          aria-label="Level reward cards"
          className="flex flex-col gap-2"
          style={{ width: 580 }}
        >
          {/* Row 1 */}
          <div className="grid grid-cols-5 gap-2" role="row">
            {row1.map((card) => (
              <div key={card.level} role="listitem">
                <LevelCardGridItem
                  card={card}
                  isSelected={card.level === selectedLevel}
                  onSelect={() => onSelectLevel?.(card.level)}
                />
              </div>
            ))}
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-5 gap-2" role="row">
            {row2.map((card) => (
              <div key={card.level} role="listitem">
                <LevelCardGridItem
                  card={card}
                  isSelected={card.level === selectedLevel}
                  onSelect={() => onSelectLevel?.(card.level)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel — flex-1 so it fills the remaining width */}
        {selectedCard && (
          <div className="flex-1 min-w-0">
            <LevelDetailPanel card={selectedCard} />
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="shrink-0 border-t border-gold-5 py-3 text-center"
        style={{
          background: "color-mix(in srgb, var(--color-hextech-black) 95%, var(--color-gold-6) 5%)",
        }}
      >
        <p className="font-body text-xs text-grey-2">
          Use Blue Essence to buy new champions in the store.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// JourneyTab — root component
//
// Presentational: props in, callbacks out. No data fetching.
// Era: 2021 NPE redesign (V11.8, April 2021).
// Reference: docs/reference/client-home-journey-npe.jpg (overview)
//            docs/reference/client-home-journey-level-rewards.jpg (level detail)
//
// The shell renders JourneyTab only when activeTabId === "journey" AND the shell's
// journeyView === "overview". When journeyView === "level-rewards" the shell renders
// LevelUpRewardsDetail directly. JourneyTab never renders the detail view itself.
// ---------------------------------------------------------------------------

export function JourneyTab({
  starterPack,
  awakeningMissions,
  levelUpRewards,
  dailyPlayRewards,
  onViewLevelRewards,
}: JourneyTabProps) {
  return (
    <div
      className="h-full w-full overflow-hidden"
      aria-label="Journey tab"
      style={{
        background:
          "radial-gradient(ellipse at 20% 60%, color-mix(in srgb, var(--color-blue-7) 30%, var(--color-hextech-black) 70%) 0%, var(--color-hextech-black) 60%)",
      }}
    >
      {/* PLAY LEAGUE header label */}
      <div className="px-5 pt-4">
        <p className="font-display text-xs uppercase tracking-widest text-grey-2">
          Play League
        </p>
        <h1
          className="font-display text-2xl uppercase tracking-wider leading-tight"
          style={{
            color: "var(--color-gold-1)",
            textShadow: "0 2px 8px color-mix(in srgb, var(--color-hextech-black) 80%, transparent)",
          }}
        >
          Start Your Legend
        </h1>
      </div>

      {/* Two-column layout */}
      <JourneyOverview
        starterPack={starterPack}
        awakeningMissions={awakeningMissions}
        levelUpRewards={levelUpRewards}
        dailyPlayRewards={dailyPlayRewards}
        onViewLevelRewards={onViewLevelRewards}
      />
    </div>
  );
}
