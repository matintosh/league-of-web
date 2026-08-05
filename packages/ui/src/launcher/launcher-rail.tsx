"use client";

/**
 * LauncherRail — 56px-wide vertical icon rail for the /launcher section.
 *
 * Renders a stack of game/utility icon slots. "top" items stack from the top;
 * "bottom" items pin to the bottom via a flex spacer. Each slot is 56×56px.
 *
 * Active slot: 3px left-edge accent bar (`--color-launcher-rail-active` gold-3)
 * + subtle panel-bg tint. Hover: panel-bg tint, no accent bar.
 * Default: icon at 60% opacity, no background.
 *
 * Props are generic — the page supplies real game logo assets (URL strings or
 * ReactNode). No data fetching; no hardcoded hex outside packages/tokens.
 */

import { useId } from "react";
import type { ReactNode } from "react";

export interface LauncherRailItem {
  /** Unique key, e.g. "lol" | "tft" | "valorant" | "home". */
  id: string;
  /** Tooltip label, e.g. "League of Legends". */
  label: string;
  /** Resolved image URL (supplied by page) or a ReactNode icon. */
  icon: ReactNode;
  /** Position in the rail. "top" items stack from top; "bottom" items pin to bottom. */
  position?: "top" | "bottom";
}

export interface LauncherRailProps {
  /** Ordered list of rail items. "bottom" items are pinned to the bottom. */
  items: LauncherRailItem[];
  /** id of the currently active item. */
  activeId?: string;
  /** Called when user clicks a rail item. */
  onSelect?: (id: string) => void;
}

/** Individual rail slot — renders a single icon with active/hover states. */
function RailSlot({
  item,
  isActive,
  onSelect,
  accentBarId,
}: {
  item: LauncherRailItem;
  isActive: boolean;
  onSelect?: (id: string) => void;
  accentBarId: string;
}) {
  return (
    <button
      type="button"
      title={item.label}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      onClick={() => onSelect?.(item.id)}
      style={{
        position: "relative",
        width: 56,
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background: isActive ? "var(--color-launcher-panel-bg)" : "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        // CSS custom property trick: override on :hover via className below
      }}
      className="launcher-rail-slot group"
    >
      {/* 3px left-edge active accent bar */}
      {isActive && (
        <span
          id={accentBarId}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 3,
            height: "100%",
            backgroundColor: "var(--color-launcher-rail-active)",
            borderRadius: "0 2px 2px 0",
          }}
        />
      )}

      {/* Icon wrapper */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          opacity: isActive ? 1 : 0.6,
          transition: "opacity 150ms ease",
          borderRadius: 6,
          overflow: "hidden",
          flexShrink: 0,
        }}
        className="launcher-rail-icon"
      >
        {typeof item.icon === "string" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.icon}
            alt={item.label}
            width={36}
            height={36}
            style={{ objectFit: "contain", width: 36, height: 36 }}
          />
        ) : (
          item.icon
        )}
      </span>
    </button>
  );
}

/**
 * LauncherRail — full-height 56px icon strip.
 *
 * Hover opacity is handled by a scoped `<style>` block — established pattern
 * in this codebase for CSS-variable-based hover states (see merch-header.tsx).
 */
export function LauncherRail({ items, activeId, onSelect }: LauncherRailProps) {
  const uid = useId();

  const topItems = items.filter((i) => (i.position ?? "top") === "top");
  const bottomItems = items.filter((i) => i.position === "bottom");

  return (
    <>
      {/*
       * Hover styles: scoped <style> block so CSS-variable-based hover states
       * work without raw Tailwind palette classes. Class names are generic but
       * the styles only apply within .launcher-rail-slot/.launcher-rail-icon
       * which are unique to this component.
       */}
      <style>{`
        .launcher-rail-slot:hover {
          background-color: var(--color-launcher-panel-bg) !important;
        }
        .launcher-rail-slot:hover .launcher-rail-icon {
          opacity: 1 !important;
        }
      `}</style>

      <div
        role="navigation"
        aria-label="Game launcher nav"
        style={{
          display: "flex",
          flexDirection: "column",
          width: 56,
          height: "100%",
          backgroundColor: "var(--color-launcher-rail-bg)",
        }}
      >
        {/* Top items */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {topItems.map((item) => (
            <RailSlot
              key={item.id}
              item={item}
              isActive={item.id === activeId}
              onSelect={onSelect}
              accentBarId={`${uid}-accent-${item.id}`}
            />
          ))}
        </div>

        {/* Spacer — pushes bottom items to the bottom */}
        <div style={{ flex: 1 }} aria-hidden="true" />

        {/* Bottom items */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {bottomItems.map((item) => (
            <RailSlot
              key={item.id}
              item={item}
              isActive={item.id === activeId}
              onSelect={onSelect}
              accentBarId={`${uid}-accent-${item.id}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
