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
 * Real card anatomy (measured from merch.riotgames.com shop-all at 1280px):
 *   - Card article: 640×375, background --color-merch-surface-alt (#f7f7f7)
 *   - Header row (~49px): franchise wordmark (top-left), badge chips (top-right),
 *     heart/wishlist (top-right after badges) — ALL ABOVE the image, no overlays
 *   - Image box: 638×225, object-fit: contain, transparent bg (grey card shows through)
 *   - Info strip: ~20px inset; title black, line-height 18px; price 16px/400/black
 *   - Badge chips: 14px mixed-case, black text; New=#8CD50B, Preorder=#666, Limited=#FFD700
 *   - Franchise label: grey (#666666), ~16px/400, title-case, in header row (no scrim)
 *   - In-card CTA: "Add to Cart" / "Login to purchase", uppercase, 600, ~598px wide
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
   * Multi-badge array for the real 2-col card design (top-right in header row).
   * When provided, supersedes `badge`. E.g. ["New", "Limited Edition"].
   */
  badges?: string[];
  /**
   * Franchise brand label rendered as text in the header row above the image.
   * E.g. "League of Legends", "Arcane", "Valorant".
   */
  franchiseLabel?: string;
  /**
   * Controls how the product image is fitted inside its container.
   * Use `"contain"` for packshot photography; `"cover"` for lifestyle shots.
   * @default "contain"
   */
  imageFit?: "cover" | "contain";
  /**
   * CTA label for the in-card button. Defaults to "Add to Cart".
   * Pass "Login to purchase" or similar when user is not signed in.
   * @default "Add to Cart"
   */
  ctaLabel?: string;
  /** Called when the card is clicked. */
  onClick?: (slug: string) => void;
  /** Called when the wishlist heart is clicked. Receives the slug. */
  onWishlist?: (slug: string) => void;
  /** Called when the in-card CTA button is clicked. Receives the slug. */
  onAddToCart?: (slug: string) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type BadgeLabel = NonNullable<MerchProduct["badge"]> | string;

function badgeStyle(badge: BadgeLabel): React.CSSProperties {
  const b = badge.toLowerCase();
  if (b === "new" || b === "restock") {
    // New/Restock: green #8CD50B, black text (remeasured 2026-08-06)
    return {
      backgroundColor: "var(--color-merch-badge-new)",
      color: "var(--color-merch-ink-dark)",
    };
  }
  if (b === "limited" || b === "limited edition") {
    // Limited Edition: gold #FFD700, black text
    return {
      backgroundColor: "var(--color-merch-badge-limited)",
      color: "var(--color-merch-ink-dark)",
    };
  }
  if (b === "preorder") {
    // Preorder: mid-grey #666666, white text
    return {
      backgroundColor: "var(--color-merch-badge-preorder)",
      color: "var(--color-merch-on-dark)",
    };
  }
  if (b === "sale") {
    // "Sale" chip hidden — replaced by green %-discount badge near image
    return {
      backgroundColor: "var(--color-merch-surface)",
      color: "var(--color-merch-muted)",
      border: "1px solid var(--color-merch-border)",
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
 * MerchProductCard — 2-col flush listing card matching merch.riotgames.com real anatomy.
 *
 * Real card: 640×375 at 1280px, surface-alt (#f7f7f7) background.
 * - Header row (~49px): franchise wordmark left, badge chips + heart right (all ABOVE image)
 * - Image box: 225px tall, object-contain, transparent bg (card grey shows through)
 * - Info strip: ~20px inset, title black 18px-lh, price 16px/400 pure black
 * - In-card CTA: uppercase 600, full width inside card padding
 * - 1px --color-merch-border frame (no border-radius) so cards tessellate flush
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
  imageFit = "contain",
  ctaLabel = "Add to Cart",
  onClick,
  onWishlist,
  onAddToCart,
}: MerchProductCardProps) {
  const heartTitleId = useId();

  // Resolve the badge list: `badges` takes precedence over `badge`
  const allBadges: string[] =
    badges && badges.length > 0
      ? badges
      : badge
      ? [badge]
      : [];

  const isOnSale =
    allBadges.some((b) => b.toLowerCase() === "sale") ||
    (originalPrice !== undefined && originalPrice !== price);

  // Compute discount percentage from price strings (e.g. "$59.99" → 59.99).
  // Robustly handles missing/unparseable prices — badge is hidden if NaN.
  const discountPct: number | null = (() => {
    if (!isOnSale || !originalPrice || originalPrice === price) return null;
    const orig = parseFloat(originalPrice.replace(/[^0-9.]/g, ""));
    const curr = parseFloat(price.replace(/[^0-9.]/g, ""));
    if (!isFinite(orig) || !isFinite(curr) || orig <= 0) return null;
    return Math.round((1 - curr / orig) * 100);
  })();

  // Render non-sale badges only; "Sale" label is replaced by the %-badge near the image.
  const activeBadges = allBadges.filter((b) => b.toLowerCase() !== "sale");

  return (
    <article
      role="article"
      className="group flex w-full cursor-pointer flex-col"
      style={{
        fontFamily: "var(--font-merch)",
        border: "1px solid var(--color-merch-border)",
        backgroundColor: "var(--color-merch-surface-alt)",
        // Contain badge chips + heart that could overflow the narrow grid cell
        // at 390px (two-column grid → ~195px per card). overflow-x-clip avoids
        // creating a new BFC while still clipping horizontal excess.
        overflowX: "clip",
      }}
      onClick={() => onClick?.(slug)}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header row — franchise label + badges + heart, ALL above the image  */}
      {/* Real: 49px, padding 16px top / 20px sides / 0 bottom               */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex items-center justify-between px-5 pt-4 pb-0"
        style={{ minHeight: 49 }}
      >
        {/* Franchise wordmark — grey, title-case, ~16px/400, no scrim */}
        <span
          className="text-[16px] font-normal leading-tight"
          style={{ color: "var(--color-merch-franchise-label)" }}
        >
          {franchiseLabel ?? ""}
        </span>

        {/* Right cluster: badge chips + heart */}
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Badge chips — 14px mixed-case, black text for New/Limited, white for Preorder */}
          {activeBadges.map((b) => (
            <span
              key={b}
              className="px-2 py-0.5 text-[14px] font-normal leading-tight"
              style={badgeStyle(b)}
            >
              {b}
            </span>
          ))}

          {/* Heart / wishlist */}
          <button
            type="button"
            aria-label={`Add ${title} to wishlist`}
            className="flex items-center justify-center p-1 transition-opacity duration-150"
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
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Image container — 225px tall, contain, transparent bg               */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: 225, backgroundColor: "transparent" }}
      >
        {/* Product image — scale on hover */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className={`h-full w-full transition-transform duration-200 ease-out group-hover:scale-[1.04] ${imageFit === "cover" ? "object-cover" : "object-contain"}`}
          style={{ display: "block" }}
        />

        {/* Discount %-badge — bottom-left of image, above info strip.
            Green bg (#8CD50B), black text, 14px/400. Only when on sale + parseable prices. */}
        {discountPct !== null && (
          <div className="absolute bottom-0 left-0">
            <span
              className="block px-2 py-0.5 text-[14px] font-normal leading-tight"
              style={{
                backgroundColor: "var(--color-merch-badge-sale)",
                color: "var(--color-merch-ink-dark)",
              }}
            >
              -{discountPct}%
            </span>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Info strip — title + price                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col gap-1 px-5 pt-2 pb-0">
        {/* Title — black, line-height 18px, line-clamp 2 */}
        <p
          className="line-clamp-2 text-[14px] font-normal"
          style={{
            color: "var(--color-merch-ink-dark)",
            lineHeight: "18px",
          }}
        >
          {title}
        </p>

        {/* Price row.
            Sale: struck original in grey (#666) at 16px, current price in dark ink.
            Non-sale: 16px/400/pure-black. Matches real measurements 2026-08-06. */}
        <div className="flex items-center gap-2">
          {isOnSale && originalPrice ? (
            <>
              <span
                className="line-through text-[16px]"
                style={{ color: "var(--color-merch-price-struck)" }}
              >
                {originalPrice}
              </span>
              <span
                className="text-[16px] font-normal"
                style={{ color: "var(--color-merch-ink-dark)" }}
              >
                {price}
              </span>
            </>
          ) : (
            <span
              className="text-[16px] font-normal"
              style={{ color: "var(--color-merch-ink-dark)", lineHeight: "20px" }}
            >
              {price}
            </span>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* In-card CTA — "Add to Cart" / "Login to purchase"                   */}
      {/* Real: button 50px tall (py-[13px]), wrapper pt-[5px] pb-0           */}
      {/* ------------------------------------------------------------------ */}
      <div className="px-5 pt-[3px] pb-0">
        <button
          type="button"
          className="w-full py-[13px] text-[16px] font-semibold uppercase tracking-wide"
          style={{
            backgroundColor: "var(--color-merch-ink-dark)",
            color: "var(--color-merch-on-dark)",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-merch)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart?.(slug);
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </article>
  );
}
