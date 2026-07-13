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
  /** Optional skin tier label for tooltip display — union of known Riot tier names. */
  tier?: "Legacy" | "Epic" | "Ultimate" | "Mythic" | "Prestige";
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
      { name: "Viridian Kayle", skinIndex: 2, owned: false, tier: "Legacy" },
      { name: "Transcended Kayle", skinIndex: 3, owned: false, tier: "Legacy" },
      { name: "Unmasked Kayle", skinIndex: 4, owned: false, tier: "Epic" },
      { name: "Battleborn Kayle", skinIndex: 5, owned: false, tier: "Epic" },
      { name: "Aether Wing Kayle", skinIndex: 6, owned: false, tier: "Epic" },
      { name: "Riot Kayle", skinIndex: 7, owned: false, tier: "Legacy" },
      { name: "Silver Kayle", skinIndex: 8, owned: false, tier: "Legacy" },
    ],
  },
  Ahri: {
    championName: "Ahri",
    skins: [
      { name: "Ahri", skinIndex: 0, owned: true },
      { name: "Dynasty Ahri", skinIndex: 1, owned: false, tier: "Epic" },
      { name: "Midnight Ahri", skinIndex: 2, owned: true },
      { name: "Foxfire Ahri", skinIndex: 3, owned: false, tier: "Legacy" },
      { name: "Popstar Ahri", skinIndex: 4, owned: false, tier: "Epic" },
      { name: "Challenger Ahri", skinIndex: 5, owned: false, tier: "Legacy" },
      { name: "Academy Ahri", skinIndex: 6, owned: false, tier: "Epic" },
      { name: "Star Guardian Ahri", skinIndex: 7, owned: false, tier: "Epic" },
    ],
  },
  Jinx: {
    championName: "Jinx",
    skins: [
      { name: "Jinx", skinIndex: 0, owned: true },
      { name: "Mafia Jinx", skinIndex: 1, owned: false, tier: "Legacy" },
      { name: "Firecracker Jinx", skinIndex: 2, owned: false, tier: "Epic" },
      { name: "Ambitious Elf Jinx", skinIndex: 3, owned: false, tier: "Legacy" },
      { name: "Star Guardian Jinx", skinIndex: 4, owned: true },
    ],
  },
  Lux: {
    championName: "Lux",
    skins: [
      { name: "Lux", skinIndex: 0, owned: true },
      { name: "Sorceress Lux", skinIndex: 1, owned: false, tier: "Legacy" },
      { name: "Spellthief Lux", skinIndex: 2, owned: false, tier: "Epic" },
      { name: "Imperial Lux", skinIndex: 3, owned: true },
      { name: "Steel Legion Lux", skinIndex: 4, owned: false, tier: "Epic" },
      { name: "Star Guardian Lux", skinIndex: 5, owned: false, tier: "Epic" },
      { name: "Elementalist Lux", skinIndex: 6, owned: false, tier: "Ultimate" },
      { name: "Lunar Empress Lux", skinIndex: 7, owned: false, tier: "Epic" },
      { name: "Battle Academia Lux", skinIndex: 8, owned: false, tier: "Epic" },
    ],
  },
};

/**
 * Warwick skins for the loadout screen demo.
 * Skin indices verified against DDragon loading-art CDN (HTTP 200).
 * Using indices 0, 3, 5, 6, 7 for 5 skins; index 5 (Feral Warwick) is the
 * default selected as it matches the reference screenshot.
 */
export const warwickLoadoutSkins: SkinEntry[] = [
  { name: "Warwick", skinIndex: 0, owned: true },
  { name: "Big Bad Warwick", skinIndex: 3, owned: true },
  { name: "Feral Warwick", skinIndex: 5, owned: true },
  { name: "Firefang Warwick", skinIndex: 6, owned: false },
  { name: "Hyena Warwick", skinIndex: 7, owned: false },
];

/**
 * Fixture team for the loadout screen.
 * Self = Warwick locked (index 2), slots 0–1 are picking, slots 3–4 are locked others.
 */
export interface LoadoutTeamMember {
  summonerName: string;
  state: "picking" | "locked";
  championName?: string;
  /** DDragon champion id for square icon (portraitSrc). */
  championId?: string;
  isSelf?: boolean;
}

export const loadoutTeam: LoadoutTeamMember[] = [
  { summonerName: "qlxHarlan", state: "picking" },
  { summonerName: "Oppeohtelar", state: "locked", championName: "Ashe", championId: "Ashe" },
  { summonerName: "cherwood", state: "locked", championName: "Warwick", championId: "Warwick", isSelf: true },
  { summonerName: "HowarqLqUq", state: "picking" },
  { summonerName: "CallMeCallMeStar", state: "locked", championName: "Kindred", championId: "Kindred" },
];

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

// ---------------------------------------------------------------------------
// Pick-phase champion grid
// ---------------------------------------------------------------------------

/**
 * Lane role for champion filtering in the pick phase.
 * Maps to the RoleSelector roles in @low/ui.
 */
export type ChampionRole = "top" | "jungle" | "mid" | "bottom" | "support";

/**
 * A champion entry with role tags for the pick-phase grid filter.
 */
export interface PickChampion {
  /** DDragon champion id (case-sensitive). Verified against DDragon CDN. */
  id: string;
  /** Human-readable champion name as shown in the client. */
  name: string;
  /**
   * Roles this champion is commonly played in.
   * Used by the pick-phase role filter — filtering shows any champion
   * whose roles array includes the selected role.
   */
  roles: ChampionRole[];
  /**
   * Optional mastery badge number shown in the top-right corner of the tile.
   * Mirrors the "6" badges visible in the reference screenshot.
   * When absent, no badge is rendered.
   */
  badge?: number;
}

/**
 * Champion grid for the pick phase (30 champions).
 *
 * Champions match the reference screenshot (client-champ-select-pick.jpg).
 * Casing traps verified against DDragon 16.13.1 CDN:
 *   - "Chogath" (not "ChoGath" or "Cho'Gath") → 200
 *   - "Evelynn" (not "Evelyn") → 200
 *   - "LeeSin" → 200
 *   - "MissFortune" → 200
 *   - "Kaisa" (not "KaiSa") → 200
 *
 * Skin strategy: all grid champions fall back to base skin (skinIndex 0) for
 * the loadout handoff. Extended skin entries exist in demoSkins for champions
 * that already have them (Kayle, Ahri, Jinx, Lux). The pick screen adds Morgana
 * and Warwick with verified skins. Other champions use base skin only — this
 * is noted in the loadout screen logic via a comment.
 *
 * Sorted alphabetical by name (matching the default "Sort By Name" order).
 */
export const pickChampions: PickChampion[] = [
  { id: "Alistar", name: "Alistar", roles: ["support"], badge: 6 },
  { id: "Amumu", name: "Amumu", roles: ["jungle", "support"], badge: 6 },
  { id: "Anivia", name: "Anivia", roles: ["mid"], badge: 6 },
  { id: "Annie", name: "Annie", roles: ["mid", "support"], badge: 6 },
  { id: "Chogath", name: "Cho'Gath", roles: ["top", "jungle"], badge: 6 },
  { id: "Evelynn", name: "Evelynn", roles: ["jungle"], badge: 6 },
  { id: "Ezreal", name: "Ezreal", roles: ["bottom"] },
  { id: "Fiddlesticks", name: "Fiddlesticks", roles: ["jungle", "support"], badge: 6 },
  { id: "Janna", name: "Janna", roles: ["support"] },
  { id: "Jhin", name: "Jhin", roles: ["bottom"], badge: 6 },
  { id: "Kayle", name: "Kayle", roles: ["top", "mid"], badge: 6 },
  { id: "Kindred", name: "Kindred", roles: ["jungle"], badge: 6 },
  { id: "LeeSin", name: "Lee Sin", roles: ["jungle", "top"] },
  { id: "Malphite", name: "Malphite", roles: ["top", "support"], badge: 6 },
  { id: "Morgana", name: "Morgana", roles: ["support", "mid"], badge: 6 },
  { id: "Nami", name: "Nami", roles: ["support"] },
  { id: "Nasus", name: "Nasus", roles: ["top"] },
  { id: "Nidalee", name: "Nidalee", roles: ["jungle", "mid"] },
  { id: "Rammus", name: "Rammus", roles: ["jungle"] },
  { id: "Ryze", name: "Ryze", roles: ["mid", "top"], badge: 6 },
  { id: "Shen", name: "Shen", roles: ["top", "support"] },
  { id: "Sivir", name: "Sivir", roles: ["bottom"] },
  { id: "Teemo", name: "Teemo", roles: ["top"] },
  { id: "Tristana", name: "Tristana", roles: ["bottom", "mid"] },
  { id: "Tryndamere", name: "Tryndamere", roles: ["top", "jungle"] },
  { id: "Veigar", name: "Veigar", roles: ["mid", "support"], badge: 6 },
  { id: "Volibear", name: "Volibear", roles: ["top", "jungle"] },
  { id: "Warwick", name: "Warwick", roles: ["jungle", "top"] },
  { id: "Zac", name: "Zac", roles: ["jungle", "top"], badge: 6 },
  { id: "Zed", name: "Zed", roles: ["mid"], badge: 6 },
];

/**
 * Extended skin entries for champions in the pick grid.
 * Keys are DDragon champion IDs.
 *
 * Only champions with verified loading-art URLs are listed here with multiple
 * skins. All other champions from pickChampions fall back to base skin (index 0)
 * in the loadout screen — this is handled by pickChampionSkins at call sites.
 */
export const pickChampionSkins: Record<string, SkinEntry[]> = {
  // Already in demoSkins, duplicated here for direct access
  Kayle: [
    { name: "Kayle", skinIndex: 0, owned: true },
    { name: "Judgment Kayle", skinIndex: 1, owned: true },
  ],
  Morgana: [
    { name: "Morgana", skinIndex: 0, owned: true },
    { name: "Sinful Succulence Morgana", skinIndex: 1, owned: false },
    { name: "Blade Mistress Morgana", skinIndex: 2, owned: false },
    { name: "Exiled Morgana", skinIndex: 3, owned: false },
  ],
  Warwick: [
    { name: "Warwick", skinIndex: 0, owned: true },
    { name: "Big Bad Warwick", skinIndex: 3, owned: true },
    { name: "Feral Warwick", skinIndex: 5, owned: true },
    { name: "Firefang Warwick", skinIndex: 6, owned: false },
    { name: "Hyena Warwick", skinIndex: 7, owned: false },
  ],
  Ryze: [
    { name: "Ryze", skinIndex: 0, owned: true },
    { name: "Young Ryze", skinIndex: 1, owned: false },
  ],
};

/**
 * Default pick-phase grid champion when no champion is selected by timeout.
 * Morgana: present in pickChampions, has verified skins.
 */
export const DEFAULT_PICK_CHAMPION_ID = "Morgana";

/**
 * Pick-phase team fixture — 4 other players all start "Picking..."
 * and flip to locked fixture champions after the local player locks in.
 * Only the self row shows the chosen champion.
 */
export interface PickTeamMember {
  summonerName: string;
  /** State after lock-in (displayed in loadout handoff). */
  lockedChampionName: string;
  lockedChampionId: string;
  isSelf?: boolean;
}

export const pickTeam: PickTeamMember[] = [
  { summonerName: "qlxHarlan", lockedChampionName: "Anivia", lockedChampionId: "Anivia" },
  { summonerName: "Oppeohtelar", lockedChampionName: "Ashe", lockedChampionId: "Ashe" },
  { summonerName: "cherwood", lockedChampionName: "Warwick", lockedChampionId: "Warwick", isSelf: true },
  { summonerName: "HowarqLqUq", lockedChampionName: "Malphite", lockedChampionId: "Malphite" },
  { summonerName: "CallMeCallMeStar", lockedChampionName: "Kindred", lockedChampionId: "Kindred" },
];

// ---------------------------------------------------------------------------
// Chroma fixtures
// ---------------------------------------------------------------------------

/**
 * A single chroma variant entry.
 *
 * ASSET DIVERGENCE NOTE: DDragon has no chroma render images. In this v1
 * implementation we display the base skin's loading art dimmed + a strip of
 * colored circles derived from the `palette` array to visually differentiate
 * variants. `palette` values are DATA (the actual chroma colors from Riot's
 * design), not styling tokens — storing hex in fixtures is intentional and
 * documented here. Components must never hardcode these values; they receive
 * them as props.
 */
export interface ChromaEntry {
  /** Human-readable chroma name, e.g. "Ruby Mecha Aatrox". */
  name: string;
  /** Whether this chroma is owned in the demo fixture. */
  owned: boolean;
  /**
   * Whether the chroma can currently be obtained. Unavailable chromas are
   * hidden unless "Show Unavailable" is checked (real-client behavior).
   * Absent = available.
   */
  available?: boolean;
  /**
   * 3-4 hex color strings representing the chroma's palette.
   * These are DATA values (the chroma colors themselves), not style tokens.
   * Stored in fixtures, not in components, per project rules.
   */
  palette: string[];
}

/**
 * A skin-line grouping of chromas, e.g. "MECHA AATROX".
 */
export interface ChromaSkinLine {
  /** Skin-line name for the sub-header, e.g. "Mecha Aatrox". */
  skinLineName: string;
  /**
   * DDragon skin index for the base skin's loading art (used dimmed as
   * chroma background per asset-divergence plan).
   */
  baseSkinIndex: number;
  /** Chroma variants in this skin line. */
  chromas: ChromaEntry[];
}

/**
 * Champion-level grouping for the Chromas tab grid.
 */
export interface ChromaChampionGroup {
  /** Human-readable champion name. */
  championName: string;
  /** DDragon champion id (case-sensitive, used for loadingArtUrl). */
  championId: string;
  /** Skin lines for this champion that have chromas available. */
  skinLines: ChromaSkinLine[];
}

/**
 * Demo chromas data for the Collection > Chromas tab.
 *
 * 3 champions × 1-2 skin lines × 3-4 chromas each.
 * Skin indices verified against DDragon loading-art CDN.
 *
 * ASSET DIVERGENCE: DDragon v16.13.1 does not expose chroma render images.
 * Each ChromaEntry uses the parent skin's loadingArtUrl (dimmed via CSS) as
 * background art, plus `palette` hex colors as color-dot identifiers.
 * Palette values are real Riot chroma colors included as data, not style.
 */
export const demoChromas: ChromaChampionGroup[] = [
  {
    championName: "Aatrox",
    championId: "Aatrox",
    skinLines: [
      {
        skinLineName: "Mecha Aatrox",
        baseSkinIndex: 7,  // DDragon 16.13.1: index 4-6 return 403; verified index 7 = Mecha Aatrox
        chromas: [
          { name: "Ruby Mecha Aatrox",   owned: false, palette: ["#c0392b", "#7f0000", "#e74c3c"] },
          { name: "Citrine Mecha Aatrox", owned: false, palette: ["#f39c12", "#e6b800", "#ffd700"] },
          { name: "Pearl Mecha Aatrox",  owned: false, palette: ["#9b59b6", "#6c3483", "#d7bde2"] },
        ],
      },
    ],
  },
  {
    championName: "Ahri",
    championId: "Ahri",
    skinLines: [
      {
        skinLineName: "Popstar Ahri",
        baseSkinIndex: 4,
        chromas: [
          { name: "Catseye Popstar Ahri",  owned: false, palette: ["#8e44ad", "#9b59b6", "#d7bde2"] },
          { name: "Pearl Popstar Ahri",    owned: false, available: false, palette: ["#e056b0", "#c0198a", "#f8a5e0"] },
          { name: "Rose Quartz Popstar Ahri", owned: false, palette: ["#e8a090", "#c07060", "#fad0c0"] },
          { name: "Tanzanite Popstar Ahri", owned: false, palette: ["#e08060", "#b05030", "#f0b090"] },
        ],
      },
    ],
  },
  {
    championName: "Jinx",
    championId: "Jinx",
    skinLines: [
      {
        skinLineName: "Firecracker Jinx",
        baseSkinIndex: 2,
        chromas: [
          { name: "Catseye Firecracker Jinx",  owned: true,  palette: ["#e74c3c", "#c0392b", "#f1948a"] },
          { name: "Pearl Firecracker Jinx",    owned: false, palette: ["#f9f9f9", "#bdc3c7", "#ecf0f1"] },
          { name: "Rose Quartz Firecracker Jinx", owned: false, palette: ["#e56b9a", "#c0396a", "#f0a0c0"] },
        ],
      },
    ],
  },
];
