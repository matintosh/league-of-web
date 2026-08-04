"use client";

/**
 * CollectionPageClient — client shell for /merch/collection/[handle].
 * Holds interactive state: active sort, active filter, cart open/close.
 * Receives the handle and fixture data from the server page.
 *
 * Header: white breadcrumb bar "Home / <Name> (N)" + inline red REFINE button,
 * matching the real /en-us/category/<h>/ and the Shop-All/Sale/PDP treatment (#655/#643/#654).
 * No dark MerchCollectionHero band. Count + REFINE appear once (in the bar).
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMerchNav } from "@/lib/merch-nav";
import {
  MerchBreadcrumbBar,
  MerchHeader,
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
  const handleNavSelect = useMerchNav();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems] = useState<MerchCartItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [activeSort, setActiveSort] = useState<MerchSortOption>("featured");

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
        onSearchClick={() => router.push("/merch/search")}
        onCategoryClick={handleNavSelect}
        onLogoClick={() => router.push("/merch")}
      />

      <main className="flex-1">
        {/* Breadcrumb + Refine row — matches real /en-us/category/<h>/ header.
            No dark hero band; grid opens directly on white page background.
            Pattern mirrors Shop-All (#655), Sale (#643), and PDP (#654). */}
        <MerchBreadcrumbBar
          crumbs={[
            { label: "Home", onClick: () => router.push("/merch") },
            { label: heading },
          ]}
          count={products.length}
          onRefineClick={() => undefined}
        />

        {/* Filter/sort chip strip — logged user-decision, kept as-is (#655). */}
        <MerchFilterSortBar
          productCount={products.length}
          filterOptions={[...FILTER_OPTIONS]}
          activeFilter={activeFilter}
          activeSort={activeSort}
          onFilterChange={setActiveFilter}
          onSortChange={setActiveSort}
        />

        {/* 2-col flush product grid — no resultCount/onRefineClick (de-duped;
            count + REFINE are now in the breadcrumb bar above). */}
        <MerchProductGrid columns={2}>
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
