"use client";


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Counter pill data — one pill per entry, OR-joined when more than one. */
export interface MissionCounter {
  current: number;
  total: number;
}

/** A single row in the Weekly Missions panel. */
export interface MissionRow {
  /**
   * One counter = single pill (e.g. 0/5).
   * Two counters = two pills joined by "OR" (e.g. 0/30 OR 0/30).
   */
  counters: MissionCounter[];
  description: string;
  daysLabel: string;
  rewardPts: number;
}

/** A single reward item in the TFT Beta Pass track. */
export interface RewardItem {
  id: string;
  position: number;
  /** Image URL for the loot item, or undefined for placeholder. */
  imageSrc?: string;
  locked: boolean;
}

// ---------------------------------------------------------------------------
// Sub-component props
// ---------------------------------------------------------------------------

export interface OrbOfEnlightenmentPanelProps {
  /** Countdown string, e.g. "AVAILABLE IN 21H 59M 55S" or "READY TO CLAIM". */
  countdownLabel: string;
  /** Progress 0–1 along the orb progress track. */
  progress: number;
  /** True when the orb is ready to claim (CLAIM button enabled). */
  claimable?: boolean;
  onPlay: () => void;
  onClaim: () => void;
}

export interface TftRankBannerProps {
  profileIconSrc: string;
  /** Rank label, e.g. "UNRANKED" or "GOLD II". */
  rankLabel: string;
}

export interface WeeklyMissionsPanelProps {
  missions: MissionRow[];
}

export interface TftBetaPassTrackProps {
  items: RewardItem[];
  currentPts: number;
  totalPts: number;
  onOpenLoot: () => void;
}

export interface TftHubScreenProps {
  orb: OrbOfEnlightenmentPanelProps;
  rank: TftRankBannerProps;
  missions: WeeklyMissionsPanelProps;
  pass: TftBetaPassTrackProps;
}

// ---------------------------------------------------------------------------
// UpArrowIcon — reused in weekly missions reward column (teal arrow)
// Approximates the chevron-up arrows in the reference.
// ---------------------------------------------------------------------------

function UpArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-blue-2"
    >
      <path
        d="M12 5L19 12H5L12 5Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M12 11L19 18H5L12 11Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// LockIcon — used on locked pass items
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
// HextechChevronIcon — chevron overlay on the orb placeholder
// Approximates the Hextech crest mark visible in the reference.
// ---------------------------------------------------------------------------

function HextechChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gold-1"
      style={{ filter: "drop-shadow(0 0 6px var(--color-blue-2))" }}
    >
      {/* Outer hexagon ring */}
      <polygon
        points="32,4 58,18 58,46 32,60 6,46 6,18"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.7"
      />
      {/* Inner chevron / caret up shape */}
      <path
        d="M32 20L46 36H18L32 20Z"
        fill="currentColor"
        opacity="0.85"
      />
      <path
        d="M32 30L42 42H22L32 30Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// OrbOfEnlightenmentPanel
// ---------------------------------------------------------------------------

function OrbOfEnlightenmentPanel({
  countdownLabel,
  progress,
  claimable = false,
  onPlay,
  onClaim,
}: OrbOfEnlightenmentPanelProps) {
  const fillPct = Math.max(0, Math.min(1, progress)) * 100;

  return (
    <section
      aria-label="Orb of Enlightenment"
      className="flex flex-col gap-3 border border-gold-5 bg-blue-8 p-4"
      style={{ flex: "0 0 38%" }}
    >
      {/* Header */}
      <h2 className="font-display text-sm uppercase tracking-widest text-gold-2">
        Orb of Enlightenment
      </h2>

      {/* Orb art */}
      <div className="flex justify-center">
        <div
          className="flex items-center justify-center rounded-full border-2 border-gold-5 bg-blue-6"
          style={{
            width: 180,
            height: 180,
            boxShadow: "0 0 24px color-mix(in srgb, var(--color-blue-2) 40%, transparent), inset 0 0 32px color-mix(in srgb, var(--color-blue-6) 60%, transparent)",
          }}
        >
          <HextechChevronIcon />
        </div>
      </div>

      {/* Countdown label */}
      <p className="text-center font-display text-xs uppercase tracking-widest text-gold-cream">
        {countdownLabel}
      </p>

      {/* Progress track */}
      <div className="flex flex-col gap-1.5">
        <div
          role="progressbar"
          aria-valuenow={Math.round(fillPct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Orb progress"
          className="relative h-1.5 w-full bg-grey-4"
        >
          <div
            className="absolute inset-y-0 left-0 bg-gold-4"
            style={{ width: `${fillPct}%` }}
          />
          {/* Question mark milestone marker at 50% */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center"
            aria-hidden="true"
            style={{ left: "50%" }}
          >
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full border border-grey-3 bg-blue-8 font-display text-xs text-grey-2"
            >
              ?
            </span>
          </div>
        </div>
      </div>

      {/* CTA row */}
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onPlay}
          className="flex-1 border border-gold-4 bg-gold-5 px-4 py-2 font-display text-xs uppercase tracking-widest text-gold-1 transition-colors duration-150 hover:bg-gold-4 cursor-pointer"
        >
          Play
        </button>
        <button
          type="button"
          onClick={claimable ? onClaim : undefined}
          aria-disabled={!claimable}
          disabled={!claimable}
          className={[
            "flex-1 border px-4 py-2 font-display text-xs uppercase tracking-widest transition-colors duration-150",
            claimable
              ? "border-gold-4 text-gold-1 hover:bg-gold-5/20 cursor-pointer"
              : "cursor-default border-grey-3 text-grey-2 opacity-60",
          ].join(" ")}
        >
          Claim
        </button>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// TftRankBanner
// ---------------------------------------------------------------------------

function TftRankBanner({ profileIconSrc, rankLabel }: TftRankBannerProps) {
  return (
    <section
      aria-label="TFT rank"
      className="flex flex-col items-center gap-0"
      style={{ flex: "0 0 24%" }}
    >
      {/* Profile icon */}
      <div className="relative z-10 -mb-2">
        <div
          className="overflow-hidden rounded-full border-2 border-gold-4"
          style={{ width: 64, height: 64 }}
        >
          <img
            src={profileIconSrc}
            alt="Profile icon"
            width={64}
            height={64}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Banner body — dark fabric drape with gold trim */}
      <div
        className="relative flex flex-col items-center"
        style={{ width: 160 }}
      >
        {/* Gold top trim bar */}
        <div
          className="w-full border-t-4 border-gold-4"
          style={{
            background: "linear-gradient(to bottom, var(--color-gold-5) 0%, transparent 100%)",
            height: 6,
          }}
        />

        {/* Banner fabric — tall dark rectangle with subtle tapered bottom */}
        <div
          className="relative flex w-full flex-1 flex-col items-center justify-end pb-8"
          style={{
            background: "color-mix(in srgb, var(--color-blue-8) 90%, var(--color-blue-7) 10%)",
            minHeight: 260,
            clipPath: "polygon(0 0, 100% 0, 100% 88%, 50% 100%, 0 88%)",
            border: "1px solid var(--color-gold-5)",
            borderTop: "none",
          }}
        >
          {/* Bottom gold accent line */}
          <div
            className="absolute bottom-[12%] left-0 right-0 h-px bg-gold-4 opacity-60"
            aria-hidden="true"
          />
          <span className="font-display text-sm uppercase tracking-widest text-gold-1">
            {rankLabel}
          </span>
        </div>

        {/* Bottom gold trim */}
        <div className="h-1 w-3/4 bg-gold-4 opacity-70" />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// CounterPill
// ---------------------------------------------------------------------------

function CounterPill({ current, total }: MissionCounter) {
  return (
    <span className="flex items-center justify-center rounded border border-gold-5 bg-blue-7 px-2 py-0.5 font-display text-xs text-gold-cream">
      {current}/{total}
    </span>
  );
}

// ---------------------------------------------------------------------------
// WeeklyMissionsPanel
// ---------------------------------------------------------------------------

function WeeklyMissionsPanel({ missions }: WeeklyMissionsPanelProps) {
  return (
    <section
      aria-label="Weekly Missions"
      className="flex flex-col gap-3 border border-gold-5 bg-blue-8 p-4"
      style={{ flex: "0 0 38%" }}
    >
      {/* Header */}
      <h2 className="font-display text-sm uppercase tracking-widest text-gold-2">
        Weekly Missions
      </h2>

      {/* Mission rows */}
      <div className="flex flex-col gap-2">
        {missions.map((mission, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 border-b border-gold-5/30 pb-2 last:border-b-0 last:pb-0"
          >
            {/* Counter pill(s) */}
            <div className="flex shrink-0 items-center gap-1.5">
              {mission.counters.map((counter, cIdx) => (
                <span key={cIdx} className="flex items-center gap-1.5">
                  {cIdx > 0 && (
                    <span className="font-display text-xs text-grey-2">OR</span>
                  )}
                  <CounterPill {...counter} />
                </span>
              ))}
            </div>

            {/* Description + days label */}
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="font-body text-xs text-gold-cream leading-snug">
                {mission.description}
              </span>
              <span className="font-display text-xs text-grey-2">{mission.daysLabel}</span>
            </div>

            {/* Reward — arrow icon + pts */}
            <div className="flex shrink-0 flex-col items-center gap-0.5">
              <UpArrowIcon />
              <span className="font-display text-xs text-gold-cream">{mission.rewardPts} pts</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// LootBoxPlaceholder — placeholder when no imageSrc provided
// ---------------------------------------------------------------------------

function LootBoxPlaceholder() {
  return (
    <div
      className="flex h-full w-full items-center justify-center bg-blue-7"
    >
      {/* Generic loot capsule glyph */}
      <svg
        aria-hidden="true"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gold-5"
      >
        <ellipse cx="16" cy="10" rx="10" ry="6" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M6 10v12c0 3.314 4.477 6 10 6s10-2.686 10-6V10"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <line x1="6" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TftBetaPassTrack
// ---------------------------------------------------------------------------

function TftBetaPassTrack({
  items,
  currentPts,
  totalPts,
  onOpenLoot,
}: TftBetaPassTrackProps) {
  const progressPct = totalPts > 0 ? Math.min(1, currentPts / totalPts) * 100 : 0;

  return (
    <section
      aria-label="TFT Beta Pass"
      className="flex flex-col gap-3 border-t border-gold-5 bg-blue-8 px-4 py-3"
    >
      {/* Track header row */}
      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm uppercase tracking-widest text-gold-2">
          TFT Beta Pass
        </h2>
        <button
          type="button"
          onClick={onOpenLoot}
          className="border border-gold-4 bg-transparent px-4 py-1 font-display text-xs uppercase tracking-widest text-gold-1 transition-colors duration-150 hover:bg-gold-5/20 cursor-pointer"
        >
          Open Loot
        </button>
      </div>

      {/* Items row */}
      <div className="flex items-end gap-2">
        {/* Left chevron */}
        <button
          type="button"
          aria-label="Scroll pass track left"
          className="flex h-8 w-8 shrink-0 items-center justify-center border border-grey-3 text-grey-2 transition-colors duration-150 hover:border-gold-4 hover:text-gold-1 cursor-pointer"
        >
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Pass reward cards */}
        <div className="flex flex-1 items-end gap-1.5 overflow-hidden">
          {items.map((item) => (
            <div
              key={item.id}
              className="relative flex shrink-0 flex-col"
              style={{ width: 72 }}
              aria-label={`Pass reward ${item.position}${item.locked ? " (locked)" : ""}`}
            >
              {/* Card art area */}
              <div
                className={[
                  "relative border",
                  item.locked
                    ? "border-grey-4 opacity-50"
                    : "border-gold-5",
                ].join(" ")}
                style={{ height: 80 }}
              >
                {item.imageSrc ? (
                  <img
                    src={item.imageSrc}
                    alt={`Reward ${item.position}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <LootBoxPlaceholder />
                )}

                {/* Lock overlay */}
                {item.locked && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-blue-8/60 text-grey-2"
                    aria-hidden="true"
                  >
                    <LockIcon size={20} />
                  </div>
                )}
              </div>

              {/* Position number badge — gold circle at bottom center */}
              <div className="flex justify-center">
                <span
                  className={[
                    "flex h-5 w-5 -translate-y-2 items-center justify-center rounded-full font-display text-xs",
                    item.locked
                      ? "bg-grey-4 text-grey-2"
                      : "bg-gold-4 text-hextech-black",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {item.position}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right chevron */}
        <button
          type="button"
          aria-label="Scroll pass track right"
          className="flex h-8 w-8 shrink-0 items-center justify-center border border-grey-3 text-grey-2 transition-colors duration-150 hover:border-gold-4 hover:text-gold-1 cursor-pointer"
        >
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Progress bar row */}
      <div className="flex flex-col gap-1">
        <div className="relative h-1.5 w-full bg-grey-4">
          <div
            className="absolute inset-y-0 left-0 bg-gold-4 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
            role="progressbar"
            aria-valuenow={currentPts}
            aria-valuemin={0}
            aria-valuemax={totalPts}
            aria-label="Pass progress"
          />
          {/* Lock milestone markers */}
          {[1, 2, 3, 4, 5, 6].map((milestone) => (
            <div
              key={milestone}
              aria-hidden="true"
              className="absolute top-1/2 -translate-y-1/2 text-grey-3"
              style={{ left: `${(milestone / 6) * 100}%`, transform: "translate(-50%, -50%)" }}
            >
              <LockIcon size={10} />
            </div>
          ))}
        </div>
        <span className="font-display text-xs text-grey-2">
          {currentPts} / {totalPts} pts
        </span>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// TftHubScreen — composes all four zones
// ---------------------------------------------------------------------------

/**
 * TFT Hub screen — the full view shown when the Teamfight Tactics nav item is
 * active in the client shell. Presentational: all data comes in via props.
 *
 * Layout:
 * - Background: full-bleed dark purple/hextech art (bg-blue-8 solid fallback)
 * - Top row (flex): OrbOfEnlightenmentPanel (38%) | TftRankBanner (24%) | WeeklyMissionsPanel (38%)
 * - Bottom strip: TftBetaPassTrack (full width)
 */
export function TftHubScreen({ orb, rank, missions, pass }: TftHubScreenProps) {
  return (
    <div
      className="relative flex h-full w-full flex-col bg-blue-8"
      aria-label="Teamfight Tactics hub"
    >
      {/* Full-bleed art backdrop — dark purple champion art, blurred */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 60% 40%, color-mix(in srgb, var(--color-blue-6) 25%, transparent) 0%, transparent 70%)",
        }}
      />

      {/* Content column — sits above backdrop */}
      <div className="relative flex h-full flex-col gap-0 z-10">
        {/* Top three-panel row */}
        <div className="flex flex-1 min-h-0 items-stretch gap-4 p-4">
          <OrbOfEnlightenmentPanel {...orb} />
          <TftRankBanner {...rank} />
          <WeeklyMissionsPanel {...missions} />
        </div>

        {/* Beta pass track — full width bottom strip */}
        <TftBetaPassTrack {...pass} />
      </div>
    </div>
  );
}
