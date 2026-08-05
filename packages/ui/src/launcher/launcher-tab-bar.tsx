"use client";

/**
 * LauncherTabBar — horizontal tab bar for the /launcher section.
 *
 * Renders Overview / Patch Notes / Esports / Merch tabs (or any tabs[] prop).
 * Active tab: text brightens to `--color-launcher-text-primary`; a 2px gold
 * underline (`--color-launcher-tab-active`) spans the label width.
 * Hover: text brightens, no underline.
 * Default: muted text (`--color-launcher-text-muted`), no decoration.
 *
 * Typography: uppercase, font-display ~13px, medium weight.
 * Layout: ~40px tall, full center-column width. First tab padded 16px from left,
 * 24px gap between tabs.
 *
 * No data fetching. No hardcoded hex. Server-safe.
 */

export interface LauncherTab {
  /** Route-unique identifier, e.g. "overview" | "patch-notes" | "esports" | "merch". */
  id: string;
  /** Display label. Rendered uppercase via CSS. */
  label: string;
}

export interface LauncherTabBarProps {
  /** Ordered tab definitions. */
  tabs: LauncherTab[];
  /** id of the currently active tab. */
  activeId?: string;
  /** Called when the user clicks a tab. */
  onTabChange?: (id: string) => void;
}

export function LauncherTabBar({ tabs, activeId, onTabChange }: LauncherTabBarProps) {
  return (
    <>
      <style>{`
        .launcher-tab-btn:hover {
          color: var(--color-launcher-text-primary) !important;
        }
      `}</style>

      <nav
        role="tablist"
        aria-label="Launcher sections"
        style={{
          display: "flex",
          alignItems: "stretch",
          height: 40,
          width: "100%",
          backgroundColor: "var(--color-launcher-content-bg)",
          paddingLeft: 16,
          gap: 24,
          flexShrink: 0,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange?.(tab.id)}
              className="launcher-tab-btn"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                height: "100%",
                padding: "0 2px",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                fontSize: 13,
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: isActive
                  ? "var(--color-launcher-text-primary)"
                  : "var(--color-launcher-text-muted)",
                whiteSpace: "nowrap",
                transition: "color 150ms ease",
              }}
            >
              {tab.label}

              {/* Active underline — 2px, spans label width, sits at the bottom edge */}
              {isActive && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    backgroundColor: "var(--color-launcher-tab-active)",
                    borderRadius: "1px 1px 0 0",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
