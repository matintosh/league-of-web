/**
 * Real Universe brand/icon assets from universe.leagueoflegends.com, referenced
 * by public CDN URL (not re-hosted) under the same Riot Games Fan Content Policy
 * basis as the Data Dragon champion art and Map-of-Runeterra pins used elsewhere.
 *
 * Prefer these REAL assets over hand-drawn SVG approximations.
 *
 * NOTE: the `esimages/content_type_icon_*` URLs carry a build hash that Riot may
 * rotate on a site rebuild. If one 404s, re-collect via
 * `node scripts/extract_styles.mjs <url> --selector "img"` or the icons sweep.
 */

const UNIVERSE = "https://universe.leagueoflegends.com";

/** Content-type crest icons (the gold-ring emblem on story cards / section headers). */
export type UniverseContentIcon = "champion" | "latest" | "trending" | "faction";

const CONTENT_ICON: Record<UniverseContentIcon, string> = {
  champion: `${UNIVERSE}/esimages/content_type_icon_champion__3nwJQ.png`,
  latest: `${UNIVERSE}/esimages/content_type_icon_latest__1ulWu.png`,
  trending: `${UNIVERSE}/esimages/content_type_icon_trending__2Bld0.png`,
  faction: `${UNIVERSE}/esimages/content_type_icon_faction__14mjH.png`,
};

/** URL for a Universe content-type crest icon. */
export const universeContentIcon = (type: UniverseContentIcon = "champion"): string =>
  CONTENT_ICON[type];

/** The Riot Games fist logo (RiotBar CDN), used in the Universe top nav. */
export const riotFistLogoUrl = (): string =>
  "https://cmsassets.rgpub.io/sanity/images/dsfx7636/riotbar/7e684cc4765a7d059f9018e16717472d7082dc37-65x97.png";

/**
 * Region crest icon URL. Real slugs differ from display names (Ionia → "iona").
 * Returns null for regions with no published crest icon (caller falls back).
 */
const REGION_CREST_SLUG: Record<string, string> = {
  demacia: "demacia",
  noxus: "noxus",
  ionia: "iona",
  piltover: "piltover",
  "piltover & zaun": "piltover",
  zaun: "zaun",
  bilgewater: "bilgewater",
  shurima: "shurima",
  "shadow isles": "shadow_isles",
  freljord: "freljord",
  ixtal: "ixtal",
  void: "void",
  "the void": "void",
  "bandle city": "bandle_city",
};

export const regionCrestUrl = (region: string): string | null => {
  const slug = REGION_CREST_SLUG[region.trim().toLowerCase()];
  return slug ? `${UNIVERSE}/images/${slug}_crest_icon.png` : null;
};
