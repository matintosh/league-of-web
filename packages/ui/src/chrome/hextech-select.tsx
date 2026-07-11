"use client";

/** A single option in the HextechSelect dropdown. */
export interface SelectOption {
  /** The value submitted when this option is selected. */
  value: string;
  /** The human-readable label shown in the dropdown. */
  label: string;
}

export interface HextechSelectProps {
  /** Controlled selected value. Pass an empty string when nothing is selected. */
  value: string;
  /** Called with the new value when the user changes the selection. */
  onChange: (value: string) => void;
  /** The list of options available in the dropdown. */
  options: Array<SelectOption>;
  /** Optional leading disabled option shown as a hint, e.g. "Champion". */
  placeholder?: string;
  /** When true, the select is non-interactive and visually dimmed. */
  disabled?: boolean;
}

/**
 * HextechSelect is the native styled select dropdown used for Champion and
 * Mastery filters in the collection sidebar.
 *
 * Uses `appearance-none` to strip OS chrome, then overlays stacked up/down
 * chevrons on the right side. The outer container provides the border and
 * background; the inner <select> is transparent and full-width.
 * Purely presentational — no internal state.
 */
export function HextechSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: HextechSelectProps) {
  return (
    <div
      className={[
        "relative w-full",
        "bg-hextech-black border border-grey-3",
        "transition-colors duration-150",
        "focus-within:border-gold-4 focus-within:shadow-[0_0_0_1px_var(--color-gold-4)]",
        disabled && "opacity-50 cursor-not-allowed",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={[
          "w-full appearance-none bg-transparent",
          "py-1.5 pl-3 pr-8",
          "font-body text-sm text-grey-1",
          "outline-none",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Stacked up/down chevron overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-2 flex flex-col items-center justify-center leading-none text-grey-2"
      >
        <span className="text-[7px] leading-[1]">▲</span>
        <span className="text-[7px] leading-[1]">▼</span>
      </div>
    </div>
  );
}
