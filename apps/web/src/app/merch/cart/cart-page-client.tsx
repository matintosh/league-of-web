"use client";

/**
 * CartPageClient — client shell for /merch/cart.
 * Holds interactive cart state: quantities, removals, promo code.
 * Receives initial items from the server page.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MerchHeader,
  MerchFooter,
  MerchCartPage,
  MerchCartDrawer,
} from "@low/ui";
import type { MerchCartItem } from "@low/fixtures";

export interface CartPageClientProps {
  initialItems: MerchCartItem[];
}

/** Parse "$X.XX" → cents. */
function parseCents(price: string): number {
  return Math.round(parseFloat(price.replace("$", "")) * 100);
}

/** Format cents → "$X.XX". */
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

/** /merch/cart interactive page shell. */
export function CartPageClient({ initialItems }: CartPageClientProps) {
  const router = useRouter();
  const [items, setItems] = useState<MerchCartItem[]>(initialItems);
  const [promoCode, setPromoCode] = useState("");
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  function handleQuantityChange(itemId: string, qty: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, qty) } : item,
      ),
    );
  }

  function handleRemoveItem(itemId: string) {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  const subtotal = computeSubtotal(items);
  // For demo purposes: estimate tax at ~8%, then add to get total
  const taxCents = Math.round(parseCents(subtotal) * 0.08);
  const estimatedTax = items.length > 0 ? formatCents(taxCents) : undefined;
  const total =
    items.length > 0
      ? formatCents(parseCents(subtotal) + taxCents)
      : undefined;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: "var(--color-merch-bg)",
        fontFamily: "var(--font-merch)",
      }}
    >
      <MerchHeader
        cartCount={items.length}
        onCartClick={() => setCartDrawerOpen(true)}
      />

      <main className="flex-1">
        <MerchCartPage
          items={items}
          subtotal={subtotal}
          shipping={items.length > 0 ? "Free" : "Calculated at checkout"}
          estimatedTax={estimatedTax}
          total={total}
          promoCode={promoCode}
          onPromoCodeChange={setPromoCode}
          onApplyPromo={() => {/* promo applied — presentational */}}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveItem}
          onCheckout={() => {/* checkout — presentational no-op */}}
          onContinueShopping={() => router.push("/merch/shop-all")}
        />
      </main>

      <MerchFooter copyrightText="Copyright Riot Games 2025" />

      {/* Header cart drawer (still accessible from cart page) */}
      <MerchCartDrawer
        open={cartDrawerOpen}
        items={items}
        subtotal={subtotal}
        onClose={() => setCartDrawerOpen(false)}
        onQuantityChange={handleQuantityChange}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setCartDrawerOpen(false);
        }}
        onContinueShopping={() => {
          setCartDrawerOpen(false);
          router.push("/merch/shop-all");
        }}
      />
    </div>
  );
}
