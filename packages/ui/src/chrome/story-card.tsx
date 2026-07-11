"use client";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface StoryCardProps {
  /** Champion or region name shown above the title, e.g. "Ahri" */
  eyebrow?: string;
  /** Story headline; clamps to 2 lines */
  title: string;
  /** Media type label shown in the footer badge, e.g. "Short Story" | "Comic" */
  mediaType: string;
  /** Pre-formatted display date string, e.g. "July 2026" */
  date: string;
  /** Portrait art image URL (ideally 4:5 ratio, e.g. loading art 308×560) */
  imageSrc: string;
  /** When provided, the whole card becomes a <button> that calls onOpen. */
  onOpen?: () => void;
}

// ---------------------------------------------------------------------------
// StoryCard
// ---------------------------------------------------------------------------

/**
 * StoryCard — universe content card matching universe.leagueoflegends.com explore grid.
 *
 * Portrait art window (4:5 aspect) with clipped hover zoom, optional eyebrow
 * champion/region label, 2-line-clamped uppercase display title, and a footer
 * row with a media-type badge + date.
 *
 * Corner L-bracket overlays (1px gold-5 top+side borders at the two top corners)
 * are included as an absolutely-positioned decoration on the art window.
 *
 * Renders as a <button> when `onOpen` is provided, otherwise a plain <div>.
 * The `group` class is applied to BOTH branches so hover-zoom always fires.
 *
 * Presentational only — props in, callbacks out. No data fetching.
 */
export function StoryCard({
  eyebrow,
  title,
  mediaType,
  date,
  imageSrc,
  onOpen,
}: StoryCardProps) {
  const artWindow = (
    <div className="relative aspect-[4/5] w-full overflow-hidden">
      {/* Corner L-brackets — top-left */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-10 h-4 w-4 border-l border-t border-gold-5"
      />
      {/* Corner L-bracket — top-right */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 z-10 h-4 w-4 border-r border-t border-gold-5"
      />
      <img
        src={imageSrc}
        alt={title}
        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  );

  const body = (
    <div className="p-3 flex flex-col gap-1">
      {eyebrow && (
        <span className="font-body font-bold text-xs text-gold-cream capitalize">
          {eyebrow}
        </span>
      )}
      <h3 className="font-display uppercase tracking-wide text-base text-gold-1 line-clamp-2">
        {title}
      </h3>
      <div className="flex items-center gap-1.5 mt-1">
        {/* Media-type colour badge */}
        <span aria-hidden className="inline-block h-3 w-3 shrink-0 bg-blue-3" />
        <span className="text-xs text-grey-1">{mediaType}</span>
        <span className="text-xs text-grey-1 mx-0.5">·</span>
        <span className="text-xs text-grey-1">{date}</span>
      </div>
    </div>
  );

  if (onOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="group bg-hextech-black border border-grey-4 w-full text-left"
        aria-label={title}
      >
        {artWindow}
        {body}
      </button>
    );
  }

  return (
    <div className="group bg-hextech-black border border-grey-4">
      {artWindow}
      {body}
    </div>
  );
}
