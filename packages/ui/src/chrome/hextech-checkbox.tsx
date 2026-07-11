"use client";

export interface HextechCheckboxProps {
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
 * HextechCheckbox is the small square checkbox with gold border used for
 * filter toggles in the collection sidebar (e.g. "Show Unowned").
 *
 * Accessibility: wraps a `sr-only` native <input type="checkbox"> inside a
 * <label> so clicking the label text toggles the state. The visible square is
 * a purely decorative <div>.
 * Purely presentational — no internal state.
 */
export function HextechCheckbox({
  checked,
  onChange,
  label,
  disabled = false,
}: HextechCheckboxProps) {
  return (
    <label
      className={[
        "inline-flex items-center gap-2",
        "select-none",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
      ].join(" ")}
    >
      {/* Hidden native input — carries the a11y state */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="peer sr-only"
      />

      {/* Visual box */}
      <div
        aria-hidden="true"
        className={[
          "flex h-[14px] w-[14px] shrink-0 items-center justify-center",
          "border border-gold-4 bg-transparent",
          "transition-colors duration-150",
          // Gold outline on keyboard focus
          "peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-gold-3",
        ].join(" ")}
      >
        {checked && (
          <svg
            aria-hidden="true"
            viewBox="0 0 14 14"
            className="h-[10px] w-[10px] text-gold-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="2 7 5.5 10.5 12 3.5" />
          </svg>
        )}
      </div>

      {/* Label text */}
      <span className="font-body text-sm text-grey-1">{label}</span>
    </label>
  );
}
