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
 *   Separator: NONE — real DOM has no "/" node; crumbs separated by gap only
 *   Current crumb (last): var(--color-merch-ink-dark), font-weight 400, line-height 20px
 *   Count: rendered as <sup> at 12px, marginLeft 4px, position relative top -2px (no lh override)
 *   Mobile (< md): only last crumb visible, hidden rest; x-pad 24px left / 8px right
 *   REFINE button: bg var(--color-merch-refine) #eb0029; 113×40; radius 2; padding 8px 16px 8px 8px;
 *     button base 13.33px/400; LABEL is nested <span> riotSans 16px/700/lh18/uppercase; icon 24×24; gap 8px
 *     Icon: 2 horizontal sliders with HOLLOW ring knobs (fill=none stroke=currentColor)
 *
 * Height: 40px mobile, 60px desktop.
 * The desktop override is applied via the [data-merch-bb] data-attribute rule in
 * merch-layout.css (avoids Tailwind JIT purge of md:h-[60px] arbitrary values).
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
// Sliders icon — 24×24, 2 lines with HOLLOW ring knobs (fill=none stroke=currentColor)
// Measured from merch.riotgames.com: sliders with 2 horizontal lines and hollow ring knobs.
// Round-4 fix: was 3 lines with filled dots — corrected to 2 lines + hollow rings.
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
      {/* 2 horizontal slider lines */}
      <line x1="3" y1="8" x2="21" y2="8" />
      <line x1="3" y1="16" x2="21" y2="16" />
      {/* Hollow ring knobs — fill=none, stroke=currentColor */}
      <circle cx="8" cy="8" r="2.25" fill="none" stroke="currentColor" />
      <circle cx="16" cy="16" r="2.25" fill="none" stroke="currentColor" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * Full-width breadcrumb bar with optional product count and inline REFINE button.
 * Height: 40px mobile / 60px desktop (desktop via [data-merch-bb] in merch-layout.css).
 * Left padding: 24px mobile / 40px desktop.
 * Right padding: 8px mobile / 24px desktop.
 * Background: solid white (--color-merch-bg). Current crumb: 16px/400/lh20.
 * No "/" separator — real DOM has only gap spacing between crumbs.
 *
 * Mobile: all non-last crumbs are hidden; only the current crumb is shown,
 * at 24px from the left edge, matching merch.riotgames.com at 390.
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
     * data-merch-bb: hooks the @media (min-width: 768px) rule in merch-layout.css
     * that overrides height to 60px — avoids relying on Tailwind JIT for md:h-[60px].
     * Real: bar y=130-190 @ 1280, y=90-130 @ 390 — flush under header.
     */
    <div
      data-merch-bb
      className="flex w-full items-center"
      style={{
        height: 40,
        backgroundColor: "var(--color-merch-bg)",
      }}
    >
      {/* Inner container — full-width, asymmetric padding:
           left: pl-6 (24px) mobile / md:pl-10 (40px) desktop
           right: pr-2 (8px) mobile / md:pr-6 (24px) desktop
           Matches real REFINE right edge: x=1256 @ 1280 (24px inset), x=382 @ 390 (~8px inset) */}
      <nav
        aria-label={ariaLabel}
        className="flex h-full w-full items-center justify-between pl-6 pr-2 md:pl-10 md:pr-6"
        style={{ color: "var(--color-merch-ink-dark)" }}
      >
        {/* Left: crumb trail — gap-2 (8px) separates crumbs; no "/" node (real DOM has none) */}
        <ol
          className="flex items-center gap-2"
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
                 * Mobile: hide all non-last crumbs.
                 * Real at 390: only "Shop All (691)" is visible at x=24; "Home" is display:none.
                 */
                className={isLast ? undefined : "hidden md:list-item"}
              >
                {isLast ? (
                  /*
                   * Current crumb: 16px/400/lh20 — measured at both 1280 and 390.
                   * Round-4 spec: weight 400 (round-3 had 600 — reverted here).
                   */
                  <span
                    style={{
                      color: "var(--color-merch-ink-dark)",
                      fontWeight: 400,
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
                           * Round-4 fix: ~4px gap after label + ~2px raise.
                           * position:relative + top:-2px gives a controlled 2px raise without
                           * escaping the line box (vs the ~5-6px jump from vertical-align:super).
                           * marginLeft 4px matches the measured ~4px gap between "Sales" and "(7)".
                           * verticalAlign:baseline cancels the browser's default <sup> offset.
                           */
                          marginLeft: 4,
                          position: "relative",
                          top: -2,
                          verticalAlign: "baseline",
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
             Icon: 2 horizontal lines with HOLLOW ring knobs (fill=none stroke=currentColor).
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
