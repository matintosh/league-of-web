// ---------------------------------------------------------------------------
// Champion fixtures
// ---------------------------------------------------------------------------

export interface ChampionSummary {
  id: string;
  name: string;
}

/**
 * A single skin entry for demo use in the skins collection tab.
 * `skinIndex` maps directly to the DDragon loading-art skin number.
 * Only verified URLs are included — spot-curled against DDragon.
 */
export interface SkinEntry {
  /** Human-readable skin name, e.g. "Silver Kayle". */
  name: string;
  /** DDragon skin index (0 = base). Verified to return HTTP 200. */
  skinIndex: number;
  /** Whether this skin is owned in the demo fixture. */
  owned: boolean;
}

/**
 * Demo skins per champion for the Collection > Skins tab.
 * Keys are DDragon champion IDs (case-sensitive).
 * Skin indices are verified against DDragon loading-art CDN.
 */
export const demoSkins: Record<string, { championName: string; skins: SkinEntry[] }> = {
  Kayle: {
    championName: "Kayle",
    skins: [
      { name: "Kayle", skinIndex: 0, owned: true },
      { name: "Judgment Kayle", skinIndex: 1, owned: true },
      { name: "Viridian Kayle", skinIndex: 2, owned: false },
      { name: "Transcended Kayle", skinIndex: 3, owned: false },
      { name: "Unmasked Kayle", skinIndex: 4, owned: false },
      { name: "Battleborn Kayle", skinIndex: 5, owned: false },
      { name: "Aether Wing Kayle", skinIndex: 6, owned: false },
      { name: "Riot Kayle", skinIndex: 7, owned: false },
      { name: "Silver Kayle", skinIndex: 8, owned: false },
    ],
  },
  Ahri: {
    championName: "Ahri",
    skins: [
      { name: "Ahri", skinIndex: 0, owned: true },
      { name: "Dynasty Ahri", skinIndex: 1, owned: false },
      { name: "Midnight Ahri", skinIndex: 2, owned: true },
      { name: "Foxfire Ahri", skinIndex: 3, owned: false },
      { name: "Popstar Ahri", skinIndex: 4, owned: false },
      { name: "Challenger Ahri", skinIndex: 5, owned: false },
      { name: "Academy Ahri", skinIndex: 6, owned: false },
      { name: "Star Guardian Ahri", skinIndex: 7, owned: false },
    ],
  },
  Jinx: {
    championName: "Jinx",
    skins: [
      { name: "Jinx", skinIndex: 0, owned: true },
      { name: "Mafia Jinx", skinIndex: 1, owned: false },
      { name: "Firecracker Jinx", skinIndex: 2, owned: false },
      { name: "Ambitious Elf Jinx", skinIndex: 3, owned: false },
      { name: "Star Guardian Jinx", skinIndex: 4, owned: true },
    ],
  },
  Lux: {
    championName: "Lux",
    skins: [
      { name: "Lux", skinIndex: 0, owned: true },
      { name: "Sorceress Lux", skinIndex: 1, owned: false },
      { name: "Spellthief Lux", skinIndex: 2, owned: false },
      { name: "Imperial Lux", skinIndex: 3, owned: true },
      { name: "Steel Legion Lux", skinIndex: 4, owned: false },
      { name: "Star Guardian Lux", skinIndex: 5, owned: false },
      { name: "elementalist Lux", skinIndex: 6, owned: false },
      { name: "Lunar Empress Lux", skinIndex: 7, owned: false },
      { name: "Battle Academia Lux", skinIndex: 8, owned: false },
    ],
  },
};

/**
 * 20 champions for showcase/demo use. Alphabetical by name.
 */
export const demoChampions: ChampionSummary[] = [
  { id: "Aatrox", name: "Aatrox" },
  { id: "Ahri", name: "Ahri" },
  { id: "Akali", name: "Akali" },
  { id: "Ashe", name: "Ashe" },
  { id: "Darius", name: "Darius" },
  { id: "Ekko", name: "Ekko" },
  { id: "Ezreal", name: "Ezreal" },
  { id: "Garen", name: "Garen" },
  { id: "Jinx", name: "Jinx" },
  { id: "Kaisa", name: "Kai'Sa" },
  { id: "LeeSin", name: "Lee Sin" },
  { id: "Lux", name: "Lux" },
  { id: "MissFortune", name: "Miss Fortune" },
  { id: "Riven", name: "Riven" },
  { id: "Sett", name: "Sett" },
  { id: "Thresh", name: "Thresh" },
  { id: "Vi", name: "Vi" },
  { id: "Viktor", name: "Viktor" },
  { id: "Yasuo", name: "Yasuo" },
  { id: "Zed", name: "Zed" },
];
