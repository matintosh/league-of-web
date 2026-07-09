"use client";

export interface HextechToggleProps {
  /** Whether the toggle is on. */
  checked: boolean;
  /** Called when the user clicks the toggle; receives the new checked value. */
  onChange: (checked: boolean) => void;
  /** When true, the toggle is non-interactive and visually dimmed. */
  disabled?: boolean;
  /**
   * Accessible name for the switch — used as aria-label.
   * May be visually hidden when the parent SettingsRow already provides a label.
   */
  label: string;
}

/**
 * HextechToggle is the on/off switch used throughout the LoL client settings.
 *
 * Renders as a <button role="switch"> for keyboard accessibility.
 * ON  = blue-4 track + blue-2 thumb + subtle glow
 * OFF = grey-4 track + grey-2 thumb
 * Purely presentational — no internal state.
 */
export function HextechToggle({
  checked,
  onChange,
  disabled = false,
  label,
}: HextechToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={[
        // Track base
        "relative inline-flex h-[18px] w-[36px] shrink-0 cursor-pointer items-center",
        "rounded-sm border transition-colors duration-150",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
        // Disabled
        disabled && "cursor-not-allowed opacity-50",
        // Track color
        checked
          ? "border-gold-4 bg-blue-4"
          : "border-grey-3 bg-grey-4",
        // Glow when on
        checked && !disabled
          ? "shadow-[0_0_6px_var(--color-blue-2)]"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Thumb */}
      <span
        className={[
          "absolute top-0.5 h-[10px] w-[10px] rounded-sm transition-all duration-150",
          checked ? "left-[22px] bg-blue-2" : "left-[2px] bg-grey-2",
        ].join(" ")}
      />
    </button>
  );
}
