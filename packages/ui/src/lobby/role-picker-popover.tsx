"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * The full set of roles a player can pick in the lobby, including Fill.
 * "fill" means "any role" — shown as an asterisk glyph right of the divider.
 */
export type PickableRole =
  | "top"
  | "jungle"
  | "middle"
  | "bottom"
  | "utility"
  | "fill";

export interface RolePickerPopoverProps {
  /** Whether the popover is visible. Controlled by the parent. */
  open: boolean;
  /**
   * Which slot is being configured. Displayed as the caption beneath the role
   * name in the label block (e.g. "Priority" or "Secondary").
   */
  slotLabel: string;
  /** Currently selected role for this slot. */
  selected?: PickableRole;
  /**
   * Roles the user cannot pick (e.g. the other slot's current pick).
   * Disabled roles render dimmed and are not interactive.
   */
  disabledRoles?: PickableRole[];
  /**
   * Called when the user clicks a role. The popover closes after selection
   * (controlled: parent must set open=false in response to onClose).
   */
  onSelect: (role: PickableRole) => void;
  /** Called when the popover should close (outside click, re-click, selection). */
  onClose: () => void;
  /**
   * Optional real-asset URL resolver. When provided, an <img> is rendered
   * instead of the inline SVG glyph.
   *
   * The `state` argument lets callers return the right CDragon variant:
   *   "selected" → light variant (near-white fills)
   *   "hover"    → light variant or a brightened treatment
   *   "default"  → gold variant
   *
   * Falls back to inline SVG glyphs when omitted.
   *
   * Example:
   *   iconSrcFor={(r, state) =>
   *     r === "fill"
   *       ? fillGlyphUrl()
   *       : positionIconUrl(ROLE_TO_CDRAGON[r], state !== "default" ? "light" : undefined)
   *   }
   *
   * Note: Escape key is intentionally out of scope — the trigger button and
   * outside-click handler cover all dismissal paths for this popover.
   */
  iconSrcFor?: (
    role: PickableRole,
    state: "default" | "hover" | "selected",
  ) => string | undefined;
}

// ---------------------------------------------------------------------------
// Role metadata
// ---------------------------------------------------------------------------

/** Display names for each pickable role. */
const ROLE_LABELS: Record<PickableRole, string> = {
  top: "Top",
  jungle: "Jungle",
  middle: "Mid",
  bottom: "Bottom",
  utility: "Support",
  fill: "Fill",
};

/**
 * Ordered role list: the 5 standard roles + divider point + Fill.
 * The divider is rendered between index 4 (utility) and 5 (fill).
 */
const ROLE_ORDER: PickableRole[] = [
  "top",
  "jungle",
  "middle",
  "bottom",
  "utility",
  "fill",
];

/** Index at which the vertical hairline divider is placed (before Fill). */
const DIVIDER_BEFORE_INDEX = 5;

// ---------------------------------------------------------------------------
// Inline SVG glyphs — fallback when iconSrcFor is not provided
// ---------------------------------------------------------------------------

function TopGlyph(): ReactNode {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="2" y="2" width="6" height="2" fill="currentColor" />
      <rect x="2" y="2" width="2" height="6" fill="currentColor" />
      <rect x="8" y="8" width="4" height="4" fill="currentColor" />
    </svg>
  );
}

function JungleGlyph(): ReactNode {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 20 20" fill="none">
      <path d="M4 16 L9 8 L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M10 4 L10 14" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M16 16 L11 8 L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <path d="M6 16 Q10 18 14 16" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

function MiddleGlyph(): ReactNode {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.5" />
      <rect x="8" y="8" width="4" height="4" fill="currentColor" />
    </svg>
  );
}

function BottomGlyph(): ReactNode {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="12" y="16" width="6" height="2" fill="currentColor" />
      <rect x="16" y="12" width="2" height="6" fill="currentColor" />
      <rect x="8" y="8" width="4" height="4" fill="currentColor" />
    </svg>
  );
}

function UtilityGlyph(): ReactNode {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 20 20" fill="none">
      <path d="M10 2 L17 5 L17 11 Q17 16 10 19 Q3 16 3 11 L3 5 Z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <path d="M7 8 Q7 12 10 13 Q13 12 13 8" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <line x1="10" y1="13" x2="10" y2="15" stroke="currentColor" strokeWidth="1.2" />
      <line x1="8" y1="15" x2="12" y2="15" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * Fill glyph — asterisk mark. No CDragon "parties fill" icon was found in
 * ICON-SOURCES.md (rcp-fe-lol-parties only lists map crests). Using an
 * original asterisk SVG per the issue brief fallback instruction.
 */
function FillGlyph(): ReactNode {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 20 20" fill="none">
      {/* 6-spoke asterisk */}
      <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="2.93" y1="6" x2="17.07" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="2.93" y1="14" x2="17.07" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Teal diamond marker — rendered at the top-right of a selected role icon. */
function DiamondMarker(): ReactNode {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -right-1 -top-1 flex h-3 w-3 items-center justify-center"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <rect
          x="5"
          y="0.5"
          width="6.36"
          height="6.36"
          rx="0.5"
          transform="rotate(45 5 0.5)"
          fill="currentColor"
          className="text-blue-2"
        />
      </svg>
    </span>
  );
}

const ROLE_GLYPHS: Record<PickableRole, () => ReactNode> = {
  top: TopGlyph,
  jungle: JungleGlyph,
  middle: MiddleGlyph,
  bottom: BottomGlyph,
  utility: UtilityGlyph,
  fill: FillGlyph,
};

// ---------------------------------------------------------------------------
// RolePickerPopover
// ---------------------------------------------------------------------------

/**
 * RolePickerPopover — the dark floating panel for lobby role selection.
 *
 * **Positioning:** absolute within the bottom-bar container (no React portal).
 * Callers must give the container `position: relative`. The popover anchors
 * upward from where it is placed; a downward-pointing CSS caret notch sits
 * at the bottom center.
 *
 * **Label block:** shows the hovered role name while hovering, falling back
 * to the selected role name, falling back to the slotLabel caption only.
 *
 * **Aria:** uses `role="listbox"` with `aria-label` and each option as
 * `role="option"` + `aria-selected`. This is the simplest correct pattern
 * for a pick-one list — avoids the complexity of roving focus / radiogroup
 * while still exposing selection state to screen readers. Disabled options
 * get `aria-disabled="true"`.
 *
 * **Keyboard:** buttons handle Tab/Enter/Space natively; Escape is out of
 * scope (outside-click covers all dismissal paths).
 *
 * **Fill glyph decision:** No CDragon "parties fill" icon was found in
 * ICON-SOURCES.md. An original 6-spoke asterisk SVG is used as the glyph
 * (FillGlyph). When `iconSrcFor` is provided, the caller can supply any URL
 * for the "fill" role (e.g. a spot-crawled CDragon icon) and it will be used
 * instead of the inline asterisk.
 */
export function RolePickerPopover({
  open,
  slotLabel,
  selected,
  disabledRoles = [],
  onSelect,
  onClose,
  iconSrcFor,
}: RolePickerPopoverProps) {
  const id = useId();
  const [hovered, setHovered] = useState<PickableRole | null>(null);

  if (!open) return null;

  // Roving label: hovered → selected → empty (only caption shows)
  const rovingRole = hovered ?? selected ?? null;
  const rovingLabel = rovingRole ? ROLE_LABELS[rovingRole] : null;

  const handleSelect = (role: PickableRole) => {
    onSelect(role);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-label={`${slotLabel} role picker`}
      aria-modal="false"
      className={[
        "absolute bottom-full left-1/2 z-30 mb-3",
        "-translate-x-1/2",
      ].join(" ")}
      style={{ minWidth: 340 }}
    >
      {/* Panel */}
      <div
        className={[
          "relative rounded-sm",
          "bg-blue-7 border border-gold-5",
          "px-4 py-3",
          "shadow-[0_4px_24px_rgba(0,0,0,0.7)]",
        ].join(" ")}
      >
        {/* Label block */}
        <div className="mb-3 text-center" style={{ minHeight: 36 }}>
          {rovingLabel ? (
            <p className="font-display text-sm uppercase tracking-wider text-gold-1">
              {rovingLabel}
            </p>
          ) : (
            /* Spacer so the caption doesn't jump when no role is active */
            <p className="font-display text-sm uppercase tracking-wider text-transparent select-none">
              &nbsp;
            </p>
          )}
          <p className="font-body text-xs text-grey-1 mt-0.5">{slotLabel}</p>
        </div>

        {/* Icon row */}
        <div
          role="listbox"
          aria-label={`${slotLabel} role options`}
          aria-activedescendant={selected ? `${id}-option-${selected}` : undefined}
          className="flex items-center gap-1"
        >
          {ROLE_ORDER.map((role, index) => {
            const isSelected = selected === role;
            const isDisabled = disabledRoles.includes(role);
            const Glyph = ROLE_GLYPHS[role];
            const iconState: "selected" | "hover" | "default" = isSelected
              ? "selected"
              : hovered === role
                ? "hover"
                : "default";
            const iconSrc = iconSrcFor ? iconSrcFor(role, iconState) : undefined;

            const button = (
              <button
                key={role}
                id={`${id}-option-${role}`}
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-disabled={isDisabled ? true : undefined}
                aria-label={ROLE_LABELS[role]}
                disabled={isDisabled}
                onClick={() => handleSelect(role)}
                onMouseEnter={() => !isDisabled && setHovered(role)}
                onMouseLeave={() => setHovered(null)}
                className={[
                  "relative flex h-10 w-10 shrink-0 items-center justify-center",
                  "rounded-sm border transition-colors duration-100",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
                  // Disabled: dimmed, not interactive
                  isDisabled && "cursor-not-allowed opacity-30 border-transparent text-grey-2",
                  // Selected: gold border + gold text (for SVG glyph color)
                  !isDisabled && isSelected && "cursor-pointer border-gold-4 bg-gold-5/40 text-gold-1",
                  // Hover (not selected, not disabled)
                  !isDisabled && !isSelected && hovered === role && "cursor-pointer border-grey-3 bg-grey-4/60 text-grey-1",
                  // Default (not selected, not hovered, not disabled)
                  !isDisabled && !isSelected && hovered !== role && "cursor-pointer border-transparent text-grey-2 hover:border-grey-3",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {iconSrc ? (
                  <img
                    src={iconSrc}
                    alt=""
                    aria-hidden="true"
                    width={22}
                    height={22}
                    draggable={false}
                  />
                ) : (
                  <Glyph />
                )}
                {/* Teal diamond marker on selected */}
                {isSelected && <DiamondMarker />}
              </button>
            );

            // Prepend hairline divider before the Fill role (index 5)
            if (index === DIVIDER_BEFORE_INDEX) {
              return (
                <div key={`div-${role}`} className="flex items-center gap-1">
                  <span
                    aria-hidden="true"
                    className="block h-7 w-px shrink-0 bg-gold-5"
                  />
                  {button}
                </div>
              );
            }

            return button;
          })}
        </div>

        {/* Downward-pointing caret notch — CSS triangle via borders */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 translate-y-full -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "8px solid transparent",
            borderRight: "8px solid transparent",
            // Use inline style for the caret border-top — the color must match
            // border-gold-5 (#463714). Token classes can't set border-top-color
            // on a triangle element without extra utility, so we use the CSS var.
            borderTop: "8px solid var(--color-gold-5)",
          }}
        />
        {/* Inner caret (slightly smaller, matches panel bg) for two-tone border effect */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: 0,
            height: 0,
            borderLeft: "6px solid transparent",
            borderRight: "6px solid transparent",
            borderTop: "6px solid var(--color-blue-7)",
            transform: "translateX(-50%) translateY(calc(100% - 2px))",
          }}
        />
      </div>
    </div>
  );
}
