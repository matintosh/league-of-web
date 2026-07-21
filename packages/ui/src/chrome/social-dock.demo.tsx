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

/** Settings gear icon — 18×18, stroke currentColor */
function SettingsIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.25">
      <circle cx="9" cy="9" r="2.5" />
      <path d="M9 1.5v1.8M9 14.7v1.8M1.5 9h1.8M14.7 9h1.8M3.6 3.6l1.27 1.27M13.13 13.13l1.27 1.27M14.4 3.6l-1.27 1.27M4.87 13.13l-1.27 1.27" strokeLinecap="round" />
    </svg>
  );
}

const DEMO_BUTTONS = [
  { id: "chat", icon: <ChatIcon />, label: "Chat", badge: 3 },
  { id: "party", icon: <MultiChatIcon />, label: "Party", badge: 31 },
  { id: "mic", icon: <MicIcon />, label: "Toggle microphone" },
  { id: "settings", icon: <SettingsIcon />, label: "Social settings" },
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
