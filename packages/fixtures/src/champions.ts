// ---------------------------------------------------------------------------
// Champion fixtures
// ---------------------------------------------------------------------------

export interface ChampionSummary {
  id: string;
  name: string;
}

/**
 * Returns the DDragon loading-art URL for a champion.
 * Pattern: https://ddragon.leagueoflegends.com/cdn/img/champion/loading/{id}_{skin}.jpg
 *
 * IMPORTANT: IDs must match DDragon exactly (case-sensitive).
 * e.g. "Kaisa" (not "KaiSa" — 403 Forbidden), "LeeSin", "MissFortune".
 */
export function loadingArtUrl(id: string, skin = 0): string {
  return `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${id}_${skin}.jpg`;
}

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
