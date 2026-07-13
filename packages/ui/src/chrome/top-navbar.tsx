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
  /**
   * Top-right controls slot — social-rail toggle, settings, and similar
   * glyph buttons. Player identity is NOT placed here when the social rail
   * is always-on (the rail's ProfileChip header owns identity per #146).
   */
  playerSlot: ReactNode;
}

/**
 * Gold double-chevron (≫ rotated 90°, pointing down) that drops from the top
 * edge of the navbar above the active tab. Pixel-measured from
 * docs/reference/client-main-menu.jpg: the indicator spans y=3–22 in the
 * 1920×1080 reference, centered on the active tab, with the outer V wider and
 * a tighter inner V below it.
 */
function ActiveChevron() {
  return (
    /*
     * The chevron sits at the top of the button. The nav buttons are
     * stretched to full navbar height (self-stretch) and aligned to the
     * bottom (pb-3) so the button top edge coincides with the navbar top
     * edge — making top-0 here equivalent to the navbar's top edge.
     */
    <span
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
    >
      <svg
        width="20"
        height="14"
        viewBox="0 0 20 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gold-3"
      >
        {/* Outer chevron — wider V */}
        <polyline
          points="1,1 10,8 19,1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Inner chevron — tighter V below */}
        <polyline
          points="4,7 10,13 16,7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

/**
 * TopNavbar is the slim horizontal navigation bar at the top of the LoL client.
 * It contains three regions: a left play CTA slot, a center nav item list,
 * and a right region for currency and player identity slots.
 *
 * Active tab treatment: a gold double-chevron descends from the navbar's top
 * edge above the active item, per pixel analysis of client-main-menu.jpg
 * (adjudicated in PR #180 — the border-t-2 in PR #165 misread the lobby
 * screenshot which shows no tab indicator at all in party state).
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
    <nav aria-label="Main navigation" className="flex h-16 w-full shrink-0 items-stretch border-b border-gold-5 bg-blue-7 px-4">
      {/* Left region — play slot; self-center so the PLAY button stays vertically centred */}
      <div className="flex shrink-0 items-center">{playSlot}</div>

      {/* Center region — nav items stretch full height so buttons can place the
          chevron at top-0 (= navbar top) while text sits at the bottom via pb-3 */}
      <div className="flex flex-1 items-stretch justify-center gap-6 overflow-x-auto">
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
                "relative flex items-end pb-3 font-display uppercase tracking-widest text-sm transition-colors duration-150",
                isDisabled
                  ? "cursor-default text-grey-2 pointer-events-none"
                  : isActive
                  ? "cursor-pointer text-gold-1"
                  : "cursor-pointer text-grey-1 hover:text-gold-1",
              ].join(" ")}
            >
              {isActive && <ActiveChevron />}
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Right region — currency + player slots; self-center to stay vertically centred */}
      <div className="flex shrink-0 items-center gap-3">
        {currencySlot}
        {playerSlot}
      </div>
    </nav>
  );
}
