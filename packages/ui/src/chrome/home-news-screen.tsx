"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A news article item used by all tiles and the side list. */
export interface NewsArticle {
  /** Unique stable identifier. */
  id: string;
  /** Article headline. */
  title: string;
  /** Short summary (1–2 sentences). Shown in the side list and hero subtitle. */
  description?: string;
  /** Category tag displayed over the hero tile, e.g. "ESPORTS / TRIVIA". */
  category?: string;
  /** Thumbnail / hero image URL. */
  thumbnailUrl: string;
  /**
   * External article URL.
   * Dead-link pattern: href="#" + aria-disabled + e.preventDefault()
   * per login-page precedent (all external links are no-ops in the portfolio).
   */
  externalUrl: string;
}

export interface HomeNewsScreenProps {
  /** Full-width hero article tile (left column, top ~60%). */
  heroArticle: NewsArticle;
  /** Exactly 2 promotional tiles (left column, bottom row, side-by-side). */
  promoTiles: NewsArticle[];
  /** Exactly 5 side articles (right column, stacked list). */
  sideArticles: NewsArticle[];
  /** Called when any article tile is clicked. Dead in the portfolio build. */
  onArticleClick: (article: NewsArticle) => void;
  /** Called when the "See all news" link is clicked. Dead in the portfolio build. */
  onSeeAllNews: () => void;
}

// ---------------------------------------------------------------------------
// ExternalLinkIcon — ↗ arrow glyph reused across all tiles
// ---------------------------------------------------------------------------

function ExternalLinkIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// HeroTile — large full-bleed tile (left column top area, ~60% height)
// ---------------------------------------------------------------------------

function HeroTile({
  article,
  onClick,
}: {
  article: NewsArticle;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={article.title}
      onClick={onClick}
      className="absolute inset-0 overflow-hidden cursor-pointer"
    >
      {/* Full-bleed thumbnail */}
      <img
        src={article.thumbnailUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 hover:scale-[1.02]"
      />

      {/* Bottom overlay gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "55%",
          background:
            "linear-gradient(to top, var(--color-hextech-black) 0%, color-mix(in srgb, var(--color-hextech-black) 85%, transparent) 40%, transparent 100%)",
        }}
      />

      {/* Text overlay — bottom-left */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4">
        {article.category && (
          <span className="font-display text-xs uppercase tracking-widest text-grey-2">
            {article.category}
          </span>
        )}
        <h2 className="font-display text-xl uppercase tracking-wide text-gold-1 leading-tight">
          {article.title}
        </h2>
        {article.description && (
          <p className="font-body text-xs text-grey-1 line-clamp-1">
            {article.description}
          </p>
        )}
      </div>

      {/* External link arrow — bottom-right */}
      <div className="absolute bottom-3 right-3 text-gold-2">
        <ExternalLinkIcon size={14} />
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// PromoTile — compact promo tile (left column bottom row, one of two side-by-side)
// ---------------------------------------------------------------------------

function PromoTile({
  article,
  onClick,
}: {
  article: NewsArticle;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={article.title}
      onClick={onClick}
      className="absolute inset-0 overflow-hidden cursor-pointer"
    >
      {/* Thumbnail */}
      <img
        src={article.thumbnailUrl}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-300 hover:scale-[1.02]"
      />

      {/* Bottom gradient scrim */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "60%",
          background:
            "linear-gradient(to top, var(--color-hextech-black) 0%, color-mix(in srgb, var(--color-hextech-black) 70%, transparent) 55%, transparent 100%)",
        }}
      />

      {/* Title overlay */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <span className="font-display text-sm uppercase tracking-wide text-gold-1 line-clamp-2 leading-tight">
          {article.title}
        </span>
      </div>

      {/* External link arrow */}
      <div className="absolute bottom-2.5 right-2.5 text-gold-2">
        <ExternalLinkIcon size={12} />
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// SideArticleRow — one row in the right-column list
// ---------------------------------------------------------------------------

function SideArticleRow({
  article,
  isLast,
  labelId,
  onClick,
}: {
  article: NewsArticle;
  isLast: boolean;
  labelId: string;
  onClick: () => void;
}) {
  return (
    <li
      className={[
        "flex gap-3 py-3",
        !isLast ? "border-b border-gold-6" : "",
      ].join(" ")}
    >
      {/* Thumbnail */}
      <div className="shrink-0 overflow-hidden" style={{ width: 96, height: 64 }}>
        <img
          src={article.thumbnailUrl}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />
      </div>

      {/* Text block */}
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        {/* Title + external link icon */}
        <button
          type="button"
          id={labelId}
          aria-label={article.title}
          onClick={onClick}
          className="group flex items-start gap-1 cursor-pointer text-left"
        >
          <span className="font-display text-sm text-gold-1 line-clamp-2 leading-tight group-hover:text-gold-2 transition-colors duration-150">
            {article.title}
          </span>
          <span className="shrink-0 mt-0.5 text-gold-3 group-hover:text-gold-2 transition-colors duration-150">
            <ExternalLinkIcon size={11} />
          </span>
        </button>

        {article.description && (
          <p className="font-body text-xs text-grey-1 line-clamp-2 leading-snug">
            {article.description}
          </p>
        )}
      </div>
    </li>
  );
}

// ---------------------------------------------------------------------------
// HomeNewsScreen
// ---------------------------------------------------------------------------

/**
 * HomeNewsScreen — the NEWS sub-tab content for the Home section.
 *
 * Two-column layout filling the content area below the sub-tab strip:
 * - Left column (~60%): hero tile + 2 promo tiles side-by-side
 * - Right column (~40%): 5 stacked side articles + "See all news" link
 *
 * Presentational only — props in, callbacks out. No data fetching.
 * All external links follow the dead-link pattern (href="#", aria-disabled,
 * preventDefault) consistent with the login-page precedent.
 */
export function HomeNewsScreen({
  heroArticle,
  promoTiles,
  sideArticles,
  onArticleClick,
  onSeeAllNews,
}: HomeNewsScreenProps) {
  const uid = useId();

  return (
    <div className="flex h-full w-full overflow-hidden bg-hextech-black">
      {/* ------------------------------------------------------------------ */}
      {/* LEFT COLUMN — hero tile (~62% height) + 2 promo tiles (~38% height) */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex h-full flex-col border-r border-gold-5"
        style={{ width: "60%" }}
      >
        {/* Hero tile — fills top portion; h-full on wrapper so button stretches */}
        <div className="flex-[3] min-h-0 relative">
          <HeroTile
            article={heroArticle}
            onClick={() => onArticleClick(heroArticle)}
          />
        </div>

        {/* Promo row — 2 tiles side-by-side, bottom 38% */}
        <div className="flex shrink-0 border-t border-gold-5" style={{ height: "38%" }}>
          {promoTiles.slice(0, 2).map((promo, i) => (
            <div
              key={promo.id}
              className={[
                "relative flex-1 min-w-0 h-full",
                i === 0 ? "border-r border-gold-5" : "",
              ].join(" ")}
            >
              <PromoTile
                article={promo}
                onClick={() => onArticleClick(promo)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* RIGHT COLUMN — 5 article list + "See all news" link                 */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex flex-col flex-1 min-w-0 overflow-hidden px-4 pt-3 pb-4"
      >
        <ul
          aria-label="News articles"
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
        >
          {sideArticles.slice(0, 5).map((article, i) => {
            const labelId = `${uid}-article-${article.id}`;
            return (
              <SideArticleRow
                key={article.id}
                article={article}
                isLast={i === Math.min(sideArticles.length, 5) - 1}
                labelId={labelId}
                onClick={() => onArticleClick(article)}
              />
            );
          })}
        </ul>

        {/* "See all news" link — dead link per portfolio precedent */}
        <div className="flex justify-end pt-2">
          <a
            href="#"
            aria-label="See all news (opens external news site)"
            aria-disabled="true"
            onClick={(e) => {
              e.preventDefault();
              onSeeAllNews();
            }}
            className="flex items-center gap-1 font-display text-xs uppercase tracking-widest text-gold-3 hover:text-gold-2 transition-colors duration-150 cursor-pointer"
          >
            See all news
            <ExternalLinkIcon size={11} />
          </a>
        </div>
      </div>
    </div>
  );
}
