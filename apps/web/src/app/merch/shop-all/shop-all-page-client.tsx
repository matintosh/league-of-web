"use client";

/**
 * ShopAllPageClient — client shell for /merch/shop-all.
 * Holds interactive state: active sort, active filter, cart open/close,
 * and the LOAD MORE visible-count cursor (8 per page).
 * Receives all products from the server page.
 *
 * Header: white breadcrumb bar "Home / Shop All (N)" + inline red REFINE button,
 * matching the real /en-us/shop-all/ and the Sale/PDP treatment (#643/#654).
 * No dark MerchCollectionHero band. Count + REFINE appear once (in the bar).
 *
 * Pagination: renders 8 products on first load; each LOAD MORE click appends 8 more,
 * matching the real /en-us/shop-all/ (8 per page; LOAD MORE at y≈1710 @1280).
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

/** Products shown per page on initial load and per LOAD MORE click. */
const PAGE_SIZE = 8;

export interface ShopAllPageClientProps {
  products: MerchProduct[];
}

/** /merch/shop-all interactive page shell. */
export function ShopAllPageClient({ products }: ShopAllPageClientProps) {
  const router = useRouter();
  const handleNavSelect = useMerchNav();
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems] = useState<MerchCartItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [activeSort, setActiveSort] = useState<MerchSortOption>("featured");
  // Visible-count cursor — starts at PAGE_SIZE (8), grows by PAGE_SIZE on each click.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

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
        onCategoryClick={handleNavSelect}
        onLogoClick={() => router.push("/merch")}
      />

      <main className="flex-1">
        {/* Breadcrumb + Refine row — matches real /en-us/shop-all/ header.
            No dark hero band; grid opens directly on white page background.
            Pattern mirrors the Sale page (#643) and PDP (#654). */}
        <MerchBreadcrumbBar
          crumbs={[
            { label: "Home", onClick: () => router.push("/merch") },
            { label: "Shop All" },
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

        {/* 2-col flush product grid — paginated at 8 per LOAD MORE click.
            Matches real /en-us/shop-all/: 8 products first page, LOAD MORE
            at y≈1710 / docHeight≈2608 @1280. No resultCount/onRefineClick
            (de-duped; count + REFINE live in the breadcrumb bar above). */}
        <MerchProductGrid
          columns={2}
          showLoadMore={hasMore}
          onLoadMore={() => setVisibleCount((n) => n + PAGE_SIZE)}
        >
          {visibleProducts.map((product) => (
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
