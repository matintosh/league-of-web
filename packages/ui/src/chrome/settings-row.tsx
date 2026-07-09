import type { ReactNode } from "react";

export interface SettingsRowProps {
  /** Primary label text — displayed in gold body font. */
  label: string;
  /** Optional secondary description below the label. */
  description?: string;
  /**
   * Right-aligned control slot — typically a HextechToggle, HextechButton, etc.
   * The row is purely presentational; the control manages its own state externally.
   */
  children: ReactNode;
}

/**
 * SettingsRow is a single row in the settings panel.
 *
 * Lays out: [label + optional description] [right-aligned control]
 * Rows are separated by a bottom border except for the last item (apply
 * `last:border-b-0` via the parent or use the `last` variant directly;
 * the row itself renders `border-b border-grey-4` unconditionally — the
 * parent settings content area should strip the last border via CSS).
 *
 * Purely presentational — no internal state, no handlers.
 */
export function SettingsRow({ label, description, children }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-grey-4 py-3 last:border-b-0">
      {/* Label + description */}
      <div className="min-w-0 flex-1">
        <span className="block truncate font-body text-sm text-gold-1">{label}</span>
        {description && (
          <span className="block truncate text-xs text-grey-1">{description}</span>
        )}
      </div>

      {/* Control */}
      <div className="shrink-0">{children}</div>
    </div>
  );
}
