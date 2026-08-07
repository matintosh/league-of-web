"use client";

/**
 * MerchProductInfoTabs — info section below the PDP purchase panel.
 *
 * Supports two variants:
 *   - "accordion" (default): collapsible rows with chevron, top/bottom borders.
 *     Default state: COLLAPSED (closed). All rows closed unless selectedTab passed.
 *     Description header: 18px / 400 / --color-merch-ink-dark (real PDP measurement).
 *   - "static": static always-visible sections — no chevron, no toggle, no borders.
 *     Heading: 16px / 600 / --color-merch-ink-dark.
 *     Body padding: 0 0 32px (matches real merch PDP Description block).
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
 *   Accordion header: 372px × 39px, font 18px / 400 / --color-merch-ink-dark (re-measured round 4)
 *   Chevron: 16px SVG, right-aligned, rotates 180° when open
 *   Divider: 1px solid --color-merch-border above each row (full panel width)
 *   Panel body: 16px / line-height normal / --color-merch-ink-dark (#000) / padding 0 0 16px, clamped 3 lines
 *   Static Description heading: 16px / 600 / --color-merch-ink-dark, NO borders, NO chevron
 *   Static Description body: padding 0 0 32px
 */

import React, { useId, useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchProductInfoTab {
  /** Tab id, e.g. "description" | "shipping" | "returns". */
  id: string;
  /** Accordion row label, e.g. "Description". */
  label: string;
  /** Rich content for the panel — ReactNode. */
  content: React.ReactNode;
}

export interface MerchProductInfoTabsProps {
  /** Accordion row definitions — typically ["Description"]; may include Shipping/Returns. */
  tabs: MerchProductInfoTab[];
  /**
   * Rendering variant.
   *
   * - "accordion" (default): collapsible rows with chevron + borders. All collapsed by default.
   *   Header: 18px / 400 / --color-merch-ink-dark (real PDP round-4 measurement).
   *   Body: 16px / --color-merch-ink-dark (#000).
   * - "static": static always-open sections — no chevron, no toggle, no top/bottom borders.
   *   Heading is a visible h3 (16px/600); body padding 0 0 32px.
   */
  variant?: "accordion" | "static";
  /**
   * Initially expanded row id(s). Accordion is COLLAPSED by default — omit to
   * start all rows closed. Pass a tab id to pre-open one row.
   *
   * @deprecated Use `defaultOpenId` for the single open-on-mount scenario.
   * @see defaultOpenId
   */
  selectedTab?: string;
  /**
   * Called when user toggles a row open/closed.
   * `id` = the toggled row; `open` = whether it is now open.
   * Only fires in "accordion" variant.
   */
  onTabChange?: (id: string, open: boolean) => void;
}

// ---------------------------------------------------------------------------
// Chevron SVG
// ---------------------------------------------------------------------------

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{
        flexShrink: 0,
        transition: "transform 200ms ease",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        color: "var(--color-merch-ink-dark)",
      }}
    >
      <path
        d="M3 6l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * MerchProductInfoTabs — renders an info section below the PDP purchase panel.
 *
 * In "accordion" variant (default): each row has a 16px/600 header button that
 * toggles the content panel. All rows start COLLAPSED by default.
 * Pass `selectedTab` to pre-open a row on mount (e.g. for showcase demos).
 *
 * In "static" variant: each tab renders as a static always-visible section —
 * heading (16px/600) + body (always visible, padding 0 0 32px). No chevron,
 * no toggle, no top/bottom borders. Matches the real merch PDP Description block.
 *
 * @example
 * // Accordion (default):
 * <MerchProductInfoTabs
 *   tabs={[{ id: "description", label: "Description", content: <p>...</p> }]}
 * />
 *
 * // Static (always-open):
 * <MerchProductInfoTabs
 *   variant="static"
 *   tabs={[{ id: "description", label: "Description", content: <p>...</p> }]}
 * />
 */
export function MerchProductInfoTabs({
  tabs,
  variant = "accordion",
  selectedTab,
  onTabChange,
}: MerchProductInfoTabsProps) {
  const uid = useId();
  // Track which accordion rows are open. Seed from `selectedTab` if provided.
  const [openIds, setOpenIds] = useState<Set<string>>(
    () => new Set(selectedTab ? [selectedTab] : [])
  );

  if (!tabs.length) return null;

  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      const nowOpen = !next.has(id);
      if (nowOpen) {
        next.add(id);
      } else {
        next.delete(id);
      }
      onTabChange?.(id, nowOpen);
      return next;
    });
  }

  /* ── Static variant — always-open, no chevron, no borders ─────────────── */
  if (variant === "static") {
    return (
      <div
        style={{
          width: "100%",
          fontFamily: "var(--font-merch)",
        }}
      >
        {tabs.map((tab) => (
          <div key={tab.id}>
            {/* Static heading — 16px / 600 / --color-merch-ink-dark */}
            <h3
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "var(--color-merch-ink-dark)",
                margin: "0 0 12px",
                fontFamily: "inherit",
              }}
            >
              {tab.label}
            </h3>
            {/* Body — always visible, padding 0 0 32px per real PDP measurement */}
            <div
              style={{
                paddingBottom: 32,
                fontSize: 16,
                lineHeight: "normal",
                color: "var(--color-merch-body)",
              }}
            >
              {tab.content}
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ── Accordion variant (default) ─────────────────────────────────────── */
  return (
    <div
      style={{
        width: "100%",
        fontFamily: "var(--font-merch)",
        borderTop: "1px solid var(--color-merch-border)",
      }}
    >
      {tabs.map((tab) => {
        const isOpen = openIds.has(tab.id);
        const headerId = `${uid}-hdr-${tab.id}`;
        const panelId = `${uid}-pnl-${tab.id}`;

        return (
          <div
            key={tab.id}
            style={{ borderBottom: "1px solid var(--color-merch-border)" }}
          >
            {/* Accordion header button — 39px tall, 18px/400 (re-measured round 4 from real PDP) */}
            <button
              type="button"
              id={headerId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                minHeight: 39,
                padding: "8px 0",
                /* Real PDP round-4 measurement: Description header 18px / 400 / lh 22.5 */
                fontSize: 18,
                fontWeight: 400,
                lineHeight: "22.5px",
                fontFamily: "inherit",
                color: "var(--color-merch-ink-dark)",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                outline: "none",
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline =
                  "2px solid var(--color-merch-ink-dark)";
                (e.currentTarget as HTMLButtonElement).style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                (e.currentTarget as HTMLButtonElement).style.outline = "none";
              }}
            >
              <span>{tab.label}</span>
              <Chevron open={isOpen} />
            </button>

            {/* Accordion panel — hidden when collapsed; body #000 per real PDP */}
            <div
              role="region"
              id={panelId}
              aria-labelledby={headerId}
              hidden={!isOpen}
              style={{
                paddingBottom: 16,
                fontSize: 16,
                lineHeight: "normal",
                /* Real PDP: body color rgb(0,0,0) = --color-merch-ink-dark (not #333 body) */
                color: "var(--color-merch-ink-dark)",
              }}
            >
              {tab.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
