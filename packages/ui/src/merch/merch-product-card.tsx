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
 *   - Card article: ~640px wide, background --color-merch-surface-alt (#f7f7f7)
 *   - Card border: 1px solid --color-merch-on-dark (#ffffff) — invisible white seams
 *   - Header row (~49px): franchise wordmark (top-left), badge chips + %-badge (top-right),
 *     heart/wishlist (top-right after badges) — ALL ABOVE the image, no overlays
 *   - Image box: object-fit: contain, transparent bg (grey card shows through)
 *   - Info strip: ~20px top padding; title riotSans 16px/700 black lh 18px; price 16px/400 black
 *   - Badge chips: 14px mixed-case, black text; New=#8CD50B, Preorder=#666, Limited=#FFD700;
 *     border-radius 2px, padding 4px 8px, white-space: nowrap
 *   - Discount %-badge: top-right header row (not over image), same green as New badge
 *   - Heart icon: 24×24; inline with badge cluster
 *   - In-card CTA: "Add to Cart" — HIDDEN at rest, revealed on card hover;
 *     50×50 cart-icon button right of title/price also fades in on hover
 */

import { useId } from "react";
import type { MerchProduct } from "@low/fixtures";
import { FranchiseLogos } from "./franchise-logos";

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
   * Franchise brand label rendered as the franchise wordmark SVG (top-left of header row).
   * Used as the lookup key for the FranchiseLogos map; also shown as a text fallback when
   * no matching SVG exists. E.g. "League of Legends", "Arcane", "Valorant".
   */
  franchiseLabel?: string;
  /**
   * Override key for the franchise SVG lookup in FranchiseLogos.
   * Use when franchiseLabel is display text but the logo key differs (e.g. "league-of-legends").
   * When omitted, franchiseLabel is normalised to lowercase-kebab for the lookup.
   */
  franchiseKey?: string;
  /**
   * Controls how the product image is fitted inside its container.
   * Use `"contain"` for packshot photography; `"cover"` for lifestyle shots.
   * @default "contain"
   */
  imageFit?: "cover" | "contain";
  /**
   * Override the image container height in px.
   * Default is 225px (landscape strip cards); collection-index strips use 282px (portrait).
   * @default 225
   */
  imageHeight?: number;
  /**
   * CTA label for the in-card button. Defaults to "Add to Cart".
   * Pass "Login to purchase" or similar when user is not signed in.
   * @default "Add to Cart"
   */
  ctaLabel?: string;
  /**
   * When `false`, hides both the hover-reveal ATC overlay bar and the
   * hover-reveal cart-icon button. Used for related-products carousels
   * where the intent is navigation, not purchase.
   * @default true
   */
  hasAddToCart?: boolean;
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
      borderRadius: 2,
      whiteSpace: "nowrap",
      padding: "4px 8px",
    };
  }
  if (b === "limited" || b === "limited edition") {
    // Limited Edition: gold #FFD700, black text
    return {
      backgroundColor: "var(--color-merch-badge-limited)",
      color: "var(--color-merch-ink-dark)",
      borderRadius: 2,
      whiteSpace: "nowrap",
      padding: "4px 8px",
    };
  }
  if (b === "preorder") {
    // Preorder: mid-grey #666666, white text
    return {
      backgroundColor: "var(--color-merch-badge-preorder)",
      color: "var(--color-merch-on-dark)",
      borderRadius: 2,
      whiteSpace: "nowrap",
      padding: "4px 8px",
    };
  }
  if (b === "sale") {
    // "Sale" chip hidden — replaced by green %-discount badge in header row
    return {
      display: "none",
    };
  }
  if (b === "out of stock") {
    return {
      backgroundColor: "var(--color-merch-surface)",
      color: "var(--color-merch-muted)",
      border: "1px solid var(--color-merch-border)",
      borderRadius: 2,
      whiteSpace: "nowrap",
      padding: "4px 8px",
    };
  }
  // Unknown badge — default muted style
  return {
    backgroundColor: "var(--color-merch-surface)",
    color: "var(--color-merch-muted)",
    border: "1px solid var(--color-merch-border)",
    borderRadius: 2,
    whiteSpace: "nowrap",
    padding: "4px 8px",
  };
}

/** Normalise a display label to the FranchiseLogos map key. */
function normaliseFranchiseKey(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "-");
}

// ---------------------------------------------------------------------------
// Heart SVG (24×24 per real site measurements)
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
      style={{ width: 24, height: 24, display: "block" }}
      aria-labelledby={id}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Cart icon (for the 50×50 hover-reveal icon button)
// ---------------------------------------------------------------------------

function CartIcon() {
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
    >
      <circle cx="9" cy="21" r="1" fill="currentColor" stroke="none" />
      <circle cx="20" cy="21" r="1" fill="currentColor" stroke="none" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchProductCard — 2-col flush listing card matching merch.riotgames.com real anatomy.
 *
 * Real card anatomy at 1280px:
 * - Header row (~49px): franchise wordmark SVG left (grey), badge chips + %-discount + heart right
 * - Image box: object-contain, transparent bg (card grey shows through)
 * - Info strip: ~20px top padding; title riotSans 16px/700/lh-18px; price 16px/400 black
 * - ATC strip: HIDDEN at rest; revealed on card hover (group-hover)
 * - Card border: 1px solid --color-merch-on-dark (white) — cards read as seamless panels
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
  franchiseKey,
  imageFit = "contain",
  imageHeight = 225,
  ctaLabel = "Add to Cart",
  hasAddToCart = true,
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

  // Render non-sale badges only; "Sale" label is replaced by the %-badge in header row.
  const activeBadges = allBadges.filter((b) => b.toLowerCase() !== "sale");

  // Resolve franchise wordmark SVG — lookup key from prop or normalised label
  const logoKey = franchiseKey ?? (franchiseLabel ? normaliseFranchiseKey(franchiseLabel) : "");
  const FranchiseLogo = logoKey ? FranchiseLogos[logoKey] : undefined;

  return (
    <article
      role="article"
      className="group flex w-full cursor-pointer flex-col"
      style={{
        fontFamily: "var(--font-merch)",
        // White seam borders — cards read as seamless #f7f7f7 panels
        border: "1px solid var(--color-merch-on-dark)",
        backgroundColor: "var(--color-merch-surface-alt)",
        // Contain badge chips + heart that could overflow the narrow grid cell
        // at 390px (two-column grid → ~195px per card). overflow-x-clip avoids
        // creating a new BFC while still clipping horizontal excess.
        overflowX: "clip",
      }}
      onClick={() => onClick?.(slug)}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header row — franchise wordmark + badges + %-badge + heart          */}
      {/* Real: ~49px, padding 16px top / 20px sides / 0 bottom              */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex items-center justify-between px-5 pt-4 pb-0"
        style={{ minHeight: 49 }}
      >
        {/* Franchise wordmark — SVG logo (grey fill via currentColor) or text fallback.
            Wrapped in a <span> so `color` applies to the SVG's currentColor. */}
        {FranchiseLogo ? (
          <span
            className="flex shrink-0 items-center"
            style={{ color: "var(--color-merch-franchise-label)" }}
          >
            <FranchiseLogo />
          </span>
        ) : (
          <span
            className="text-[16px] font-normal leading-tight"
            style={{ color: "var(--color-merch-franchise-label)" }}
          >
            {franchiseLabel ?? ""}
          </span>
        )}

        {/* Right cluster: badge chips + discount %-badge + heart */}
        <div
          className="flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Badge chips — 14px mixed-case, radius 2px, nowrap, 4px×8px padding */}
          {activeBadges.map((b) => (
            <span
              key={b}
              className="text-[14px] font-normal leading-tight"
              style={badgeStyle(b)}
            >
              {b}
            </span>
          ))}

          {/* Discount %-badge — TOP-RIGHT in header row (not over image).
              Green bg (#8CD50B), black text, 14px/400. Only when on sale + parseable prices. */}
          {discountPct !== null && (
            <span
              className="text-[14px] font-normal leading-tight"
              style={{
                backgroundColor: "var(--color-merch-badge-sale)",
                color: "var(--color-merch-ink-dark)",
                borderRadius: 2,
                whiteSpace: "nowrap",
                padding: "4px 8px",
              }}
            >
              -{discountPct}%
            </span>
          )}

          {/* Heart / wishlist — 24×24 per real site */}
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
      {/* Image container — object-contain, transparent bg                    */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: imageHeight, backgroundColor: "transparent" }}
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
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Info strip — title + price + hover-reveal cart icon button           */}
      {/* Real: ~20px top padding; title 16px/700/riotSans/lh-18; price 16/400 */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-start gap-0 px-5 pt-5 pb-0">
        {/* Title + price column */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* Title — riotSans 16px/700, lh 18px, black, line-clamp 2 */}
          <h2
            className="line-clamp-2"
            style={{
              fontFamily: "var(--font-merch-display)",
              fontSize: 16,
              fontWeight: 700,
              lineHeight: "18px",
              color: "var(--color-merch-ink-dark)",
              margin: 0,
            }}
          >
            {title}
          </h2>

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

        {/* Cart icon button — 50×50, white bg, 1px border at 1280.
            Hidden at rest (opacity-0); fades in on group-hover.
            Suppressed entirely when hasAddToCart=false. */}
        {hasAddToCart && (
          <button
            type="button"
            aria-label={`Add ${title} to cart`}
            className="ml-2 flex shrink-0 items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            style={{
              width: 50,
              height: 50,
              backgroundColor: "var(--color-merch-on-dark)",
              border: "1px solid var(--color-merch-input-border)",
              cursor: "pointer",
              color: "var(--color-merch-ink-dark)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(slug);
            }}
          >
            <CartIcon />
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Add-to-Cart overlay bar — full-width, HIDDEN at rest.               */}
      {/* Revealed on card hover via group-hover Tailwind utility.            */}
      {/* Real: ls 0.02em, lh 18px, wrapper 24px above / 16px below button.  */}
      {/* max-height trick: 0 at rest, 90px on hover — overflow-hidden clips. */}
      {/* Suppressed entirely when hasAddToCart=false (related carousel).     */}
      {/* ------------------------------------------------------------------ */}
      {hasAddToCart && (
        <div className="max-h-0 overflow-hidden transition-all duration-200 ease-out group-hover:max-h-[90px]">
          {/* Inner wrapper with the measured spacing: 24px above / 16px below */}
          <div className="px-5 pt-6 pb-4">
            <button
              type="button"
              className="w-full"
              style={{
                height: 50,
                backgroundColor: "var(--color-merch-ink-dark)",
                color: "var(--color-merch-on-dark)",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-merch-display)",
                fontSize: 16,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                lineHeight: "18px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(slug);
              }}
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
