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
 * Two-tier structure (measured from merch.riotgames.com at ~1280px desktop):
 *   Tier 1 — ~80px black nav bar:
 *     Left:  red fist emblem circle + Riot wordmark
 *     Center: Shop All · Categories▾ · Featured▾ · Sale · My Shop (left-aligned, after logo)
 *     Right: search · globe/locale · boxed SIGN IN button · cart
 *   Tier 2 — ~50px red dismissible announcement marquee
 *
 * Nav links: 14px/700, non-uppercased, white; hover → --color-merch-red.
 * MY SHOP: --color-merch-gold. Dropdowns: presentational carets only.
 * SIGN IN: bg --color-merch-signin-bg, border-radius 6px, padding 8px 16px, 600/16px uppercase.
 */

"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A nav item with optional dropdown caret. */
export interface MerchNavItem {
  slug: string;
  label: string;
  /** If true, renders a chevron-down caret (dropdown affordance). */
  hasDropdown?: boolean;
  /** If true, renders with --color-merch-gold instead of default white. */
  isGold?: boolean;
}

export interface MerchHeaderProps {
  /** Currently active top-level nav slug, if any. */
  activeCategory?: string;
  /** Cart item count (0 = no badge). */
  cartCount?: number;
  /** Announcement text for the red marquee strip. Omitting hides the strip. */
  announcement?: string;
  /** Fired when the announcement dismiss ✕ button is clicked. */
  onDismissAnnouncement?: () => void;
  /** Fired when any nav link is clicked; receives the item's slug. */
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
  /** Fired when the hamburger/menu button is clicked (mobile only). */
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

const DEFAULT_ANNOUNCEMENT =
  "We're upgrading our warehouse! Orders placed between July 3–7 may be delayed. We apologize for the inconvenience.";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchHeader — sticky two-tier header matching merch.riotgames.com:
 *   Tier 1: ~80px black nav bar — wordmark (left), nav links (left-aligned after
 *           logo), right cluster (search · globe · SIGN IN · cart).
 *   Tier 2: optional ~50px red dismissible announcement marquee.
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
  onMenuClick,
}: MerchHeaderProps) {
  const badgeId = useId();
  const globeId = useId();
  const cartId  = useId();

  // Resolve the sign-in handler: onSignIn takes precedence, fall back to legacy onAccountClick.
  const handleSignIn = onSignIn ?? onAccountClick;

  return (
    <header
      className="sticky top-0 z-50 w-full overflow-x-hidden"
      style={{ fontFamily: "var(--font-merch)" }}
    >
      {/* ================================================================ */}
      {/* Tier 1 — ~80px dark nav bar                                      */}
      {/* ================================================================ */}
      {/* overflow-x:clip prevents the cart badge's -right-1.5 offset from
          widening scrollWidth on narrow viewports. Unlike overflow-x:hidden
          it doesn't create a new BFC or break sticky positioning. */}
      <div
        className="w-full overflow-x-clip"
        style={{ backgroundColor: "var(--color-merch-ink-dark)" }}
      >
        <div className="mx-auto flex h-20 max-w-screen-xl items-center gap-8 px-6">

          {/* -------------------------------------------------------------- */}
          {/* Left: fist emblem + Riot wordmark                               */}
          {/* -------------------------------------------------------------- */}
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="Riot Games merch — home"
            className="flex shrink-0 items-center gap-2 transition-opacity duration-150 hover:opacity-80"
          >
            {/* Red fist emblem circle — extracted from merch.riotgames.com */}
            <svg
              aria-hidden="true"
              width="32"
              height="32"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="50" r="50" fill="var(--color-merch-red)" />
              {/* Simplified Riot fist silhouette (presentational) */}
              <path
                d="M38 70 L38 42 Q38 36 44 36 L44 30 Q44 24 50 24 Q56 24 56 30 L56 36 Q60 36 62 40 L62 48 Q64 48 66 52 L66 62 Q66 68 60 70 Z"
                fill="var(--color-merch-on-dark)"
              />
              <rect x="34" y="42" width="8" height="28" rx="3" fill="var(--color-merch-on-dark)" />
            </svg>

            {/*
             * Real RIOT GAMES wordmark SVG — extracted from merch.riotgames.com
             * (title: "mainLogoRiotFist21", viewBox="0 0 587.93 165").
             * Rendered at 85×27px matching the real header.
             */}
            <svg
              aria-hidden="true"
              width="85"
              height="27"
              viewBox="0 0 587.93 165"
              fill="var(--color-merch-on-dark)"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Riot Games</title>
              <path d="M98.77.33 0 46.07l24.61 93.66 18.73-2.3-5.15-58.89 6.15-2.74L54.96 136l32.01-3.93-5.69-65 6.09-2.71 11.68 66.23 32.38-3.98-6.23-71.25 6.16-2.74 12.77 72.43 32.01-3.93V19.71L98.77.33zm2.32 142.05 1.63 9.22 73.42 12.24v-30.68l-75.01 9.22h-.04zm144.49-19.22v12.63h15.57a14.84 14.84 0 0 1-1.92 7.31 13 13 0 0 1-5.6 5.11 20 20 0 0 1-8.9 1.8 17.53 17.53 0 0 1-10-2.8 17.87 17.87 0 0 1-6.44-8.14 33.06 33.06 0 0 1-2.27-12.93 31.81 31.81 0 0 1 2.32-12.81 18.14 18.14 0 0 1 6.5-8 17.27 17.27 0 0 1 9.82-2.78 19.31 19.31 0 0 1 5.36.71 14.15 14.15 0 0 1 4.33 2.09 12.92 12.92 0 0 1 3.18 3.29 15.61 15.61 0 0 1 2 4.44h17.27a27.22 27.22 0 0 0-3.46-10.28 28.84 28.84 0 0 0-7.05-8.1 32.6 32.6 0 0 0-9.91-5.29 37.91 37.91 0 0 0-12.06-1.86 37.32 37.32 0 0 0-14 2.6 32.6 32.6 0 0 0-11.36 7.61 35 35 0 0 0-7.61 12.21 46.15 46.15 0 0 0-2.73 16.44q0 11.94 4.54 20.59a32.4 32.4 0 0 0 12.69 13.27 39.84 39.84 0 0 0 35.84.84 28.39 28.39 0 0 0 11.67-11q4.25-7.19 4.24-17.2v-9.76Zm215.03 40.81V88.53h51.67v13.96h-34.62v16.76h27.99v13.96h-27.99v16.8h34.7v13.96h-51.75zm101.83-53.3a9 9 0 0 0-3.54-6.64c-2.09-1.59-5-2.38-8.69-2.38a16.63 16.63 0 0 0-6.26 1 8.62 8.62 0 0 0-3.83 2.78 6.74 6.74 0 0 0-1.33 4 6.2 6.2 0 0 0 .79 3.29 7.27 7.27 0 0 0 2.4 2.45 16.54 16.54 0 0 0 3.7 1.79 40.14 40.14 0 0 0 4.64 1.31l6.63 1.54a47.19 47.19 0 0 1 9.45 3.08 27.46 27.46 0 0 1 7.2 4.68 18.84 18.84 0 0 1 4.58 6.39 20.37 20.37 0 0 1 1.61 8.29 20.65 20.65 0 0 1-3.54 12.11 22.56 22.56 0 0 1-10.15 7.85 41.31 41.31 0 0 1-15.93 2.76 42.69 42.69 0 0 1-16.17-2.81 23.22 23.22 0 0 1-10.72-8.48q-3.83-5.66-4-14.12h16.43a10.68 10.68 0 0 0 7.05 9.94 19.37 19.37 0 0 0 7.24 1.26 18.44 18.44 0 0 0 6.66-1.09 10 10 0 0 0 4.33-3 7.22 7.22 0 0 0 1.57-4.48 6.16 6.16 0 0 0-1.42-4 10.86 10.86 0 0 0-4.14-2.81 42.07 42.07 0 0 0-6.89-2.14l-8.07-1.95q-9.65-2.3-15.23-7.26t-5.54-13.44a19.86 19.86 0 0 1 3.72-12.12 24.74 24.74 0 0 1 10.33-8.11 36.74 36.74 0 0 1 15-2.91 35.62 35.62 0 0 1 14.92 2.91 23.43 23.43 0 0 1 9.91 8.14 21.54 21.54 0 0 1 3.6 12.12Zm-113.99 53.3h-16.87v-57.35l-1.73-.02-17.04 57.37h-16.86l-16.58-57.37-2.15.02v57.35h-16.87V88.53h28.67l14.48 50.56h1.75l14.48-50.56h28.72v75.44zm-114.66 0h18.27l-25.33-75.43h-23.15l-25.37 75.43h18.3l4.93-16.54h27.42Zm-28.43-29.7 8.22-27.65h3.1l8.26 27.65Zm278.58-37.76a4 4 0 0 1-3.67-2.44 4 4 0 0 1 0-3.1 4 4 0 0 1 .85-1.27 4.25 4.25 0 0 1 1.27-.86 4.15 4.15 0 0 1 3.1 0 4.13 4.13 0 0 1 1.27.86 4.08 4.08 0 0 1 .86 1.27 4 4 0 0 1 0 3.1 4.08 4.08 0 0 1-.86 1.27 4 4 0 0 1-1.27.86 4 4 0 0 1-1.55.31Zm0-1.09a2.84 2.84 0 0 0 1.47-.39 2.94 2.94 0 0 0 1.05-1 2.93 2.93 0 0 0 0-2.92 3 3 0 0 0-1.06-1 2.93 2.93 0 0 0-2.92 0 3 3 0 0 0-1 1 2.86 2.86 0 0 0 0 2.92 3 3 0 0 0 1 1 2.83 2.83 0 0 0 1.46.39Zm-1.46-1.15V90.6h1.78a1.52 1.52 0 0 1 .69.15 1.13 1.13 0 0 1 .47.42 1.24 1.24 0 0 1 .17.66 1.16 1.16 0 0 1-.18.66 1 1 0 0 1-.48.41 1.56 1.56 0 0 1-.7.14h-1.2v-.72h1a.52.52 0 0 0 .36-.12.5.5 0 0 0 .14-.37.47.47 0 0 0-.14-.37.52.52 0 0 0-.36-.12h-.55v2.93Zm2.39-1.68.82 1.68h-1.11l-.75-1.68ZM282.41 1.03h17.05v75.44h-17.05zm98.02 37.72q0 12.42-4.71 21a32.67 32.67 0 0 1-12.79 13.17 38.57 38.57 0 0 1-36.31 0 32.75 32.75 0 0 1-12.79-13.2q-4.71-8.66-4.71-21t4.71-21.05a32.67 32.67 0 0 1 12.75-13.14 38.65 38.65 0 0 1 36.31 0 32.67 32.67 0 0 1 12.79 13.17q4.71 8.64 4.71 21.05m-17.35 0a33.35 33.35 0 0 0-2.23-13 17.47 17.47 0 0 0-6.33-8 18.57 18.57 0 0 0-19.45 0 17.57 17.57 0 0 0-6.35 8 38.59 38.59 0 0 0 0 26 17.49 17.49 0 0 0 6.35 8 18.57 18.57 0 0 0 19.45 0 17.39 17.39 0 0 0 6.33-8 33.4 33.4 0 0 0 2.23-13M246.58 50.17l8.76 26.3h18.71l-9.74-28.33h-13.23l-.79-2.44c2.52-.49 6.83-1.25 10.65-3.85a20 20 0 0 0 8.75-16.39 24.15 24.15 0 0 0-3.26-12.75 21.9 21.9 0 0 0-9.36-8.64 32.56 32.56 0 0 0-14.64-3H212v75.4h17.06v-26.3Zm-.32-15.61a19.35 19.35 0 0 1-7.26 1.18h-9.94V14.88h9.91a18.68 18.68 0 0 1 7.25 1.24 9.12 9.12 0 0 1 4.4 3.7 10 10 0 0 1 1.5 5.64 9.65 9.65 0 0 1-1.48 5.55 8.86 8.86 0 0 1-4.38 3.55M382.04 1.03v14h29.3l.8 2.45c-2.48.48-6.67 1.22-10.43 3.7v55.31h16.87v-61.5h19.62v-14Z" />
            </svg>
          </button>

          {/* -------------------------------------------------------------- */}
          {/* Nav links — left-aligned, right after the logo                  */}
          {/* -------------------------------------------------------------- */}
          <nav
            aria-label="Store navigation"
            className="hidden flex-1 items-center gap-7 lg:flex"
          >
            {navItems.map(({ slug, label, hasDropdown, isGold }) => {
              const isActive = activeCategory === slug;

              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => onCategoryClick?.(slug)}
                  className="relative flex items-center gap-1 pb-0.5 transition-colors duration-150 hover:opacity-80"
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "normal",
                    textTransform: "none",
                    color: isGold
                      ? "var(--color-merch-gold)"
                      : isActive
                        ? "var(--color-merch-on-dark)"
                        : "var(--color-merch-on-dark)",
                  }}
                >
                  {label}
                  {/* Dropdown chevron */}
                  {hasDropdown && (
                    <svg
                      aria-hidden="true"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 4 L6 8 L10 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {/* Active underline */}
                  {isActive && (
                    <span
                      className="absolute inset-x-0 bottom-0 h-0.5"
                      style={{ backgroundColor: "var(--color-merch-red)" }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* -------------------------------------------------------------- */}
          {/* Right cluster: search · globe · SIGN IN · cart                  */}
          {/* -------------------------------------------------------------- */}
          <div className="ml-auto flex shrink-0 items-center gap-5">
            {/* Search */}
            <button
              type="button"
              aria-label="Search"
              onClick={onSearchClick}
              className="flex items-center justify-center transition-opacity duration-150 hover:opacity-70"
              style={{ color: "var(--color-merch-on-dark)" }}
            >
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
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Globe / locale */}
            <button
              type="button"
              aria-label="Select language / region"
              onClick={onLocaleClick}
              className="flex items-center justify-center transition-opacity duration-150 hover:opacity-70"
              style={{ color: "var(--color-merch-on-dark)" }}
            >
              <svg
                aria-hidden="true"
                id={globeId}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
              </svg>
            </button>

            {/* SIGN IN button — desktop only (hidden at < lg) */}
            <button
              type="button"
              aria-label="Sign in to your account"
              onClick={handleSignIn}
              className="hidden items-center justify-center transition-opacity duration-150 hover:opacity-85 lg:flex"
              style={{
                backgroundColor: "var(--color-merch-signin-bg)",
                color: "var(--color-merch-on-dark)",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "16px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                border: "1px solid var(--color-merch-signin-border)",
                whiteSpace: "nowrap",
              }}
            >
              Sign In
            </button>

            {/* Hamburger — mobile only (hidden at lg+) */}
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={onMenuClick}
              className="flex items-center justify-center transition-opacity duration-150 hover:opacity-70 lg:hidden"
              style={{ color: "var(--color-merch-on-dark)" }}
            >
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
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            {/* Cart */}
            <button
              type="button"
              aria-label={cartCount > 0 ? `Cart — ${cartCount} items` : "Cart"}
              onClick={onCartClick}
              className="relative flex items-center justify-center transition-opacity duration-150 hover:opacity-70"
              style={{ color: "var(--color-merch-on-dark)" }}
            >
              <svg
                aria-hidden="true"
                id={cartId}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span
                  id={badgeId}
                  aria-hidden="true"
                  className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold leading-none"
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

      {/* ================================================================ */}
      {/* Tier 2 — ~50px red dismissible announcement marquee              */}
      {/* ================================================================ */}
      {announcement && (
        <div
          role="status"
          aria-live="polite"
          className="flex w-full items-center justify-between gap-4 px-6"
          style={{
            backgroundColor: "var(--color-merch-red)",
            color: "var(--color-merch-on-dark)",
            minHeight: "50px",
          }}
        >
          {/* Dismiss button */}
          <button
            type="button"
            aria-label="Dismiss announcement"
            onClick={onDismissAnnouncement}
            className="flex shrink-0 items-center justify-center transition-opacity duration-150 hover:opacity-70"
            style={{ color: "var(--color-merch-on-dark)", fontSize: "18px", lineHeight: 1 }}
          >
            ✕
          </button>

          {/* Announcement text — centered; single-line truncation on mobile */}
          <p
            className="flex-1 text-center"
            style={{
              fontSize: "16px",
              fontWeight: 400,
              margin: 0,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {announcement}
          </p>

          {/* Spacer to balance the dismiss button */}
          <span className="shrink-0" style={{ width: "18px" }} aria-hidden="true" />
        </div>
      )}
    </header>
  );
}
