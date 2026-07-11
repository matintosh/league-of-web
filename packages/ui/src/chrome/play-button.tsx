"use client";

import React, { useId } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

// ---------------------------------------------------------------------------
// Size map
//
// v4 geometry: XAML path M 0,0 L 103,0 L 118,14 L 103,28 L 0,28 C 10,14 0,0 Z
// Button 165×38. GoldLine starts at x=10. GreenLine margin 50 4 4 4 (from GoldLine).
// Arrow path margin 40 5 4 -5 (relative to GoldLine; so x=40 from GoldLine, y=5).
// Medallion (logo) height=38, sits at x=0, overlaps the GoldLine/GreenLine.
//
// Layout approach: fixed-width stack. Outer frame (GoldLine) has a fixed
// calculated width. Medallion is pulled left via negative margin on the row.
// Bar SVG fills the inner content area absolutely.
// ---------------------------------------------------------------------------

export type PlayButtonSize = "default" | "hero";

interface SizeConfig {
  /** Medallion outer diameter (px) */
  medallion: number;
  /** Socket circle diameter (px) — default state (v3 compat) */
  socket: number;
  /** Socket diameter when pressed */
  socketPressed: number;
  /** Arrow bar height from XAML (px) */
  bar: number;
  /** Arrow bar width = 118 scaled (px) */
  barWidth: number;
  /** x where bar starts narrowing into tip */
  tipNarrowX: number;
  /** y of tip point = bar/2 */
  tipY: number;
  /** bezier control x for concave left edge */
  concaveX: number;
  /** Total button height (XAML ToggleButton height=38, scaled) */
  totalH: number;
  /** Outer frame (GoldLine) width (px) */
  outerW: number;
  /** Left margin of outer frame (XAML: GoldLine margin-left=10, scaled) */
  outerMarginLeft: number;
  /** GreenLine left inset from GoldLine left edge (XAML: margin-left=50, scaled) */
  greenLeft: number;
  /** GreenLine margin on top/right/bottom (XAML: 4px, scaled) */
  greenMargin: number;
  /** Arrow SVG left offset from GoldLine left (XAML: Arrow margin-left=40, scaled) */
  arrowLeft: number;
  /** Arrow SVG top offset from GoldLine top (XAML: Arrow margin-top=5, scaled) */
  arrowTop: number;
  /** Text left padding inside bar = XAML TextBlock margin-left=30 (scaled) */
  textLeft: number;
  /** Label font size (px) */
  fontSize: number;
  /** Corner leg length (px) */
  cornerLeg: number;
  /** Corner inset (px) */
  cornerInset: number;
  /** Press extend (px) */
  pressExtend: number;
}

function sc(v: number, s: number) { return Math.round(v * s); }

function makeSize(barH: number, extra: {
  medallion: number; socket: number; socketPressed: number;
  fontSize: number; cornerLeg: number; cornerInset: number; pressExtend: number;
}): SizeConfig {
  const s = barH / 28; // scale from XAML 1× (bar=28)
  return {
    ...extra,
    bar: barH,
    barWidth: sc(118, s),
    tipNarrowX: sc(103, s),
    tipY: Math.round(barH / 2),
    concaveX: sc(10, s),
    totalH: sc(38, s),
    outerW: sc(155, s),   // XAML: 165 total - 10 left margin
    outerMarginLeft: sc(10, s),
    greenLeft: sc(50, s),
    greenMargin: sc(4, s),
    arrowLeft: sc(40, s),
    arrowTop: sc(5, s),
    textLeft: sc(30, s),
  };
}

const SIZE_MAP: Record<PlayButtonSize, SizeConfig> = {
  default: makeSize(28, {
    medallion: 44, socket: 44, socketPressed: 40,
    fontSize: 15, cornerLeg: 8, cornerInset: 3, pressExtend: 1.3,
  }),
  hero: makeSize(46, {
    medallion: 72, socket: 72, socketPressed: 65,
    fontSize: 25, cornerLeg: 13, cornerInset: 5, pressExtend: 2.2,
  }),
};

// ---------------------------------------------------------------------------
// SVG path builder
// ---------------------------------------------------------------------------

function barPath(cfg: SizeConfig): string {
  const { barWidth: bw, bar: bh, tipNarrowX: tx, tipY: ty, concaveX: ci } = cfg;
  return `M 0,0 L ${tx},0 L ${bw},${ty} L ${tx},${bh} L 0,${bh} C ${ci},${ty} 0,0 0,0 Z`;
}

// ---------------------------------------------------------------------------
// SVG gradient defs (per-instance, injected in a hidden 0×0 SVG)
// ---------------------------------------------------------------------------

interface GradDefsProps {
  dsId: string; // default stroke
  hsId: string; // hover stroke
  hfId: string; // hover fill
}

function GradDefs({ dsId, hsId, hfId }: GradDefsProps) {
  return (
    <defs>
      {/* Default stroke: 3-stop 80%-alpha cyan — XAML #CC3FE7FF → #CC006D7D → #CC0493A7 */}
      <linearGradient id={dsId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="var(--color-cyan-1)"      stopOpacity="0.8" />
        <stop offset="50%"  stopColor="var(--color-teal-grad-b)" stopOpacity="0.8" />
        <stop offset="100%" stopColor="var(--color-teal-grad-a)" stopOpacity="0.8" />
      </linearGradient>
      {/* Hover stroke: 3-stop full-alpha bright cyan — XAML #AFF5FF → #46E6FF → #00ADD4 */}
      <linearGradient id={hsId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="var(--color-cyan-2)" stopOpacity="1" />
        <stop offset="50%"  stopColor="var(--color-cyan-3)" stopOpacity="1" />
        <stop offset="100%" stopColor="var(--color-cyan-4)" stopOpacity="1" />
      </linearGradient>
      {/* Hover fill: 2-stop vertical — XAML #1D3B4A → #082734 */}
      <linearGradient id={hfId} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#1D3B4A" stopOpacity="1" />
        <stop offset="100%" stopColor="var(--color-navy-swirl)" stopOpacity="1" />
      </linearGradient>
    </defs>
  );
}

// ---------------------------------------------------------------------------
// LeagueGlyph — 'L' mark SVG (v3-proven)
// ---------------------------------------------------------------------------

function LeagueGlyph({ size, gradId, greyed }: { size: number; gradId: string; greyed?: boolean }) {
  const p = "M5 2h4v13h7.5V18H5V2z M12.5 15h4v3h-4z";
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ width: size, height: size, overflow: "visible", filter: "drop-shadow(0 0 3px rgba(0,0,0,0.4))" }}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-gold-5)" />
          <stop offset="100%" stopColor="var(--color-gold-3)" />
        </linearGradient>
      </defs>
      <path d={p} fill={greyed ? "var(--color-grey-3)" : "var(--color-gold-3)"} />
      {!greyed && <path d={p} fill={`url(#${gradId})`} opacity={0.8} />}
      <path d={p} fill="none" stroke="rgba(0,0,0,0.6)" strokeWidth={2.25} strokeLinejoin="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Medallion — v3-proven disc + ring + glyph
// ---------------------------------------------------------------------------

function Medallion({ size, greyed, discId, glyphId }: {
  size: number; greyed?: boolean; discId: string; glyphId: string;
}) {
  const r = size / 2;
  const sw = size >= 60 ? 2.5 : 1.5;
  return (
    <div
      aria-hidden="true"
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="absolute inset-0" overflow="visible">
        <defs>
          <radialGradient id={discId} cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="var(--color-navy-swirl)" stopOpacity="0.8" />
            <stop offset="55%" stopColor="var(--color-navy-swirl)" />
            <stop offset="100%" stopColor="var(--color-grey-4)" />
          </radialGradient>
        </defs>
        <circle cx={r} cy={r} r={r} fill="var(--color-grey-4)" />
        <circle cx={r} cy={r} r={r - sw - 1} fill={greyed ? "var(--color-grey-4)" : `url(#${discId})`} />
        <circle
          cx={r} cy={r} r={r - sw / 2}
          fill="none"
          stroke={greyed ? "var(--color-grey-3)" : "var(--color-teal-ring)"}
          strokeWidth={sw}
          style={greyed ? undefined : { mixBlendMode: "color-dodge" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <LeagueGlyph size={Math.round(size * 0.65)} gradId={glyphId} greyed={greyed} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public props
// ---------------------------------------------------------------------------

export interface PlayButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Label text. Defaults to "PLAY". */
  children?: ReactNode;
  /**
   * Size variant.
   * - `"default"` — XAML 1× (bar 118×28, total 165×38)
   * - `"hero"` — proportionally scaled ×1.643
   */
  size?: PlayButtonSize;
  /**
   * Queueing state: greys out button, slides PLAY down and STOP in from above.
   * Optional, defaults to false (PLAY behavior). Back-compat safe.
   */
  queueing?: boolean;
}

/**
 * PlayButton v4 — XAML-spec geometry + state gradients + STOP toggle.
 *
 * ## Shape: concave-left SVG arrow bar
 * Path: `M 0,0 L tx,0 L bw,ty L tx,bh L 0,bh C ci,ty 0,0 0,0 Z`
 * Left edge is a cubic bezier (bows rightward ~ci px at vertical center).
 * SVG path chosen over CSS clip-path:path() so gradient strokes work natively.
 *
 * ## XAML layer mapping
 * - GoldLine: `bg #00070E, border 1px #34291E` outer dark-bronze frame
 * - GreenLine: `bg #1E2328, border 2px #09343D` inner teal frame (clears emblem)
 * - Arrow: SVG `<path>` overlay with per-state gradient stroke + fill
 *
 * ## State gradients
 * - Default: 80%-alpha 3-stop cyan (#3FE7FF→#006D7D→#0493A7), grey-4 fill
 * - Hover: full-alpha bright-cyan (#AFF5FF→#46E6FF→#00ADD4), lifted fill (#1D3B4A→#082734)
 * - Queueing: flat grey-2 stroke, grey-4 fill, grey-3 text; STOP label slides in
 * - Disabled: grey-3 stroke, grey-4 fill, greyed medallion; no glow
 *
 * ## STOP slide toggle
 * Two labels (PLAY/STOP) stacked in an overflow-hidden window matching bar height.
 * transition-transform 500ms ease-in-out; PLAY exits down, STOP enters from above.
 *
 * ## v3 contracts preserved
 * - Single `<button type="button">` in the DOM
 * - `drop-shadow` on unclipped outer wrapper (not box-shadow)
 * - `useId()` for all SVG gradient IDs
 * - CSS-var `--socket-size` / `--press-extend` mechanism
 * - `has-[:disabled]` fallbacks
 */
export function PlayButton({
  children,
  disabled,
  className,
  size = "default",
  queueing = false,
  ...props
}: PlayButtonProps) {
  const uid = useId();
  const discId  = `${uid}-d`;
  const glyphId = `${uid}-g`;
  const dsId    = `${uid}-ds`;
  const hsId    = `${uid}-hs`;
  const hfId    = `${uid}-hf`;

  const cfg = SIZE_MAP[size];
  const {
    medallion, socket, socketPressed,
    bar, barWidth, tipNarrowX,
    totalH, outerW, outerMarginLeft,
    greenLeft, greenMargin,
    arrowLeft, arrowTop,
    textLeft, fontSize, pressExtend,
  } = cfg;

  const greyed = disabled || queueing;
  const d = barPath(cfg);

  // Right padding: clears the tip region
  const textRight = barWidth - tipNarrowX + 8;

  // How much of the medallion overhangs to the left of the outer frame
  const medallionOverhang = Math.round(medallion - outerMarginLeft * 1.5);

  return (
    <div
      className={[
        "inline-flex items-center group/pb",
        !disabled && !queueing &&
          `group-active/pb:[--socket-size:${socketPressed}px] group-active/pb:[--press-extend:${pressExtend}px]`,
        "has-[:disabled]:[filter:none] has-[:disabled]:hover:[filter:none]",
        disabled || queueing
          ? "[filter:none]"
          : [
              "hover:[filter:drop-shadow(0_0_6px_color-mix(in_srgb,var(--color-cyan-1)_40%,transparent))_drop-shadow(0_-2px_6px_color-mix(in_srgb,var(--color-cyan-1)_70%,transparent))]",
              "active:[filter:none]",
              "has-[:focus-visible]:[filter:drop-shadow(0_0_8px_var(--color-gold-2))]",
            ].join(" "),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        !disabled
          ? ({ "--socket-size": `${socket}px`, "--press-extend": "0px" } as React.CSSProperties)
          : undefined
      }
    >
      {/* Gradient defs in a hidden SVG — position:absolute, 0×0, overflow:hidden */}
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute", overflow: "hidden" }}>
        <GradDefs dsId={dsId} hsId={hsId} hfId={hfId} />
      </svg>

      {/* ------------------------------------------------------------------ */}
      {/* MEDALLION — overlaps the outer frame on the left                   */}
      {/* Negative right margin pulls it into the frame.                     */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative z-10 shrink-0 flex items-center"
        style={{
          height: totalH,
          marginRight: -medallionOverhang,
        }}
      >
        <Medallion size={medallion} greyed={greyed} discId={discId} glyphId={glyphId} />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* OUTER FRAME — GoldLine                                             */}
      {/* Fixed width = outerW so the frame doesn't collapse.                */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative shrink-0"
        style={{
          width: outerW,
          height: totalH,
          background: "var(--color-pb-outer-bg)",
          border: "1px solid var(--color-pb-outer-border)",
          boxSizing: "border-box",
        }}
      >
        {/* ---------------------------------------------------------------- */}
        {/* INNER FRAME — GreenLine                                          */}
        {/* XAML margin 50 4 4 4 from GoldLine bounds.                       */}
        {/* ---------------------------------------------------------------- */}
        <div
          style={{
            position: "absolute",
            left: greenLeft,
            top: greenMargin,
            right: greenMargin,
            bottom: greenMargin,
            background: "var(--color-grey-4)",
            border: "2px solid #09343D",
            boxSizing: "border-box",
          }}
        />

        {/* ---------------------------------------------------------------- */}
        {/* ARROW SVG — positioned over both frames (z=2 > GreenLine)        */}
        {/* XAML Arrow margin 40 5 4 -5: left=40, top=5 from GoldLine edge.  */}
        {/* The drop-shadow on the SVG matches XAML DropShadowEffect.        */}
        {/* ---------------------------------------------------------------- */}
        <div
          style={{
            position: "absolute",
            left: arrowLeft,
            top: arrowTop,
            zIndex: 2,
            filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.8))",
            lineHeight: 0,
          }}
        >
          <svg
            width={barWidth}
            height={bar}
            viewBox={`0 0 ${barWidth} ${bar}`}
            overflow="visible"
            aria-hidden="true"
          >
            {/* Default state: grey-4 fill + 80%-alpha cyan gradient stroke */}
            <path
              d={d}
              fill="var(--color-grey-4)"
              stroke={
                disabled   ? "var(--color-grey-3)" :
                queueing   ? "var(--color-grey-2)" :
                `url(#${dsId})`
              }
              strokeWidth={2}
              className={!greyed ? "transition-opacity duration-150 group-hover/pb:opacity-0" : undefined}
            />
            {/* Hover state: lifted fill gradient + bright-cyan stroke */}
            {!greyed && (
              <path
                d={d}
                fill={`url(#${hfId})`}
                stroke={`url(#${hsId})`}
                strokeWidth={2}
                className="opacity-0 transition-opacity duration-150 group-hover/pb:opacity-100"
              />
            )}
          </svg>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* BUTTON + TEXT — fills the full outer frame area (z=3 > arrow)    */}
        {/* overflow-hidden for the label slide clip.                        */}
        {/* ---------------------------------------------------------------- */}
        <button
          type="button"
          disabled={disabled}
          {...props}
          className={[
            "absolute inset-0 z-[3]",
            "flex items-center cursor-pointer overflow-hidden",
            "font-display uppercase tracking-widest",
            disabled
              ? "cursor-not-allowed text-grey-2"
              : queueing
              ? "text-grey-3 cursor-default"
              : "text-gold-1 group-hover/pb:text-gold-cream active:text-gold-3",
            "focus-visible:outline-none",
            "transition-colors duration-150",
          ].join(" ")}
          style={{ fontSize }}
        >
          {/* Left spacer: clears GreenLine left inset + concave region */}
          <span
            aria-hidden="true"
            style={{ flexShrink: 0, display: "inline-block", width: greenLeft + textLeft }}
          />

          {/* PLAY/STOP sliding window */}
          <span
            className="relative overflow-hidden flex-1"
            style={{ height: bar }}
            aria-hidden="true"
          >
            {/* PLAY — rest position, exits down on queueing */}
            <span
              className="absolute inset-x-0 flex items-center justify-center transition-transform duration-500 ease-in-out"
              style={{ height: bar, transform: queueing ? "translateY(100%)" : "translateY(0%)" }}
            >
              {children ?? "PLAY"}
            </span>
            {/* STOP — enters from above on queueing */}
            <span
              className="absolute inset-x-0 flex items-center justify-center transition-transform duration-500 ease-in-out"
              style={{ height: bar, transform: queueing ? "translateY(0%)" : "translateY(-100%)" }}
            >
              STOP
            </span>
          </span>

          {/* Right spacer: clears arrow tip */}
          <span
            aria-hidden="true"
            style={{ flexShrink: 0, display: "inline-block", width: textRight }}
          />

          <span className="sr-only">
            {queueing ? "Stop" : typeof children === "string" ? children : "Play"}
          </span>
        </button>
      </div>
    </div>
  );
}
