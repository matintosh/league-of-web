"use client";

import { SettingsRow } from "./settings-row";
import { HextechToggle } from "./hextech-toggle";
import { HextechButton } from "./hextech-button";

/** Demo: SettingsRow with a toggle control. */
export function SettingsRowWithToggleDemo() {
  return (
    <div className="w-full max-w-lg bg-blue-7 border border-gold-5 px-6 py-2">
      <SettingsRow label="Sound Effects" description="Play in-client sound effects.">
        <HextechToggle checked={true} onChange={() => {}} label="Sound effects" />
      </SettingsRow>
    </div>
  );
}

/** Demo: SettingsRow with a button control. */
export function SettingsRowWithButtonDemo() {
  return (
    <div className="w-full max-w-lg bg-blue-7 border border-gold-5 px-6 py-2">
      <SettingsRow label="Component Showcase" description="Browse all UI components.">
        <HextechButton variant="secondary" onClick={() => {}}>
          Open
        </HextechButton>
      </SettingsRow>
    </div>
  );
}

/** Demo: SettingsRow with no description. */
export function SettingsRowNoDescriptionDemo() {
  return (
    <div className="w-full max-w-lg bg-blue-7 border border-gold-5 px-6 py-2">
      <SettingsRow label="Reduce Motion">
        <HextechToggle checked={false} onChange={() => {}} label="Reduce motion" />
      </SettingsRow>
    </div>
  );
}

/** Demo: Multiple SettingsRows stacked. */
export function SettingsRowMultipleDemo() {
  return (
    <div className="w-full max-w-lg bg-blue-7 border border-gold-5 px-6 py-2">
      <SettingsRow label="Sound Effects" description="In-client sound effects.">
        <HextechToggle checked={true} onChange={() => {}} label="Sound effects" />
      </SettingsRow>
      <SettingsRow label="Music" description="Background ambient music.">
        <HextechToggle checked={false} onChange={() => {}} label="Music" />
      </SettingsRow>
      <SettingsRow label="Reduce Motion" description="Disables non-essential animations.">
        <HextechToggle checked={false} onChange={() => {}} label="Reduce motion" />
      </SettingsRow>
    </div>
  );
}

/** Demo: Long label truncation. */
export function SettingsRowLongLabelDemo() {
  return (
    <div className="w-64 bg-blue-7 border border-gold-5 px-6 py-2">
      <SettingsRow
        label="Enable Automatic Background Download of Patch Updates"
        description="Downloads patches in the background so you're ready to play sooner."
      >
        <HextechToggle checked={true} onChange={() => {}} label="Auto patch download" />
      </SettingsRow>
    </div>
  );
}
