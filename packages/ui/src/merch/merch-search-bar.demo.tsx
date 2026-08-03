"use client";

/**
 * MerchSearchBarDemo — stateful demo wrapper for the MerchSearchBar showcase.
 * This file is 'use client'; the showcase file (merch-search-bar.showcase.tsx)
 * is server-safe and imports this for interactive variants.
 */

import { useState } from "react";
import { MerchSearchBar } from "./merch-search-bar";

export function MerchSearchBarDemo({
  initialQuery,
  initialResultCount,
}: {
  initialQuery?: string;
  initialResultCount?: number;
}) {
  const [query, setQuery] = useState(initialQuery ?? "jinx");
  const [resultCount, setResultCount] = useState(initialResultCount ?? 7);

  function handleSearch(q: string) {
    // Simulate a client-side search: count products whose title includes q
    setResultCount(q.trim() === "" ? 0 : Math.floor(Math.random() * 8) + 1);
    setQuery(q);
  }

  return (
    <MerchSearchBar
      query={query}
      resultCount={resultCount}
      onQueryChange={setQuery}
      onSearch={handleSearch}
    />
  );
}
