/**
 * UniverseStoryCard — story/article card from the Universe Explore grid and
 * LATEST section on universe.leagueoflegends.com.
 *
 * Structure (reverted from wrong #973 overlay to correct below-art body panel):
 *   ┌──────────────────────────────┐
 *   │  Art (16:9 aspect ratio)     │  ← object-cover, zoom on hover via CSS group
 *   ├──────────────────────────────┤
 *   │  Overline (gold, small caps) │  ← dark body panel below the art
 *   │  TITLE BEAUFORT CAPS         │
 *   │  [badge] ·············[date] │  ← bottom row in body panel
 *   └──────────────────────────────┘
 *
 * When className includes "h-full" (tall grid cell / row-span-2), the card is
 * flex-col and the art section grows to fill available height above the body.
 *
 * Whole card is a link. Hover: art zooms + card lifts (pure CSS, no state).
 *
 * Badge variants:
 *   "story"  → "Short Story" green pill (book icon + text)
 *   "comic"  → page-count chip (book icon + text, blue fill)
 *   "video"  → "Watch" pill (play icon)
 *   "music"  → "Listen" pill (music note icon)
 *
 * Server-safe — no 'use client'. Hover handled via CSS group-hover utilities.
 * Props-in / callbacks-out. Tokens-only. Issues #968, #973, #975.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type UniverseStoryKind = "story" | "comic" | "video" | "music";

export interface UniverseStoryCardProps {
  /** Art thumbnail URL — use championSplashUrl() from @low/fixtures for demos. */
  art: string;
  /** Region/champion overline label, e.g. "LeBlanc" or "Piltover". */
  overline: string;
  /** Story/article title text. */
  title: string;
  /**
   * Content kind — drives badge icon and color.
   * @default "story"
   */
  kind?: UniverseStoryKind;
  /**
   * Badge label text.
   * Defaults: story → "Short Story", comic → "8 Pages", video → "Watch", music → "Listen".
   */
  badgeText?: string;
  /**
   * Optional publish date string, e.g. "Mar 5, 2025". Displayed at bottom-right of body.
   */
  date?: string;
  /** Link href. @default "#" */
  href?: string;
  /**
   * Additional CSS class names applied to the root anchor element.
   * Use "h-full" to make the card fill a tall grid cell (e.g. row-span-2). #975
   */
  className?: string;
  /** Callback fired when the card is clicked. */
  onSelect?: () => void;
}

// ---------------------------------------------------------------------------
// Badge icons (inline SVG, no external deps)
// ---------------------------------------------------------------------------

function BookIcon() {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="2" y="1" width="8" height="10" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <line x1="4" y1="4" x2="8" y2="4" stroke="currentColor" strokeWidth="1" />
      <line x1="4" y1="6.5" x2="8" y2="6.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <polygon points="3,2 10,6 3,10" fill="currentColor" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M5 9V3l5-1v6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="3.5" cy="9" r="1.5" fill="currentColor" />
      <circle cx="8.5" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Badge
// ---------------------------------------------------------------------------

const KIND_DEFAULTS: Record<UniverseStoryKind, string> = {
  story: "Short Story",
  comic: "8 Pages",
  video: "Watch",
  music: "Listen",
};

interface BadgeProps {
  kind: UniverseStoryKind;
  text: string;
}

function StoryBadge({ kind, text }: BadgeProps) {
  const bgColor =
    kind === "comic"
      ? "var(--color-universe-badge-comic)"
      : kind === "story"
        ? "var(--color-universe-badge-story)"
        : "color-mix(in srgb, var(--color-hextech-black) 55%, transparent)";

  const Icon =
    kind === "video" ? PlayIcon : kind === "music" ? MusicIcon : BookIcon;

  return (
    <div
      className="flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-[0.08em]"
      style={{
        backgroundColor: bgColor,
        color: "var(--color-gold-1)",
        fontFamily: "var(--font-body)",
      }}
    >
      <Icon />
      <span>{text}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * UniverseStoryCard — story/article card for the Universe Explore grid.
 *
 * Presentational, server-safe (no 'use client'). Hover handled via CSS
 * group-hover utilities on the anchor — no useState needed.
 * Tokens-only — no raw hex colors outside packages/tokens.
 *
 * Layout: art on top (16:9), dark body panel below with overline + title +
 * badge/date row. When h-full, card is flex-col with art growing to fill.
 */
export function UniverseStoryCard({
  art,
  overline,
  title,
  kind = "story",
  badgeText,
  date,
  href = "#",
  className,
  onSelect,
}: UniverseStoryCardProps) {
  const badge = badgeText ?? KIND_DEFAULTS[kind];
  const isTall = className?.includes("h-full");

  return (
    <a
      href={href}
      onClick={
        onSelect
          ? (e) => {
              e.preventDefault();
              onSelect();
            }
          : undefined
      }
      className={`group block overflow-hidden rounded-sm transition-transform duration-300 hover:-translate-y-0.5${isTall ? " flex flex-col" : ""}${className ? ` ${className}` : ""}`}
      style={{ textDecoration: "none" }}
      aria-label={`${title} — ${overline}`}
    >
      {/* Art section — 16:9 or flex-grow when tall */}
      <div
        className={`relative overflow-hidden${isTall ? " flex-1 min-h-0" : ""}`}
        style={isTall ? undefined : { aspectRatio: "16 / 9" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={art}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Body panel — dark surface below the art */}
      <div
        className="px-3 pt-2 pb-3"
        style={{
          backgroundColor: "color-mix(in srgb, var(--color-hextech-black) 80%, var(--color-universe-bg) 20%)",
        }}
      >
        {/* Overline — region/champion, gold-2, small caps, letter-spaced */}
        <p
          className="truncate text-[10px] uppercase tracking-[0.1em]"
          style={{
            color: "var(--color-gold-2)",
            fontFamily: "var(--font-body)",
          }}
        >
          {overline}
        </p>

        {/* Title — Beaufort caps, near-white */}
        <p
          className="mt-1 line-clamp-2 font-display text-sm uppercase leading-tight"
          style={{ color: "var(--color-universe-story-ink)" }}
        >
          {title}
        </p>

        {/* Bottom row: badge (left) + date (right) */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <StoryBadge kind={kind} text={badge} />
          {date && (
            <span
              className="shrink-0 text-[10px] tabular-nums"
              style={{
                color: "var(--color-universe-story-ink)",
                fontFamily: "var(--font-body)",
                opacity: 0.55,
              }}
            >
              {date}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
