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
// DiamondCrest — the Universe site's minimal gold ornament: a small rotated
// square pip centred between two horizontal hairline flourish lines.
// ---------------------------------------------------------------------------

function DiamondCrest({ gradId }: { gradId: string }) {
  return (
    <svg
      aria-hidden="true"
      width="120"
      height="18"
      viewBox="0 0 120 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${gradId}-l`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-gold-4)" stopOpacity="0" />
          <stop offset="100%" stopColor="var(--color-gold-3)" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id={`${gradId}-r`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-gold-3)" stopOpacity="0.7" />
          <stop offset="100%" stopColor="var(--color-gold-4)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Left flourish line — fades from transparent (left) to gold (centre) */}
      <line x1="0" y1="9" x2="54" y2="9" stroke={`url(#${gradId}-l)`} strokeWidth="1" />
      {/* Centre diamond pip */}
      <rect
        x="57"
        y="6"
        width="6"
        height="6"
        rx="0"
        transform="rotate(45 60 9)"
        fill="var(--color-gold-3)"
        opacity="0.9"
      />
      {/* Right flourish line — fades from gold (centre) to transparent (right) */}
      <line x1="66" y1="9" x2="120" y2="9" stroke={`url(#${gradId}-r)`} strokeWidth="1" />
    </svg>
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
 * Renders: centred gold crest ornament → caps serif label (font-display,
 * tracking-widest, gold-1) → short thin gold underline.
 * Symmetric faint flourish lines extend horizontally from the crest.
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
        <DiamondCrest gradId={uid} />
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
