"use client";

/**
 * ShopAllPageClient — client shell for /merch/shop-all.
 * Holds interactive state: active sort, active filter, cart open/close.
 * Receives all products from the server page.
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

const FILTER_OPTIONS = ["All", "New", "Sale", "Limited", "Out of Stock"] as const;

export interface ShopAllPageClientProps {
  products: MerchProduct[];
}

/** /merch/shop-all interactive page shell. */
export function ShopAllPageClient({ products }: ShopAllPageClientProps) {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems] = useState<MerchCartItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [activeSort, setActiveSort] = useState<MerchSortOption>("featured");

  const breadcrumbs = [
    { label: "Home", href: "/merch" },
    { label: "Shop All" },
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
        activeCategory="shop-all"
        cartCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
        onSearchClick={() => router.push("/merch/search")}
      />

      <main className="flex-1">
        <MerchCollectionHero
          heading="Shop All"
          itemCount={products.length}
          breadcrumbs={breadcrumbs}
          theme="dark"
        />

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
