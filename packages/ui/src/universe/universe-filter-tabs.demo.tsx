"use client";

import { useState } from "react";
import { UniverseFilterTabs } from "./universe-filter-tabs";

const DEFAULT_FILTERS = [
  { key: "everything", label: "Everything" },
  { key: "short-stories", label: "Short Stories" },
  { key: "comics", label: "Comics" },
  { key: "videos", label: "Videos" },
  { key: "music", label: "Music" },
];

const SORT_OPTIONS = ["Newest", "Oldest", "A–Z"];

/** Interactive stateful demo for UniverseFilterTabs. */
export function UniverseFilterTabsDemo() {
  const [activeFilter, setActiveFilter] = useState("everything");
  const [sortIdx, setSortIdx] = useState(0);

  return (
    <div
      className="w-full max-w-3xl"
      style={{ backgroundColor: "var(--color-universe-bg)" }}
    >
      <UniverseFilterTabs
        filters={DEFAULT_FILTERS}
        activeFilter={activeFilter}
        onFilter={setActiveFilter}
        sort={SORT_OPTIONS[sortIdx]}
        onSortToggle={() => setSortIdx((i) => (i + 1) % SORT_OPTIONS.length)}
      />
      <p
        className="mt-2 px-6 text-[11px]"
        style={{ color: "var(--color-grey-1)", fontFamily: "var(--font-body)" }}
      >
        Filter: {activeFilter} | Sort: {SORT_OPTIONS[sortIdx]}
      </p>
    </div>
  );
}
