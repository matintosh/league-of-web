/**
 * ObjectivesModal — the current-era Missions / Objectives surface.
 *
 * Opened from the nav-band Missions icon (issue #395 / era-shift epic #384). It
 * is a centered modal over the lobby (NOT a full-bleed takeover) matching
 * docs/reference/client-current-objectives-modal.jpg — the "Welcome to Noxus:
 * Act 1 — Chapter II" objectives panel.
 *
 * Layout, PIL-measured from the 1920×1080 reference:
 *   - Modal card ≈ 1290×700 on a 1920-wide canvas → ~67% width / ~65% height,
 *     centered (slightly left of the social rail). We express it as a max-sized
 *     centered card so it scales to the 1280×720 client window.
 *   - Left sidebar ≈ 19% of card width: "OBJECTIVES" title, a two-tab filter
 *     glyph row (gold underline under the active tab), then a vertical category
 *     nav list (Daily ✓ / Weekly • / Act 1 / Events [selected gold bar] /
 *     Mastery / Ranked).
 *   - Right pane: a splash-art banner header (eyebrow + title + free-reward
 *     sub + ✕ close), a Blue-XP progress bar row (level badges flanking a
 *     current/total fill), a section header with a count badge, then a
 *     scrollable list of mission rows (circular progress ring + fraction,
 *     title + subtitle, reward tile with a quantity badge).
 *
 * Presentational: props in, callbacks out — no internal state. The shell owns
 * visibility (open/close) and which category is active.
 */
"use client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** One row in the mission list. */
export interface ObjectiveMission {
  /** Stable id. */
  id: string;
  /** Current progress count (fills the ring). */
  current: number;
  /** Total needed to complete. */
  total: number;
  /** Bold mission title / chain name. */
  title: string;
  /** Grey descriptor line under the title. */
  subtitle: string;
  /** Reward tile art URL (loot / champion square). */
  rewardIconSrc: string;
  /** Optional small quantity badge over the reward tile (e.g. token count, BE). */
  rewardQuantity?: number;
}

/** A left-rail category entry. */
export interface ObjectiveCategory {
  /** Stable id — matched against `activeCategoryId`. */
  id: string;
  /** Display label (rendered uppercase). */
  label: string;
  /**
   * Trailing status marker:
   *   "complete"  → gold check (all missions in the category done)
   *   "attention" → gold dot (unclaimed / new)
   */
  state?: "complete" | "attention";
}

export interface ObjectivesModalProps {
  /** When false, renders nothing. */
  open: boolean;
  /** Banner header content. */
  header: {
    /** Small label above the title, e.g. "Welcome to Noxus: Act 1". */
    eyebrow: string;
    /** Large banner title, e.g. "Chapter II". */
    title: string;
    /** Free-reward sub-line, e.g. "Free Reward: Level 19". */
    freeRewardLabel: string;
    /** Banner background splash art URL. */
    artSrc: string;
  };
  /** Blue-XP progress bar between the banner and the mission list. */
  bxp: {
    /** Level badge shown at the left end of the bar. */
    currentLevel: number;
    /** Level badge shown at the right end of the bar. */
    nextLevel: number;
    /** Current BXP toward the next level. */
    current: number;
    /** BXP needed for the next level. */
    total: number;
  };
  /** Left-rail category list. */
  categories: ObjectiveCategory[];
  /** Id of the active category (highlighted with the gold bar). */
  activeCategoryId: string;
  /** Section header label above the mission list, e.g. "Events". */
  sectionLabel: string;
  /** Count badge at the right of the section header. */
  sectionCount: number;
  /** Mission rows for the active category. */
  missions: ObjectiveMission[];
  /** Called when a category is selected. */
  onSelectCategory?: (id: string) => void;
  /** Called when the ✕ close button is pressed (shell hides the modal). */
  onClose?: () => void;
  /** Called when the dimmed backdrop is clicked (same effect as close). */
  onBackdropClick?: () => void;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

/** ✕ close glyph. */
function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1l12 12M13 1L1 13"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** ✓ gold check for a completed category. */
function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 6.5l2.5 2.5L10 3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Progress ring — circular fraction indicator on each mission row
// ---------------------------------------------------------------------------

/**
 * Circular progress ring rendered as an SVG donut. The reference shows a thin
 * teal-filled arc over a dark track, with the fraction stacked in the middle.
 */
function ProgressRing({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const size = 36;
  const stroke = 3;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = total > 0 ? Math.min(1, Math.max(0, current / total)) : 0;
  const complete = current >= total && total > 0;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-blue-5)"
          strokeWidth={stroke}
        />
        {/* Progress arc — starts at 12 o'clock */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={complete ? "var(--color-gold-2)" : "var(--color-cyan-2)"}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {/* Fraction text centered in the ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-body text-[10px] leading-none text-gold-1">
          {current}/{total}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mission row
// ---------------------------------------------------------------------------

function MissionRow({ mission }: { mission: ObjectiveMission }) {
  return (
    <li className="flex items-center gap-3 border-b border-gold-5/60 px-4 py-1.5">
      <ProgressRing current={mission.current} total={mission.total} />

      {/* Title + subtitle */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-[11px] uppercase tracking-wide text-grey-1">
          {mission.title}
        </p>
        <p className="mt-0.5 truncate font-display text-[13px] text-gold-1">
          {mission.subtitle}
        </p>
      </div>

      {/* Reward tile with a quantity badge */}
      <div className="relative shrink-0">
        <div className="h-9 w-9 overflow-hidden border border-gold-4 bg-hextech-black">
          <img
            src={mission.rewardIconSrc}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0";
            }}
          />
        </div>
        {mission.rewardQuantity !== undefined && (
          <span
            className="absolute -right-1.5 -top-1.5 flex min-w-[18px] items-center justify-center rounded-full border border-gold-4 bg-hextech-black px-1 font-body text-[10px] leading-none text-gold-1"
            style={{ height: 18 }}
          >
            {mission.rewardQuantity}
          </span>
        )}
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------------
// ObjectivesModal — public component
// ---------------------------------------------------------------------------

export function ObjectivesModal({
  open,
  header,
  bxp,
  categories,
  activeCategoryId,
  sectionLabel,
  sectionCount,
  missions,
  onSelectCategory,
  onClose,
  onBackdropClick,
}: ObjectivesModalProps) {
  if (!open) return null;

  const bxpPct =
    bxp.total > 0
      ? Math.min(1, Math.max(0, bxp.current / bxp.total))
      : 0;

  return (
    <div
      className="absolute inset-px z-40 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Objectives"
    >
      {/* Dimmed backdrop — click to dismiss */}
      <button
        type="button"
        aria-label="Close Objectives"
        tabIndex={-1}
        onClick={onBackdropClick ?? onClose}
        className="absolute inset-0 cursor-default bg-hextech-black/70"
      />

      {/* Modal card. Proportions PIL-measured from the 1920×1080 reference: the
          card spans ≈64% width / ≈56% height (aspect ≈2.05 — wider + shorter
          than a square). On the 1280×720 client window that's ≈820×400. Capped
          at 840×404 so the aspect holds while the internal sizing (compact
          banner + rings + tiles + row padding) keeps all rows visible without
          scroll-clipping at the shorter height. */}
      <div
        className="relative flex overflow-hidden border border-gold-4 shadow-2xl"
        style={{
          width: "min(840px, 68%)",
          height: "min(404px, 58%)",
          backgroundColor: "var(--color-blue-7)",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Left sidebar */}
        {/* ---------------------------------------------------------------- */}
        <aside
          className="flex shrink-0 flex-col border-r border-gold-5"
          style={{ width: "22%", backgroundColor: "var(--color-hextech-black)" }}
        >
          <h2 className="px-6 pt-6 pb-4 font-display text-xl uppercase tracking-[0.15em] text-gold-cream">
            Objectives
          </h2>

          {/* Filter tab glyph row — two placeholder toggle tabs with a gold
              underline on the active one (matches the reference's two circular
              filter icons above the category list). Decorative; not wired. */}
          <div className="flex items-center gap-6 border-b border-gold-5 px-6 pb-3">
            <span
              className="flex h-7 w-7 items-center justify-center border-b-2 border-gold-2 text-gold-1"
              aria-hidden="true"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M9 5v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <span
              className="flex h-7 w-7 items-center justify-center border-b-2 border-transparent text-grey-2"
              aria-hidden="true"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 4h12M3 9h12M3 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
          </div>

          {/* Category nav list */}
          <nav className="flex flex-col overflow-y-auto py-2">
            {categories.map((cat) => {
              const active = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-current={active ? "true" : undefined}
                  onClick={() => onSelectCategory?.(cat.id)}
                  className={[
                    "relative flex items-center justify-between gap-2 px-6 py-2.5 text-left font-body text-sm uppercase tracking-wider transition-colors duration-150",
                    active
                      ? "text-gold-1"
                      : "cursor-pointer text-grey-1 hover:text-gold-2",
                  ].join(" ")}
                  style={
                    active
                      ? {
                          backgroundColor:
                            "color-mix(in srgb, var(--color-gold-4) 12%, transparent)",
                        }
                      : undefined
                  }
                >
                  {/* Active gold bar on the left edge */}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-0 left-0 w-[3px] bg-gold-2"
                    />
                  )}
                  <span className="truncate">{cat.label}</span>
                  {cat.state === "complete" && (
                    <span className="shrink-0 text-gold-2">
                      <CheckIcon />
                    </span>
                  )}
                  {cat.state === "attention" && (
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 rounded-full bg-gold-2"
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ---------------------------------------------------------------- */}
        {/* Right pane */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Banner header */}
          <header className="relative shrink-0 overflow-hidden" style={{ height: 76 }}>
            <img
              src={header.artSrc}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0";
              }}
            />
            {/* Left-to-right dark scrim for text legibility */}
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  "linear-gradient(to right, var(--color-hextech-black) 8%, color-mix(in srgb, var(--color-hextech-black) 55%, transparent) 55%, transparent)",
              }}
            />
            <div className="relative flex h-full flex-col justify-center px-6">
              <p className="font-body text-[10px] uppercase tracking-[0.2em] text-gold-2">
                {header.eyebrow}
              </p>
              <h3 className="font-display text-lg uppercase tracking-wide text-gold-cream">
                {header.title}
              </h3>
              <p className="mt-0.5 font-body text-[10px] text-grey-1">
                {header.freeRewardLabel}
              </p>
            </div>

            {/* Close button */}
            {onClose && (
              <button
                type="button"
                aria-label="Close Objectives"
                onClick={onClose}
                className="absolute right-3 top-3 flex h-7 w-7 cursor-pointer items-center justify-center text-grey-1 transition-colors duration-150 hover:text-gold-1"
              >
                <CloseIcon />
              </button>
            )}
          </header>

          {/* Blue-XP progress bar row */}
          <div
            className="flex shrink-0 items-center gap-3 border-b border-gold-5 px-6 py-1.5"
            style={{ backgroundColor: "var(--color-blue-6)" }}
          >
            <LevelBadge level={bxp.currentLevel} />
            <div className="relative min-w-0 flex-1">
              <div
                className="h-2 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--color-blue-4)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${bxpPct * 100}%`,
                    background:
                      "linear-gradient(to right, var(--color-cyan-3), var(--color-cyan-1))",
                  }}
                />
              </div>
              <p className="mt-1 text-center font-body text-[11px] tracking-wide text-grey-1">
                {bxp.current.toLocaleString("en-US")} /{" "}
                {bxp.total.toLocaleString("en-US")} BXP
              </p>
            </div>
            <LevelBadge level={bxp.nextLevel} />
          </div>

          {/* Section header */}
          <div className="flex shrink-0 items-center justify-between border-b border-gold-5 px-4 py-1">
            <h4 className="font-display text-sm uppercase tracking-[0.15em] text-gold-1">
              {sectionLabel}
            </h4>
            <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full border border-gold-5 px-1.5 font-body text-[11px] text-grey-1">
              {sectionCount}
            </span>
          </div>

          {/* Mission list — scrolls */}
          <ul className="min-h-0 flex-1 overflow-y-auto">
            {missions.map((m) => (
              <MissionRow key={m.id} mission={m} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Small hexagonal level badge flanking the BXP bar. */
function LevelBadge({ level }: { level: number }) {
  return (
    <span
      className="flex h-7 w-7 shrink-0 items-center justify-center border border-gold-4 font-display text-xs text-gold-1"
      style={{
        backgroundColor: "var(--color-hextech-black)",
        clipPath:
          "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      }}
      aria-label={`Level ${level}`}
    >
      {level}
    </span>
  );
}
