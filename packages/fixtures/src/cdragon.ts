/**
 * CommunityDragon — public mirror of the real LoL client assets.
 * Fan-content policy: https://www.riotgames.com/en/legal (fan-made, non-commercial)
 * CommunityDragon: https://raw.communitydragon.org
 *
 * Usage in components: pass returned URLs as `src` to <img> elements.
 * Tokens rule applies to CSS colors, not to asset URLs — these are safe to use.
 */

const CDRAGON_STATIC =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default";

const CDRAGON_PARTIES =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-parties/global/default";

const CDRAGON_TFT =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-tft/global/default";

/**
 * Base URL builder for rcp-fe-lol-static-assets (generic escape hatch).
 * Source: CommunityDragon rcp-fe-lol-static-assets plugin mirror.
 */
export const cdragonStaticUrl = (path: string): string =>
  `${CDRAGON_STATIC}/${path}`;

/**
 * Base URL builder for rcp-fe-lol-parties (map crest PNGs).
 * Source: CommunityDragon rcp-fe-lol-parties plugin mirror.
 */
export const cdragonPartiesUrl = (path: string): string =>
  `${CDRAGON_PARTIES}/${path}`;

/**
 * Riot Points icon — the hexagonal RP coin mark (gold, ~13×14px SVG).
 * Source: CommunityDragon rcp-fe-lol-static-assets · currency/icons/rp.svg
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const rpIconUrl = (): string =>
  cdragonStaticUrl("currency/icons/rp.svg");

/**
 * Blue Essence icon — the hexagonal BE mark (PNG, ~22px).
 * Source: CommunityDragon rcp-fe-lol-static-assets · images/be-icon.png
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const blueEssenceIconUrl = (): string =>
  cdragonStaticUrl("images/be-icon.png");

/**
 * RP icon at a specific pixel size (24, 32, 48, or 72).
 * Source: CommunityDragon rcp-fe-lol-static-assets · images/icon-rp-{size}.png
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const rpIconSizedUrl = (size: 24 | 32 | 48 | 72): string =>
  cdragonStaticUrl(`images/icon-rp-${size}.png`);

/**
 * Navigation bar icon for a named section.
 * Supported names: "loot", "collections", "store", "profile".
 * Source: CommunityDragon rcp-fe-lol-static-assets · images/nav-icon-{name}.svg
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const navIconUrl = (
  name: "loot" | "collections" | "store" | "profile",
): string => cdragonStaticUrl(`images/nav-icon-${name}.svg`);

/**
 * Position (role) icon SVG.
 *
 * The default variant uses Hextech gold fills (#c8aa6e / #785a28) — readable
 * on our dark tokens without filtering.
 * The "light" variant uses near-white fills (#edeeee / #c0c2c2) — prefer for
 * selected/hover states or bright backgrounds.
 * The "red" variant is for enemy-side use (not needed in our client clone).
 *
 * CommunityDragon role slug mapping:
 *   top → top | jungle → jungle | mid → middle | bot → bottom | support → utility
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · svg/position-{role}[-{variant}].svg
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const positionIconUrl = (
  role: "top" | "jungle" | "middle" | "bottom" | "utility",
  variant?: "light" | "red",
): string =>
  cdragonStaticUrl(
    `svg/position-${role}${variant ? `-${variant}` : ""}.svg`,
  );

/**
 * Game mode map crest PNG from the parties plugin.
 * Maps: "sr" = Summoner's Rift | "ha" = Howling Abyss (ARAM) |
 *        "tft" = Teamfight Tactics | "tt" = Twisted Treeline | "rgm" = RGM/misc.
 * Source: CommunityDragon rcp-fe-lol-parties · map_{map}.png
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const gameModeMapUrl = (
  map: "sr" | "ha" | "tft" | "tt" | "rgm",
): string => cdragonPartiesUrl(`map_${map}.png`);

/**
 * Ranked tier mini-crest SVG (small badge form, used in profile chips etc.).
 * Tier should be lowercase, e.g. "gold", "silver", "diamond".
 * Source: CommunityDragon rcp-fe-lol-static-assets · ranked-mini-crests/{tier}.svg
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const rankedMiniCrestUrl = (tier: string): string =>
  cdragonStaticUrl(`ranked-mini-crests/${tier.toLowerCase()}.svg`);

/**
 * Ranked emblem PNG (full-size shield art) from the magisteriis/lol-icons-and-emblems
 * repository on jsDelivr CDN.
 * Supported tiers: Iron, Bronze, Silver, Gold, Platinum, Diamond, Master, Grandmaster, Challenger.
 * Note: Emerald is NOT available (404 as of 2026-07 — not included in that repo).
 * Source: https://cdn.jsdelivr.net/gh/magisteriis/lol-icons-and-emblems@main/ranked-emblems/Emblem_{Tier}.png
 * License: Unlicense (public domain) — https://github.com/magisteriis/lol-icons-and-emblems
 */
export const rankedEmblemUrl = (
  tier:
    | "Iron"
    | "Bronze"
    | "Silver"
    | "Gold"
    | "Platinum"
    | "Diamond"
    | "Master"
    | "Grandmaster"
    | "Challenger",
): string =>
  `https://cdn.jsdelivr.net/gh/magisteriis/lol-icons-and-emblems@main/ranked-emblems/Emblem_${tier}.png`;

/**
 * Unranked queue crest URL — the emblem-family asset used when a summoner
 * has no rank yet (as opposed to `rankedMiniCrestUrl("unranked")` which is a
 * 16px SVG ring suitable only for small badge indicators).
 *
 * Asset decision: no "Unranked" entry exists in either the magisteriis set or
 * CommunityDragon ranked-emblem/ directory (confirmed 2026-07 via API listing).
 * The reference screenshot shows a desaturated grey metallic shield — visually
 * indistinguishable from a grayscale Iron emblem. We therefore use Emblem_Iron
 * from the magisteriis set (512×585px) and rely on the component's
 * `opacity-25 grayscale` CSS treatment to render it as the reference's
 * "no rank yet" dimmed shield.
 *
 * Source: magisteriis/lol-icons-and-emblems (jsDelivr CDN) — same set as rankedEmblemUrl.
 * License: Unlicense (public domain) — https://github.com/magisteriis/lol-icons-and-emblems
 */
export const rankedUnrankedEmblemUrl = (): string =>
  `https://cdn.jsdelivr.net/gh/magisteriis/lol-icons-and-emblems@main/ranked-emblems/Emblem_Iron.png`;

/**
 * Champion mastery crest PNG from the CommunityDragon game-assets UX mirror.
 *
 * Level range: 0 (no mastery), 4–10. The modern client (post-2023) uses the
 * "legendarychampionmastery" set. Level 1–3 are shown as level 0 in the client.
 *
 * Returns the full-size crest (24–27 KiB PNG, 256×256 px) by default.
 * Pass `mini: true` to get the strip-sprite mini version (~2–3 KiB).
 *
 * Source: CommunityDragon game/assets/ux/mastery/legendarychampionmastery/
 * License: Riot fan-content policy (non-commercial fan use).
 * Assets confirmed 200 OK (2026-07, issue #245).
 */
export const masteryCrestUrl = (
  level: 0 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
  mini = false,
): string =>
  `https://raw.communitydragon.org/latest/game/assets/ux/mastery/legendarychampionmastery/masterycrest_level${level}${mini ? "_minis" : ""}.png`;

/**
 * TFT rank-up arrow SVG — two stacked upward chevrons (the TFT tier improvement emblem).
 * viewBox 0 0 40 40, native fill #c8aa6e (Hextech gold).
 *
 * NOTE: This asset uses a hardcoded fill in its <style> block — it cannot receive
 * currentColor when loaded via <img>. For token-colored use, inline the SVG paths
 * directly in the component (see TftMissionBadge in tft-hub-screen.tsx).
 * This URL is provided for reference / non-colored display only.
 *
 * Source: CommunityDragon rcp-fe-lol-tft · images/tft_up_arrow.svg
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const tftUpArrowUrl = (): string =>
  `${CDRAGON_TFT}/images/tft_up_arrow.svg`;

/**
 * Ranked intro promotional art — the three feature-tile images shown on the
 * ProfileRankedScreen when the player has no rank yet (or is viewing ranked info).
 *
 * Slugs:
 *   "squad-up"  → ranked-intro-squad-up.jpg  — blue "MATCH FOUND" modal screenshot (276×157)
 *   "earn-rank" → ranked-intro-earn-rank.png  — Challenger/Diamond wings rank emblem (276×157)
 *   "epic-loot" → ranked-intro-epic-loot.jpg  — Sivir victorious skin face close-up (276×157)
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · ranked-intro-{slug}.{ext}
 * License: Riot fan-content policy (non-commercial fan use).
 * Assets confirmed 200 + correct dimensions (2026-07, issue #234).
 */
export const rankedIntroUrl = (
  slug: "squad-up" | "earn-rank" | "epic-loot",
): string =>
  cdragonStaticUrl(`ranked-intro-${slug}.${slug === "earn-rank" ? "png" : "jpg"}`);

/**
 * Mastery crest image from rcp-fe-lol-collections (mastery-header folder).
 *
 * Level-specific crest PNGs (e.g. mastery-crest-level-11.png) do NOT exist
 * as static CDragon assets — the real client assembles the crest from layered
 * SVG/CSS composites keyed by JSON config, which are not individually
 * extractable. The available static images are:
 *
 *   ftux-mock-crest-level-10.png  — promotional screenshot of a level-10 crest (~2× quality)
 *   mastery-crest-mini-gray.png   — 16px grayscale mini crest used in cards
 *
 * Decision: for levels ≥ 5, return the `ftux-mock-crest-level-10.png` preview
 * art (the reference shows level 11 which looks identical in form). For lower
 * levels, fall back to the mini-gray (the component supplements with an inline
 * SVG ring). Callers should also display the level number overtop the image.
 *
 * Source: CommunityDragon rcp-fe-lol-collections/global/default/images/mastery-header/
 * License: Riot fan-content policy (non-commercial fan use).
 * Assets confirmed HTTP 200 (2026-07, issue #246).
 */
export const masteryCrestUrl = (level: number): string => {
  const BASE =
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-collections/global/default/images/mastery-header";
  return level >= 5
    ? `${BASE}/ftux-mock-crest-level-10.png`
    : `${BASE}/mastery-crest-mini-gray.png`;
};

/*
 * MODE-SELECT BACKGROUND — CDragon asset search result (2026-07, issue #218).
 *
 * The Twisted Treeline forest art shown on the PvP mode-select screen (bare
 * tree silhouettes, purple-grey sky, misty center glow) is NOT available via
 * CommunityDragon. Paths searched:
 *   rcp-fe-lol-parties/global/default/           — map crest PNGs + lottie/webm only
 *   rcp-fe-lol-static-assets/global/default/backgrounds/ — role-swapping, sanctum, roll-vignette
 *   rcp-fe-lol-static-assets/global/default/     — teal/blue magical smoke assets only
 *   rcp-fe-lol-navigation/global/default/images/ — nav/header UI assets only
 *   rcp-fe-lol-game-select/                      — plugin returns 404
 *   game/data/menu/                              — no static bg listed
 *
 * The background is baked into the client shell. The screen uses a layered
 * CSS gradient fallback (see apps/web/src/app/mode-select-screen.tsx).
 * If a future CDragon mirror surfaces the asset, add a `modeSelectBgUrl()`
 * helper here following the pattern of cdragonStaticUrl(), and swap in an
 * <img> tag in the screen file.
 */
