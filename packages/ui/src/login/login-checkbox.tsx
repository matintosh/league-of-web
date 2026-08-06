"use client";

import { useId } from "react";

export interface LoginCheckboxProps {
  /** Whether the checkbox is checked. */
  checked: boolean;
  /** Called with the new boolean value when the user toggles the checkbox. */
  onChange: (checked: boolean) => void;
  /** Visible label text rendered to the right of the checkbox square. */
  label: string;
  /** When true, the checkbox is non-interactive and visually dimmed. */
  disabled?: boolean;
}

/**
 * LoginCheckbox is the small square checkbox used on Riot's login page
 * (e.g. "Stay signed in" or "Remember me").
 *
 * Visual spec:
 * - Small square (~16px), login-surface (#ececec) fill, no border at rest (borderless unchecked square).
 * - Checked state: riot-red (#eb022b) background fill + white checkmark SVG.
 * - Label: xs, bold, login-black (#000000), rendered to the right.
 *
 * Accessibility: wraps a `sr-only` native <input type="checkbox"> inside a <label>
 * so clicking anywhere in the row (square or text) toggles the state. The visible
 * square is a purely decorative <div> (aria-hidden). Pattern mirrors HextechCheckbox
 * (packages/ui/src/chrome/hextech-checkbox.tsx).
 * Purely presentational — no internal state.
 */
export function LoginCheckbox({
  checked,
  onChange,
  label,
  disabled = false,
}: LoginCheckboxProps) {
  const id = useId();

  return (
    <label
      htmlFor={id}
      className={[
        "inline-flex items-center gap-2",
        "select-none",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      ].join(" ")}
    >
      {/* Hidden native input — carries the a11y checked state */}
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="peer sr-only"
      />

      {/* Visual square — decorative, aria-hidden */}
      <div
        aria-hidden="true"
        className={[
          "flex h-4 w-4 shrink-0 items-center justify-center",
          "transition-colors duration-150",
          checked ? "border border-riot-red bg-riot-red" : "bg-login-surface",
          // Keyboard focus ring via peer
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-riot-red",
        ].join(" ")}
      >
        {checked && (
          <svg
            aria-hidden="true"
            viewBox="0 0 14 14"
            className="h-[10px] w-[10px] text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="2 7 5.5 10.5 12 3.5" />
          </svg>
        )}
      </div>

      {/* Label text */}
      <span className="font-body text-xs font-bold text-login-black">{label}</span>
    </label>
  );
}
