"use client";

import { useState } from "react";
import { HextechToggle } from "./hextech-toggle";
import { HextechButton } from "./hextech-button";
import { SettingsRow } from "./settings-row";
import { SettingsModal } from "./settings-modal";
import type { SettingsSection } from "./settings-modal";

/** Builds the three demo sections used across showcase demos. */
function useDemoSections(): SettingsSection[] {
  const [sounds, setSounds] = useState(true);
  const [music, setMusic] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sfxVolume, setSfxVolume] = useState(true);

  return [
    {
      id: "general",
      label: "General",
      content: (
        <div>
          <SettingsRow
            label="Reduce Motion"
            description="Disables non-essential animations throughout the client."
          >
            <HextechToggle
              checked={reducedMotion}
              onChange={setReducedMotion}
              label="Reduce motion"
            />
          </SettingsRow>
          <SettingsRow
            label="Show Notifications"
            description="Display friend and system notifications."
          >
            <HextechToggle
              checked={notifications}
              onChange={setNotifications}
              label="Show notifications"
            />
          </SettingsRow>
        </div>
      ),
    },
    {
      id: "sound",
      label: "Sound",
      content: (
        <div>
          <SettingsRow label="Sound Effects" description="In-client sound effects.">
            <HextechToggle
              checked={sounds}
              onChange={setSounds}
              label="Sound effects"
            />
          </SettingsRow>
          <SettingsRow label="Music" description="Background ambient music.">
            <HextechToggle checked={music} onChange={setMusic} label="Music" />
          </SettingsRow>
          <SettingsRow
            label="SFX Volume"
            description="Master volume for sound effects."
          >
            <HextechToggle
              checked={sfxVolume}
              onChange={setSfxVolume}
              label="SFX volume"
            />
          </SettingsRow>
        </div>
      ),
    },
    {
      id: "developer",
      label: "Developer",
      content: (
        <div>
          <SettingsRow
            label="Component Showcase"
            description="Browse all UI components built for this project."
          >
            <a
              href="/showcase"
              className="inline-flex cursor-pointer items-center justify-center border border-grey-3 bg-transparent px-8 py-2.5 font-display text-sm uppercase tracking-widest text-grey-1 transition-all duration-150 hover:border-gold-4 hover:text-gold-1"
            >
              Open Showcase
            </a>
          </SettingsRow>
        </div>
      ),
    },
  ];
}

/** Interactive demo — trigger button opens the modal; section switching works. */
export function SettingsModalDemo() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("general");
  const sections = useDemoSections();

  return (
    <div className="flex items-center justify-center p-8">
      <HextechButton onClick={() => setOpen(true)}>Open Settings</HextechButton>
      <SettingsModal
        open={open}
        onClose={() => setOpen(false)}
        sections={sections}
        activeSectionId={activeSection}
        onSelectSection={setActiveSection}
      />
    </div>
  );
}

/** Static always-open demo — contained so it doesn't cover the showcase page. */
export function SettingsModalStaticDemo() {
  const [activeSection, setActiveSection] = useState("general");
  const sections = useDemoSections();

  return (
    <div className="relative overflow-hidden [transform:translateZ(0)] h-[520px] w-full">
      <SettingsModal
        open={true}
        onClose={() => {}}
        sections={sections}
        activeSectionId={activeSection}
        onSelectSection={setActiveSection}
      />
    </div>
  );
}

/** Static demo with Sound section active. */
export function SettingsModalSoundDemo() {
  const [activeSection, setActiveSection] = useState("sound");
  const sections = useDemoSections();

  return (
    <div className="relative overflow-hidden [transform:translateZ(0)] h-[520px] w-full">
      <SettingsModal
        open={true}
        onClose={() => {}}
        sections={sections}
        activeSectionId={activeSection}
        onSelectSection={setActiveSection}
      />
    </div>
  );
}

/** Static demo with Developer section active (showcase link visible). */
export function SettingsModalDeveloperDemo() {
  const [activeSection, setActiveSection] = useState("developer");
  const sections = useDemoSections();

  return (
    <div className="relative overflow-hidden [transform:translateZ(0)] h-[520px] w-full">
      <SettingsModal
        open={true}
        onClose={() => {}}
        sections={sections}
        activeSectionId={activeSection}
        onSelectSection={setActiveSection}
      />
    </div>
  );
}
