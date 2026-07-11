"use client";

import { useState } from "react";
import { HextechCheckbox } from "./hextech-checkbox";

/** Interactive demo — unchecked by default, toggleable. */
export function HextechCheckboxUncheckedDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="p-6">
      <HextechCheckbox
        checked={checked}
        onChange={setChecked}
        label="Show Unowned"
      />
    </div>
  );
}

/** Interactive demo — starts checked. */
export function HextechCheckboxCheckedDemo() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="p-6">
      <HextechCheckbox
        checked={checked}
        onChange={setChecked}
        label="Show Unowned"
      />
    </div>
  );
}

/** Static disabled unchecked. */
export function HextechCheckboxDisabledUncheckedDemo() {
  return (
    <div className="p-6">
      <HextechCheckbox
        checked={false}
        onChange={() => {}}
        label="Show Unowned"
        disabled
      />
    </div>
  );
}

/** Static disabled checked. */
export function HextechCheckboxDisabledCheckedDemo() {
  return (
    <div className="p-6">
      <HextechCheckbox
        checked={true}
        onChange={() => {}}
        label="Show Unowned"
        disabled
      />
    </div>
  );
}
