"use client";

/**
 * MerchFilterSortBarDemo — stateful client wrapper for the showcase.
 * Wires onFilterChange and onSortChange with useState so the demo
 * is interactive in the showcase without breaking server safety.
 */

import { useState } from "react";
import type { MerchSortOption } from "./merch-filter-sort-bar";
import { MerchFilterSortBar } from "./merch-filter-sort-bar";

const FILTER_OPTIONS = ["All", "New", "Sale", "Limited", "Out of Stock"] as const;

/** Interactive demo — tracks active filter + sort selection in state. */
export function MerchFilterSortBarDemo() {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [activeSort, setActiveSort] = useState<MerchSortOption>("featured");

  return (
    <div style={{ fontFamily: "var(--font-merch)" }}>
      <MerchFilterSortBar
        productCount={24}
        filterOptions={[...FILTER_OPTIONS]}
        activeFilter={activeFilter}
        activeSort={activeSort}
        onFilterChange={setActiveFilter}
        onSortChange={setActiveSort}
      />
      <div
        style={{
          padding: "12px 24px",
          fontSize: 12,
          color: "var(--color-merch-muted)",
          backgroundColor: "var(--color-merch-surface)",
          borderTop: "1px solid var(--color-merch-border)",
        }}
      >
        Active filter: <strong>{activeFilter}</strong> · Active sort:{" "}
        <strong>{activeSort}</strong>
      </div>
    </div>
  );
}
