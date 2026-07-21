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

function BugIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
      {/* Beetle body */}
      <path d="M9 4.5c2 0 3.5 1.7 3.5 4.2S11 13 9 13s-3.5-1.8-3.5-4.3S7 4.5 9 4.5Z" />
      {/* Head + antennae */}
      <path d="M9 4.5V3.2m-1.4-.9 1.4 1 1.4-1" />
      {/* Center seam */}
      <path d="M9 5.5v6.5" />
      {/* Legs */}
      <path d="M5.6 6.5 3.5 5.3M5.3 9H3M5.6 11.4l-2.1 1.2M12.4 6.5l2.1-1.2M12.7 9H15m-2.6 2.4 2.1 1.2" />
    </svg>
  );
}

const REPLICA_BUTTONS = [
  { id: "chat", icon: <ChatIcon />, label: "Chat", badge: 3 },
  { id: "party", icon: <MultiChatIcon />, label: "Party", badge: 31 },
  { id: "mic", icon: <MicIcon />, label: "Toggle microphone" },
  // Far-right debug/bug control — framed in its own gold cell (#535).
  { id: "debug", icon: <BugIcon />, label: "Report a bug", boxed: true },
];

export const socialDockShowcase: ShowcaseEntry = {
  slug: "social-dock",
  name: "SocialDock",
  area: "chrome",
  description:
    "Bottom toolbar of the social rail — a flush LEFT group of caller-supplied glyphs separated by faint white/40 hairline dividers (no per-glyph box), an optional static client-clock readout (xs grey-2), then any `boxed` button in its own gold-outlined cell at the far right. Dark bg-hextech-black band. Glyphs gold-2 at rest, gold-1 on hover; optional gold count badge centred above the glyph.",
  variants: [
    {
      name: "Current-era replica (flush left group, clock, boxed bug)",
      notes:
        "Matches the current-era reference (ref23.png) bottom dock: chat (badge '3'), party (badge '31'), microphone — flush in the left group with faint hairline dividers — then the client clock '26.14', then the debug/bug control (`boxed: true`) in its own gold-outlined cell at the far right. Glyphs render gold-2 at rest (#515); hover to see the gold-2 → gold-1 transition (and border-gold-5 → gold-4 on the boxed bug cell).",
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
        "When `clockLabel` is omitted the clock node is not rendered — the flush left group and the trailing boxed bug cell close up, the boxed cell staying pinned to the far right.",
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
