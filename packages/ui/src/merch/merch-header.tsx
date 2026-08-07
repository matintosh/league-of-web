/**
 * MerchHeader — two-tier top navigation for the Riot Games merch store clone.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens
 * (add a token to @low/tokens if one is missing, sampled from the real store)
 * and a modern e-commerce layout. This is NOT the Hextech client — IGNORE the
 * client Hextech-only / no-default-Tailwind-palette guidance; still tokens-only
 * (no raw hex outside packages/tokens), presentational (props in/callbacks out,
 * NO fetching in @low/ui, types from @low/fixtures), showcase server-safe
 * (no 'use client'), SVG/gradient ids from useId.
 *
 * Structure (measured from merch.riotgames.com):
 *   1. Announcement bar (NOT sticky — scrolls away with page content):
 *        - Left gutter: two-tone dismiss block (brighter EB0029 red, 50×50 @390 / 94×50 @1280, flush x=0)
 *          containing a 24×24 stroke SVG ✕.
 *        - Pill (starts x=50 @390 / x=94 @1280): darker C60023 red pill with
 *          marquee text 14px/600/uppercase (issue #856 delta #7). @390: rounded pill
 *          (border-radius 36px, 1px solid EB0029 border). @1280: flat full-bleed band.
 *   2. Sticky nav tier (~80px black bar):
 *        Desktop (≥lg):
 *          Left:  stacked RIOT GAMES wordmark + games-switcher caret + WHITE fist emblem circle (~46px)
 *          Center: Shop All · Categories▾ · Featured▾ · Sale · My Shop (gap-9 / 36px inter-item)
 *          Right: search(20) · globe(20) · SIGN IN(87×32 / 13px/600/1.04px uppercase) · cart(22×21)
 *        Mobile (<lg):
 *          Left:  stacked 2-line RIOT/GAMES wordmark (88×32 at x=4) + games-switcher caret
 *          Right: cart(22×21) · search(26) · globe(24) · hamburger(28, ~4px from edge)
 *        Real site: nav remains VISIBLE at all scroll offsets (announcement scrolls away; nav stays).
 *        #773's navHidden hide-on-scroll has been removed — confirmed against live site.
 *
 * Nav links: 16px/600, uppercase, white; hover → --color-merch-red.
 * MY SHOP: --color-merch-gold. Dropdowns: Categories▾ + Featured▾ on click.
 * SIGN IN: bg --color-merch-signin-bg, solid dark pill 87×32, 13px/600/1.04px uppercase.
 * Caret after wordmark: small down-caret (~14×7) right of RIOT GAMES (games-switcher).
 * Dropdown indicator: solid filled triangle (not a thin chevron).
 * No active underline — real site has none.
 *
 * Mobile drawer: full-screen WHITE panel; rows ≈56px; riotSans 14px/600/uppercase black
 * labels with right carets; NO per-row dividers within a group (only group-boundary hairline);
 * 1px amber left-edge line (--color-merch-menu-edge); white bg; burger icon stays ☰;
 * panel top=130px (nav 80 + band 50) so announcement bar remains visible behind open drawer.
 * Flat list two groups: (1) SHOP ALL / FEATURED / SALE / MY SHOP,
 * (2) SHOP BY GAME / APPAREL / COLLECTIBLES / ART / ACCESSORIES + Sign In.
 *
 * Dropdown menus open on click and close on:
 *   - Outside click (mousedown on document)
 *   - Escape key
 * aria-expanded + role=menu + role=menuitem for a11y.
 */

"use client";

import { useId, useState, useEffect, useRef, useCallback } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A nav item with optional dropdown caret. */
export interface MerchNavItem {
  slug: string;
  label: string;
  /** If true, renders a filled triangle caret and opens a dropdown on click. */
  hasDropdown?: boolean;
  /** If true, renders with --color-merch-gold instead of default white. */
  isGold?: boolean;
}

/** A single item in a dropdown menu (Categories or Featured). */
export interface MerchNavMenuItem {
  /** Slug used in the URL: /merch/collection/<slug> (or a full override via href). */
  slug: string;
  /** Display label, e.g. "Apparel". */
  label: string;
}

export interface MerchHeaderProps {
  /** Currently active top-level nav slug, if any. */
  activeCategory?: string;
  /** Cart item count (0 = no badge). */
  cartCount?: number;
  /** Announcement text for the red strip. Omitting hides the strip. */
  announcement?: string;
  /** Fired when the announcement dismiss ✕ button is clicked. */
  onDismissAnnouncement?: () => void;
  /**
   * Fired when any nav link is clicked; receives the item's slug.
   * For dropdown items, receives the item's slug (not the parent slug).
   */
  onCategoryClick?: (slug: string) => void;
  /** Fired when cart icon is clicked. */
  onCartClick?: () => void;
  /** Fired when SIGN IN button is clicked. */
  onSignIn?: () => void;
  /** @deprecated Use onSignIn — kept for back-compat with existing call sites. */
  onAccountClick?: () => void;
  /** Fired when search icon is clicked. */
  onSearchClick?: () => void;
  /** Fired when globe/locale icon is clicked. */
  onLocaleClick?: () => void;
  /** Fired when logo is clicked. */
  onLogoClick?: () => void;
  /** Override the default nav items if needed. */
  navItems?: MerchNavItem[];
  /**
   * Items for the Categories dropdown.
   * Defaults to DEFAULT_CATEGORIES_MENU if omitted.
   * Each slug is navigated as /merch/collection/<slug>.
   */
  categoriesMenu?: MerchNavMenuItem[];
  /**
   * Items for the Featured dropdown.
   * Defaults to DEFAULT_FEATURED_MENU if omitted.
   * Each slug is navigated as /merch/collection/<slug>.
   */
  featuredMenu?: MerchNavMenuItem[];
  /**
   * Fired when the hamburger/menu button is clicked (mobile only).
   * @deprecated Internal mobile drawer is now built-in; this callback still fires
   *   for external consumers that need the signal.
   */
  onMenuClick?: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_NAV: MerchNavItem[] = [
  { slug: "shop-all",   label: "Shop All" },
  { slug: "categories", label: "Categories", hasDropdown: true },
  { slug: "featured",   label: "Featured",   hasDropdown: true },
  { slug: "sale",       label: "Sale" },
  { slug: "my-shop",    label: "My Shop",    isGold: true },
];

/**
 * Mobile drawer menu — flat list, two groups separated by a hairline.
 * Group 1: SHOP ALL / FEATURED / SALE / MY SHOP
 * Group 2: SHOP BY GAME / APPAREL / COLLECTIBLES / ART / ACCESSORIES
 * Matches real merch.riotgames.com @390 (issue #856, delta #11).
 */
interface MobileFlatItem {
  slug: string;
  label: string;
  isGold?: boolean;
  /** Marks the last item of a group — next item gets a hairline divider above it. */
  groupEnd?: boolean;
  /** If set, fires sign-in callback instead of onCategoryClick. */
  isSignIn?: boolean;
}

const MOBILE_GROUP_1: MobileFlatItem[] = [
  { slug: "shop-all", label: "Shop All" },
  { slug: "featured",  label: "Featured" },
  { slug: "sale",      label: "Sale" },
  { slug: "my-shop",   label: "My Shop", isGold: true, groupEnd: true },
];

const MOBILE_GROUP_2: MobileFlatItem[] = [
  { slug: "shop-by-game",   label: "Shop By Game" },
  { slug: "apparel",        label: "Apparel" },
  { slug: "collectibles",   label: "Collectibles" },
  { slug: "art",            label: "Art" },
  { slug: "accessories",    label: "Accessories" },
];

/** Default Categories dropdown — product category collections. */
const DEFAULT_CATEGORIES_MENU: MerchNavMenuItem[] = [
  { slug: "apparel",       label: "Apparel" },
  { slug: "collectibles",  label: "Collectibles" },
  { slug: "accessories",   label: "Accessories" },
  { slug: "art",           label: "Art & Prints" },
  { slug: "home-office",   label: "Home & Office" },
  { slug: "gaming",        label: "Gaming" },
];

/** Default Featured dropdown — franchise / campaign collections. */
const DEFAULT_FEATURED_MENU: MerchNavMenuItem[] = [
  { slug: "league-of-legends", label: "League of Legends" },
  { slug: "riftbound",         label: "Riftbound" },
  { slug: "arcane",            label: "Arcane" },
  { slug: "valorant",          label: "VALORANT" },
  { slug: "teamfight-tactics", label: "Teamfight Tactics" },
  { slug: "lol-esports",       label: "LoL Esports" },
];

/**
 * Updated announcement copy — warehouse upgrade message matching the real site.
 * (Previous copy had July 3–7 wording which no longer matches.)
 */
const DEFAULT_ANNOUNCEMENT =
  "We're upgrading our warehouse! Orders (Riftbound excluded) may experience shipping delays, but we expect to resume normal operations before…";

// ---------------------------------------------------------------------------
// Sub-component: Dropdown menu
// ---------------------------------------------------------------------------

interface DropdownMenuProps {
  items: MerchNavMenuItem[];
  onSelect: (slug: string) => void;
  menuId: string;
}

function DropdownMenu({ items, onSelect, menuId }: DropdownMenuProps) {
  return (
    <ul
      id={menuId}
      role="menu"
      style={{
        position: "absolute",
        top: "calc(100% + 4px)",
        left: 0,
        zIndex: 200,
        minWidth: "180px",
        backgroundColor: "var(--color-merch-header-bg)",
        border: "1px solid var(--color-merch-border-dark)",
        borderRadius: "4px",
        padding: "6px 0",
        listStyle: "none",
        margin: 0,
        boxShadow: "0 8px 24px var(--color-merch-scrim-strong)",
      }}
    >
      {items.map(({ slug, label }) => (
        <li key={slug} role="none">
          <button
            type="button"
            role="menuitem"
            onClick={() => onSelect(slug)}
            style={{
              display: "block",
              width: "100%",
              padding: "9px 16px",
              textAlign: "left",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: 400,
              color: "var(--color-merch-on-dark)",
              transition: "color 0.12s, background-color 0.12s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--color-merch-red)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "var(--color-merch-dropdown-hover-bg)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--color-merch-on-dark)";
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
            }}
          >
            {label}
          </button>
        </li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Cart SVG (shopping cart outline — basket + wheels)
// ---------------------------------------------------------------------------

/** Shopping-cart outline glyph (22×21). Measured from real merch.riotgames.com.
 *  issue #891 delta #11: wheels are outline circles (stroke), not filled dots. */
function CartIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={Math.round(size * 21 / 22)}
      viewBox="0 0 22 21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Cart body / basket */}
      <path d="M1 1h2.5l2 9h11l2-7H6" />
      {/* Wheels — OUTLINE circles (issue #891 delta #11: real site has round outline wheels, not filled dots) */}
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="16" cy="18" r="1.5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Solid triangle caret (dropdown indicator)
// ---------------------------------------------------------------------------

/** Solid filled downward triangle — real merch site uses a solid triangle, not a thin chevron. */
function TriangleCaret({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="8"
      height="5"
      viewBox="0 0 8 5"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 0.15s",
        flexShrink: 0,
      }}
    >
      <path d="M0 0 L8 0 L4 5 Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Games-switcher down-caret (after wordmark)
// ---------------------------------------------------------------------------

/** Small down-caret ~14×7 right of RIOT GAMES wordmark (games-switcher). */
function WordmarkCaret() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="7"
      viewBox="0 0 14 7"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <path d="M0 0 L14 0 L7 7 Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: Dismiss SVG ✕
// ---------------------------------------------------------------------------

/** 24×24 stroke SVG ✕ for announcement dismiss. */
function DismissIcon() {
  return (
    <svg
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchHeader — top navigation cluster for the Riot Games merch store clone.
 *
 * Structure:
 *   1. Announcement bar (NOT sticky — scrolls away with content):
 *        Two-tone: brighter-EB0029 dismiss block (left, flush) + C60023 pill.
 *   2. Sticky nav bar (~80px black):
 *        Desktop: wordmark + caret + white-fist emblem | nav links | right cluster.
 *        Mobile:  stacked wordmark + caret | right cluster (cart·search·globe·burger).
 *   3. Mobile drawer: full-screen WHITE panel, black text, 1px dividers.
 *
 * Real site hide-on-scroll: nav remains VISIBLE at all scroll offsets.
 * Only the announcement scrolls away (it lives outside the sticky wrapper).
 */
export function MerchHeader({
  activeCategory,
  cartCount = 0,
  announcement = DEFAULT_ANNOUNCEMENT,
  onDismissAnnouncement,
  onCategoryClick,
  onCartClick,
  onSignIn,
  onAccountClick,
  onSearchClick,
  onLocaleClick,
  onLogoClick,
  navItems = DEFAULT_NAV,
  categoriesMenu = DEFAULT_CATEGORIES_MENU,
  featuredMenu = DEFAULT_FEATURED_MENU,
  onMenuClick,
}: MerchHeaderProps) {
  const badgeId    = useId();
  const globeId    = useId();
  const cartId     = useId();
  const catMenuId  = useId();
  const featMenuId = useId();
  const hamburgerId = useId();

  // Track which dropdown is open: "categories" | "featured" | null
  const [openDropdown, setOpenDropdown] = useState<"categories" | "featured" | null>(null);
  // Mobile nav drawer open state
  const [mobileOpen, setMobileOpen] = useState(false);
  // Expanded mobile section for sub-items
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  // Ref to the nav bar for outside-click detection
  const navRef = useRef<HTMLDivElement>(null);

  // Resolve the sign-in handler: onSignIn takes precedence, fall back to legacy onAccountClick.
  const handleSignIn = onSignIn ?? onAccountClick;

  // Close dropdown on outside mousedown or Escape
  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    },
    [],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleOutsideClick, handleKeyDown]);

  /** Toggle a dropdown by slug; close if already open. */
  function toggleDropdown(slug: "categories" | "featured") {
    setOpenDropdown((prev) => (prev === slug ? null : slug));
  }

  /** Fire the nav callback for a menu item slug. */
  function handleMenuItemSelect(slug: string) {
    setOpenDropdown(null);
    setMobileOpen(false);
    onCategoryClick?.(slug);
  }

  /** Top-level nav button click — handles both plain links and dropdown toggles. */
  function handleNavClick(item: MerchNavItem) {
    if (item.slug === "categories") {
      toggleDropdown("categories");
    } else if (item.slug === "featured") {
      toggleDropdown("featured");
    } else {
      setOpenDropdown(null);
      onCategoryClick?.(item.slug);
    }
  }

  /** Mobile hamburger click — toggle drawer + fire external callback. */
  function handleHamburgerClick() {
    setMobileOpen((prev) => !prev);
    setMobileExpanded(null);
    onMenuClick?.();
  }

  /** Mobile: toggle sub-list expand. */
  function toggleMobileSection(slug: string) {
    setMobileExpanded((prev) => (prev === slug ? null : slug));
  }

  return (
    <>
      {/* ================================================================ */}
      {/* Sticky nav tier — stays visible at ALL scroll offsets.           */}
      {/* Rendered FIRST so it sits at y=0 matching merch.riotgames.com.  */}
      {/* Real: black nav bar at y=0 (h=80), red announcement at y=80.    */}
      {/* (Real site confirmed: black nav visible at scrollY 800–15000.   */}
      {/*  #773's navHidden hide-on-scroll removed after live measurement.) */}
      {/* ================================================================ */}
      {/*
       * The sticky <header> must be a direct child of the page's scroll
       * container (or a tall ancestor), NOT wrapped in a short div whose
       * height equals only the header height. position:sticky can only slide
       * within its containing block — if the parent is 130px (nav+band) the
       * element runs out of track immediately and scrolls away.
       *
       * Fix: use a React Fragment so <header> and the announcement bar are
       * siblings in MerchPageClient's root div (min-h-screen), giving the
       * sticky element a full-page containing block.
       *
       * Also: NO overflow-x-hidden on this element — overflow-x:hidden on a
       * sticky ancestor creates an implicit scroll container (Chrome/WebKit)
       * that breaks position:sticky. The inner wrapper already uses
       * overflow-x:clip (safe for sticky) to prevent the cart-badge -right-1
       * offset from widening scrollWidth at 390px.
       */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{ fontFamily: "var(--font-merch)" }}
      >
        {/* overflow-x:clip prevents the cart badge's -right-1.5 offset from
            widening scrollWidth on narrow viewports. Unlike overflow-x:hidden
            it doesn't create a new BFC or break sticky positioning. */}
        <div
          ref={navRef}
          className="w-full overflow-x-clip"
          style={{ backgroundColor: "var(--color-merch-header-bg)" }}
        >
          {/*
           * Inner container — desktop px-9 (≈36px) matches logo x=36 @1280.
           * Mobile px-1 (4px) matches real logo x≈4–8 @390 (issue #856, delta #15).
           * h-[80px] matches real nav height (issue #856, delta #2).
           */}
          <div className="mx-auto flex h-[80px] max-w-screen-xl items-center px-1 lg:px-9">

            {/* ---------------------------------------------------------- */}
            {/* Left: wordmark lockup + games-switcher caret + fist emblem  */}
            {/* ---------------------------------------------------------- */}
            <button
              type="button"
              onClick={onLogoClick}
              aria-label="Riot Games merch — home"
              /* Mobile: pl-0 so logo lands at x≈4 (container already has px-4). Desktop: default. */
              className="flex shrink-0 items-center gap-2 pl-0 transition-opacity duration-150 hover:opacity-80 lg:pl-0"
            >
              {/*
               * Stacked 2-line RIOT / GAMES wordmark.
               * Desktop: 85×27 (horizontal proportions from full SVG).
               * Mobile (<lg): 88×32 stacked format at x=4.
               *
               * We use a single SVG for both — the real wordmark SVG
               * (viewBox="0 0 587.93 165") contains both the LoL-client mark
               * (R letters, top half) and GAMES text (bottom half).
               * Rendered at 85×27 desktop / 88×32 mobile.
               */}
              <svg
                aria-hidden="true"
                width="85"
                height="27"
                viewBox="0 0 587.93 165"
                fill="var(--color-merch-on-dark)"
                xmlns="http://www.w3.org/2000/svg"
                className="hidden lg:block"
              >
                <title>Riot Games</title>
                <path d="M98.77.33 0 46.07l24.61 93.66 18.73-2.3-5.15-58.89 6.15-2.74L54.96 136l32.01-3.93-5.69-65 6.09-2.71 11.68 66.23 32.38-3.98-6.23-71.25 6.16-2.74 12.77 72.43 32.01-3.93V19.71L98.77.33zm2.32 142.05 1.63 9.22 73.42 12.24v-30.68l-75.01 9.22h-.04zm144.49-19.22v12.63h15.57a14.84 14.84 0 0 1-1.92 7.31 13 13 0 0 1-5.6 5.11 20 20 0 0 1-8.9 1.8 17.53 17.53 0 0 1-10-2.8 17.87 17.87 0 0 1-6.44-8.14 33.06 33.06 0 0 1-2.27-12.93 31.81 31.81 0 0 1 2.32-12.81 18.14 18.14 0 0 1 6.5-8 17.27 17.27 0 0 1 9.82-2.78 19.31 19.31 0 0 1 5.36.71 14.15 14.15 0 0 1 4.33 2.09 12.92 12.92 0 0 1 3.18 3.29 15.61 15.61 0 0 1 2 4.44h17.27a27.22 27.22 0 0 0-3.46-10.28 28.84 28.84 0 0 0-7.05-8.1 32.6 32.6 0 0 0-9.91-5.29 37.91 37.91 0 0 0-12.06-1.86 37.32 37.32 0 0 0-14 2.6 32.6 32.6 0 0 0-11.36 7.61 35 35 0 0 0-7.61 12.21 46.15 46.15 0 0 0-2.73 16.44q0 11.94 4.54 20.59a32.4 32.4 0 0 0 12.69 13.27 39.84 39.84 0 0 0 35.84.84 28.39 28.39 0 0 0 11.67-11q4.25-7.19 4.24-17.2v-9.76Zm215.03 40.81V88.53h51.67v13.96h-34.62v16.76h27.99v13.96h-27.99v16.8h34.7v13.96h-51.75zm101.83-53.3a9 9 0 0 0-3.54-6.64c-2.09-1.59-5-2.38-8.69-2.38a16.63 16.63 0 0 0-6.26 1 8.62 8.62 0 0 0-3.83 2.78 6.74 6.74 0 0 0-1.33 4 6.2 6.2 0 0 0 .79 3.29 7.27 7.27 0 0 0 2.4 2.45 16.54 16.54 0 0 0 3.7 1.79 40.14 40.14 0 0 0 4.64 1.31l6.63 1.54a47.19 47.19 0 0 1 9.45 3.08 27.46 27.46 0 0 1 7.2 4.68 18.84 18.84 0 0 1 4.58 6.39 20.37 20.37 0 0 1 1.61 8.29 20.65 20.65 0 0 1-3.54 12.11 22.56 22.56 0 0 1-10.15 7.85 41.31 41.31 0 0 1-15.93 2.76 42.69 42.69 0 0 1-16.17-2.81 23.22 23.22 0 0 1-10.72-8.48q-3.83-5.66-4-14.12h16.43a10.68 10.68 0 0 0 7.05 9.94 19.37 19.37 0 0 0 7.24 1.26 18.44 18.44 0 0 0 6.66-1.09 10 10 0 0 0 4.33-3 7.22 7.22 0 0 0 1.57-4.48 6.16 6.16 0 0 0-1.42-4 10.86 10.86 0 0 0-4.14-2.81 42.07 42.07 0 0 0-6.89-2.14l-8.07-1.95q-9.65-2.3-15.23-7.26t-5.54-13.44a19.86 19.86 0 0 1 3.72-12.12 24.74 24.74 0 0 1 10.33-8.11 36.74 36.74 0 0 1 15-2.91 35.62 35.62 0 0 1 14.92 2.91 23.43 23.43 0 0 1 9.91 8.14 21.54 21.54 0 0 1 3.6 12.12Zm-113.99 53.3h-16.87v-57.35l-1.73-.02-17.04 57.37h-16.86l-16.58-57.37-2.15.02v57.35h-16.87V88.53h28.67l14.48 50.56h1.75l14.48-50.56h28.72v75.44zm-114.66 0h18.27l-25.33-75.43h-23.15l-25.37 75.43h18.3l4.93-16.54h27.42Zm-28.43-29.7 8.22-27.65h3.1l8.26 27.65Zm278.58-37.76a4 4 0 0 1-3.67-2.44 4 4 0 0 1 0-3.1 4 4 0 0 1 .85-1.27 4.25 4.25 0 0 1 1.27-.86 4.15 4.15 0 0 1 3.1 0 4.13 4.13 0 0 1 1.27.86 4.08 4.08 0 0 1 .86 1.27 4 4 0 0 1 0 3.1 4.08 4.08 0 0 1-.86 1.27 4 4 0 0 1-1.27.86 4 4 0 0 1-1.55.31Zm0-1.09a2.84 2.84 0 0 0 1.47-.39 2.94 2.94 0 0 0 1.05-1 2.93 2.93 0 0 0 0-2.92 3 3 0 0 0-1.06-1 2.93 2.93 0 0 0-2.92 0 3 3 0 0 0-1 1 2.86 2.86 0 0 0 0 2.92 3 3 0 0 0 1 1 2.83 2.83 0 0 0 1.46.39Zm-1.46-1.15V90.6h1.78a1.52 1.52 0 0 1 .69.15 1.13 1.13 0 0 1 .47.42 1.24 1.24 0 0 1 .17.66 1.16 1.16 0 0 1-.18.66 1 1 0 0 1-.48.41 1.56 1.56 0 0 1-.7.14h-1.2v-.72h1a.52.52 0 0 0 .36-.12.5.5 0 0 0 .14-.37.47.47 0 0 0-.14-.37.52.52 0 0 0-.36-.12h-.55v2.93Zm2.39-1.68.82 1.68h-1.11l-.75-1.68ZM282.41 1.03h17.05v75.44h-17.05zm98.02 37.72q0 12.42-4.71 21a32.67 32.67 0 0 1-12.79 13.17 38.57 38.57 0 0 1-36.31 0 32.75 32.75 0 0 1-12.79-13.2q-4.71-8.66-4.71-21t4.71-21.05a32.67 32.67 0 0 1 12.75-13.14 38.65 38.65 0 0 1 36.31 0 32.67 32.67 0 0 1 12.79 13.17q4.71 8.64 4.71 21.05m-17.35 0a33.35 33.35 0 0 0-2.23-13 17.47 17.47 0 0 0-6.33-8 18.57 18.57 0 0 0-19.45 0 17.57 17.57 0 0 0-6.35 8 38.59 38.59 0 0 0 0 26 17.49 17.49 0 0 0 6.35 8 18.57 18.57 0 0 0 19.45 0 17.39 17.39 0 0 0 6.33-8 33.4 33.4 0 0 0 2.23-13M246.58 50.17l8.76 26.3h18.71l-9.74-28.33h-13.23l-.79-2.44c2.52-.49 6.83-1.25 10.65-3.85a20 20 0 0 0 8.75-16.39 24.15 24.15 0 0 0-3.26-12.75 21.9 21.9 0 0 0-9.36-8.64 32.56 32.56 0 0 0-14.64-3H212v75.4h17.06v-26.3Zm-.32-15.61a19.35 19.35 0 0 1-7.26 1.18h-9.94V14.88h9.91a18.68 18.68 0 0 1 7.25 1.24 9.12 9.12 0 0 1 4.4 3.7 10 10 0 0 1 1.5 5.64 9.65 9.65 0 0 1-1.48 5.55 8.86 8.86 0 0 1-4.38 3.55M382.04 1.03v14h29.3l.8 2.45c-2.48.48-6.67 1.22-10.43 3.7v55.31h16.87v-61.5h19.62v-14Z" />
              </svg>

              {/*
               * Mobile stacked RIOT/GAMES wordmark — 88×32 at x=4.
               * Two-line stacked text matching the real mobile header.
               * Only visible at <lg breakpoint.
               */}
              <svg
                aria-hidden="true"
                width="88"
                height="32"
                viewBox="0 0 587.93 165"
                fill="var(--color-merch-on-dark)"
                xmlns="http://www.w3.org/2000/svg"
                className="block lg:hidden"
              >
                <title>Riot Games</title>
                <path d="M98.77.33 0 46.07l24.61 93.66 18.73-2.3-5.15-58.89 6.15-2.74L54.96 136l32.01-3.93-5.69-65 6.09-2.71 11.68 66.23 32.38-3.98-6.23-71.25 6.16-2.74 12.77 72.43 32.01-3.93V19.71L98.77.33zm2.32 142.05 1.63 9.22 73.42 12.24v-30.68l-75.01 9.22h-.04zm144.49-19.22v12.63h15.57a14.84 14.84 0 0 1-1.92 7.31 13 13 0 0 1-5.6 5.11 20 20 0 0 1-8.9 1.8 17.53 17.53 0 0 1-10-2.8 17.87 17.87 0 0 1-6.44-8.14 33.06 33.06 0 0 1-2.27-12.93 31.81 31.81 0 0 1 2.32-12.81 18.14 18.14 0 0 1 6.5-8 17.27 17.27 0 0 1 9.82-2.78 19.31 19.31 0 0 1 5.36.71 14.15 14.15 0 0 1 4.33 2.09 12.92 12.92 0 0 1 3.18 3.29 15.61 15.61 0 0 1 2 4.44h17.27a27.22 27.22 0 0 0-3.46-10.28 28.84 28.84 0 0 0-7.05-8.1 32.6 32.6 0 0 0-9.91-5.29 37.91 37.91 0 0 0-12.06-1.86 37.32 37.32 0 0 0-14 2.6 32.6 32.6 0 0 0-11.36 7.61 35 35 0 0 0-7.61 12.21 46.15 46.15 0 0 0-2.73 16.44q0 11.94 4.54 20.59a32.4 32.4 0 0 0 12.69 13.27 39.84 39.84 0 0 0 35.84.84 28.39 28.39 0 0 0 11.67-11q4.25-7.19 4.24-17.2v-9.76Zm215.03 40.81V88.53h51.67v13.96h-34.62v16.76h27.99v13.96h-27.99v16.8h34.7v13.96h-51.75zm101.83-53.3a9 9 0 0 0-3.54-6.64c-2.09-1.59-5-2.38-8.69-2.38a16.63 16.63 0 0 0-6.26 1 8.62 8.62 0 0 0-3.83 2.78 6.74 6.74 0 0 0-1.33 4 6.2 6.2 0 0 0 .79 3.29 7.27 7.27 0 0 0 2.4 2.45 16.54 16.54 0 0 0 3.7 1.79 40.14 40.14 0 0 0 4.64 1.31l6.63 1.54a47.19 47.19 0 0 1 9.45 3.08 27.46 27.46 0 0 1 7.2 4.68 18.84 18.84 0 0 1 4.58 6.39 20.37 20.37 0 0 1 1.61 8.29 20.65 20.65 0 0 1-3.54 12.11 22.56 22.56 0 0 1-10.15 7.85 41.31 41.31 0 0 1-15.93 2.76 42.69 42.69 0 0 1-16.17-2.81 23.22 23.22 0 0 1-10.72-8.48q-3.83-5.66-4-14.12h16.43a10.68 10.68 0 0 0 7.05 9.94 19.37 19.37 0 0 0 7.24 1.26 18.44 18.44 0 0 0 6.66-1.09 10 10 0 0 0 4.33-3 7.22 7.22 0 0 0 1.57-4.48 6.16 6.16 0 0 0-1.42-4 10.86 10.86 0 0 0-4.14-2.81 42.07 42.07 0 0 0-6.89-2.14l-8.07-1.95q-9.65-2.3-15.23-7.26t-5.54-13.44a19.86 19.86 0 0 1 3.72-12.12 24.74 24.74 0 0 1 10.33-8.11 36.74 36.74 0 0 1 15-2.91 35.62 35.62 0 0 1 14.92 2.91 23.43 23.43 0 0 1 9.91 8.14 21.54 21.54 0 0 1 3.6 12.12Zm-113.99 53.3h-16.87v-57.35l-1.73-.02-17.04 57.37h-16.86l-16.58-57.37-2.15.02v57.35h-16.87V88.53h28.67l14.48 50.56h1.75l14.48-50.56h28.72v75.44zm-114.66 0h18.27l-25.33-75.43h-23.15l-25.37 75.43h18.3l4.93-16.54h27.42Zm-28.43-29.7 8.22-27.65h3.1l8.26 27.65Zm278.58-37.76a4 4 0 0 1-3.67-2.44 4 4 0 0 1 0-3.1 4 4 0 0 1 .85-1.27 4.25 4.25 0 0 1 1.27-.86 4.15 4.15 0 0 1 3.1 0 4.13 4.13 0 0 1 1.27.86 4.08 4.08 0 0 1 .86 1.27 4 4 0 0 1 0 3.1 4.08 4.08 0 0 1-.86 1.27 4 4 0 0 1-1.27.86 4 4 0 0 1-1.55.31Zm0-1.09a2.84 2.84 0 0 0 1.47-.39 2.94 2.94 0 0 0 1.05-1 2.93 2.93 0 0 0 0-2.92 3 3 0 0 0-1.06-1 2.93 2.93 0 0 0-2.92 0 3 3 0 0 0-1 1 2.86 2.86 0 0 0 0 2.92 3 3 0 0 0 1 1 2.83 2.83 0 0 0 1.46.39Zm-1.46-1.15V90.6h1.78a1.52 1.52 0 0 1 .69.15 1.13 1.13 0 0 1 .47.42 1.24 1.24 0 0 1 .17.66 1.16 1.16 0 0 1-.18.66 1 1 0 0 1-.48.41 1.56 1.56 0 0 1-.7.14h-1.2v-.72h1a.52.52 0 0 0 .36-.12.5.5 0 0 0 .14-.37.47.47 0 0 0-.14-.37.52.52 0 0 0-.36-.12h-.55v2.93Zm2.39-1.68.82 1.68h-1.11l-.75-1.68ZM282.41 1.03h17.05v75.44h-17.05zm98.02 37.72q0 12.42-4.71 21a32.67 32.67 0 0 1-12.79 13.17 38.57 38.57 0 0 1-36.31 0 32.75 32.75 0 0 1-12.79-13.2q-4.71-8.66-4.71-21t4.71-21.05a32.67 32.67 0 0 1 12.75-13.14 38.65 38.65 0 0 1 36.31 0 32.67 32.67 0 0 1 12.79 13.17q4.71 8.64 4.71 21.05m-17.35 0a33.35 33.35 0 0 0-2.23-13 17.47 17.47 0 0 0-6.33-8 18.57 18.57 0 0 0-19.45 0 17.57 17.57 0 0 0-6.35 8 38.59 38.59 0 0 0 0 26 17.49 17.49 0 0 0 6.35 8 18.57 18.57 0 0 0 19.45 0 17.39 17.39 0 0 0 6.33-8 33.4 33.4 0 0 0 2.23-13M246.58 50.17l8.76 26.3h18.71l-9.74-28.33h-13.23l-.79-2.44c2.52-.49 6.83-1.25 10.65-3.85a20 20 0 0 0 8.75-16.39 24.15 24.15 0 0 0-3.26-12.75 21.9 21.9 0 0 0-9.36-8.64 32.56 32.56 0 0 0-14.64-3H212v75.4h17.06v-26.3Zm-.32-15.61a19.35 19.35 0 0 1-7.26 1.18h-9.94V14.88h9.91a18.68 18.68 0 0 1 7.25 1.24 9.12 9.12 0 0 1 4.4 3.7 10 10 0 0 1 1.5 5.64 9.65 9.65 0 0 1-1.48 5.55 8.86 8.86 0 0 1-4.38 3.55M382.04 1.03v14h29.3l.8 2.45c-2.48.48-6.67 1.22-10.43 3.7v55.31h16.87v-61.5h19.62v-14Z" />
              </svg>

              {/* Games-switcher down-caret — small solid triangle right of RIOT GAMES */}
              <WordmarkCaret />

              {/*
               * Riot fist emblem — white circle with recognizable clenched Riot fist.
               * issue #891 delta #1: previous path was a bowling-pin blob; replaced
               * with a proper clenched fist silhouette matching the real Riot emblem.
               * Desktop: 75×75 full-height link tap area (75×79 per issue), fist mark 75×28.
               * Mobile: white circle 28×28, red fist per issue spec.
               * Documented brand exception: real-brand asset; --color-merch-emblem-* tokens apply.
               *
               * Fist path: Riot's logo shows a clenched right fist viewed from the front,
               * with four curled fingers across the top and a thumb tucked at the left side.
               * viewBox="0 0 100 120" — fist is slightly taller than wide.
               */}
              <svg
                aria-hidden="true"
                width="46"
                height="46"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="hidden lg:block"
              >
                {/* White circle — brand asset; real site has white circle on dark header */}
                <circle cx="50" cy="50" r="50" fill="var(--color-merch-emblem-bg)" />
                {/*
                 * Riot clenched fist silhouette — stylized front-facing fist.
                 * Four curled fingers visible across top, thumb tucked at left.
                 * Knuckle row across top, palm + wrist below.
                 */}
                <path
                  d="
                    M 30 72 L 30 56 Q 30 52 26 50 L 26 44 Q 26 38 32 38 L 32 32 Q 32 26 38 26
                    L 38 22 Q 38 18 44 18 Q 50 18 50 22 L 50 18 Q 50 14 56 14 Q 62 14 62 20 L 62 26
                    Q 66 26 68 30 L 68 38 Q 72 38 74 42 L 74 50 Q 74 54 70 56 L 70 60 Q 70 66 64 68
                    L 64 72 Q 64 76 58 76 L 36 76 Q 30 76 30 72 Z
                  "
                  fill="var(--color-merch-emblem-fist)"
                />
                {/* Thumb — tucked at left side of the fist */}
                <path
                  d="M 26 50 Q 22 50 20 54 L 20 62 Q 20 66 24 68 L 30 68 L 30 56 Z"
                  fill="var(--color-merch-emblem-fist)"
                />
                {/* Knuckle ridge across top — subtle horizontal bump */}
                <path
                  d="M 32 38 Q 38 34 44 36 Q 50 34 56 36 Q 62 34 68 38"
                  fill="none"
                  stroke="var(--color-merch-emblem-bg)"
                  strokeWidth="2.5"
                />
              </svg>
              <svg
                aria-hidden="true"
                width="28"
                height="28"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                className="block lg:hidden"
              >
                {/* White circle — brand asset (mobile: white circle with red fist per issue #891 delta #1) */}
                <circle cx="50" cy="50" r="50" fill="var(--color-merch-emblem-bg)" />
                {/* Riot clenched fist silhouette */}
                <path
                  d="
                    M 30 72 L 30 56 Q 30 52 26 50 L 26 44 Q 26 38 32 38 L 32 32 Q 32 26 38 26
                    L 38 22 Q 38 18 44 18 Q 50 18 50 22 L 50 18 Q 50 14 56 14 Q 62 14 62 20 L 62 26
                    Q 66 26 68 30 L 68 38 Q 72 38 74 42 L 74 50 Q 74 54 70 56 L 70 60 Q 70 66 64 68
                    L 64 72 Q 64 76 58 76 L 36 76 Q 30 76 30 72 Z
                  "
                  fill="var(--color-merch-emblem-fist)"
                />
                {/* Thumb — tucked at left side */}
                <path
                  d="M 26 50 Q 22 50 20 54 L 20 62 Q 20 66 24 68 L 30 68 L 30 56 Z"
                  fill="var(--color-merch-emblem-fist)"
                />
                {/* Knuckle ridge */}
                <path
                  d="M 32 38 Q 38 34 44 36 Q 50 34 56 36 Q 62 34 68 38"
                  fill="none"
                  stroke="var(--color-merch-emblem-bg)"
                  strokeWidth="2.5"
                />
              </svg>
            </button>

            {/* ---------------------------------------------------------- */}
            {/* Nav links — desktop only (hidden at < lg)                   */}
            {/* gap-9 ≈ 36px inter-item gap (measured from real @1280).    */}
            {/* Full-height items (h-[78px]) for proper hit areas.         */}
            {/* ---------------------------------------------------------- */}
            <nav
              aria-label="Store navigation"
              className="ml-9 hidden flex-1 items-stretch lg:flex"
            >
              {navItems.map((item) => {
                const { slug, label, hasDropdown, isGold } = item;
                const isDropdownOpen =
                  (slug === "categories" && openDropdown === "categories") ||
                  (slug === "featured"   && openDropdown === "featured");
                const menuId =
                  slug === "categories" ? catMenuId :
                  slug === "featured"   ? featMenuId : undefined;

                return (
                  <div
                    key={slug}
                    className="relative flex items-center"
                    style={{ marginRight: "36px" }}
                  >
                    <button
                      type="button"
                      onClick={() => handleNavClick(item)}
                      aria-expanded={hasDropdown ? isDropdownOpen : undefined}
                      aria-controls={hasDropdown ? menuId : undefined}
                      aria-haspopup={hasDropdown ? "menu" : undefined}
                      className="flex h-full items-center gap-1.5 transition-colors duration-150 hover:opacity-80"
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        /* issue #891 delta #3: letter-spacing normal (real: no extra tracking on nav links).
                           Previous 0.06em was wrong — size/weight/case are frozen but tracking was not. */
                        letterSpacing: "normal",
                        textTransform: "uppercase",
                        /* issue #891 delta #3: Shop All/Categories/Featured/Sale → #d0d0d0 (--color-merch-nav-link).
                           Previous --color-merch-on-dark (#ffffff) was wrong.
                           MY SHOP: real site rgb(255,215,0) #FFD700 = --color-merch-badge-limited (issue #856, delta #17). */
                        color: isGold
                          ? "var(--color-merch-badge-limited)"
                          : "var(--color-merch-nav-link)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      {label}
                      {/* Solid filled triangle caret — real site uses triangle, not chevron */}
                      {hasDropdown && (
                        <TriangleCaret open={isDropdownOpen} />
                      )}
                      {/*
                       * Active underline removed — real site has NO underline under SHOP ALL
                       * or any other link on the homepage. (Delta #6 in issue #793.)
                       */}
                    </button>

                    {/* Dropdown menu panel */}
                    {hasDropdown && isDropdownOpen && (
                      <DropdownMenu
                        items={slug === "categories" ? categoriesMenu : featuredMenu}
                        onSelect={handleMenuItemSelect}
                        menuId={menuId!}
                      />
                    )}
                  </div>
                );
              })}
            </nav>

            {/* ---------------------------------------------------------- */}
            {/* Right cluster                                               */}
            {/*   Desktop: search(20) · globe(20) · SIGN IN(87×32) · cart  */}
            {/*   Mobile:  cart(22×21) · search(26) · globe(24) · burger(28)*/}
            {/* ---------------------------------------------------------- */}
            <div className="ml-auto flex shrink-0 items-center">

              {/* Cart — mobile only (leftmost in mobile cluster); 22×21 */}
              <button
                type="button"
                aria-label={cartCount > 0 ? `Cart — ${cartCount} items` : "Cart"}
                onClick={onCartClick}
                className="relative flex items-center justify-center transition-opacity duration-150 hover:opacity-70 lg:hidden"
                style={{
                  color: "var(--color-merch-on-dark)",
                  width: "44px",
                  height: "44px",
                }}
              >
                <CartIcon size={22} />
                {cartCount > 0 && (
                  <span
                    id={badgeId}
                    aria-hidden="true"
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold leading-none"
                    style={{
                      backgroundColor: "var(--color-merch-red)",
                      color: "var(--color-merch-on-dark)",
                    }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              {/* Search — always visible at all breakpoints.
                   issue #891 delta #2: real site shows search at 390 (four icons in right cluster:
                   cart·search·globe·burger). Previous "hidden below md" comment + class were WRONG. */}
              <button
                type="button"
                aria-label="Search"
                onClick={onSearchClick}
                className="flex items-center justify-center transition-opacity duration-150 hover:opacity-70"
                style={{
                  color: "var(--color-merch-on-dark)",
                  width: "44px",
                  height: "44px",
                }}
              >
                {/* Mobile: 26px */}
                <svg
                  aria-hidden="true"
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="block lg:hidden"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                {/* Desktop: 20px */}
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="hidden lg:block"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>

              {/* Globe / locale — mobile: 24px icon; desktop: 20px icon */}
              <button
                type="button"
                aria-label="Select language / region"
                onClick={onLocaleClick}
                className="flex items-center justify-center transition-opacity duration-150 hover:opacity-70"
                style={{
                  color: "var(--color-merch-on-dark)",
                  width: "44px",
                  height: "44px",
                }}
              >
                {/* Mobile: 24px */}
                <svg
                  aria-hidden="true"
                  id={globeId}
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="block lg:hidden"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
                </svg>
                {/* Desktop: 20px */}
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="hidden lg:block"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
                </svg>
              </button>

              {/* SIGN IN — desktop only (hidden at < lg).
                   issue #891 delta #7: real 14px/700/normal (previous 13px/600/1.04px was wrong). */}
              <button
                type="button"
                aria-label="Sign in to your account"
                onClick={handleSignIn}
                className="hidden items-center justify-center transition-opacity duration-150 hover:opacity-85 lg:flex"
                style={{
                  backgroundColor: "var(--color-merch-signin-bg)",
                  color: "var(--color-merch-on-dark)",
                  borderRadius: "6.4px",
                  width: "87px",
                  height: "32px",
                  fontSize: "14px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "normal",
                  border: "none",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  marginLeft: "8px",
                }}
              >
                Sign In
              </button>

              {/* Hamburger — mobile only (hidden at lg+); 28×35 icon, tap area 28×78 (full bar height).
                   issue #891 delta #12: real svg 28×35, tap area 28×78 (full bar height).
                   Burger icon stays ☰ even when drawer is open (real site behavior). */}
              <button
                type="button"
                id={hamburgerId}
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileOpen}
                aria-controls="merch-mobile-nav"
                onClick={handleHamburgerClick}
                className="flex items-center justify-center transition-opacity duration-150 hover:opacity-70 lg:hidden"
                style={{
                  color: "var(--color-merch-on-dark)",
                  width: "28px",
                  height: "78px",
                  paddingRight: "0",
                }}
              >
                {/* Hamburger icon 28×35 — stays ☰ (does not change to ✕ on open) */}
                <svg
                  aria-hidden="true"
                  width="28"
                  height="35"
                  viewBox="0 0 28 35"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="0" y1="9" x2="28" y2="9" />
                  <line x1="0" y1="17.5" x2="28" y2="17.5" />
                  <line x1="0" y1="26" x2="28" y2="26" />
                </svg>
              </button>

              {/* Cart — desktop only (rightmost); 22×21 cart glyph */}
              <button
                type="button"
                aria-label={cartCount > 0 ? `Cart — ${cartCount} items` : "Cart"}
                onClick={onCartClick}
                className="relative hidden items-center justify-center transition-opacity duration-150 hover:opacity-70 lg:flex"
                style={{
                  color: "var(--color-merch-on-dark)",
                  width: "44px",
                  height: "44px",
                  marginLeft: "4px",
                }}
              >
                <CartIcon size={22} />
                {cartCount > 0 && (
                  <span
                    id={cartId}
                    aria-hidden="true"
                    className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold leading-none"
                    style={{
                      backgroundColor: "var(--color-merch-red)",
                      color: "var(--color-merch-on-dark)",
                    }}
                  >
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>
        {/* ---------------------------------------------------------------- */}
        {/* Mobile nav drawer — full-screen WHITE panel                      */}
        {/*                                                                  */}
        {/* Rendered OUTSIDE the overflow-x-clip wrapper so it is not        */}
        {/* clipped. Uses position:fixed to escape the header stacking       */}
        {/* context and cover the full viewport below the sticky nav bar.   */}
        {/*                                                                  */}
        {/* Real site (issue #856, deltas #10–14):                          */}
        {/*   · Panel starts at y=130 (nav 80 + band 50) so announcement    */}
        {/*     band remains visible behind the open drawer.                 */}
        {/*   · 1px amber (#e59700) left-edge line on the panel.            */}
        {/*   · Flat list — two groups separated by a single hairline.      */}
        {/*   · NO per-row dividers between items within a group.           */}
        {/*   · Group 1: SHOP ALL / FEATURED / SALE / MY SHOP               */}
        {/*   · Group 2: SHOP BY GAME / APPAREL / COLLECTIBLES / ART /      */}
        {/*              ACCESSORIES + Sign In row at bottom.                */}
        {/*   · Typography: riotSans 14px/600/uppercase; row pitch 56px.    */}
        {/* ---------------------------------------------------------------- */}
        {mobileOpen && (
          <nav
            id="merch-mobile-nav"
            aria-label="Mobile store navigation"
            style={{
              backgroundColor: "var(--color-merch-bg)",
              /*
               * issue #891 delta #8: real sheet is outlined with a thin BLUE border
               * (not the previous gold left-edge stripe from #856 delta #13).
               */
              border: "1px solid var(--color-merch-menu-sheet-border)",
              width: "100%",
              maxWidth: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              position: "fixed",
              /* y=130: announcement band (50px) remains visible above drawer */
              top: "130px",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 200,
            }}
          >
            {/* Group 1 — SHOP ALL / FEATURED / SALE / MY SHOP */}
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {MOBILE_GROUP_1.map(({ slug, label, isGold }) => (
                <li key={slug}>
                  <button
                    type="button"
                    onClick={() => handleMenuItemSelect(slug)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      height: "56px",
                      /*
                       * issue #891 delta #8: item left padding 32.5px (real measured).
                       * Previous: 20px was wrong.
                       */
                      padding: "0 20px 0 32.5px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 600,
                      fontFamily: "var(--font-merch-display)",
                      textTransform: "uppercase",
                      color: isGold
                        ? "var(--color-merch-badge-limited)"
                        : "var(--color-merch-ink)",
                      textAlign: "left",
                    }}
                  >
                    {label}
                    {/*
                     * issue #891 delta #8: thin outline chevron › (~10px), right-aligned.
                     * Previous: large solid black triangles (~20px) were wrong.
                     */}
                    <svg
                      aria-hidden="true"
                      width="10"
                      height="16"
                      viewBox="0 0 10 16"
                      fill="none"
                      stroke={isGold ? "var(--color-merch-badge-limited)" : "var(--color-merch-ink)"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ flexShrink: 0 }}
                    >
                      <polyline points="2,1 9,8 2,15" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            {/* Group boundary hairline — only hairline between groups (no per-row dividers) */}
            <div
              aria-hidden="true"
              style={{ height: "1px", backgroundColor: "var(--color-merch-border)" }}
            />

            {/* Group 2 — SHOP BY GAME / APPAREL / COLLECTIBLES / ART / ACCESSORIES */}
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {MOBILE_GROUP_2.map(({ slug, label }) => (
                <li key={slug}>
                  <button
                    type="button"
                    onClick={() => handleMenuItemSelect(slug)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      height: "56px",
                      padding: "0 20px 0 32.5px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: 600,
                      fontFamily: "var(--font-merch-display)",
                      textTransform: "uppercase",
                      color: "var(--color-merch-ink)",
                      textAlign: "left",
                    }}
                  >
                    {label}
                    {/* Thin outline chevron › */}
                    <svg
                      aria-hidden="true"
                      width="10"
                      height="16"
                      viewBox="0 0 10 16"
                      fill="none"
                      stroke="var(--color-merch-ink)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ flexShrink: 0 }}
                    >
                      <polyline points="2,1 9,8 2,15" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            {/*
             * Divider above SIGN IN — issue #891 delta #8: real site has a divider
             * separating SIGN IN from the rest of group 2.
             */}
            <div
              aria-hidden="true"
              style={{ height: "1px", backgroundColor: "var(--color-merch-border)" }}
            />

            {/* Sign In row — with its own chevron (issue #891 delta #8) */}
            <button
              type="button"
              onClick={handleSignIn}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                height: "56px",
                padding: "0 20px 0 32.5px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "var(--font-merch-display)",
                textTransform: "uppercase",
                color: "var(--color-merch-ink)",
                textAlign: "left",
              }}
            >
              Sign In
              {/* Thin outline chevron › — issue #891 delta #8: SIGN IN has its own chevron */}
              <svg
                aria-hidden="true"
                width="10"
                height="16"
                viewBox="0 0 10 16"
                fill="none"
                stroke="var(--color-merch-ink)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
                style={{ flexShrink: 0 }}
              >
                <polyline points="2,1 9,8 2,15" />
              </svg>
            </button>
          </nav>
        )}
      </header>

      {/* ================================================================ */}
      {/* Announcement bar — NOT sticky; scrolls away with page content.   */}
      {/*                                                                  */}
      {/* Rendered AFTER the sticky nav so the DOM/visual order matches    */}
      {/* merch.riotgames.com: nav at y=0 (h=80), band at y=80 (h=50).    */}
      {/*                                                                  */}
      {/* Two-tone layout (issue #856 deltas #6–8):                       */}
      {/*   Left gutter: brighter EB0029 red dismiss block                  */}
      {/*     · ≥lg (1280): 94px wide (real measured; darker track at x=94) */}
      {/*     · <lg (390):  50px wide (touch-target, matching real mobile)  */}
      {/*   Pill (x=94 @1280 / x=50 @390): darker C60023 red              */}
      {/*     · @1280: full-bleed to right edge — flat band                 */}
      {/*     · @390:  inset rounded pill — border-radius 36px, padding    */}
      {/*              8×24, 1px solid #EB0029 border, cap visible on left  */}
      {/*                                                                  */}
      {/* Marquee text: Inter 14px/600 uppercase (real measured, #856 #7). */}
      {/* minHeight: 50px (real measured nav+band = 80+50 = 130, #856 #2). */}
      {/* ================================================================ */}
      {announcement && (
        <>
          {/* Scoped keyframes — pure CSS, no JS timers needed */}
          <style>{`
            @keyframes merch-marquee {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @media (prefers-reduced-motion: reduce) {
              .merch-marquee-track {
                animation: none !important;
              }
            }
          `}</style>

          <div
            role="status"
            aria-live="polite"
            className="flex w-full items-stretch overflow-x-hidden"
            style={{ minHeight: "50px" }}
          >
            {/*
             * Dismiss block — brighter red (EB0029 / --color-merch-announcement-dismiss-bg).
             * Width: 50px @390 (<lg) → 94px @1280 (≥lg). Flush at x=0.
             * 24×24 stroke SVG ✕ centered in the block.
             */}
            <button
              type="button"
              aria-label="Dismiss announcement"
              onClick={onDismissAnnouncement}
              className="flex shrink-0 items-center justify-center transition-opacity duration-150 hover:opacity-85"
              style={{
                backgroundColor: "var(--color-merch-announcement-dismiss-bg)",
                color: "var(--color-merch-on-dark)",
                /* 50px on mobile, 94px at ≥lg via inline CSS variable pattern.
                   Tailwind can't apply the 94px value with a clean class, so we
                   duplicate via a data attribute approach — simplest: two spans. */
                width: "50px",
                minHeight: "50px",
                border: "none",
                cursor: "pointer",
              }}
              /* lg:w-[94px] applied through the wrapper className trick below */
            >
              <DismissIcon />
            </button>
            {/*
             * Extra dismiss-block width for ≥lg — an invisible spacer that pushes
             * the pill to x=94. This avoids needing inline-style media queries.
             * Only visible at ≥lg; fills 44px (94-50) to reach the 94px total.
             */}
            <div
              className="hidden lg:block shrink-0"
              aria-hidden="true"
              style={{
                width: "44px",
                minHeight: "50px",
                backgroundColor: "var(--color-merch-announcement-dismiss-bg)",
              }}
            />

            {/*
             * Outer track — fills remaining width. At ≥lg this is the flat C60023
             * band (no rounded corners). At <lg we apply rounded-pill treatment.
             */}
            <div
              className="flex flex-1 items-center overflow-x-hidden"
              style={{
                /* Flat band at desktop; pill treatment overridden below at mobile */
                backgroundColor: "var(--color-merch-announcement-bg)",
                padding: "0 20px",
              }}
            >
              {/*
               * @390 inner pill track — inset rounded capsule:
               *   bg #C60023, 1px solid #EB0029 border, border-radius 36px, padding 8×24.
               * At ≥lg the pill wrapper is transparent (not needed — band is already styled).
               * We wrap the marquee in a pill div that's only styled at mobile widths.
               */}
              <div
                className="flex w-full items-center overflow-x-hidden lg:contents"
                style={{
                  /* Mobile: rounded pill shape */
                  borderRadius: "36px",
                  border: "1px solid var(--color-merch-announcement-dismiss-bg)",
                  backgroundColor: "var(--color-merch-announcement-bg)",
                  padding: "8px 24px",
                }}
              >
                {/*
                 * Marquee track — 20 copies side-by-side; animates translateX –50%
                 * (one full copy width) in a loop for a seamless repeat effect.
                 * issue #891 delta #4: 16px/600/uppercase, ~0.08em tracking, ~74px gap.
                 * Previous: 14px, normal tracking, 80px gap (issue #856 delta #7 was stale).
                 */}
                <div
                  className="merch-marquee-track"
                  aria-hidden="true"
                  style={{
                    display: "flex",
                    whiteSpace: "nowrap",
                    width: "max-content",
                    animation: "merch-marquee 28s linear infinite",
                  }}
                >
                  {Array.from({ length: 20 }, (_, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        color: "var(--color-merch-on-dark)",
                        paddingRight: "74px",
                      }}
                    >
                      {announcement}
                    </span>
                  ))}
                </div>
                {/* Screen-reader-only single copy so SR doesn't read 20 repetitions */}
                <span className="sr-only">{announcement}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
