"use client";

import { useState } from "react";
import { RoleSelector } from "./role-selector";
import type { Role } from "./role-selector";
import { positionIconUrl } from "@low/fixtures";

// CommunityDragon role slug mapping (mid→middle, support→utility)
const ROLE_TO_CDRAGON: Record<Role, "top" | "jungle" | "middle" | "bottom" | "utility"> = {
  top: "top",
  jungle: "jungle",
  mid: "middle",
  bottom: "bottom",
  support: "utility",
};

/** Returns the real CommunityDragon position SVG URL for a role + selected state. */
function roleIconSrc(role: Role, isSelected: boolean): string {
  return positionIconUrl(ROLE_TO_CDRAGON[role], isSelected ? "light" : undefined);
}

/** Interactive demo — click a role to select it. */
export function RoleSelectorInteractiveDemo() {
  const [selected, setSelected] = useState<Role | null>(null);

  return (
    <div className="flex flex-col gap-4 p-6">
      <RoleSelector
        label="Primary role"
        selected={selected}
        onSelect={setSelected}
      />
      <p className="font-body text-sm text-grey-2">
        Selected: {selected ?? "none"}
      </p>
    </div>
  );
}

/** Static snapshot — none selected. */
export function RoleSelectorNoneDemo() {
  return (
    <div className="p-6">
      <RoleSelector label="Primary role" selected={null} onSelect={() => {}} />
    </div>
  );
}

/** Static snapshot — Top selected. */
export function RoleSelectorTopDemo() {
  return (
    <div className="p-6">
      <RoleSelector label="Primary role" selected="top" onSelect={() => {}} />
    </div>
  );
}

/** Static snapshot — Mid selected. */
export function RoleSelectorMidDemo() {
  return (
    <div className="p-6">
      <RoleSelector label="Primary role" selected="mid" onSelect={() => {}} />
    </div>
  );
}

/** Static snapshot — Support selected. */
export function RoleSelectorSupportDemo() {
  return (
    <div className="p-6">
      <RoleSelector label="Primary role" selected="support" onSelect={() => {}} />
    </div>
  );
}

/** Demo with some roles disabled (autofill scenario). */
export function RoleSelectorWithDisabledDemo() {
  const [selected, setSelected] = useState<Role | null>("mid");

  return (
    <div className="flex flex-col gap-4 p-6">
      <RoleSelector
        label="Secondary role"
        selected={selected}
        onSelect={setSelected}
        disabledRoles={["jungle", "support"]}
      />
      <p className="font-body text-sm text-grey-2">
        Selected: {selected ?? "none"} — Jungle and Support disabled
      </p>
    </div>
  );
}

/** Real icons — CommunityDragon position SVGs (gold default, light selected). */
export function RoleSelectorRealIconsDemo() {
  const [selected, setSelected] = useState<Role | null>(null);

  return (
    <div className="flex flex-col gap-4 p-6 bg-hextech-black">
      <RoleSelector
        label="Primary role"
        selected={selected}
        onSelect={setSelected}
        iconSrcFor={roleIconSrc}
      />
      <p className="font-body text-sm text-grey-2">
        Real CommunityDragon position SVGs. Selected: {selected ?? "none"}
      </p>
    </div>
  );
}

/** Real icons — static snapshot, Top selected (shows light variant). */
export function RoleSelectorRealIconsTopDemo() {
  return (
    <div className="p-6 bg-hextech-black">
      <RoleSelector
        label="Primary role"
        selected="top"
        onSelect={() => {}}
        iconSrcFor={roleIconSrc}
      />
    </div>
  );
}
