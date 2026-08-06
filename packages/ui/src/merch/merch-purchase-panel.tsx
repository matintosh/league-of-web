"use client";

/**
 * MerchPurchasePanel — PDP right column: category trail, title, heart/share row
 * (with heart 40×40, share 40×40, and badge at row end), price, variant chips,
 * optional quantity stepper, Add to Cart + Buy It Now CTAs.
 *
 * Measured from merch.riotgames.com (amumu-plush, 1280px desktop):
 *   Category trail: 14px / 600 / uppercase / 0.02em ls / #666666 color, NO "/" glyphs
 *     Separator: '|' pipe glyph colored #d0d0d0 (--color-merch-trail-sep)
 *     Trail terms: "COLLECTIBLES | LEAGUE OF LEGENDS" (2 terms only)
 *   Title H1: clamp(38px, 3.75vw, 48px) / 700 / lh 1.1 / --color-merch-ink-dark / uppercase / -0.03em tracking
 *   Heart/share row: 40×40 borderless icon buttons below H1; badge at row end
 *     Icons: border-width 0 (bare float), color pure black (#000000 = --color-merch-ink-dark)
 *     Share glyph: export box-with-up-arrow (not 3-node network glyph)
 *   Badge "New": 165×40 fixed, text LEFT-aligned, lh 20px; stacks vertically when multiple
 *   Price: 28px / 400 / lh 35px / --color-merch-ink-dark; 24px top/bottom padding
 *   Notices: single RED line rgb(235,0,41) = --color-merch-red; login notice copy
 *   Variant chips: 8px 16px / 13px / flex-wrap / 8px gap
 *   Add to Cart: 50px tall / fills row minus Buy It Now / merch-red bg / riotSans 16/600 / 0.02em ls
 *   Buy It Now: 50×50 / same disabled state as ATC
 *   No qty stepper on PDP (showQuantity=false default)
 *   No dividers between badge/price/notices sections
 *
 * Fully presentational — no internal useState.
 */
import React from "react";
import type { MerchVariant } from "@low/fixtures";

export type { MerchVariant };

/** Map badge label to its background token var. */
function badgeBg(badge: string): string {
  const lc = badge.toLowerCase();
  if (lc === "new") return "var(--color-merch-badge-new)";
  if (lc.startsWith("limit")) return "var(--color-merch-badge-limited)";
  if (lc.startsWith("preorder") || lc.startsWith("pre-order"))
    return "var(--color-merch-badge-preorder)";
  return "var(--color-merch-ink)";
}

function badgeTextColor(badge: string): string {
  const lc = badge.toLowerCase();
  // New (green) and Limited (yellow) read better with black text
  if (lc === "new" || lc.startsWith("limit")) return "var(--color-merch-ink-dark)";
  // Preorder (grey) and fallback (ink/dark) use white
  return "var(--color-merch-on-dark)";
}

/* SVG icon for wishlist heart (outline) */
function HeartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

/**
 * Share icon — export box-with-up-arrow (matches real merch.riotgames.com PDP).
 * Distinct from the 3-node network/graph glyph that was previously used.
 */
function ShareIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Box outline — bottom + sides */}
      <polyline points="8 17 3 17 3 21 21 21 21 17 16 17" />
      {/* Up arrow shaft */}
      <line x1="12" y1="3" x2="12" y2="15" />
      {/* Up arrow head */}
      <polyline points="8 7 12 3 16 7" />
    </svg>
  );
}

export interface MerchPurchasePanelProps {
  /** Product title. */
  title: string;
  /** Display price, e.g. "$39.99". */
  price: string;
  /** Pre-sale price if on sale, e.g. "$59.99". Shown struck-through. */
  originalPrice?: string;
  /** Badges rendered in the icon row (heart / share / badge), e.g. ["New"]. */
  badges?: string[];
  /** Short description below the CTA button (unused in PDP — passed to InfoTabs). */
  description?: string;
  /** Breadcrumb segments (unused in this component; handled by MerchBreadcrumbBar). */
  breadcrumb?: string[];
  /**
   * Category trail rendered immediately above the h1 as a 14px uppercase row.
   * Matches the real PDP: "COLLECTIBLES | LEAGUE OF LEGENDS" (2 terms, pipe separator).
   * E.g. ["COLLECTIBLES", "LEAGUE OF LEGENDS"].
   */
  categoryTrail?: string[];
  /**
   * Purchase notices rendered between the price and the CTA.
   * Real PDP shows a SINGLE red notice: "You need to be logged in to a Riot account…"
   * Rendered at 16px, --color-merch-red for the login notice.
   */
  notices?: string[];
  /** Size/variant chips. Omit for products with no variant selector. */
  variants?: MerchVariant[];
  /** Label above the chips, e.g. "Size". Defaults to "Size". */
  variantLabel?: string;
  /** Currently selected variant label — controlled. */
  selectedVariant?: string;
  /** Called when a variant chip is clicked. */
  onVariantChange?: (label: string) => void;
  /**
   * When true, renders a quantity stepper (default false — real amumu PDP has none).
   */
  showQuantity?: boolean;
  /** Current quantity — controlled. Defaults to 1. */
  quantity?: number;
  /** Called when quantity changes (stepper ±). */
  onQuantityChange?: (qty: number) => void;
  /** Called when "Add to Cart" is clicked. */
  onAddToCart?: () => void;
  /** Called when "Buy It Now" is clicked. */
  onBuyNow?: () => void;
  /** If true, both CTAs are disabled and ATC shows "Out of Stock". */
  outOfStock?: boolean;
  /** If true, renders a "Size Guide" text link in the variant-label row. */
  showSizeGuideLink?: boolean;
  /** Called when the "Size Guide" link is clicked. */
  onSizeGuideClick?: () => void;
  /** Called when the wishlist heart button is clicked. */
  onWishlist?: () => void;
  /** Called when the share button is clicked. */
  onShare?: () => void;
}

/**
 * MerchPurchasePanel — right-column PDP purchase UI.
 * Compose with MerchProductGallery in a 64.7/35.3 grid layout.
 */
export function MerchPurchasePanel({
  title,
  price,
  originalPrice,
  badges,
  categoryTrail,
  notices,
  variants,
  variantLabel = "Size",
  selectedVariant,
  onVariantChange,
  showQuantity = false,
  quantity = 1,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  outOfStock = false,
  showSizeGuideLink = false,
  onSizeGuideClick,
  onWishlist,
  onShare,
}: MerchPurchasePanelProps) {
  const isSale = Boolean(originalPrice && originalPrice !== price);
  const safeQty = Math.max(1, quantity);

  return (
    <div
      style={{
        fontFamily: "var(--font-merch)",
        color: "var(--color-merch-ink)",
        width: "100%",
      }}
    >
      {/* ── Category trail ──────────────────────────────────────────────── */}
      {categoryTrail && categoryTrail.length > 0 && (
        <ul
          aria-label="Category trail"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "4px",
            margin: "0 0 8px",
            padding: 0,
            listStyle: "none",
          }}
        >
          {categoryTrail.map((seg, idx) => (
            <li
              key={idx}
              style={{
                fontSize: 14,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
                color: "var(--color-merch-price-struck)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {idx > 0 && (
                <span
                  aria-hidden="true"
                  style={{ color: "var(--color-merch-trail-sep)" }}
                >
                  |
                </span>
              )}
              {seg}
            </li>
          ))}
        </ul>
      )}

      {/* ── Title ───────────────────────────────────────────────────────── */}
      <h1
        style={{
          fontSize: "clamp(38px, 3.75vw, 48px)",
          fontWeight: 700,
          lineHeight: 1.1,
          color: "var(--color-merch-ink-dark)",
          textTransform: "uppercase",
          letterSpacing: "-0.03em",
          margin: "0 0 12px",
          fontFamily: "var(--font-merch-display, var(--font-merch))",
        }}
      >
        {title}
      </h1>

      {/* ── Heart / Share / Badge row ────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
        }}
      >
        {/* Wishlist heart — borderless, pure black icon */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={onWishlist}
          style={{
            width: 40,
            height: 40,
            border: "none",
            background: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-merch-ink-dark)",
            flexShrink: 0,
            padding: 0,
          }}
        >
          <HeartIcon />
        </button>

        {/* Share — borderless, pure black icon, export box-with-up-arrow glyph */}
        <button
          type="button"
          aria-label="Share product"
          onClick={onShare}
          style={{
            width: 40,
            height: 40,
            border: "none",
            background: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-merch-ink-dark)",
            flexShrink: 0,
            padding: 0,
          }}
        >
          <ShareIcon />
        </button>

        {/* Badges at row end — 165×40 each, stacked vertically when multiple */}
        {badges && badges.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {badges.map((badge) => (
              <span
                key={badge}
                style={{
                  width: 165,
                  height: 40,
                  fontSize: 16,
                  fontWeight: 400,
                  letterSpacing: "0",
                  padding: "0 10px",
                  borderRadius: 2,
                  backgroundColor: badgeBg(badge),
                  color: badgeTextColor(badge),
                  lineHeight: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  flexShrink: 0,
                  boxSizing: "border-box",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Price ───────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          paddingTop: 24,
          paddingBottom: 24,
        }}
      >
        {isSale ? (
          <>
            <span
              style={{
                fontSize: 16,
                fontWeight: 400,
                color: "var(--color-merch-muted)",
                textDecoration: "line-through",
              }}
            >
              {originalPrice}
            </span>
            <span
              style={{
                fontSize: 28,
                fontWeight: 400,
                lineHeight: "35px",
                color: "var(--color-merch-red)",
              }}
            >
              {price}
            </span>
          </>
        ) : (
          <span
            style={{
              fontSize: 28,
              fontWeight: 400,
              lineHeight: "35px",
              color: "var(--color-merch-ink-dark)",
            }}
          >
            {price}
          </span>
        )}
      </div>

      {/* ── Variant selector ────────────────────────────────────────────── */}
      {variants && variants.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--color-merch-body)",
                margin: 0,
              }}
            >
              {variantLabel}
              {selectedVariant && `: ${selectedVariant}`}
            </p>
            {showSizeGuideLink && (
              <button
                type="button"
                onClick={onSizeGuideClick}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 400,
                  color: "var(--color-merch-muted)",
                  fontFamily: "inherit",
                  padding: 0,
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.textDecoration = "underline";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.textDecoration = "none";
                }}
              >
                Size Guide
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {variants.map((v) => {
              const isActive = v.label === selectedVariant;
              return (
                <button
                  key={v.label}
                  type="button"
                  disabled={!v.available}
                  onClick={() => v.available && onVariantChange?.(v.label)}
                  style={{
                    padding: "8px 16px",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    border: isActive
                      ? "2px solid var(--color-merch-ink)"
                      : "1px solid var(--color-merch-border)",
                    backgroundColor: isActive
                      ? "var(--color-merch-ink)"
                      : "var(--color-merch-bg)",
                    color: isActive
                      ? "var(--color-merch-on-dark)"
                      : "var(--color-merch-ink)",
                    cursor: v.available ? "pointer" : "not-allowed",
                    opacity: v.available ? 1 : 0.35,
                    textDecoration: v.available ? "none" : "line-through",
                    fontFamily: "inherit",
                    transition: "border-color 120ms ease",
                  }}
                  onMouseEnter={(e) => {
                    if (v.available && !isActive) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "var(--color-merch-ink)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (v.available && !isActive) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor =
                        "var(--color-merch-border)";
                    }
                  }}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Purchase notices ────────────────────────────────────────────── */}
      {notices && notices.length > 0 && (
        <div style={{ marginTop: variants && variants.length > 0 ? 16 : 8 }}>
          {notices.map((notice, idx) => (
            <p
              key={idx}
              style={{
                fontSize: 16,
                color: "var(--color-merch-red)",
                lineHeight: 1.5,
                margin: idx > 0 ? "6px 0 0" : 0,
              }}
            >
              {notice}
            </p>
          ))}
        </div>
      )}

      {/* ── Quantity stepper (PDP-off by default) ───────────────────────── */}
      {showQuantity && (
        <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 20 }}>
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={safeQty <= 1}
            onClick={() => onQuantityChange?.(Math.max(1, safeQty - 1))}
            style={{
              width: 40,
              height: 40,
              border: "1px solid var(--color-merch-border)",
              backgroundColor: "var(--color-merch-bg)",
              color: "var(--color-merch-ink)",
              fontSize: 18,
              cursor: safeQty <= 1 ? "not-allowed" : "pointer",
              opacity: safeQty <= 1 ? 0.4 : 1,
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            −
          </button>
          <div
            aria-label={`Quantity: ${safeQty}`}
            style={{
              width: 40,
              height: 40,
              border: "1px solid var(--color-merch-border)",
              borderLeft: "none",
              borderRight: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              color: "var(--color-merch-ink)",
              userSelect: "none",
            }}
          >
            {safeQty}
          </div>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => onQuantityChange?.(safeQty + 1)}
            style={{
              width: 40,
              height: 40,
              border: "1px solid var(--color-merch-border)",
              backgroundColor: "var(--color-merch-bg)",
              color: "var(--color-merch-ink)",
              fontSize: 18,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            +
          </button>
        </div>
      )}

      {/* ── CTA row: Add to Cart + Buy It Now ────────────────────────────── */}
      {/*
       * Desktop: ATC fills remaining width, BIN is 50×50 square at right.
       * Mobile (@390): ATC fills width minus the 50px BIN — flex row, full width.
       * Disabled state: both follow outOfStock (logged user decision, do not change).
       */}
      <div
        style={{
          marginTop: 20,
          display: "flex",
          gap: 8,
          width: "100%",
        }}
      >
        {/* Add to Cart — flex-1 so it fills row minus the 50px BIN */}
        <button
          type="button"
          disabled={outOfStock}
          onClick={() => !outOfStock && onAddToCart?.()}
          style={{
            flex: "1 1 auto",
            height: 50,
            backgroundColor: outOfStock
              ? "var(--color-merch-muted)"
              : "var(--color-merch-red)",
            color: "var(--color-merch-on-dark)",
            fontSize: 16,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.02em",
            border: "none",
            cursor: outOfStock ? "not-allowed" : "pointer",
            fontFamily: "var(--font-merch-display, var(--font-merch))",
            transition: "background-color 150ms ease",
          }}
          onMouseEnter={(e) => {
            if (!outOfStock) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-merch-red-dark)";
            }
          }}
          onMouseLeave={(e) => {
            if (!outOfStock) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-merch-red)";
            }
          }}
        >
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>

        {/* Buy It Now — 50×50 square secondary button */}
        <button
          type="button"
          aria-label="Buy It Now"
          disabled={outOfStock}
          onClick={() => !outOfStock && onBuyNow?.()}
          style={{
            width: 50,
            height: 50,
            flexShrink: 0,
            backgroundColor: outOfStock
              ? "var(--color-merch-muted)"
              : "var(--color-merch-ink-dark)",
            color: "var(--color-merch-on-dark)",
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.01em",
            border: "none",
            cursor: outOfStock ? "not-allowed" : "pointer",
            fontFamily: "var(--font-merch-display, var(--font-merch))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            lineHeight: 1.2,
            padding: "4px 2px",
            transition: "background-color 150ms ease",
          }}
          onMouseEnter={(e) => {
            if (!outOfStock) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-merch-ink)";
            }
          }}
          onMouseLeave={(e) => {
            if (!outOfStock) {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-merch-ink-dark)";
            }
          }}
        >
          Buy It Now
        </button>
      </div>
    </div>
  );
}
