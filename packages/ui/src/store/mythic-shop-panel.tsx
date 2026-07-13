"use client";

import type { MythicShopSkin } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MythicShopPanelProps {
  /**
   * Ordered list of prestige skin entries to display in the 4-column grid.
   * Callers should pass SAMPLE_MYTHIC_SHOP_ITEMS from @low/fixtures.
   */
  skins: MythicShopSkin[];
  /**
   * URL for the Mythic Essence icon shown next to each ME price.
   * Pass mythicEssenceIconUrl() from @low/fixtures.
   */
  meIconSrc: string;
  /**
   * Called when a skin card is clicked (e.g. to open a purchase modal).
   * The full skin entry is passed as the argument.
   */
  onSkinClick?: (skin: MythicShopSkin) => void;
}

// ---------------------------------------------------------------------------
// MythicShopCard — individual prestige skin card
// ---------------------------------------------------------------------------

/**
 * Single card in the Mythic Shop 4-column grid.
 *
 * Reference (docs/reference/client-loot-mythic-shop.png, 2024+ era):
 * - Full-bleed splash art fills the card
 * - Dark gradient overlay at the bottom reveals the skin name + ME price
 * - ME icon (teal diamond) left of numeric cost
 * - Thin gold border on hover
 */
function MythicShopCard({
  skin,
  meIconSrc,
  onClick,
}: {
  skin: MythicShopSkin;
  meIconSrc: string;
  onClick?: (skin: MythicShopSkin) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${skin.skinName} — ${skin.mythicEssenceCost} Mythic Essence`}
      onClick={() => onClick?.(skin)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.(skin);
      }}
      className="group relative flex aspect-[308/560] w-full cursor-pointer select-none flex-col overflow-hidden border border-gold-5 transition-colors duration-150 hover:border-gold-3"
    >
      {/* Splash art — fills card */}
      <img
        src={skin.skinSplashSrc}
        alt={skin.skinName}
        className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
      />

      {/* Bottom gradient overlay — dark scrim so text is readable over art */}
      <div
        className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-2"
        style={{
          background: "linear-gradient(to top, var(--color-blue-8) 0%, transparent 100%)",
        }}
      >
        {/* Skin name */}
        <p className="font-display text-[11px] leading-tight text-gold-cream">
          {skin.skinName}
        </p>

        {/* ME price row */}
        <div className="flex items-center gap-1">
          <img
            src={meIconSrc}
            alt="Mythic Essence"
            width={14}
            height={14}
            className="h-3.5 w-3.5 flex-shrink-0 object-contain"
          />
          <span className="font-display text-[11px] leading-none text-blue-2">
            {skin.mythicEssenceCost}
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MythicShopPanel — full panel (header + grid)
// ---------------------------------------------------------------------------

/**
 * MythicShopPanel — MYTHIC SHOP sub-tab content for LootTab.
 *
 * Era: 2024+ (Patch 14.24+ "THE SANCTUM" sub-nav architecture, Riot /dev article).
 * Scope: content-only per controller adjudication — sub-tab switching is
 * handled in LootTab; this component owns only the right-panel area rendered
 * when activeSubTab === "mythic-shop".
 *
 * Reference: docs/reference/client-loot-mythic-shop.png (2560×1440).
 *
 * Layout:
 *   - Centered header "MYTHIC SHOP" (font-display text-gold-cream)
 *   - Description paragraph (text-grey-1 text-xs)
 *   - "Click here to learn more" external link
 *   - 4-column grid of MythicShopCard components (prestige skin art + ME price)
 */
export function MythicShopPanel({
  skins,
  meIconSrc,
  onSkinClick,
}: MythicShopPanelProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-blue-8">
      {/* Header zone */}
      <div className="flex flex-shrink-0 flex-col items-center gap-1.5 px-4 py-4 text-center">
        <h2 className="font-display text-2xl uppercase tracking-widest text-gold-cream">
          MYTHIC SHOP
        </h2>
        <p className="max-w-md font-body text-xs leading-relaxed text-grey-1">
          Unlock new and classic content exclusively for Mythic Essence.
          Inventory rotates with new patches.{" "}
          <a
            href="https://www.leagueoflegends.com/en-us/news/game-updates/dev-exalted-skins-the-mythic-shop-and-nexus-finishers/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-2 underline underline-offset-2 transition-colors duration-150 hover:text-blue-1"
          >
            Click here to learn more ↗
          </a>
        </p>
      </div>

      {/* 4-column skin card grid */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {skins.length === 0 ? (
          <p className="mt-8 text-center font-body text-xs text-grey-2">
            No items available — check back after the next patch.
          </p>
        ) : (
          <div className="grid grid-cols-4 gap-2.5">
            {skins.map((skin) => (
              <MythicShopCard
                key={skin.id}
                skin={skin}
                meIconSrc={meIconSrc}
                onClick={onSkinClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
