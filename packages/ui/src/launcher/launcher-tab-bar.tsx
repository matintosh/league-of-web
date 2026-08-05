"use client";

/**
 * LauncherTabBar — floating translucent pill tab bar for the /launcher section.
 *
 * Renders Overview / Patch Notes / Esports / Merch tabs (or any tabs[] prop)
 * as a self-sized rounded pill overlaid on the hero (positioned by the parent).
 *
 * Active tab:   lighter grey rounded chip behind the label + 2px gold underline
 *               sized to the label/chip width.
 * Hover:        text brightens to `--color-launcher-text-primary`; no underline.
 * Default:      muted text (`--color-launcher-text-muted`); no decoration.
 * Badge:        optional red notification dot (`showBadge: true` on a tab def).
 *
 * Typography: Title Case (labels rendered as-is), font-display ~13px, medium weight.
 * Layout:    self-sized (not full-width); ~40px tall; rounded pill; translucent bg.
 *
 * No data fetching. No hardcoded hex. Server-safe.
 */

export interface LauncherTab {
  /** Route-unique identifier, e.g. "overview" | "patch-notes" | "esports" | "merch". */
  id: string;
  /** Display label — rendered as-is (Title Case). */
  label: string;
  /** When true, a small red notification dot is shown in the top-right of the label. */
  showBadge?: boolean;
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
        .launcher-tab-btn:hover .launcher-tab-label {
          color: var(--color-launcher-text-primary) !important;
        }
      `}</style>

      <nav
        role="tablist"
        aria-label="Launcher sections"
        style={{
          display: "inline-flex",
          alignItems: "center",
          height: 40,
          padding: "0 4px",
          gap: 2,
          borderRadius: 20,
          /* Translucent dark pill — color-mix over the surface token */
          backgroundColor: "color-mix(in srgb, var(--color-launcher-surface) 70%, transparent)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
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
                justifyContent: "center",
                height: 32,
                padding: "0 12px",
                background: isActive
                  ? "color-mix(in srgb, var(--color-launcher-surface) 90%, var(--color-launcher-text-primary) 10%)"
                  : "none",
                border: "none",
                borderRadius: 16,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {/* Label text */}
              <span
                className="launcher-tab-label"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 13,
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  color: isActive
                    ? "var(--color-launcher-text-primary)"
                    : "var(--color-launcher-text-muted)",
                  transition: "color 150ms ease",
                  position: "relative",
                }}
              >
                {tab.label}

                {/* Notification dot — top-right of the label text */}
                {tab.showBadge && (
                  <span
                    aria-label="New"
                    style={{
                      position: "absolute",
                      top: -3,
                      right: -6,
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      backgroundColor: "var(--color-launcher-red)",
                      display: "block",
                    }}
                  />
                )}
              </span>

              {/* Active gold underline — sits at the bottom of the chip, sized to label width */}
              {isActive && (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    bottom: 4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "calc(100% - 24px)",
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
