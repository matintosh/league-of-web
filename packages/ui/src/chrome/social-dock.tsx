"use client";

import type { ReactNode } from "react";

export interface DockButton {
  /** Unique identifier for this button — passed to `onAction`. */
  id: string;
  /** Icon to render; supplied by the caller as a ReactNode (e.g. an inline SVG). */
  icon: ReactNode;
  /** Accessible label applied to the `<button>` element. */
  label: string;
  /**
   * Optional count badge displayed over the icon (top-right, absolute position).
   * Rendered as bg-gold-4 text-hextech-black rounded-sm px-1 text-xs.
   */
  badge?: number;
}

export interface SocialDockProps {
  /** Ordered list of icon buttons to render in the dock. */
  buttons: DockButton[];
  /**
   * Static client-clock readout shown at the far end of the band (e.g. "26.14"),
   * rendered greyed (text-grey-2). This is a presentational readout — a
   * pre-formatted string supplied by the caller, NOT a live ticking timer.
   * Omitted entirely when undefined. Matches the current-era reference, whose
   * dock carries a running-time readout (not a patch/version string) right of
   * the icon cells (issue #457).
   */
  clockLabel?: string;
  /** Called with the button's `id` when it is clicked. */
  onAction?: (id: string) => void;
}

/**
 * SocialDock — bottom toolbar of the social rail.
 *
 * Dark band (bg-hextech-black) containing a row of icon buttons and an optional
 * client-clock readout. Each button uses the icon ReactNode supplied by the
 * caller; the component does not own an icon set.
 *
 * Current-era styling (issue #458): each control sits in its OWN gold-outlined
 * cell (border-gold-5 default → border-gold-4 on hover), giving the bar a
 * segmented, framed look rather than flat inline icons on a single band. The
 * clock readout stays unboxed at the far end.
 *
 * Button states: text-gold-2 default (#515), hover:text-gold-1, focus-visible ring gold-3.
 * Badge: absolute top-right overlay on the cell, bg-gold-4 text-hextech-black.
 * Clock text: text-xs text-grey-2 at the end of the band.
 *
 * Reference (docs/reference/client-current-home-2025-mf.png): bottom strip in
 * the LoL client right-sidebar — chat, party+badge, microphone, client clock
 * "26.14", settings — each glyph in a boxed gold cell.
 */
export function SocialDock({ buttons, clockLabel, onAction }: SocialDockProps) {
  return (
    <div className="flex w-full items-center justify-between bg-hextech-black px-3 py-1.5">
      {/* Icon buttons — each in its own gold-outlined cell (segmented look) */}
      <div className="flex items-center gap-1.5">
        {buttons.map(({ id, icon, label, badge }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            onClick={() => onAction?.(id)}
            className="relative flex h-7 w-7 items-center justify-center border border-gold-5 text-gold-2 transition-colors duration-150 hover:border-gold-4 hover:text-gold-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-3"
          >
            {icon}
            {badge != null && (
              <span className="absolute -top-1 -right-1 rounded-sm bg-gold-4 px-1 font-body text-xs leading-tight text-hextech-black">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Client-clock readout — only rendered when clockLabel is provided */}
      {clockLabel && (
        <span className="font-body text-xs text-grey-2">{clockLabel}</span>
      )}
    </div>
  );
}
