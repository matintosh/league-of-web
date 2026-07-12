/**
 * Store fixture data — dummy items for the Store Featured tab.
 * All image URLs use DDragon splash art (verified CDN paths).
 * Fixture values only; never import in @low/ui components.
 */
import { championSplashUrl } from "./ddragon";
import type { StoreItem, HeroSlide } from "./types";

// ---------------------------------------------------------------------------
// Hero carousel slides
// ---------------------------------------------------------------------------

export const demoHeroSlides: HeroSlide[] = [
  {
    skinLine: "DEMACIA VICE",
    subtitle:
      "FREEZE! DEMACIA VICE! Clean the streets as Demacia Vice Garen and Lucian for 1350 RP each.",
    rpPrice: 1350,
    splashUrl: championSplashUrl("Garen", 6),
  },
  {
    skinLine: "STAR GUARDIAN",
    subtitle:
      "Answer the call of the stars. Star Guardian bundles available for a limited time.",
    rpPrice: 1820,
    splashUrl: championSplashUrl("Jinx", 4),
  },
  {
    skinLine: "PROJECT",
    subtitle:
      "The future is now. PROJECT skins redefine what it means to be a champion.",
    rpPrice: 1350,
    splashUrl: championSplashUrl("Vayne", 4),
  },
  {
    skinLine: "PULSEFIRE",
    subtitle: "Time is on your side. Pulsefire skins bend the laws of the universe.",
    rpPrice: 1350,
    splashUrl: championSplashUrl("Ezreal", 5),
  },
  {
    skinLine: "DARK STAR",
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
  },
  {
    id: "little-legends-series-1-rare-10",
    name: "10 + 1 Little Legends Series 1 Rare Eggs",
    type: "bundle",
    rpPrice: 4900,
    imageUrl: championSplashUrl("Lulu", 3),
    quantity: 10,
    isWishlisted: false,
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
  },
  {
    id: "little-legends-series-2-rare-10",
    name: "10 + 1 Little Legends Series 2 Rare Eggs",
    type: "bundle",
    rpPrice: 4900,
    imageUrl: championSplashUrl("Lulu", 5),
    quantity: 10,
    isWishlisted: false,
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
