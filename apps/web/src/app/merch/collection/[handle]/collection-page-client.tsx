"use client";

/**
 * CollectionPageClient — client shell for /merch/collection/[handle].
 * Holds interactive state: active sort, active filter, cart open/close.
 * Receives the handle and fixture data from the server page.
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

export interface CollectionPageClientProps {
  handle: string;
  heading: string;
  products: MerchProduct[];
}

/** /merch/collection/[handle] interactive page shell. */
export function CollectionPageClient({
  handle,
  heading,
  products,
}: CollectionPageClientProps) {
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems] = useState<MerchCartItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [activeSort, setActiveSort] = useState<MerchSortOption>("featured");

  const breadcrumbs = [
    { label: "Home", href: "/merch" },
    { label: "Collections", href: "/merch/collection" },
    { label: heading },
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
        activeCategory={handle}
        cartCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
      />

      <main className="flex-1">
        <MerchCollectionHero
          heading={heading.toUpperCase()}
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

        <MerchProductGrid columns={4}>
          {products.map((product) => (
            <MerchProductCard
              key={product.slug}
              slug={product.slug}
              title={product.title}
              imageUrl={product.imageUrl}
              price={product.price}
              originalPrice={product.originalPrice}
              badge={product.badge}
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
