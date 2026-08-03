import { MERCH_PRODUCTS } from "@low/fixtures";
import type { MerchProduct } from "@low/fixtures";
import { SearchPageClient } from "./search-page-client";

/**
 * /merch/search — search results page.
 * Server component shell: reads the ?q= search param, filters the static
 * product fixture list, and passes results to the interactive client component.
 *
 * Merch tokens (--color-merch-*) are loaded by the /merch layout.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Filter products by a query string (case-insensitive title match). */
function filterProducts(products: MerchProduct[], query: string): MerchProduct[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => p.title.toLowerCase().includes(q));
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

/** /merch/search server component shell. */
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const initialResults = filterProducts(MERCH_PRODUCTS, query);

  return (
    <SearchPageClient
      allProducts={MERCH_PRODUCTS}
      initialQuery={query}
      initialResults={initialResults}
    />
  );
}
