"use client";

import React, { useId } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

// ---------------------------------------------------------------------------
// Size map — Record ensures both members are always present.
// 1× measurements: Figma API extraction (node 22:132) + issue #57 comment.
// hero scales proportionally ×~1.7 from the 1× default.
// ---------------------------------------------------------------------------

export type PlayButtonSize = "default" | "hero";

interface SizeConfig {
  /** Medallion outer diameter (px) */
  medallion: number;
  /** Socket circle diameter (px) — default state */
  socket: number;
  /** Socket diameter when pressed (active:) */
  socketPressed: number;
  /** Bar total height (px) */
  bar: number;
  /** Minimum bar width incl. all padding (px) */
  barMinWidth: number;
  /** Horizontal content padding inside bar (px) */
  barPx: number;
  /** Gap between icon/text (px) */
  gap: number;
  /** Label font-size (px) */
  fontSize: number;
  /** Label line-height (px) */
  lineHeight: number;
  /** Corner chevron leg length (px) */
  cornerLeg: number;
  /** Corner inset from edge (px) */
  cornerInset: number;
  /** How far bar extends left on press (px) */
  pressExtend: number;
}

const SIZE_MAP: Record<PlayButtonSize, SizeConfig> = {
  default: {
    medallion: 44,
    socket: 44,
    socketPressed: 40,
    bar: 34,
    barMinWidth: 128,
    barPx: 32,
    gap: 4,
    fontSize: 15,
    lineHeight: 19,
    cornerLeg: 8,
    cornerInset: 3,
    pressExtend: 1.3,
  },
  hero: {
    medallion: 75,
    socket: 75,
    socketPressed: 68,
    bar: 58,
    barMinWidth: 218,
    barPx: 54,
    gap: 7,
    fontSize: 26,
    lineHeight: 32,
    cornerLeg: 14,
    cornerInset: 5,
    pressExtend: 2.2,
  },
};

// ---------------------------------------------------------------------------
// Arrow clip-path — pointed right, uses only bar height (not width, which is
// dynamic/CSS-controlled). The `w` param is unused but kept for symmetry.
// ---------------------------------------------------------------------------

/** CSS clip-path polygon for an arrow pointing right. Only `h` matters. */
function arrowClip(h: number): string {
  const tip = h / 2;
  return `polygon(0% 0%, calc(100% - ${tip}px) 0%, 100% 50%, calc(100% - ${tip}px) 100%, 0% 100%)`;
}

// ---------------------------------------------------------------------------
// Teal gradient border — state-driven inline background on the border layer.
// The three gradient strings by state (used both inline and for documentation).
// ---------------------------------------------------------------------------

const TEAL_GRAD = {
  default:
    "linear-gradient(180deg, var(--color-teal-grad-a) 0%, var(--color-teal-grad-b) 100%)",
  hover:
    "linear-gradient(180deg, var(--color-teal-grad-hover-a) 0%, var(--color-teal-grad-hover-b) 51%, var(--color-teal-grad-hover-c) 100%)",
  pressed:
    "linear-gradient(180deg, var(--color-teal-grad-press-a) 0%, var(--color-teal-grad-press-b) 100%)",
};

// ---------------------------------------------------------------------------
// 'L' glyph SVG
// Spec: fill base #C28F2C (≈gold-3), overlay gradient gold-4→gold-3 (top→bottom),
// 2.25px solid rgba(0,0,0,0.6) outline, drop-shadow 0 0 3px rgba(0,0,0,0.4).
// ---------------------------------------------------------------------------

interface LeagueGlyphProps {
  size: number;
  glyphGradId: string;
  disabled?: boolean;
}

function LeagueGlyph({ size, glyphGradId, disabled }: LeagueGlyphProps) {
  // Angular 'L' path matching v2 (proven geometry)
  const path = "M5 2h4v13h7.5V18H5V2z M12.5 15h4v3h-4z";

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        overflow: "visible",
        filter: "drop-shadow(0 0 3px rgba(0,0,0,0.4))",
      }}
    >
      <defs>
        {/* Overlay gradient: gold-5 (dark gold ≈ #7D5826) → gold-3 (≈ #C69442) */}
        <linearGradient id={glyphGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-gold-5)" />
          <stop offset="100%" stopColor="var(--color-gold-3)" />
        </linearGradient>
      </defs>

      {/* Base fill: gold-3 (#C89B3C ≈ #C28F2C) */}
      <path
        d={path}
        fill={disabled ? "var(--color-grey-3)" : "var(--color-gold-3)"}
      />

      {/* Gradient overlay (semi-transparent so base shows through) */}
      {!disabled && (
        <path d={path} fill={`url(#${glyphGradId})`} opacity={0.8} />
      )}

      {/* Outline: 2.25px black/60 */}
      <path
        d={path}
        fill="none"
        stroke="rgba(0,0,0,0.6)"
        strokeWidth={2.25}
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Medallion — SVG ring + interior + 'L' glyph.
//
// Spec (measured, 1×):
//   Base ellipses: grey-4 (#1E2328) stacked discs
//   Interior: navy-swirl (#082640 ≈ blue-7) rotated ~30° — approximated via
//             rotated radial gradient; no bitmap dependency.
//   Ring: 1.5px teal-ring (#167786) with mix-blend-mode: color-dodge
//         (Figma: "Ellipse 5 mix-blend-mode: color-dodge; border: 3px solid #167786 @2×")
//   Glyph: overlaid on top
// ---------------------------------------------------------------------------

interface MedallionProps {
  size: number;
  disabled?: boolean;
  discGradId: string;
  glyphGradId: string;
}

function Medallion({ size, disabled, discGradId, glyphGradId }: MedallionProps) {
  const r = size / 2;
  const ringStrokeW = size >= 60 ? 2.5 : 1.5;
  const glyphSize = Math.round(size * 0.65);

  return (
    <div
      aria-hidden="true"
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* SVG: base discs, swirl fill, ring */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="absolute inset-0"
        overflow="visible"
      >
        <defs>
          {/* Navy-swirl interior: radial approximating rotated ~30° texture */}
          <radialGradient id={discGradId} cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="var(--color-navy-swirl)" stopOpacity="0.8" />
            <stop offset="55%" stopColor="var(--color-navy-swirl)" />
            <stop offset="100%" stopColor="var(--color-grey-4)" />
          </radialGradient>
        </defs>

        {/* Base disc: grey-4 */}
        <circle cx={r} cy={r} r={r} fill="var(--color-grey-4)" />

        {/* Interior swirl disc */}
        <circle
          cx={r}
          cy={r}
          r={r - ringStrokeW - 1}
          fill={disabled ? "var(--color-grey-4)" : `url(#${discGradId})`}
        />

        {/* Teal ring — color-dodge mode per Figma spec */}
        <circle
          cx={r}
          cy={r}
          r={r - ringStrokeW / 2}
          fill="none"
          stroke={disabled ? "var(--color-grey-3)" : "var(--color-teal-ring)"}
          strokeWidth={ringStrokeW}
          style={disabled ? undefined : { mixBlendMode: "color-dodge" }}
        />
      </svg>

      {/* Glyph */}
      <div className="absolute inset-0 flex items-center justify-center">
        <LeagueGlyph
          size={glyphSize}
          glyphGradId={glyphGradId}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BarFrame v3 — four-layer clip-path stack implementing the Figma spec:
//
//   Layer 1 (outermost): 4px black/50 ring  (1× node w=4)
//   Layer 2:              1px dark-teal backing (#0B4052 / --color-teal-frame)
//                         This makes the teal frame read against dark backgrounds.
//                         Spec requests 2px, but 2px yields 18px surface vs 19px
//                         line-height (overflows by 1px) — reduced to 1px so the
//                         surface is 20px (fits 19px line-height with 1px clearance).
//   Layer 3:              2px teal gradient border  ← gradient varies by state
//   Layer 4 (surface):    rgba(30,35,40,0.95)
//
// The teal gradient border is the most challenging — CSS border-image doesn't
// survive clip-path. Solution: the border layer IS a div that fills the gap
// between layer-2 and layer-4; its `background` is the teal gradient, and
// the nested clip-path creates a 2px "frame" of that gradient color around the
// surface. The gradient is swapped via inline style on the wrapper using
// group-hover/pb and group-active/pb via sibling div opacity trick.
//
// Because Tailwind can't directly apply `group-hover:style` to change gradient
// stops, we stack three border-layer divs (one per state) that fade in/out
// via opacity transitions on group-hover/active.
//
// Corner pieces (TR/BR): CSS positioned divs with two borders forming an 'L'.
// Socket pocket: semi-transparent left-edge semicircle.
//
// Pressed geometry: socket shrinks (44→40px default, 75→68px hero) and bar
// extends left by pressExtend px via reduced left padding, both on group-active/pb.
// Socket size uses CSS var --socket-size, overridden by group-active/pb class.
// ---------------------------------------------------------------------------

// Layer widths per side (px):
//   BLACK_RING:    4  (per governing node w=4 at 1×)
//   TEAL_BACKING:  1  (spec says 2, but 2 → surface=18px < 19px line-height; reduced to 1)
//   TEAL_BORDER:   2  (gradient frame)
//   Per-side:      7  → TOTAL_INSET = 14 → surface = 34−14 = 20px (fits 19px lh)
const BLACK_RING = 4;
const TEAL_BACKING = 1; // dark-teal (#0B4052) layer; would be 2 but that clips 19px text
const TEAL_BORDER = 2;
const TOTAL_INSET = (BLACK_RING + TEAL_BACKING + TEAL_BORDER) * 2; // 14px total vertical

interface BarFrameProps {
  cfg: SizeConfig;
  disabled?: boolean;
  children: ReactNode;
}

function BarFrame({ cfg, disabled, children }: BarFrameProps) {
  const { bar } = cfg;
  const clip = arrowClip(bar);

  if (disabled) {
    return (
      <div
        className="bg-grey-3"
        style={{ clipPath: clip, padding: BLACK_RING }}
      >
        {/* Teal-frame backing (greyed out for disabled) */}
        <div
          className="bg-grey-4"
          style={{ clipPath: clip, padding: TEAL_BACKING }}
        >
          <div
            className="bg-grey-3"
            style={{ clipPath: clip, padding: TEAL_BORDER }}
          >
            <div
              className="relative flex items-center"
              style={{
                clipPath: clip,
                height: bar - TOTAL_INSET,
                background: "rgba(30,35,40,0.95)",
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const surfaceH = bar - TOTAL_INSET;

  return (
    <div
      // Layer 1: 4px black/50 ring (per governing node w=4)
      style={{
        clipPath: clip,
        padding: BLACK_RING,
        background: "rgba(0,0,0,0.5)",
      }}
    >
      {/* Layer 2: dark-teal backing (#0B4052) — makes teal frame read against dark BGs */}
      <div
        style={{
          clipPath: clip,
          padding: TEAL_BACKING,
          background: "var(--color-teal-frame)",
        }}
      >
        {/*
          Layer 3: Teal gradient border layers — stacked with opacity transitions.
          Three divs (default / hover / pressed) fade in/out.
          Each is clipped by the same arrow shape, producing the 2px gradient "border."
        */}
        <div className="relative" style={{ clipPath: clip }}>
          {/* Default border gradient (fades on hover/active) */}
          <div
            className="absolute inset-0 transition-opacity duration-150 group-hover/pb:opacity-0 group-active/pb:opacity-0 pointer-events-none"
            style={{ background: TEAL_GRAD.default }}
          />
          {/* Hover border gradient */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-150 group-hover/pb:opacity-100 group-active/pb:opacity-0 pointer-events-none"
            style={{ background: TEAL_GRAD.hover }}
          />
          {/* Pressed border gradient */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-150 group-active/pb:opacity-100 pointer-events-none"
            style={{ background: TEAL_GRAD.pressed }}
          />

          {/* Layer 4: surface (grey-4/95) with TEAL_BORDER padding.
              position:relative ensures it paints AFTER the absolute gradient divs
              in the same stacking context (positioned elements paint after in-flow). */}
          <div className="relative" style={{ padding: TEAL_BORDER }}>
            <div
              className="relative flex items-center"
              style={{
                clipPath: arrowClip(surfaceH),
                height: surfaceH,
                background: "rgba(30,35,40,0.95)",
              }}
            >
              {/* Socket pocket: shrinks on press via CSS var --socket-size.
                  --socket-size is set on the outer group/pb wrapper (default: cfg.socket)
                  and overridden to cfg.socketPressed by group-active/pb on that wrapper.
                  This div reads the inherited value — no local override so the cascade works. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 transition-all duration-150"
                style={{
                  width: `calc(var(--socket-size) / 2)`,
                  height: `var(--socket-size)`,
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: `0 calc(var(--socket-size) / 2) calc(var(--socket-size) / 2) 0`,
                }}
              />

              {/* Corner piece TR — L-bracket positioned in flat area before the arrow tip */}
              {/* right = surfaceH/2 pushes it left of where diagonals start */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{
                  top: cfg.cornerInset,
                  right: surfaceH / 2 + cfg.cornerInset,
                  width: cfg.cornerLeg,
                  height: cfg.cornerLeg,
                  borderTop: `1.5px solid var(--color-teal-grad-a)`,
                  borderRight: `1.5px solid var(--color-teal-grad-b)`,
                }}
              />

              {/* Corner piece BR — mirror of TR (matrix(1,0,0,-1,0,0) in Figma) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute"
                style={{
                  bottom: cfg.cornerInset,
                  right: surfaceH / 2 + cfg.cornerInset,
                  width: cfg.cornerLeg,
                  height: cfg.cornerLeg,
                  borderBottom: `1.5px solid var(--color-teal-grad-a)`,
                  borderRight: `1.5px solid var(--color-teal-grad-b)`,
                }}
              />

              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public props
// ---------------------------------------------------------------------------

export interface PlayButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Defaults to "Play" */
  children?: ReactNode;
  /**
   * Size variant.
   * - `"default"` (default) — navbar/landing scale (1× Figma: 128×34)
   * - `"hero"` — large CTA scale (~×1.7)
   */
  size?: PlayButtonSize;
}

/**
 * PlayButton v3 — Figma-measured layer stack.
 *
 * ## Frame (outer → inner)
 * 4px black/50 ring → 1px #0B4052 teal-frame backing → 2px teal gradient border → rgba(30,35,40,0.95) surface.
 * Per-side inset: 4+1+2 = 7px; total vertical inset: 14px; surface height: bar−14.
 *
 * ## Teal gradient (per state, API-extracted, supersedes CSS export)
 * - Default: `#0593A7 → #026F8F`
 * - Hover:   `#91E1DC → #0C9CA1 → #1F9EBD` + two #BFF2FF-derived glows (≈ blue-1)
 * - Pressed: `#0D3F4B → #025577` + socket shrinks 44→40px
 *
 * ## Medallion
 * grey-4 base discs → navy-swirl interior (≈ blue-7, rotated radial approx.) →
 * 1.5px teal-ring (#167786) with `mix-blend-mode: color-dodge` →
 * gold-3-based 'L' glyph with gradient overlay + black/60 outline.
 *
 * ## Notes
 * - Gradient border is implemented as stacked opacity layers (Tailwind can't
 *   swap CSS gradient stops with group-hover); each state layer transitions in/out.
 * - Glows applied via `filter:drop-shadow` on the unclipped outer wrapper.
 * - All SVG ids derive from `useId()` to prevent collisions in showcase/multi-render.
 * - `className` forwarded to outer wrapper for layout placement.
 */
export function PlayButton({
  children,
  disabled,
  className,
  size = "default",
  ...props
}: PlayButtonProps) {
  const uid = useId();
  const discGradId = `${uid}-disc`;
  const glyphGradId = `${uid}-glyph`;

  const cfg = SIZE_MAP[size];
  const {
    medallion,
    socket,
    socketPressed,
    bar,
    barMinWidth,
    barPx,
    gap,
    fontSize,
    lineHeight,
    pressExtend,
  } = cfg;

  // How far the medallion overlaps into the bar (= half the socket diameter)
  const overlap = socket / 2;

  return (
    <div
      className={[
        "inline-flex items-center group/pb",
        "transition-all duration-150",
        // Pressed geometry: CSS vars set here; group-active overrides them.
        // --socket-size  shrinks the socket pocket (44→40 default, 75→68 hero).
        // --press-extend shifts bar left (reduces left padding) by pressExtend px.
        !disabled &&
          `group-active/pb:[--socket-size:${socketPressed}px] group-active/pb:[--press-extend:${pressExtend}px]`,
        // Drop-shadow lives on the unclipped wrapper so the clipped bar
        // silhouette receives the glow correctly.
        "has-[:disabled]:[filter:none]",
        "has-[:disabled]:hover:[filter:none]",
        disabled
          ? "[filter:none]"
          : [
              // Hover: two #BFF2FF-derived glows (≈blue-1 #CDFAFA mapped to available token)
              // Issue comment: 0 0 6px #BFF2FF @30% + 0 -2px 6px #BFF2FF @60%
              "hover:[filter:drop-shadow(0_0_6px_color-mix(in_srgb,var(--color-blue-1)_30%,transparent))_drop-shadow(0_-2px_6px_color-mix(in_srgb,var(--color-blue-1)_60%,transparent))]",
              "active:[filter:none]",
              "has-[:focus-visible]:[filter:drop-shadow(0_0_8px_var(--color-gold-2))]",
            ].join(" "),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        !disabled
          ? ({
              "--socket-size": `${socket}px`,
              "--press-extend": "0px",
            } as React.CSSProperties)
          : undefined
      }
    >
      {/* Medallion — z-10 so it overlaps the bar frame */}
      <div className="relative z-10" style={{ marginRight: -overlap }}>
        <Medallion
          size={medallion}
          disabled={disabled}
          discGradId={discGradId}
          glyphGradId={glyphGradId}
        />
      </div>

      {/* Bar */}
      <BarFrame cfg={cfg} disabled={disabled}>
        <button
          type="button"
          disabled={disabled}
          {...props}
          className={[
            "flex cursor-pointer items-center justify-center",
            "font-display uppercase tracking-widest text-gold-1",
            "active:text-gold-3",
            "disabled:cursor-not-allowed disabled:text-grey-2",
            "focus-visible:outline-none",
            "transition-all duration-150",
          ].join(" ")}
          style={{
            fontSize,
            lineHeight: `${lineHeight}px`,
            height: bar - TOTAL_INSET,
            minWidth: barMinWidth,
            gap,
            // left pad: content pad + half-socket overlap − pressExtend on active
            // --press-extend is 0px at rest; overridden to pressExtend px by group-active/pb
            paddingLeft: `calc(${barPx + overlap}px - var(--press-extend, 0px))`,
            // right pad: content pad + tip depth (so text clears the arrow tip)
            paddingRight: barPx + bar / 2,
          }}
        >
          {children ?? "Play"}
        </button>
      </BarFrame>
    </div>
  );
}
