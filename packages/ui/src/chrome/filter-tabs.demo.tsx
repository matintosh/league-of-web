"use client";

import { useState } from "react";
import { FilterTabs } from "./filter-tabs";

const UNIVERSE_TABS = [
  { id: "everything", label: "Everything" },
  { id: "short-stories", label: "Short Stories" },
  { id: "comics", label: "Comics" },
  { id: "videos", label: "Videos" },
  { id: "music", label: "Music" },
];

const MANY_TABS = [
  { id: "everything", label: "Everything" },
  { id: "short-stories", label: "Short Stories" },
  { id: "comics", label: "Comics" },
  { id: "videos", label: "Videos" },
  { id: "music", label: "Music" },
  { id: "art", label: "Art" },
  { id: "lore", label: "Lore" },
  { id: "champions", label: "Champions" },
];

/** Interactive demo — activeId managed by useState, clicking switches tabs */
export function FilterTabsDefaultDemo() {
  const [activeId, setActiveId] = useState("everything");

  return (
    <FilterTabs
      label="Filter By"
      tabs={UNIVERSE_TABS}
      activeId={activeId}
      onSelect={setActiveId}
    />
  );
}

/** Demo with an endSlot containing sort controls */
export function FilterTabsWithEndSlotDemo() {
  const [activeId, setActiveId] = useState("everything");

  return (
    <FilterTabs
      label="Filter By"
      tabs={UNIVERSE_TABS}
      activeId={activeId}
      onSelect={setActiveId}
      endSlot={
        <span className="font-display text-[13px] uppercase tracking-wide text-gold-cream">
          Sort By{" "}
          <span className="normal-case text-gold-1 cursor-pointer hover:text-gold-cream transition-colors duration-150">
            Newest ▾
          </span>
        </span>
      }
    />
  );
}

/** Many tabs demo — 8 tabs, interactive */
export function FilterTabsManyTabsDemo() {
  const [activeId, setActiveId] = useState("everything");

  return (
    <FilterTabs
      label="Filter By"
      tabs={MANY_TABS}
      activeId={activeId}
      onSelect={setActiveId}
    />
  );
}
