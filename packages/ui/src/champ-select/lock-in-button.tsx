// ---------------------------------------------------------------------------
// LockInButton — NOT a variant of HextechButton.
//
// The pick-phase "LOCK IN" / lobby "FIND MATCH" button has a distinct visual
// language from the gold-bordered HextechButton. It uses:
//   - Trapezoid silhouette: wide flat top, sides sloping inward ~12% per side,
//     narrower base — with a CURVED BOTTOM ARC bowing downward (outward arc).
//   - Enabled fill: bright cyan vertical gradient (cyan-1 top → teal-grad-a
//     bottom), thin cyan-1 border, hextech-black TEXT (dark-on-bright inversion).
//   - Disabled/In Queue: grey-4 dark fill, grey-3 border + grey-2 text.
//
// Trapezoid + arc geometry (sampled from docs/reference/client-find-match-button.png
// and client-lobby-party-v11.png):
//   Top edge: full width (x=0..1)
//   Sides: slope inward ~12% per side from top to the trapezoid base
//   Bottom: quadratic bezier from bottom-left inset to bottom-right inset,
//           bowing downward. Control point at horizontal center, sagitta below base.
//
// Clip technique — SVG <clipPath> with clipPathUnits="objectBoundingBox":
//   Coordinates are 0..1 fractions of the element bounding box. This makes
//   the shape scale correctly at any width. The outer button container has
//   extra bottom padding (ARC_PAD_FRAC of height) so the arc has room to bow
//   below the trapezoid body without clipping. The SVG <clipPath> is injected
//   as an inline <defs> element (useId for uniqueness) and referenced by
//   style={{ clipPath: `url(#${id})` }} on the border shell and fill layers.
//
// Arc math (objectBoundingBox, 0..1 space):
//   Container height = body_height + arc_pad (arc_pad ≈ 22% of body_height).
//   Body ends at y_body = body_height / container_height.
//   Left inset corner:  (SLOPE, y_body)  where SLOPE = 0.12
//   Right inset corner: (1-SLOPE, y_body)
//   Arc control point:  (0.5, 1.0)  — bottom of padded container = sagitta tip
//   SVG path:  M 0,0 L 1,0 L (1-S),y_body Q 0.5,1 S,y_body L 0,0 Z
//
//   At a 300px-wide, 44px-body-height button:
//     container_height ≈ 54px, y_body ≈ 0.815
//     sagitta ≈ 10px below body base — matches reference proportions.
//
// Border technique (same as ModalFrame + PlayerBanner precedent):
//   Outer shell: inset-0, bg = border colour, clip-path url(#id).
//   Inner fill:  inset BORDER_PX, same clip-path, gradient fill.
//   This avoids CSS border fighting with clip-path.
//
// Do not refactor into HextechButton props — the shape/color contract is
// fundamentally different and would make HextechButton's API unstable.
// ---------------------------------------------------------------------------

"use client";

import { useId } from "react";

// Pixel inset for the border shell trick (shell is 2px larger on each side).
const BORDER_PX = 2;

// Trapezoid inward slope: 12% per side (sampled from reference close-up).
const SLOPE = 0.12;

// Arc padding: fraction of the body height added below for the downward arc.
// 0.22 ≈ 22% → at a 44px body this adds ~10px arc room (matches ~16px sagitta
// at the wider reference scale where button is ~200px in a 430px reference box).
const ARC_PAD_FRAC = 0.22;

// Precomputed y_body in objectBoundingBox space.
// container_height = body + arc_pad = body * (1 + ARC_PAD_FRAC)
// y_body = body / container_height = 1 / (1 + ARC_PAD_FRAC)
const Y_BODY = 1 / (1 + ARC_PAD_FRAC); // ≈ 0.8197

// SVG path in objectBoundingBox units (0..1 × 0..1):
//   M top-left → top-right → bottom-right inset (slope) → Q arc control (center bottom) → bottom-left inset → Z
// The Q (quadratic bezier) bows through (0.5, 1.0) — the bottom of the padded container.
function trapArcPath(): string {
  const yb = Y_BODY.toFixed(6);
  return `M 0,0 L 1,0 L ${(1 - SLOPE).toFixed(6)},${yb} Q 0.5,1 ${SLOPE.toFixed(6)},${yb} Z`;
}

const TRAP_PATH_D = trapArcPath();

// ---------------------------------------------------------------------------
// TrapClipDefs — inlines the SVG <clipPath> definition.
// Rendered as a 0×0 absolute SVG so it takes no layout space.
// ---------------------------------------------------------------------------
function TrapClipDefs({ id }: { id: string }) {
  return (
    <svg
      width={0}
      height={0}
      aria-hidden="true"
      style={{ position: "absolute", overflow: "hidden" }}
    >
      <defs>
        {/*
          clipPathUnits="objectBoundingBox": path coordinates are 0..1 fractions
          of the clipped element's bounding box — scales correctly at any size.
        */}
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d={TRAP_PATH_D} />
        </clipPath>
      </defs>
    </svg>
  );
}

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
   * Visual variant.
   * - "lock" (default): cyan/teal gradient fill — pick phase and Find Match button.
   * - "ban": red gradient fill using ban-red-1/2/3/press tokens — ban phase BAN button.
   */
  variant?: "lock" | "ban";
}

/**
 * LockInButton — trapezoid-shaped gradient confirmation button with curved bottom arc.
 *
 * Visual contract:
 * - Trapezoid + outward-arc silhouette: wider top, sides slope inward 12% per side,
 *   base closes with a downward quadratic bezier (sagitta ≈ 22% of body height).
 *   Shape is implemented via SVG <clipPath> with clipPathUnits="objectBoundingBox"
 *   so it scales to any container width without pixel arithmetic.
 * - Enabled: bright cyan-teal vertical gradient fill (cyan-1 → teal-grad-a),
 *   cyan-1 border, hextech-black text (dark-on-bright).
 * - Hover: brighter cyan-2 fill top stop (teal-grad-hover-a → teal-grad-hover-b).
 * - Active/press: dimmed teal press gradient (teal-grad-press-a → teal-grad-press-b),
 *   text goes grey-1.
 * - Disabled/In Queue: grey-4 fill, grey-3 border, grey-2 text, cursor-not-allowed.
 * - Drop-shadow glow follows the clipped silhouette (filter on the outer wrapper).
 *
 * NOT a HextechButton variant — shape and color language are distinct (trapezoid
 * cyan gradient vs rectangular gold borders). See file header for rationale.
 *
 * Both call sites (pick-screen LOCK IN + party-lobby-screen FIND MATCH) receive
 * the trapezoid+arc geometry automatically — prop contract is unchanged.
 *
 * @param disabled  Greys the button; disables clicks; shows "In Queue" treatment.
 * @param onLockIn  Lock-in / find-match handler — called on click when not disabled.
 * @param label     Button label (default: "Lock In"). CSS uppercased.
 * @param variant   "lock" (cyan/teal, default) or "ban" (brick-red, ban-phase CTA).
 */
export function LockInButton({
  disabled = false,
  onLockIn,
  label = "Lock In",
  variant = "lock",
}: LockInButtonProps) {
  // Unique ID per instance — required because SVG clipPath ids must be globally
  // unique in the document. useId() is SSR-safe and collision-free.
  const uid = useId();
  const clipId = `${uid}-trap-arc`;

  const isBan = variant === "ban";

  // Border colour: variant-dependent when enabled, grey-3 when disabled.
  const borderColor = disabled
    ? "var(--color-grey-3)"
    : isBan
      ? "var(--color-ban-red-1)"
      : "var(--color-cyan-1)";

  // Fill: variant gradient when enabled; flat grey-4 when disabled.
  const fillStyle = disabled
    ? { background: "var(--color-grey-4)" }
    : isBan
      ? { background: "linear-gradient(to bottom, var(--color-ban-red-2) 0%, var(--color-ban-red-3) 100%)" }
      : {
          background:
            "linear-gradient(to bottom, var(--color-cyan-1) 0%, var(--color-teal-grad-a) 100%)",
        };

  // Text colour: white on red ban fill; hextech-black on cyan lock fill; grey-2 disabled.
  // White is the CSS keyword — not a token, not a raw hex — for maximum contrast on the dark red fill.
  const textColor = disabled
    ? "var(--color-grey-2)"
    : isBan
      ? "white"
      : "var(--color-hextech-black)";

  // The clip URL reference — all shape layers share this single clipPath.
  const clipPathRef = `url(#${clipId})`;

  return (
    <button
      type="button"
      aria-disabled={disabled ? "true" : undefined}
      onClick={disabled ? undefined : onLockIn}
      // Outer element: relative container matching the button's intended bounding box.
      // Extra paddingBottom = ARC_PAD_FRAC * body_height gives the arc room to bow below.
      // The actual visual shape is painted by the inner shell + fill layers.
      className={[
        "group relative flex w-full items-center justify-center",
        // Outer glow per the reference close-up — drop-shadow (not box-shadow:
        // it must follow the clipped silhouette including the arc).
        // Ban variant uses a red glow; lock variant uses the cyan glow.
        !disabled && !isBan && "[filter:drop-shadow(0_0_8px_color-mix(in_srgb,var(--color-cyan-4)_55%,transparent))]",
        !disabled && isBan && "[filter:drop-shadow(0_0_8px_color-mix(in_srgb,var(--color-ban-red-1)_55%,transparent))]",
        // Vertical padding drives body height — 12px top, plus arc padding on bottom.
        // pb is set inline because ARC_PAD_FRAC is a JS constant, not a static Tailwind value.
        "pt-3",
        // Focus ring on the outer container (keyboard a11y)
        !disabled &&
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-1 focus-visible:outline-offset-2",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        // Arc bottom padding: ARC_PAD_FRAC of the 24px body padding (pt-3 + pb-3 = 24px + text ~20px ≈ 44px body).
        // 44px * ARC_PAD_FRAC ≈ 10px arc room, matching the reference sagitta.
        paddingBottom: `calc(12px + 44px * ${ARC_PAD_FRAC})`,
      }}
    >
      {/* Inline SVG defs — 0×0, position:absolute, no layout impact */}
      <TrapClipDefs id={clipId} />

      {/* ------------------------------------------------------------------ */}
      {/* Border shell — inset-0 fills entire padded container.              */}
      {/* background = border colour, clipPath carves the trapezoid+arc.     */}
      {/* ------------------------------------------------------------------ */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: clipPathRef,
          background: borderColor,
          transition: "background 150ms",
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Fill layer — inset 2px from shell, same clip-path, gradient fill.  */}
      {/* ------------------------------------------------------------------ */}
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute",
          !disabled && "group-hover:!bg-none",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          inset: BORDER_PX,
          clipPath: clipPathRef,
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
            clipPath: clipPathRef,
            background: isBan
              ? "linear-gradient(to bottom, var(--color-ban-red-1) 0%, color-mix(in srgb, var(--color-ban-red-2) 55%, var(--color-ban-red-3) 45%) 100%)"
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
            clipPath: clipPathRef,
            background: isBan
              ? "linear-gradient(to bottom, var(--color-ban-red-3) 0%, var(--color-ban-red-press) 100%)"
              : "linear-gradient(to bottom, var(--color-teal-grad-press-a) 0%, var(--color-teal-grad-press-b) 100%)",
          }}
        />
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Label text — sits above all shape layers via relative z-index.      */}
      {/* Dark on bright enabled; grey on dark disabled.                       */}
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
