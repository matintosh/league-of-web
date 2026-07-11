"use client";

export interface SearchInputProps {
  /** Controlled value of the search field. */
  value: string;
  /** Called with the new value whenever the user types. */
  onChange: (value: string) => void;
  /** Placeholder text shown when the field is empty. Defaults to 'Search'. */
  placeholder?: string;
  /** When true, the field is non-interactive and visually dimmed. */
  disabled?: boolean;
}

/**
 * SearchInput is the dark search field used in the collection sidebar to filter champions.
 *
 * Renders a full-width input with a magnifier SVG icon on the left.
 * Uses Hextech tokens: black background, grey border (gold on focus), gold text.
 * Purely presentational — no internal state.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search",
  disabled = false,
}: SearchInputProps) {
  return (
    <div
      className={[
        "relative flex w-full items-center",
        "bg-hextech-black border border-grey-3",
        "transition-colors duration-150",
        "focus-within:border-gold-4 focus-within:shadow-[0_0_0_1px_var(--color-gold-4)]",
        disabled && "opacity-50 cursor-not-allowed",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Magnifier icon */}
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        className="pointer-events-none ml-2 h-4 w-4 shrink-0 text-grey-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      >
        <circle cx="6.5" cy="6.5" r="4" />
        <line x1="9.8" y1="9.8" x2="13.5" y2="13.5" />
      </svg>

      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={[
          "w-full bg-transparent py-1.5 pl-2 pr-3",
          "font-body text-sm text-gold-1",
          "placeholder:text-grey-2",
          "outline-none",
          "[&::-webkit-search-cancel-button]:hidden",
          disabled ? "cursor-not-allowed" : "cursor-text",
        ].join(" ")}
      />
    </div>
  );
}
