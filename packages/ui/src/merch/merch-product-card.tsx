"use client";

/**
 * MerchProductCard — product tile for the Riot Games merch store clone.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens
 * (add a token to @low/tokens if one is missing, sampled from the real store)
 * and a modern e-commerce layout. This is NOT the Hextech client — IGNORE the
 * client Hextech-only / no-default-Tailwind-palette guidance; still tokens-only
 * (no raw hex outside packages/tokens), presentational (props in/callbacks out,
 * NO fetching in @low/ui, types from @low/fixtures), showcase server-safe
 * (no 'use client'), SVG/gradient ids from useId.
 *
 * Measured from merch.riotgames.com shop-all / collection pages (~1280px, 4-up):
 *   - Card width: ~280–300px; 4-column grid, ~20px gap
 *   - Image: aspect-ratio 1/1 (square), object-fit: cover
 *   - Image hover: scale(1.04) over 200ms ease-out
 *   - Info strip: ~12px horizontal, ~8–10px vertical padding
 *   - Title: ~14px, weight 500–600, white, line-clamp 2
 *   - Price: ~14px, weight 400–500, muted (--color-merch-muted)
 *   - Sale: original struck-through in muted + sale price in red
 *   - Badge (top-left absolute): ~10–12px, all-caps, 4px 8px padding
 *     "Sale" → red, "New" → surface-elevated + white, "Out of Stock" → muted border fill
 */

import type { MerchProduct } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchProductCardProps {
  /** Product slug / URL path segment. */
  slug: string;
  /** Product title. */
  title: string;
  /** Primary image URL. */
  imageUrl: string;
  /** Display price string, e.g. "$19.99" or "$19.99 – $49.99". */
  price: string;
  /** Original (pre-sale) price string; shows struck-through if provided and differs from price. */
  originalPrice?: string;
  /** Optional badge label. */
  badge?: MerchProduct["badge"];
  /** Called when the card is clicked. */
  onClick?: (slug: string) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function badgeStyle(badge: NonNullable<MerchProductCardProps["badge"]>): React.CSSProperties {
  switch (badge) {
    case "Sale":
      return {
        backgroundColor: "var(--color-merch-red)",
        color: "var(--color-merch-on-dark)",
      };
    case "New":
      return {
        backgroundColor: "var(--color-merch-ink)",
        color: "var(--color-merch-on-dark)",
        border: "1px solid rgba(255,255,255,0.15)",
      };
    case "Out of Stock":
      return {
        backgroundColor: "var(--color-merch-surface)",
        color: "var(--color-merch-muted)",
        border: "1px solid var(--color-merch-border)",
      };
    case "Limited":
      return {
        backgroundColor: "var(--color-merch-ink)",
        color: "var(--color-merch-red)",
        border: "1px solid var(--color-merch-red)",
      };
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchProductCard — image + title + price product tile.
 * Grid usage: place inside a `grid grid-cols-2 lg:grid-cols-4 gap-5` container.
 */
export function MerchProductCard({
  slug,
  title,
  imageUrl,
  price,
  originalPrice,
  badge,
  onClick,
}: MerchProductCardProps) {
  const isOnSale = badge === "Sale" || (originalPrice !== undefined && originalPrice !== price);

  return (
    <article
      role="article"
      className="group flex w-full cursor-pointer flex-col"
      style={{ fontFamily: "var(--font-merch)" }}
      onClick={() => onClick?.(slug)}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Image container                                                      */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "1 / 1",
          backgroundColor: "var(--color-merch-surface)",
        }}
      >
        {/* Product image — scale on hover */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 ease-out group-hover:scale-[1.04]"
          style={{ display: "block" }}
        />

        {/* Badge (top-left absolute) */}
        {badge && (
          <span
            className="absolute left-2 top-2 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
            style={badgeStyle(badge)}
          >
            {badge}
          </span>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Info strip                                                           */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex flex-col gap-0.5 px-0 pt-2.5 pb-1"
        style={{ backgroundColor: "var(--color-merch-bg)" }}
      >
        {/* Title — line-clamp 2 */}
        <p
          className="line-clamp-2 text-[14px] font-medium leading-snug"
          style={{ color: "var(--color-merch-ink)" }}
        >
          {title}
        </p>

        {/* Price row */}
        <div className="flex items-center gap-2 text-[13px]">
          {isOnSale && originalPrice ? (
            <>
              <span
                className="line-through"
                style={{ color: "var(--color-merch-muted)" }}
              >
                {originalPrice}
              </span>
              <span
                className="font-medium"
                style={{ color: "var(--color-merch-red)" }}
              >
                {price}
              </span>
            </>
          ) : (
            <span style={{ color: "var(--color-merch-muted)" }}>
              {price}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
