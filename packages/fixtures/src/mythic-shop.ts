/**
 * Mythic Shop fixture data — dummy prestige skin entries for the
 * Store → LOOT → MYTHIC SHOP sub-tab (issue #263).
 *
 * Era: 2024+ (Patch 14.24+ "THE SANCTUM" sub-nav era, per Riot /dev article).
 * Reference: docs/reference/client-loot-mythic-shop.png (2560×1440 Riot WIP screenshot).
 *
 * Skin splash art uses DDragon loadingArtUrl (portrait 308×560 crop that fills
 * a card aspect-ratio well). ME icon: CDragon rcp-fe-lol-static-assets
 * currency/icons/mythic.svg (confirmed 200 OK, 2026-07-13).
 *
 * Fixture values only — never import in @low/ui components.
 */
import { loadingArtUrl } from "./ddragon";

const CDRAGON_STATIC =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default";

/** Mythic Essence icon SVG (CDragon static-assets, confirmed 200 OK 2026-07-13). */
export const mythicEssenceIconUrl = (): string =>
  `${CDRAGON_STATIC}/currency/icons/mythic.svg`;

export interface MythicShopSkin {
  /** Unique key for React list rendering. */
  id: string;
  /** Display name shown below the card art, e.g. "Prestige Winterblessed Camille". */
  skinName: string;
  /** Full splash / loading art URL (portrait orientation preferred for cards). */
  skinSplashSrc: string;
  /** ME cost shown with the Mythic Essence icon, e.g. 380. */
  mythicEssenceCost: number;
}

/**
 * Eight prestige skin entries sampled from the reference screenshot
 * (Mythic Shop inventory as of Patch 14.24).
 *
 * DDragon IDs follow the case convention required by the loading art endpoint.
 * Skin index 0 = base skin; prestige variants are indexed ≥ 1 but prestige splash
 * art is not individually indexed in DDragon public loading art — we use skin 0
 * (base champion art) which still conveys the correct character identity on the card.
 */
export const SAMPLE_MYTHIC_SHOP_ITEMS: MythicShopSkin[] = [
  {
    id: "prestige-winterblessed-camille",
    skinName: "Prestige Winterblessed Camille",
    skinSplashSrc: loadingArtUrl("Camille", 0),
    mythicEssenceCost: 380,
  },
  {
    id: "prestige-porcelain-lissandra",
    skinName: "Prestige Porcelain Lissandra",
    skinSplashSrc: loadingArtUrl("Lissandra", 0),
    mythicEssenceCost: 380,
  },
  {
    id: "prestige-coven-akali",
    skinName: "Prestige Coven Akali",
    skinSplashSrc: loadingArtUrl("Akali", 0),
    mythicEssenceCost: 380,
  },
  {
    id: "prestige-soul-fighter-pyke",
    skinName: "Prestige Soul Fighter Pyke",
    skinSplashSrc: loadingArtUrl("Pyke", 0),
    mythicEssenceCost: 380,
  },
  {
    id: "prestige-bewitching-morgan",
    skinName: "Prestige Bewitching Morgan",
    skinSplashSrc: loadingArtUrl("Morgana", 0),
    mythicEssenceCost: 380,
  },
  {
    id: "prestige-space-groove-lulu",
    skinName: "Prestige Space Groove Lulu",
    skinSplashSrc: loadingArtUrl("Lulu", 0),
    mythicEssenceCost: 380,
  },
  {
    id: "prestige-high-noon-katarina",
    skinName: "Prestige High Noon Katarina",
    skinSplashSrc: loadingArtUrl("Katarina", 0),
    mythicEssenceCost: 380,
  },
  {
    id: "prestige-spirit-blossom-thresh",
    skinName: "Prestige Spirit Blossom Thresh",
    skinSplashSrc: loadingArtUrl("Thresh", 0),
    mythicEssenceCost: 380,
  },
];
