"use client";

import { useId } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

// ---------------------------------------------------------------------------
// Size map — Record ensures both members are always present.
// ---------------------------------------------------------------------------

export type PlayButtonSize = "default" | "hero";

interface SizeConfig {
  /** Medallion outer diameter (px) */
  medallion: number;
  /** Bar total height (px, including all frame layers) */
  bar: number;
  /** Minimum bar inner content width (px) */
  barMinWidth: number;
  /** Horizontal padding inside bar content area (px) */
  barPx: number;
  /** Tailwind text size class for the label */
  textClass: string;
}

const SIZE_MAP: Record<PlayButtonSize, SizeConfig> = {
  default: {
    medallion: 48,
    bar: 34,
    barMinWidth: 128,
    barPx: 20,
    textClass: "text-sm",
  },
  hero: {
    medallion: 72,
    bar: 56,
    barMinWidth: 180,
    barPx: 28,
    textClass: "text-2xl",
  },
};

// ---------------------------------------------------------------------------
// Pointed polygon helper
// Right edge converges to a single point at 50% height.
// tip depth = barHeight / 2 (matches the spec proportions).
// ---------------------------------------------------------------------------

function barPolygon(w: number, h: number): string {
  const tip = h / 2; // tip depth into the shape from the right edge
  return `polygon(0% 0%, calc(100% - ${tip}px) 0%, 100% 50%, calc(100% - ${tip}px) 100%, 0% 100%)`;
}

// ---------------------------------------------------------------------------
// 'L' glyph SVG — original angular design, aria-hidden.
// viewBox is generously oversized so the glyph can overflow the ring boundary.
// The glyph is rendered with two paths: gold gradient fill + gold-5 outline.
// ---------------------------------------------------------------------------

interface LeagueGlyphProps {
  size: number;
  fillId: string;
  className?: string;
}

function LeagueGlyph({ size, fillId, className }: LeagueGlyphProps) {
  // The viewBox is 24×24 but the SVG element is "size" wide/tall.
  // We deliberately render this larger than the medallion so it overlaps the ring.
  const glyphPath = "M5 2h4v13h7.5V18H5V2z M12.5 15h4v3h-4z";

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      style={{ width: size, height: size, overflow: "visible" }}
    >
      {/* Outline path — gold-5 for depth */}
      <path
        d={glyphPath}
        fill="none"
        stroke="var(--color-gold-5)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Filled path — gold gradient */}
      <path d={glyphPath} fill={`url(#${fillId})`} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Medallion — SVG-based ring + disc + glyph.
// ---------------------------------------------------------------------------

interface MedallionProps {
  size: number;
  disabled?: boolean;
  ringGradId: string;
  discGradId: string;
  glyphGradId: string;
}

function Medallion({ size, disabled, ringGradId, discGradId, glyphGradId }: MedallionProps) {
  const r = size / 2;
  const strokeW = size >= 60 ? 4 : 3;
  const innerR = r - strokeW / 2 - 1; // radius of the inner disc (inside the ring)
  // Glyph element size — ~60% of medallion, rendered larger so it overlaps ring
  const glyphSize = Math.round(size * 0.65);

  return (
    <div
      aria-hidden="true"
      className="relative shrink-0 flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* SVG layer: ring + disc */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="absolute inset-0"
        overflow="visible"
      >
        {/* Ring gradient: gold-3 → gold-2 → gold-5 */}
        <defs>
          <linearGradient id={ringGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-gold-3)" />
            <stop offset="50%" stopColor="var(--color-gold-2)" />
            <stop offset="100%" stopColor="var(--color-gold-5)" />
          </linearGradient>
          {/* Disc gradient: blue-2 → blue-4 → blue-6 */}
          <radialGradient id={discGradId} cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="var(--color-blue-2)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="var(--color-blue-4)" />
            <stop offset="100%" stopColor="var(--color-blue-6)" />
          </radialGradient>
          {/* Glyph fill gradient: gold-2 → gold-3 */}
          <linearGradient id={glyphGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-gold-2)" />
            <stop offset="100%" stopColor="var(--color-gold-3)" />
          </linearGradient>
        </defs>

        {/* Inner disc (energy swirl) */}
        <circle
          cx={r}
          cy={r}
          r={innerR}
          fill={disabled ? "var(--color-grey-4)" : `url(#${discGradId})`}
        />

        {/* Metallic ring stroke */}
        <circle
          cx={r}
          cy={r}
          r={r - strokeW / 2}
          fill="none"
          stroke={disabled ? "var(--color-grey-3)" : `url(#${ringGradId})`}
          strokeWidth={strokeW}
        />
      </svg>

      {/* Glyph — rendered on top, overflows the circle boundary */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ overflow: "visible" }}>
        <LeagueGlyph
          size={glyphSize}
          fillId={disabled ? "none" : glyphGradId}
          className={disabled ? "opacity-40" : ""}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bar frame — nested clipped wrappers, outside→in:
//   gold-4 hairline → dark gap → 2px blue-3 → small gap → 1px blue-2 → surface
// All layers share the same pointed polygon via barPolygon().
// ---------------------------------------------------------------------------

interface BarFrameProps {
  cfg: SizeConfig;
  disabled?: boolean;
  children: ReactNode;
}

function BarFrame({ cfg, disabled, children }: BarFrameProps) {
  const { bar } = cfg;
  const clip = barPolygon(0, bar); // width doesn't matter for the CSS polygon

  // Layer thicknesses (px):
  //  gold-4 border: 1px
  //  dark gap: 2px  → total inset after gold layer = 3px
  //  blue-3 outer teal: 2px → total inset = 5px
  //  small gap: 1px → total inset = 6px
  //  blue-2 inner teal: 1px → total inset = 7px
  //  surface: rest

  const clipStyle = { clipPath: clip };

  if (disabled) {
    return (
      <div
        className="p-px bg-grey-3 transition-colors duration-150"
        style={clipStyle}
      >
        <div className="p-[3px] bg-grey-4" style={clipStyle}>
          <div style={{ ...clipStyle, height: bar - 8 }}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    // Layer 1: gold-4 hairline
    <div
      className="transition-colors duration-150 bg-gold-4 group-hover/pb:bg-gold-2"
      style={{ ...clipStyle, padding: "1px" }}
    >
      {/* Layer 2: dark gap */}
      <div
        className="bg-blue-6"
        style={{ ...clipStyle, padding: "2px" }}
      >
        {/* Layer 3: blue-3 outer teal (2px) */}
        <div
          className="bg-blue-3 group-hover/pb:bg-blue-2 transition-colors duration-150"
          style={{ ...clipStyle, padding: "2px" }}
        >
          {/* Layer 4: small gap (1px) */}
          <div
            className="bg-blue-6"
            style={{ ...clipStyle, padding: "1px" }}
          >
            {/* Layer 5: blue-2 inner teal (1px) */}
            <div
              className="bg-blue-2 group-hover/pb:bg-blue-1 transition-colors duration-150"
              style={{ ...clipStyle, padding: "1px" }}
            >
              {/* Surface */}
              <div
                className="bg-grey-4 group-hover/pb:bg-grey-cool transition-colors duration-150"
                style={clipStyle}
              >
                {children}
              </div>
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
   * - `"default"` (default) — navbar-scale (medallion ~48px, bar ~34px)
   * - `"hero"` — landing-CTA scale (medallion ~72px, bar ~56px)
   */
  size?: PlayButtonSize;
}

/**
 * PlayButton v2 — medallion + double-teal-frame bar CTA.
 *
 * Composition:
 * - Outer `<div>` is `group/pb` anchor and holds `filter:drop-shadow` for glow
 *   (must be unclipped — drop-shadow on clipped elements is clipped too).
 * - Medallion: SVG ring with linearGradient stroke + radialGradient blue disc
 *   + oversized 'L' glyph that intentionally overflows the ring boundary.
 * - Bar: nested clipped wrappers sharing the same pointed polygon —
 *   gold hairline → dark gap → blue-3 2px → gap → blue-2 1px → surface.
 * - All SVG ids derive from `useId()` to avoid collisions in showcase/multi-render.
 *
 * `className` is forwarded to the outer wrapper (for layout placement).
 * Do NOT pass a size to the existing landing call-site — `"default"` is the default.
 */
export function PlayButton({
  children,
  disabled,
  className,
  size = "default",
  ...props
}: PlayButtonProps) {
  const uid = useId();
  const ringGradId = `${uid}-ring`;
  const discGradId = `${uid}-disc`;
  const glyphGradId = `${uid}-glyph`;

  const cfg = SIZE_MAP[size];
  const { medallion, bar, barMinWidth, barPx, textClass } = cfg;

  // Overlap: medallion sits on top of the bar's left edge
  const overlap = 12; // px medallion overhangs into the bar

  return (
    <div
      className={[
        "inline-flex items-center group/pb",
        "transition-all duration-150",
        disabled
          ? "[filter:none]"
          : [
              "hover:[filter:drop-shadow(0_0_14px_var(--color-blue-2))]",
              "active:[filter:none]",
              "has-[:focus-visible]:[filter:drop-shadow(0_0_8px_var(--color-gold-2))]",
            ].join(" "),
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Medallion — z-10 so it overlaps the bar frame */}
      <div className="relative z-10" style={{ marginRight: -overlap }}>
        <Medallion
          size={medallion}
          disabled={disabled}
          ringGradId={ringGradId}
          discGradId={discGradId}
          glyphGradId={glyphGradId}
        />
      </div>

      {/* Bar frame — all clipped layers + button inside */}
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
            "transition-colors duration-150",
            textClass,
          ].join(" ")}
          style={{
            height: bar - 8, // subtract frame layers (8px total vertical)
            minWidth: barMinWidth,
            paddingLeft: barPx + overlap, // add overlap so text doesn't hide under medallion
            paddingRight: barPx + bar / 2, // add tip depth so text doesn't crowd the point
          }}
        >
          {children ?? "Play"}
        </button>
      </BarFrame>
    </div>
  );
}
