"use client";

/**
 * SearchPageClient — interactive shell for /merch/search.
 * Holds client-side state: query, sort, filter, cart, and reactive product
 * filtering. Receives allProducts and the server-resolved initial state.
 */

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMerchNav } from "@/lib/merch-nav";
import {
  MerchHeader,
  MerchSearchBar,
  MerchSearchHero,
  MerchFilterSortBar,
  MerchProductGrid,
  MerchProductCard,
  MerchFooter,
  MerchCartDrawer,
} from "@low/ui";
import type { MerchSortOption } from "@low/ui";
import type { MerchProduct, MerchCartItem } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FILTER_OPTIONS = ["All", "New", "Sale", "Limited", "Out of Stock"] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Filter products by query string (case-insensitive title match). */
function filterByQuery(products: MerchProduct[], query: string): MerchProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => p.title.toLowerCase().includes(q));
}

/** Filter products by badge filter option. */
function filterByBadge(products: MerchProduct[], filter: string): MerchProduct[] {
  if (filter === "All") return products;
  return products.filter((p) => p.badge === filter);
}

/** Sort products by a given sort option. */
function sortProducts(products: MerchProduct[], sort: MerchSortOption): MerchProduct[] {
  const copy = [...products];
  switch (sort) {
    case "price-asc":
      return copy.sort(
        (a, b) => parseFloat(a.price.replace("$", "")) - parseFloat(b.price.replace("$", ""))
      );
    case "price-desc":
      return copy.sort(
        (a, b) => parseFloat(b.price.replace("$", "")) - parseFloat(a.price.replace("$", ""))
      );
    case "newest":
      // In fixture data, "New" badge items first
      return copy.sort((a, b) => (a.badge === "New" ? -1 : b.badge === "New" ? 1 : 0));
    case "alpha-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "alpha-desc":
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    case "featured":
    default:
      return copy;
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SearchPageClientProps {
  /** Full product fixture array. */
  allProducts: MerchProduct[];
  /** Server-resolved initial query string from ?q=. */
  initialQuery: string;
  /** Server-resolved initial results (filtered from allProducts by initialQuery). */
  initialResults: MerchProduct[];
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/** /merch/search interactive page shell. */
export function SearchPageClient({
  allProducts,
  initialQuery,
  initialResults,
}: SearchPageClientProps) {
  const router = useRouter();
  const handleNavSelect = useMerchNav();

  const searchBarRef = useRef<HTMLDivElement>(null);

  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems] = useState<MerchCartItem[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [activeSort, setActiveSort] = useState<MerchSortOption>("featured");
  // searchActive: true once the user clicks "SEARCH PRODUCTS" from the hero.
  // Reveals the search-bar + results pane without needing a URL query term yet.
  const [searchActive, setSearchActive] = useState(false);

  // Gate: show results UI when a query is present OR user clicked into search
  const hasQuery = query.trim().length > 0 || searchActive;

  // Derive visible products from current query + filter + sort
  const queryFiltered = filterByQuery(allProducts, query);
  const badgeFiltered = filterByBadge(queryFiltered, activeFilter);
  const results = sortProducts(badgeFiltered, activeSort);
  const hasResults = results.length > 0;

  /** Navigate to the search page with the new query in the URL. */
  const handleSearch = useCallback(
    (q: string) => {
      const trimmed = q.trim();
      setQuery(trimmed);
      setActiveFilter("All");
      router.push(`/merch/search?q=${encodeURIComponent(trimmed)}`);
    },
    [router]
  );

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{
        backgroundColor: "var(--color-merch-bg)",
        fontFamily: "var(--font-merch)",
      }}
    >
      <MerchHeader
        activeCategory="search"
        cartCount={cartItems.length}
        onCartClick={() => setCartOpen(true)}
        onSearchClick={() => {
          // Already on the search page — focus is handled by the search bar below
        }}
        onCategoryClick={handleNavSelect}
        onLogoClick={() => router.push("/merch")}
      />

      <main className="flex-1">
        {hasQuery ? (
          <>
            {/* ---------------------------------------------------------------- */}
            {/* Search input band — only shown when a query is active            */}
            {/* ---------------------------------------------------------------- */}
            <div ref={searchBarRef}>
              <MerchSearchBar
                query={query}
                resultCount={results.length}
                onQueryChange={setQuery}
                onSearch={handleSearch}
              />
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Results header                                                    */}
            {/* ---------------------------------------------------------------- */}
            <div
              style={{
                maxWidth: "80rem",
                margin: "0 auto",
                padding: "16px 24px 0",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--color-merch-muted)",
                  margin: 0,
                }}
              >
                {`${results.length} ${results.length === 1 ? "result" : "results"} for "${query}"`}
              </p>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Filter/sort bar — hidden when there are no results               */}
            {/* ---------------------------------------------------------------- */}
            {hasResults && (
              <MerchFilterSortBar
                productCount={results.length}
                filterOptions={[...FILTER_OPTIONS]}
                activeFilter={activeFilter}
                activeSort={activeSort}
                onFilterChange={setActiveFilter}
                onSortChange={setActiveSort}
              />
            )}

            {/* ---------------------------------------------------------------- */}
            {/* Product grid — empty state handled via emptyMessage prop         */}
            {/* ---------------------------------------------------------------- */}
            <MerchProductGrid
              columns={2}
              resultCount={results.length}
              onRefineClick={() => {}}
              emptyMessage={`No results for "${query}". Try a different search.`}
            >
              {results.map((product) => (
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
          /* ---------------------------------------------------------------- */
          /* No-query hero — "NO SEARCH TERM PROVIDED" + purple CTA           */
          /* Shown when the URL has no ?q= (or ?q= is empty/whitespace).      */
          /* ---------------------------------------------------------------- */
          <MerchSearchHero
            onSearchClick={() => {
              // Reveal the search bar and scroll to it so the user can type
              setSearchActive(true);
              // Scroll the newly-mounted search bar into view on the next tick
              setTimeout(() => {
                searchBarRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 50);
            }}
          />
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
