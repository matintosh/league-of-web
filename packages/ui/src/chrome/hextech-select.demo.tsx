"use client";

import { useState } from "react";
import { HextechSelect } from "./hextech-select";

const CHAMPIONS = [
  { value: "ahri", label: "Ahri" },
  { value: "jinx", label: "Jinx" },
  { value: "lux", label: "Lux" },
  { value: "yasuo", label: "Yasuo" },
];

const MASTERY_LEVELS = [
  { value: "1", label: "Mastery 1" },
  { value: "2", label: "Mastery 2" },
  { value: "3", label: "Mastery 3" },
  { value: "4", label: "Mastery 4" },
  { value: "5", label: "Mastery 5" },
];

/** Default demo — no pre-selection. */
export function HextechSelectDefaultDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="p-6 max-w-xs">
      <HextechSelect
        value={value}
        onChange={setValue}
        options={CHAMPIONS}
        placeholder="Champion"
      />
    </div>
  );
}

/** Pre-selected demo — starts with "Ahri". */
export function HextechSelectWithSelectionDemo() {
  const [value, setValue] = useState("ahri");

  return (
    <div className="p-6 max-w-xs">
      <HextechSelect value={value} onChange={setValue} options={CHAMPIONS} />
    </div>
  );
}

/** Disabled demo — non-interactive. */
export function HextechSelectDisabledDemo() {
  return (
    <div className="p-6 max-w-xs">
      <HextechSelect
        value=""
        onChange={() => {}}
        options={CHAMPIONS}
        placeholder="Champion"
        disabled
      />
    </div>
  );
}

/** With placeholder demo using mastery levels. */
export function HextechSelectWithPlaceholderDemo() {
  const [value, setValue] = useState("");

  return (
    <div className="p-6 max-w-xs">
      <HextechSelect
        value={value}
        onChange={setValue}
        options={MASTERY_LEVELS}
        placeholder="Mastery"
      />
    </div>
  );
}
