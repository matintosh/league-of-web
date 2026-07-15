"use client";

export interface FriendGroupHeaderProps {
  /** Group name displayed in uppercase, e.g. "General". */
  name: string;
  /** Number of online members. */
  online: number;
  /** Total members in the group. */
  total: number;
  /** When true the group list is hidden; caret rotates -90°. */
  collapsed: boolean;
  /** Called when the user clicks the header row to toggle collapsed state. */
  onToggle: () => void;
}

/**
 * FriendGroupHeader — collapsible social group header row.
 *
 * Renders a full-width button band with a caret, uppercase group name, and
 * online/total count. The caret rotates -90° when `collapsed` is true.
 * Controlled component — no internal state; caller owns `collapsed`.
 *
 * Reference: "▾ GENERAL (0/0)" band in the LoL client social sidebar.
 */
export function FriendGroupHeader({
  name,
  online,
  total,
  collapsed,
  onToggle,
}: FriendGroupHeaderProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={!collapsed}
      className="flex w-full items-center gap-1.5 bg-[color-mix(in_srgb,var(--color-grey-4)_70%,var(--color-hextech-black))] px-3 py-1 text-left transition-colors duration-100 hover:bg-grey-cool"
    >
      {/* Caret — rotates to -90° when collapsed */}
      <svg
        aria-hidden="true"
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="currentColor"
        className={[
          "shrink-0 text-grey-1 transition-transform duration-150",
          collapsed ? "-rotate-90" : "rotate-0",
        ].join(" ")}
      >
        {/* Down-pointing caret ▾ */}
        <path d="M5 7 L1 3 L9 3 Z" />
      </svg>

      {/* Group name — CSS uppercase, tracking-widest, grey-1 */}
      <span className="font-body text-xs uppercase tracking-widest text-grey-1">
        {name}
      </span>

      {/* Count — grey-2 */}
      <span className="font-body text-xs text-grey-2">
        ({online}/{total})
      </span>
    </button>
  );
}
