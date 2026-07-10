"use client";

import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Role glyph sub-components — inline SVGs, currentColor, aria-hidden
// ---------------------------------------------------------------------------

function TopGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer frame */}
      <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Top-left corner highlight — marks "top" lane */}
      <rect x="2" y="2" width="6" height="2" fill="currentColor" />
      <rect x="2" y="2" width="2" height="6" fill="currentColor" />
      {/* Inner dot */}
      <rect x="8" y="8" width="4" height="4" fill="currentColor" />
    </svg>
  );
}

function JungleGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Three claw-like strokes radiating from centre */}
      {/* Left claw */}
      <path d="M4 16 L9 8 L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      {/* Centre claw */}
      <path d="M10 4 L10 14" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Right claw */}
      <path d="M16 16 L11 8 L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      {/* Base leaf curve */}
      <path d="M6 16 Q10 18 14 16" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function MidGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer frame */}
      <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Diagonal stripe top-left to bottom-right — marks "mid" lane */}
      <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" />
      {/* Inner dot */}
      <rect x="8" y="8" width="4" height="4" fill="currentColor" />
    </svg>
  );
}

function BottomGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer frame */}
      <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* Bottom-right corner highlight — marks "bot" lane */}
      <rect x="12" y="16" width="6" height="2" fill="currentColor" />
      <rect x="16" y="12" width="2" height="6" fill="currentColor" />
      {/* Inner dot */}
      <rect x="8" y="8" width="4" height="4" fill="currentColor" />
    </svg>
  );
}

function SupportGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield outline */}
      <path
        d="M10 2 L17 5 L17 11 Q17 16 10 19 Q3 16 3 11 L3 5 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
      />
      {/* Chalice inside shield */}
      <path d="M7 8 Q7 12 10 13 Q13 12 13 8" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <line x1="10" y1="13" x2="10" y2="15" stroke="currentColor" strokeWidth="1.2" />
      <line x1="8" y1="15" x2="12" y2="15" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Role = "top" | "jungle" | "mid" | "bottom" | "support";

export interface RoleSelectorProps {
  /** The currently selected role, or null if none. */
  selected: Role | null;
  /** Called when the user clicks a role button. */
  onSelect: (role: Role) => void;
  /** Roles that cannot be picked right now (e.g. autofill restrictions). */
  disabledRoles?: Role[];
  /** Accessible group label, e.g. "Primary role". */
  label: string;
}

// ---------------------------------------------------------------------------
// Role metadata
// ---------------------------------------------------------------------------

const ROLE_GLYPHS: Record<Role, () => ReactNode> = {
  top: TopGlyph,
  jungle: JungleGlyph,
  mid: MidGlyph,
  bottom: BottomGlyph,
  support: SupportGlyph,
};

const ROLE_LABELS: Record<Role, string> = {
  top: "Top",
  jungle: "Jungle",
  mid: "Mid",
  bottom: "Bottom",
  support: "Support",
};

const ROLE_ORDER: Role[] = ["top", "jungle", "mid", "bottom", "support"];

// ---------------------------------------------------------------------------
// RoleSelector
// ---------------------------------------------------------------------------

/**
 * RoleSelector renders a horizontal row of five role icon buttons.
 *
 * Controlled component — pass `selected` and `onSelect`.
 * Implements `role="radiogroup"` + `role="radio"` / `aria-checked` for full
 * keyboard and screen-reader accessibility.
 *
 * Layout is stable: unselected buttons use `border-transparent` so that the
 * 1px selected border never causes reflow.
 */
export function RoleSelector({
  selected,
  onSelect,
  disabledRoles = [],
  label,
}: RoleSelectorProps) {
  return (
    <div role="radiogroup" aria-label={label} className="flex items-center gap-1.5">
      {ROLE_ORDER.map((role) => {
        const isSelected = selected === role;
        const isDisabled = disabledRoles.includes(role);
        const Glyph = ROLE_GLYPHS[role];
        const roleLabel = ROLE_LABELS[role];

        return (
          <button
            key={role}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={roleLabel}
            disabled={isDisabled}
            onClick={() => onSelect(role)}
            className={[
              // Base — 32×32 square, centred content
              "flex h-8 w-8 shrink-0 items-center justify-center",
              // Border: transparent when unselected keeps layout stable
              "border transition-colors duration-150",
              // Disabled
              isDisabled && "cursor-not-allowed opacity-40",
              // Not disabled interactive states
              !isDisabled && "cursor-pointer",
              // Selected
              isSelected
                ? "border-gold-4 text-gold-2"
                : [
                    "border-transparent text-grey-2",
                    !isDisabled && "hover:text-grey-1",
                  ].filter(Boolean).join(" "),
              // Focus ring
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <Glyph />
          </button>
        );
      })}
    </div>
  );
}
