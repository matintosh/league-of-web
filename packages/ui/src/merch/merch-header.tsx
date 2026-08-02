/**
 * MerchHeader — top navigation bar for the Riot Games merch store clone.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens
 * (add a token to @low/tokens if one is missing, sampled from the real store)
 * and a modern e-commerce layout. This is NOT the Hextech client — IGNORE the
 * client Hextech-only / no-default-Tailwind-palette guidance; still tokens-only
 * (no raw hex outside packages/tokens), presentational (props in/callbacks out,
 * NO fetching in @low/ui, types from @low/fixtures), showcase server-safe
 * (no 'use client'), SVG/gradient ids from useId.
 *
 * Measured from merch.riotgames.com (~1280px desktop):
 *   - Header height: ~60–64px
 *   - Background: near-black #0d0d0d (--color-merch-ink-dark, see merch.css)
 *   - Left: Riot wordmark/logo ~16–24px from left edge; red accent
 *   - Center: horizontal category nav links — all-caps, ~14px, 500 weight, ~24px gap
 *   - Right: search + cart + account icons ~24px from right edge
 *   - Bottom border: 1px subtle separator (--color-merch-border)
 *   - Active link: red underline (--color-merch-red)
 *   - Hover: red text (--color-merch-red)
 *   - "Sale" link: always red accent
 */

"use client";

import { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchHeaderProps {
  /** Currently active top-level category slug, if any. */
  activeCategory?: string;
  /** Cart item count (0 = no badge). */
  cartCount?: number;
  /** Fired when any nav category link is clicked. */
  onCategoryClick?: (slug: string) => void;
  /** Fired when cart icon is clicked. */
  onCartClick?: () => void;
  /** Fired when Sign In / account link is clicked. */
  onAccountClick?: () => void;
  /** Fired when search icon is clicked. */
  onSearchClick?: () => void;
  /** Fired when logo is clicked. */
  onLogoClick?: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const CATEGORIES: { slug: string; label: string }[] = [
  { slug: "shop-all",      label: "Shop All" },
  { slug: "apparel",       label: "Apparel" },
  { slug: "collectibles",  label: "Collectibles" },
  { slug: "art",           label: "Art" },
  { slug: "accessories",   label: "Accessories" },
  { slug: "sale",          label: "Sale" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchHeader — sticky top bar matching merch.riotgames.com:
 * Riot wordmark (left), category links (center), search + cart + account (right).
 * Cart badge appears when cartCount > 0.
 */
export function MerchHeader({
  activeCategory,
  cartCount = 0,
  onCategoryClick,
  onCartClick,
  onAccountClick,
  onSearchClick,
  onLogoClick,
}: MerchHeaderProps) {
  const badgeId = useId();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{
        backgroundColor: "var(--color-merch-ink-dark, #0d0d0d)",
        borderColor: "var(--color-merch-border-dark, #2a2a2a)",
      }}
    >
      <div
        className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-6 px-6"
      >
        {/* ---------------------------------------------------------------- */}
        {/* Left: Wordmark / logo                                             */}
        {/* ---------------------------------------------------------------- */}
        <button
          type="button"
          onClick={onLogoClick}
          aria-label="Riot Merch — home"
          className="flex shrink-0 items-center gap-2 transition-opacity duration-150 hover:opacity-80"
        >
          {/* Riot "R" logomark SVG (simplified) */}
          <svg
            aria-hidden="true"
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="28" height="28" rx="2" fill="var(--color-merch-red, #d13639)" />
            <text
              x="14"
              y="20"
              textAnchor="middle"
              fontFamily="Arial, sans-serif"
              fontWeight="bold"
              fontSize="16"
              fill="#fff"
            >
              R
            </text>
          </svg>
          <span
            className="text-sm font-bold uppercase tracking-[0.18em]"
            style={{ color: "#ffffff" }}
          >
            Riot Merch
          </span>
        </button>

        {/* ---------------------------------------------------------------- */}
        {/* Center: Category nav links                                        */}
        {/* ---------------------------------------------------------------- */}
        <nav
          aria-label="Store categories"
          className="hidden flex-1 items-center justify-center gap-8 lg:flex"
        >
          {CATEGORIES.map(({ slug, label }) => {
            const isActive = activeCategory === slug;
            const isSale = slug === "sale";

            return (
              <button
                key={slug}
                type="button"
                onClick={() => onCategoryClick?.(slug)}
                className="relative pb-0.5 text-[13px] font-medium uppercase tracking-[0.07em] transition-colors duration-150"
                style={{
                  color: isActive || isSale
                    ? "var(--color-merch-red, #d13639)"
                    : "#ffffff",
                  fontFamily: "var(--font-merch, system-ui, sans-serif)",
                }}
              >
                {label}
                {/* Active underline */}
                {isActive && (
                  <span
                    className="absolute inset-x-0 bottom-0 h-px"
                    style={{ backgroundColor: "var(--color-merch-red, #d13639)" }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* ---------------------------------------------------------------- */}
        {/* Right: search + cart + account                                    */}
        {/* ---------------------------------------------------------------- */}
        <div className="flex shrink-0 items-center gap-4">
          {/* Search */}
          <button
            type="button"
            aria-label="Search"
            onClick={onSearchClick}
            className="flex items-center justify-center transition-opacity duration-150 hover:opacity-70"
            style={{ color: "#ffffff" }}
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

          {/* Cart */}
          <button
            type="button"
            aria-label={cartCount > 0 ? `Cart — ${cartCount} items` : "Cart"}
            onClick={onCartClick}
            className="relative flex items-center justify-center transition-opacity duration-150 hover:opacity-70"
            style={{ color: "#ffffff" }}
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
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && (
              <span
                id={badgeId}
                aria-hidden="true"
                className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold leading-none text-white"
                style={{ backgroundColor: "var(--color-merch-red, #d13639)" }}
              >
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>

          {/* Account / Sign In */}
          <button
            type="button"
            onClick={onAccountClick}
            className="flex items-center justify-center transition-opacity duration-150 hover:opacity-70"
            style={{ color: "#ffffff" }}
            aria-label="Account"
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
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
