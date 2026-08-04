"use client";

/**
 * SalePageClient — client shell for /merch/sale.
 * Filters MERCH_PRODUCTS to sale items (badge === "Sale" or originalPrice present)
 * and renders a listing matching the real /category/sales/ page:
 *   breadcrumb "Home / Sales (N)" + Refine button → product grid on white.
 * No dark hero band — the real sale page has none.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MerchBreadcrumbBar,
  MerchHeader,
  MerchProductGrid,
  MerchProductCard,
  MerchFooter,
  MerchCartDrawer,
} from "@low/ui";
import type { MerchProduct, MerchCartItem } from "@low/fixtures";
import { useMerchNav } from "@/lib/merch-nav";

export interface SalePageClientProps {
  /** Products that have a Sale badge or originalPrice — provided by the server page. */
  products: MerchProduct[];
}

/** /merch/sale interactive page shell. */
export function SalePageClient({ products }: SalePageClientProps) {
  const router = useRouter();
  const handleNavSelect = useMerchNav();
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
        activeCategory="sale"
        cartCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
        onSearchClick={() => router.push("/merch/search")}
        onCategoryClick={handleNavSelect}
        onLogoClick={() => router.push("/merch")}
      />

      <main className="flex-1">
        {/* Breadcrumb + Refine row — matches real /category/sales/ header.
            No dark hero band; grid opens directly on white page background. */}
        <MerchBreadcrumbBar
          crumbs={[
            { label: "Home", onClick: () => router.push("/merch") },
            { label: "Sales" },
          ]}
          count={products.length}
          onRefineClick={() => undefined}
        />

        {products.length > 0 ? (
          <MerchProductGrid
            columns={2}
          >
            {products.map((product) => (
              <MerchProductCard
                key={product.slug}
                slug={product.slug}
                title={product.title}
                imageUrl={product.imageUrl}
                price={product.price}
                originalPrice={product.originalPrice}
                badge={product.badge}
                badges={product.badges}
                franchiseLabel={product.franchiseLabel}
                onClick={() => router.push(`/merch/product/${product.slug}`)}
              />
            ))}
          </MerchProductGrid>
        ) : (
          /* Faithful empty state — real merch.riotgames.com/sale shows a
             simple centered message when no sale items are available. */
          <div
            style={{
              maxWidth: "80rem",
              margin: "0 auto",
              padding: "80px 24px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontSize: "18px",
                color: "var(--color-merch-muted)",
                margin: 0,
              }}
            >
              No sale items are available right now. Check back soon!
            </p>
          </div>
        )}
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
