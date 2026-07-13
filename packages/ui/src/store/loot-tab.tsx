"use client";

import { useId } from "react";
import type { LootCategory, LootItem, ForgeSlot } from "@low/fixtures";
import { lootCategoryIconUrl } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Sub-navigation tabs within the Loot screen (2024+ era). */
export type LootSubTab = "sanctum" | "mythic-shop" | "crafting";

export interface LootTabProps {
  /**
   * Which sub-tab is active.
   * Defaults to "crafting" — matches reference screenshot (CRAFTING highlighted).
   */
  activeSubTab?: LootSubTab;
  /** Called when a sub-tab button is clicked. */
  onSubTabChange?: (tab: LootSubTab) => void;
  /**
   * Categorised loot inventory. Each category renders a header label
   * followed by a row of item tiles. Empty categories show the header only.
   */
  lootItems: LootCategory[];
  /**
   * Three forge slots. null = empty slot (placeholder icon + "0/1" label).
   * Exactly 3 entries expected.
   */
  forgeSlots: [ForgeSlot, ForgeSlot, ForgeSlot];
  /** Key fragment count shown in the bottom bar. */
  keyFragments: number;
  /** Hextech Key count shown in the bottom bar. */
  keys: number;
  /** Loot bag count shown in the bottom bar. */
  lootBags: number;
  /** Called when the search field changes. */
  onSearch?: (q: string) => void;
  /** Called when the CRAFT button is clicked. */
  onCraft?: () => void;
  /** Called when a forge slot's × close button is clicked. */
  onClearSlot?: (idx: number) => void;
}

// ---------------------------------------------------------------------------
// Sub-navigation strip
// ---------------------------------------------------------------------------

const SUB_TABS: { id: LootSubTab; label: string }[] = [
  { id: "sanctum",     label: "THE SANCTUM" },
  { id: "mythic-shop", label: "MYTHIC SHOP" },
  { id: "crafting",    label: "CRAFTING" },
];

function LootSubNav({
  active,
  onChange,
}: {
  active: LootSubTab;
  onChange?: (tab: LootSubTab) => void;
}) {
  return (
    <div className="flex items-end border-b border-gold-5 bg-hextech-black px-3">
      {SUB_TABS.map((tab, i) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange?.(tab.id)}
            className={[
              "relative px-4 py-1.5 font-display text-xs uppercase tracking-widest transition-colors duration-150",
              i > 0 && "border-l border-gold-5",
              isActive
                ? "text-gold-2 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-px after:bg-gold-2"
                : "text-grey-2 hover:text-gold-1",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sidebar category filter icons
// ---------------------------------------------------------------------------

const SIDEBAR_FILTERS: {
  name: "all" | "champion" | "skin" | "emote" | "eternals" | "chest";
  label: string;
}[] = [
  { name: "all",       label: "All" },
  { name: "champion",  label: "Champions" },
  { name: "skin",      label: "Skins" },
  { name: "chest",     label: "Chests" },
  { name: "emote",     label: "Emotes" },
  { name: "eternals",  label: "Eternals" },
];

function InventorySidebar() {
  return (
    <div className="flex w-7 flex-shrink-0 flex-col items-center gap-1 border-r border-gold-5 bg-blue-8 py-2">
      {SIDEBAR_FILTERS.map((f) => (
        <button
          key={f.name}
          type="button"
          aria-label={f.label}
          className="flex h-7 w-7 items-center justify-center opacity-60 transition-opacity duration-150 hover:opacity-100"
        >
          <img
            src={lootCategoryIconUrl(f.name)}
            alt=""
            aria-hidden="true"
            width={20}
            height={20}
            className="object-contain"
          />
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Search + sort bar
// ---------------------------------------------------------------------------

function InventorySearchBar({ onSearch }: { onSearch?: (q: string) => void }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-gold-5 px-2 py-1.5">
      {/* Search */}
      <div className="relative flex flex-1 items-center">
        <svg
          className="pointer-events-none absolute left-1.5 h-3 w-3 text-grey-2"
          fill="none"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M11 11l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="search"
          placeholder="Search"
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full bg-blue-8 py-0.5 pl-6 pr-2 font-body text-xs text-grey-1 placeholder-grey-2 outline-none border border-gold-5 focus:border-gold-3"
          aria-label="Search loot"
        />
      </div>
      {/* Sort dropdown — static, presentational */}
      <div className="flex items-center gap-1 border border-gold-5 bg-blue-8 px-1.5 py-0.5">
        <span className="font-body text-xs text-grey-1">Alphabetical</span>
        <svg className="h-2.5 w-2.5 text-grey-2" viewBox="0 0 10 6" fill="currentColor" aria-hidden="true">
          <path d="M0 0l5 6 5-6H0z" />
        </svg>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Loot item tile
// ---------------------------------------------------------------------------

function LootItemTile({ item }: { item: LootItem }) {
  const isEmpty = item.count === 0;
  return (
    <div className="group relative flex-shrink-0 w-14 cursor-pointer select-none">
      {/* Item art */}
      <div
        className={[
          "relative h-14 w-14 border border-gold-5 bg-blue-8 transition-colors duration-150 group-hover:border-gold-3",
          isEmpty && "opacity-50",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <img
          src={item.iconSrc}
          alt={item.name}
          width={56}
          height={56}
          className="h-full w-full object-cover"
        />
        {/* Tier badge (top-right corner) */}
        {item.tier && (
          <span className="absolute right-0 top-0 bg-gold-4 px-0.5 font-display text-[9px] uppercase tracking-wider text-gold-1">
            {item.tier.slice(0, 3)}
          </span>
        )}
        {/* Count badge (bottom-right corner) */}
        <span
          className={[
            "absolute bottom-0 right-0 min-w-[14px] px-0.5 text-center font-display text-[10px] leading-4 font-semibold",
            item.count > 0 ? "bg-gold-5 text-gold-1" : "bg-warning text-gold-1",
          ].join(" ")}
        >
          {item.count}
        </span>
      </div>
      {/* Name label */}
      <p className="mt-0.5 truncate text-center font-body text-[9px] leading-tight text-grey-2">
        {item.name}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inventory panel (left zone)
// ---------------------------------------------------------------------------

function LootInventoryPanel({
  lootItems,
  onSearch,
}: {
  lootItems: LootCategory[];
  onSearch?: (q: string) => void;
}) {
  return (
    <div className="flex h-full flex-col border-r border-gold-5 bg-blue-8" style={{ width: "37%" }}>
      <LootSubNav active="crafting" />
      <div className="flex flex-1 min-h-0">
        <InventorySidebar />
        <div className="flex flex-1 min-h-0 flex-col">
          <InventorySearchBar onSearch={onSearch} />
          {/* Category groups */}
          <div className="flex-1 overflow-y-auto px-2 py-1">
            {lootItems.map((cat) => (
              <div key={cat.id} className="mb-2">
                {/* Category header */}
                <p className="mb-1 font-display text-xs uppercase tracking-widest text-gold-2">
                  {cat.label}
                </p>
                {/* Item row */}
                {cat.items.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map((item) => (
                      <LootItemTile key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Crafting forge wheel (SVG — approximated from reference)
// ---------------------------------------------------------------------------

/**
 * Three-spoke Hextech forge wheel.
 *
 * The reference shows a large circular forge with gold concentric rings,
 * three gold spokes at 120° intervals, and a blue energy glow in the center.
 * This SVG approximates the geometry using token colors only — no inline hex.
 * The blue glow uses a radial gradient with CSS-var stops via @low/tokens.
 */
function ForgeWheel({ id }: { id: string }) {
  const gradId = `${id}-glow`;
  const outerRingId = `${id}-outer`;
  return (
    <svg
      viewBox="0 0 280 280"
      width={280}
      height={280}
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <defs>
        {/* Blue energy center glow */}
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-blue-2)" stopOpacity="0.9" />
          <stop offset="40%" stopColor="var(--color-blue-3)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="var(--color-blue-5)" stopOpacity="0" />
        </radialGradient>
        {/* Gold outer ring gradient for a 3D feel */}
        <radialGradient id={outerRingId} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="var(--color-gold-2)" />
          <stop offset="100%" stopColor="var(--color-gold-5)" />
        </radialGradient>
      </defs>

      {/* Outer decorative ring */}
      <circle cx="140" cy="140" r="134" fill="none" stroke="var(--color-gold-5)" strokeWidth="1" />
      {/* Main gold ring */}
      <circle cx="140" cy="140" r="126" fill="none" stroke={`url(#${outerRingId})`} strokeWidth="5" />
      {/* Inner ring */}
      <circle cx="140" cy="140" r="115" fill="var(--color-blue-7)" stroke="var(--color-gold-4)" strokeWidth="2" />
      {/* Middle ring */}
      <circle cx="140" cy="140" r="90" fill="none" stroke="var(--color-gold-5)" strokeWidth="1" />
      {/* Blue glow fill */}
      <circle cx="140" cy="140" r="88" fill={`url(#${gradId})`} />

      {/* Three spokes at 0°, 120°, 240° (pointing out from center) */}
      {[0, 120, 240].map((deg) => {
        const rad = (deg - 90) * (Math.PI / 180);
        const innerR = 30;
        const outerR = 110;
        const x1 = 140 + innerR * Math.cos(rad);
        const y1 = 140 + innerR * Math.sin(rad);
        const x2 = 140 + outerR * Math.cos(rad);
        const y2 = 140 + outerR * Math.sin(rad);
        return (
          <line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="var(--color-gold-3)"
            strokeWidth="6"
            strokeLinecap="round"
          />
        );
      })}

      {/* Center cap */}
      <circle cx="140" cy="140" r="28" fill="var(--color-blue-6)" stroke="var(--color-gold-3)" strokeWidth="3" />
      <circle cx="140" cy="140" r="18" fill="var(--color-gold-4)" stroke="var(--color-gold-2)" strokeWidth="1.5" />
      <circle cx="140" cy="140" r="10" fill="var(--color-gold-coin)" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Forge slot
// ---------------------------------------------------------------------------

function ForgeSlotTile({
  slot,
  index,
  onClear,
}: {
  slot: ForgeSlot;
  index: number;
  onClear?: (idx: number) => void;
}) {
  const isFilled = slot !== null;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative h-14 w-14 border border-gold-4 bg-blue-8">
        {isFilled ? (
          <>
            <img
              src={slot.iconSrc}
              alt={slot.name}
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
            {/* Clear button */}
            <button
              type="button"
              onClick={() => onClear?.(index)}
              aria-label={`Remove ${slot.name} from forge`}
              className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center bg-blue-6 border border-gold-5 text-grey-1 hover:text-gold-1 transition-colors duration-150"
            >
              <svg viewBox="0 0 10 10" width={8} height={8} fill="currentColor" aria-hidden="true">
                <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </>
        ) : (
          /* Empty slot — helmet placeholder icon */
          <div className="flex h-full w-full items-center justify-center opacity-40">
            <svg viewBox="0 0 24 24" width={28} height={28} fill="var(--color-gold-4)" aria-hidden="true">
              <path d="M12 2C7.58 2 4 5.58 4 10v5l2 2h1v2h10v-2h1l2-2v-5c0-4.42-3.58-8-8-8zm0 2c3.31 0 6 2.69 6 6v4.17l-1.41 1.41-.59.42H8l-.59-.42L6 14.17V10c0-3.31 2.69-6 6-6z" />
            </svg>
          </div>
        )}
      </div>
      {/* Slot count label */}
      <span
        className={[
          "font-display text-[10px] leading-none",
          isFilled ? "text-gold-2" : "text-warning",
        ].join(" ")}
      >
        {isFilled ? "1/1" : "0/1"}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Crafting forge panel (right zone)
// ---------------------------------------------------------------------------

function CraftingForge({
  forgeSlots,
  onCraft,
  onClearSlot,
}: {
  forgeSlots: [ForgeSlot, ForgeSlot, ForgeSlot];
  onCraft?: () => void;
  onClearSlot?: (idx: number) => void;
}) {
  const wheelId = useId().replace(/:/g, "loot");
  const canCraft = forgeSlots.some((s) => s !== null);

  return (
    <div className="relative flex flex-1 flex-col items-center justify-between bg-blue-7 pb-4 pt-6 overflow-hidden">
      {/* Forge wheel — centered in upper portion */}
      <div className="relative h-[280px] w-[280px] flex-shrink-0">
        <ForgeWheel id={wheelId} />
      </div>

      {/* Slot tray — bottom area */}
      <div className="flex items-center gap-3 px-4">
        {/* Help button */}
        <button
          type="button"
          aria-label="Crafting help"
          className="flex h-7 w-7 items-center justify-center border border-gold-5 bg-blue-6 font-display text-sm text-grey-1 hover:border-gold-3 hover:text-gold-1 transition-colors duration-150"
        >
          ?
        </button>

        {/* Three forge slots */}
        {forgeSlots.map((slot, i) => (
          <ForgeSlotTile
            key={i}
            slot={slot}
            index={i}
            onClear={onClearSlot}
          />
        ))}

        {/* Clear all / close button */}
        <button
          type="button"
          aria-label="Clear forge slots"
          className="flex h-7 w-7 items-center justify-center border border-gold-5 bg-blue-6 text-grey-1 hover:border-gold-3 hover:text-gold-1 transition-colors duration-150"
          onClick={() => { onClearSlot?.(0); onClearSlot?.(1); onClearSlot?.(2); }}
        >
          <svg viewBox="0 0 10 10" width={10} height={10} fill="currentColor" aria-hidden="true">
            <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Craft button */}
      <button
        type="button"
        disabled={!canCraft}
        onClick={onCraft}
        className={[
          "mt-3 border px-8 py-1.5 font-display text-sm uppercase tracking-widest transition-all duration-150",
          canCraft
            ? "border-gold-3 bg-blue-6 text-gold-2 hover:border-gold-2 hover:shadow-[0_0_12px_var(--color-blue-2)]"
            : "border-grey-3 bg-blue-8 text-grey-2 cursor-not-allowed opacity-60",
        ].join(" ")}
      >
        Craft
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bottom resource bar
// ---------------------------------------------------------------------------

function LootBottomBar({
  keyFragments,
  keys,
  lootBags,
}: {
  keyFragments: number;
  keys: number;
  lootBags: number;
}) {
  return (
    <div className="flex h-10 flex-shrink-0 items-center gap-5 border-t border-gold-5 bg-grey-4 px-4">
      {/* Add chest shortcut */}
      <button
        type="button"
        aria-label="Add chest"
        className="flex items-center gap-1 border border-gold-5 bg-blue-8 px-2 py-0.5 transition-colors duration-150 hover:border-gold-3"
      >
        <span className="font-display text-xs text-gold-2">+</span>
        <img
          src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-loot/global/default/assets/loot_item_icons/chest.png"
          alt="Chest"
          width={16}
          height={16}
          className="object-contain"
        />
      </button>

      {/* Key fragment count */}
      <div className="flex items-center gap-1.5">
        <img
          src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-loot/global/default/assets/loot_item_icons/material_key_fragment.png"
          alt="Key Fragment"
          width={18}
          height={18}
          className="object-contain"
        />
        <span className="font-display text-xs text-gold-1">
          {keyFragments.toLocaleString("en-US")}
        </span>
      </div>

      {/* Key count */}
      <div className="flex items-center gap-1.5">
        <img
          src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-loot/global/default/assets/loot_item_icons/material_key.png"
          alt="Key"
          width={18}
          height={18}
          className="object-contain"
        />
        <span className="font-display text-xs text-gold-1">
          {keys.toLocaleString("en-US")}
        </span>
      </div>

      {/* Loot bag count */}
      <div className="flex items-center gap-1.5">
        <img
          src="https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-loot/global/default/assets/loot_item_icons/chest_key_bundle.png"
          alt="Loot Bag"
          width={18}
          height={18}
          className="object-contain"
        />
        <span className="font-display text-xs text-gold-1">
          {lootBags.toLocaleString("en-US")}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// LootTab — top-level component
// ---------------------------------------------------------------------------

/**
 * LootTab — Store → LOOT sub-tab (2024+ era, CRAFTING sub-view).
 *
 * Layout (1010×614 reference, see docs/reference/client-loot-crafting-tab.png):
 *
 *   ┌──────────────────────────────────────────────┐
 *   │  Left panel (37%): Loot inventory            │
 *   │  - Sub-nav: THE SANCTUM | MYTHIC SHOP | CRAFTING │
 *   │  - Sidebar filter icons (category icons)     │
 *   │  - Search + Alphabetical sort                │
 *   │  - Category groups: MATERIALS / CHAMPIONS /  │
 *   │    SKINS / TACTICIANS / ETERNALS             │
 *   ├──────────────────────────────────────────────┤
 *   │  Right panel (63%): Crafting forge           │
 *   │  - Hextech three-spoke wheel SVG             │
 *   │  - Item slot tray (3 slots) + help/?/×       │
 *   │  - CRAFT button                              │
 *   ├──────────────────────────────────────────────┤
 *   │  Bottom bar: + chest | key-fragments | keys | bags │
 *   └──────────────────────────────────────────────┘
 *
 * Presentational. No data fetching; all state owned by the parent.
 * Era: 2024+ (V14.24+ "THE SANCTUM" sub-nav introduced).
 */
export function LootTab({
  activeSubTab = "crafting",
  onSubTabChange,
  lootItems,
  forgeSlots,
  keyFragments,
  keys,
  lootBags,
  onSearch,
  onCraft,
  onClearSlot,
}: LootTabProps) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Main content — inventory panel + forge */}
      <div className="flex flex-1 min-h-0">
        {/* Left: inventory */}
        <LootInventoryPanel lootItems={lootItems} onSearch={onSearch} />

        {/* Right: forge */}
        <CraftingForge
          forgeSlots={forgeSlots}
          onCraft={onCraft}
          onClearSlot={onClearSlot}
        />
      </div>

      {/* Bottom resource bar */}
      <LootBottomBar
        keyFragments={keyFragments}
        keys={keys}
        lootBags={lootBags}
      />
    </div>
  );
}
