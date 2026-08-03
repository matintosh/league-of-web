"use client";

/**
 * MerchFilterSortBar — filter chips + sort dropdown for collection/shop-all pages.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client — IGNORE Hextech-only / no-default-palette
 * guidance; still tokens-only (no raw hex outside packages/tokens; NO hex
 * fallbacks in var(); NO bare hex like #ffffff — use --color-merch-on-dark),
 * presentational (props in/callbacks out; NO fetching in @low/ui), showcase
 * server-safe (no 'use client'), SVG ids from useId.
 *
 * Measured from merch.riotgames.com category pages (~1280px desktop):
 *   Bar: 52px height, position sticky top: 64px (below header), z-index: 40
 *   Background: full-width --color-merch-surface
 *   Border-bottom: 1px solid --color-merch-border
 *   Container: max-w-7xl mx-auto px-6, flex row, items-center
 *   Count: left-aligned, 13px, --color-merch-muted, font-weight 400
 *   Filter chips: row after count, 32px height, 12px/16px padding, 11px uppercase
 *     Default: 1px border --color-merch-border, bg --color-merch-bg
 *     Hover: border-color --color-merch-ink
 *     Active: bg --color-merch-ink, text --color-merch-on-dark, border transparent
 *   Sort: right-aligned; "Sort by" label 13px muted + select showing current option
 *     Toggle: 13px --color-merch-ink, font-weight 500; chevron 12px
 *   Sort options: Featured · Price Low→High · Price High→Low · Newest · A–Z · Z–A
 */

import { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The available sort options for merch collection/shop-all pages. */
export type MerchSortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "alpha-asc"
  | "alpha-desc";

export interface MerchFilterSortBarProps {
  /** Total product count shown on the left, e.g. 24 → "24 Products". */
  productCount: number;
  /**
   * Available filter chip labels, e.g. ["All", "New", "Sale", "Limited"].
   * If omitted no chips are rendered.
   */
  filterOptions?: string[];
  /** Currently active filter chip value. Defaults to filterOptions[0]. */
  activeFilter?: string;
  /** Currently selected sort option. Defaults to "featured". */
  activeSort?: MerchSortOption;
  /** Called when a filter chip is clicked. */
  onFilterChange?: (filter: string) => void;
  /** Called when the sort option changes. */
  onSortChange?: (sort: MerchSortOption) => void;
}

/** Human-readable labels for each sort option. */
const SORT_LABELS: Record<MerchSortOption, string> = {
  featured: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  newest: "Newest",
  "alpha-asc": "Alphabetical: A–Z",
  "alpha-desc": "Alphabetical: Z–A",
};

const SORT_OPTIONS = Object.entries(SORT_LABELS) as [MerchSortOption, string][];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Single filter chip pill. */
function FilterChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 32,
        padding: "0 12px",
        fontSize: 11,
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        border: isActive
          ? "1px solid transparent"
          : "1px solid var(--color-merch-border)",
        backgroundColor: isActive
          ? "var(--color-merch-ink)"
          : "var(--color-merch-bg)",
        color: isActive
          ? "var(--color-merch-on-dark)"
          : "var(--color-merch-ink)",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "border-color 120ms ease, background-color 120ms ease, color 120ms ease",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "var(--color-merch-ink)";
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          (e.currentTarget as HTMLButtonElement).style.borderColor =
            "var(--color-merch-border)";
        }
      }}
    >
      {label}
    </button>
  );
}

/** Chevron-down icon for the sort dropdown. */
function ChevronDown({ id }: { id: string }) {
  return (
    <svg
      aria-hidden
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id={`${id}-path`}
        d="M2 4l4 4 4-4"
        stroke="var(--color-merch-ink)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchFilterSortBar — sticky top bar with result count, filter chips, and
 * sort dropdown. Sits between MerchCollectionHero and MerchProductGrid.
 *
 * @example
 * <MerchFilterSortBar
 *   productCount={24}
 *   filterOptions={["All", "New", "Sale", "Limited"]}
 *   activeFilter="All"
 *   activeSort="featured"
 *   onFilterChange={(f) => setFilter(f)}
 *   onSortChange={(s) => setSort(s)}
 * />
 */
export function MerchFilterSortBar({
  productCount,
  filterOptions,
  activeFilter,
  activeSort = "featured",
  onFilterChange,
  onSortChange,
}: MerchFilterSortBarProps) {
  const svgId = useId().replace(/:/g, "");

  return (
    <div
      style={{
        position: "sticky",
        top: 64,
        zIndex: 40,
        width: "100%",
        height: 52,
        backgroundColor: "var(--color-merch-surface)",
        borderBottom: "1px solid var(--color-merch-border)",
        fontFamily: "var(--font-merch)",
      }}
    >
      <div
        style={{
          maxWidth: "80rem" /* max-w-7xl */,
          margin: "0 auto",
          padding: "0 24px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Result count */}
        <span
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: "var(--color-merch-muted)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {productCount} {productCount === 1 ? "Product" : "Products"}
        </span>

        {/* Filter chips */}
        {filterOptions && filterOptions.length > 0 && (
          <div
            role="group"
            aria-label="Filter products"
            style={{
              display: "flex",
              gap: 8,
              flex: 1,
              overflow: "hidden",
              flexWrap: "nowrap",
            }}
          >
            {filterOptions.map((option) => (
              <FilterChip
                key={option}
                label={option}
                isActive={activeFilter === option}
                onClick={() => onFilterChange?.(option)}
              />
            ))}
          </div>
        )}

        {/* Spacer when no filter chips */}
        {(!filterOptions || filterOptions.length === 0) && (
          <div style={{ flex: 1 }} />
        )}

        {/* Sort dropdown */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 400,
              color: "var(--color-merch-muted)",
              whiteSpace: "nowrap",
            }}
          >
            Sort by
          </span>
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <select
              aria-label="Sort products by"
              value={activeSort}
              onChange={(e) => onSortChange?.(e.target.value as MerchSortOption)}
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--color-merch-ink)",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                paddingRight: 20,
                outline: "none",
              }}
            >
              {SORT_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <span
              style={{
                position: "absolute",
                right: 0,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ChevronDown id={svgId} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
