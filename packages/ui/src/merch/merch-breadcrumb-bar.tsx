"use client";

/**
 * MerchBreadcrumbBar — full-width breadcrumb bar with optional item count and REFINE button.
 *
 * MERCH COMPONENT — 1:1 with merch.riotgames.com shared breadcrumb-bar.
 * Use --color-merch-* tokens only. NOT the Hextech client.
 *
 * Measured from merch.riotgames.com @ 1280 and 390 (re-verified 2026-08-06):
 *   Bar: 60px height desktop, 40px mobile; solid white bg (--color-merch-bg)
 *   Container: full-width flex items-center justify-between (no max-w cap — fixed side padding only)
 *   Horizontal padding: left 40px desktop / 24px mobile; right 24px desktop / 8px mobile
 *   Parent crumbs: 16px/400 black — var(--color-merch-ink-dark), lh 20px
 *   Separator "/": var(--color-merch-ink-dark)
 *   Current crumb (last): var(--color-merch-ink-dark), font-weight 600, line-height 20px
 *   Count: rendered as <sup> at 12px, vertical-align super, lh 15px, no leading space
 *   Mobile (< md): only last crumb visible, hidden rest; x-pad 24px left / 8px right
 *   REFINE button: bg var(--color-merch-refine) #eb0029; 113×40; radius 2; padding 8px 16px 8px 8px;
 *     button base 13.33px/400; LABEL is nested <span> riotSans 16px/700/lh18/uppercase; icon 24×24; gap 8px
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
   * When provided, rendered as a 12px superscript after the last crumb label, e.g. "(691)".
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
// Sliders icon — 24×24, matching measured icon size on real merch.riotgames.com
// ---------------------------------------------------------------------------

function SlidersIcon() {
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      style={{ width: 24, height: 24, display: "block" }}
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
      <circle cx="7" cy="6" r="2.25" fill="currentColor" stroke="none" />
      <circle cx="15" cy="12" r="2.25" fill="currentColor" stroke="none" />
      <circle cx="9" cy="18" r="2.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Full-width breadcrumb bar with optional product count and inline REFINE button.
 * Height: 40px mobile / 60px desktop. Left padding: 24px mobile / 40px desktop.
 * Right padding: 8px mobile / 24px desktop (REFINE right edge 24px from viewport @ 1280, ~8px @ 390).
 * Background: solid white (--color-merch-bg). Current crumb: 16px/600/lh20.
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
    /*
     * Outer bar: solid white bg, 40px mobile / 60px desktop.
     * h-10 = 40px mobile; md:h-[60px] = 60px at md+.
     * Real: bar y=130-190 @ 1280, y=90-130 @ 390 — flush under header.
     * NOTE: height set directly on this element; no inner wrapper needed.
     */
    <div
      className="flex h-10 w-full items-center md:h-[60px]"
      style={{ backgroundColor: "var(--color-merch-bg)" }}
    >
      {/* Inner container — full-width, asymmetric padding:
           left: pl-6 (24px) mobile / md:pl-10 (40px) desktop
           right: pr-2 (8px) mobile / md:pr-6 (24px) desktop
           Matches real REFINE right edge: x=1256 @ 1280 (24px inset), x=382 @ 390 (~8px inset) */}
      <nav
        aria-label={ariaLabel}
        className="flex w-full items-center justify-between pl-6 pr-2 md:pl-10 md:pr-6"
        style={{ color: "var(--color-merch-ink-dark)" }}
      >
        {/* Left: crumb trail */}
        <ol
          className="flex items-center gap-1"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            fontSize: 16,
            color: "var(--color-merch-ink-dark)",
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
                    /*
                     * Mobile: hide the separator alongside its preceding crumb.
                     * Without this, the last li renders "/ Shop All" on 390 because
                     * only the li itself is shown while this span has no visibility guard.
                     */
                    className={isLast ? "hidden md:inline" : undefined}
                    style={{ color: "var(--color-merch-ink-dark)" }}
                  >
                    /
                  </span>
                )}
                {isLast ? (
                  /* Current crumb: 16px/600/lh20 — measured at both 1280 and 390 */
                  <span
                    style={{
                      color: "var(--color-merch-ink-dark)",
                      fontWeight: 600,
                      lineHeight: "20px",
                    }}
                  >
                    {crumb.label}
                    {count !== undefined && (
                      <sup
                        style={{
                          fontSize: 12,
                          color: "var(--color-merch-ink-dark)",
                          fontWeight: 400,
                          /*
                           * Real: <sup> has vertical-align: super (raised ~2px), lineHeight 15px.
                           * No leading space before "(N)" — real renders "(691)" not " (691)".
                           */
                          verticalAlign: "super",
                          lineHeight: "15px",
                        }}
                      >
                        {`(${count})`}
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
                      /* Real non-last crumb lh 20 (box h=20); button default inherits 24 */
                      lineHeight: "20px",
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

        {/* Right: optional REFINE button — 113×40, bg var(--color-merch-refine), radius 2,
             button base 13.33px/400; LABEL is nested <span> riotSans 16px/700/lh18/uppercase;
             icon 24×24, gap 8px, padding 8px 16px 8px 8px.
             Measured from merch.riotgames.com 2026-08-06. */}
        {onRefineClick && (
          <button
            type="button"
            className="flex items-center transition-colors duration-150"
            style={{
              width: 113,
              height: 40,
              backgroundColor: "var(--color-merch-refine)",
              color: "var(--color-merch-on-dark)",
              border: "none",
              borderRadius: 2,
              cursor: "pointer",
              flexShrink: 0,
              fontSize: "13.33px",
              fontWeight: 400,
              fontFamily: "riotSans, Arial, sans-serif",
              gap: 8,
              padding: "8px 16px 8px 8px",
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
            {/*
             * REFINE label: nested <span> riotSans 16px/700/lh18/uppercase.
             * Real button base font is Arial 13.33/400 but the visible label is a child span
             * with riotSans 16/700 — this reconciles measurements of the button vs the span.
             */}
            <span
              style={{
                fontFamily: "riotSans, Arial, sans-serif",
                fontSize: 16,
                fontWeight: 700,
                lineHeight: "18px",
                textTransform: "uppercase",
              }}
            >
              Refine
            </span>
          </button>
        )}
      </nav>
    </div>
  );
}
