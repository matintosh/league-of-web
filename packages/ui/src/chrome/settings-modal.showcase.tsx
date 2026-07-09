import type { ShowcaseEntry } from "../showcase";
import {
  SettingsModalDemo,
  SettingsModalStaticDemo,
  SettingsModalSoundDemo,
  SettingsModalDeveloperDemo,
} from "./settings-modal.demo";

export const settingsModalShowcase: ShowcaseEntry = {
  slug: "settings-modal",
  name: "Settings Modal",
  area: "chrome",
  description:
    "The LoL client settings dialog — wide hextech panel with a vertical section nav on the left and a scrollable content area on the right. Includes a Developer section that links to the Component Showcase.",
  variants: [
    {
      name: "Interactive (trigger)",
      notes: "Click 'Open Settings' to open the modal. Section nav is keyboard-operable.",
      render: () => <SettingsModalDemo />,
    },
    {
      name: "Static — General section",
      notes: "Always-open snapshot contained in a relative wrapper so it doesn't overlay the page.",
      render: () => <SettingsModalStaticDemo />,
    },
    {
      name: "Static — Sound section",
      notes: "Sound section active; shows multiple SettingsRow + toggle controls.",
      render: () => <SettingsModalSoundDemo />,
    },
    {
      name: "Static — Developer section",
      notes: "Developer section: plain <a href='/showcase'> styled as a secondary button — no next/link, router-agnostic.",
      render: () => <SettingsModalDeveloperDemo />,
    },
  ],
};
