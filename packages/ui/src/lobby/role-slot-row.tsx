"use client";

import type { ReactNode } from "react";
import type { Role } from "./role-selector";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RoleSlot {
  /** The assigned role. When undefined, the slot renders as an empty circle. */
  role?: Role;
}

export interface RoleSlotRowProps {
  /**
   * Array of role slot data. Length drives the number of circles rendered.
   * Typical usage: 2 slots (primary + secondary role preferences).
   */
  slots: RoleSlot[];
  /**
   * Called when the user clicks a slot. Receives the slot index (0-based).
   * When omitted, circles are non-interactive (static display).
   *
   * NOTE: Role picker popover is out of scope for this component — document
   * in the parent screen to compose in as needed.
   */
  onSlotClick?: (index: number) => void;
  /** Visual size scale. md (default) ~34px circles; sm ~26px circles. */
  size?: "sm" | "md";
  /**
   * Optional real-asset URL resolver for role icons. When provided, renders
   * an <img> instead of the inline SVG glyph — mirrors RoleSelector.iconSrcFor.
   * Falls back to inline SVG glyphs when omitted.
   *
   * Example:
   *   iconSrcFor={(role) => positionIconUrl(ROLE_TO_CDRAGON[role])}
   */
  iconSrcFor?: (role: Role) => string;
}

// ---------------------------------------------------------------------------
// Slot ring color map
//
// The reference shows colored rings on filled slots: gold primary, purple/teal
// secondary. Using an index-based ring color scheme matching the reference.
// ---------------------------------------------------------------------------

const RING_COLOR: Record<number, string> = {
  0: "border-gold-3",     // primary slot — gold ring
  1: "border-blue-3",     // secondary slot — teal-blue ring
};

const RING_COLOR_FALLBACK = "border-grey-3";

// ---------------------------------------------------------------------------
// Glyph components are internal to role-selector.tsx — we import them via
// a shared glyphs file. Because they weren't exported, we inline compact
// equivalents here that match the role-selector design.
// ---------------------------------------------------------------------------

function RoleGlyph({ role }: { role: Role }): ReactNode {
  const size = 14;
  switch (role) {
    case "top":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="2" y="2" width="6" height="2" fill="currentColor" />
          <rect x="2" y="2" width="2" height="6" fill="currentColor" />
          <rect x="8" y="8" width="4" height="4" fill="currentColor" />
        </svg>
      );
    case "jungle":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 20 20" fill="none">
          <path d="M4 16 L9 8 L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
          <path d="M10 4 L10 14" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M16 16 L11 8 L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
          <path d="M6 16 Q10 18 14 16" stroke="currentColor" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case "mid":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" />
          <rect x="8" y="8" width="4" height="4" fill="currentColor" />
        </svg>
      );
    case "bottom":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <rect x="12" y="16" width="6" height="2" fill="currentColor" />
          <rect x="16" y="12" width="2" height="6" fill="currentColor" />
          <rect x="8" y="8" width="4" height="4" fill="currentColor" />
        </svg>
      );
    case "support":
      return (
        <svg aria-hidden="true" width={size} height={size} viewBox="0 0 20 20" fill="none">
          <path d="M10 2 L17 5 L17 11 Q17 16 10 19 Q3 16 3 11 L3 5 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          <path d="M7 8 Q7 12 10 13 Q13 12 13 8" stroke="currentColor" strokeWidth="1.2" fill="none" />
          <line x1="10" y1="13" x2="10" y2="15" stroke="currentColor" strokeWidth="1.2" />
          <line x1="8" y1="15" x2="12" y2="15" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      );
  }
}

// ---------------------------------------------------------------------------
// RoleSlotRow
// ---------------------------------------------------------------------------

/**
 * RoleSlotRow — a horizontal row of circular role-slot indicators.
 *
 * Each circle is either:
 *   - Empty (role undefined): dark circle with muted grey ring
 *   - Filled (role set): ring color by slot index + role icon (real asset or glyph)
 *
 * Slot index 0 = primary (gold ring), index 1 = secondary (teal ring) per the
 * reference screenshot. Additional slots fall back to the grey ring color.
 *
 * `onSlotClick`: when provided, circles become buttons. Role popover is out of
 * scope — compose a picker in the parent screen.
 *
 * `iconSrcFor`: optional real-asset resolver (mirrors RoleSelector.iconSrcFor).
 * Falls back to inline SVG glyphs when omitted.
 */
export function RoleSlotRow({
  slots,
  onSlotClick,
  size = "md",
  iconSrcFor,
}: RoleSlotRowProps) {
  const circlePx = size === "sm" ? 26 : 34;
  const iconPx   = size === "sm" ? 14 : 18;

  return (
    <div
      role={onSlotClick ? "group" : undefined}
      aria-label={onSlotClick ? "Role slots" : undefined}
      className="flex items-center gap-1.5"
    >
      {slots.map((slot, index) => {
        const isFilled = slot.role !== undefined;
        const ringClass = isFilled
          ? (RING_COLOR[index] ?? RING_COLOR_FALLBACK)
          : RING_COLOR_FALLBACK;

        const iconSrc = isFilled && iconSrcFor ? iconSrcFor(slot.role!) : undefined;

        const content = (
          <>
            {isFilled ? (
              iconSrc ? (
                <img
                  src={iconSrc}
                  alt=""
                  aria-hidden="true"
                  width={iconPx}
                  height={iconPx}
                />
              ) : (
                <span className="text-gold-2">
                  <RoleGlyph role={slot.role!} />
                </span>
              )
            ) : null}
          </>
        );

        const sharedStyle: React.CSSProperties = {
          width: circlePx,
          height: circlePx,
          borderRadius: "50%",
        };

        const sharedClass = [
          "flex shrink-0 items-center justify-center",
          "border",
          ringClass,
          // Dark fill inside circle
          isFilled ? "bg-grey-4" : "bg-hextech-black",
        ].join(" ");

        if (onSlotClick) {
          return (
            <button
              key={index}
              type="button"
              aria-label={
                isFilled
                  ? `${slot.role} role slot — click to change`
                  : `Empty role slot ${index + 1} — click to set`
              }
              onClick={() => onSlotClick(index)}
              className={[
                sharedClass,
                "cursor-pointer transition-colors duration-150",
                "hover:border-gold-2",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
              ].join(" ")}
              style={sharedStyle}
            >
              {content}
            </button>
          );
        }

        return (
          <div
            key={index}
            aria-label={isFilled ? `${slot.role} role` : `Empty role slot`}
            className={sharedClass}
            style={sharedStyle}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
