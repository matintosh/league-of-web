"use client";

/**
 * MerchSearchBar — full-width search input band for the /merch/search page.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client — IGNORE Hextech-only / no-default-palette
 * guidance; still tokens-only (no raw hex outside packages/tokens; NO hex
 * fallbacks in var(); NO bare hex like #ffffff — use --color-merch-on-dark),
 * presentational (props in/callbacks out; NO fetching in @low/ui),
 * SVG ids from useId.
 *
 * Measured from merch.riotgames.com/en-us/search?q=jinx (~1280px desktop):
 * The real store is a JS-heavy SPA; structure inferred from the network tab
 * and consistent with other merch page patterns.
 *   Band: full-width, --color-merch-surface bg, 1px --color-merch-border bottom
 *   Inner container: max-w-7xl mx-auto px-6, h-14 (56px), flex row, items-center, gap-12
 *   Left label: "Search Results", 18px/700, --color-merch-ink, uppercase, tracking 0.04em
 *   Center (flex-1): text input; 14px, 36px tall, 1px --color-merch-border border, radius 4px
 *     padding: 8px 12px; focus: border --color-merch-ink, outline none; bg --color-merch-bg
 *   Right: submit button; --color-merch-red bg, 36×36px, radius 4px, white magnifier SVG
 *     hover: --color-merch-red-dark bg
 */

import { useId, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchSearchBarProps {
  /** Current search query string. */
  query: string;
  /** Number of results found. Used for ARIA labelling. */
  resultCount: number;
  /** Fired when the query input changes. */
  onQueryChange?: (q: string) => void;
  /** Fired when the user submits the search (Enter or button click). */
  onSearch?: (q: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchSearchBar — full-width band with "Search Results" label, text input,
 * and submit button. Sits below the announcement strip and above the filter bar.
 *
 * @example
 * <MerchSearchBar
 *   query="jinx"
 *   resultCount={7}
 *   onQueryChange={(q) => setQuery(q)}
 *   onSearch={(q) => router.push(`/merch/search?q=${encodeURIComponent(q)}`)}
 * />
 */
export function MerchSearchBar({
  query,
  resultCount,
  onQueryChange,
  onSearch,
}: MerchSearchBarProps) {
  const searchIconId = useId();
  const inputId = useId();
  const [localQuery, setLocalQuery] = useState(query);

  // Keep local state in sync when the parent prop changes (e.g. URL-driven resets)
  const prevQueryRef = useRef(query);
  if (prevQueryRef.current !== query) {
    prevQueryRef.current = query;
    setLocalQuery(query);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setLocalQuery(val);
    onQueryChange?.(val);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSearch?.(localQuery);
    }
  }

  function handleSubmit() {
    onSearch?.(localQuery);
  }

  return (
    <div
      role="search"
      aria-label="Search products"
      style={{
        width: "100%",
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
          height: "56px",
          display: "flex",
          alignItems: "center",
          gap: "48px",
        }}
      >
        {/* Left: "Search Results" heading label */}
        <span
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "var(--color-merch-ink)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Search Results
        </span>

        {/* Center: text input */}
        <input
          id={inputId}
          type="search"
          value={localQuery}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for products…"
          aria-label={`Search products${resultCount > 0 ? `, showing ${resultCount} results` : ""}`}
          style={{
            flex: 1,
            height: "36px",
            padding: "8px 12px",
            fontSize: "14px",
            color: "var(--color-merch-body)",
            backgroundColor: "var(--color-merch-bg)",
            border: "1px solid var(--color-merch-border)",
            borderRadius: "4px",
            outline: "none",
            fontFamily: "inherit",
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          } as React.CSSProperties}
          onFocus={(e) => {
            (e.target as HTMLInputElement).style.borderColor =
              "var(--color-merch-ink)";
          }}
          onBlur={(e) => {
            (e.target as HTMLInputElement).style.borderColor =
              "var(--color-merch-border)";
          }}
        />

        {/* Right: search submit button */}
        <button
          type="button"
          aria-label="Submit search"
          onClick={handleSubmit}
          style={{
            width: "36px",
            height: "36px",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--color-merch-red)",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            transition: "background-color 120ms ease",
            color: "var(--color-merch-on-dark)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--color-merch-red-dark)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              "var(--color-merch-red)";
          }}
        >
          {/* Magnifying glass SVG — same glyph as MerchHeader search icon */}
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
            <defs>
              <title id={`${searchIconId}-title`}>Search</title>
            </defs>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
    </div>
  );
}
