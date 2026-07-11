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
   * Version string displayed at the far end of the band (e.g. "V9.14").
   * Rendered as text-xs text-grey-2. Omitted entirely when undefined.
   * Note: `{version && …}` is safe here — version is `string | undefined`.
   */
  version?: string;
  /** Called with the button's `id` when it is clicked. */
  onAction?: (id: string) => void;
}

/**
 * SocialDock — bottom toolbar of the social rail.
 *
 * Dark band (bg-hextech-black) containing a row of icon buttons and an optional
 * version string. Each button uses the icon ReactNode supplied by the caller;
 * the component does not own an icon set.
 *
 * Button states: text-grey-1 default, hover:text-gold-1, focus-visible ring gold-3.
 * Badge: absolute top-right overlay, bg-gold-4 text-hextech-black rounded-sm px-1 text-xs.
 * Version text: text-xs text-grey-2 at the end of the band.
 *
 * Reference: bottom strip in the LoL client right-sidebar (chat, multi-chat+badge,
 * download, settings icons + "V9.14" text).
 */
export function SocialDock({ buttons, version, onAction }: SocialDockProps) {
  return (
    <div className="flex w-full items-center justify-between bg-hextech-black px-3 py-1.5">
      {/* Icon buttons */}
      <div className="flex items-center gap-1">
        {buttons.map(({ id, icon, label, badge }) => (
          <button
            key={id}
            type="button"
            aria-label={label}
            onClick={() => onAction?.(id)}
            className="relative text-grey-1 transition-colors duration-150 hover:text-gold-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-3"
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

      {/* Version text — only rendered when version is provided */}
      {version && (
        <span className="font-body text-xs text-grey-2">{version}</span>
      )}
    </div>
  );
}
