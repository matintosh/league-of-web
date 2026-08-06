"use client";

/**
 * CollectionPageClient — client shell for /merch/collection/[handle].
 * Holds interactive state: active sort, active filter, cart open/close,
 * and the LOAD MORE visible-count cursor (8 per page).
 * Receives the handle and fixture data from the server page.
 *
 * Header: white breadcrumb bar "Home / <Name>(N)" + inline red REFINE button,
 * matching the real /en-us/category/<h>/ and the Shop-All/Sale/PDP treatment (#655/#643/#654).
 * No dark MerchCollectionHero band. Count + REFINE appear once (in the bar).
 *
 * Pagination: renders 8 products on first load; each LOAD MORE click appends 8 more,
 * matching the real /en-us/category/apparel/ (8 per page; 138-item category with LOAD MORE).
 * The strip's vertical margins are tightened so the grid top lands closer to the real y≈247
 * (delta 5 from issue #867).
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

export interface CollectionPageClientProps {
  handle: string;
  heading: string;
  /**
   * Total item count for this category — shown as the breadcrumb count sup "(N)".
   * When omitted, falls back to products.length (fixture count).
   */
  totalCount?: number;
  products: MerchProduct[];
}

/** /merch/collection/[handle] interactive page shell. */
export function CollectionPageClient({
  handle,
  heading,
  totalCount,
  products,
}: CollectionPageClientProps) {
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
  // Breadcrumb count: real category total when provided, else fixture count.
  const displayCount = totalCount ?? products.length;

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
            Pattern mirrors Shop-All (#655), Sale (#643), and PDP (#654).
            Count uses totalCount to reflect real category depth (e.g. 138 for apparel). */}
        <MerchBreadcrumbBar
          crumbs={[
            { label: "Home", onClick: () => router.push("/merch") },
            { label: heading },
          ]}
          count={displayCount}
          onRefineClick={() => undefined}
        />

        {/* Filter/sort chip strip — logged user-decision, kept as-is (#655).
            Vertical margin tightened via negative margin-bottom to move grid top
            closer to real y≈247 (vs our y≈301 with 32px strip + margins). */}
        <div style={{ marginBottom: -8 }}>
          <MerchFilterSortBar
            productCount={displayCount}
            filterOptions={[...FILTER_OPTIONS]}
            activeFilter={activeFilter}
            activeSort={activeSort}
            onFilterChange={setActiveFilter}
            onSortChange={setActiveSort}
          />
        </div>

        {/* 2-col flush product grid — paginated at 8 per LOAD MORE click.
            Matches real /en-us/category/apparel/: 8 products first page, LOAD MORE
            at h=50, riotSans 16/600 uppercase ls 0.32, paging a 138-item category.
            No resultCount/onRefineClick (de-duped; count + REFINE live in the bar). */}
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
