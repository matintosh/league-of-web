"use client";

/**
 * MerchProductInfoTabs — tab strip + panel below the PDP purchase panel.
 *
 * MERCH COMPONENT — use the merch design system: --color-merch-* tokens.
 * This is NOT the Hextech client — IGNORE Hextech-only / no-default-palette
 * guidance; still tokens-only (no raw hex outside packages/tokens; NO hex
 * fallbacks in var(); NO bare hex like #ffffff — use --color-merch-on-dark),
 * presentational (props in/callbacks out; NO fetching in @low/ui), showcase
 * server-safe (no 'use client'), SVG ids from useId.
 *
 * Measured from merch.riotgames.com PDP (~1280px desktop):
 *   Right column width: 372px
 *   Tab list: 372px wide, 39px tall
 *   Tab item: 372px × 23px, font 16px / 600 / --color-merch-ink
 *   Active tab underline: 2px solid --color-merch-ink
 *   Inactive tab color: --color-merch-muted
 *   Panel: 16px / line-height normal / --color-merch-body / padding 0
 */

import React, { useId } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchProductInfoTab {
  /** Tab id, e.g. "description" | "shipping" | "returns". */
  id: string;
  /** Display label, e.g. "Description". */
  label: string;
  /** Rich content for the panel — ReactNode or dangerouslySetInnerHTML string. */
  content: React.ReactNode;
}

export interface MerchProductInfoTabsProps {
  /** Tab definitions — currently always ["Description"]; may grow to Shipping/Returns. */
  tabs: MerchProductInfoTab[];
  /** Currently selected tab id — controlled. Falls back to first tab if omitted. */
  selectedTab?: string;
  /** Called when user clicks a different tab. */
  onTabChange?: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchProductInfoTabs — renders a [role="tablist"] strip + [role="tabpanel"]
 * below the PDP purchase panel. Supports one or more tabs (Description /
 * Shipping / Returns). Active tab underline uses 2px solid --color-merch-ink.
 *
 * @example
 * <MerchProductInfoTabs
 *   tabs={[{ id: "description", label: "Description", content: <p>...</p> }]}
 *   selectedTab="description"
 *   onTabChange={(id) => setTab(id)}
 * />
 */
export function MerchProductInfoTabs({
  tabs,
  selectedTab,
  onTabChange,
}: MerchProductInfoTabsProps) {
  const uid = useId();
  const activeId = selectedTab ?? tabs[0]?.id;
  const activeTab = tabs.find((t) => t.id === activeId) ?? tabs[0];

  if (!tabs.length) return null;

  return (
    <div
      style={{
        width: "100%",
        fontFamily: "var(--font-merch)",
      }}
    >
      {/* Tab strip */}
      <ul
        role="tablist"
        aria-label="Product information"
        style={{
          display: "flex",
          margin: 0,
          padding: 0,
          listStyle: "none",
          borderBottom: "1px solid var(--color-merch-border)",
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <li key={tab.id} role="presentation" style={{ display: "flex" }}>
              <button
                role="tab"
                id={`${uid}-tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`${uid}-panel-${tab.id}`}
                type="button"
                onClick={() => {
                  if (!isActive) onTabChange?.(tab.id);
                }}
                style={{
                  height: 39,
                  padding: "0 0 2px",
                  marginRight: 24,
                  fontSize: 18,
                  fontWeight: 400,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid var(--color-merch-ink-dark)"
                    : "2px solid transparent",
                  color: isActive
                    ? "var(--color-merch-ink-dark)"
                    : "var(--color-merch-muted)",
                  transition: "color 120ms ease, border-color 120ms ease",
                  outline: "none",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--color-merch-ink)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--color-merch-muted)";
                  }
                }}
              >
                {tab.label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Tab panel */}
      {activeTab && (
        <div
          role="tabpanel"
          id={`${uid}-panel-${activeTab.id}`}
          aria-labelledby={`${uid}-tab-${activeTab.id}`}
          style={{
            paddingTop: 16,
            fontSize: 16,
            lineHeight: 1.6,
            color: "var(--color-merch-ink-dark)",
          }}
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
