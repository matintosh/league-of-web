// ---------------------------------------------------------------------------
// TrapezoidButton — the shared curved-trapezoid CTA primitive.
//
// The pick-phase "LOCK IN" / lobby "FIND MATCH" button (LockInButton) and the
// MATCH FOUND "ACCEPT!" button (MatchFoundModal) are the SAME Hextech shape:
//   - Trapezoid silhouette: NARROW flat top, sides splaying OUTWARD downward to
//     a full-width base — capped by a CURVED BOTTOM ARC bowing downward. The top
//     edge is DEAD FLAT. (#427: refit to the official CommunityDragon asset
//     lock-in-button-disabled-idle.png.)
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
// Geometry (#427) — fit to the official CommunityDragon asset
// lock-in-button-disabled-idle.png (166×44, shape span x[1..164] y[1..41]).
// The clip is clipPathUnits="objectBoundingBox", so the normalized silhouette
// equals this path; constants were fit directly to the traced PNG profile.
//
//   TOP edge:   DEAD FLAT (top peak at yf=0.000); outer corners inset 0.086 per
//               side (x15..150 of the x[1..164] span). → TOP_ARC = 0.
//   SIDES:      splay OUTWARD downward, reaching FULL width (x 0 / 1) at the
//               widest row (yf≈0.75 of the shape → box y≈0.66 given the arc).
//   BASE row:   TRAP_Y_BASE = 0.66 of the box (straight sides end, bottom arc
//               begins).
//   BOTTOM arc: quadratic from the full-width base corners through the center
//               tip, control y = TRAP_BOTTOM_ARC_Y (1.05) to blunt the point.
//
// Rendered-vs-PNG silhouette: mean |ΔL| = 0.42px over the 163px-wide reference
// (max 2.0px), excluding the singular bottom-tip row.
//
// History: pre-v14 was wide-top / narrow-base (inward taper). v14 reversed it to
// narrow-top / full-width-base. #427 flattened the top (was arched ~0.02) and
// refit the base from 0.713 → 0.66 against the official disabled asset.
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

// Geometry re-measured (#427) from the official CommunityDragon asset
// `lock-in-button-disabled-idle.png` (166×44). Because the clip uses
// clipPathUnits="objectBoundingBox", the normalized silhouette equals this path,
// so constants were fit directly to the traced PNG profile (alpha>30).

// Top-edge inset per side (objectBoundingBox). The flat top spans
// x[TRAP_TOP_INSET .. 1-TRAP_TOP_INSET]; sides splay OUTWARD to full width at the
// base. Measured 0.086 in the PNG (top corners x15..150 of the x[1..164] span).
export const TRAP_TOP_INSET = 0.086;

// Top-edge upward arch (objectBoundingBox y). The PNG top edge is DEAD FLAT — the
// top peak sits at yf=0.000 with no rise over the corners — so the arch is zero.
export const TRAP_TOP_ARC = 0.0;

// Base row (objectBoundingBox y): where the straight sides end and the bottom arc
// begins (the widest point). Fit to the PNG, whose widest row is at yf≈0.75 of the
// shape; with the bottom arc reaching tip ≈0.855, that widest point lands at box
// y≈0.66. (Was 0.713 — sides splayed a touch too steep.)
export const TRAP_Y_BASE = 0.66;

// Bottom-arc control-point y (objectBoundingBox). The quadratic base→tip→base uses
// this as its control; 1.05 (just past the box floor) rounds the bottom point to
// match the PNG, whose tip is slightly blunter than a y=1.0 control produces.
export const TRAP_BOTTOM_ARC_Y = 1.05;

// Arc padding: fraction of the BODY height added below for the downward bottom
// arc. The body ends at the base row; container height = body + arc_pad. With the
// base at TRAP_Y_BASE of the FULL box, the reserved arc room is (1 - Y_BASE) of
// the box, i.e. arc_pad / body = (1 - Y_BASE) / Y_BASE ⇒ (1-0.66)/0.66 ≈ 0.515.
export const TRAP_ARC_PAD_FRAC = (1 - TRAP_Y_BASE) / TRAP_Y_BASE; // ≈ 0.515

// Bottom padding CSS: pt-3 (12px) body top + ARC_PAD_FRAC of the ~44px body.
// Shared by both consumers so the arc room is identical everywhere.
export const TRAP_PADDING_BOTTOM = `calc(12px + 44px * ${TRAP_ARC_PAD_FRAC})`;

// SVG path in objectBoundingBox units (0..1 × 0..1), clockwise from top-left:
//   top-left corner → (arched top) → top-right corner
//   → straight side splaying OUT to base-right (full width)
//   → (bottom arc) bowing through center tip → base-left (full width)
//   → straight side back up to top-left. Close.
//
// Top edge: quadratic from top-left (S, TOP_ARC) through (0.5, 0) to top-right
//          (1-S, TOP_ARC). With TOP_ARC=0 this degenerates to a flat line.
// Bottom arc: quadratic from base-right (1, Y_BASE) through control
//          (0.5, TRAP_BOTTOM_ARC_Y) to base-left (0, Y_BASE).
function trapArcPath(): string {
  const s = TRAP_TOP_INSET.toFixed(6);
  const s1 = (1 - TRAP_TOP_INSET).toFixed(6);
  const ta = TRAP_TOP_ARC.toFixed(6);
  const yb = TRAP_Y_BASE.toFixed(6);
  const bc = TRAP_BOTTOM_ARC_Y.toFixed(6);
  return (
    `M ${s},${ta} ` + // top-left corner (flat top → ta=0)
    `Q 0.5,0 ${s1},${ta} ` + // top edge (flat when TOP_ARC=0)
    `L 1,${yb} ` + // splay outward to full-width base-right
    `Q 0.5,${bc} 0,${yb} ` + // bottom arc bowing through center tip
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
