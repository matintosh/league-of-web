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
  /**
   * Optional left-zone slot rendered immediately right of the play CTA, e.g.
   * <NavProductSwitcher /> (issue #403 — the current-era LEAGUE/TFT/LoR product
   * switcher). Kept as a distinct slot from the screen-nav `navItems` row so our
   * app routing stays intact (issue #403 option 2, the pragmatic hybrid): the
   * switcher closes the measured left-zone geometry gap while screen access
   * continues through `navItems`. Omit to keep the pre-#403 layout.
   */
  productSwitcherSlot?: ReactNode;
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
     *
     * #505: the nav is an absolute overlay pinned to the window top (#502), so
     * top-0 also coincides with WindowFrame's gold TOP border. The chevron uses
     * the same gold-3 token as that border and its outer V tips flank the tab
     * right below the line — so the top line and this chevron read as ONE
     * continuous gold accent that notches down over the active tab (ref
     * client-current-home-2025-mf.png / ref-tab-connect.png).
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
  productSwitcherSlot,
  navItems,
  activeId,
  onNavigate,
  currencySlot,
  playerSlot,
}: TopNavbarProps) {
  return (
    <nav
      aria-label="Main navigation"
      /* #460/#491: the band is a dark warm SCRIM over the home key-art, not a
         flat navy fill — the Miss Fortune splash BLEEDS THROUGH it. #491 tuned
         the wash more transparent to match the 2025 reference: a bottom-heavier
         vertical gradient (lighter at the top edge, denser toward the bottom)
         so the splash reads clearly through the band while text/icons stay
         legible. Both stops are token-derived via color-mix.
         #505: the 2025 reference shows the splash bleeding CONTINUOUSLY from the
         band into the content below — there is no bottom hairline/border. The
         only chrome accent is the gold TOP line (WindowFrame integrated variant)
         which connects to the active-tab chevron. So the former bottom gold-4
         hairline is removed; the scrim just fades into the body.
         #508: the band is an absolute overlay over the z-0 home splash, so a
         backdrop blur frosts what's BEHIND it — the splash bleeding up to y=0
         reads as soft frosted glass through the band, matching the 2025
         reference (Image #14). The transparent scrim gradient sits ON TOP of the
         blur so the art stays legible; all nav children (text/chevron/currency/
         profile) render above this layer and stay crisp.
         #523: blur reduced from backdrop-blur-md (12px) to a lighter ~6px so the
         splash behind the band reads clearer (lighter frost per the reference). */
      style={{
        backgroundImage:
          "linear-gradient(to bottom, color-mix(in srgb, var(--color-hextech-black) 42%, transparent) 0%, color-mix(in srgb, var(--color-hextech-black) 68%, transparent) 100%)",
      }}
      /* #491: band raised to ~88px (h-22 = 88px) to match the 2025 reference,
         where content/rail start ~y88. The play medallion, product switcher,
         icon cluster, currency, and profile chip all sit vertically centred in
         this taller band; the window-control row still floats top-right in the
         integrated chrome (WindowFrame), above this nav. */
      className="flex h-22 w-full shrink-0 items-stretch px-4 [backdrop-filter:blur(6px)]"
    >
      {/* Left region — play slot; self-center so the PLAY button stays vertically centred */}
      <div className="flex shrink-0 items-center">{playSlot}</div>

      {/* Left-zone product switcher (#403) — sits right of PLAY, before the
          screen-nav row. `items-stretch` (#523) so the switcher spans the band's
          full height and its active tab can render a full-height LEAGUE cell that
          reaches the gold top border where the chevron notches over it; spacing
          measured from the ref. */}
      {productSwitcherSlot && (
        <div className="ml-4 flex shrink-0 items-stretch">{productSwitcherSlot}</div>
      )}

      {/* Center region — nav items stretch full height so buttons can place the
          chevron at top-0 (= navbar top) while text sits at the bottom via pb-3.
          `min-w-0` lets the row shrink inside the band so it never pushes into
          the right cluster; it stays centered in the space between the left zone
          (play + #403 switcher) and the right currency/profile cluster. */}
      <div className="flex flex-1 min-w-0 items-stretch justify-center gap-4 overflow-x-auto">
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

      {/* Right region — currency + player slot, both VERTICALLY CENTERED in the
          band (#527). The player slot was formerly bottom-aligned (`items-end`,
          #385/#390) to clear the floating window-controls row, but the #509
          theme-3 avatar frame (85px) centered on a bottom-aligned 34px avatar
          spilled ~24px past the band bottom into the home content and read as
          "misplaced". Centering the chip seats the 85px frame inside the 88px
          band (frame ≈ y3.5→88.5) and aligns the profile with the currency. The
          window-controls (?─⚙✕) float in the window chrome (window-frame.tsx),
          a separate layer at the top-right corner, so they don't collide. */}
      <div className="flex shrink-0 items-center gap-3">
        {currencySlot}
        <div className="flex h-full items-center">{playerSlot}</div>
      </div>
    </nav>
  );
}
