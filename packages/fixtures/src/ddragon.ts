/** Riot Data Dragon — public CDN, no API key. https://developer.riotgames.com/docs/lol#data-dragon */
export const DDRAGON_VERSION = "16.13.1";

const BASE = "https://ddragon.leagueoflegends.com";

/** Square champion icon, 120x120. `id` is the ddragon champion id, e.g. "Ahri", "LeeSin". */
export const championSquareUrl = (id: string): string =>
  `${BASE}/cdn/${DDRAGON_VERSION}/img/champion/${id}.png`;

/** Full splash art, 1215x717. `skin` 0 = default. */
export const championSplashUrl = (id: string, skin = 0): string =>
  `${BASE}/cdn/img/champion/splash/${id}_${skin}.jpg`;

/**
 * Returns the DDragon loading-art URL for a champion.
 * Pattern: https://ddragon.leagueoflegends.com/cdn/img/champion/loading/{id}_{skin}.jpg
 *
 * IMPORTANT: IDs must match DDragon exactly (case-sensitive).
 * e.g. "Kaisa" (not "KaiSa" — 403 Forbidden), "LeeSin", "MissFortune".
 */
export function loadingArtUrl(id: string, skin = 0): string {
  return `${BASE}/cdn/img/champion/loading/${id}_${skin}.jpg`;
}

/** Summoner profile icon. */
export const profileIconUrl = (id: number): string =>
  `${BASE}/cdn/${DDRAGON_VERSION}/img/profileicon/${id}.png`;
