"use client";

import { useState } from "react";
import { MerchPurchasePanel } from "./merch-purchase-panel";

const SIZES = [
  { label: "XS", available: true },
  { label: "S", available: true },
  { label: "M", available: true },
  { label: "L", available: false },
  { label: "XL", available: true },
  { label: "XXL", available: false },
];

/** Interactive demo — variant selection + qty stepper + Add to Cart alert. */
export function MerchPurchasePanelDemo() {
  const [variant, setVariant] = useState("M");
  const [qty, setQty] = useState(1);

  return (
    <div style={{ maxWidth: 560, padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <MerchPurchasePanel
        breadcrumb={["Home", "Tops", "MSI 2026 Tee"]}
        title="MSI 2026 Tee — Interactive Demo"
        price="$39.99"
        badges={["New"]}
        variants={SIZES}
        variantLabel="Size"
        selectedVariant={variant}
        onVariantChange={setVariant}
        quantity={qty}
        onQuantityChange={setQty}
        onAddToCart={() => alert(`Added to cart: Size ${variant} × ${qty}`)}
        description="Click a size chip, adjust quantity, then Add to Cart."
      />
    </div>
  );
}
