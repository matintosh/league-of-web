"use client";

import type { ReactNode } from "react";

/** All four icon-action keys. */
export type SocialAction = "add" | "groups" | "list" | "search";

export interface SocialHeaderProps {
  /**
   * Called when any icon button is clicked.
   * Receives the action key: "add" | "groups" | "list" | "search".
   */
  onAction?: (action: SocialAction) => void;
  /**
   * Called when the rail collapse affordance is clicked (issue #401). When
   * provided, a leading « chevron button renders before the "SOCIAL" label —
   * this is where the social-rail collapse toggle folds into the header (the
   * reference has no beside-chip toggle; collapse lives on the rail itself).
   * Omit it and the chevron is absent, so existing SocialHeader consumers are
   * unchanged.
   */
  onToggleCollapse?: () => void;
}

// ---------------------------------------------------------------------------
// Icon SVG paths — inline, aria-hidden, 18×18 viewBox.
// Glyphs match the LoL client sidebar: add-friend, groups, list, search.
// ---------------------------------------------------------------------------

/** Exhaustive map of action keys to icon metadata. */
const iconMap: Record<
  SocialAction,
  { ariaLabel: string; path: ReactNode }
> = {
  add: {
    ariaLabel: "Add friend",
    path: (
      <>
        {/* Person silhouette */}
        <circle cx="7" cy="5" r="3" />
        <path d="M1 15c0-3.314 2.686-6 6-6s6 2.686 6 6" />
        {/* Plus sign */}
        <path d="M14 3v6M11 6h6" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  groups: {
    ariaLabel: "Groups",
    path: (
      <>
        {/* Front person */}
        <circle cx="7" cy="5.5" r="2.5" />
        <path d="M1 15c0-3.038 2.686-5.5 6-5.5" />
        {/* Back person (offset right) */}
        <circle cx="12" cy="5.5" r="2.5" />
        <path d="M8.5 15c0-3.038 1.716-5.5 5-5.5 3.284 0 4.5 2.462 4.5 5.5" />
      </>
    ),
  },
  list: {
    ariaLabel: "List",
    path: (
      <>
        {/* Three horizontal lines representing a list */}
        <path d="M2 4h14M2 9h14M2 14h14" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  search: {
    ariaLabel: "Search",
    path: (
      <>
        {/* Magnifier circle + handle */}
        <circle cx="7.5" cy="7.5" r="4.5" />
        <path d="M11 11l4 4" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * SocialHeader — top strip of the social sidebar.
 *
 * Left: optional « collapse chevron (#401) + "Social" label, font-display
 *   text-xs uppercase tracking-widest text-grey-1.
 * Right: four 18px icon buttons (add friend, groups, list, search).
 * Each button fires `onAction?.(key)` on click; the chevron fires
 * `onToggleCollapse?.()`.
 *
 * Reference: "SOCIAL ＋ 🗂 ≡ 🔍" strip in the LoL client right sidebar.
 */
export function SocialHeader({ onAction, onToggleCollapse }: SocialHeaderProps) {
  return (
    <div
      data-shot="social-header"
      className="flex w-full items-center justify-between px-3 py-2"
    >
      {/* Leading group: collapse chevron (when wired) + "Social" label */}
      <div className="flex items-center gap-1.5">
        {onToggleCollapse && (
          <button
            type="button"
            aria-label="Collapse social panel"
            aria-expanded={true}
            onClick={onToggleCollapse}
            className="flex h-4 w-4 items-center justify-center text-grey-1 transition-colors duration-100 hover:text-gold-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-3"
          >
            {/* « double-chevron pointing toward the window edge (collapse) */}
            <svg
              aria-hidden="true"
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6,2 2,6 6,10" />
              <polyline points="10,2 6,6 10,10" />
            </svg>
          </button>
        )}
        {/* "Social" label — natural-case in JSX, CSS uppercase */}
        <span className="font-display text-[11px] uppercase tracking-widest text-grey-1">
          Social
        </span>
      </div>

      {/* Icon buttons */}
      <div className="flex items-center gap-1">
        {(Object.entries(iconMap) as [SocialAction, (typeof iconMap)[SocialAction]][]).map(
          ([key, { ariaLabel, path }]) => (
            <button
              key={key}
              type="button"
              aria-label={ariaLabel}
              onClick={() => onAction?.(key)}
              className="text-grey-1 transition-colors duration-100 hover:text-gold-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-3"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.25"
              >
                {path}
              </svg>
            </button>
          )
        )}
      </div>
    </div>
  );
}
