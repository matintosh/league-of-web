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
 * Real card anatomy (remeasured 2026-08-06 from merch.riotgames.com shop-all @1280px):
 *   - Card article: ~640px wide, background #f7f7f7 (--color-merch-surface-alt)
 *     with 1px white border — grey tiles separated by ~2px white seams
 *   - Card border: 1px solid --color-merch-on-dark (#ffffff) — white seams
 *   - Header row (~57px): franchise wordmark (top-left), badge chips + heart (top-right)
 *     ALL ABOVE the image — gap ~11px between wordmark bottom and image top
 *   - Badge chips: horizontal ROW (flex-row gap-2 / 8px) right of wordmark, wraps on overflow
 *   - Image box: 638×225px, object-fit: contain, surface-alt bg (#f7f7f7)
 *   - Info strip: 16px top padding (pt-4); title riotSans 16px/700 black lh 18px;
 *     price 16px/400 lh 20px; 24-26px bottom padding below price
 *   - Badge chips: 14px mixed-case, black text; New=#8CD50B, Preorder=#666, Limited=#FFD700;
 *     border-radius 2px, padding 4px 8px, white-space: nowrap — horizontal row at top-right
 *   - Discount %-badge: top-right header row (not over image), same green as New badge
 *   - Heart icon: 24×24; inline with badge cluster, ~21px from cell right edge
 *   - Whole card wrapped in <a> link — entire 638×375 cell is one link
 *   - In-card CTA: "Add to Cart" — HIDDEN at rest, revealed on card hover;
 *     50×50 cart-icon button right of title/price also fades in on hover (1280)
 *   - Size row: S M L XL 2XL chip row above ADD TO CART in hover reveal panel
 *     (selected chip bg #000 white text, border-radius 3, pad 8/16); surface #f7f7f7
 *   - @390 (2-col → ~195px cards): badge cluster wraps (flex-wrap), header right cluster
 *     shrinks to fit; always-visible 50×50 red cart button right of price; NO overflow
 *   - Image carousel: prev/next 64×64 circular buttons revealed on card hover
 *     to cycle through imageSrcs[]; hidden when only one image
 */

import { useCallback, useId, useState } from "react";
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
  /**
   * Additional image URLs for the in-card carousel.
   * When provided with more than one entry, the card shows prev/next
   * arrow buttons on hover to cycle through images.
   * The first entry should equal `imageUrl` for a consistent initial render.
   */
  imageSrcs?: string[];
  /** Display price string, e.g. "$19.99" or "$19.99 – $49.99". */
  price: string;
  /** Original (pre-sale) price string; shows struck-through if provided and differs from price. */
  originalPrice?: string;
  /**
   * Single badge label (back-compat). Superseded by `badges` when both present.
   * @deprecated Prefer `badges` for the horizontal badge row design.
   */
  badge?: MerchProduct["badge"];
  /**
   * Multi-badge array for the real horizontal badge row (top-right in header row).
   * When provided, supersedes `badge`. E.g. ["New", "Limited Edition"].
   * Rendered as a horizontal row (flex-row) — wraps to a 2nd row on overflow.
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
   * Default is 225px (real shop-all card: image band 638×225 measured 2026-08-06).
   * Collection-index portrait strips use 282px.
   * @default 225
   */
  imageHeight?: number;
  /**
   * Size labels for the hover-reveal size selector row (e.g. ["S", "M", "L", "XL", "2XL"]).
   * When provided, the hover overlay shows a chip row above the ADD TO CART button,
   * matching the real merch.riotgames.com hover panel: #f7f7f7 surface, selected chip
   * black bg/white text, border-radius 3, padding 8/16px.
   * When omitted, no size row is shown (non-apparel products).
   */
  sizes?: string[];
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
    // Out-of-stock: same chip family as Preorder — solid #666666 bg, white text,
    // radius 2, padding 4x8, h=26 via line-height/padding, no border.
    // Real: Inter 14/400 sentence-case, white text on #666666, radius 2.
    return {
      backgroundColor: "var(--color-merch-badge-preorder)",
      color: "var(--color-merch-on-dark)",
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
// Cart icon (for the 50×50 hover-reveal icon button at 1280 and 48×40 mobile)
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
// Carousel arrow icons (64×64 circles, prev/next)
// ---------------------------------------------------------------------------

function ChevronLeftIcon() {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, display: "block" }}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: 20, height: 20, display: "block" }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchProductCard — 2-col flush listing card matching merch.riotgames.com real anatomy.
 *
 * Real card anatomy at 1280px (remeasured 2026-08-06):
 * - Whole card is one <a> link (entire 638×375 cell)
 * - Card background: transparent (page white shows through for listing cards)
 * - Header row (~57px): franchise wordmark SVG left (grey #666), badge chips ROW + heart right
 *   Badge chips are a horizontal flex-row (gap-1), wrapping on overflow (e.g. at 390)
 * - Image box: 225px tall, object-contain, transparent bg; prev/next arrows on hover
 * - Info strip: 16px top padding; title riotSans 16px/700/lh-18px; price 16px/400/lh-20px;
 *   24-26px bottom padding below price
 * - Price row: lh 20px, gap 4px between struck and current (real: gap-1 not gap-2)
 * - ATC strip: HIDDEN at rest; revealed on card hover (group-hover); suppressed at 390
 * - Cart icon button: hover-reveal at 1280; always-visible red button at 390 (beside price)
 * - Card border: 1px solid --color-merch-on-dark (white) — cards read as seamless panels
 * - @390: badge row wraps before heart; always-visible red 48×40 cart button; no overflow
 *
 * Grid usage: place inside `grid grid-cols-2 gap-0` with border dividers.
 */
export function MerchProductCard({
  slug,
  title,
  imageUrl,
  imageSrcs,
  price,
  originalPrice,
  badge,
  badges,
  franchiseLabel,
  franchiseKey,
  imageFit = "contain",
  imageHeight = 225,
  sizes,
  ctaLabel = "Add to Cart",
  hasAddToCart = true,
  onClick,
  onWishlist,
  onAddToCart,
}: MerchProductCardProps) {
  const heartTitleId = useId();

  // Size selector state — first size pre-selected per real site behaviour
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizes && sizes.length > 0 ? (sizes[0] ?? null) : null,
  );

  // Carousel state — index into imageSrcs (or falls back to imageUrl)
  const allImages: string[] =
    imageSrcs && imageSrcs.length > 1 ? imageSrcs : [imageUrl];
  const [imgIndex, setImgIndex] = useState(0);
  const hasMultipleImages = allImages.length > 1;

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setImgIndex((i) => (i - 1 + allImages.length) % allImages.length);
    },
    [allImages.length],
  );

  const goNext = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setImgIndex((i) => (i + 1) % allImages.length);
    },
    [allImages.length],
  );

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
    // Whole card is one link — entire cell is clickable per real site anatomy.
    // `group` enables Tailwind group-hover utilities for hover-reveal ATC strip.
    // Card surface is grey #f7f7f7 (--color-merch-surface-alt) per real site
    // measurements — header, image, title, and price all sit on the faint grey
    // panel; the 1px white border creates ~2px white seams between grid cells.
    <a
      href={`/merch/product/${slug}`}
      role="article"
      className="group flex w-full cursor-pointer flex-col"
      style={{
        fontFamily: "var(--font-merch)",
        // White seam borders — grey tiles separated by white seams
        border: "1px solid var(--color-merch-on-dark)",
        // Grey #f7f7f7 surface — the entire card (not just image) sits on this
        backgroundColor: "var(--color-merch-surface-alt)",
        textDecoration: "none",
        color: "inherit",
        // Contain badge chips + heart within the narrow grid cell at 390px
        // (two-column grid → ~195px per card). overflow-x-clip avoids creating
        // a new BFC while still clipping horizontal excess.
        overflowX: "clip",
      }}
      onClick={(e) => {
        // Propagate to onClick callback; don't prevent default so the link navigates.
        onClick?.(slug);
        // If no external handler, suppress default to keep SPA behavior when onClick is set.
        if (onClick) e.preventDefault();
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Header row — franchise wordmark + badge ROW + %-badge + heart       */}
      {/* Real: ~57px, padding 16px top / 20px sides; 9px gap to image top    */}
      {/* (badge row 36px above image top = header pt-4 16px + row ~11px tall  */}
      {/*  + pb-[9px] 9px = 36px gap; previous pb-3=12px was 6px too much)    */}
      {/* items-start: wordmark aligns to top of the badge row cluster        */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="flex items-start justify-between px-5 pt-4 pb-[9px]"
        style={{ minHeight: 57 }}
      >
        {/* Franchise wordmark — SVG logo (grey fill via currentColor) or text fallback.
            min-w-0 + shrink: wordmark compresses before badge cluster at 390px narrow
            cards (two-column grid → ~195px cell). Always visible — not suppressed when
            badges are present (delta #4 fix: chip pinned LEFT). */}
        {FranchiseLogo ? (
          <span
            className="flex min-w-0 shrink items-center pt-px"
            style={{ color: "var(--color-merch-franchise-label)" }}
          >
            <FranchiseLogo />
          </span>
        ) : (
          <span
            className="min-w-0 shrink truncate pt-px text-[16px] font-normal leading-tight"
            style={{ color: "var(--color-merch-franchise-label)" }}
          >
            {franchiseLabel ?? ""}
          </span>
        )}

        {/* Right cluster: badge chips ROW + discount %-badge + heart.
            At 390px the cluster must SHRINK to stay within the card cell — using
            `shrink min-w-0 flex-wrap` so badges wrap to a 2nd row before the heart,
            rather than `shrink-0` which kept the cluster at desktop width and caused
            badges to overflow the 195px cell (delta #2 fix). gap-2 = 8px badge gap
            matches real measurement (delta #5 fix). */}
        <div
          className="flex shrink min-w-0 flex-wrap items-start justify-end gap-2 pl-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Badge chips ROW + %-discount badge — horizontal (flex-row flex-wrap).
              justify-end right-aligns the row; they wrap BEFORE the heart at 390px. */}
          {(activeBadges.length > 0 || discountPct !== null) && (
            <div className="flex flex-row flex-wrap items-start justify-end gap-2">
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
            </div>
          )}

          {/* Heart / wishlist — 24×24 per real site; ~21px from cell right edge.
              shrink-0: heart never compresses — badges wrap around it at 390px */}
          <button
            type="button"
            aria-label={`Add ${title} to wishlist`}
            className="flex shrink-0 items-center justify-center transition-opacity duration-150"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-merch-heart)",
              opacity: 0.7,
              padding: 0,
              // 21px right inset: container px-5 (20px) + 1px border ≈ 21px
              marginRight: 0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.opacity = "0.7";
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onWishlist?.(slug);
            }}
          >
            <HeartIcon id={heartTitleId} />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Image container — 225px tall, object-contain, surface-alt bg        */}
      {/* Real measurement: image DIV 638×225 @1280 (remeasured 2026-08-06)   */}
      {/* Carousel arrows (64×64 circles) revealed on card hover (group-hover) */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: imageHeight, backgroundColor: "var(--color-merch-surface-alt)" }}
      >
        {/* Product image — scale on hover */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={allImages[imgIndex]}
          alt={title}
          loading="lazy"
          className={`h-full w-full transition-transform duration-200 ease-out group-hover:scale-[1.04] ${imageFit === "cover" ? "object-cover" : "object-contain"}`}
          style={{ display: "block" }}
        />

        {/* Carousel prev/next arrows — only when multiple images exist.
            64×64 circular buttons (transparent bg, border-radius 100%) per real site.
            Hidden at rest (opacity-0); revealed on card hover via group-hover. */}
        {hasMultipleImages && (
          <>
            {/* Prev arrow */}
            <button
              type="button"
              aria-label="Previous image"
              className="absolute top-1/2 left-2 flex -translate-y-1/2 items-center justify-center rounded-full opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              style={{
                width: 64,
                height: 64,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--color-merch-ink)",
              }}
              onClick={goPrev}
            >
              <ChevronLeftIcon />
            </button>

            {/* Next arrow */}
            <button
              type="button"
              aria-label="Next image"
              className="absolute top-1/2 right-2 flex -translate-y-1/2 items-center justify-center rounded-full opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              style={{
                width: 64,
                height: 64,
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--color-merch-ink)",
              }}
              onClick={goNext}
            >
              <ChevronRightIcon />
            </button>
          </>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Info strip — title + price + hover-reveal cart icon button           */}
      {/* Real: 21px top padding (16px + 5px extra delta #5); 24-26px bottom  */}
      {/* price lh 20px; struck↔current gap 4px (gap-1)                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex items-start gap-0 px-5 pt-[21px] pb-6">
        {/* Title + price column */}
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* Title — riotSans 16px/700, lh 18px, black.
              No line-clamp: real shows full 2-line titles, never ellipsized.
              wordBreak: break-word ensures long words ("Championship") wrap
              within the title column rather than squeezing the cart button
              (delta #7 fix for 390px 2-col cards). */}
          <h2
            style={{
              fontFamily: "var(--font-merch-display)",
              fontSize: 16,
              fontWeight: 700,
              lineHeight: "18px",
              color: "var(--color-merch-ink-dark)",
              margin: 0,
              wordBreak: "break-word",
            }}
          >
            {title}
          </h2>

          {/* Price row.
              Sale: struck original in grey (#666) at 16px/lh-20px, current price in dark ink.
              Non-sale: 16px/400/lh-20px pure-black. gap-1 = 4px between prices (remeasured 2026-08-06). */}
          <div className="flex items-center gap-1">
            {isOnSale && originalPrice ? (
              <>
                <span
                  className="line-through text-[16px]"
                  style={{
                    color: "var(--color-merch-price-struck)",
                    lineHeight: "20px",
                  }}
                >
                  {originalPrice}
                </span>
                <span
                  className="text-[16px] font-normal"
                  style={{
                    color: "var(--color-merch-ink-dark)",
                    lineHeight: "20px",
                  }}
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

        {/* Cart icon button — desktop (1280): 50×50, white bg, 1px border.
            Hidden at rest (opacity-0); fades in on group-hover.
            Only shown on md+ screens (hidden on mobile where the always-visible
            red button renders instead). Suppressed entirely when hasAddToCart=false. */}
        {hasAddToCart && (
          <button
            type="button"
            aria-label={`Add ${title} to cart`}
            className="ml-2 hidden shrink-0 items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:flex"
            style={{
              width: 50,
              height: 50,
              backgroundColor: "var(--color-merch-on-dark)",
              border: "1px solid var(--color-merch-input-border)",
              cursor: "pointer",
              color: "var(--color-merch-ink-dark)",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart?.(slug);
            }}
          >
            <CartIcon />
          </button>
        )}

        {/* Mobile cart button — always-visible 50×50 red square with white cart icon.
            Shown only on small screens (sm: hidden). Per real @390: right-aligned
            beside price; red #eb0029 bg, white icon. 50×50 per delta #7 fix
            (was 48×40; reserves correct width so title gets full remaining space). */}
        {hasAddToCart && (
          <button
            type="button"
            aria-label={`Add ${title} to cart`}
            className="ml-2 flex shrink-0 items-center justify-center sm:hidden"
            style={{
              width: 50,
              height: 50,
              backgroundColor: "var(--color-merch-red)",
              border: "none",
              cursor: "pointer",
              color: "var(--color-merch-on-dark)",
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onAddToCart?.(slug);
            }}
          >
            <CartIcon />
          </button>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Add-to-Cart overlay — full-width, HIDDEN at rest.                   */}
      {/* Revealed on card hover via group-hover Tailwind utility.            */}
      {/* Real: #f7f7f7 surface panel; size chip row above ADD TO CART;       */}
      {/* selected chip bg #000 white text, br 3, pad 8/16; ls 0.02em        */}
      {/* max-height trick: 0 at rest, expands on hover — overflow clips.     */}
      {/* Sizes present: max-h-[160px]; no sizes: max-h-[90px].              */}
      {/* Suppressed entirely when hasAddToCart=false (related carousel).     */}
      {/* Hidden on mobile (sm:block) — the always-visible red button handles */}
      {/* the add-to-cart action at 390px.                                    */}
      {/* ------------------------------------------------------------------ */}
      {hasAddToCart && (
        <div
          className={`hidden max-h-0 overflow-hidden transition-all duration-200 ease-out sm:block ${sizes && sizes.length > 0 ? "group-hover:max-h-[160px]" : "group-hover:max-h-[90px]"}`}
          style={{ backgroundColor: "var(--color-merch-surface-alt)" }}
        >
          {/* Inner wrapper: 24px above content / 16px below button */}
          <div className="px-5 pt-6 pb-4">
            {/* Size chip row — shown only when sizes prop is supplied.
                Real: "S M L XL 2XL" chips; selected=black bg/white text,
                border-radius 3px, padding 8/16px; unselected: transparent bg,
                1px border, dark text. Clicking a chip fires onAddToCart with
                the selected size (presentational — parent handles state). */}
            {sizes && sizes.length > 0 && (
              <div className="mb-3 flex flex-wrap items-center gap-1">
                {sizes.map((size) => {
                  const isSelected = size === selectedSize;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedSize(size);
                      }}
                      style={{
                        padding: "8px 16px",
                        borderRadius: 3,
                        border: isSelected
                          ? "none"
                          : "1px solid var(--color-merch-border)",
                        backgroundColor: isSelected
                          ? "var(--color-merch-ink-dark)"
                          : "transparent",
                        color: isSelected
                          ? "var(--color-merch-on-dark)"
                          : "var(--color-merch-ink-dark)",
                        cursor: "pointer",
                        fontFamily: "var(--font-merch)",
                        fontSize: 14,
                        fontWeight: 400,
                        lineHeight: "18px",
                      }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            )}

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
                e.preventDefault();
                e.stopPropagation();
                onAddToCart?.(slug);
              }}
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      )}
    </a>
  );
}
