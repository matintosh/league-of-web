/**
 * UniverseStoryCard — story/article card from the Universe Explore grid and
 * LATEST section on universe.leagueoflegends.com.
 *
 * Structure (after #973 fix — text overlaid on art, no separate body below):
 *   ┌──────────────────────────────┐
 *   │  Art (16:9, full-bleed)      │  ← object-cover, zoom on hover via CSS group
 *   │                              │
 *   │  [gradient scrim overlay]    │
 *   │  TITLE BEAUFORT CAPS         │  ← overlaid bottom-left on art
 *   │  Overline (gold caps, small) │  ← below title, still in art
 *   │  [badge bottom-left]         │  ← lowest, inside art
 *   └──────────────────────────────┘
 *
 * Whole card is a link. Hover: art zooms + card lifts (pure CSS, no state).
 *
 * Badge variants:
 *   "story"  → "Read Story" green pill (book icon + text)
 *   "comic"  → page-count chip (book icon + text, blue fill)
 *   "video"  → "Watch" pill (play icon)
 *   "music"  → "Listen" pill (music note icon)
 *
 * Server-safe — no 'use client'. Hover handled via CSS group-hover utilities.
 * Props-in / callbacks-out. Tokens-only. Issues #968, #973.
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
   * Defaults: story → "Read Story", comic → "8 Pages", video → "Watch", music → "Listen".
   */
  badgeText?: string;
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
  story: "Read Story",
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
 * Fix #973: overline + title now overlaid on art at bottom (no separate body
 * panel below the image). Card ends at the bottom edge of the art.
 */
export function UniverseStoryCard({
  art,
  overline,
  title,
  kind = "story",
  badgeText,
  href = "#",
  className,
  onSelect,
}: UniverseStoryCardProps) {
  const badge = badgeText ?? KIND_DEFAULTS[kind];

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
      className={`group block overflow-hidden rounded-sm transition-transform duration-300 hover:-translate-y-0.5${className ? ` ${className}` : ""}`}
      style={{
        textDecoration: "none",
      }}
      aria-label={`${title} — ${overline}`}
    >
      {/* Art — full-bleed, zoom on hover; text + badge overlaid inside.
          Uses aspectRatio 16:9 by default; if className includes "h-full"
          the card fills its grid cell and the art div fills the anchor. */}
      <div
        className="relative overflow-hidden"
        style={className?.includes("h-full") ? { height: "100%" } : { aspectRatio: "16 / 9" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={art}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient scrim — tall bottom fade covering text + badge (#973) */}
        <div
          className="absolute inset-x-0 bottom-0 h-3/4"
          style={{
            background:
              "linear-gradient(to top, color-mix(in srgb, var(--color-hextech-black) 88%, transparent) 0%, color-mix(in srgb, var(--color-hextech-black) 55%, transparent) 45%, transparent 100%)",
          }}
          aria-hidden="true"
        />

        {/* Text overlay — title + overline stacked above badge (#973) */}
        <div className="absolute inset-x-0 bottom-8 px-3">
          {/* Title — Beaufort caps, near-white, above overline */}
          <p
            className="line-clamp-2 font-display text-sm uppercase leading-tight"
            style={{ color: "var(--color-universe-story-ink)" }}
          >
            {title}
          </p>
          {/* Overline — region/champion, gold-2, caps, letter-spaced */}
          <p
            className="mt-0.5 truncate text-[10px] uppercase tracking-[0.1em]"
            style={{
              color: "var(--color-gold-2)",
              fontFamily: "var(--font-body)",
            }}
          >
            {overline}
          </p>
        </div>

        {/* Badge — bottom-left over the art, lowest z element */}
        <div className="absolute bottom-2 left-2">
          <StoryBadge kind={kind} text={badge} />
        </div>
      </div>
    </a>
  );
}
