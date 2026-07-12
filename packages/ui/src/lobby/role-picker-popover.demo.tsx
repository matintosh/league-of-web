"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { RolePickerPopover } from "./role-picker-popover";
import type { PickableRole } from "./role-picker-popover";
import { RoleSlotRow } from "./role-slot-row";
import type { RoleSlot } from "./role-slot-row";
import { positionIconUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// CDragon resolver helpers (shared across demos)
// ---------------------------------------------------------------------------

/**
 * Maps PickableRole → CommunityDragon position slug.
 * "fill" has no CDragon position icon — iconSrcFor returns undefined for it
 * and the inline FillGlyph is used instead.
 */
const ROLE_TO_CDRAGON: Partial<Record<PickableRole, "top" | "jungle" | "middle" | "bottom" | "utility">> = {
  top: "top",
  jungle: "jungle",
  middle: "middle",
  bottom: "bottom",
  utility: "utility",
};

/**
 * Resolver for RolePickerPopover.iconSrcFor.
 * Returns a CDragon position SVG URL for the 5 named roles.
 * Returns undefined for "fill" so the inline FillGlyph is rendered instead.
 */
function pickerIconSrc(
  role: PickableRole,
  state: "default" | "hover" | "selected",
): string | undefined {
  const cdragonRole = ROLE_TO_CDRAGON[role];
  if (!cdragonRole) return undefined; // fill — use inline FillGlyph
  const variant = state !== "default" ? "light" : undefined;
  return positionIconUrl(cdragonRole, variant);
}

/**
 * RoleSlotRow iconSrcFor adapter — the row uses Role (legacy type from
 * role-selector.tsx); here we use PickableRole (superset). Map back.
 */
function slotRowIconSrc(role: import("./role-selector").Role): string {
  const legacyToPickable: Record<import("./role-selector").Role, PickableRole> = {
    top: "top",
    jungle: "jungle",
    mid: "middle",
    bottom: "bottom",
    support: "utility",
  };
  return positionIconUrl(ROLE_TO_CDRAGON[legacyToPickable[role]]!);
}

// ---------------------------------------------------------------------------
// Static demo helpers
// ---------------------------------------------------------------------------

/** Wrapper that gives the absolute-positioned popover a relative anchor. */
function StaticWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative flex items-end justify-center bg-blue-6 px-8"
      style={{ minHeight: 200, paddingBottom: 24 }}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Demo 1: Open, no selection
// ---------------------------------------------------------------------------

export function RolePickerPopoverOpenDemo() {
  return (
    <StaticWrapper>
      <RolePickerPopover
        open
        slotLabel="Priority"
        onSelect={() => {}}
        onClose={() => {}}
        iconSrcFor={pickerIconSrc}
      />
    </StaticWrapper>
  );
}

// ---------------------------------------------------------------------------
// Demo 2: Open, Jungle selected
// ---------------------------------------------------------------------------

export function RolePickerPopoverWithSelectionDemo() {
  return (
    <StaticWrapper>
      <RolePickerPopover
        open
        slotLabel="Priority"
        selected="jungle"
        onSelect={() => {}}
        onClose={() => {}}
        iconSrcFor={pickerIconSrc}
      />
    </StaticWrapper>
  );
}

// ---------------------------------------------------------------------------
// Demo 3: Fill selected
// ---------------------------------------------------------------------------

export function RolePickerPopoverFillSelectedDemo() {
  return (
    <StaticWrapper>
      <RolePickerPopover
        open
        slotLabel="Secondary"
        selected="fill"
        onSelect={() => {}}
        onClose={() => {}}
        iconSrcFor={pickerIconSrc}
      />
    </StaticWrapper>
  );
}

// ---------------------------------------------------------------------------
// Demo 4: Disabled roles
// ---------------------------------------------------------------------------

export function RolePickerPopoverDisabledDemo() {
  return (
    <StaticWrapper>
      <RolePickerPopover
        open
        slotLabel="Secondary"
        selected="middle"
        disabledRoles={["jungle", "utility"]}
        onSelect={() => {}}
        onClose={() => {}}
        iconSrcFor={pickerIconSrc}
      />
    </StaticWrapper>
  );
}

// ---------------------------------------------------------------------------
// Demo 5: Full interactive round-trip
// ---------------------------------------------------------------------------

/**
 * Trigger button — mirrors the dead bottom-bar circles in PartyLobbyScreen.
 * Renders the picked role's icon (or an empty circle) and handles open/close.
 */
function TriggerCircle({
  role,
  label,
  isOpen,
  disabled,
  onClick,
}: {
  role: PickableRole | undefined;
  label: string;
  isOpen: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const cdragonRole = role && role !== "fill" ? ROLE_TO_CDRAGON[role] : undefined;
  const iconSrc = cdragonRole ? positionIconUrl(cdragonRole) : undefined;

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        aria-label={`${label} role: ${role ? (role === "fill" ? "Fill" : role) : "not set"} — click to change`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={onClick}
        className={[
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          "border transition-colors duration-150",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
          disabled
            ? "cursor-not-allowed border-grey-4 bg-hextech-black text-grey-3 opacity-50"
            : isOpen
              ? "cursor-pointer border-gold-3 bg-gold-5/40 text-gold-1"
              : "cursor-pointer border-grey-3 bg-grey-4 text-grey-2 hover:border-gold-4 hover:text-gold-2",
        ].join(" ")}
      >
        {iconSrc ? (
          <img src={iconSrc} alt="" aria-hidden="true" width={20} height={20} />
        ) : role === "fill" ? (
          /* Asterisk for fill when no iconSrcFor */
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none">
            <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="2.93" y1="6" x2="17.07" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="2.93" y1="14" x2="17.07" y2="6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ) : (
          /* Empty circle inner mark */
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
          </svg>
        )}
      </button>
      <span className="font-body text-xs text-grey-2">{label}</span>
    </div>
  );
}

export function RolePickerPopoverInteractiveDemo() {
  // Which slot's popover is open: null | 0 (Priority) | 1 (Secondary)
  const [openSlot, setOpenSlot] = useState<0 | 1 | null>(null);
  const [priorityRole, setPriorityRole] = useState<PickableRole | undefined>(undefined);
  const [secondaryRole, setSecondaryRole] = useState<PickableRole | undefined>(undefined);

  // Outside-click ref — wraps the entire demo so clicks outside the open
  // popover (and its trigger) close it.
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openSlot === null) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenSlot(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openSlot]);

  const handleTriggerClick = useCallback((slot: 0 | 1) => {
    setOpenSlot((prev) => (prev === slot ? null : slot));
  }, []);

  const handleSelect = useCallback(
    (slot: 0 | 1, role: PickableRole) => {
      if (slot === 0) setPriorityRole(role);
      else setSecondaryRole(role);
      setOpenSlot(null);
    },
    [],
  );

  // RoleSlotRow slots — maps PickableRole back to the legacy Role type.
  // "fill" is not in the Role union; render as undefined (empty slot).
  const toSlotRole = (r: PickableRole | undefined): RoleSlot["role"] => {
    if (!r || r === "fill") return undefined;
    const map: Record<Exclude<PickableRole, "fill">, RoleSlot["role"]> = {
      top: "top",
      jungle: "jungle",
      middle: "mid",
      bottom: "bottom",
      utility: "support",
    };
    return map[r as Exclude<PickableRole, "fill">];
  };

  const slots: RoleSlot[] = [
    { role: toSlotRole(priorityRole) },
    { role: toSlotRole(secondaryRole) },
  ];

  return (
    <div className="flex flex-col items-center gap-6 bg-blue-6 p-8">
      {/* Self banner role slots (mirrors the PlayerBanner > RoleSlotRow) */}
      <div className="flex flex-col items-center gap-2">
        <p className="font-body text-xs uppercase tracking-wide text-grey-1">Role slots (banner)</p>
        <RoleSlotRow slots={slots} size="md" iconSrcFor={slotRowIconSrc} />
      </div>

      {/* Bottom-bar trigger buttons + popover */}
      <div ref={containerRef} className="relative flex items-center justify-center gap-4">
        {/* Priority trigger */}
        <div className="relative">
          <TriggerCircle
            role={priorityRole}
            label="Priority"
            isOpen={openSlot === 0}
            disabled={false}
            onClick={() => handleTriggerClick(0)}
          />
          <RolePickerPopover
            open={openSlot === 0}
            slotLabel="Priority"
            selected={priorityRole}
            disabledRoles={secondaryRole ? [secondaryRole] : []}
            onSelect={(r) => handleSelect(0, r)}
            onClose={() => setOpenSlot(null)}
            iconSrcFor={pickerIconSrc}
          />
        </div>

        {/* Secondary trigger */}
        <div className="relative">
          <TriggerCircle
            role={secondaryRole}
            label="Secondary"
            isOpen={openSlot === 1}
            disabled={false}
            onClick={() => handleTriggerClick(1)}
          />
          <RolePickerPopover
            open={openSlot === 1}
            slotLabel="Secondary"
            selected={secondaryRole}
            disabledRoles={priorityRole ? [priorityRole] : []}
            onSelect={(r) => handleSelect(1, r)}
            onClose={() => setOpenSlot(null)}
            iconSrcFor={pickerIconSrc}
          />
        </div>
      </div>

      <p className="font-body text-xs text-grey-2 text-center max-w-xs">
        Click Priority or Secondary to open the role picker. Select a role to close and update both the trigger icon and the banner slots above. The other slot&apos;s pick is dimmed.
      </p>
    </div>
  );
}
