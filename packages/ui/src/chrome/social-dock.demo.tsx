"use client";

import { useState } from "react";
import { SocialDock } from "./social-dock";

/** Chat bubble icon — 18×18, stroke currentColor */
function ChatIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M15 2H3a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h3l3 3 3-3h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
    </svg>
  );
}

/** Multi-chat / speech-bubbles icon — 18×18, stroke currentColor */
function MultiChatIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M12 2H3a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2l2 2 2-2h3a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z" />
      <path d="M15 6h1a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-2l-2 2-1.5-1.5" />
    </svg>
  );
}

/** Microphone / voice-toggle icon — 18×18, stroke currentColor */
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

/** Debug / bug-report beetle icon — 18×18, stroke currentColor */
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

const DEMO_BUTTONS = [
  { id: "chat", icon: <ChatIcon />, label: "Chat", badge: 3 },
  { id: "party", icon: <MultiChatIcon />, label: "Party", badge: 31 },
  { id: "mic", icon: <MicIcon />, label: "Toggle microphone" },
  { id: "debug", icon: <BugIcon />, label: "Report a bug", boxed: true },
];

/**
 * Interactive demo — click any button to see its id logged below.
 */
export function SocialDockActionLogDemo() {
  const [last, setLast] = useState<string | null>(null);

  return (
    <div className="w-64 bg-blue-7">
      <SocialDock
        buttons={DEMO_BUTTONS}
        clockLabel="26.14"
        onAction={setLast}
      />
      {last !== null && (
        <p className="px-3 py-1 font-body text-xs text-grey-1">
          Last action: <span className="text-gold-2">{last}</span>
        </p>
      )}
    </div>
  );
}
