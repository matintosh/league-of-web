"use client";

import { useId } from "react";

export interface LoginTextInputProps {
  /** Controlled value of the input field. */
  value: string;
  /** Called with the new value whenever the user types. */
  onChange: (value: string) => void;
  /** Visible label text; also used as the floating placeholder. */
  label: string;
  /**
   * HTML input type — use "password" to mask input.
   * Defaults to "text". Passed straight through to the native <input>.
   */
  type?: "text" | "password" | "email";
  /** When true, the field is non-interactive and visually dimmed. */
  disabled?: boolean;
}

/**
 * LoginTextInput is the filled text field used on Riot's login page.
 *
 * Visual spec (extrapolated from Riot's live login behavior + reference screenshot):
 * - ~48px tall, square corners, login-surface (#ececec) background, no border at rest.
 * - The <label> is styled as an uppercase, xs, bold placeholder centred in the box when
 *   the field is empty and unfocused ("placeholder position"). It transitions to a tiny
 *   top-left label when the field is focused OR has a value ("float position").
 *   This is achieved with the CSS peer pattern: the native <input> carries `peer`; the
 *   <label> reads `peer-focus:…` and `peer-[not(:placeholder-shown)]:…` to reposition.
 *   The placeholder-shown trick requires the <input> to have placeholder=" " (a single
 *   space) so the browser reports placeholder-shown=false as soon as the user types,
 *   without the space itself being visible.
 * - Focus state: 2px riot-red bottom border (extrapolated from Riot's live client;
 *   the reference screenshot does not show focused state, but live Riot pages use a
 *   red underline for active inputs in their light-theme forms).
 * - Text: login-ink (#343434).
 * - Purely presentational — no internal state.
 */
export function LoginTextInput({
  value,
  onChange,
  label,
  type = "text",
  disabled = false,
}: LoginTextInputProps) {
  const id = useId();

  return (
    <div
      className={[
        "relative w-full",
        disabled ? "opacity-50 cursor-not-allowed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder=" "
        className={[
          "peer w-full bg-login-surface px-3 pt-5 pb-2",
          "h-12 rounded-none border-b-2 border-b-transparent",
          "font-body text-sm text-login-ink",
          "outline-none",
          "focus:border-b-riot-red",
          "transition-colors duration-150",
          disabled ? "cursor-not-allowed" : "cursor-text",
        ].join(" ")}
      />
      <label
        htmlFor={id}
        className={[
          "pointer-events-none absolute left-3 select-none",
          "font-body font-bold uppercase tracking-wide text-login-placeholder",
          "transition-all duration-150",
          // Placeholder position: centred vertically (14px ≈ top-1/2 minus half line-height for xs text)
          "top-1/2 -translate-y-1/2 text-xs",
          // Float position: when focused OR value present (placeholder not shown)
          "peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[10px]",
          "peer-[&:not(:placeholder-shown)]:top-2 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[10px]",
        ].join(" ")}
      >
        {label}
      </label>
    </div>
  );
}
