"use client";

export interface CircleSubmitButtonProps {
  /**
   * When true, the button renders in its disabled/default grey state.
   * When false, renders in the enabled riot-red state (hover also applies riot-red).
   */
  disabled?: boolean;
  /**
   * Accessible label for screen readers — required since the button has no visible text.
   * e.g. "Submit" or "Sign in".
   */
  ariaLabel: string;
  /** onClick handler passed through to the button element. */
  onClick?: () => void;
}

/**
 * CircleSubmitButton is the 48px circular submit button used on Riot's login page.
 *
 * Visual spec (extrapolated from reference screenshot + Riot's live login behavior):
 * - 48×48px circle with 1px login-surface (#ececec) border.
 * - Disabled / default state: white background, login-placeholder (#a7a7b7) arrow SVG.
 * - Enabled / hover state: riot-red (#eb022b) background, white arrow SVG.
 *   The transition from grey→red happens when the user has typed a value (controlled
 *   externally via the `disabled` prop) or on hover when enabled.
 *   Extrapolation: Riot's live login button turns red on hover even when "enabled",
 *   so riot-red is applied on hover regardless.
 *
 * type="submit" is the deliberate exception to the type="button" rule: this component
 * is designed to live inside a <form> and submit it via the browser's native submit
 * mechanism. Document this exception here so future reviewers don't "fix" it.
 *
 * Purely presentational — no internal state.
 */
export function CircleSubmitButton({
  disabled = true,
  ariaLabel,
  onClick,
}: CircleSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled}
      aria-label={ariaLabel}
      onClick={onClick}
      className={[
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
        "border border-login-surface",
        "transition-colors duration-150",
        disabled
          ? "cursor-not-allowed bg-white"
          : "cursor-pointer bg-white hover:bg-riot-red hover:border-riot-red",
        "group",
      ].join(" ")}
    >
      {/* Right-pointing arrow SVG */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={[
          "h-5 w-5 transition-colors duration-150",
          disabled
            ? "text-login-placeholder"
            : "text-login-placeholder group-hover:text-white",
        ].join(" ")}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </button>
  );
}
