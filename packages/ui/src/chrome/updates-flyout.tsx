/**
 * UpdatesFlyout — the current-era Updates / notifications surface.
 *
 * Opened from the nav-band Updates icon (issue #396 / era-shift epic #384). It
 * is a compact dropdown/flyout anchored below the icon and right-aligned to the
 * window edge, listing recent notifications (patch notes, esports, shop / event
 * alerts) as dated rows with an unread marker.
 *
 * CONVENTION-BASED: no dedicated notifications-flyout reference screenshot
 * exists in docs/reference (unlike most components, whose reference lives in the
 * issue). The current client's Updates icon opens a small anchored dropdown of
 * notification rows; this reproduces that convention in Hextech panel styling
 * per house tokens (1px gold-framed panel on blue-7, gold headings, dated grey
 * body). If a real reference surfaces later, tighten proportions to match.
 *
 * Presentational: props in, callbacks out — no internal state, no data
 * fetching. The shell owns visibility (open/close) and outside-click / Escape
 * dismissal (the anchored flyout can't reliably own document-level listeners
 * for its own trigger, so the shell wires those, matching the pattern used for
 * the other nav-band surfaces).
 */
"use client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** One notification row in the Updates flyout. */
export interface UpdateNotification {
  /** Stable id. */
  id: string;
  /** Bold row title, e.g. "Patch 26.14 is live". */
  title: string;
  /** Optional grey descriptor line under the title. */
  body?: string;
  /** Relative timestamp label, e.g. "2h ago". Pre-formatted by the caller. */
  timestampLabel: string;
  /** Optional leading thumbnail art URL (patch splash / event tile). */
  iconSrc?: string;
  /** When true, shows the gold unread marker and a subtle row highlight. */
  unread?: boolean;
}

export interface UpdatesFlyoutProps {
  /** When false, renders nothing. */
  open: boolean;
  /** Notification rows, newest first (caller orders them). */
  notifications: UpdateNotification[];
  /** Called when a notification row is clicked (open the item / mark read). */
  onItemClick?: (id: string) => void;
  /** Called when a row's ✕ dismiss button is pressed. */
  onDismiss?: (id: string) => void;
  /** Called when the header "Mark all as read" action is pressed. */
  onMarkAllRead?: () => void;
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

/** ✕ dismiss glyph for a notification row. */
function DismissIcon() {
  return (
    <svg
      aria-hidden="true"
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1l8 8M9 1L1 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Notification row
// ---------------------------------------------------------------------------

function NotificationRow({
  notification,
  onItemClick,
  onDismiss,
}: {
  notification: UpdateNotification;
  onItemClick?: (id: string) => void;
  onDismiss?: (id: string) => void;
}) {
  const { id, title, body, timestampLabel, iconSrc, unread } = notification;

  return (
    <li className="group relative border-b border-gold-5/60 last:border-b-0">
      <button
        type="button"
        onClick={() => onItemClick?.(id)}
        className="flex w-full cursor-pointer items-start gap-2.5 px-3 py-2.5 text-left transition-colors duration-150 hover:bg-grey-4"
        style={
          unread
            ? {
                backgroundColor:
                  "color-mix(in srgb, var(--color-gold-4) 8%, transparent)",
              }
            : undefined
        }
      >
        {/* Unread marker — a small gold dot in the gutter. Reserves its width
            when read so titles stay aligned across the list. */}
        <span
          aria-hidden="true"
          className={[
            "mt-1.5 h-2 w-2 shrink-0 rounded-full",
            unread ? "bg-gold-2" : "bg-transparent",
          ].join(" ")}
        />

        {/* Optional thumbnail */}
        {iconSrc && (
          <span className="mt-0.5 h-9 w-9 shrink-0 overflow-hidden border border-gold-5 bg-hextech-black">
            <img
              src={iconSrc}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0";
              }}
            />
          </span>
        )}

        {/* Title + body + timestamp */}
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span
              className={[
                "truncate font-body text-[13px]",
                unread ? "text-gold-1" : "text-grey-1",
              ].join(" ")}
            >
              {title}
            </span>
            <span className="shrink-0 font-body text-[10px] uppercase tracking-wide text-grey-2">
              {timestampLabel}
            </span>
          </span>
          {body && (
            <span className="mt-0.5 block font-body text-[11px] leading-snug text-grey-1">
              {body}
            </span>
          )}
        </span>
      </button>

      {/* Per-row dismiss — appears on hover, top-right, over the row */}
      {onDismiss && (
        <button
          type="button"
          aria-label={`Dismiss ${title}`}
          onClick={() => onDismiss(id)}
          className="absolute right-1.5 top-1.5 flex h-5 w-5 cursor-pointer items-center justify-center text-grey-2 opacity-0 transition-opacity duration-150 hover:text-gold-1 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <DismissIcon />
        </button>
      )}
    </li>
  );
}

// ---------------------------------------------------------------------------
// UpdatesFlyout — public component
// ---------------------------------------------------------------------------

export function UpdatesFlyout({
  open,
  notifications,
  onItemClick,
  onDismiss,
  onMarkAllRead,
}: UpdatesFlyoutProps) {
  if (!open) return null;

  const hasUnread = notifications.some((n) => n.unread);

  return (
    <div
      role="dialog"
      aria-label="Updates"
      // Anchored below the trigger, right-aligned to it. The parent button is
      // positioned relative so this sits under the icon; right-0 keeps it on
      // screen at the window's right edge. z-30 sits under the floating window
      // controls (z-[60]) and the launch splash (z-100), above page content.
      className="absolute right-0 top-full z-30 mt-2 w-80 border border-gold-4 shadow-2xl"
      style={{ backgroundColor: "var(--color-blue-7)" }}
    >
      {/* Header — title + "Mark all as read" */}
      <div className="flex items-center justify-between border-b border-gold-5 px-3 py-2">
        <h2 className="font-display text-sm uppercase tracking-[0.15em] text-gold-1">
          Updates
        </h2>
        {onMarkAllRead && hasUnread && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="cursor-pointer font-body text-[11px] uppercase tracking-wide text-grey-1 transition-colors duration-150 hover:text-gold-1"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification list — scrolls if long. Empty state when no rows. */}
      {notifications.length > 0 ? (
        <ul className="max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <NotificationRow
              key={n.id}
              notification={n}
              onItemClick={onItemClick}
              onDismiss={onDismiss}
            />
          ))}
        </ul>
      ) : (
        <p className="px-3 py-6 text-center font-body text-xs text-grey-2">
          You&apos;re all caught up.
        </p>
      )}
    </div>
  );
}
