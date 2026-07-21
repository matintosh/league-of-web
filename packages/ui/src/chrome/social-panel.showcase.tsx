import type { ShowcaseEntry } from "../showcase";
import {
  SocialPanelAmbientDemo,
  SocialPanelEmptyGroupDemo,
  SocialPanelEmptyListDemo,
  SocialPanelFullReplicaDemo,
  SocialPanelInteractiveDemo,
  SocialPanelNoRequestsDemo,
} from "./social-panel.demo";

// ---------------------------------------------------------------------------
// Showcase — server-safe (no 'use client').
//
// All SocialPanel usages are wrapped in client demo components because
// SocialPanel accepts profileIconSrcFor: (s: Summoner) => string, which
// cannot cross the Next.js server→client serialization boundary as a raw prop.
// ---------------------------------------------------------------------------

export const socialPanelShowcase: ShowcaseEntry = {
  slug: "social-panel",
  name: "SocialPanel",
  area: "chrome",
  description:
    "Friends-list sidebar composition: SocialHeader → FriendRequestsRow (when requestCount > 0) → scrollable group sections (FriendGroupHeader + FriendRow list). Controlled collapse state. Current-era slim rail: 224px wide, near-black navy bg (color-mix blue-7/hextech-black), 48px friend rows, full height.",
  variants: [
    {
      name: "Full replica (2 groups, one collapsed, badge, mixed availability)",
      notes:
        'Closest to the real LoL client: "General" group expanded with 4 friends across in-game/in-queue/away/offline; "Work" group collapsed, showing derived (1/2) count. FriendRequestsRow shows a badge of 2. A 1px white/50% LEFT hairline (#535) divides the rail from the main content, matching the home rail\'s right border; border-box keeps the 224px width unchanged. data-shot="social-panel" on the wrapper.',
      render: () => <SocialPanelFullReplicaDemo />,
    },
    {
      name: "With ambient loop (socialpanel_bgloop)",
      notes:
        'ambientVideoSrc={socialPanelBgLoopUrl()} — the real client\'s animated Hextech backdrop, screen-blended subtly behind the friends list (opaque loop, low opacity). Additive over bg-blue-7; hidden under prefers-reduced-motion. data-shot="social-panel-ambient".',
      render: () => <SocialPanelAmbientDemo />,
    },
    {
      name: "Empty group",
      notes:
        "A group with zero friends. FriendGroupHeader shows (0/0) and no rows appear below it. Requests row hidden (no requestCount prop).",
      render: () => <SocialPanelEmptyGroupDemo />,
    },
    {
      name: "Empty list — poro empty state (#433)",
      notes:
        'groups={[]} with a poroSrcFor resolver supplied: the panel branches to SocialPanelEmptyState, showing the "?" poro and "Add a friend to get started" (the new-account state). Omit poroSrcFor and the scroll area stays empty (legacy behaviour). data-shot="social-panel-empty-list".',
      render: () => <SocialPanelEmptyListDemo />,
    },
    {
      name: "No requests (requestCount=0)",
      notes:
        "When requestCount is 0 or omitted, the FriendRequestsRow is hidden entirely — matching the real client behavior. One online friend shown.",
      render: () => <SocialPanelNoRequestsDemo />,
    },
    {
      name: "Interactive (collapse toggles + friend click log)",
      notes:
        "Click any group header to collapse/expand — rows appear/disappear and aria-expanded flips. Click a friend row to see their gameName logged below the panel.",
      render: () => <SocialPanelInteractiveDemo />,
    },
  ],
};
