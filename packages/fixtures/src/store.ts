/**
 * Store fixture data — dummy items for the Store Featured tab.
 * All image URLs use DDragon splash art (verified CDN paths).
 * Fixture values only; never import in @low/ui components.
 */
import { championSplashUrl, championSquareUrl } from "./ddragon";
import type { StoreItem, HeroSlide, PurchaseBundle } from "./types";

// ---------------------------------------------------------------------------
// Hero carousel slides
// ---------------------------------------------------------------------------

export const demoHeroSlides: HeroSlide[] = [
  {
    skinLine: "Demacia Vice",
    subtitle:
      "FREEZE! DEMACIA VICE! Clean the streets as Demacia Vice Garen and Lucian for 1350 RP each.",
    rpPrice: 1350,
    splashUrl: championSplashUrl("Garen", 6),
  },
  {
    skinLine: "Star Guardian",
    subtitle:
      "Answer the call of the stars. Star Guardian bundles available for a limited time.",
    rpPrice: 1820,
    splashUrl: championSplashUrl("Jinx", 4),
  },
  {
    skinLine: "Project",
    subtitle:
      "The future is now. PROJECT skins redefine what it means to be a champion.",
    rpPrice: 1350,
    splashUrl: championSplashUrl("Vayne", 4),
  },
  {
    skinLine: "Pulsefire",
    subtitle: "Time is on your side. Pulsefire skins bend the laws of the universe.",
    rpPrice: 1350,
    splashUrl: championSplashUrl("Ezreal", 5),
  },
  {
    skinLine: "Dark Star",
    subtitle:
      "From the void between galaxies, darkness descends. Dark Star collection now available.",
    rpPrice: 1820,
    splashUrl: championSplashUrl("Thresh", 3),
  },
];

// ---------------------------------------------------------------------------
// 2×2 featured grid items
// ---------------------------------------------------------------------------

export const demoFeaturedItems: StoreItem[] = [
  {
    id: "arcade-2019-pass",
    name: "Arcade 2019 Pass",
    type: "pass",
    rpPrice: 1650,
    imageUrl: championSplashUrl("Caitlyn", 6),
    isWishlisted: false,
    subItems: [
      { id: "arcade-ward", name: "Arcade 2019 Ward Skin", iconUrl: championSquareUrl("Lulu") },
      { id: "arcade-icon", name: "Arcade 2019 Icon", iconUrl: championSquareUrl("Caitlyn") },
    ],
  },
  {
    id: "little-legends-series-1-rare-10",
    name: "10 + 1 Little Legends Series 1 Rare Eggs",
    type: "bundle",
    rpPrice: 4900,
    imageUrl: championSplashUrl("Lulu", 3),
    quantity: 10,
    isWishlisted: false,
    subItems: [
      { id: "ll-s1-egg", name: "Series 1 Rare Egg", iconUrl: championSquareUrl("Lulu") },
    ],
  },
  {
    id: "arcade-orbs-25",
    name: "25 Arcade Orbs + 1 Arcade Jackpot + 400 Tokens",
    type: "bundle",
    rpPrice: 2000,
    imageUrl: championSplashUrl("MissFortune", 7),
    quantity: 25,
    isWishlisted: false,
    insufficientRP: true,
    subItems: [
      { id: "arcade-orb", name: "Arcade Orb", iconUrl: championSquareUrl("MissFortune") },
      { id: "arcade-jackpot", name: "Arcade Jackpot Orb", iconUrl: championSquareUrl("Ezreal") },
      { id: "arcade-tokens", name: "400 Arcade Tokens", iconUrl: championSquareUrl("Lulu") },
      { id: "arcade-extra", name: "Arcade Emote", iconUrl: championSquareUrl("Jinx") },
    ],
  },
  {
    id: "little-legends-series-2-rare-10",
    name: "10 + 1 Little Legends Series 2 Rare Eggs",
    type: "bundle",
    rpPrice: 4900,
    imageUrl: championSplashUrl("Lulu", 5),
    quantity: 10,
    isWishlisted: false,
    subItems: [
      { id: "ll-s2-egg", name: "Series 2 Rare Egg", iconUrl: championSquareUrl("Lulu") },
    ],
  },
];

// ---------------------------------------------------------------------------
// Top sellers strip items
// ---------------------------------------------------------------------------

export const demoTopSellers: StoreItem[] = [
  {
    id: "top-demacia-vice-garen",
    name: "Demacia Vice Garen",
    type: "skin",
    rpPrice: 1350,
    imageUrl: championSplashUrl("Garen", 6),
    isWishlisted: false,
  },
  {
    id: "top-demacia-vice-lucian",
    name: "Demacia Vice Lucian",
    type: "skin",
    rpPrice: 1350,
    imageUrl: championSplashUrl("Lucian", 6),
    isWishlisted: true,
  },
  {
    id: "top-star-guardian-jinx",
    name: "Star Guardian Jinx",
    type: "skin",
    rpPrice: 1350,
    imageUrl: championSplashUrl("Jinx", 4),
    isWishlisted: false,
  },
  {
    id: "top-project-vayne",
    name: "PROJECT: Vayne",
    type: "skin",
    rpPrice: 1350,
    imageUrl: championSplashUrl("Vayne", 4),
    isWishlisted: false,
  },
  {
    id: "top-penguin-tft",
    name: "Little Legend: Penguin",
    type: "bundle",
    rpPrice: 490,
    imageUrl: championSplashUrl("Lulu", 0),
    isWishlisted: false,
  },
];

// ---------------------------------------------------------------------------
// Purchase bundle fixtures (for StoreItemPurchaseModal)
// ---------------------------------------------------------------------------

/**
 * Map from StoreItem.id → PurchaseBundle for the purchase modal.
 * The page resolves item details by looking up the clicked item id here.
 */
export const demoPurchaseBundles: Record<string, PurchaseBundle> = {
  "arcade-2019-pass": {
    id: "arcade-2019-pass",
    setName: "Arcade Caitlyn Border Set",
    setArtUrl: championSplashUrl("Caitlyn", 6),
    breakdown: ["1 Champion", "1 Skin", "1 Ward Skin", "1 Icon"],
    originalPrice: 3420,
    discountPct: 22,
    finalPrice: 2660,
    items: [
      {
        id: "caitlyn-champ",
        name: "Caitlyn",
        category: "Champion",
        artUrl: championSplashUrl("Caitlyn", 0),
      },
      {
        id: "arcade-caitlyn-skin",
        name: "Arcade Caitlyn",
        category: "Skin",
        artUrl: championSplashUrl("Caitlyn", 6),
      },
      {
        id: "arcade-2019-ward-skin",
        name: "Arcade 2019 Ward Skin",
        category: "Ward Skin",
        artUrl: championSplashUrl("Lulu", 3),
      },
      {
        id: "arcade-caitlyn-icon",
        name: "Arcade Caitlyn Icon",
        category: "Icon",
        artUrl: championSplashUrl("Caitlyn", 5),
      },
    ],
  },
  "little-legends-series-1-rare-10": {
    id: "little-legends-series-1-rare-10",
    setName: "10 + 1 Little Legends Series 1 Rare Eggs",
    setArtUrl: championSplashUrl("Lulu", 3),
    breakdown: ["10 Little Legends Series 1 Rare Eggs", "1 Bonus Rare Egg"],
    originalPrice: null,
    discountPct: null,
    finalPrice: 4900,
    items: [
      {
        id: "ll-s1-egg",
        name: "Series 1 Rare Egg",
        category: "Bundle",
        artUrl: championSplashUrl("Lulu", 3),
      },
    ],
  },
  "arcade-orbs-25": {
    id: "arcade-orbs-25",
    setName: "25 Arcade Orbs + Jackpot + 400 Tokens",
    setArtUrl: championSplashUrl("MissFortune", 7),
    breakdown: ["25 Arcade Orbs", "1 Arcade Jackpot Orb", "400 Arcade Tokens"],
    originalPrice: null,
    discountPct: null,
    finalPrice: 2000,
    items: [
      {
        id: "arcade-orb",
        name: "Arcade Orb",
        category: "Bundle",
        artUrl: championSplashUrl("MissFortune", 7),
      },
      {
        id: "arcade-jackpot",
        name: "Arcade Jackpot",
        category: "Bundle",
        artUrl: championSplashUrl("MissFortune", 4),
      },
      {
        id: "arcade-tokens",
        name: "Arcade Tokens",
        category: "Bundle",
        artUrl: championSplashUrl("Lulu", 6),
      },
    ],
  },
  "little-legends-series-2-rare-10": {
    id: "little-legends-series-2-rare-10",
    setName: "10 + 1 Little Legends Series 2 Rare Eggs",
    setArtUrl: championSplashUrl("Lulu", 5),
    breakdown: ["10 Little Legends Series 2 Rare Eggs", "1 Bonus Rare Egg"],
    originalPrice: null,
    discountPct: null,
    finalPrice: 4900,
    items: [
      {
        id: "ll-s2-egg",
        name: "Series 2 Rare Egg",
        category: "Bundle",
        artUrl: championSplashUrl("Lulu", 5),
      },
    ],
  },
};
