"use client";

import { useState } from "react";
import { QueueTypeList } from "./queue-type-list";
import type { QueueOption } from "./queue-type-list";

// ---------------------------------------------------------------------------
// Static option sets
// ---------------------------------------------------------------------------

const SELECTED_UNSELECTED_OPTIONS: QueueOption[] = [
  { id: "blind-pick", label: "BLIND PICK" },
  { id: "ranked-solo", label: "RANKED SOLO/DUO" },
];

const DISABLED_WARNING_OPTIONS: QueueOption[] = [
  { id: "ranked-flex", label: "RANKED FLEX", disabled: true, warning: true },
];

const ALL_STATES_OPTIONS: QueueOption[] = [
  { id: "blind-pick", label: "BLIND PICK" },
  { id: "ranked-solo", label: "RANKED SOLO/DUO" },
  { id: "ranked-flex", label: "RANKED FLEX", disabled: true, warning: true },
];

// ---------------------------------------------------------------------------
// Demos
// ---------------------------------------------------------------------------

/** Interactive demo — click an option to select it. */
export function QueueTypeListInteractiveDemo() {
  const [selectedId, setSelectedId] = useState("blind-pick");

  return (
    <div className="flex flex-col gap-4 p-6">
      <QueueTypeList
        options={ALL_STATES_OPTIONS}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      <p className="font-body text-sm text-grey-2">
        Selected: {selectedId}
      </p>
    </div>
  );
}

/** Static snapshot — first option selected, second unselected. */
export function QueueTypeListSelectedUnselectedDemo() {
  return (
    <div className="p-6">
      <QueueTypeList
        options={SELECTED_UNSELECTED_OPTIONS}
        selectedId="blind-pick"
        onSelect={() => {}}
      />
    </div>
  );
}

/** Static snapshot — disabled + warning row. */
export function QueueTypeListDisabledWarningDemo() {
  return (
    <div className="p-6">
      <QueueTypeList
        options={DISABLED_WARNING_OPTIONS}
        selectedId=""
        onSelect={() => {}}
      />
    </div>
  );
}

/** Static snapshot — all states: selected, unselected, disabled+warning. */
export function QueueTypeListAllStatesDemo() {
  return (
    <div className="p-6">
      <QueueTypeList
        options={ALL_STATES_OPTIONS}
        selectedId="blind-pick"
        onSelect={() => {}}
      />
    </div>
  );
}
