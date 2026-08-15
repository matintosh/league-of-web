/**
 * UniverseFilterTabs — the Explore page filter + sort row on
 * universe.leagueoflegends.com.
 *
 * Layout:
 *   [FILTER BY] [Everything] [Short Stories] [Comics] [Videos] [Music]
 *   ....gap....
 *   [SORT BY] [Newest ⇅]
 *
 * Filter tabs:
 *   - "FILTER BY" label: white/grey, bold, caps, ~14px, no interaction
 *   - Tabs: inactive = gold-2; active = near-white + short gold underline beneath
 *   - font-display, letter-spaced caps
 *
 * Sort area (right):
 *   - "SORT BY" label: same as FILTER BY
 *   - Current sort value (e.g. "Newest"): gold-2
 *   - Up/down caret icon (SVG)
 *
 * Transparent over hero background. Issue #970.
 *
 * Server-safe: no 'use client'. All hover state handled via CSS group-hover.
 * Tokens-only.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface UniverseFilterOption {
  /** Unique key for this filter tab. */
  key: string;
  /** Display label, e.g. "Everything". */
  label: string;
}

export interface UniverseFilterTabsProps {
  /** Filter options to display (left of row). */
  filters: UniverseFilterOption[];
  /** Currently active filter key. */
  activeFilter: string;
  /** Fired when a filter tab is clicked. @default undefined (no-op) */
  onFilter?: (key: string) => void;
  /** Current sort label, e.g. "Newest". */
  sort?: string;
  /** Fired when sort toggle is clicked. */
  onSortToggle?: () => void;
}

// ---------------------------------------------------------------------------
// Sort caret icon
// ---------------------------------------------------------------------------

function SortCaretIcon() {
  return (
    <svg
      aria-hidden="true"
      width="10"
      height="14"
      viewBox="0 0 10 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Up caret */}
      <path
        d="M1 5 L5 1 L9 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Down caret */}
      <path
        d="M1 9 L5 13 L9 9"
        stroke="currentColor"
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
 * UniverseFilterTabs — Explore page filter + sort bar.
 *
 * Presentational, server-safe (no 'use client'). Active tab uses the
 * CSS sibling/data-active pattern for the gold underline — no state needed.
 * Tokens-only.
 */
export function UniverseFilterTabs({
  filters,
  activeFilter,
  onFilter,
  sort = "Newest",
  onSortToggle,
}: UniverseFilterTabsProps) {
  return (
    <div
      className="flex w-full items-center px-6 py-3"
      style={{
        /* Transparent over hero — just a thin hairline separator below */
        borderBottom: "1px solid color-mix(in srgb, var(--color-gold-4) 50%, transparent)",
      }}
    >
      {/* ── Left: FILTER BY label + filter tabs ── */}
      <div className="flex items-center gap-1">
        {/* "FILTER BY" label */}
        <span
          className="mr-4 shrink-0 text-[15px] font-bold uppercase"
          style={{
            color: "var(--color-gold-1)",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.2px",
          }}
        >
          FILTER BY
        </span>

        {/* Filter tab buttons */}
        {filters.map(({ key, label }) => {
          const isActive = key === activeFilter;
          return (
            <button
              key={key}
              type="button"
              onClick={onFilter ? () => onFilter(key) : undefined}
              className="group relative shrink-0 px-3 py-1.5 text-[15px] uppercase transition-colors duration-150"
              style={{
                color: isActive ? "var(--color-gold-1)" : "var(--color-universe-title)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                letterSpacing: "0.2px",
                fontWeight: 700,
              }}
            >
              {label}
              {/* Gold underline — only visible on active tab */}
              {isActive && (
                <span
                  className="absolute inset-x-3 bottom-0 h-0.5"
                  style={{
                    backgroundColor: "var(--color-gold-3)",
                  }}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Right: SORT BY label + value + caret ── */}
      <div className="ml-auto flex items-center gap-3">
        <span
          className="shrink-0 text-[15px] font-bold uppercase"
          style={{
            color: "var(--color-gold-1)",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.2px",
          }}
        >
          SORT BY
        </span>

        <button
          type="button"
          onClick={onSortToggle}
          className="flex items-center gap-1.5 text-[15px] uppercase transition-opacity duration-150 hover:opacity-80"
          style={{
            color: "var(--color-universe-title)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.2px",
          }}
        >
          <span>{sort}</span>
          <SortCaretIcon />
        </button>
      </div>
    </div>
  );
}
