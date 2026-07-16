/**
 * Updates / notifications fixture data — dummy values for the current-era
 * Updates flyout (issue #396). The flyout opens from the nav-band Updates icon
 * and shows a compact, anchored list of recent notifications (patch notes,
 * esports, shop / event alerts).
 *
 * CONVENTION-BASED: no dedicated notifications-flyout reference screenshot
 * exists in docs/reference. The shape follows the real client's convention —
 * the Updates glyph opens a small anchored dropdown of dated notification rows
 * (each an icon + title + optional body + timestamp, with an unread marker) —
 * rendered in Hextech panel styling per house tokens.
 *
 * Fixture values only; never import in @low/ui components — the flyout takes its
 * data via props (a notification list). Pages/showcase supply these constants.
 */
import { championSquareUrl } from "./ddragon";

/**
 * Shape mirrors the @low/ui `UpdateNotification` data shape without importing
 * from @low/ui (fixtures never depend on ui). Kept as a local structural type so
 * the demo constants stay type-checked.
 */
interface DemoUpdateNotification {
  id: string;
  title: string;
  body?: string;
  timestampLabel: string;
  iconSrc?: string;
  unread?: boolean;
}

/**
 * Demo Updates flyout payload — five recent notifications, newest first, with
 * the top three unread. Icon tiles reuse DDragon champion art as stand-in
 * notification thumbnails (no dedicated notification-icon CDN in the clone).
 */
export const DEMO_UPDATES: DemoUpdateNotification[] = [
  {
    id: "patch-26-14",
    title: "Patch 26.14 is live",
    body: "Midseason balance pass — read the full patch notes.",
    timestampLabel: "2h ago",
    iconSrc: championSquareUrl("Ahri"),
    unread: true,
  },
  {
    id: "msi-groups",
    title: "MSI 2026 — Group Stage results",
    body: "Catch the highlights from this weekend's matches.",
    timestampLabel: "5h ago",
    iconSrc: championSquareUrl("Jinx"),
    unread: true,
  },
  {
    id: "your-shop-live",
    title: "Your Shop is open",
    body: "Personalized skin offers, up to 60% off. Ends Oct 30.",
    timestampLabel: "1d ago",
    iconSrc: championSquareUrl("Vi"),
    unread: true,
  },
  {
    id: "void-awakening",
    title: "Void Awakening event now live",
    body: "New missions and rewards available through the event.",
    timestampLabel: "3d ago",
    iconSrc: championSquareUrl("Khazix"),
  },
  {
    id: "clash-weekend",
    title: "Clash — Demacian Cup this weekend",
    timestampLabel: "5d ago",
    iconSrc: championSquareUrl("Garen"),
  },
];
