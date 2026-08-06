import { SearchPageClient } from "./search-page-client";

/**
 * /merch/search — permanent hero-only page.
 *
 * The real merch.riotgames.com/en-us/search always renders the same
 * "NO SEARCH TERM PROVIDED" hero regardless of any ?q= param.
 * This page reflects that behaviour exactly.
 *
 * Merch tokens (--color-merch-*) are loaded by the /merch layout.
 */

/** /merch/search server component shell. */
export default async function SearchPage() {
  return <SearchPageClient />;
}
