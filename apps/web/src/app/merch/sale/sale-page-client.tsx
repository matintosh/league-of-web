"use client";

/**
 * SalePageClient — client shell for /merch/sale.
 * Filters MERCH_PRODUCTS to sale items (badge === "Sale" or originalPrice present)
 * and renders a collection listing matching the shop-all template:
 *   MerchCollectionHero → MerchFilterSortBar → MerchProductGrid → MerchFooter.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MerchHeader,
  MerchCollectionHero,
  MerchFilterSortBar,
  MerchProductGrid,
  MerchProductCard,
  MerchFooter,
  MerchCartDrawer,
} from "@low/ui";
import type { MerchSortOption } from "@low/ui";
import type { MerchProduct, MerchCartItem } from "@low/fixtures";
import { useMerchNav } from "@/lib/merch-nav";

const FILTER_OPTIONS = ["All", "New", "Sale", "Limited", "Out of Stock"] as const;

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
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [activeSort, setActiveSort] = useState<MerchSortOption>("featured");

  const breadcrumbs = [
    { label: "Home", href: "/merch" },
    { label: "Sale" },
  ];

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
        <MerchCollectionHero
          heading="Sale"
          itemCount={products.length}
          breadcrumbs={breadcrumbs}
          theme="dark"
        />

        {products.length > 0 ? (
          <>
            <MerchFilterSortBar
              productCount={products.length}
              filterOptions={[...FILTER_OPTIONS]}
              activeFilter={activeFilter}
              activeSort={activeSort}
              onFilterChange={setActiveFilter}
              onSortChange={setActiveSort}
            />

            <MerchProductGrid
              columns={2}
              resultCount={products.length}
              onRefineClick={() => {}}
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
          </>
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
