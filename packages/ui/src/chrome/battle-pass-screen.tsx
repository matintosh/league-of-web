"use client";

import { useId, useRef } from "react";
import type { BattlePassChapter, BattlePassRewardCard, BattlePassLevelReward } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Re-export types so consumers can import from @low/ui
// ---------------------------------------------------------------------------
export type { BattlePassChapter, BattlePassRewardCard, BattlePassLevelReward };

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface BattlePassScreenProps {
  /** Event display name, e.g. "Welcome to Noxus: Act 2". */
  eventName: string;
  /** Countdown label shown top-right, e.g. "Ends in 6 weeks". */
  endsIn: string;
  /** All chapters to display in the chapter overview. */
  chapters: BattlePassChapter[];
  /** 0-based index of the currently active chapter. */
  activeChapterIndex: number;
  /** Player's current XP within the chapter. */
  currentXp: number;
  /** XP required to complete the chapter. */
  totalXp: number;
  /** Player's global pass level number (shown in the level chip). */
  playerLevel: number;
  /**
   * 0-based index into `levelRewards[]` of the currently selected level, or
   * undefined to show the chapter overview. Pass undefined to return to the
   * overview from the level-detail view (e.g. when the breadcrumb is clicked).
   *
   * NOTE: both `selectedLevelIndex` and `levelRewards` must be provided
   * together for the level-detail view to render. If `selectedLevelIndex` is
   * set but `levelRewards` is empty the screen silently falls back to the
   * chapter overview; a dev-time warning is emitted.
   */
  selectedLevelIndex?: number;
  /** Level rewards shown in the horizontal strip of the detail view. */
  levelRewards?: BattlePassLevelReward[];
  /**
   * Called when a reward card or strip level is selected (passes the 0-based
   * index into `levelRewards[]`), or with `undefined` when the user clicks the
   * breadcrumb chapter label to return to the chapter overview.
   */
  onSelectLevel?: (idx: number | undefined) => void;
  /** Called when CLAIM button is pressed. */
  onClaim?: () => void;
  /** Called when PURCHASE PASS button is pressed. */
  onPurchasePass?: () => void;
}

// ---------------------------------------------------------------------------
// LockIcon — private to this module (co-located; not shared cross-file)
// ---------------------------------------------------------------------------

function LockIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-grey-2"
    >
      <rect x="3" y="7" width="10" height="8" rx="1" fill="currentColor" opacity="0.9" />
      <path
        d="M5 7V5a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// CheckIcon — gold checkmark overlay on completed reward cards
// ---------------------------------------------------------------------------

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="14"
        cy="14"
        r="13"
        fill="color-mix(in srgb, var(--color-hextech-black) 60%, transparent)"
        stroke="var(--color-gold-3)"
        strokeWidth="1.5"
      />
      <path
        d="M7.5 14l4.5 4.5 8-9"
        stroke="var(--color-gold-2)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// CurrentMarker — label chip on the in-progress card
// label should be the chapter label, e.g. "CHAPTER IV".
// ---------------------------------------------------------------------------

function CurrentMarker({ label }: { label: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex items-center justify-center border border-blue-2 bg-hextech-black px-2 py-0.5"
      style={{
        boxShadow: "0 0 8px color-mix(in srgb, var(--color-blue-2) 50%, transparent)",
      }}
    >
      <span className="font-display text-xs text-blue-2 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// RewardCard — one card in the chapter overview grid
// ---------------------------------------------------------------------------

interface RewardCardProps {
  card: BattlePassRewardCard;
  chapterLabel: string;
  onSelect?: () => void;
}

function RewardCard({ card, chapterLabel, onSelect }: RewardCardProps) {
  const isCyanHighlight = card.isCurrent;
  const borderClass = isCyanHighlight
    ? "border-2"
    : card.isOwned
    ? "border border-gold-5"
    : "border border-grey-3";

  return (
    <button
      type="button"
      aria-label={`${chapterLabel} reward ${card.index}: ${card.label}${card.isOwned ? " (claimed)" : card.isCurrent ? " (in progress)" : " (locked)"}`}
      onClick={onSelect}
      className={[
        "relative flex shrink-0 flex-col overflow-hidden transition-all duration-150",
        borderClass,
        "cursor-pointer",
        !card.isOwned && !card.isCurrent && "opacity-70",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: 175,
        height: 300,
        borderColor: isCyanHighlight ? "var(--color-blue-2)" : undefined,
        boxShadow: isCyanHighlight
          ? "0 0 16px color-mix(in srgb, var(--color-blue-2) 55%, transparent), inset 0 0 12px color-mix(in srgb, var(--color-blue-2) 20%, transparent)"
          : undefined,
      }}
    >
      {/* Art fill */}
      <img
        src={card.artSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />

      {/* Gradient scrim for readability */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: 80,
          background:
            "linear-gradient(to top, color-mix(in srgb, var(--color-hextech-black) 90%, transparent) 0%, transparent 100%)",
        }}
      />

      {/* Cyan highlight scan line at top for current card */}
      {isCyanHighlight && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5"
          style={{ background: "var(--color-blue-2)" }}
        />
      )}

      {/* Gold checkmark overlay for owned cards */}
      {card.isOwned && (
        <div
          className="absolute inset-0 flex items-end justify-center pb-10"
          aria-hidden="true"
        >
          <CheckIcon />
        </div>
      )}

      {/* Current-card bottom chip — shows the chapter label (not hardcoded) */}
      {isCyanHighlight && (
        <div className="absolute inset-x-0 bottom-2 flex justify-center">
          <CurrentMarker label={chapterLabel} />
        </div>
      )}

      {/* Label at very bottom */}
      <div className="absolute inset-x-0 bottom-0 px-2 py-1.5">
        <span className="block truncate font-display text-xs uppercase tracking-wide text-gold-cream opacity-90">
          {card.label}
        </span>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// BreadcrumbBar — Zone 1, top strip (~32px)
//
// In level-detail view, chapterLabel is rendered as a clickable button that
// calls onBack() to return to the chapter overview — matching the real
// client's breadcrumb navigation.
// ---------------------------------------------------------------------------

interface BreadcrumbBarProps {
  eventName: string;
  endsIn: string;
  /**
   * When provided, shows "> CHAPTER LABEL" in the breadcrumb.
   * In level-detail view this becomes a clickable back button.
   */
  chapterLabel?: string;
  onBack?: () => void;
  uid: string;
}

function BreadcrumbBar({ eventName, endsIn, chapterLabel, onBack, uid }: BreadcrumbBarProps) {
  return (
    <div
      aria-label="Battle Pass breadcrumb"
      className="flex shrink-0 items-center justify-between px-4"
      style={{
        height: 32,
        background: "color-mix(in srgb, var(--color-hextech-black) 85%, var(--color-gold-6) 15%)",
        borderBottom: "1px solid color-mix(in srgb, var(--color-gold-5) 40%, transparent)",
      }}
    >
      {/* Left: event icon + event name [> chapter crumb] */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Event icon — inline SVG shield approximating Noxus iconography */}
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M9 1.5L2 5v5c0 4 3.5 7 7 7.5C16 17 16 10 16 10V5L9 1.5Z"
            fill="color-mix(in srgb, var(--color-riot-red) 70%, var(--color-hextech-black) 30%)"
            stroke="var(--color-gold-3)"
            strokeWidth="0.75"
          />
          <path
            d="M9 4.5v9M6 9h6"
            stroke="var(--color-gold-1)"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>

        <span
          id={`${uid}-event-name`}
          className="font-display text-xs uppercase tracking-widest"
          style={{ color: "var(--color-gold-cream)" }}
        >
          {eventName}
        </span>

        {chapterLabel && (
          <>
            <span aria-hidden="true" className="font-display text-xs text-grey-2">
              {" › "}
            </span>
            {/* Clickable chapter crumb — returns to chapter overview */}
            <button
              type="button"
              aria-label={`Back to ${chapterLabel} overview`}
              onClick={onBack}
              className="font-display text-xs uppercase tracking-widest text-gold-1 cursor-pointer hover:text-gold-cream transition-colors duration-150"
            >
              {chapterLabel}
            </button>
          </>
        )}
      </div>

      {/* Right: countdown */}
      <span className="shrink-0 font-display text-xs uppercase tracking-widest text-grey-1">
        {endsIn}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// XpBar — level chip + filled progress bar + XP label + bonus XP icon
// Used in both ChapterView (Zone 4) and LevelView action bar (Zone 4).
// ---------------------------------------------------------------------------

interface XpBarProps {
  playerLevel: number;
  currentXp: number;
  totalXp: number;
  uid: string;
}

function XpBar({ playerLevel, currentXp, totalXp, uid }: XpBarProps) {
  const pct = totalXp > 0 ? Math.min(1, currentXp / totalXp) * 100 : 0;
  const barId = `${uid}-xpbar`;

  return (
    <div className="flex items-center gap-3">
      {/* Level chip */}
      <div
        className="flex shrink-0 items-center justify-center rounded-full border-2 border-blue-2 bg-hextech-black font-display text-sm text-blue-2"
        style={{ width: 40, height: 40 }}
        aria-label={`Level ${playerLevel}`}
      >
        {playerLevel}
      </div>

      {/* Progress bar + label */}
      <div className="flex flex-col gap-1 min-w-0">
        <div className="flex items-center gap-2">
          <div
            id={barId}
            role="progressbar"
            aria-valuenow={currentXp}
            aria-valuemin={0}
            aria-valuemax={totalXp}
            aria-label="Chapter XP"
            className="relative h-2 bg-grey-4"
            style={{ width: 160 }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 bg-gold-3 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
            {/* Glow at fill head */}
            {pct > 0 && (
              <div
                aria-hidden="true"
                className="absolute inset-y-0 pointer-events-none"
                style={{
                  left: `calc(${pct}% - 4px)`,
                  width: 8,
                  background: "color-mix(in srgb, var(--color-gold-2) 60%, transparent)",
                  filter: "blur(3px)",
                }}
              />
            )}
          </div>
          <span className="font-display text-xs text-grey-1">
            {currentXp} / {totalXp} xp
          </span>
        </div>
      </div>

      {/* Bonus XP icon */}
      <svg
        aria-label="Bonus XP available"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 text-blue-2"
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M8 4v4l3 2"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ChapterView — View 1: chapter overview (client-battle-pass-chapters.png)
// ---------------------------------------------------------------------------

interface ChapterViewProps {
  chapters: BattlePassChapter[];
  activeChapterIndex: number;
  playerLevel: number;
  currentXp: number;
  totalXp: number;
  /**
   * Called when a reward card is clicked. Passes the card's levelRewardIndex
   * (0-based index into levelRewards[]). Cards with levelRewardIndex === -1
   * do not fire this callback.
   */
  onSelectLevelReward?: (levelRewardIndex: number) => void;
  uid: string;
}

function ChapterView({
  chapters,
  activeChapterIndex,
  playerLevel,
  currentXp,
  totalXp,
  onSelectLevelReward,
  uid,
}: ChapterViewProps) {
  const chapter = chapters[activeChapterIndex];
  if (!chapter) return null;

  return (
    <>
      {/* Zone 2 — Chapter heading */}
      <div
        className="flex shrink-0 items-end px-8 pb-4"
        style={{ paddingTop: 48 }}
      >
        <h1
          className="font-display uppercase leading-none"
          style={{
            fontSize: 48,
            letterSpacing: "0.1em",
            color: "var(--color-gold-1)",
            textShadow:
              "0 0 40px color-mix(in srgb, var(--color-gold-3) 40%, transparent), 0 2px 6px rgba(0,0,0,0.8)",
          }}
        >
          {chapter.label}
        </h1>
      </div>

      {/* Zone 3 — Reward card grid, horizontally scrollable */}
      <div
        className="flex flex-1 min-h-0 min-w-0 items-center"
        style={{ padding: "0 30px 0 240px" }}
      >
        <div
          role="list"
          aria-label={`${chapter.label} rewards`}
          className="flex min-w-0 gap-4 overflow-x-auto"
          style={{ paddingBottom: 8 }}
        >
          {chapter.rewards.map((card) => (
            <div key={card.id} role="listitem">
              <RewardCard
                card={card}
                chapterLabel={chapter.label}
                onSelect={
                  card.levelRewardIndex >= 0
                    ? () => onSelectLevelReward?.(card.levelRewardIndex)
                    : undefined
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Zone 4 — XP progress bar */}
      <div
        className="flex shrink-0 items-center gap-3 px-4 py-3"
        style={{
          background: "color-mix(in srgb, var(--color-hextech-black) 90%, var(--color-gold-6) 10%)",
          borderTop: "1px solid color-mix(in srgb, var(--color-gold-5) 40%, transparent)",
        }}
      >
        <XpBar
          playerLevel={playerLevel}
          currentXp={currentXp}
          totalXp={totalXp}
          uid={uid}
        />
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// RewardStripItem — one cell in the level detail reward strip
// ---------------------------------------------------------------------------

interface RewardStripItemProps {
  reward: BattlePassLevelReward;
  isSelected: boolean;
  onSelect: () => void;
}

function RewardStripItem({ reward, isSelected, onSelect }: RewardStripItemProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={`Level ${reward.level}: ${reward.label} (${reward.lane})`}
      onClick={onSelect}
      className={[
        "relative flex shrink-0 flex-col items-center gap-1 cursor-pointer",
        "border transition-colors duration-150",
        isSelected
          ? "border-gold-2"
          : reward.isUnlocked
          ? "border-gold-5 hover:border-gold-3"
          : "border-grey-3 opacity-60",
      ].join(" ")}
      style={{
        width: 64,
        boxShadow: isSelected
          ? "0 0 10px color-mix(in srgb, var(--color-gold-2) 50%, transparent)"
          : undefined,
      }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ width: 64, height: 64 }}>
        <img
          src={reward.artSrc}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-top"
        />
        {!reward.isUnlocked && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: "color-mix(in srgb, var(--color-hextech-black) 50%, transparent)",
            }}
          >
            <LockIcon />
          </div>
        )}
        {/* Level number badge */}
        <div className="absolute bottom-0 inset-x-0 flex justify-center">
          <span
            className="font-display text-[10px] text-gold-cream px-1"
            style={{
              background: "color-mix(in srgb, var(--color-hextech-black) 80%, transparent)",
            }}
          >
            {reward.level}
          </span>
        </div>
      </div>

      {/* FREE / PREMIUM label */}
      <span
        className={[
          "font-display text-[10px] uppercase tracking-widest pb-1",
          reward.lane === "premium" ? "text-gold-3" : "text-grey-1",
        ].join(" ")}
      >
        {reward.lane}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// HextechChestArt — inline SVG placeholder for the featured reward art
// Approximates the hexagonal chest shown in client-battle-pass-levels.png.
// Real client would load the CDragon event asset.
// ---------------------------------------------------------------------------

function HextechChestArt({ uid }: { uid: string }) {
  const gradId = `${uid}-chest-grad`;
  const glowId = `${uid}-chest-glow`;

  return (
    <svg
      aria-hidden="true"
      width="240"
      height="240"
      viewBox="0 0 240 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="var(--color-blue-1)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--color-blue-6)" stopOpacity="0.0" />
        </radialGradient>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Glow backdrop */}
      <ellipse cx="120" cy="130" rx="90" ry="60" fill={`url(#${gradId})`} />

      {/* Chest body — hex octagon shape */}
      <polygon
        points="120,30 185,65 210,130 185,195 120,210 55,195 30,130 55,65"
        fill="color-mix(in srgb, var(--color-blue-5) 80%, var(--color-hextech-black) 20%)"
        stroke="var(--color-blue-3)"
        strokeWidth="2"
        filter={`url(#${glowId})`}
      />

      {/* Horizontal split line */}
      <line x1="36" y1="130" x2="204" y2="130" stroke="var(--color-blue-2)" strokeWidth="1.5" />

      {/* Hextech lock center */}
      <polygon
        points="120,95 140,106 140,128 120,139 100,128 100,106"
        fill="color-mix(in srgb, var(--color-blue-4) 60%, var(--color-blue-8) 40%)"
        stroke="var(--color-blue-2)"
        strokeWidth="1.5"
      />
      {/* Key hole */}
      <circle cx="120" cy="112" r="7" fill="var(--color-blue-2)" opacity="0.9" />
      <rect x="117" y="115" width="6" height="9" rx="1" fill="var(--color-blue-2)" opacity="0.9" />

      {/* Decorative edge trim */}
      <polygon
        points="120,30 185,65 210,130 185,195 120,210 55,195 30,130 55,65"
        fill="none"
        stroke="var(--color-gold-4)"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Key SVG floating to the right */}
      <g transform="translate(165, 100) rotate(35)">
        <rect x="0" y="0" width="8" height="30" rx="2" fill="var(--color-gold-3)" opacity="0.9" />
        <rect x="-4" y="20" width="6" height="4" rx="1" fill="var(--color-gold-2)" opacity="0.9" />
        <rect x="-4" y="26" width="4" height="4" rx="1" fill="var(--color-gold-2)" opacity="0.9" />
        <circle cx="4" cy="-2" r="6" fill="none" stroke="var(--color-gold-3)" strokeWidth="2.5" />
        <circle cx="4" cy="-2" r="2.5" fill="var(--color-gold-3)" opacity="0.7" />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// LevelView — View 2: level detail (client-battle-pass-levels.png)
// ---------------------------------------------------------------------------

interface LevelViewProps {
  chapters: BattlePassChapter[];
  activeChapterIndex: number;
  levelRewards: BattlePassLevelReward[];
  selectedLevelIndex: number;
  playerLevel: number;
  currentXp: number;
  totalXp: number;
  onSelectLevel?: (idx: number | undefined) => void;
  onClaim?: () => void;
  onPurchasePass?: () => void;
  uid: string;
}

function LevelView({
  chapters,
  activeChapterIndex,
  levelRewards,
  selectedLevelIndex,
  playerLevel,
  currentXp,
  totalXp,
  onSelectLevel,
  onClaim,
  onPurchasePass,
  uid,
}: LevelViewProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const selectedReward = levelRewards[selectedLevelIndex];

  const chapterInLevel = selectedReward
    ? `CHAPTER IN LEVEL ${selectedReward.level}`
    : `CHAPTER IN LEVEL ${playerLevel + 1}`;

  const rewardTitle = selectedReward?.label ?? "HEXTECH CHEST & KEY";

  function scrollStrip(direction: "left" | "right") {
    const el = stripRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -192 : 192, behavior: "smooth" });
  }

  return (
    <>
      {/* Zone 2 — Centered reward art + right-side title */}
      <div className="flex flex-1 min-h-0 items-center justify-center relative">
        {/* Large 3D item art centered */}
        <div
          className="flex items-center justify-center"
          aria-label={rewardTitle}
          style={{ marginLeft: -80 }}
        >
          <HextechChestArt uid={uid} />
        </div>

        {/* Right-side labels */}
        <div
          className="absolute flex flex-col gap-3"
          style={{ right: 120, top: "50%", transform: "translateY(-50%)" }}
        >
          <span className="font-display text-xs uppercase tracking-widest text-grey-1">
            {chapterInLevel}
          </span>
          <h2
            className="font-display uppercase leading-tight"
            style={{
              fontSize: 26,
              letterSpacing: "0.06em",
              color: "var(--color-gold-cream)",
              textShadow: "0 2px 8px rgba(0,0,0,0.8)",
              maxWidth: 200,
            }}
          >
            {rewardTitle}
          </h2>
        </div>
      </div>

      {/* Zone 3 — Reward strip */}
      <div
        className="flex shrink-0 items-center gap-2 px-4 py-3"
        style={{
          background: "color-mix(in srgb, var(--color-hextech-black) 80%, var(--color-riot-red) 12%)",
          borderTop: "1px solid color-mix(in srgb, var(--color-gold-5) 30%, transparent)",
        }}
        aria-label="Level rewards"
      >
        {/* Left scroll chevron */}
        <button
          type="button"
          aria-label="Scroll reward strip left"
          onClick={() => scrollStrip("left")}
          className="flex shrink-0 h-8 w-8 items-center justify-center border border-grey-3 text-grey-2 hover:border-gold-4 hover:text-gold-1 transition-colors duration-150 cursor-pointer"
        >
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Scrollable strip */}
        <div
          ref={stripRef}
          className="flex flex-1 gap-1.5 overflow-x-auto"
          role="list"
          aria-label="Reward levels"
          style={{ scrollbarWidth: "none" }}
        >
          {levelRewards.map((reward, idx) => (
            <div key={reward.level} role="listitem">
              <RewardStripItem
                reward={reward}
                isSelected={idx === selectedLevelIndex}
                onSelect={() => onSelectLevel?.(idx)}
              />
            </div>
          ))}
        </div>

        {/* Right scroll chevron */}
        <button
          type="button"
          aria-label="Scroll reward strip right"
          onClick={() => scrollStrip("right")}
          className="flex shrink-0 h-8 w-8 items-center justify-center border border-grey-3 text-grey-2 hover:border-gold-4 hover:text-gold-1 transition-colors duration-150 cursor-pointer"
        >
          <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Zone 4 — Bottom action bar */}
      <div
        className="flex shrink-0 items-center justify-between px-4 py-3"
        style={{
          background: "color-mix(in srgb, var(--color-hextech-black) 95%, var(--color-gold-6) 5%)",
          borderTop: "1px solid color-mix(in srgb, var(--color-gold-5) 40%, transparent)",
        }}
      >
        {/* Left: XpBar component (single source of truth) */}
        <XpBar
          playerLevel={playerLevel}
          currentXp={currentXp}
          totalXp={totalXp}
          uid={uid}
        />

        {/* Right: CLAIM + PURCHASE PASS buttons */}
        <div className="flex items-center gap-3">
          {/* CLAIM button — gold border */}
          <button
            type="button"
            onClick={onClaim}
            className="border border-gold-4 px-6 py-2 font-display text-xs uppercase tracking-widest text-gold-2 transition-colors duration-150 hover:bg-gold-5/20 cursor-pointer"
          >
            Claim
          </button>

          {/* PURCHASE PASS button — filled gold */}
          <button
            type="button"
            onClick={onPurchasePass}
            className="flex items-center gap-2 border border-gold-3 bg-gold-4 px-5 py-2 font-display text-xs uppercase tracking-widest text-gold-1 transition-colors duration-150 hover:bg-gold-3 cursor-pointer"
          >
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3L6 1Z" fill="currentColor" />
            </svg>
            Purchase Pass
          </button>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// BattlePassScreen — root component
//
// Presentational: props in, callbacks out. No data fetching.
// Era: 2025 "Welcome to Noxus" Battle Pass (V25.S1.1 onward).
// Reference: docs/reference/client-battle-pass-chapters.png (1322×797)
//            docs/reference/client-battle-pass-levels.png (1320×796)
//
// View routing:
//   Chapter overview  selectedLevelIndex === undefined  (default)
//   Level detail      selectedLevelIndex is a number AND levelRewards.length > 0
//
// NOTE: if selectedLevelIndex is set but levelRewards is empty the component
// falls back to ChapterView. A dev-time console.warn is emitted so the caller
// can diagnose the misconfiguration without a silent broken state.
//
// Zone mapping:
//   Zone 1  Breadcrumb bar    y≈0–32   full width (chapter crumb is a back button in detail view)
//   Zone 2  Chapter heading   y≈50–100 from content top (overview) / reward art (detail)
//   Zone 3  Reward cards      fills remaining height (overview) / reward strip (detail)
//   Zone 4  XP progress bar   bottom strip (overview) / action bar with XpBar (detail)
// ---------------------------------------------------------------------------

export function BattlePassScreen({
  eventName,
  endsIn,
  chapters,
  activeChapterIndex,
  currentXp,
  totalXp,
  playerLevel,
  selectedLevelIndex,
  levelRewards = [],
  onSelectLevel,
  onClaim,
  onPurchasePass,
}: BattlePassScreenProps) {
  const uid = useId();

  const chapter = chapters[activeChapterIndex];
  const chapterLabel = chapter?.label;

  // Validate coupling: selectedLevelIndex set but no levelRewards supplied.
  const isLevelView =
    selectedLevelIndex !== undefined && levelRewards.length > 0;

  if (
    selectedLevelIndex !== undefined &&
    levelRewards.length === 0
  ) {
    // Dev-time guard: both props must be supplied together.
    console.warn(
      "[BattlePassScreen] selectedLevelIndex is set but levelRewards is empty — " +
        "falling back to ChapterView. Provide levelRewards[] to render the level-detail view.",
    );
  }

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      aria-label="Battle Pass"
      style={{
        background:
          "radial-gradient(ellipse at 30% 50%, color-mix(in srgb, var(--color-riot-red) 18%, var(--color-hextech-black) 82%) 0%, var(--color-hextech-black) 70%)",
      }}
    >
      {/* Atmospheric texture — subtle dark vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 80%, color-mix(in srgb, var(--color-hextech-black) 0%, transparent) 0%, color-mix(in srgb, var(--color-hextech-black) 60%, transparent) 100%)",
        }}
      />

      {/* Zone 1 — Breadcrumb bar */}
      <div className="relative z-10">
        <BreadcrumbBar
          eventName={eventName}
          endsIn={endsIn}
          chapterLabel={isLevelView ? chapterLabel : undefined}
          onBack={isLevelView ? () => onSelectLevel?.(undefined) : undefined}
          uid={uid}
        />
      </div>

      {/* Zones 2–4 — switches between chapter overview and level detail */}
      <div className="relative z-10 flex flex-1 min-h-0 flex-col">
        {isLevelView ? (
          <LevelView
            chapters={chapters}
            activeChapterIndex={activeChapterIndex}
            levelRewards={levelRewards}
            selectedLevelIndex={selectedLevelIndex}
            playerLevel={playerLevel}
            currentXp={currentXp}
            totalXp={totalXp}
            onSelectLevel={onSelectLevel}
            onClaim={onClaim}
            onPurchasePass={onPurchasePass}
            uid={uid}
          />
        ) : (
          <ChapterView
            chapters={chapters}
            activeChapterIndex={activeChapterIndex}
            playerLevel={playerLevel}
            currentXp={currentXp}
            totalXp={totalXp}
            onSelectLevelReward={
              levelRewards.length > 0
                ? (levelRewardIndex) => onSelectLevel?.(levelRewardIndex)
                : undefined
            }
            uid={uid}
          />
        )}
      </div>
    </div>
  );
}
