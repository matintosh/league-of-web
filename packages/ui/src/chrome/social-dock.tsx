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
   * Optional count badge displayed over the icon (top, absolute position).
   * Rendered as bg-gold-4 text-hextech-black rounded-sm px-1 text-xs.
   */
  badge?: number;
  /**
   * When true this control is framed in its OWN gold-outlined cell
   * (border-gold-5 → border-gold-4 on hover) — the distinct, boxed look the
   * reference reserves for the far-right debug/bug button. When false/omitted
   * the glyph sits flush in the left group, separated from its neighbours only
   * by a faint hairline divider (no per-glyph box). See {@link SocialDock}.
   */
  boxed?: boolean;
}

export interface SocialDockProps {
  /** Ordered list of icon buttons to render in the dock. */
  buttons: DockButton[];
  /**
   * Static client-clock readout shown between the flush left group and the
   * trailing boxed button(s) (e.g. "26.14"), rendered greyed (text-grey-2).
   * This is a presentational readout — a pre-formatted string supplied by the
   * caller, NOT a live ticking timer. Omitted entirely when undefined. Matches
   * the current-era reference, whose dock carries a running-time readout (not a
   * patch/version string) right of the icon cells (issue #457).
   */
  clockLabel?: string;
  /** Called with the button's `id` when it is clicked. */
  onAction?: (id: string) => void;
}

/**
 * SocialDock — bottom toolbar of the social rail.
 *
 * Dark band (bg-hextech-black) with three zones, left → right (issue #535,
 * ref23.png):
 *   1. Flush LEFT group — the un-`boxed` glyphs (chat, party+badge, mic) sit
 *      in a single row, each separated from its neighbour by a faint vertical
 *      hairline divider (border-white/40). No per-glyph gold box — the row
 *      reads as subtle inline icons, not framed cells.
 *   2. The client-clock readout (text-grey-2), when `clockLabel` is provided.
 *   3. Trailing BOXED button(s) — any button with `boxed: true` (the debug/bug
 *      control) sits in its own gold-outlined cell (border-gold-5 →
 *      border-gold-4 on hover), the one clearly framed cell in the bar.
 *
 * The component owns no icon set — every glyph is the ReactNode supplied by the
 * caller. Ordering within each zone follows `buttons` order.
 *
 * Button states: text-gold-2 default (#515), hover:text-gold-1, focus-visible ring gold-3.
 * Badge: absolute top overlay on the button, bg-gold-4 text-hextech-black.
 * Clock text: text-xs text-grey-2.
 *
 * Reference (ref23.png / docs/reference/client-current-home-2025-mf.png): the
 * bottom strip in the LoL client right-sidebar — chat, party+badge, mic, the
 * client clock "26.14", then a debug/bug button in a gold-outlined cell.
 */
export function SocialDock({ buttons, clockLabel, onAction }: SocialDockProps) {
  const flushButtons = buttons.filter((b) => !b.boxed);
  const boxedButtons = buttons.filter((b) => b.boxed);

  return (
    <div className="flex w-full items-center justify-between bg-hextech-black px-3 py-1.5">
      {/* Zone 1 — flush left group: faint hairline dividers between glyphs, no
          per-glyph gold box. divide-x paints a 1px white/40 line between cells. */}
      <div className="flex items-center divide-x divide-white/40">
        {flushButtons.map(({ id, icon, label, badge }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            onClick={() => onAction?.(id)}
            className="relative flex h-7 w-9 items-center justify-center text-gold-2 transition-colors duration-150 hover:text-gold-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-3"
          >
            {icon}
            {badge != null && (
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-sm bg-gold-4 px-1 font-body text-xs leading-tight text-hextech-black">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Zone 2 + 3 — clock readout, then the trailing gold-boxed button(s). */}
      <div className="flex items-center gap-2.5">
        {clockLabel && (
          <span className="font-body text-xs text-grey-2">{clockLabel}</span>
        )}
        {boxedButtons.map(({ id, icon, label, badge }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            onClick={() => onAction?.(id)}
            className="relative flex h-7 w-7 items-center justify-center border border-gold-5 text-gold-2 transition-colors duration-150 hover:border-gold-4 hover:text-gold-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-3"
          >
            {icon}
            {badge != null && (
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-sm bg-gold-4 px-1 font-body text-xs leading-tight text-hextech-black">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
