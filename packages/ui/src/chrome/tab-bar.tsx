"use client";

import { type ReactNode } from "react";

export interface Tab {
  /** Unique identifier for this tab */
  id: string;
  /** Display label — rendered uppercase via CSS */
  label: string;
  /**
   * When true the tab is aria-disabled and visually dimmed (text-grey-2).
   * Clicks are suppressed — onSelect is never called for disabled tabs.
   */
  disabled?: boolean;
  /**
   * When true a thin vertical divider (1px, border-gold-5) is rendered
   * immediately before this tab. Used in ModeSelectScreen to separate
   * the primary tabs (PVP / CO-OP VS AI / TRAINING) from the custom-game
   * tabs (CREATE CUSTOM / JOIN CUSTOM).
   */
  dividerBefore?: boolean;
}

export interface TabBarProps {
  /** Ordered list of tabs to render */
  tabs: Tab[];
  /** ID of the currently active tab */
  activeId: string;
  /**
   * Called when the user clicks a non-disabled tab, receives the tab's id.
   * Note: aria-controls is intentionally omitted — tab panels are out of scope
   * for this component; the parent is responsible for rendering the correct panel.
   */
  onSelect: (id: string) => void;
  /**
   * Accessible name for the tablist landmark. Defaults to "Tab navigation".
   * Supply a unique value when multiple TabBars appear on the same page to
   * avoid duplicate landmark names for assistive technology.
   */
  label?: string;
  /**
   * Optional node rendered after the tablist, flush to the right end of the bar.
   * Use for icon buttons (e.g. the trophy/ranked-history button on ModeSelectScreen).
   * The slot is outside the tablist landmark so it doesn't count as a tab.
   */
  trailing?: ReactNode;
}

/**
 * TabBar is the secondary in-screen tab navigation bar used inside content
 * screens (e.g. Collection: Champions / Skins / Emotes / Ward Skins).
 * It sits below the TopNavbar as a sub-header strip.
 *
 * Purely presentational — no internal state. Parent owns activeId.
 * Tabs do not wrap on overflow; excess items clip (matching real client behaviour).
 *
 * The optional `trailing` slot renders a node flush-right (e.g. a trophy icon button).
 * Individual tabs accept `disabled` and `dividerBefore` for the mode-select layout.
 */
export function TabBar({ tabs, activeId, onSelect, label = "Tab navigation", trailing }: TabBarProps) {
  return (
    <div className="flex h-10 w-full shrink-0 items-end overflow-hidden border-b border-gold-5 bg-blue-6 px-4">
      <div
        role="tablist"
        aria-label={label}
        className="flex h-full min-w-0 items-end gap-8 flex-1"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          const isDisabled = tab.disabled ?? false;
          return (
            <div key={tab.id} className="flex h-full items-end">
              {tab.dividerBefore && (
                <span
                  aria-hidden="true"
                  className="mr-8 mb-1 block h-4 w-px shrink-0 bg-gold-5 self-center"
                />
              )}
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-disabled={isDisabled || undefined}
                onClick={isDisabled ? undefined : () => onSelect(tab.id)}
                className={[
                  "shrink-0 font-display uppercase tracking-widest text-sm",
                  "border-b-2 pb-0.5 transition-colors duration-150",
                  isDisabled
                    ? "border-transparent text-grey-2 cursor-default"
                    : isActive
                    ? "border-gold-3 text-gold-2 cursor-pointer"
                    : "border-transparent text-grey-1 hover:text-gold-1 cursor-pointer",
                ].join(" ")}
              >
                {tab.label}
              </button>
            </div>
          );
        })}
      </div>
      {trailing && (
        <div className="flex h-full shrink-0 items-center border-l border-gold-5 pl-3 ml-2 pb-0.5">
          {trailing}
        </div>
      )}
    </div>
  );
}
