/**
 * LauncherShell — 3-column window wrapper for the /launcher section.
 *
 * Provides the foundational layout of the Riot/League launcher:
 *   - Optional top window bar (28px) for window chrome controls
 *   - Left icon rail (56px fixed) — game icon nav (separate component)
 *   - Center content area (flex-1) — tab bar + routed tab content
 *   - Right social panel (280px fixed) — friends/social panel (separate component)
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
  /** Rendered into the right social panel column (280px fixed). */
  socialPanel: ReactNode;
  /** Optional top window bar content (28px). If absent the bar is omitted entirely. */
  windowBar?: ReactNode;
}

/**
 * 3-column launcher shell with an optional window top bar.
 *
 * Column proportions measured from lol-launcher-ref/image.png at ~1536px ref width:
 *   left rail   64px  (shrink-0)
 *   center      flex  (flex-1, min-w-0)
 *   right panel 280px (shrink-0)
 *
 * The shell fills its parent (h-full) and clips overflow so inner columns can
 * scroll independently without the shell itself scrolling. The /launcher layout
 * gives it a fixed 1280×720 bounded frame (like the client); the showcase wraps
 * it in a sized preview box.
 */
export function LauncherShell({ rail, children, socialPanel, windowBar }: LauncherShellProps) {
  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden"
      style={{ backgroundColor: "var(--color-launcher-bg)" }}
    >
      {/* Window bar — omitted if not provided */}
      {windowBar && (
        <div
          className="h-[28px] w-full shrink-0"
          style={{ backgroundColor: "var(--color-launcher-bg)" }}
        >
          {windowBar}
        </div>
      )}

      {/* 3-column body */}
      <div className="flex min-h-0 flex-1">
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

        {/* Right social panel — 280px fixed */}
        <aside
          className="w-[280px] shrink-0 overflow-hidden"
          style={{ backgroundColor: "var(--color-launcher-panel-bg)" }}
        >
          {socialPanel}
        </aside>
      </div>
    </div>
  );
}
