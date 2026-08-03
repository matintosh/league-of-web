/**
 * MerchCartDrawer — slide-in cart panel from the right edge.
 *
 * Measured from merch.riotgames.com (~1280px desktop):
 *   Drawer: 400px wide, fixed right-0, full height, z-50
 *   Scrim: fixed full-screen, z-40, rgba(0,0,0,0.4) — compositing value, exempt from token rule
 *   Header: 56px tall, border-bottom 1px merch-border; "YOUR CART" 14px/700/uppercase/0.1em ls
 *   Line item: padding 16px 0, border-bottom; thumb 80×80, title 13px/500, variant 12px/muted
 *   Compact stepper: 28×28px cells, 12px, 1px border; minus disabled at qty=1
 *   Subtotal/footer: sticky bottom; checkout btn 52px red full-width
 *   Empty: center icon + "Your cart is empty" 15px muted + "Continue Shopping" red link
 *
 * Fully presentational — no internal useState.
 */
import React, { useId } from "react";
import type { MerchCartItem } from "@low/fixtures";

export type { MerchCartItem };

export interface MerchCartDrawerProps {
  /** Whether the drawer is currently open. */
  open: boolean;
  /** Line items in the cart. Empty array renders the empty state. */
  items: MerchCartItem[];
  /** Subtotal string, e.g. "$79.98". Computed by the page, not the component. */
  subtotal: string;
  /** Called when the close button or scrim is clicked. */
  onClose?: () => void;
  /** Called when a line item's qty stepper changes. */
  onQuantityChange?: (itemId: string, qty: number) => void;
  /** Called when the remove button is clicked for an item. */
  onRemoveItem?: (itemId: string) => void;
  /** Called when the checkout button is clicked. */
  onCheckout?: () => void;
  /** Called when "Continue Shopping" (empty state) is clicked. */
  onContinueShopping?: () => void;
}

/** Compact quantity stepper for cart line items (28×28). */
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

/**
 * MerchCartDrawer — slide-in cart panel.
 * Rendered at the page/layout level; visibility controlled by `open` prop.
 */
export function MerchCartDrawer({
  open,
  items,
  subtotal,
  onClose,
  onQuantityChange,
  onRemoveItem,
  onCheckout,
  onContinueShopping,
}: MerchCartDrawerProps) {
  const iconId = useId().replace(/:/g, "");
  const isEmpty = items.length === 0;

  return (
    <>
      {/* ── Scrim (compositing value — not a brand color) ──────────────── */}
      {open && (
        <div
          aria-hidden="true"
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        />
      )}

      {/* ── Drawer ──────────────────────────────────────────────────────── */}
      <aside
        aria-label="Cart"
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: 400,
          zIndex: 50,
          backgroundColor: "var(--color-merch-bg)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--font-merch)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 250ms ease",
        }}
      >
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div
          style={{
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            borderBottom: "1px solid var(--color-merch-border)",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "var(--color-merch-ink)",
            }}
          >
            Your Cart
          </span>
          <button
            type="button"
            aria-label="Close cart"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              fontSize: 20,
              color: "var(--color-merch-ink)",
              lineHeight: 1,
              fontFamily: "inherit",
            }}
          >
            ×
          </button>
        </div>

        {/* ── Items area ────────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 20px",
          }}
        >
          {isEmpty ? (
            /* ── Empty state ──────────────────────────────────────────── */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
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
            /* ── Line items ───────────────────────────────────────────── */
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {items.map((item) => (
                <li
                  key={item.id}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "16px 0",
                    borderBottom: "1px solid var(--color-merch-border)",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: 80,
                      height: 80,
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

                  {/* Details */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 8,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--color-merch-ink)",
                          margin: 0,
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </p>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--color-merch-ink)",
                          flexShrink: 0,
                        }}
                      >
                        {item.unitPrice}
                      </span>
                    </div>
                    {item.variantLabel && (
                      <p
                        style={{
                          fontSize: 12,
                          color: "var(--color-merch-muted)",
                          margin: "2px 0 0",
                        }}
                      >
                        {item.variantLabel}
                      </p>
                    )}
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
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
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: 11,
                          color: "var(--color-merch-muted)",
                          padding: 0,
                          fontFamily: "inherit",
                          textDecoration: "underline",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Sticky footer (only when items present) ─────────────────── */}
        {!isEmpty && (
          <div
            style={{
              flexShrink: 0,
              padding: "16px 20px",
              borderTop: "1px solid var(--color-merch-border)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-merch-ink)",
                }}
              >
                Subtotal
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--color-merch-ink)",
                }}
              >
                {subtotal}
              </span>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--color-merch-muted)",
                margin: "0 0 16px",
              }}
            >
              Shipping calculated at checkout
            </p>
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
          </div>
        )}
      </aside>
    </>
  );
}
