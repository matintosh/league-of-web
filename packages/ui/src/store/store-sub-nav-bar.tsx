"use client";

import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Valid Store sub-navigation tab identifiers. */
export type StoreTab =
  | "featured"
  | "champions"
  | "skins"
  | "loot"
  | "emotes"
  | "accessories"
  | "esports";

/** Display configuration for a store tab. */
interface StoreTabDef {
  id: StoreTab;
  label: string;
}

export interface StoreSubNavBarProps {
  /** Currently active tab. Defaults to "featured". */
  activeTab?: StoreTab;
  /** Called when a tab button is clicked. */
  onTabChange?: (tab: StoreTab) => void;
  /** Called when the PURCHASE RP button is clicked. */
  onPurchaseRP?: () => void;
  /**
   * Optional slot for a currency display injected by the parent
   * (e.g., the RP balance badge). Rendered between the tabs and the PURCHASE RP button.
   * Unused in the base spec but reserved for future composition.
   */
  currencySlot?: ReactNode;
  /** URL for the RP coin icon (caller-supplied from cdragon helper). */
  rpIconSrc?: string;
}

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const TABS: StoreTabDef[] = [
  { id: "featured",    label: "Featured" },
  { id: "champions",   label: "Champions" },
  { id: "skins",       label: "Skins" },
  { id: "loot",        label: "Loot" },
  { id: "emotes",      label: "Emotes" },
  { id: "accessories", label: "Accessories" },
  { id: "esports",     label: "Esports" },
];

// ---------------------------------------------------------------------------
// StoreSubNavBar
// ---------------------------------------------------------------------------

/**
 * StoreSubNavBar renders the horizontal tab strip that sits below the main
 * TopNavbar inside the Store section.
 *
 * Contains 7 tabs (FEATURED through ESPORTS) and a gold PURCHASE RP button
 * on the far right. The active tab is marked with a bottom border in gold-3
 * and gold-1 text; inactive tabs are grey-2 / grey-1 on hover.
 *
 * Presentational only — parent owns `activeTab` state.
 */
export function StoreSubNavBar({
  activeTab = "featured",
  onTabChange,
  onPurchaseRP,
  currencySlot,
  rpIconSrc,
}: StoreSubNavBarProps) {
  return (
    <div
      role="tablist"
      aria-label="Store navigation"
      className="flex h-10 w-full shrink-0 items-stretch overflow-hidden border-b border-gold-5 bg-blue-6 px-4"
    >
      {/* Tab buttons — left-aligned, vertically centered with active underline */}
      <div className="flex flex-1 items-end gap-6 overflow-hidden">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange?.(tab.id)}
              className={[
                "shrink-0 font-display text-sm tracking-widest uppercase",
                "border-b-2 pb-0.5 cursor-pointer transition-colors duration-150",
                isActive
                  ? "border-gold-3 text-gold-1"
                  : "border-transparent text-grey-2 hover:text-gold-2",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Right section — optional currency slot + PURCHASE RP CTA */}
      <div className="flex shrink-0 items-center gap-3 pl-4">
        {currencySlot}

        {/* PURCHASE RP — gold filled button with RP coin icon */}
        <button
          type="button"
          onClick={onPurchaseRP}
          className={[
            "flex items-center gap-1.5 cursor-pointer",
            "border border-gold-3 bg-gold-4 px-4 py-1",
            "font-display text-xs uppercase tracking-widest text-gold-1",
            "transition-colors duration-150 hover:bg-gold-3 hover:text-hextech-black",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-1",
          ].join(" ")}
        >
          {rpIconSrc && (
            <img
              src={rpIconSrc}
              alt=""
              aria-hidden="true"
              width={14}
              height={14}
              className="shrink-0"
            />
          )}
          PURCHASE RP
        </button>
      </div>
    </div>
  );
}
