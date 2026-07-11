"use client";

import { useState } from "react";
import { FriendGroupHeader } from "./friend-group-header";

/** Static expanded demo — no interaction needed but requires client due to onToggle prop. */
export function FriendGroupHeaderExpandedDemo() {
  return (
    <div
      data-shot="group-header"
      className="w-56 bg-blue-7"
    >
      <FriendGroupHeader
        name="General"
        online={0}
        total={0}
        collapsed={false}
        onToggle={() => undefined}
      />
    </div>
  );
}

/** Static collapsed demo — caret rotated -90°. */
export function FriendGroupHeaderCollapsedDemo() {
  return (
    <div className="w-56 bg-blue-7">
      <FriendGroupHeader
        name="General"
        online={0}
        total={0}
        collapsed={true}
        onToggle={() => undefined}
      />
    </div>
  );
}

/** With online members matching the '▾ GÉNÉRAL (1/9)' reference row. */
export function FriendGroupHeaderWithMembersDemo() {
  return (
    <div className="w-56 bg-blue-7">
      <FriendGroupHeader
        name="Général"
        online={1}
        total={9}
        collapsed={false}
        onToggle={() => undefined}
      />
    </div>
  );
}

/** Zero-online edge case — (0/0). */
export function FriendGroupHeaderZeroDemo() {
  return (
    <div className="w-56 bg-blue-7">
      <FriendGroupHeader
        name="General"
        online={0}
        total={0}
        collapsed={false}
        onToggle={() => undefined}
      />
    </div>
  );
}

/**
 * Interactive demo — owns collapsed state so the user can toggle in the showcase.
 */
export function FriendGroupHeaderToggleDemo() {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="w-56 bg-blue-7">
      <FriendGroupHeader
        name="General"
        online={1}
        total={9}
        collapsed={collapsed}
        onToggle={() => setCollapsed((c) => !c)}
      />
    </div>
  );
}
