import { useId } from "react";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface CrestDividerProps {
  /** Section label text. When omitted, renders ornament-only (single centered hairline row). */
  label?: string;
  /**
   * Show the small gold crest SVG centered above the label.
   * Defaults to true when label is present; irrelevant (ignored) when label is absent.
   * @default true
   */
  crest?: boolean;
}

// ---------------------------------------------------------------------------
// CrestSVG — decorative shield/crest, gradient fill gold-4 → gold-3
// ---------------------------------------------------------------------------

function CrestSVG({ gradId }: { gradId: string }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="24"
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-gold-4)" />
          <stop offset="100%" stopColor="var(--color-gold-3)" />
        </linearGradient>
      </defs>
      {/* Shield/crest path — hextech shield with a small diamond ornament at the top */}
      <path
        d="M10 0 L20 4 L20 14 Q20 20 10 24 Q0 20 0 14 L0 4 Z"
        fill={`url(#${gradId})`}
      />
      {/* inner diamond accent */}
      <circle cx="10" cy="10" r="2.5" fill="var(--color-gold-3)" opacity="0.6" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * CrestDivider — ornate section divider from universe.leagueoflegends.com.
 *
 * Full-width row: fading hairline | [crest above label centered] | fading hairline.
 * When no label is provided, renders a single centered fading hairline (ornament-only mode).
 *
 * Pure presentational, server-safe (no 'use client').
 * useId() ensures SVG gradient ids are unique across multiple instances on the same page.
 *
 * Tracking compensation: the label span carries pl-[7px] to offset the trailing
 * letter-spacing (tracking-[7px] adds 7px after the last glyph), so the text
 * appears optically centered between the hairlines. Don't remove it as "unused".
 */
export function CrestDivider({ label, crest = true }: CrestDividerProps) {
  const gradId = useId();

  // Ornament-only mode — no label, no center stack
  if (label === undefined) {
    return (
      <div className="flex w-full items-center">
        <div className="flex-1 h-px bg-linear-to-r from-transparent via-gold-5 to-transparent" />
      </div>
    );
  }

  // Full mode — left hairline | crest + label | right hairline
  return (
    <div className="flex w-full items-center gap-4">
      {/* left hairline — fades from transparent (far left) to gold-5 (near center) */}
      <div className="flex-1 h-px bg-linear-to-r from-transparent to-gold-5" />

      {/* center stack — crest above label */}
      <div className="flex flex-col items-center gap-1">
        {crest && <CrestSVG gradId={gradId} />}
        <span className="font-display text-2xl tracking-[7px] text-gold-cream pl-[7px]">
          {label}
        </span>
      </div>

      {/* right hairline — mirror: fades from gold-5 (near center) to transparent (far right) */}
      <div className="flex-1 h-px bg-linear-to-r from-gold-5 to-transparent" />
    </div>
  );
}
