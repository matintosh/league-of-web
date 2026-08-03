"use client";

/**
 * MerchPurchasePanel — PDP right column: title, badges, price, variant chips,
 * quantity stepper, Add to Cart CTA, optional description.
 *
 * Measured from merch.riotgames.com (~1280px desktop):
 *   Panel width: ~38% of page width (~485px at 1280px — proportional grid)
 *   Title: clamp(32px, 3.75vw, 48px) / 700 / line-height 1.1 / var(--color-merch-ink)
 *   Badges: 10px uppercase / 2px 8px padding / ink bg / on-dark text
 *   Price: 16px / 400; sale = struck original (muted) + red current
 *   Variant chips: 8px 16px padding / 13px / flex-wrap / 8px gap
 *   Active chip: ink bg + on-dark text + 2px ink border
 *   Disabled chip: 0.35 opacity + line-through + not-allowed cursor
 *   Qty stepper: 40×40px per cell / 1px border
 *   Add to Cart: 50px tall / full-width / merch-red bg / 600 uppercase 16px
 *   Breadcrumb: 16px / muted color
 *
 * Fully presentational — no internal useState.
 */
import React from "react";
import type { MerchVariant } from "@low/fixtures";

export type { MerchVariant };

export interface MerchPurchasePanelProps {
  /** Product title. */
  title: string;
  /** Display price, e.g. "$39.99". */
  price: string;
  /** Pre-sale price if on sale, e.g. "$59.99". Shown struck-through. */
  originalPrice?: string;
  /** Badges beneath the title, e.g. ["New", "Limited Edition"]. */
  badges?: string[];
  /** Short description below the CTA button. */
  description?: string;
  /** Breadcrumb segments, e.g. ["Home", "Tops", "MSI 2026 Tee"]. */
  breadcrumb?: string[];
  /** Size/variant chips. Omit for products with no variant selector. */
  variants?: MerchVariant[];
  /** Label above the chips, e.g. "Size". Defaults to "Size". */
  variantLabel?: string;
  /** Currently selected variant label — controlled. */
  selectedVariant?: string;
  /** Called when a variant chip is clicked. */
  onVariantChange?: (label: string) => void;
  /** Current quantity — controlled. Defaults to 1. */
  quantity?: number;
  /** Called when quantity changes (stepper ±). */
  onQuantityChange?: (qty: number) => void;
  /** Called when "Add to Cart" is clicked. */
  onAddToCart?: () => void;
  /** If true, CTA is disabled and shows "Out of Stock". */
  outOfStock?: boolean;
  /** If true, renders a "Size Guide" text link in the variant-label row. */
  showSizeGuideLink?: boolean;
  /** Called when the "Size Guide" link is clicked. */
  onSizeGuideClick?: () => void;
}

const DIVIDER: React.CSSProperties = {
  borderTop: "1px solid var(--color-merch-border)",
  margin: "16px 0",
};

/**
 * MerchPurchasePanel — right-column PDP purchase UI.
 * Compose with MerchProductGallery in a 2-column flex layout.
 */
export function MerchPurchasePanel({
  title,
  price,
  originalPrice,
  badges,
  description,
  breadcrumb,
  variants,
  variantLabel = "Size",
  selectedVariant,
  onVariantChange,
  quantity = 1,
  onQuantityChange,
  onAddToCart,
  outOfStock = false,
  showSizeGuideLink = false,
  onSizeGuideClick,
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
      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav aria-label="Breadcrumb" style={{ marginBottom: 16 }}>
          <ol
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "4px",
              listStyle: "none",
              padding: 0,
              margin: 0,
              fontSize: 16,
              color: "var(--color-merch-muted)",
            }}
          >
            {breadcrumb.map((seg, idx) => (
              <li key={idx} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {idx > 0 && <span aria-hidden="true">›</span>}
                <span>{seg}</span>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* ── Title ───────────────────────────────────────────────────────── */}
      <h1
        style={{
          fontSize: "clamp(32px, 3.75vw, 48px)",
          fontWeight: 700,
          lineHeight: 1.1,
          color: "var(--color-merch-ink)",
          margin: 0,
        }}
      >
        {title}
      </h1>

      {/* ── Badges ──────────────────────────────────────────────────────── */}
      {badges && badges.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginTop: 8,
          }}
        >
          {badges.map((badge) => (
            <span
              key={badge}
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "2px 8px",
                backgroundColor: "var(--color-merch-ink)",
                color: "var(--color-merch-on-dark)",
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      <div style={DIVIDER} />

      {/* ── Price ───────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
                fontSize: 16,
                fontWeight: 400,
                color: "var(--color-merch-red)",
              }}
            >
              {price}
            </span>
          </>
        ) : (
          <span
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "var(--color-merch-ink)",
            }}
          >
            {price}
          </span>
        )}
      </div>

      {/* ── Variant selector ────────────────────────────────────────────── */}
      {variants && variants.length > 0 && (
        <>
          <div style={DIVIDER} />
          <div>
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
        </>
      )}

      <div style={DIVIDER} />

      {/* ── Quantity stepper ────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
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

      <div style={{ marginTop: 16 }}>
        {/* ── Add to Cart ───────────────────────────────────────────────── */}
        <button
          type="button"
          disabled={outOfStock}
          onClick={() => !outOfStock && onAddToCart?.()}
          style={{
            display: "block",
            width: "100%",
            height: 50,
            backgroundColor: outOfStock
              ? "var(--color-merch-muted)"
              : "var(--color-merch-red)",
            color: "var(--color-merch-on-dark)",
            fontSize: 16,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            border: "none",
            cursor: outOfStock ? "not-allowed" : "pointer",
            fontFamily: "inherit",
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
      </div>

      {/* ── Description ─────────────────────────────────────────────────── */}
      {description && (
        <>
          <div style={DIVIDER} />
          <p
            style={{
              fontSize: 14,
              color: "var(--color-merch-body)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {description}
          </p>
        </>
      )}
    </div>
  );
}
