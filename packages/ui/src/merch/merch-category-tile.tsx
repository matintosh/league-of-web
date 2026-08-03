"use client";

/**
 * MerchCategoryTile — clickable image + label tile for the Collections index page.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens
 * (add a token to @low/tokens if one is missing, sampled from the real store)
 * and a modern e-commerce layout. This is NOT the Hextech client — IGNORE the
 * client Hextech-only / no-default-Tailwind-palette guidance; still tokens-only
 * (no raw hex outside packages/tokens; NO hardcoded hex fallbacks in
 * var(--color-merch-*)), presentational (props in/callbacks out, NO fetching
 * in @low/ui, types from @low/fixtures — image URLs via championSplashUrl from
 * the page, never fetched in @low/ui), showcase server-safe (no 'use client').
 *
 * Measured from merch.riotgames.com/en-us/collection/ (~1280px desktop):
 *   - Image: 16:9 aspect ratio (aspect-video), full-width, object-fit: cover
 *   - Image hover: scale(1.04) over 200ms ease-out (image only, not card frame)
 *   - Label strip: --color-merch-ink background, px-4 py-3 (12–16px h, 12px v)
 *   - Label text: 15px, font-weight 700, uppercase, letter-spacing 0.06em
 *   - Label color: --color-merch-on-dark (white on dark strip)
 *   - Card border: none by default; 1px solid --color-merch-border on focus
 *   - Cursor: pointer when onClick is provided; default otherwise
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchCategoryTileProps {
  /** URL-safe category slug, e.g. "league-classic". */
  slug: string;
  /** Display name shown on the tile label, e.g. "League Classic". */
  name: string;
  /** Hero image URL (16:9 aspect, object-fit: cover). Supply via championSplashUrl from @low/fixtures. */
  imageUrl: string;
  /** Alt text for the tile image. Defaults to `name` if omitted. */
  imageAlt?: string;
  /**
   * Called when the tile is clicked. Receives the slug.
   * When omitted the article renders as a plain presentational element with no
   * extra tab stop — the parent `<a>` (or similar) is the sole interactive element.
   * When provided, tabIndex/onKeyDown are added so the tile is independently operable.
   */
  onClick?: (slug: string) => void;
  /**
   * Native img loading hint. Use "eager" for above-the-fold tiles (LCP candidates)
   * and "lazy" (the default) for below-the-fold tiles.
   * @default "lazy"
   */
  loading?: "lazy" | "eager";
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchCategoryTile — image (16:9) + dark label strip category tile.
 * Grid usage: place inside `MerchCategoryTileGrid` or a
 * `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6` container.
 *
 * When used inside an `<a>` (the standard page pattern) omit `onClick` so the
 * tile renders as a plain presentational article with no extra tab stop.
 *
 * @example
 * // Page pattern — <a> is the interactive element; tile is presentational
 * <a href={`/merch/collection/${slug}`}>
 *   <MerchCategoryTile slug={slug} name={name} imageUrl={imageUrl} />
 * </a>
 *
 * @example
 * // Standalone / showcase pattern — tile handles its own click
 * <MerchCategoryTile
 *   slug="league-classic"
 *   name="League Classic"
 *   imageUrl={championSplashUrl("Ahri", 0)}
 *   onClick={(slug) => router.push(`/merch/collection/${slug}`)}
 * />
 */
export function MerchCategoryTile({
  slug,
  name,
  imageUrl,
  imageAlt,
  onClick,
  loading = "lazy",
}: MerchCategoryTileProps) {
  // When onClick is provided the article is a standalone interactive control:
  // add tabIndex, keyboard handler, and pointer cursor so it is keyboard-operable.
  // When onClick is absent (e.g. wrapped in an <a>) the article is purely
  // presentational — no extra tab stop, no removed focus ring.
  const isInteractive = onClick != null;

  return (
    <article
      className={[
        "group flex w-full flex-col overflow-hidden",
        isInteractive ? "cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[--color-merch-border]" : "",
      ].join(" ").trim()}
      style={{ fontFamily: "var(--font-merch)" }}
      {...(isInteractive && {
        tabIndex: 0,
        onClick: () => onClick(slug),
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick(slug);
          }
        },
      })}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Image container — 16:9 aspect ratio                                  */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "16 / 9",
          backgroundColor: "var(--color-merch-surface)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={imageAlt ?? name}
          loading={loading}
          className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.04]"
          style={{ display: "block" }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Label strip — dark background with white uppercase text              */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="px-4 py-3"
        style={{ backgroundColor: "var(--color-merch-ink)" }}
      >
        <p
          className="text-[15px] font-bold uppercase tracking-[0.06em]"
          style={{ color: "var(--color-merch-on-dark)" }}
        >
          {name}
        </p>
      </div>
    </article>
  );
}
