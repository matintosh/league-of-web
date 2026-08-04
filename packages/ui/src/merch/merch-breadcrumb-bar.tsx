"use client";

/**
 * MerchBreadcrumbBar — full-width breadcrumb bar with optional item count and REFINE button.
 *
 * MERCH COMPONENT — 1:1 with merch.riotgames.com shared breadcrumb-bar.
 * Use --color-merch-* tokens only. NOT the Hextech client.
 *
 * Measured from merch.riotgames.com @ 1280 and 390 (fdiff-pdp, 2026-08-04):
 *   Bar: 60px height desktop, 40px mobile; transparent bg, no border-bottom
 *   Container: full-width, inner max-w-7xl mx-auto flex items-center justify-between
 *   Horizontal padding: 40px (10 in Tailwind spacing units)
 *   Crumb text: 16px, color --color-merch-ink
 *   Separator: "/" between crumbs, color --color-merch-muted
 *   Parent crumbs: clickable, color --color-merch-muted, hover underline
 *   Current crumb (last): non-link, color --color-merch-ink
 *   Optional count "(N)": appended after last crumb label
 *   Optional REFINE button: right-aligned, red bg, 36px height, white text/icon
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** One segment of a breadcrumb trail. Last crumb has no onClick (it's the current page). */
export interface MerchCrumb {
  label: string;
  /** When provided, the crumb is rendered as a clickable button. Omit for the current (last) crumb. */
  onClick?: () => void;
}

export interface MerchBreadcrumbBarProps {
  /**
   * Ordered list of breadcrumb segments. The last entry is treated as the current
   * page (non-link). Every earlier entry should supply an onClick handler.
   */
  crumbs: MerchCrumb[];
  /**
   * When provided, appended in parentheses after the last crumb label, e.g. "(42)".
   */
  count?: number;
  /**
   * When provided, renders the red REFINE button on the right side of the bar.
   */
  onRefineClick?: () => void;
  /** aria-label for the outer <nav> element. Defaults to "Breadcrumb". */
  ariaLabel?: string;
}

// ---------------------------------------------------------------------------
// Sliders icon — shared with MerchProductGrid's RefineIcon
// ---------------------------------------------------------------------------

function SlidersIcon() {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      style={{ width: 14, height: 14, display: "block" }}
    >
      <line x1="2" y1="4" x2="14" y2="4" />
      <line x1="2" y1="8" x2="14" y2="8" />
      <line x1="2" y1="12" x2="14" y2="12" />
      <circle cx="5" cy="4" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="10" cy="8" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Full-width breadcrumb bar with optional product count and inline REFINE button.
 * Height: 40px mobile / 60px desktop. Horizontal inner padding: 40px.
 * Transparent background, no bottom border (page bg is already white).
 */
export function MerchBreadcrumbBar({
  crumbs,
  count,
  onRefineClick,
  ariaLabel = "Breadcrumb",
}: MerchBreadcrumbBarProps) {
  return (
    <div
      /* h-10 = 40px mobile, md:h-15 = 60px desktop */
      className="flex w-full items-center"
      style={{ minHeight: "var(--merch-bar-h, 40px)" }}
    >
      {/*
       * Responsive outer wrapper: 40px mobile / 60px desktop height.
       * Tailwind h-10 = 2.5rem = 40px; md:h-[60px] = 60px at md+.
       */}
      <div className="flex h-10 w-full items-center md:h-[60px]">
        {/* Inner container — max-w-7xl, 40px horizontal padding */}
        <nav
          aria-label={ariaLabel}
          className="mx-auto flex w-full max-w-7xl items-center justify-between px-10"
        >
          {/* Left: crumb trail */}
          <ol
            className="flex items-center gap-1"
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              fontSize: 16,
            }}
          >
            {crumbs.map((crumb, idx) => {
              const isLast = idx === crumbs.length - 1;
              return (
                <li
                  key={idx}
                  className="flex items-center gap-1"
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  {idx > 0 && (
                    <span
                      aria-hidden
                      style={{ color: "var(--color-merch-muted)" }}
                    >
                      /
                    </span>
                  )}
                  {isLast ? (
                    <span style={{ color: "var(--color-merch-ink)" }}>
                      {crumb.label}
                      {count !== undefined ? ` (${count})` : ""}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="transition-colors duration-150 hover:underline"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: "var(--color-merch-muted)",
                        fontSize: "inherit",
                        fontFamily: "inherit",
                      }}
                      onClick={crumb.onClick}
                    >
                      {crumb.label}
                    </button>
                  )}
                </li>
              );
            })}
          </ol>

          {/* Right: optional REFINE button */}
          {onRefineClick && (
            <button
              type="button"
              className="flex items-center gap-1.5 px-4 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors duration-150"
              style={{
                height: 36,
                backgroundColor: "var(--color-merch-red)",
                color: "var(--color-merch-on-dark)",
                border: "none",
                cursor: "pointer",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-merch-red-dark)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-merch-red)";
              }}
              onClick={onRefineClick}
            >
              <SlidersIcon />
              Refine
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
