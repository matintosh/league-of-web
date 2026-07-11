import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Size union — exhaustive Record map catches any future missing member.
// ---------------------------------------------------------------------------

export type SectionHeaderSize = "md" | "lg";
export type SectionHeaderAlign = "left" | "center";

// ---------------------------------------------------------------------------
// Size map — title classes per size
// md: text-3xl (~30px) — standard in-client section headings
// lg: text-5xl (~48px) — hero / landing scale (adapted from 64px web-hero to 1280×720 viewport)
// ---------------------------------------------------------------------------

const titleSizeClasses: Record<SectionHeaderSize, string> = {
  md: "text-3xl",
  lg: "text-5xl",
};

// ---------------------------------------------------------------------------
// Align maps — text-align class and max-w centering class
// ---------------------------------------------------------------------------

const alignTextClasses: Record<SectionHeaderAlign, string> = {
  left: "text-left",
  center: "text-center",
};

const alignContainerClasses: Record<SectionHeaderAlign, string> = {
  left: "items-start",
  center: "items-center",
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface SectionHeaderProps {
  /** Small label rendered above the title. Uppercase, muted gold. */
  eyebrow?: string;
  /** Primary heading text. Required. Rendered as an h2. */
  title: string;
  /** Optional introductory paragraph below the title. Body font, muted grey. */
  intro?: string;
  /**
   * Size scale for the title.
   * - `"md"` (default) — text-3xl; standard in-client section header.
   * - `"lg"` — text-5xl; hero-scale heading.
   */
  size?: SectionHeaderSize;
  /**
   * Text and content alignment.
   * - `"center"` (default) — centered; matches the leagueoflegends.com reference.
   * - `"left"` — left-aligned; for sidebar or narrow-context sections.
   */
  align?: SectionHeaderAlign;
  /**
   * Optional slot for a call-to-action rendered below the intro (or title).
   * Accepts any ReactNode — typically a HextechButton.
   */
  action?: ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * SectionHeader — eyebrow + display-title block, adapted from leagueoflegends.com.
 *
 * Hierarchy: optional eyebrow label → h2 title → optional intro paragraph → optional action slot.
 * Pure presentational, server-safe (no 'use client').
 *
 * Dark-theme token mapping:
 * - Title: font-display uppercase tracking-widest text-gold-1
 * - Eyebrow: text-xs uppercase tracking-widest text-gold-4
 * - Intro: text-sm font-body text-grey-1 max-w-xl
 */
export function SectionHeader({
  eyebrow,
  title,
  intro,
  size = "md",
  align = "center",
  action,
}: SectionHeaderProps) {
  const textAlign = alignTextClasses[align];
  const containerAlign = alignContainerClasses[align];

  return (
    <header className={`flex flex-col gap-3 ${containerAlign}`}>
      {/* Eyebrow */}
      {eyebrow !== undefined && (
        <p
          className={`font-display text-xs uppercase tracking-widest text-gold-4 ${textAlign}`}
        >
          {eyebrow}
        </p>
      )}

      {/* Title — h2; consumer pages own h1 */}
      <h2
        className={[
          "font-display uppercase tracking-widest text-gold-1 pb-4",
          titleSizeClasses[size],
          textAlign,
        ].join(" ")}
      >
        {title}
      </h2>

      {/* Intro */}
      {intro !== undefined && (
        <p
          className={`font-body text-sm text-grey-1 max-w-xl ${textAlign}`}
        >
          {intro}
        </p>
      )}

      {/* Action slot */}
      {action !== undefined && (
        <div className={`mt-1 ${align === "center" ? "flex justify-center" : ""}`}>
          {action}
        </div>
      )}
    </header>
  );
}
