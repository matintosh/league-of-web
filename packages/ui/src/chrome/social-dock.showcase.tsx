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

function MicIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      {/* Capsule mic body */}
      <rect x="6.5" y="2" width="5" height="9" rx="2.5" />
      {/* Cradle arc */}
      <path d="M4 8a5 5 0 0 0 10 0" />
      {/* Stand */}
      <path d="M9 13v3M6.5 16h5" />
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
  { id: "chat", icon: <ChatIcon />, label: "Chat", badge: 3 },
  { id: "party", icon: <MultiChatIcon />, label: "Party", badge: 31 },
  { id: "mic", icon: <MicIcon />, label: "Toggle microphone" },
  { id: "settings", icon: <SettingsIcon />, label: "Social settings" },
];

export const socialDockShowcase: ShowcaseEntry = {
  slug: "social-dock",
  name: "SocialDock",
  area: "chrome",
  description:
    "Bottom toolbar of the social rail — icon buttons in gold-outlined cells (caller-supplied ReactNode icons) with optional gold count badge, plus an optional static client-clock readout (xs grey-2). Dark bg-hextech-black band.",
  variants: [
    {
      name: "Current-era replica (boxed cells, badges, clock)",
      notes:
        "Matches the current-era reference (client-current-home-2025-mf.png) bottom dock: chat (badge '3'), party (badge '31'), microphone, then the client clock '26.14', settings — each glyph in its own gold-outlined cell. Hover a cell to see the grey-1 → gold-1 / border-gold-4 transition.",
      render: () => (
        <div data-shot="social-dock" className="w-64">
          <SocialDock
            buttons={REPLICA_BUTTONS}
            clockLabel="26.14"
          />
        </div>
      ),
    },
    {
      name: "No clock",
      notes:
        "When `clockLabel` is omitted the clock node is not rendered at all — the boxed icon cells fill the left side of the band.",
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
