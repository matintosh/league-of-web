"use client";

/**
 * ProductPageClient — client shell for /merch/product/[handle].
 * Wraps the gallery + purchase panel in MerchHeader + MerchFooter,
 * matching the shell pattern used by all other merch pages.
 * Holds cartOpen state and renders MerchCartDrawer.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MerchHeader,
  MerchFooter,
  MerchProductGallery,
  MerchProductInfoTabs,
  MerchPurchasePanel,
  MerchCartDrawer,
} from "@low/ui";
import type { MerchCartItem } from "@low/fixtures";

export interface ProductPageClientProps {
  /** Product title — displayed in the purchase panel. */
  title: string;
  /** Formatted price string, e.g. "$39.99". */
  price: string;
  /** Optional original/crossed-out price for sale items. */
  originalPrice?: string;
  /** Badge labels rendered by MerchPurchasePanel. */
  badges: string[];
  /** Full-text product description. */
  description: string;
  /** Breadcrumb trail for MerchPurchasePanel. */
  breadcrumb: string[];
  /** Size/variant options with availability flags. */
  variants: { label: string; available: boolean }[];
  /** Ordered list of gallery image URLs. */
  images: string[];
}

/** /merch/product/[handle] interactive page shell. */
export function ProductPageClient({
  title,
  price,
  originalPrice,
  badges,
  description,
  breadcrumb,
  variants,
  images,
}: ProductPageClientProps) {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems] = useState<MerchCartItem[]>([]);

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: "var(--color-merch-bg)",
        fontFamily: "var(--font-merch)",
      }}
    >
      <MerchHeader
        cartCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
        onSearchClick={() => router.push("/merch/search")}
        onCategoryClick={(slug) => {
          if (slug === "shop-all") router.push("/merch/shop-all");
        }}
      />

      <main className="flex-1" style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 32px", width: "100%" }}>
        <div
          style={{
            display: "flex",
            gap: 48,
            alignItems: "flex-start",
          }}
        >
          {/* Left: gallery — ~560px */}
          <div style={{ flex: "0 0 560px", maxWidth: 560 }}>
            <MerchProductGallery
              images={images}
              alt={title}
              selectedIndex={0}
            />
          </div>

          {/* Right: purchase panel — flex-1 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <MerchPurchasePanel
              title={title}
              price={price}
              originalPrice={originalPrice}
              badges={badges}
              description={description}
              breadcrumb={breadcrumb}
              variants={variants}
              variantLabel="Size"
              selectedVariant="M"
              quantity={1}
            />
            <MerchProductInfoTabs
              tabs={[
                {
                  id: "description",
                  label: "Description",
                  content: <p style={{ margin: 0 }}>{description}</p>,
                },
              ]}
              selectedTab="description"
            />
          </div>
        </div>

        <p
          style={{
            marginTop: 32,
            fontSize: 12,
            color: "var(--color-merch-muted)",
          }}
        >
          Demo route — static props. For interactive variant/qty/cart demo see{" "}
          <a
            href="/showcase/merch-purchase-panel"
            style={{ color: "var(--color-merch-red)" }}
          >
            /showcase/merch-purchase-panel
          </a>
          .
        </p>
      </main>

      <MerchFooter copyrightText="Copyright Riot Games 2025" />

      <MerchCartDrawer
        open={cartOpen}
        items={cartItems}
        subtotal="$0.00"
        onClose={() => setCartOpen(false)}
        onContinueShopping={() => setCartOpen(false)}
        onCheckout={() => router.push("/merch/cart")}
      />
    </div>
  );
}
