"use client";

import { useState } from "react";
import { RoleSlotRow } from "./role-slot-row";
import { positionIconUrl } from "@low/fixtures";
import type { Role } from "./role-selector";

const ROLE_TO_CDRAGON: Record<Role, "top" | "jungle" | "middle" | "bottom" | "utility"> = {
  top: "top",
  jungle: "jungle",
  mid: "middle",
  bottom: "bottom",
  support: "utility",
};

function roleIconSrc(role: Role): string {
  return positionIconUrl(ROLE_TO_CDRAGON[role]);
}

// ---------------------------------------------------------------------------
// Filled row (md)
// ---------------------------------------------------------------------------

export function RoleSlotRowFilledDemo() {
  return (
    <div className="flex flex-col gap-4 p-6 bg-blue-6 items-start">
      <p className="font-body text-xs text-grey-1 uppercase tracking-wide">md — filled (mid + support)</p>
      <RoleSlotRow
        slots={[{ role: "mid" }, { role: "support" }]}
        size="md"
        iconSrcFor={roleIconSrc}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Partial row (one filled, one empty)
// ---------------------------------------------------------------------------

export function RoleSlotRowPartialDemo() {
  return (
    <div className="flex flex-col gap-4 p-6 bg-blue-6 items-start">
      <p className="font-body text-xs text-grey-1 uppercase tracking-wide">md — partial (top + empty)</p>
      <RoleSlotRow
        slots={[{ role: "top" }, {}]}
        size="md"
        iconSrcFor={roleIconSrc}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty row (no roles)
// ---------------------------------------------------------------------------

export function RoleSlotRowEmptyDemo() {
  return (
    <div className="flex flex-col gap-4 p-6 bg-blue-6 items-start">
      <p className="font-body text-xs text-grey-1 uppercase tracking-wide">md — empty (both slots unset)</p>
      <RoleSlotRow slots={[{}, {}]} size="md" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Small size
// ---------------------------------------------------------------------------

export function RoleSlotRowSmDemo() {
  return (
    <div className="flex flex-col gap-4 p-6 bg-blue-6 items-start">
      <p className="font-body text-xs text-grey-1 uppercase tracking-wide">sm — filled (jungle + bottom)</p>
      <RoleSlotRow
        slots={[{ role: "jungle" }, { role: "bottom" }]}
        size="sm"
        iconSrcFor={roleIconSrc}
      />
      <p className="font-body text-xs text-grey-1 uppercase tracking-wide mt-2">sm — partial (top + empty)</p>
      <RoleSlotRow
        slots={[{ role: "top" }, {}]}
        size="sm"
        iconSrcFor={roleIconSrc}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Clickable (interactive) — slot click fires callback
// ---------------------------------------------------------------------------

export function RoleSlotRowClickableDemo() {
  const [lastClicked, setLastClicked] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-4 p-6 bg-blue-6 items-start">
      <p className="font-body text-xs text-grey-1 uppercase tracking-wide">
        md — clickable (onSlotClick wired)
      </p>
      <RoleSlotRow
        slots={[{ role: "mid" }, { role: "support" }]}
        size="md"
        onSlotClick={setLastClicked}
        iconSrcFor={roleIconSrc}
      />
      <p className="font-body text-sm text-grey-2">
        Last clicked slot index: {lastClicked ?? "none"}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Glyph fallback (no iconSrcFor)
// ---------------------------------------------------------------------------

export function RoleSlotRowGlyphDemo() {
  return (
    <div className="flex flex-col gap-4 p-6 bg-blue-6 items-start">
      <p className="font-body text-xs text-grey-1 uppercase tracking-wide">
        md — glyph fallback (no iconSrcFor)
      </p>
      <RoleSlotRow
        slots={[{ role: "top" }, { role: "support" }]}
        size="md"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// All roles (5 slots)
// ---------------------------------------------------------------------------

export function RoleSlotRowAllRolesDemo() {
  return (
    <div className="flex flex-col gap-4 p-6 bg-blue-6 items-start">
      <p className="font-body text-xs text-grey-1 uppercase tracking-wide">5 slots — all roles filled</p>
      <RoleSlotRow
        slots={[
          { role: "top" },
          { role: "jungle" },
          { role: "mid" },
          { role: "bottom" },
          { role: "support" },
        ]}
        size="md"
        iconSrcFor={roleIconSrc}
      />
    </div>
  );
}
