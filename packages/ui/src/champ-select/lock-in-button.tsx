// ---------------------------------------------------------------------------
// LockInButton — NOT a variant of HextechButton.
//
// The pick-phase "LOCK IN" / lobby "FIND MATCH" button has a distinct visual
// language from the gold-bordered HextechButton. It uses:
//   - Trapezoid silhouette: wide flat top, sides sloping inward ~12% per side,
//     narrower flat bottom — via clip-path polygon on a layered border + fill.
//   - Enabled fill: bright cyan vertical gradient (cyan-1 top → teal-grad-a
//     bottom), thin cyan-1 border, hextech-black TEXT (dark-on-bright inversion).
//   - Disabled/In Queue: grey-4 dark fill, grey-3 border + grey-2 text.
//
// Trapezoid geometry (sampled from docs/reference/client-find-match-button.png):
//   Top edge: full width (0% 0% → 100% 0%)
//   Bottom edge: inset ~12% per side (12% 100% → 88% 100%)
//   Slope: linear from top corner to bottom inset — purely via clip-path polygon.
//
// Border technique (same as ModalFrame + PlayerBanner precedent):
//   Outer shell: 2px wider/taller, bg = border colour, clip-path polygon.
//   Inner fill:  overlaid absolutely, same clip-path, gradient fill.
//   This avoids CSS border fighting with clip-path.
//
// Do not refactor into HextechButton props — the shape/color contract is
// fundamentally different and would make HextechButton's API unstable.
// ---------------------------------------------------------------------------

// Trapezoid polygon — wider top, 12% inward slope per side toward narrower bottom.
// Sampled geometry from client-find-match-button.png close-up.
const TRAP_CLIP = "polygon(0% 0%, 100% 0%, 88% 100%, 12% 100%)";

// Pixel inset for the border shell trick (shell is 2px larger on each side).
// We position the fill layer 2px inset from the shell to simulate a 2px border.
const BORDER_PX = 2;

export interface LockInButtonProps {
  /**
   * When true the button is non-interactive: dark fill, grey text/border, aria-disabled,
   * click no-op. Use for "In Queue" state in the lobby or while no champion is selected.
   */
  disabled?: boolean;
  /**
   * Called when the player clicks to lock in / find a match.
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
  /**
   * Visual variant. Default "lock" uses the cyan/teal gradient (pick phase).
   * "ban" uses a red gradient (#c13333 → #8b1f1f, border #d94444) for the ban phase.
   *
   * Color divergence note (#275): No red token currently exists in @low/tokens.
   * The red values are hardcoded here as hex — intentional, documented, and consistent
   * with the Hextech Riot-red palette visible in the loadout emote context.
   * Tokens should be added (e.g. `--color-riot-red-1`) in a follow-up.
   */
  variant?: "lock" | "ban";
}

/**
 * LockInButton — trapezoid-shaped gradient confirmation button.
 *
 * Visual contract:
 * - Trapezoid silhouette (wider top, sides slope inward 12% per side, narrower
 *   bottom) via clip-path polygon on a two-layer border+fill technique.
 * - Enabled: bright cyan-teal vertical gradient fill (cyan-1 → teal-grad-a),
 *   cyan-1 border, hextech-black text (dark-on-bright).
 * - Hover: brighter cyan-2 fill top stop (teal-grad-hover-a → teal-grad-hover-b).
 * - Active/press: dimmed teal press gradient (teal-grad-press-a → teal-grad-press-b),
 *   text goes grey-1.
 * - Disabled/In Queue: grey-4 fill, grey-3 border, grey-2 text, cursor-not-allowed.
 *
 * NOT a HextechButton variant — shape and color language are distinct (trapezoid
 * cyan gradient vs rectangular gold borders). See file header for rationale.
 *
 * Both call sites (pick-screen LOCK IN + party-lobby-screen FIND MATCH) receive
 * the trapezoid geometry automatically — prop contract is unchanged.
 *
 * @param disabled  Greys the button; disables clicks; shows "In Queue" treatment.
 * @param onLockIn  Lock-in / find-match handler — called on click when not disabled.
 * @param label     Button label (default: "Lock In"). CSS uppercased.
 */
export function LockInButton({
  disabled = false,
  onLockIn,
  label = "Lock In",
  variant = "lock",
}: LockInButtonProps) {
  const isBan = variant === "ban";

  // Border colour: variant-dependent when enabled, grey-3 when disabled.
  const borderColor = disabled
    ? "var(--color-grey-3)"
    : isBan
      ? "#d94444"
      : "var(--color-cyan-1)";

  // Fill: variant gradient when enabled; flat grey-4 when disabled.
  const fillStyle = disabled
    ? { background: "var(--color-grey-4)" }
    : isBan
      ? { background: "linear-gradient(to bottom, #c13333 0%, #8b1f1f 100%)" }
      : {
          background:
            "linear-gradient(to bottom, var(--color-cyan-1) 0%, var(--color-teal-grad-a) 100%)",
        };

  // Text colour: white on red ban fill; hextech-black on cyan lock fill; grey-2 disabled.
  const textColor = disabled
    ? "var(--color-grey-2)"
    : isBan
      ? "#ffffff"
      : "var(--color-hextech-black)";

  return (
    <button
      type="button"
      aria-disabled={disabled ? "true" : undefined}
      onClick={disabled ? undefined : onLockIn}
      // Outer element: relative container matching the button's intended bounding box.
      // The actual visual shape is painted by the inner shell + fill layers.
      className={[
        "group relative flex w-full items-center justify-center",
        // Outer glow per the reference close-up — drop-shadow (not box-shadow:
        // it must follow the trapezoid silhouette of the clipped layers).
        // Ban variant uses a red glow; lock variant uses the cyan glow.
        !disabled && !isBan && "[filter:drop-shadow(0_0_8px_color-mix(in_srgb,var(--color-cyan-4)_55%,transparent))]",
        !disabled && isBan && "[filter:drop-shadow(0_0_8px_rgba(217,68,68,0.55))]",
        // Vertical padding drives height — 12px top/bottom = ~44px total
        "py-3",
        // Focus ring on the outer container (keyboard a11y)
        !disabled &&
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-1 focus-visible:outline-offset-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Border shell — same clip-path, background = border colour.           */}
      {/* Extends 2px beyond the fill in all directions to simulate a border.  */}
      {/* ------------------------------------------------------------------ */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: TRAP_CLIP,
          background: borderColor,
          transition: "background 150ms",
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Fill layer — inset 2px from shell, same clip-path, gradient fill.    */}
      {/* ------------------------------------------------------------------ */}
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute",
          // Hover: step up to the hover gradient stops
          !disabled && "group-hover:!bg-none",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          inset: BORDER_PX,
          clipPath: TRAP_CLIP,
          transition: "background 150ms, opacity 150ms",
          ...fillStyle,
        }}
      />

      {/* Hover fill overlay — rendered on top of fill, 0→1 opacity on hover.
          Lock: cyan hover gradient. Ban: slightly brighter red hover. */}
      {!disabled && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute opacity-0 group-hover:opacity-100 group-active:opacity-0 transition-opacity duration-150"
          style={{
            inset: BORDER_PX,
            clipPath: TRAP_CLIP,
            background: isBan
              ? "linear-gradient(to bottom, #d94444 0%, #a02828 100%)"
              : "linear-gradient(to bottom, var(--color-teal-grad-hover-a) 0%, var(--color-teal-grad-hover-b) 50%, var(--color-teal-grad-hover-c) 100%)",
          }}
        />
      )}

      {/* Press fill overlay — on active.
          Lock: dark teal press. Ban: dark red press. */}
      {!disabled && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute opacity-0 group-active:opacity-100 transition-opacity duration-75"
          style={{
            inset: BORDER_PX,
            clipPath: TRAP_CLIP,
            background: isBan
              ? "linear-gradient(to bottom, #8b1f1f 0%, #5c1414 100%)"
              : "linear-gradient(to bottom, var(--color-teal-grad-press-a) 0%, var(--color-teal-grad-press-b) 100%)",
          }}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Label text — sits above all shape layers via relative z-index.       */}
      {/* Dark on bright enabled; grey on dark disabled.                        */}
      {/* ------------------------------------------------------------------ */}
      <span
        className={[
          "relative z-10 font-display text-sm tracking-[0.2em] uppercase select-none",
          // Press: text dims to grey-1 over the darker press gradient (JSDoc contract)
          !disabled && "group-active:!text-grey-1",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          color: textColor,
          transition: "color 150ms",
        }}
      >
        {label}
      </span>
    </button>
  );
}
