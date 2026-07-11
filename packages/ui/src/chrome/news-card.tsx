"use client";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface NewsCardProps {
  /** Content category, e.g. "GAME UPDATES" */
  category: string;
  /** Pre-formatted display date string, e.g. "6/23/2026" */
  date: string;
  /** Card headline; clamps to 2 lines */
  title: string;
  /** Optional body blurb; clamps to 2 lines; omit → render nothing */
  description?: string;
  /** Thumbnail image src URL */
  imageSrc: string;
  /** When provided, the whole card is a <button>; otherwise a <div> */
  onOpen?: () => void;
}

// ---------------------------------------------------------------------------
// NewsCard
// ---------------------------------------------------------------------------

/**
 * NewsCard — home-feed card matching leagueoflegends.com/news style.
 *
 * Dark-panel adaptation: 16:9 clipped thumbnail with hover zoom, meta row
 * (category | date), 2-line-clamped title + optional description.
 * Renders as a <button> when `onOpen` is provided, otherwise a <div>.
 *
 * Presentational only — props in, callbacks out. No data fetching.
 */
export function NewsCard({
  category,
  date,
  title,
  description,
  imageSrc,
  onOpen,
}: NewsCardProps) {
  const thumb = (
    <div className="aspect-video w-full overflow-hidden">
      <img
        src={imageSrc}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  );

  const meta = (
    <div className="p-3">
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs font-bold uppercase tracking-widest text-gold-2">{category}</span>
        <span className="text-xs text-grey-1">|</span>
        <span className="text-xs text-grey-1">{date}</span>
      </div>
      <h3 className="font-body font-bold text-sm text-gold-1 line-clamp-2 mt-1">{title}</h3>
      {description && (
        <p className="text-sm text-grey-1 line-clamp-2 mt-1">{description}</p>
      )}
    </div>
  );

  if (onOpen) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="group bg-blue-7/60 border border-grey-4 w-full text-left"
        aria-label={title}
      >
        {thumb}
        {meta}
      </button>
    );
  }

  return (
    <div className="group bg-blue-7/60 border border-grey-4">
      {thumb}
      {meta}
    </div>
  );
}
