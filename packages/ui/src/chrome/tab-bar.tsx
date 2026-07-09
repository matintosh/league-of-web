"use client";

export interface Tab {
  /** Unique identifier for this tab */
  id: string;
  /** Display label — rendered uppercase via CSS */
  label: string;
}

export interface TabBarProps {
  /** Ordered list of tabs to render */
  tabs: Tab[];
  /** ID of the currently active tab */
  activeId: string;
  /**
   * Called when the user clicks a tab, receives the tab's id.
   * Note: aria-controls is intentionally omitted — tab panels are out of scope
   * for this component; the parent is responsible for rendering the correct panel.
   */
  onSelect: (id: string) => void;
}

/**
 * TabBar is the secondary in-screen tab navigation bar used inside content
 * screens (e.g. Collection: Champions / Skins / Emotes / Ward Skins).
 * It sits below the TopNavbar as a sub-header strip.
 *
 * Purely presentational — no internal state. Parent owns activeId.
 * Tabs do not wrap on overflow; excess items clip (matching real client behaviour).
 */
export function TabBar({ tabs, activeId, onSelect }: TabBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Tab navigation"
      className="flex h-10 w-full shrink-0 items-end overflow-hidden border-b border-gold-5 bg-blue-6 px-4 gap-8"
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
              "shrink-0 font-display uppercase tracking-widest text-sm",
              "border-b-2 pb-0.5 cursor-pointer transition-colors duration-150",
              isActive
                ? "border-gold-3 text-gold-2"
                : "border-transparent text-grey-1 hover:text-gold-1",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
