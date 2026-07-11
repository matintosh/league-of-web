"use client";

// ---------------------------------------------------------------------------
// Diamond SVGs — inline, aria-hidden, currentColor
// ---------------------------------------------------------------------------

function FilledDiamond() {
  return (
    <svg
      aria-hidden="true"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rotated square — all four points touch the edges */}
      <rect
        x="1.5"
        y="1.5"
        width="7"
        height="7"
        fill="currentColor"
        transform="rotate(45 5 5)"
      />
    </svg>
  );
}

function OutlineDiamond() {
  return (
    <svg
      aria-hidden="true"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rotated square — stroked only */}
      <rect
        x="1.5"
        y="1.5"
        width="7"
        height="7"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
        transform="rotate(45 5 5)"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Warning triangle SVG — inline, aria-hidden
// ---------------------------------------------------------------------------

function WarningTriangle() {
  return (
    <svg
      aria-hidden="true"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Equilateral triangle pointing up */}
      <path
        d="M6 1.5 L11 10.5 L1 10.5 Z"
        fill="currentColor"
        strokeLinejoin="round"
      />
      {/* Exclamation mark — body */}
      <rect x="5.4" y="4.5" width="1.2" height="3.5" fill="#1e2328" />
      {/* Exclamation mark — dot */}
      <rect x="5.4" y="8.8" width="1.2" height="1.2" fill="#1e2328" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface QueueOption {
  /** Unique identifier for the queue option. */
  id: string;
  /** Display label shown next to the diamond bullet. */
  label: string;
  /** When true the row is non-interactive and dimmed. */
  disabled?: boolean;
  /** When true (and disabled) shows a red warning triangle before the label. */
  warning?: boolean;
}

export interface QueueTypeListProps {
  /** The list of queue options to display. */
  options: QueueOption[];
  /** ID of the currently selected option. */
  selectedId: string;
  /** Called when the user clicks a non-disabled row. */
  onSelect: (id: string) => void;
  /** Accessible label for the radiogroup. Defaults to "Queue type". */
  label?: string;
}

// ---------------------------------------------------------------------------
// QueueTypeList
// ---------------------------------------------------------------------------

/**
 * QueueTypeList renders a vertical radiogroup of diamond-bullet queue option
 * rows, shown below the mode description on the PvP screen.
 *
 * Controlled component — pass `selectedId` and `onSelect`.
 * Implements `role="radiogroup"` + `role="radio"` / `aria-checked` for full
 * keyboard and screen-reader accessibility, following the RoleSelector precedent.
 */
export function QueueTypeList({
  options,
  selectedId,
  onSelect,
  label = "Queue type",
}: QueueTypeListProps) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex flex-col gap-1"
    >
      {options.map((option) => {
        const isSelected = selectedId === option.id;
        const isDisabled = !!option.disabled;
        const showWarning = isDisabled && !!option.warning;

        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled}
            disabled={isDisabled}
            onClick={() => onSelect(option.id)}
            className={[
              "flex items-center gap-2 px-0 py-0.5 text-left",
              "transition-colors duration-150",
              // Disabled
              isDisabled
                ? "cursor-not-allowed text-grey-2 opacity-60"
                : [
                    "cursor-pointer",
                    isSelected ? "text-gold-2" : "text-grey-1 hover:text-gold-1",
                  ]
                    .filter(Boolean)
                    .join(" "),
              // Focus ring
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {/* Diamond bullet */}
            <span className="shrink-0">
              {isSelected ? <FilledDiamond /> : <OutlineDiamond />}
            </span>

            {/* Warning triangle — only for disabled+warning rows */}
            {showWarning && (
              <span className="shrink-0 text-warning">
                <WarningTriangle />
              </span>
            )}

            {/* Label */}
            <span
              className={[
                "font-body text-sm",
                isSelected && "font-bold",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
