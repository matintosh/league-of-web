"use client";

import type { ReactNode } from "react";

export interface SettingsSection {
  /** Unique identifier used for selection and aria-controls. */
  id: string;
  /** Display label rendered in the left nav. */
  label: string;
  /** Content rendered in the right scrollable panel when this section is active. */
  content: ReactNode;
}

export interface SettingsModalProps {
  /** Whether the modal is visible. When false, renders nothing. */
  open: boolean;
  /** Called when the user clicks the backdrop or the ✕ button. */
  onClose: () => void;
  /** Ordered list of settings sections. */
  sections: SettingsSection[];
  /** ID of the currently active section. */
  activeSectionId: string;
  /** Called when the user clicks a section nav item; receives the section id. */
  onSelectSection: (id: string) => void;
}

/**
 * SettingsModal is the full-width settings dialog from the LoL client.
 *
 * Composed of:
 * - Dark backdrop (click-to-close)
 * - Hextech panel: title bar + [left section nav | scrollable content area]
 * - Left nav uses the transparent-border active-state trick (vertical variant
 *   of TabBar's bottom-border approach) for layout stability.
 *
 * Fully controlled — no internal state.
 */
export function SettingsModal({
  open,
  onClose,
  sections,
  activeSectionId,
  onSelectSection,
}: SettingsModalProps) {
  if (!open) return null;

  const activeSection = sections.find((s) => s.id === activeSectionId) ?? sections[0];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 bg-hextech-black/70"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] max-w-[90vw] bg-blue-7 border border-gold-4 ring-1 ring-gold-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title bar */}
        <div className="bg-blue-6 border-b border-gold-5 px-6 py-3 flex items-center justify-between">
          <span className="font-display uppercase text-sm tracking-widest text-gold-1">
            Settings
          </span>
          <button
            type="button"
            aria-label="Close settings"
            onClick={onClose}
            className="text-grey-1 hover:text-gold-1 transition-colors duration-150 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body: left nav + content */}
        <div className="flex h-[440px]">
          {/* Left section nav */}
          <nav
            aria-label="Settings sections"
            className="w-44 shrink-0 bg-blue-7 border-r border-gold-5 overflow-y-auto py-2"
          >
            {sections.map((section) => {
              const isActive = section.id === activeSectionId;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => onSelectSection(section.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={[
                    "w-full text-left px-4 py-2.5 cursor-pointer",
                    "font-display uppercase text-xs tracking-widest",
                    "border-l-2 transition-colors duration-150",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
                    isActive
                      ? "border-gold-3 text-gold-1 bg-blue-6/50"
                      : "border-transparent text-grey-1 hover:text-gold-1 hover:bg-blue-6/30",
                  ].join(" ")}
                >
                  {section.label}
                </button>
              );
            })}
          </nav>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeSection?.content}
          </div>
        </div>
      </div>
    </div>
  );
}
