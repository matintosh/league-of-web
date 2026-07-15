"use client";

export interface FriendRequestsRowProps {
  /** Number of pending friend requests; displayed in the gold badge. */
  count: number;
  /**
   * When provided, the row is rendered as a focusable button that fires
   * this callback on click. When absent the row renders as a plain div.
   */
  onClick?: () => void;
}

// ---------------------------------------------------------------------------
// Inner layout — extracted so it renders identically in button and div modes.
// ---------------------------------------------------------------------------

function RowContent({ count }: { count: number }) {
  return (
    <div className="flex w-full items-center justify-between px-3 py-[6px]">
      {/* Label */}
      <span className="font-body text-[13px] text-gold-2">Friend Requests</span>

      {/* Gold count badge */}
      <span className="rounded-sm bg-gold-4 px-1 font-body text-xs text-hextech-black">
        {count}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * FriendRequestsRow — "Friend Requests" header row in the social sidebar.
 *
 * Shows "Friend Requests" (text-sm gold-2) on the left and a solid gold
 * count badge (bg-gold-4, text-hextech-black, rounded-sm, px-1, text-xs)
 * on the right.
 *
 * When `onClick` is provided the row renders as a `<button>` (type="button")
 * with an accessible name that includes the count; otherwise it renders as a
 * plain `<div>`. Both variants have a hover:bg-grey-cool background.
 *
 * Reference: "Friend Requests  [2]" row just below the SOCIAL strip.
 */
export function FriendRequestsRow({ count, onClick }: FriendRequestsRowProps) {
  const baseClass =
    "flex w-full items-center transition-colors duration-100 hover:bg-grey-cool";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={`Friend Requests — ${count} pending`}
        className={`${baseClass} cursor-pointer text-left`}
      >
        <RowContent count={count} />
      </button>
    );
  }

  return (
    <div className={baseClass}>
      <RowContent count={count} />
    </div>
  );
}
