"use client";

/**
 * MerchBreadcrumbBar — full-width breadcrumb bar with optional item count and REFINE button.
 *
 * MERCH COMPONENT — 1:1 with merch.riotgames.com shared breadcrumb-bar.
 * Use --color-merch-* tokens only. NOT the Hextech client.
 *
 * Measured from merch.riotgames.com @ 1280 and 390 (re-verified 2026-08-06):
 *   Bar: 60px height desktop, 40px mobile; transparent bg, no border-bottom
 *   Container: full-width, inner max-w-7xl mx-auto flex items-center justify-between
 *   Horizontal padding: 40px desktop (px-10), 24px mobile (px-6)
 *   Parent crumbs: 16px/400 black — var(--color-merch-ink-dark)
 *   Separator "/": var(--color-merch-ink-dark)
 *   Current crumb (last): var(--color-merch-ink-dark), font-weight 400
 *   Count: rendered as <sup> at 12px, color var(--color-merch-ink-dark)
 *   Mobile (< md): only last crumb visible, hidden rest; x-pad 24px
 *   REFINE button: bg var(--color-merch-refine) #eb0029; 113×40; radius 2; pl-2 pr-4; label 16px/700/uppercase
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
   * When provided, rendered as a 12px superscript after the last crumb label, e.g. " (691)".
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
 * Height: 40px mobile / 60px desktop. Horizontal inner padding: 24px mobile / 40px desktop.
 * Transparent background, no bottom border (page bg is already white).
 *
 * Mobile: all non-last crumbs (and their separators) are hidden; only the current crumb
 * is shown, at 24px from the left edge, matching merch.riotgames.com at 390.
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
        {/* Inner container — max-w-7xl, 24px mobile / 40px desktop horizontal padding */}
        <nav
          aria-label={ariaLabel}
          className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-10"
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
                  /*
                   * Mobile: hide all non-last crumbs (and their "/" separators).
                   * Real at 390: only "Shop All (691)" is visible at x=24; "Home /" is display:none.
                   */
                  className={
                    isLast
                      ? "flex items-center gap-1"
                      : "hidden items-center gap-1 md:flex"
                  }
                  style={{ alignItems: "center", gap: 4 }}
                >
                  {idx > 0 && (
                    <span
                      aria-hidden
                      style={{ color: "var(--color-merch-ink-dark)" }}
                    >
                      /
                    </span>
                  )}
                  {isLast ? (
                    <span style={{ color: "var(--color-merch-ink-dark)", fontWeight: 400 }}>
                      {crumb.label}
                      {count !== undefined && (
                        <sup
                          style={{
                            fontSize: 12,
                            color: "var(--color-merch-ink-dark)",
                            fontWeight: 400,
                            verticalAlign: "super",
                            lineHeight: 1,
                          }}
                        >
                          {` (${count})`}
                        </sup>
                      )}
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
                        color: "var(--color-merch-ink-dark)",
                        fontSize: "inherit",
                        fontFamily: "inherit",
                        fontWeight: 400,
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

          {/* Right: optional REFINE button — 113×40, bg var(--color-merch-refine), radius 2, label 16px/700/uppercase */}
          {onRefineClick && (
            <button
              type="button"
              className="flex items-center gap-1.5 pl-2 pr-4 text-[16px] font-bold uppercase transition-colors duration-150"
              style={{
                width: 113,
                height: 40,
                backgroundColor: "var(--color-merch-refine)",
                color: "var(--color-merch-on-dark)",
                border: "none",
                borderRadius: 2,
                cursor: "pointer",
                flexShrink: 0,
                letterSpacing: "normal",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-merch-refine-dark)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                  "var(--color-merch-refine)";
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
