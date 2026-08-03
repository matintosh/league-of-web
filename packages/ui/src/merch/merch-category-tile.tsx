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
 *   - Cursor: pointer; entire tile is clickable
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
  /** Called when the tile is clicked. Receives the slug. */
  onClick?: (slug: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchCategoryTile — image (16:9) + dark label strip category tile.
 * Grid usage: place inside `MerchCategoryTileGrid` or a
 * `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6` container.
 *
 * @example
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
}: MerchCategoryTileProps) {
  return (
    <article
      role="article"
      className="group flex w-full cursor-pointer flex-col overflow-hidden"
      style={{ fontFamily: "var(--font-merch)", outline: "none" }}
      tabIndex={0}
      onClick={() => onClick?.(slug)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(slug);
        }
      }}
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
          loading="lazy"
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
