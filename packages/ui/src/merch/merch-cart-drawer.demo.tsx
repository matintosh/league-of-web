"use client";

import { useState } from "react";
import { championSplashUrl } from "@low/fixtures";
import type { MerchCartItem } from "@low/fixtures";
import { MerchCartDrawer } from "./merch-cart-drawer";

const INITIAL_ITEMS: MerchCartItem[] = [
  {
    id: "item-1",
    title: "MSI 2026 Tee",
    imageUrl: championSplashUrl("Jinx", 0),
    variantLabel: "Size: M",
    unitPrice: "$39.99",
    quantity: 1,
  },
  {
    id: "item-2",
    title: "MSI 2026 Bomber Jacket",
    imageUrl: championSplashUrl("Vi", 0),
    variantLabel: "Size: S",
    unitPrice: "$129.99",
    quantity: 1,
  },
];

function calcSubtotal(items: MerchCartItem[]): string {
  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.unitPrice.replace(/[^0-9.]/g, ""));
    return sum + price * item.quantity;
  }, 0);
  return `$${total.toFixed(2)}`;
}

/** Interactive cart drawer demo — open/close, qty changes, remove items. */
export function MerchCartDrawerDemo() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MerchCartItem[]>(INITIAL_ITEMS);

  function handleQtyChange(itemId: string, qty: number) {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, quantity: Math.max(1, qty) } : it))
    );
  }

  function handleRemove(itemId: string) {
    setItems((prev) => prev.filter((it) => it.id !== itemId));
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          padding: "10px 24px",
          backgroundColor: "var(--color-merch-red)",
          color: "var(--color-merch-on-dark)",
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontFamily: "inherit",
        }}
      >
        Open Cart ({items.length} item{items.length !== 1 ? "s" : ""})
      </button>
      <MerchCartDrawer
        open={open}
        items={items}
        subtotal={calcSubtotal(items)}
        onClose={() => setOpen(false)}
        onQuantityChange={handleQtyChange}
        onRemoveItem={handleRemove}
        onCheckout={() => alert("Proceeding to checkout!")}
        onContinueShopping={() => setOpen(false)}
      />
    </div>
  );
}
