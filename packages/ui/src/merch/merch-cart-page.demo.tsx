"use client";

/**
 * MerchCartPageDemo — stateful client wrapper for the showcase.
 * Wires quantity changes, item removal, promo code, and checkout callbacks
 * with useState so the demo is interactive in the showcase.
 */

import { useState } from "react";
import { championSplashUrl } from "@low/fixtures";
import type { MerchCartItem } from "@low/fixtures";
import { MerchCartPage } from "./merch-cart-page";

const INITIAL_ITEMS: MerchCartItem[] = [
  {
    id: "item-1",
    title: "Arcane Vi Graphic Hoodie",
    imageUrl: championSplashUrl("Vi", 0),
    variantLabel: "Size: M / Color: Black",
    unitPrice: "$39.99",
    quantity: 1,
  },
  {
    id: "item-2",
    title: "Riftbound Origins Champion Deck - Jinx",
    imageUrl: championSplashUrl("Jinx", 0),
    unitPrice: "$24.99",
    quantity: 2,
  },
  {
    id: "item-3",
    title: "PROJECT: Lux Collector's Art Print (18×24)",
    imageUrl: championSplashUrl("Lux", 0),
    variantLabel: "Size: 18×24 in",
    unitPrice: "$34.99",
    quantity: 1,
  },
];

/** Parse "$X.XX" → cents, format cents → "$X.XX". */
function parseCents(price: string): number {
  return Math.round(parseFloat(price.replace("$", "")) * 100);
}

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function computeSubtotal(items: MerchCartItem[]): string {
  const total = items.reduce(
    (sum, item) => sum + parseCents(item.unitPrice) * item.quantity,
    0,
  );
  return formatCents(total);
}

/** Interactive demo that wires cart state changes. */
export function MerchCartPageDemo() {
  const [items, setItems] = useState<MerchCartItem[]>(INITIAL_ITEMS);
  const [promoCode, setPromoCode] = useState("");
  const [lastAction, setLastAction] = useState<string>("");

  function handleQuantityChange(itemId: string, qty: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, qty) } : item,
      ),
    );
    setLastAction(`Qty updated for ${itemId} → ${qty}`);
  }

  function handleRemoveItem(itemId: string) {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    setLastAction(`Removed item ${itemId}`);
  }

  function handleCheckout() {
    setLastAction("Checkout clicked");
  }

  function handleContinueShopping() {
    if (items.length === 0) {
      setItems(INITIAL_ITEMS);
    }
    setLastAction("Continue Shopping clicked");
  }

  function handleApplyPromo() {
    setLastAction(`Promo "${promoCode}" applied`);
  }

  const subtotal = computeSubtotal(items);

  return (
    <div style={{ fontFamily: "var(--font-merch)" }}>
      <MerchCartPage
        items={items}
        subtotal={subtotal}
        shipping="Free"
        estimatedTax="$10.00"
        total={formatCents(parseCents(subtotal) + 1000)}
        promoCode={promoCode}
        onPromoCodeChange={setPromoCode}
        onApplyPromo={handleApplyPromo}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        onContinueShopping={handleContinueShopping}
      />
      {lastAction && (
        <div
          style={{
            padding: "8px 24px",
            fontSize: 11,
            color: "var(--color-merch-muted)",
            backgroundColor: "var(--color-merch-surface)",
            borderTop: "1px solid var(--color-merch-border)",
          }}
        >
          Action: {lastAction}
        </div>
      )}
    </div>
  );
}
