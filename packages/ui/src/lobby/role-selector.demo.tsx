"use client";

import { useState } from "react";
import { RoleSelector } from "./role-selector";
import type { Role } from "./role-selector";

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
