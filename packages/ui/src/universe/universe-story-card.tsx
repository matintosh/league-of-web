/**
 * UniverseStoryCard — story/article card from the Universe Explore grid and
 * LATEST section on universe.leagueoflegends.com.
 *
 * Structure:
 *   ┌──────────────────────────────┐
 *   │  Art thumbnail (16:9)        │  ← object-cover, zoom on hover via CSS group
 *   │  [badge bottom-left]         │
 *   ├──────────────────────────────┤
 *   │  Overline (gold-2, caps)     │  ← region / champion name
 *   │  Title (Beaufort caps)       │
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
 * Props-in / callbacks-out. Tokens-only. Issue #968.
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
        : "rgba(0,0,0,0.55)";

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
 */
export function UniverseStoryCard({
  art,
  overline,
  title,
  kind = "story",
  badgeText,
  href = "#",
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
      className="group block overflow-hidden rounded-sm transition-transform duration-300 hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--color-universe-card-bg)",
        textDecoration: "none",
      }}
      aria-label={`${title} — ${overline}`}
    >
      {/* Art thumbnail — 16:9 aspect, zoom on hover via group-hover */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "16 / 9" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={art}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient scrim — bottom fade for badge legibility */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.65), transparent)",
          }}
          aria-hidden="true"
        />

        {/* Badge — bottom-left over the art */}
        <div className="absolute bottom-2 left-2">
          <StoryBadge kind={kind} text={badge} />
        </div>
      </div>

      {/* Card body — overline + title */}
      <div className="px-3 pb-3 pt-2">
        {/* Overline — region/champion, gold-2, caps, letter-spaced */}
        <p
          className="mb-0.5 truncate text-[10px] uppercase tracking-[0.1em]"
          style={{
            color: "var(--color-gold-2)",
            fontFamily: "var(--font-body)",
          }}
        >
          {overline}
        </p>

        {/* Title — Beaufort caps, near-white */}
        <p
          className="line-clamp-2 font-display text-sm uppercase leading-tight"
          style={{ color: "var(--color-universe-story-ink)" }}
        >
          {title}
        </p>
      </div>
    </a>
  );
}
