"use client";

/**
 * LauncherRail — 64px-wide vertical icon rail for the /launcher section.
 *
 * Renders a stack of game/utility icon slots. "top" items stack from the top;
 * "bottom" items pin to the bottom via a flex spacer. Each slot is 64×56px.
 *
 * Active slot treatment (per ref, issue #744):
 *   - LoL entry (id="lol"): ornate parchment-gold banner tile — warm gold bg, gold border
 *     lines and left accent bar, icon in gold tint. This is the LoL BRAND tile, not a
 *     generic active indicator.
 *   - All other active items (home, games, etc.): neutral translucent dark rounded-square
 *     (~rgb(58,58,62)) behind a white glyph — matches the ref's generic nav active state.
 * Inactive hover: panel-bg tint, no accent bar.
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
  /**
   * Override slot height in px. Defaults to 56 for standard items.
   * Use for the "riot" brand fist slot which is ~130px tall in the ref
   * (ref image ÷1.2: icon in upper portion, large dark gap before Home).
   */
  height?: number;
}

export interface LauncherRailProps {
  /** Ordered list of rail items. "bottom" items are pinned to the bottom. */
  items: LauncherRailItem[];
  /** id of the currently active item. */
  activeId?: string;
  /** Called when user clicks a rail item. */
  onSelect?: (id: string) => void;
}

/**
 * ActiveBannerSlot — ornate gold banner tile for the active game slot.
 *
 * Full-width parchment-gold tile with the icon scaled to 36×36 and centred.
 * Matches the ref's "ornate banner" treatment: warm amber/gold bg, subtle
 * top and bottom border lines.
 */
function ActiveBannerSlot({
  item,
  onSelect,
}: {
  item: LauncherRailItem;
  onSelect?: (id: string) => void;
}) {
  return (
    <button
      type="button"
      title={item.label}
      aria-label={item.label}
      aria-current="page"
      onClick={() => onSelect?.(item.id)}
      style={{
        position: "relative",
        width: "100%",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        /* Ornate gold/parchment banner background — gold-3 with warm tint */
        background: "var(--color-launcher-active-banner-bg, color-mix(in srgb, var(--color-launcher-rail-active) 30%, #2a1f0a 70%))",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
      className="launcher-rail-active-banner"
    >
      {/* Top gold border line */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: "var(--color-launcher-rail-active)",
          opacity: 0.9,
        }}
      />
      {/* Bottom gold border line */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: "var(--color-launcher-rail-active)",
          opacity: 0.6,
        }}
      />
      {/* Left gold accent bar */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 3,
          height: "100%",
          backgroundColor: "var(--color-launcher-rail-active)",
        }}
      />

      {/* Icon wrapper — full opacity, gold tint */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 36,
          height: 36,
          color: "var(--color-launcher-rail-active)",
          flexShrink: 0,
        }}
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
 * NeutralActiveSlot — plain dark rounded-square active indicator for non-LoL nav items.
 *
 * Per ref (image-5/image-7): active Home, Games etc. = neutral translucent dark bg
 * (~rgb(58,58,62)) with the white icon at full opacity. No gold decoration.
 */
function NeutralActiveSlot({
  item,
  onSelect,
}: {
  item: LauncherRailItem;
  onSelect?: (id: string) => void;
}) {
  return (
    <button
      type="button"
      title={item.label}
      aria-label={item.label}
      aria-current="page"
      onClick={() => onSelect?.(item.id)}
      style={{
        width: "100%",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        background: "var(--color-launcher-rail-active-neutral)",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
    >
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          color: "var(--color-launcher-ink)",
          opacity: 1,
          flexShrink: 0,
        }}
      >
        {typeof item.icon === "string" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.icon}
            alt={item.label}
            width={32}
            height={32}
            style={{ objectFit: "contain", width: 32, height: 32 }}
          />
        ) : (
          item.icon
        )}
      </span>
    </button>
  );
}

/** Individual rail slot — renders a single icon with active/hover states. */
function RailSlot({
  item,
  isActive,
  onSelect,
}: {
  item: LauncherRailItem;
  isActive: boolean;
  onSelect?: (id: string) => void;
}) {
  if (isActive) {
    // LoL brand entry gets the ornate gold banner tile (matches ref's decorative LoL tile).
    // All other active items get the neutral dark rounded-square (generic nav active state).
    if (item.id === "lol") {
      return <ActiveBannerSlot item={item} onSelect={onSelect} />;
    }
    return <NeutralActiveSlot item={item} onSelect={onSelect} />;
  }

  // Slot height: respect item.height override, else standard 56px.
  // The "riot" brand fist uses ~130px (ref: large dark gap between fist and Home).
  const slotHeight = item.height ?? 56;
  // Tall slots (riot fist) keep the icon near the top (~40px from top) rather than centered.
  const iconAlign = slotHeight > 56 ? "flex-start" : "center";
  const iconPaddingTop = slotHeight > 56 ? 16 : 0;

  return (
    <button
      type="button"
      title={item.label}
      aria-label={item.label}
      onClick={() => onSelect?.(item.id)}
      style={{
        position: "relative",
        width: "100%",
        height: slotHeight,
        display: "flex",
        alignItems: iconAlign,
        justifyContent: "center",
        flexShrink: 0,
        background: "transparent",
        border: "none",
        padding: 0,
        paddingTop: iconPaddingTop,
        cursor: "pointer",
      }}
      className="launcher-rail-slot group"
    >
      {/* Icon wrapper */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          opacity: 0.6,
          transition: "opacity 150ms ease",
          flexShrink: 0,
        }}
        className="launcher-rail-icon"
      >
        {typeof item.icon === "string" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.icon}
            alt={item.label}
            width={32}
            height={32}
            style={{ objectFit: "contain", width: 32, height: 32 }}
          />
        ) : (
          item.icon
        )}
      </span>
    </button>
  );
}

/**
 * LauncherRail — full-height 64px icon strip.
 *
 * Active slot: ornate parchment-gold banner tile (full width, 64px tall).
 * Inactive slots: 56×56px with icon at 60% opacity.
 * Hover opacity is handled by a scoped `<style>` block — established pattern
 * in this codebase for CSS-variable-based hover states (see merch-header.tsx).
 */
export function LauncherRail({ items, activeId, onSelect }: LauncherRailProps) {
  const uid = useId();
  void uid; // uid available for future ARIA use

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
          width: "100%",
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
            />
          ))}
        </div>
      </div>
    </>
  );
}
