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

/** Download / arrow-down icon — 18×18, stroke currentColor */
function DownloadIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.25">
      <path d="M9 2v10M5 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 15h12" strokeLinecap="round" />
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
  { id: "chat", icon: <ChatIcon />, label: "Chat" },
  { id: "multi-chat", icon: <MultiChatIcon />, label: "Multi-chat", badge: 2 },
  { id: "download", icon: <DownloadIcon />, label: "Download" },
  { id: "settings", icon: <SettingsIcon />, label: "Settings" },
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
        version="V9.14"
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
