// ---------------------------------------------------------------------------
// TrapezoidButton — the shared curved-trapezoid CTA primitive.
//
// The pick-phase "LOCK IN" / lobby "FIND MATCH" button (LockInButton) and the
// MATCH FOUND "ACCEPT!" button (MatchFoundModal) are the SAME Hextech shape:
//   - Trapezoid silhouette: wide flat top, sides sloping inward ~12% per side,
//     narrower base — with a CURVED BOTTOM ARC bowing downward (outward arc).
//   - A border "shell" layer (bg = border colour) with the fill layer inset
//     BORDER_PX on top, both sharing one objectBoundingBox <clipPath> so the
//     border follows the arc without CSS borders fighting the clip.
//   - A drop-shadow glow on the outer wrapper that follows the clipped
//     silhouette (including the arc).
//
// Before #331 this geometry + layer scaffold was duplicated verbatim in
// lock-in-button.tsx and inside match-found-modal.tsx (private AcceptTrapezoid).
// This primitive is the single source of truth; both consumers supply only
// their palette (via `layers`) and optional overlays (via `overlay`).
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
//   below the trapezoid body without clipping.
//
// Arc math (objectBoundingBox, 0..1 space):
//   Container height = body_height + arc_pad (arc_pad ≈ 22% of body_height).
//   Body ends at y_body = body_height / container_height.
//   Left inset corner:  (SLOPE, y_body)  where SLOPE = 0.12
//   Right inset corner: (1-SLOPE, y_body)
//   Arc control point:  (0.5, 1.0)  — bottom of padded container = sagitta tip
//   SVG path:  M 0,0 L 1,0 L (1-S),y_body Q 0.5,1 S,y_body L 0,0 Z
// ---------------------------------------------------------------------------

"use client";

import { useId, type CSSProperties, type ReactNode } from "react";

// Pixel inset for the border shell trick (shell is 2px larger on each side).
export const TRAP_BORDER_PX = 2;

// Trapezoid inward slope: 12% per side (sampled from reference close-up).
export const TRAP_SLOPE = 0.12;

// Arc padding: fraction of the body height added below for the downward arc.
// 0.22 ≈ 22% → at a 44px body this adds ~10px arc room (matches ~16px sagitta
// at the wider reference scale where button is ~200px in a 430px reference box).
export const TRAP_ARC_PAD_FRAC = 0.22;

// Precomputed y_body in objectBoundingBox space.
// container_height = body + arc_pad = body * (1 + ARC_PAD_FRAC)
// y_body = body / container_height = 1 / (1 + ARC_PAD_FRAC)
export const TRAP_Y_BODY = 1 / (1 + TRAP_ARC_PAD_FRAC); // ≈ 0.8197

// Bottom padding CSS: pt-3 (12px) body top + ARC_PAD_FRAC of the ~44px body.
// Shared by both consumers so the arc room is identical everywhere.
export const TRAP_PADDING_BOTTOM = `calc(12px + 44px * ${TRAP_ARC_PAD_FRAC})`;

// SVG path in objectBoundingBox units (0..1 × 0..1):
//   M top-left → top-right → bottom-right inset (slope) → Q arc control (center bottom) → bottom-left inset → Z
// The Q (quadratic bezier) bows through (0.5, 1.0) — the bottom of the padded container.
function trapArcPath(): string {
  const yb = TRAP_Y_BODY.toFixed(6);
  return `M 0,0 L 1,0 L ${(1 - TRAP_SLOPE).toFixed(6)},${yb} Q 0.5,1 ${TRAP_SLOPE.toFixed(6)},${yb} Z`;
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

/**
 * A single clipped shape layer stacked inside the trapezoid. Each layer is
 * inset by `inset` px from the outer button box and clipped to the shared
 * trapezoid path. `className` carries the state transitions (hover/active
 * opacity) and `style` the colour/gradient. This is how a consumer expresses
 * its palette: an ordered list of these layers, bottom (border shell) to top.
 */
export interface TrapLayer {
  /** Stable key for React reconciliation. */
  key: string;
  /** Inset from the outer button box in px. 0 = border shell; TRAP_BORDER_PX = fill. */
  inset: number;
  /** Tailwind/utility classes (state transitions, group-hover opacity, etc.). */
  className?: string;
  /** Inline style — background/gradient/transition. clipPath is injected by the primitive. */
  style?: CSSProperties;
}

export interface TrapezoidButtonProps {
  /** Accessible label content — sits above every shape layer. */
  children: ReactNode;
  /** Click handler. Omit (or pass undefined) for a non-interactive button. */
  onClick?: () => void;
  /** aria-disabled — set true for the non-interactive/greyed state. */
  disabled?: boolean;
  /**
   * Ordered shape layers, bottom → top. The first is conventionally the border
   * shell (inset 0, bg = border colour); the rest are fill / hover / press
   * overlays inset by TRAP_BORDER_PX. clipPath is applied by the primitive.
   */
  layers: TrapLayer[];
  /** Classes for the label span (font, tracking, colour transitions). */
  labelClassName?: string;
  /** Inline style for the label span (colour, transition). */
  labelStyle?: CSSProperties;
  /** Extra classes on the outer <button> (glow drop-shadow, focus ring, cursor). */
  className?: string;
  /**
   * Overlay slot rendered ABOVE the shape layers but BELOW the label — receives
   * the shared clipId so overlays (e.g. an entrance-pulse wash) can clip to the
   * trapezoid. Video/glow layers that must bleed past the silhouette ignore it.
   */
  overlay?: (ctx: { clipId: string; clipRef: string }) => ReactNode;
  /**
   * Bleed slot rendered ABOVE the shape layers and NOT clipped — for video/glow
   * overlays whose bleed must extend past the trapezoid. Sits below the label.
   */
  bleed?: ReactNode;
  /** Pointer handlers forwarded to the outer <button> (video state machine). */
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
}

/**
 * TrapezoidButton — trapezoid-shaped button with a curved bottom arc, built as
 * stacked clipped layers (border shell + fill/overlays) beneath a label.
 *
 * Presentational and palette-agnostic: consumers supply their colours through
 * `layers` and their overlays through `overlay`/`bleed`. Geometry (slope, arc,
 * clip) is fixed and shared so FIND MATCH, LOCK IN, BAN, and ACCEPT are literally
 * the same shape.
 */
export function TrapezoidButton({
  children,
  onClick,
  disabled = false,
  layers,
  labelClassName,
  labelStyle,
  className,
  overlay,
  bleed,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
}: TrapezoidButtonProps) {
  // Unique ID per instance — SVG clipPath ids must be globally unique. useId()
  // is SSR-safe and collision-free.
  const uid = useId();
  const clipId = `${uid}-trap-arc`;
  const clipRef = `url(#${clipId})`;

  return (
    <button
      type="button"
      aria-disabled={disabled ? "true" : undefined}
      onClick={disabled ? undefined : onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className={[
        "group relative flex w-full items-center justify-center pt-3",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ paddingBottom: TRAP_PADDING_BOTTOM }}
    >
      {/* Inline SVG defs — 0×0, position:absolute, no layout impact */}
      <TrapClipDefs id={clipId} />

      {/* Bleed slot (video/glow overlays) — above fills, below label, unclipped. */}
      {bleed}

      {/* Shape layers, bottom → top. clipPath injected here so consumers never
          repeat the url() reference. */}
      {layers.map((layer) => (
        <span
          key={layer.key}
          aria-hidden="true"
          className={["pointer-events-none absolute", layer.className]
            .filter(Boolean)
            .join(" ")}
          style={{
            ...(layer.inset === 0 ? { inset: 0 } : { inset: layer.inset }),
            clipPath: clipRef,
            ...layer.style,
          }}
        />
      ))}

      {/* Overlay slot — clipped to the trapezoid, above fills, below label. */}
      {overlay?.({ clipId, clipRef })}

      {/* Label — sits above all shape layers via relative z-index. */}
      <span
        className={["relative z-10 select-none", labelClassName]
          .filter(Boolean)
          .join(" ")}
        style={labelStyle}
      >
        {children}
      </span>
    </button>
  );
}
