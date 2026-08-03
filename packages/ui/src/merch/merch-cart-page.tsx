"use client";

/**
 * MerchCartPage — full-page cart layout for the Riot merch store.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client — IGNORE Hextech-only / no-default-palette
 * guidance; still tokens-only (no raw hex outside packages/tokens; NO hex
 * fallbacks in var(); NO bare hex like #ffffff — use --color-merch-on-dark),
 * presentational (props in/callbacks out; NO fetching in @low/ui; types from
 * @low/fixtures — reuse MerchCartItem), showcase server-safe (no 'use client'),
 * SVG ids from useId.
 *
 * Measured from merch.riotgames.com cart page conventions (~1280px desktop):
 *   Heading bar: "YOUR CART" 20px/700/uppercase/ls 0.1em, ink; 24px top / 20px bottom
 *     padding; border-bottom 1px merch-border; max-w-7xl mx-auto px-6
 *   Two-column layout: left flex-1 (~65%), right 380px, gap 48px; lg:flex-row
 *   Left — line items table:
 *     Column headers (PRODUCT / QTY / PRICE): 11px uppercase muted, hidden on mobile
 *     Each item row: border-bottom 1px merch-border, py-20px; thumb 96×96 merch-surface
 *       Title: 14px/500 ink; Variant: 12px muted mt-4px
 *       CompactStepper: 28×28px cells, 12px, 1px border (local copy, not from drawer)
 *       Price: 14px/600 ink, right-aligned
 *       Remove link: 11px muted underline below stepper
 *   Right — Order Summary card:
 *     bg merch-surface, p-24px, border 1px merch-border
 *     "Order Summary": 14px/700 uppercase ls 0.08em ink, mb-16px
 *     Rows: Subtotal / Shipping / Estimated Tax / Total (with divider before Total)
 *     Total row: 16px/700 ink
 *     Promo input: h-44px + "Apply" button h-44px merch-red; 1px merch-border
 *     Checkout button: h-52px full-width merch-red uppercase 14px/700 ls 0.1em
 *     "Continue Shopping" link: 13px merch-red centered mt-12px
 *   Empty state: centered bag icon + "Your cart is empty" 15px muted + "Continue Shopping" red link
 *   Responsive: <768px single column; lg:flex-row
 */

import { useId } from "react";
import type { MerchCartItem } from "@low/fixtures";

export type { MerchCartItem };

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface MerchCartPageProps {
  /** Line items in the cart. Empty array renders the empty state. */
  items: MerchCartItem[];
  /** Subtotal string, e.g. "$79.98". Computed by the page. */
  subtotal: string;
  /** Estimated tax string, e.g. "$6.40". Omit to show "—". */
  estimatedTax?: string;
  /** Shipping line, e.g. "Free" or "Calculated at checkout". */
  shipping?: string;
  /** Total string including tax + shipping, e.g. "$86.38". */
  total?: string;
  /** Active promo code string (controlled). */
  promoCode?: string;
  /** Called when promo code input changes. */
  onPromoCodeChange?: (code: string) => void;
  /** Called when "Apply" promo button is clicked. */
  onApplyPromo?: () => void;
  /** Called when a line item qty changes. */
  onQuantityChange?: (itemId: string, qty: number) => void;
  /** Called when a line item is removed. */
  onRemoveItem?: (itemId: string) => void;
  /** Called when "Proceed to Checkout" is clicked. */
  onCheckout?: () => void;
  /** Called when "Continue Shopping" is clicked. */
  onContinueShopping?: () => void;
}

// ---------------------------------------------------------------------------
// Sub-components (local — do NOT import from merch-cart-drawer)
// ---------------------------------------------------------------------------

/**
 * CompactStepper — 28×28 quantity stepper for cart line items.
 * Local copy so MerchCartPage has no coupling to MerchCartDrawer.
 */
function CompactStepper({
  itemId,
  quantity,
  onQuantityChange,
}: {
  itemId: string;
  quantity: number;
  onQuantityChange?: (itemId: string, qty: number) => void;
}) {
  const cellStyle = (disabled?: boolean): React.CSSProperties => ({
    width: 28,
    height: 28,
    border: "1px solid var(--color-merch-border)",
    backgroundColor: "var(--color-merch-bg)",
    color: disabled ? "var(--color-merch-muted)" : "var(--color-merch-ink)",
    fontSize: 12,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "inherit",
    opacity: disabled ? 0.4 : 1,
    flexShrink: 0,
  });

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={quantity <= 1}
        onClick={() => onQuantityChange?.(itemId, Math.max(1, quantity - 1))}
        style={cellStyle(quantity <= 1)}
      >
        −
      </button>
      <div
        style={{
          ...cellStyle(),
          borderLeft: "none",
          borderRight: "none",
          cursor: "default",
          userSelect: "none",
        }}
      >
        {quantity}
      </div>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onQuantityChange?.(itemId, quantity + 1)}
        style={cellStyle()}
      >
        +
      </button>
    </div>
  );
}

/** Shopping bag icon SVG for the empty state. */
function BagIcon({ id }: { id: string }) {
  return (
    <svg
      aria-hidden="true"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect width="64" height="64" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        <rect
          x="10"
          y="22"
          width="44"
          height="34"
          rx="2"
          stroke="var(--color-merch-muted)"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M22 22v-6a10 10 0 0 1 20 0v6"
          stroke="var(--color-merch-muted)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

/**
 * MerchCartPage — full-page cart with two-column desktop layout.
 * Left column: line items. Right column: order summary + checkout.
 * Collapses to single column on mobile (<768px / lg breakpoint).
 *
 * @example
 * <MerchCartPage
 *   items={cartItems}
 *   subtotal="$79.98"
 *   shipping="Free"
 *   estimatedTax="$6.40"
 *   total="$86.38"
 *   onQuantityChange={(id, qty) => update(id, qty)}
 *   onRemoveItem={(id) => remove(id)}
 *   onCheckout={() => router.push("/checkout")}
 * />
 */
export function MerchCartPage({
  items,
  subtotal,
  estimatedTax,
  shipping = "Calculated at checkout",
  total,
  promoCode = "",
  onPromoCodeChange,
  onApplyPromo,
  onQuantityChange,
  onRemoveItem,
  onCheckout,
  onContinueShopping,
}: MerchCartPageProps) {
  const iconId = useId().replace(/:/g, "");
  const isEmpty = items.length === 0;

  return (
    <div
      style={{
        backgroundColor: "var(--color-merch-bg)",
        fontFamily: "var(--font-merch)",
        flex: 1,
      }}
    >
      {/* ── Page heading bar ─────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: "1px solid var(--color-merch-border)",
        }}
      >
        <div
          style={{
            maxWidth: "80rem",
            margin: "0 auto",
            padding: "24px 24px 20px",
          }}
        >
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-merch-ink)",
              margin: 0,
            }}
          >
            Your Cart
          </h1>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "32px 24px 64px",
        }}
      >
        {isEmpty ? (
          /* ── Empty state ────────────────────────────────────────────── */
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 0",
              gap: 16,
              textAlign: "center",
            }}
          >
            <BagIcon id={iconId} />
            <p
              style={{
                fontSize: 15,
                color: "var(--color-merch-muted)",
                margin: 0,
              }}
            >
              Your cart is empty
            </p>
            <button
              type="button"
              onClick={onContinueShopping}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-merch-red)",
                fontFamily: "inherit",
                padding: 0,
                textDecoration: "underline",
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* ── Two-column layout ──────────────────────────────────────── */
          <div className="flex flex-col lg:flex-row items-start gap-12">
            {/* ── LEFT: Line items ────────────────────────────────── */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Column headers (hidden on mobile) */}
              <div
                className="hidden lg:grid"
                style={{
                  gridTemplateColumns: "1fr auto auto",
                  gap: "0 16px",
                  paddingBottom: 12,
                  borderBottom: "1px solid var(--color-merch-border)",
                  marginBottom: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--color-merch-muted)",
                  }}
                >
                  Product
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--color-merch-muted)",
                    textAlign: "center",
                    width: 84,
                  }}
                >
                  Qty
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--color-merch-muted)",
                    textAlign: "right",
                    width: 72,
                  }}
                >
                  Price
                </span>
              </div>

              {/* Line items */}
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {items.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      display: "flex",
                      gap: 16,
                      padding: "20px 0",
                      borderBottom: "1px solid var(--color-merch-border)",
                    }}
                  >
                    {/* Thumbnail */}
                    <div
                      style={{
                        width: 96,
                        height: 96,
                        flexShrink: 0,
                        overflow: "hidden",
                        backgroundColor: "var(--color-merch-surface)",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        loading="lazy"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>

                    {/* Details — flex-1 */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "var(--color-merch-ink)",
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </p>
                      {item.variantLabel && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "var(--color-merch-muted)",
                            margin: "4px 0 0",
                          }}
                        >
                          {item.variantLabel}
                        </p>
                      )}
                      <div style={{ marginTop: 8 }}>
                        <CompactStepper
                          itemId={item.id}
                          quantity={item.quantity}
                          onQuantityChange={onQuantityChange}
                        />
                        <button
                          type="button"
                          aria-label={`Remove ${item.title} from cart`}
                          onClick={() => onRemoveItem?.(item.id)}
                          style={{
                            display: "block",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 11,
                            color: "var(--color-merch-muted)",
                            padding: "4px 0 0",
                            fontFamily: "inherit",
                            textDecoration: "underline",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Price — right-aligned */}
                    <div
                      style={{
                        flexShrink: 0,
                        width: 72,
                        textAlign: "right",
                        paddingTop: 2,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--color-merch-ink)",
                        }}
                      >
                        {item.unitPrice}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── RIGHT: Order Summary ─────────────────────────────── */}
            <div
              style={{
                width: "100%",
                maxWidth: 380,
                flexShrink: 0,
                backgroundColor: "var(--color-merch-surface)",
                border: "1px solid var(--color-merch-border)",
                padding: 24,
              }}
            >
              {/* Heading */}
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--color-merch-ink)",
                  margin: "0 0 16px",
                }}
              >
                Order Summary
              </p>

              {/* Summary rows */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Subtotal */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 13, color: "var(--color-merch-body)" }}
                  >
                    Subtotal
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--color-merch-ink)",
                    }}
                  >
                    {subtotal}
                  </span>
                </div>

                {/* Shipping */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 13, color: "var(--color-merch-body)" }}
                  >
                    Shipping
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--color-merch-ink)",
                    }}
                  >
                    {shipping}
                  </span>
                </div>

                {/* Estimated Tax */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{ fontSize: 13, color: "var(--color-merch-body)" }}
                  >
                    Estimated Tax
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--color-merch-ink)",
                    }}
                  >
                    {estimatedTax ?? "—"}
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  margin: "16px 0",
                  height: 1,
                  backgroundColor: "var(--color-merch-border)",
                }}
              />

              {/* Total */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--color-merch-ink)",
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--color-merch-ink)",
                  }}
                >
                  {total ?? subtotal}
                </span>
              </div>

              {/* Promo code */}
              <div
                style={{
                  display: "flex",
                  gap: 0,
                  marginBottom: 16,
                }}
              >
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => onPromoCodeChange?.(e.target.value)}
                  aria-label="Promo code"
                  style={{
                    flex: 1,
                    height: 44,
                    padding: "0 12px",
                    border: "1px solid var(--color-merch-border)",
                    borderRight: "none",
                    backgroundColor: "var(--color-merch-bg)",
                    fontSize: 13,
                    color: "var(--color-merch-ink)",
                    fontFamily: "inherit",
                    outline: "none",
                    minWidth: 0,
                  }}
                />
                <button
                  type="button"
                  onClick={onApplyPromo}
                  style={{
                    height: 44,
                    padding: "0 16px",
                    backgroundColor: "var(--color-merch-red)",
                    color: "var(--color-merch-on-dark)",
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    flexShrink: 0,
                    transition: "background-color 150ms ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "var(--color-merch-red-dark)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "var(--color-merch-red)";
                  }}
                >
                  Apply
                </button>
              </div>

              {/* Checkout button */}
              <button
                type="button"
                onClick={onCheckout}
                style={{
                  display: "block",
                  width: "100%",
                  height: 52,
                  backgroundColor: "var(--color-merch-red)",
                  color: "var(--color-merch-on-dark)",
                  fontSize: 14,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "background-color 150ms ease",
                  marginBottom: 12,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--color-merch-red-dark)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                    "var(--color-merch-red)";
                }}
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <div style={{ textAlign: "center" }}>
                <button
                  type="button"
                  onClick={onContinueShopping}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 13,
                    color: "var(--color-merch-red)",
                    fontFamily: "inherit",
                    padding: 0,
                    textDecoration: "underline",
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
