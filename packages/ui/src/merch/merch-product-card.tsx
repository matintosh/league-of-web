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
 * Real 2-col listing design (measured from merch.riotgames.com shop-all at 1280px):
 *   - Card width: ~640px (2-col flush, no gap)
 *   - Card has 1px --color-merch-border frame (cards tessellate flush)
 *   - Image: aspect-ratio 1/1, object-fit: cover (or contain on white)
 *   - Image hover: scale(1.04) over 200ms ease-out
 *   - Franchise label: top-left overlay — uppercase, small white text on dark scrim
 *   - Badges: top-right absolute, stacked column, colored chips (multi-badge)
 *     "New" → green (#7ac043), "Limited"/"Limited Edition" → yellow (#e8c33c),
 *     "Preorder"/"Restock" → grey (#5a5a5a), "Sale" → red, "Out of Stock" → muted border fill
 *   - Heart / wishlist: top-right corner of the image (outside badge column)
 *   - Info strip: px-3 pt-3 pb-2; title 16px/700/ink, line-clamp 2; price 13px/muted
 */

import { useId } from "react";
import type { MerchProduct } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchProductCardProps {
  /** Product slug / URL path segment. */
  slug: string;
  /** Product title (rendered sentence-case). */
  title: string;
  /** Primary image URL. */
  imageUrl: string;
  /** Display price string, e.g. "$19.99" or "$19.99 – $49.99". */
  price: string;
  /** Original (pre-sale) price string; shows struck-through if provided and differs from price. */
  originalPrice?: string;
  /**
   * Single badge label (back-compat). Superseded by `badges` when both present.
   * @deprecated Prefer `badges` for the 2-col card design.
   */
  badge?: MerchProduct["badge"];
  /**
   * Multi-badge array for the real 2-col card design (top-right stacked chips).
   * When provided, supersedes `badge`. E.g. ["New", "Limited Edition"].
   */
  badges?: string[];
  /**
   * Franchise brand label rendered as text overlay top-left of the image.
   * E.g. "LEAGUE OF LEGENDS", "ARCANE", "VALORANT".
   */
  franchiseLabel?: string;
  /**
   * Controls how the product image is fitted inside its square container.
   * Use `"contain"` for packshot photography on white; `"cover"` for lifestyle shots.
   * @default "cover"
   */
  imageFit?: "cover" | "contain";
  /** Called when the card is clicked. */
  onClick?: (slug: string) => void;
  /** Called when the wishlist heart is clicked. Receives the slug. */
  onWishlist?: (slug: string) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type BadgeLabel = NonNullable<MerchProduct["badge"]> | string;

function badgeStyle(badge: BadgeLabel): React.CSSProperties {
  const b = badge.toLowerCase();
  if (b === "new" || b === "restock") {
    return {
      backgroundColor: "var(--color-merch-badge-new)",
      color: "var(--color-merch-on-dark)",
    };
  }
  if (b === "limited" || b === "limited edition") {
    return {
      backgroundColor: "var(--color-merch-badge-limited)",
      color: "var(--color-merch-ink)",
    };
  }
  if (b === "preorder") {
    return {
      backgroundColor: "var(--color-merch-badge-preorder)",
      color: "var(--color-merch-on-dark)",
    };
  }
  if (b === "sale") {
    return {
      backgroundColor: "var(--color-merch-red)",
      color: "var(--color-merch-on-dark)",
    };
  }
  if (b === "out of stock") {
    return {
      backgroundColor: "var(--color-merch-surface)",
      color: "var(--color-merch-muted)",
      border: "1px solid var(--color-merch-border)",
    };
  }
  // Unknown badge — default muted style
  return {
    backgroundColor: "var(--color-merch-surface)",
    color: "var(--color-merch-muted)",
    border: "1px solid var(--color-merch-border)",
  };
}

// ---------------------------------------------------------------------------
// Heart SVG
// ---------------------------------------------------------------------------

function HeartIcon({ id }: { id: string }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, display: "block" }}
      aria-labelledby={id}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchProductCard — 2-col flush listing card matching merch.riotgames.com real design.
 *
 * - Franchise label text overlay top-left (uppercase, white on dark scrim)
 * - Multi-badge chips top-right stacked column (`badges` preferred, falls back to `badge`)
 * - Heart/wishlist icon top-right corner of image
 * - 1px --color-merch-border frame (no border-radius) so cards tessellate flush
 * - Image centered, hover scale, aspect 1/1
 * - Title sentence-case 16px/700, price below
 *
 * Grid usage: place inside `grid grid-cols-2 gap-0` with border dividers.
 */
export function MerchProductCard({
  slug,
  title,
  imageUrl,
  price,
  originalPrice,
  badge,
  badges,
  franchiseLabel,
  imageFit = "cover",
  onClick,
  onWishlist,
}: MerchProductCardProps) {
  const heartTitleId = useId();

  // Resolve the badge list: `badges` takes precedence over `badge`
  const activeBadges: string[] =
    badges && badges.length > 0
      ? badges
      : badge
      ? [badge]
      : [];

  const isOnSale =
    activeBadges.some((b) => b.toLowerCase() === "sale") ||
    (originalPrice !== undefined && originalPrice !== price);

  return (
    <article
      role="article"
      className="group flex w-full cursor-pointer flex-col"
      style={{
        fontFamily: "var(--font-merch)",
        border: "1px solid var(--color-merch-border)",
      }}
      onClick={() => onClick?.(slug)}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Image container                                                      */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "1 / 1",
          backgroundColor:
            imageFit === "contain"
              ? "var(--color-merch-bg)"
              : "var(--color-merch-surface)",
        }}
      >
        {/* Product image — scale on hover */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className={`h-full w-full transition-transform duration-200 ease-out group-hover:scale-[1.04] ${imageFit === "contain" ? "object-contain" : "object-cover"}`}
          style={{ display: "block" }}
        />

        {/* Franchise label — top-left overlay */}
        {franchiseLabel && (
          <div
            className="absolute left-0 top-0 px-2 py-1"
            style={{ backgroundColor: "var(--color-merch-franchise-bg)" }}
          >
            <span
              className="text-[9px] font-semibold uppercase tracking-[0.12em]"
              style={{ color: "var(--color-merch-franchise-label)" }}
            >
              {franchiseLabel}
            </span>
          </div>
        )}

        {/* Badge column — top-right, stacked */}
        {activeBadges.length > 0 && (
          <div
            className="absolute right-2 top-2 flex flex-col items-end gap-1"
            onClick={(e) => e.stopPropagation()}
          >
            {activeBadges.map((b) => (
              <span
                key={b}
                className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
                style={badgeStyle(b)}
              >
                {b}
              </span>
            ))}
          </div>
        )}

        {/* Heart / wishlist — bottom-right of image */}
        <button
          type="button"
          aria-label={`Add ${title} to wishlist`}
          className="absolute bottom-2 right-2 flex items-center justify-center p-1 transition-opacity duration-150"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-merch-heart)",
            opacity: 0.7,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.7";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onWishlist?.(slug);
          }}
        >
          <HeartIcon id={heartTitleId} />
        </button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Info strip                                                           */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex flex-col gap-0.5 px-3 pt-3 pb-2"
        style={{ backgroundColor: "var(--color-merch-bg)" }}
      >
        {/* Title — 16px/700 sentence-case, line-clamp 2 */}
        <p
          className="line-clamp-2 text-[16px] font-bold leading-snug"
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
