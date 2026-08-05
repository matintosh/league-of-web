/**
 * LauncherShell — 3-column window wrapper for the /launcher section.
 *
 * Provides the foundational layout of the Riot/League launcher:
 *   - Optional top window bar (28px) — floats as a transparent overlay at y=0
 *     so the rail, hero, and social panel all bleed to the top edge (#733)
 *   - Left icon rail (64px fixed) — game icon nav (separate component)
 *   - Center content area (flex-1) — tab bar + routed tab content
 *   - Right social panel slot — rendered as a floating inset rounded card
 *     (~253px, with padding around it) rather than a flush full-height column (#731)
 *     If `socialPanel` is absent the right slot is omitted entirely.
 *
 * This is a PRESENTATIONAL shell only: it accepts ReactNode slots and applies
 * the launcher dark palette via --color-launcher-* tokens. No data fetching,
 * no state. Individual rail/tab/social components slot in via props.
 *
 * Token source: packages/tokens/src/theme.css — --color-launcher-* set (issue #679).
 */

import type { ReactNode } from "react";

export interface LauncherShellProps {
  /** Rendered into the left icon rail column (64px fixed). */
  rail: ReactNode;
  /** Rendered into the center content column (flex-1). Includes tab bar + routed content. */
  children: ReactNode;
  /**
   * Rendered into the right social panel slot as a floating inset rounded card.
   * If absent the right slot is omitted — Home and Games routes pass nothing here.
   */
  socialPanel?: ReactNode;
  /**
   * Optional window chrome bar (28px). Rendered as a transparent absolute overlay
   * at the top of the shell so all three columns bleed to y=0 beneath it.
   * If absent no overlay is mounted.
   */
  windowBar?: ReactNode;
}

/**
 * 3-column launcher shell with an optional transparent-overlay window bar.
 *
 * Column proportions measured from lol-launcher-ref/image.png at ~1536px ref width:
 *   left rail   64px  (shrink-0)
 *   center      flex  (flex-1, min-w-0)
 *   right panel ~253px floating card, inset ~14px from edges (slot is 280px outer)
 *
 * The window bar floats absolutely over the top of the shell at z-index 20
 * (transparent bg) so content behind it is fully visible (#733).
 *
 * The right social slot renders as an inset floating card with padding and
 * rounded corners — not a flush full-height column (#731). The outer slot column
 * is 280px; the card inside sits ~14px from top/right/bottom.
 *
 * The shell fills its parent (h-full) and clips overflow so inner columns can
 * scroll independently. The /launcher layout gives it a fixed 1280×720 bounded
 * frame (like the client); the showcase wraps it in a sized preview box.
 */
export function LauncherShell({ rail, children, socialPanel, windowBar }: LauncherShellProps) {
  return (
    <div
      className="relative flex h-full w-full overflow-hidden"
      style={{ backgroundColor: "var(--color-launcher-bg)" }}
    >
      {/* Window bar — transparent overlay floating at y=0; content bleeds behind it */}
      {windowBar && (
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-[28px]"
        >
          {/* Re-enable pointer events just for the bar's interactive children */}
          <div className="pointer-events-auto h-full w-full">
            {windowBar}
          </div>
        </div>
      )}

      {/* 3-column body — fills the shell fully (all columns start at y=0) */}
      <div className="flex min-h-0 h-full w-full">
        {/* Left icon rail — 64px fixed */}
        <aside
          className="w-[64px] shrink-0 overflow-hidden"
          style={{ backgroundColor: "var(--color-launcher-rail-bg)" }}
        >
          {rail}
        </aside>

        {/* Center content area — flex-1 */}
        <main
          className="flex min-w-0 flex-1 flex-col overflow-hidden"
          style={{ backgroundColor: "var(--color-launcher-content-bg)" }}
        >
          {children}
        </main>

        {/* Right social slot — 280px outer column; card floats inset inside */}
        {socialPanel && (
          <aside
            className="w-[280px] shrink-0 overflow-hidden"
            style={{ backgroundColor: "var(--color-launcher-bg)" }}
          >
            {/*
             * Floating inset card: ~14px padding top/right/bottom so the card
             * (~252px wide) sits inset from all edges with visible bg behind it.
             * radius 14px matches the ref rounded card.
             */}
            <div
              className="flex h-full flex-col"
              style={{ padding: "46px 14px 28px 0" }}
            >
              <div
                className="flex min-h-0 flex-1 flex-col overflow-hidden"
                style={{
                  borderRadius: 14,
                  overflow: "hidden",
                  backgroundColor: "var(--color-launcher-panel-bg)",
                  border: "1px solid var(--color-launcher-border)",
                }}
              >
                {socialPanel}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
