import type { ShowcaseEntry } from "../showcase";
import {
  UpdatesFlyoutDemo,
  UpdatesFlyoutStaticDemo,
  UpdatesFlyoutEmptyDemo,
} from "./updates-flyout.demo";

export const updatesFlyoutShowcase: ShowcaseEntry = {
  slug: "updates-flyout",
  name: "Updates Flyout",
  area: "chrome",
  description:
    "The current-era Updates / notifications surface, opened from the nav-band Updates icon. A compact anchored dropdown (right-aligned below the icon): a header with a 'Mark all as read' action, then a scrollable list of dated notification rows (unread gold marker, optional thumbnail, title + body + timestamp, hover ✕ dismiss). CONVENTION-BASED — no dedicated reference screenshot exists; styling follows house Hextech tokens and the real client's anchored-dropdown convention.",
  referenceNote:
    "Convention-based build (no notifications-flyout reference in docs/reference). The real client's Updates glyph opens a small anchored dropdown of patch-note / esports / shop notifications; this reproduces that convention in Hextech panel styling.",
  variants: [
    {
      name: "Interactive (trigger)",
      notes:
        "Click 'Updates' to toggle the flyout. Row click marks that item read (dot clears); hover a row for the ✕ dismiss; 'Mark all as read' clears every unread flag.",
      render: () => <UpdatesFlyoutDemo />,
    },
    {
      name: "Static — mixed unread/read",
      notes:
        "Always-open snapshot anchored right in a relative stage. Top three rows unread (gold dot + highlight), bottom two read.",
      render: () => <UpdatesFlyoutStaticDemo />,
    },
    {
      name: "Empty state",
      notes:
        "No notifications: 'You're all caught up.' message, and the 'Mark all as read' action is hidden (nothing unread).",
      render: () => <UpdatesFlyoutEmptyDemo />,
    },
  ],
};
