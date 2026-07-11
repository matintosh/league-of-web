"use client";

import { useId } from "react";

export interface FilterTabsProps {
  /** The prefix label text displayed before the tabs (e.g. "Filter By") */
  label: string;
  /** Ordered list of tab items to render */
  tabs: { id: string; label: string }[];
  /** ID of the currently active tab */
  activeId: string;
  /** Called when the user clicks a tab, receives the tab's id */
  onSelect: (id: string) => void;
  /** Optional slot rendered at the far right of the bar (e.g. a sort control) */
  endSlot?: React.ReactNode;
}

/**
 * FilterTabs is the labeled filter row used on content-browse pages such as
 * the Universe explore page. It renders a visible "Filter By" prefix label
 * followed by a set of tab buttons and an optional right-aligned end slot
 * (e.g. a sort control).
 *
 * Purely presentational — no internal state. Parent owns activeId.
 */
export function FilterTabs({
  label,
  tabs,
  activeId,
  onSelect,
  endSlot,
}: FilterTabsProps) {
  const labelId = useId();

  return (
    <div
      data-shot="filter-tabs-default"
      className="flex h-[56px] w-full items-center border-b border-grey-3"
    >
      <span
        id={labelId}
        className="shrink-0 px-[14px] font-display text-[15px] uppercase tracking-wide text-gold-1"
      >
        {label}
      </span>

      <div
        role="tablist"
        aria-labelledby={labelId}
        className="flex h-full items-stretch"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(tab.id)}
              className={[
                "flex shrink-0 cursor-pointer items-center px-[14px] font-display text-[15px] capitalize tracking-wide",
                "border-b-2 transition-colors duration-150",
                isActive
                  ? "-mb-px border-gold-4 text-gold-1"
                  : "border-transparent text-gold-cream hover:text-gold-1",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {endSlot != null && (
        <div className="ml-auto flex items-center px-[14px]">{endSlot}</div>
      )}
    </div>
  );
}
