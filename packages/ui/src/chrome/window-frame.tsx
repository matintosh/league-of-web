"use client";

import type { ReactNode } from "react";

export interface WindowFrameProps {
  /** Content to render inside the frame (the full app shell). */
  children?: ReactNode;
  /**
   * Chrome variant.
   * - `"titlebar"` (default): a slim draggable title-bar row across the top,
   *   with the window controls at its right end. Used by the login window,
   *   whose reference still has the classic bar.
   * - `"integrated"`: NO title-bar row (current-client era, issue #385). The
   *   window controls render as a floating cluster at the absolute top-right
   *   inside the frame, layered above the shell content and any in-frame
   *   overlays so they stay clickable everywhere.
   *
   * @default "titlebar"
   */
  chrome?: "titlebar" | "integrated";
  /** Optional title text displayed in the title bar centre (titlebar variant only). */
  title?: string;
  /** Whether the help (?) control is rendered. Defaults to true. */
  showHelp?: boolean;
  /** Whether the minimize control is rendered. Defaults to true. */
  showMinimize?: boolean;
  /** Whether the close control is rendered. Defaults to true. */
  showClose?: boolean;
  /** Called when the user clicks the help button. */
  onHelp?: () => void;
  /** Called when the user clicks the minimize button. */
  onMinimize?: () => void;
  /** Called when the user clicks the close button. */
  onClose?: () => void;
  /**
   * Called when the user clicks the settings (⚙) control. Additive slot
   * (issue #401): the settings gear only renders when this handler is
   * provided, so the LOGIN title bar and every other consumer that omits it
   * are visually unchanged. In the current-era integrated chrome the shell
   * passes this so the gear lives in the window-control row, matching the
   * reference (docs/reference/client-current-home-activity-center.jpg), where
   * the row reads help → minimize → settings → close.
   */
  onSettings?: () => void;
  /**
   * When true, a small amber status dot (●) renders at the LEADING edge of the
   * window-control row, before the help glyph — the connection/status indicator
   * in the 2025 reference (#464). Opt-in (default off) so the LOGIN title bar
   * and other consumers are unaffected.
   */
  showStatusDot?: boolean;
}

/** Help glyph — ? */
function HelpGlyph() {
  return (
    <svg
      width="8"
      height="10"
      viewBox="0 0 8 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M1.5 3C1.5 1.619 2.619 0.5 4 0.5C5.381 0.5 6.5 1.619 6.5 3C6.5 4.119 5.8 4.93 4.875 5.4C4.425 5.63 4 6.05 4 6.5V7"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      <circle cx="4" cy="9" r="0.75" fill="currentColor" />
    </svg>
  );
}

/** Minimise glyph — horizontal rule */
function MinimizeGlyph() {
  return (
    <svg
      width="10"
      height="2"
      viewBox="0 0 10 2"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="10" height="2" fill="currentColor" />
    </svg>
  );
}

/** Settings glyph — ⚙ (8-tooth gear, matches the reference control row) */
function SettingsGlyph() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.5 1h3l.4 1.6a5.1 5.1 0 0 1 1.2.7l1.6-.5 1.5 2.6-1.2 1.1c.03.33.03.67 0 1l1.2 1.1-1.5 2.6-1.6-.5c-.37.27-.77.5-1.2.7L9.5 15h-3l-.4-1.6a5.1 5.1 0 0 1-1.2-.7l-1.6.5-1.5-2.6 1.2-1.1a5.2 5.2 0 0 1 0-1L1.8 7.4l1.5-2.6 1.6.5c.37-.27.77-.5 1.2-.7L6.5 1ZM8 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Close glyph — ✕ */
function CloseGlyph() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <line
        x1="1"
        y1="1"
        x2="9"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
      <line
        x1="9"
        y1="1"
        x2="1"
        y2="9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  );
}

interface WindowControlsProps {
  showHelp: boolean;
  showMinimize: boolean;
  showClose: boolean;
  onHelp?: () => void;
  onMinimize?: () => void;
  onClose?: () => void;
  /** Optional settings handler; the ⚙ button only renders when provided (#401). */
  onSettings?: () => void;
  /** When true, a leading amber status dot renders before the help glyph (#464). */
  showStatusDot?: boolean;
}

/**
 * The window-control cluster, shared by both chrome variants.
 *
 * Order matches the reference (client-current-home-activity-center.jpg,
 * measured in #401): help (?) → minimize (─) → settings (⚙) → close (✕).
 * The settings gear is opt-in — it renders only when `onSettings` is supplied,
 * so consumers that omit it (LOGIN title bar, etc.) keep the classic ? ─ ✕ row.
 */
function WindowControls({
  showHelp,
  showMinimize,
  showClose,
  onHelp,
  onMinimize,
  onClose,
  onSettings,
  showStatusDot,
}: WindowControlsProps) {
  return (
    <>
      {/* Leading amber status dot (#464) — opt-in; precedes the help glyph in
          the current-era integrated chrome (● ? ─ ⚙ ✕). */}
      {showStatusDot && (
        <span
          aria-hidden="true"
          className="mr-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-3"
        />
      )}
      {showHelp && (
        <button
          type="button"
          aria-label="Help"
          onClick={onHelp}
          className="flex h-5 w-5 cursor-pointer items-center justify-center text-grey-1 transition-colors duration-150 hover:text-gold-1"
        >
          <HelpGlyph />
        </button>
      )}
      {showMinimize && (
        <button
          type="button"
          aria-label="Minimize"
          onClick={onMinimize}
          className="flex h-5 w-5 cursor-pointer items-center justify-center text-grey-1 transition-colors duration-150 hover:text-gold-1"
        >
          <MinimizeGlyph />
        </button>
      )}
      {onSettings && (
        <button
          type="button"
          aria-label="Settings"
          onClick={onSettings}
          className="flex h-5 w-5 cursor-pointer items-center justify-center text-grey-1 transition-colors duration-150 hover:text-gold-1"
        >
          <SettingsGlyph />
        </button>
      )}
      {showClose && (
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="flex h-5 w-5 cursor-pointer items-center justify-center text-grey-1 transition-colors duration-150 hover:text-gold-1"
        >
          <CloseGlyph />
        </button>
      )}
    </>
  );
}

/**
 * WindowFrame wraps the entire app shell with the LoL client's outer chrome
 * over a hextech-black background.
 *
 * Two chrome variants (see {@link WindowFrameProps.chrome}):
 * - `"titlebar"` (default): a slim draggable title bar with controls at its
 *   right end — the classic layout, still used by the login window. Keeps the
 *   full 1px gold-5 border box.
 * - `"integrated"`: no title-bar row; the controls float at the top-right,
 *   above the shell content and in-frame overlays (current-client era, #385).
 *   Per #505 it has NO border box — only a ~2px gold TOP line that connects to
 *   the active-tab chevron; left/right/bottom are borderless.
 *
 * Purely presentational — no internal state.
 */
export function WindowFrame({
  children,
  chrome = "titlebar",
  title,
  showHelp = true,
  showMinimize = true,
  showClose = true,
  onHelp,
  onMinimize,
  onClose,
  onSettings,
  showStatusDot = false,
}: WindowFrameProps) {
  const controls = (
    <WindowControls
      showHelp={showHelp}
      showMinimize={showMinimize}
      showClose={showClose}
      onHelp={onHelp}
      onMinimize={onMinimize}
      onClose={onClose}
      onSettings={onSettings}
      showStatusDot={showStatusDot}
    />
  );

  if (chrome === "integrated") {
    return (
      /* #505: the current client draws NO box around the window — only a thin
         (~2px) gold line caps the very TOP edge, which reads as one continuous
         gold accent with the active-tab chevron descending from it (the nav is
         an absolute overlay at top-0 per #502, so this border sits exactly at
         the nav's top edge). Left / right / bottom stay borderless. gold-3
         matches the ActiveChevron token so the line and chevron are one hue. */
      <div className="relative flex h-full w-full flex-col border-t-2 border-gold-3 bg-hextech-black">
        {/* Content fills the whole frame — no title-bar row is reserved. */}
        <div className="flex-1 overflow-auto">{children}</div>

        {/* Floating window controls — absolute top-right, above shell content
            AND in-frame overlays (e.g. Your Shop takeover, z-40). z-[60] keeps
            them clickable everywhere while sitting under the launch splash
            (z-100). */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[60] flex justify-end px-3 pt-2">
          <div className="pointer-events-auto flex items-center gap-1">
            {controls}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col border border-gold-5 bg-hextech-black">
      {/* Title bar */}
      <div className="flex h-8 shrink-0 items-center border-b border-gold-5 px-3">
        {/* Draggable region fills the bar */}
        <div className="flex flex-1 cursor-move select-none items-center">
          {title ? (
            <span className="font-display text-xs uppercase tracking-widest text-gold-2">
              {title}
            </span>
          ) : null}
        </div>

        {/* Window controls — order: ? ─ (⚙) ✕ per reference (#401) */}
        <div className="flex items-center gap-1">{controls}</div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
