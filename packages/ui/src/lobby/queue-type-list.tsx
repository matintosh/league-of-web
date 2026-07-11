"use client";

// ---------------------------------------------------------------------------
// Diamond SVGs — inline, aria-hidden, currentColor
// ---------------------------------------------------------------------------

function FilledDiamond() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/*
       * Reference bullet (client-pvp-mode-select.jpg) is two-tone: a thick
       * gold ring diamond with a bright cream core. Ring uses currentColor
       * (parent span sets text-gold-3); core is gold-1 via token var —
       * safe in prod thanks to the tokens package's unconditional :root block.
       */}
      <path
        d="M7 1.4 L12.6 7 L7 12.6 L1.4 7 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M7 4.6 L9.4 7 L7 9.4 L4.6 7 Z"
        fill="var(--color-gold-1)"
      />
    </svg>
  );
}

function OutlineDiamond() {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rotated square — stroked only */}
      <path
        d="M7 1.4 L12.6 7 L7 12.6 L1.4 7 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
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
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Triangle pointing up — stroke matches fill to round the corners like the reference */}
      <path
        d="M6 1.5 L11 10.5 L1 10.5 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Exclamation mark — body (grey-4 dark cutout against the red triangle) */}
      <rect x="5.4" y="4.5" width="1.2" height="3.5" fill="var(--color-grey-4)" />
      {/* Exclamation mark — dot */}
      <rect x="5.4" y="8.8" width="1.2" height="1.2" fill="var(--color-grey-4)" />
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
              "flex items-center gap-2.5 px-0 py-1 text-left",
              "transition-colors duration-150",
              // Disabled — sampled reference text is exactly grey-2, no extra dimming
              isDisabled
                ? "cursor-not-allowed text-grey-2"
                : [
                    "cursor-pointer",
                    isSelected ? "text-gold-1" : "text-grey-1 hover:text-gold-1",
                  ]
                    .filter(Boolean)
                    .join(" "),
              // Focus ring
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {/* Diamond bullet — selected ring is gold-3 regardless of label color */}
            <span className={isSelected ? "shrink-0 text-gold-3" : "shrink-0"}>
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
                "font-display text-sm uppercase tracking-widest",
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
