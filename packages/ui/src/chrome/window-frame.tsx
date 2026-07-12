"use client";

import type { ReactNode } from "react";

export interface WindowFrameProps {
  /** Content to render inside the frame (the full app shell). */
  children?: ReactNode;
  /** Optional title text displayed in the title bar centre. */
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
}

/**
 * WindowFrame wraps the entire app shell with the LoL client's outer chrome:
 * 1px gold-5 border, hextech-black background, a slim draggable title bar,
 * and top-right window controls (minimize, close).
 *
 * Purely presentational — no internal state.
 */
export function WindowFrame({
  children,
  title,
  showHelp = true,
  showMinimize = true,
  showClose = true,
  onHelp,
  onMinimize,
  onClose,
}: WindowFrameProps) {
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

        {/* Window controls — order: ? ─ ✕ per reference */}
        <div className="flex items-center gap-1">
          {showHelp && (
            <button
              type="button"
              aria-label="Help"
              onClick={onHelp}
              className="flex h-5 w-5 cursor-pointer items-center justify-center text-grey-1 transition-colors duration-150 hover:text-gold-1"
            >
              {/* Help glyph — ? */}
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
            </button>
          )}
          {showMinimize && (
            <button
              type="button"
              aria-label="Minimize"
              onClick={onMinimize}
              className="flex h-5 w-5 cursor-pointer items-center justify-center text-grey-1 transition-colors duration-150 hover:text-gold-1"
            >
              {/* Minimise glyph — horizontal rule */}
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
            </button>
          )}

          {showClose && (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex h-5 w-5 cursor-pointer items-center justify-center text-grey-1 transition-colors duration-150 hover:text-gold-1"
            >
              {/* Close glyph — ✕ */}
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
            </button>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  );
}
