import type { ShowcaseEntry } from "../showcase";
import { SocialDock } from "./social-dock";
import { SocialDockActionLogDemo } from "./social-dock.demo";

// ---------------------------------------------------------------------------
// Sample inline SVG icons — fixture values supplied here, not in the component.
// ---------------------------------------------------------------------------

function ChatIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M15 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3l3 3 3-3h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
    </svg>
  );
}

function MultiChatIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M12 2H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2l2 2 2-2h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
      <path d="M15 6h1a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-2l-2 2-1.5-1.5" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M9 2v10M5 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 15h12" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.25">
      <circle cx="9" cy="9" r="2.5" />
      <path d="M9 1.5v1.8M9 14.7v1.8M1.5 9h1.8M14.7 9h1.8M3.6 3.6l1.27 1.27M13.13 13.13l1.27 1.27M14.4 3.6l-1.27 1.27M4.87 13.13l-1.27 1.27" strokeLinecap="round" />
    </svg>
  );
}

const REPLICA_BUTTONS = [
  { id: "chat", icon: <ChatIcon />, label: "Chat" },
  { id: "multi-chat", icon: <MultiChatIcon />, label: "Multi-chat", badge: 2 },
  { id: "download", icon: <DownloadIcon />, label: "Download" },
  { id: "settings", icon: <SettingsIcon />, label: "Settings" },
];

export const socialDockShowcase: ShowcaseEntry = {
  slug: "social-dock",
  name: "SocialDock",
  area: "chrome",
  description:
    "Bottom toolbar of the social rail — icon buttons (caller-supplied ReactNode icons) with optional gold count badge, plus optional version string (xs grey-2). Dark bg-hextech-black band.",
  variants: [
    {
      name: "Default replica (4 buttons, badge, version)",
      notes:
        "Matches the LoL client bottom dock: chat, multi-chat with badge '2', download, settings, and 'V9.14' version text. Hover buttons to see grey-1 → gold-1 colour transition.",
      render: () => (
        <div data-shot="social-dock" className="w-64">
          <SocialDock
            buttons={REPLICA_BUTTONS}
            version="V9.14"
          />
        </div>
      ),
    },
    {
      name: "No version",
      notes:
        "When `version` is omitted the version node is not rendered at all — the buttons fill the left side of the band.",
      render: () => (
        <div className="w-64">
          <SocialDock buttons={REPLICA_BUTTONS} />
        </div>
      ),
    },
    {
      name: "Interactive (logs action ids)",
      notes:
        "Click any button — the last fired id is displayed below. Demonstrates onAction callback wiring.",
      render: () => <SocialDockActionLogDemo />,
    },
  ],
};
