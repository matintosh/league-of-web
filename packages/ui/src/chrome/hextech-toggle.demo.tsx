"use client";

import { useState } from "react";
import { HextechToggle } from "./hextech-toggle";

/** Interactive demo — single toggle with live on/off state. */
export function HextechToggleDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <HextechToggle
          checked={checked}
          onChange={setChecked}
          label="Example setting"
        />
        <span className="font-body text-sm text-grey-1">
          {checked ? "On" : "Off"}
        </span>
      </div>
    </div>
  );
}

/** Static demo showing all four states. */
export function HextechToggleStatesDemo() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        <HextechToggle checked={false} onChange={() => {}} label="Off" />
        <span className="font-body text-xs text-grey-1">Off</span>
      </div>
      <div className="flex items-center gap-4">
        <HextechToggle checked={true} onChange={() => {}} label="On" />
        <span className="font-body text-xs text-grey-1">On</span>
      </div>
      <div className="flex items-center gap-4">
        <HextechToggle checked={false} onChange={() => {}} label="Disabled off" disabled />
        <span className="font-body text-xs text-grey-1">Disabled off</span>
      </div>
      <div className="flex items-center gap-4">
        <HextechToggle checked={true} onChange={() => {}} label="Disabled on" disabled />
        <span className="font-body text-xs text-grey-1">Disabled on</span>
      </div>
    </div>
  );
}
