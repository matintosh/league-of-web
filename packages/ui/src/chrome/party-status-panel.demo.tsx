"use client";

import { useState } from "react";
import { PartyStatusPanel } from "./party-status-panel";
import { gameModeMapUrl } from "@low/fixtures";

/** Stateful demo showing the toggle interaction between open/closed states. */
export function PartyStatusPanelToggleDemo() {
  const [open, setOpen] = useState(true);
  return (
    <div className="w-[200px] bg-blue-7">
      <PartyStatusPanel
        queueLabel="Normal Draft"
        crestSrc={gameModeMapUrl("sr")}
        filled={1}
        capacity={5}
        open={open}
        onToggleOpen={() => setOpen((prev) => !prev)}
      />
    </div>
  );
}
