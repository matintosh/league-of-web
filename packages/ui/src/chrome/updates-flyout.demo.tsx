"use client";

import { useState } from "react";
import { DEMO_UPDATES } from "@low/fixtures";
import type { UpdateNotification } from "./updates-flyout";
import { UpdatesFlyout } from "./updates-flyout";

/**
 * Interactive demo — a trigger button (styled like the nav-band icon) toggles
 * the flyout, anchored below-right of the trigger. Row clicks mark the item
 * read, per-row ✕ removes it, and "Mark all as read" clears every unread flag,
 * so the unread markers and header action are all exercised.
 */
export function UpdatesFlyoutDemo() {
  const [open, setOpen] = useState(true);
  const [items, setItems] = useState<UpdateNotification[]>(DEMO_UPDATES);

  const markRead = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );

  return (
    <div
      className="relative flex justify-end overflow-hidden px-6 pt-4"
      style={{ width: "100%", height: 420, backgroundColor: "var(--color-blue-8)" }}
    >
      {/* Trigger — mirrors the nav-band icon button; the flyout anchors to it */}
      <div className="relative">
        <button
          type="button"
          aria-label="Updates"
          onClick={() => setOpen((v) => !v)}
          className="flex h-8 items-center gap-2 border border-gold-4 px-3 font-display text-xs uppercase tracking-widest text-gold-1 transition-colors duration-150 hover:border-gold-2"
        >
          Updates
        </button>

        <UpdatesFlyout
          open={open}
          notifications={items}
          onItemClick={markRead}
          onDismiss={(id) => setItems((prev) => prev.filter((n) => n.id !== id))}
          onMarkAllRead={() =>
            setItems((prev) => prev.map((n) => ({ ...n, unread: false })))
          }
        />
      </div>
    </div>
  );
}

/**
 * Always-open static snapshot — the flyout as it looks with a mix of unread
 * (top three) and read rows. Anchored right in a relative stage so it does not
 * overlay the showcase page.
 */
export function UpdatesFlyoutStaticDemo() {
  return (
    <div
      className="relative flex justify-end overflow-hidden px-6 pt-2"
      style={{ width: "100%", height: 380, backgroundColor: "var(--color-blue-8)" }}
    >
      <div className="relative">
        <UpdatesFlyout open notifications={DEMO_UPDATES} />
      </div>
    </div>
  );
}

/**
 * Empty state — no notifications. Shows the "all caught up" message and no
 * "Mark all as read" action (nothing is unread).
 */
export function UpdatesFlyoutEmptyDemo() {
  return (
    <div
      className="relative flex justify-end overflow-hidden px-6 pt-2"
      style={{ width: "100%", height: 220, backgroundColor: "var(--color-blue-8)" }}
    >
      <div className="relative">
        <UpdatesFlyout open notifications={[]} />
      </div>
    </div>
  );
}
