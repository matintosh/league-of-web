"use client";

import type { ReactNode } from "react";

export interface NavItem {
  id: string;
  label: string;
  /**
   * When true the item renders with aria-disabled + pointer-events-none and
   * does not fire onNavigate. Back-compat: existing items without this field
   * remain fully interactive.
   */
  disabled?: boolean;
}

export interface TopNavbarProps {
  /** Far-left CTA slot, e.g. <PlayButton /> as ReactNode */
  playSlot: ReactNode;
  /** Center navigation items list */
  navItems: NavItem[];
  /** ID of the currently active nav item */
  activeId: string;
  /** Called when a nav item is clicked; receives the clicked item's id */
  onNavigate: (id: string) => void;
  /** Top-right currency display slot, e.g. <CurrencyDisplay /> */
  currencySlot: ReactNode;
  /** Top-right player identity slot, e.g. <PlayerHovercard /> */
  playerSlot: ReactNode;
}

/**
 * TopNavbar is the slim horizontal navigation bar at the top of the LoL client.
 * It contains three regions: a left play CTA slot, a center nav item list,
 * and a right region for currency and player identity slots.
 *
 * Purely presentational — no internal state.
 */
export function TopNavbar({
  playSlot,
  navItems,
  activeId,
  onNavigate,
  currencySlot,
  playerSlot,
}: TopNavbarProps) {
  return (
    <nav aria-label="Main navigation" className="flex h-12 w-full shrink-0 items-center border-b border-gold-5 bg-blue-7 px-4">
      {/* Left region — play slot */}
      <div className="flex shrink-0 items-center">{playSlot}</div>

      {/* Center region — nav items; overflow-x-auto handles extreme item counts */}
      <div className="flex flex-1 items-center justify-center gap-6 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = item.id === activeId;
          const isDisabled = item.disabled === true;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              aria-disabled={isDisabled ? true : undefined}
              onClick={isDisabled ? undefined : () => onNavigate(item.id)}
              className={[
                "font-display uppercase tracking-widest text-sm transition-colors duration-150",
                "border-t-2 pt-0.5",
                isDisabled
                  ? "cursor-default border-transparent text-grey-2 pointer-events-none"
                  : isActive
                  ? "cursor-pointer border-gold-3 text-gold-1"
                  : "cursor-pointer border-transparent text-grey-1 hover:text-gold-1",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right region — currency + player slots */}
      <div className="flex shrink-0 items-center gap-3">
        {currencySlot}
        {playerSlot}
      </div>
    </nav>
  );
}
