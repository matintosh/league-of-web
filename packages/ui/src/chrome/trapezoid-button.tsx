// ---------------------------------------------------------------------------
// TrapezoidButton — the shared curved-trapezoid CTA primitive.
//
// The pick-phase "LOCK IN" / lobby "FIND MATCH" button (LockInButton) and the
// MATCH FOUND "ACCEPT!" button (MatchFoundModal) are the SAME Hextech shape:
//   - Trapezoid silhouette: NARROW flat top, sides splaying OUTWARD downward to
//     a full-width base — capped by a CURVED BOTTOM ARC bowing downward. The top
//     edge is gently arched upward. (v14: matches
//     docs/reference/client-find-match-shape-v14.png.)
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
// ---------------------------------------------------------------------------
// v14 geometry — re-measured from docs/reference/client-find-match-shape-v14.png
// (PIL, near-white bright-frame outline; scratchpad measure_v14d.py):
//
//   Outer frame bbox 375×94 px → aspect ≈ 3.99:1.
//   TOP edge:   outer corners at x 0.085 / 0.915 of the box width (NARROW top,
//               ~8.5% inset per side), gently arched upward (~2px rise).
//   SIDES:      splay OUTWARD downward — half-width 0.415 at top → 0.5 at base,
//               reaching the FULL width (x 0 / 1) at the base corners.
//   BASE row:   y ≈ 0.713 of the box height (where the straight sides end and
//               the bottom arc begins).
//   BOTTOM arc: quadratic bow from the full-width base corners down through the
//               center tip at (0.5, 1.0); sagitta ≈ 0.287 of the box height
//               (27px at the 94px reference scale).
//
// This REVERSES the pre-v14 silhouette: the old shape was wide-top / narrow-base
// (inward taper, TRAP_SLOPE = 0.12). v14 is narrow-top / full-width-base
// (outward splay, TRAP_TOP_INSET = 0.085) — the true client shape.
//
// Before → after (objectBoundingBox 0..1):
//   top corners:      (0.00, 0) / (1.00, 0)   →  (0.085, ~0.02) / (0.915, ~0.02)
//   top arc peak y:   flat (0)                →  0 (center rises ~0.02 above corners)
//   base corners:     (0.12, 0.820) / (0.88…) →  (0.000, 0.713) / (1.000, 0.713)
//   bottom arc tip:   (0.5, 1.0)              →  (0.5, 1.0)   [sagitta deeper vs body]
//
// Clip technique — SVG <clipPath> with clipPathUnits="objectBoundingBox":
//   Coordinates are 0..1 fractions of the element bounding box, so the shape
//   scales correctly at any width. The outer button container adds extra bottom
//   padding (ARC_PAD_FRAC of body height) so the bottom arc has room to bow
//   below the trapezoid body without clipping.
// ---------------------------------------------------------------------------

"use client";

import { useId, type CSSProperties, type ReactNode } from "react";

// Pixel inset for the border shell trick (the shell reads as the frame; the fill
// is inset this many px on each side). v14 frame measures ~4.7% of height ≈
// 4-5px at the 94px reference scale; at the in-app ~50-60px body height a 3px
// inset lands in that ratio band and reads as the thick near-white v14 frame
// (pre-v14 was 2px teal). Consumers key their fill/overlay insets off this.
export const TRAP_BORDER_PX = 3;

// Top-edge inset per side (objectBoundingBox). The flat top spans
// x[TRAP_TOP_INSET .. 1-TRAP_TOP_INSET]; sides splay OUTWARD to full width at the
// base. Measured 0.085 (top outer corners x136..447 in a 375px-wide frame box).
export const TRAP_TOP_INSET = 0.085;

// Top-edge upward arch (objectBoundingBox y). The top center rises this far above
// the top corners — a gentle convex arc. Measured ~2px over a 94px box ≈ 0.02.
export const TRAP_TOP_ARC = 0.02;

// Base row (objectBoundingBox y): where the straight sides end and the bottom arc
// begins. Measured y≈0.713 (widest bright row y132 in a 94px-tall frame box).
export const TRAP_Y_BASE = 0.713;

// Arc padding: fraction of the BODY height added below for the downward bottom
// arc. The body ends at the base row; container height = body + arc_pad. With the
// base at TRAP_Y_BASE of the FULL box and the arc tip at y=1.0, the sagitta is
// (1 - TRAP_Y_BASE) of the box = 0.287. Expressed as a fraction of body height:
//   arc_pad / body = (1 - Y_BASE) / Y_BASE  ⇒  0.287 / 0.713 ≈ 0.402.
export const TRAP_ARC_PAD_FRAC = (1 - TRAP_Y_BASE) / TRAP_Y_BASE; // ≈ 0.4025

// Bottom padding CSS: pt-3 (12px) body top + ARC_PAD_FRAC of the ~44px body.
// Shared by both consumers so the arc room is identical everywhere.
export const TRAP_PADDING_BOTTOM = `calc(12px + 44px * ${TRAP_ARC_PAD_FRAC})`;

// SVG path in objectBoundingBox units (0..1 × 0..1), clockwise from top-left:
//   top-left corner → (arched top) → top-right corner
//   → straight side splaying OUT to base-right (full width)
//   → (bottom arc) bowing through center tip → base-left (full width)
//   → straight side back up to top-left. Close.
//
// Top arc: quadratic from top-left (S, TOP_ARC) through peak (0.5, 0) to
//          top-right (1-S, TOP_ARC) — center sits TOP_ARC above the corners.
// Bottom arc: quadratic from base-right (1, Y_BASE) through tip (0.5, 1) to
//          base-left (0, Y_BASE).
function trapArcPath(): string {
  const s = TRAP_TOP_INSET.toFixed(6);
  const s1 = (1 - TRAP_TOP_INSET).toFixed(6);
  const ta = TRAP_TOP_ARC.toFixed(6);
  const yb = TRAP_Y_BASE.toFixed(6);
  return (
    `M ${s},${ta} ` + // top-left corner (slightly below the arc peak)
    `Q 0.5,0 ${s1},${ta} ` + // arched top edge, peaking at center (y=0)
    `L 1,${yb} ` + // splay outward to full-width base-right
    `Q 0.5,1 0,${yb} ` + // bottom arc bowing through center tip
    `Z` // straight side back up to the top-left start
  );
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
