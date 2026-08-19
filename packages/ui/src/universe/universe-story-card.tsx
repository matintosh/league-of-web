/**
 * UniverseStoryCard — story/article card on universe.leagueoflegends.com.
 *
 * TWO real variants (values extracted from the live site via getComputedStyle):
 *
 *  variant="crest" — HOME "LATEST"/"FEATURED" card:
 *    art (framed background-image) → centered gold CREST MEDALLION straddling the
 *    art/body seam → dark body with CENTERED overline (12px/700/#937341/Spiegel)
 *    + title (14px/500/#c4b998/Beaufort). On hover the body expands to reveal a
 *    centered "EXPLORE →" row above a gold hairline, and a gold border appears.
 *
 *  variant="badge" — EXPLORE page card:
 *    art (object-cover) → dark body with left overline + title + a green
 *    content-type badge ("Short Story" / "N Pages" / "Watch" / "Listen").
 *
 * Whole card is a link. Server-safe (no 'use client'); all hover via CSS
 * group-hover. Props-in / callbacks-out. Tokens-only. Issues #968, #973, #975.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

import { universeContentIcon } from "@low/fixtures";

export type UniverseStoryKind = "story" | "comic" | "video" | "music";
export type UniverseStoryVariant = "crest" | "badge";

export interface UniverseStoryCardProps {
  /** Art thumbnail URL — use championSplashUrl() from @low/fixtures for demos. */
  art: string;
  /** Region/champion overline label, e.g. "The Unsundered". */
  overline: string;
  /** Story/article title text, e.g. "Zaahen". */
  title: string;
  /**
   * Card variant. "crest" = home LATEST/FEATURED (medallion, centered, hover→EXPLORE);
   * "badge" = Explore page (green content-type badge, left-aligned). @default "crest"
   */
  variant?: UniverseStoryVariant;
  /** Content kind — drives the badge (badge variant only). @default "story" */
  kind?: UniverseStoryKind;
  /** Badge label override (badge variant). */
  badgeText?: string;
  /** Publish date (badge variant), e.g. "Mar 5, 2025". */
  date?: string;
  /** Background-position for the framed art (crest variant). @default "center 25%" */
  artPosition?: string;
  /** Link href. @default "#" */
  href?: string;
  /** Extra classes on the root anchor. Use "h-full" to fill a tall grid cell (#975). */
  className?: string;
  /** Callback fired when the card is clicked. */
  onSelect?: () => void;
}

// ---------------------------------------------------------------------------
// Crest medallion — content-type emblem in a gold ring (home variant)
// ---------------------------------------------------------------------------

function CrestMedallion() {
  // Real content-type crest emblem from the live site (gold ring + champion glyph).
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={universeContentIcon("champion")}
      alt=""
      aria-hidden="true"
      width={40}
      height={40}
      className="block"
      style={{ backgroundColor: "var(--color-universe-card-bg)", borderRadius: "50%", width: "40px", height: "40px", objectFit: "contain" }}
    />
  );
}

// ---------------------------------------------------------------------------
// Badge (explore variant)
// ---------------------------------------------------------------------------

const KIND_DEFAULTS: Record<UniverseStoryKind, string> = {
  story: "Short Story",
  comic: "8 Pages",
  video: "Watch",
  music: "Listen",
};

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

function StoryBadge({ kind, text }: { kind: UniverseStoryKind; text: string }) {
  const bgColor =
    kind === "comic"
      ? "var(--color-universe-badge-comic)"
      : kind === "story"
        ? "var(--color-universe-badge-story)"
        : "color-mix(in srgb, var(--color-hextech-black) 55%, transparent)";
  const Icon = kind === "video" ? PlayIcon : kind === "music" ? MusicIcon : BookIcon;
  return (
    <div
      className="flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-[0.08em]"
      style={{ backgroundColor: bgColor, color: "var(--color-gold-1)", fontFamily: "var(--font-body)" }}
    >
      <Icon />
      <span>{text}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function UniverseStoryCard({
  art,
  overline,
  title,
  variant = "crest",
  kind = "story",
  badgeText,
  date,
  artPosition = "center 25%",
  href = "#",
  className,
  onSelect,
}: UniverseStoryCardProps) {
  const isTall = className?.includes("h-full");
  const onClick = onSelect
    ? (e: React.MouseEvent) => {
        e.preventDefault();
        onSelect();
      }
    : undefined;

  // ── EXPLORE-PAGE VARIANT (green badge, left-aligned, object-cover art) ──
  if (variant === "badge") {
    const badge = badgeText ?? KIND_DEFAULTS[kind];
    return (
      <a
        href={href}
        onClick={onClick}
        className={`group block overflow-hidden rounded-sm transition-transform duration-300 hover:-translate-y-0.5${isTall ? " flex flex-col" : ""}${className ? ` ${className}` : ""}`}
        style={{ textDecoration: "none" }}
        aria-label={`${title} — ${overline}`}
      >
        <div className={`relative overflow-hidden${isTall ? " flex-1 min-h-0" : ""}`} style={isTall ? undefined : { aspectRatio: "16 / 9" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={art} alt={title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="px-3 pt-2 pb-3" style={{ backgroundColor: "color-mix(in srgb, var(--color-hextech-black) 80%, var(--color-universe-bg) 20%)" }}>
          <p className="truncate text-[10px] uppercase tracking-[0.1em]" style={{ color: "var(--color-gold-2)", fontFamily: "var(--font-body)" }}>{overline}</p>
          <p className="mt-1 line-clamp-2 font-display text-sm uppercase leading-tight" style={{ color: "var(--color-universe-story-ink)" }}>{title}</p>
          <div className="mt-2 flex items-center justify-between gap-2">
            <StoryBadge kind={kind} text={badge} />
            {date && <span className="shrink-0 text-[10px] tabular-nums" style={{ color: "var(--color-universe-story-ink)", fontFamily: "var(--font-body)", opacity: 0.55 }}>{date}</span>}
          </div>
        </div>
      </a>
    );
  }

  // ── HOME "CREST" VARIANT (medallion, centered, hover→EXPLORE) ──
  return (
    <a
      href={href}
      onClick={onClick}
      className={`group flex flex-col overflow-hidden transition-colors duration-200${className ? ` ${className}` : ""}`}
      style={{ textDecoration: "none", border: "1px solid transparent", ["--tw-hover-border" as string]: "" }}
      aria-label={`${title} — ${overline}`}
    >
      <style>{`
        .group:hover .usc-crest-border { border-color: var(--color-universe-title) !important; }
      `}</style>

      {/* Framed art — background-image + position, like the live site */}
      <div
        className={`usc-crest-border relative${isTall ? " flex-1 min-h-0" : ""}`}
        style={{
          ...(isTall ? {} : { aspectRatio: "5 / 4" }),
          backgroundImage: `url(${art})`,
          backgroundSize: "cover",
          backgroundPosition: artPosition,
          border: "1px solid transparent",
          borderBottom: "none",
        }}
      />

      {/* Body panel — centered crest medallion straddling seam, overline, title */}
      <div
        className="usc-crest-border relative flex flex-col items-center px-4 pb-4"
        style={{
          backgroundColor: "var(--color-universe-card-bg)",
          border: "1px solid transparent",
          borderTop: "none",
        }}
      >
        {/* Crest medallion — pulled up to straddle the art/body seam */}
        <div style={{ marginTop: "-20px" }}>
          <CrestMedallion />
        </div>

        {/* Overline — dark gold, centered, 700, Spiegel */}
        <p
          className="mt-2 text-center uppercase"
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--color-universe-overline)",
            letterSpacing: "2px",
            fontFamily: "var(--font-body)",
          }}
        >
          {overline}
        </p>

        {/* Title — warm cream, centered, Beaufort */}
        <p
          className="mt-1 text-center font-display uppercase"
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--color-universe-title)",
            letterSpacing: "2px",
          }}
        >
          {title}
        </p>

        {/* EXPLORE row — collapsed, expands on hover (server-safe CSS) */}
        <div
          className="grid w-full overflow-hidden transition-all duration-300"
          style={{ gridTemplateRows: "0fr" }}
        >
          <div className="min-h-0 overflow-hidden">
            <div
              className="mt-3 flex items-center justify-center gap-2 pt-3"
              style={{ borderTop: "1px solid color-mix(in srgb, var(--color-universe-overline) 45%, transparent)" }}
            >
              <span
                className="uppercase"
                style={{ fontSize: "11px", fontWeight: 500, color: "var(--color-universe-overline)", letterSpacing: "3.3px", fontFamily: "var(--font-display)" }}
              >
                Explore
              </span>
              <span style={{ color: "var(--color-universe-overline)", fontSize: "11px" }}>→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover: expand the EXPLORE row (grid-rows 0fr → 1fr) */}
      <style>{`.group:hover > div > .grid { grid-template-rows: 1fr !important; }`}</style>
    </a>
  );
}
