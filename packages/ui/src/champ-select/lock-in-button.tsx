// ---------------------------------------------------------------------------
// LockInButton — NOT a variant of HextechButton.
//
// The pick-phase "LOCK IN" button has a distinct visual language from the
// gold-bordered HextechButton used elsewhere. It uses:
//   - bg-grey-4 fill (dark panel background)
//   - blue-2 border + blue-2 text (teal accent, not gold)
//   - wide beveled shape via explicit padding (not HextechButton's sizing scale)
//   - CSS uppercase (textTransform) — JSX label is natural-case for i18n/a11y
//
// Do not refactor into HextechButton props — the shape/color contract is
// fundamentally different and would make HextechButton's API unstable.
// ---------------------------------------------------------------------------

export interface LockInButtonProps {
  /**
   * When true the button is non-interactive: visually greyed, aria-disabled,
   * click no-op. Disable until the player has selected a champion.
   */
  disabled?: boolean;
  /**
   * Called when the player clicks to lock in their champion selection.
   * Never fired when disabled.
   */
  onLockIn: () => void;
  /**
   * Button label text. Defaults to "Lock In".
   * JSX receives natural-case; CSS text-transform: uppercase is applied via
   * the tracking-widest + uppercase class — do not pass an already-uppercased
   * string to keep accessible text natural.
   */
  label?: string;
}

/**
 * LockInButton — the wide teal-bordered confirmation button in the pick phase.
 *
 * Visual contract:
 * - bg-grey-4 fill panel background
 * - blue-2 border (1px) and blue-2 text color
 * - CSS uppercase + wide letter-spacing (not JSX uppercase)
 * - Disabled state: bg-grey-5/grey-4, grey-3 border + text, cursor-not-allowed
 * - Active/press state: brief blue-2 fill flash via active: pseudo
 *
 * NOT a HextechButton variant — shape and color language are distinct (teal vs gold).
 * See file header for rationale.
 *
 * @param disabled  Greys the button and prevents clicks until champion selected.
 * @param onLockIn  Lock-in handler — called on click when not disabled.
 * @param label     Button label text (default: "Lock In"). CSS uppercased.
 */
export function LockInButton({
  disabled = false,
  onLockIn,
  label = "Lock In",
}: LockInButtonProps) {
  return (
    <button
      type="button"
      aria-disabled={disabled ? "true" : undefined}
      onClick={disabled ? undefined : onLockIn}
      className={[
        // Base layout
        "relative flex w-full items-center justify-center",
        // Padding — wide bevel shape matching reference
        "px-16 py-3",
        // Display font + uppercase + wide tracking (natural-case label in JSX)
        "font-display text-base tracking-[0.2em] uppercase",
        // Background
        "bg-grey-4",
        // Border — 1px bevel
        "border",
        // State-dependent color
        disabled
          ? [
              "border-grey-3 text-grey-3 cursor-not-allowed",
            ].join(" ")
          : [
              "border-blue-2 text-blue-2 cursor-pointer",
              // Hover: subtle bg tint
              "hover:bg-blue-7",
              // Active/press: momentary fill
              "active:bg-blue-2 active:text-hextech-black",
              // Glow on focus
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-2",
              // Transition for bg/text
              "transition-colors duration-150",
            ].join(" "),
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Bevel corner ornaments — four triangular clips at corners, blue-2 */}
      {!disabled && (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-0 h-2 w-2 border-l border-t border-blue-2"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-2 w-2 border-r border-t border-blue-2"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 left-0 h-2 w-2 border-b border-l border-blue-2"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 right-0 h-2 w-2 border-b border-r border-blue-2"
          />
        </>
      )}
      {label}
    </button>
  );
}
