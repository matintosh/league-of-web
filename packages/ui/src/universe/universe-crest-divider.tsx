import { useId } from "react";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface UniverseCrestDividerProps {
  /** Section label text, e.g. "LATEST", "FEATURED", "CHAMPIONS". */
  label: string;
  /**
   * Visual variant of the crest ornament.
   * "diamond" (default) — small rotated square pip + horizontal flourish lines.
   * "shield" — hextech shield silhouette.
   * @default "diamond"
   */
  crestVariant?: "diamond" | "shield";
}

// ---------------------------------------------------------------------------
// DiamondCrest — full-width three-part layout (#974):
//   [gradient-line flex-1] + [fixed pip SVG] + [gradient-line flex-1]
// The gradient lines use CSS background so they naturally stretch to container
// width. The pip is a fixed-size SVG — no stretching.
// ---------------------------------------------------------------------------

/** The small rotated square pip centred between the flourish lines. */
function DiamondPip() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      {/* Centre diamond pip — 6×6 rotated rect */}
      <rect
        x="6"
        y="6"
        width="6"
        height="6"
        rx="0"
        transform="rotate(45 9 9)"
        fill="var(--color-gold-3)"
        opacity="0.9"
      />
    </svg>
  );
}

/** Full-width flourish row: gradient-line ── pip ── gradient-line
 *  Ref shows clearly visible gold flanking lines — raised from opacity 0.7
 *  to full opacity and using gold-3 (#c89b3c) for the gradient stop so the
 *  lines read against the dark background without being garish. */
function DiamondCrest() {
  return (
    <div className="flex w-full items-center">
      {/* Left gradient line: transparent → gold-3 toward pip */}
      <div
        className="flex-1"
        style={{
          height: "1px",
          background:
            "linear-gradient(to right, transparent 0%, var(--color-gold-3) 100%)",
        }}
        aria-hidden="true"
      />
      <DiamondPip />
      {/* Right gradient line: gold-3 toward pip → transparent */}
      <div
        className="flex-1"
        style={{
          height: "1px",
          background:
            "linear-gradient(to left, transparent 0%, var(--color-gold-3) 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ShieldCrest — alternative hextech shield ornament
// ---------------------------------------------------------------------------

function ShieldCrest({ gradId }: { gradId: string }) {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="22"
      viewBox="0 0 18 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${gradId}-shield`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-gold-3)" />
          <stop offset="100%" stopColor="var(--color-gold-4)" />
        </linearGradient>
      </defs>
      <path
        d="M9 0 L18 3.5 L18 12 Q18 18 9 22 Q0 18 0 12 L0 3.5 Z"
        fill={`url(#${gradId}-shield)`}
        opacity="0.9"
      />
      <circle cx="9" cy="9" r="2" fill="var(--color-gold-1)" opacity="0.5" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * UniverseCrestDivider — the ornamented gold section header used across the
 * League Universe site (universe.leagueoflegends.com).
 *
 * Renders: full-width crest flourish (#974 — lines now span container edge to
 * edge with diamond pip centered) → caps serif label (font-display,
 * tracking-widest, gold-1) → short thin gold underline.
 *
 * Pure presentational, server-safe (no 'use client').
 * SVG gradient/shape ids are generated via useId() so multiple instances
 * on the same page never clash.
 *
 * Tracking compensation: pl-[6px] offsets the trailing letter-spacing
 * on the label span so text appears optically centred. Do not remove.
 */
export function UniverseCrestDivider({
  label,
  crestVariant = "diamond",
}: UniverseCrestDividerProps) {
  const uid = useId();

  return (
    <div className="flex w-full flex-col items-center gap-1 py-2">
      {/* Crest ornament — diamond (default) or shield variant */}
      {crestVariant === "diamond" ? (
        <DiamondCrest />
      ) : (
        <ShieldCrest gradId={uid} />
      )}

      {/* Label — Beaufort caps, wide tracking, gold-1 */}
      <span className="font-display text-xl uppercase tracking-[6px] text-gold-1 pl-[6px]">
        {label}
      </span>

      {/* Underline — thin gold hairline, centred, fades at edges */}
      <div
        className="h-px w-24"
        style={{
          background:
            "linear-gradient(to right, transparent, var(--color-gold-3), transparent)",
        }}
      />
    </div>
  );
}
