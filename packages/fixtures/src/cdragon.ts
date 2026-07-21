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

const CDRAGON_GAME_DATA =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default";

const CDRAGON_CHAMP_SELECT =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champ-select/global/default";

const CDRAGON_UIKIT =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-uikit/global/default";

const CDRAGON_SOCIAL =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-social/global/default";

const CDRAGON_NAVIGATION =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-navigation/global/default";

/**
 * Summoner spell icon URL via CDragon game data.
 *
 * `iconBaseName` is the lowercased filename from CDragon v1/summoner-spells.json
 * `iconPath` field (e.g. "summoner_flash", "summonerignite").
 *
 * These icons are distinct from DDragon's `SummonerFlash.png` naming convention —
 * CDragon paths are all-lowercase with underscores and resolve to ~40×40 PNG art
 * that matches the in-client spell slot icons exactly.
 *
 * Examples confirmed HTTP 200 (2026-07):
 *   summonerSpellIconUrl("summoner_flash")   → Flash icon
 *   summonerSpellIconUrl("summonerignite")   → Ignite icon (NOT "summoner_dot" — 404)
 *
 * Source: CommunityDragon rcp-be-lol-game-data · data/spells/icons2d/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const summonerSpellIconUrl = (iconBaseName: string): string =>
  `${CDRAGON_GAME_DATA}/data/spells/icons2d/${iconBaseName.toLowerCase()}.png`;

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
 * Client video (.webm) asset URL. The real client centralizes ALL its UI
 * magic/ambient videos under rcp-fe-lol-static-assets `videos/` — the
 * WAD-extracted corpus maps 1:1 by relative path into this subtree
 * (see docs/reference/VIDEO-ASSETS.md; 198/198 curl-verified 206 video/webm,
 * 194 with alpha).
 *
 * Examples confirmed HTTP 206 (2026-07):
 *   staticVideoUrl("play-button-hover-loop.webm")
 *   staticVideoUrl("find-match-button-idle.webm")
 *   staticVideoUrl("timer-countdown.webm")
 *   staticVideoUrl("ranked/emblem-wings-magic-gold.webm")
 *
 * Encode parens in filenames (%28/%29) — browsers 404 on raw parens.
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const staticVideoUrl = (path: string): string =>
  `${CDRAGON_STATIC}/videos/${path}`;

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
 * Updates / notifications nav-band glyph — the player-bust badge that sits in
 * the current-era top-nav icon cluster (era shift #384/#386). Shares the same
 * 26×24 band canvas as the profile/collections glyphs.
 * Source: CommunityDragon rcp-fe-lol-static-assets · images/top-nav-updates-eat-icon.svg
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const navUpdatesIconUrl = (): string =>
  cdragonStaticUrl("images/top-nav-updates-eat-icon.svg");

/**
 * RP top-up button glyph for the current-era currency block (era shift #386) —
 * a circular dark disc with a gold `+`, the "add RP" affordance at the right
 * end of the RP capsule. Ships three interactive states (20×20 SVG each).
 * Source: CommunityDragon rcp-fe-lol-static-assets · images/rp-top-up-nav-{state}.svg
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const rpTopUpIconUrl = (
  state: "resting" | "hover" | "pressed" = "resting",
): string => cdragonStaticUrl(`images/rp-top-up-nav-${state}.svg`);

/**
 * Missions / objectives nav glyph from the navigation plugin (era shift #386).
 * "mission" = gold scroll/objective list, "daily" = down-arrow daily reward,
 * "all" = grid/list rows. All 20×20 SVG, `#cdbe91`-family cream fill.
 * Source: CommunityDragon rcp-fe-lol-navigation · {name}icon.svg
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const navMissionIconUrl = (
  name: "mission" | "daily" | "all" = "mission",
): string => `${CDRAGON_NAVIGATION}/${name}icon.svg`;

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
 * Ranked tiers that ship an animated emblem-wings "magic" video.
 *
 * NOTE: this set intentionally has **no iron** — the client ships wing videos
 * only from bronze up. It **does** include `emerald`, which is missing from the
 * jsDelivr emblem PNG set consumed by `rankedEmblemUrl` (see
 * docs/reference/ICON-SOURCES.md). Kept separate from `ChallengeTier` (which
 * has iron and no emerald) because the two asset families differ by tier.
 */
export type RankedWingTier =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "emerald"
  | "diamond"
  | "master"
  | "grandmaster"
  | "challenger";

/**
 * Animated ranked-emblem "wings" magic video (webm, alpha channel) for a tier —
 * the ethereal wing flourish that cradles the tier crest on the profile Ranked
 * screen. Each clip is 208×270, ~2.7–3.0s, and loops; the crest sits in the
 * central void the wings wrap (see docs/reference/VIDEO-ASSETS.md, ranked/).
 *
 * Feed the returned URL to a `<video>` alpha overlay (muted/autoPlay/loop/
 * playsInline) layered over the static tier emblem — e.g. as the `wingVideoSrc`
 * of a `ProfileRankedScreen` feature column.
 *
 * Examples confirmed HTTP 206 video/webm (2026-07):
 *   rankedWingVideoUrl("gold")       → …/videos/ranked/emblem-wings-magic-gold.webm
 *   rankedWingVideoUrl("emerald")    → …/videos/ranked/emblem-wings-magic-emerald.webm
 *   rankedWingVideoUrl("challenger") → …/videos/ranked/emblem-wings-magic-challenger.webm
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/ranked/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const rankedWingVideoUrl = (tier: RankedWingTier): string =>
  staticVideoUrl(`ranked/emblem-wings-magic-${tier}.webm`);

/**
 * Tier a promotion celebration animates AWAY FROM (the "old tier" clip that
 * opens the sequence). The `-from-` set is the departing rank, so it spans
 * `unranked` up through `grandmaster` but has **no `challenger`** — nobody is
 * ever promoted *from* the apex tier (confirmed 404 on `tier-promotion-from-
 * challenger`, 2026-07). It DOES include `emerald` (the WAD ranked video set
 * carries emerald, unlike the jsDelivr emblem PNGs — see [[RankedWingTier]]).
 */
export type TierPromotionFromTier =
  | "unranked"
  | "iron"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "emerald"
  | "diamond"
  | "master"
  | "grandmaster";

/**
 * Tier a promotion celebration animates INTO (the "new tier" clip that closes
 * the sequence). The `-to-` set is the arriving rank, so it spans `iron` up
 * through `challenger` but has **no `unranked`** — a promotion never lands you
 * back at no-rank (confirmed 404 on `tier-promotion-to-unranked`, 2026-07).
 * Includes `emerald`, as with the `-from-` set.
 */
export type TierPromotionToTier =
  | "iron"
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "emerald"
  | "diamond"
  | "master"
  | "grandmaster"
  | "challenger";

/**
 * Ranked tier-promotion celebration video (webm, alpha channel), 1280×720
 * full-frame. Two directions compose one celebration:
 *   - `"from"` — the departing "old tier" open (~2.4s), one of
 *     {@link TierPromotionFromTier}.
 *   - `"to"` — the arriving "new tier" payoff (~4.6–6.8s), one of
 *     {@link TierPromotionToTier}.
 * Feed both to `RankPromotionOverlay` (fromSrc/toSrc): it plays `from` once,
 * crossfades, then plays `to` once. The clips are straight-alpha overlays —
 * render them muted/autoPlay/playsInline with no loop (see
 * docs/reference/VIDEO-ASSETS.md, ranked/).
 *
 * The `direction` narrows the accepted `tier` union, so an invalid pairing
 * (e.g. `"to"` + `"unranked"`) is a compile error rather than a 404.
 *
 * Examples confirmed HTTP 206 video/webm (2026-07):
 *   tierPromotionVideoUrl("from", "gold")       → …/videos/ranked/tier-promotion-from-gold.webm
 *   tierPromotionVideoUrl("from", "unranked")   → …/videos/ranked/tier-promotion-from-unranked.webm
 *   tierPromotionVideoUrl("to", "platinum")     → …/videos/ranked/tier-promotion-to-platinum.webm
 *   tierPromotionVideoUrl("to", "challenger")   → …/videos/ranked/tier-promotion-to-challenger.webm
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/ranked/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export function tierPromotionVideoUrl(
  direction: "from",
  tier: TierPromotionFromTier,
): string;
export function tierPromotionVideoUrl(
  direction: "to",
  tier: TierPromotionToTier,
): string;
export function tierPromotionVideoUrl(
  direction: "from" | "to",
  tier: TierPromotionFromTier | TierPromotionToTier,
): string {
  return staticVideoUrl(`ranked/tier-promotion-${direction}-${tier}.webm`);
}

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
 * FTUX-mock mastery crest from rcp-fe-lol-collections (mastery-header folder).
 * Distinct from masteryCrestUrl() (real per-level game-asset crests) — this is
 * the large promotional crest used by ChampionDetail's Mastery tab header.
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
export const masteryFtuxCrestUrl = (level: number): string => {
  const BASE =
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-collections/global/default/images/mastery-header";
  return level >= 5
    ? `${BASE}/ftux-mock-crest-level-10.png`
    : `${BASE}/mastery-crest-mini-gray.png`;
};

/* ---------------------------------------------------------------------------
 * VIDEO (.webm) HELPERS — issue #301
 *
 * CommunityDragon raw-mirrors the real client's ambient/magic .webm loops.
 * The CDN honors HTTP range requests (returns 206 video/webm), so these URLs
 * stream directly from a <video src> / <source> element — no download needed.
 * DDragon ships NO video assets; CDragon is the only mirror for these.
 *
 * Usage in components: pass returned URLs as <video src> (typically muted,
 * autoPlay, loop, playsInline for ambient background loops).
 * All patterns curl-verified 206 video/webm (2026-07, issue #301).
 * License: Riot fan-content policy (non-commercial fan use).
 * ------------------------------------------------------------------------- */

/**
 * Ambient background-loop webm from the parties plugin — the subtle animated
 * Hextech backdrops behind party-status / queue / social panels.
 *
 * Slugs (each resolves to `{slug}-bg-loop.webm`):
 *   "party-status" → party-status-bg-loop.webm
 *   "queue-delay"  → queue-delay-bg-loop.webm
 *   "social-panel" → social-panel-bg-loop.webm
 *
 * Source: CommunityDragon rcp-fe-lol-parties · {slug}-bg-loop.webm
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const partiesBgLoopUrl = (
  slug: "party-status" | "queue-delay" | "social-panel",
): string => cdragonPartiesUrl(`${slug}-bg-loop.webm`);

/**
 * Social-panel ambient background-loop webm from the rcp-fe-lol-social plugin —
 * the subtle animated Hextech backdrop the real client plays behind the friends
 * list. Distinct from `partiesBgLoopUrl("social-panel")` (parties plugin): this
 * is the social plugin's own `socialpanel_bgloop.webm`, the loop that actually
 * sits behind the docked friends rail.
 *
 * The clip is 222×202, ~5s, and OPAQUE (no alpha — bright Hextech glow on a near
 * -black field). Composite it screen-blended so the dark field drops out and only
 * the glow adds over the panel's static `bg-blue-7` — the default AmbientVideoLayer
 * treatment (probed 2026-07, minAlpha 255).
 *
 * Confirmed HTTP 206 video/webm (range request, 2026-07). Feed the returned URL
 * to a muted/autoPlay/loop/playsInline `<video>` overlay (e.g. the
 * `ambientVideoSrc` of `SocialPanel`). NO fetching happens here — pages supply URLs.
 *
 * Source: CommunityDragon rcp-fe-lol-social · videos/socialpanel_bgloop.webm
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const socialPanelBgLoopUrl = (): string =>
  `${CDRAGON_SOCIAL}/videos/socialpanel_bgloop.webm`;

/**
 * Champ-select summoner-object magic banner webm — the animated gem/rune
 * flourish that plays around the summoner name plate during champion select.
 *
 * `side`  the team color: "blue" | "gold" | "red" (gold = local player).
 * `phase` the animation segment: "intro" (play once in), "idle" (loop),
 *         "outro" (play once out).
 *
 * All 9 side×phase combinations resolve to
 * `summoner-object-magic-action-{side}-{phase}.webm`.
 *
 * Source: CommunityDragon rcp-fe-lol-champ-select · video/summoner-object/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const summonerObjectMagicUrl = (
  side: "blue" | "gold" | "red",
  phase: "intro" | "idle" | "outro",
): string =>
  `${CDRAGON_CHAMP_SELECT}/video/summoner-object/summoner-object-magic-action-${side}-${phase}.webm`;

/**
 * uikit celebration / vignette magic webm — full-screen Hextech celebration
 * overlays (e.g. post-game / reward reveal).
 *
 * Kinds (each resolves to `{kind}-magic.webm`):
 *   "celebration-bg"              → celebration-bg-magic.webm (~1.2 MB looping backdrop)
 *   "vignette-celebration-intro"  → vignette-celebration-intro-magic.webm (edge vignette flourish)
 *
 * Source: CommunityDragon rcp-fe-lol-uikit · videos/{kind}-magic.webm
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const uikitCelebrationMagicUrl = (
  kind: "celebration-bg" | "vignette-celebration-intro",
): string => `${CDRAGON_UIKIT}/videos/${kind}-magic.webm`;

/**
 * FIND MATCH button state-machine webm (issue #310).
 *
 * The real client's per-state FIND MATCH button frame/glow videos (VP9 with a
 * straight alpha channel — composite as a plain overlay, not screen-blended).
 * CommunityDragon mirrors all six under the static-assets `videos/` subtree
 * (curl-verified 206 video/webm with range support, 2026-07), so they stream
 * directly from a <video src> — no repo commit needed. (The rcp-fe-lol-parties
 * plugin only mirrors the static PNG frames + SFX; the animated .webm live in
 * rcp-fe-lol-static-assets/videos/ and are reached via `staticVideoUrl`.)
 *
 * States → `find-match-button-{state}.webm`:
 *   "intro"        one-shot reveal — white border traces the trapezoid (1.1 s, 230×100)
 *   "idle"         ambient shimmer loop behind the fill (7.6 s, 230×100)
 *   "hover"        bright cyan aurora fill + white border glow (4.8 s, 230×100)
 *   "active"       pressed/engaged energy streaks (1.3 s, 230×100)
 *   "pulse"        green attention-pulse sweep, party ready-to-start (1.6 s, 300×200)
 *   "all-returned" steady green outline glow, party all-ready (5 s, 300×200)
 *
 * NOTE: intro/idle/hover/active are 230×100; pulse/all-returned are 300×200
 * (larger green glow bleed). The LockInButton overlay centers each on the
 * button and lets the bleed extend beyond the trapezoid (pointer-events-none).
 *
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const findMatchVideoUrl = (
  state: "intro" | "idle" | "hover" | "active" | "pulse" | "all-returned",
): string => staticVideoUrl(`find-match-button-${state}.webm`);

/**
 * Real-client PLAY-button magic-layer video (webm, straight alpha) for a given
 * state — the authentic "animated border overlay / radial effects" layers of
 * the magic-button anatomy (docs/reference/HEXTECH-UI-NOTES.md) that the CSS v7
 * PlayButton approximates. Each clip is 146×58 and composites straight (its own
 * alpha) over the static button; transparent regions let the CSS frame read
 * through, so a video that fails to load leaves the static look intact.
 *
 * States → `play-button-{state}.webm`:
 *   "enabled-intro" one-shot reveal — particle burst played once when the
 *                   button becomes enabled, then handed off to idle (1.6 s)
 *   "hover-intro"   one-shot hover-in — cyan border trace ramps up (1.1 s)
 *   "hover-loop"    ambient hover loop — bright cyan frame + travelling border
 *                   shimmer, the "animated border overlay" (2.4 s, loops)
 *   "hover-outro"   one-shot hover-out — border trace fades down (0.4 s)
 *   "magic-release" press-release magic burst — cyan energy flare (1.1 s)
 *   "release"       press-release — restrained particle pop (1.2 s)
 *
 * All confirmed HTTP 206 video/webm with alpha (2026-07). Feed the returned URL
 * to a muted/playsInline `<video>` overlay layered over the CSS button (e.g. the
 * `videoSources` of `PlayButton`). NO fetching happens here — pages supply URLs.
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const playButtonVideoUrl = (
  state:
    | "enabled-intro"
    | "hover-intro"
    | "hover-loop"
    | "hover-outro"
    | "magic-release"
    | "release",
): string => staticVideoUrl(`play-button-${state}.webm`);

/**
 * Generic Hextech button particle-layer video (webm, straight alpha) — the
 * ambient/hover/pressed particle drifts the real client stacks behind primary
 * buttons (150×80). Additive accent overlays; NOT the button frame itself.
 *
 * States → `buttons/particles-{state}.webm`:
 *   "default" ambient particle drift loop (5 s)
 *   "hover"   denser hover particles (5 s, loops)
 *   "pressed" one-shot press particle pop (0.4 s)
 *
 * Confirmed HTTP 206 video/webm with alpha (2026-07). Reachable by both the
 * PlayButton and the lobby button; feed to a `<video>` overlay.
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/buttons/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const buttonParticlesVideoUrl = (
  state: "default" | "hover" | "pressed",
): string => staticVideoUrl(`buttons/particles-${state}.webm`);

/**
 * Real-client League "L" logo-medallion magic video (webm, straight alpha) for
 * a given state — the animation of the PLAY-button medallion socket (64×54).
 * Scope note on issue #309 (builder-316 investigation): this set IS the
 * PlayButton medallion socket animation, wired via `PlayButton`'s
 * `medallionVideoSources`. Composites straight (own alpha) over the static
 * emblem, so a missing/broken clip leaves the CSS medallion intact.
 *
 * States → `league-logo-{state}.webm`:
 *   "intro"       one-shot reveal — bronze L outline fills to gold L + teal
 *                 energy socket, played once on mount (2.9 s)
 *   "loop-idle"   calm teal energy swirl in the socket (4.8 s, loops)
 *   "loop-active" energetic teal swirl — the engaged/hover face (2.4 s, loops)
 *   "magic"       one-shot gold-rim glow + cyan flash accent (1.2 s)
 *
 * All confirmed HTTP 206 video/webm with alpha (2026-07). Frame captures in the
 * #316 close trail. NO fetching happens here — pages supply URLs.
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const leagueLogoVideoUrl = (
  state: "intro" | "loop-idle" | "loop-active" | "magic",
): string => staticVideoUrl(`league-logo-${state}.webm`);

/**
 * Real-client lobby player-flag banner-sweep magic video (webm, straight alpha)
 * for a given kind — the one-shot entrance flourish the live client sweeps over a
 * party banner as a member loads in: a gold light streaks down the flag, the whole
 * heraldic silhouette lights up (teal side rails, a gold ring at the medallion, the
 * bottom double-V chevron), then settles. Each clip is 272×620 — the exact aspect
 * of the `lobby/player-banner` flag box — and ~1.8 s, played ONCE (not looped).
 * Composites straight (its own alpha) over the static banner, so a clip that fails
 * to load leaves the static flag intact.
 *
 * Kinds → `banner_{kind}.webm`:
 *   "primary" the self / local-player banner sweep (warmer gold) — banner_primary.webm
 *   "ally"    an ally / teammate banner sweep (cooler)           — banner_ally.webm
 *
 * Both confirmed HTTP 206 video/webm with alpha (2026-07). Feed the returned URL to
 * a muted/autoPlay/playsInline `<video>` overlay layered over the static flag (e.g.
 * the `sweepVideoSrc` of `PlayerBanner`): primary for the isSelf slot, ally for the
 * other members. NO fetching happens here — pages supply URLs.
 *
 * NOTE: `provisional-banner-loop.webm` (272×660, profile-banner family) is a
 * different, looping asset and is intentionally NOT covered by this helper.
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/banner_{kind}.webm
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const bannerSweepVideoUrl = (kind: "primary" | "ally"): string =>
  staticVideoUrl(`banner_${kind}.webm`);

/**
 * Real-client lobby party-flag chrome art (issue #336) — the STATIC heraldic
 * banner PNG the live client paints behind each party member. Each file is a
 * straight-alpha PNG carrying the whole flag silhouette (scooped-neck top,
 * ornate gold corner scrolls, double-V pointed bottom) plus its gold hairline
 * trim, so it drops in as a single background `<img>` filling the flag box —
 * no CSS clip-path or hand-painted border needed. The `lobby/player-banner`
 * component's own avatar crest / tier gem / badges / role row composite ON TOP.
 *
 * Kinds → parties-plugin file:
 *   "filled"  → banner-filled.png          (968×1400) — a seated member: navy
 *               fill, warm gold trim + corner scrolls. Used for self AND
 *               teammate slots (self is brightened via component styling).
 *   "empty"   → banner-empty.png           (968×1376) — an unfilled slot: the
 *               same silhouette desaturated to cool grey-blue, no gold.
 *   "self"    → current-player-banner.png  (234×400)  — the local-player flag
 *               with a teal wash and a gold medallion ring baked at top-centre.
 *               Provided for completeness; the component uses "filled" for self
 *               so its live AvatarCrest ring isn't doubled by the baked ring.
 *   "invited" → invited-banner.png         (178×550)  — the searching/invited
 *               slot: dark panel with a glowing blue summon ring, matching the
 *               queueing empty treatment.
 *
 * All four confirmed HTTP 206 image/png (range request, 2026-07). Pass the
 * returned URL as an <img> `src`. NO fetching happens here — pages/components
 * supply the resolved URL. Tokens rule applies to CSS colors, not asset URLs.
 *
 * Source: CommunityDragon rcp-fe-lol-parties · {file}
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const partyBannerUrl = (
  kind: "filled" | "empty" | "self" | "invited",
): string => {
  const FILE: Record<typeof kind, string> = {
    filled: "banner-filled.png",
    empty: "banner-empty.png",
    self: "current-player-banner.png",
    invited: "invited-banner.png",
  };
  return cdragonPartiesUrl(FILE[kind]);
};

/**
 * Exalted (Mythic) skin card-frame tier. The Mythic Shop's exalted cards ship
 * three ascending rarity frames, each a distinct art-deco border treatment:
 *   "one"   — gold/teal banner (tier 1)
 *   "two"   — purple-accented frame (tier 2)
 *   "three" — white/prismatic apex frame (tier 3)
 * Named by the client's own file slugs (`tierone`/`tiertwo`/`tierthree`).
 */
export type ExaltedTier = "one" | "two" | "three";

/**
 * Animation part of an exalted card-frame sequence. All four are full-frame
 * 400×512 straight-alpha overlays (NOT spatial halves — verified by probing
 * mid-clip frames on a dark canvas, docs/reference/VIDEO-ASSETS.md exalted/):
 *   "top"   — one-shot reveal phase 1: the pennant/banner outline sweeps in
 *             (side rails + bottom V-point light up). ~1.0–2.4s.
 *   "bot"   — one-shot reveal phase 2: the full rounded frame settles — interior
 *             arch, ornamental crest watermark, corner chevrons, glowing rim, a
 *             teal diamond spark at bottom-center. Hands off to the idle loop.
 *             ~1.0–1.5s.
 *   "loop"  — idle ambient: sparse tier-tinted sparkle drift over the settled
 *             frame. ~3.0s, loops. **Not available for tier "three"** (see
 *             {@link exaltedCardVideoUrl}).
 *   "hover" — hover flourish: the full art-deco border traced bright, swapped in
 *             on pointer-over. ~2.7s.
 */
export type ExaltedCardPart = "top" | "bot" | "loop" | "hover";

/**
 * Exalted (Mythic) skin card-frame magic video (webm, straight alpha) for a
 * tier + animation part — the animated art-deco border the live client wraps
 * around exalted cards in the Mythic Shop (`store/mythic-shop-panel`). Each clip
 * is 400×512 and composites straight (its own alpha) over the card's splash art,
 * so a clip that fails to load leaves the static card intact.
 *
 * Sequence per card: `top` → `bot` play once as the reveal, then `loop` idles,
 * with `hover` crossfading in on pointer-over (all full-frame overlays — the
 * top/bot names are temporal phases, not cropped halves; see {@link ExaltedCardPart}).
 *
 * ASYMMETRY — tier three has NO idle loop. The client ships only 11 exalted
 * files: tiers one and two carry all four parts, but `tierthree` ships just
 * top/bot/hover (confirmed 404 on `card-frame-tierthree-loop.webm`, 2026-07).
 * This is encoded in the type: `part: "loop"` narrows `tier` to `"one" | "two"`,
 * so `exaltedCardVideoUrl("three", "loop")` is a COMPILE ERROR rather than a
 * runtime 404. The consuming component treats tier-three's missing loop as
 * graceful absence — after the reveal it simply rests on the settled `bot`
 * frame with no ambient drift.
 *
 * Examples confirmed HTTP 206 video/webm with alpha (2026-07):
 *   exaltedCardVideoUrl("one", "top")     → …/videos/exalted/card-frame-tierone-top.webm
 *   exaltedCardVideoUrl("one", "loop")    → …/videos/exalted/card-frame-tierone-loop.webm
 *   exaltedCardVideoUrl("two", "hover")   → …/videos/exalted/card-frame-tiertwo-hover.webm
 *   exaltedCardVideoUrl("three", "bot")   → …/videos/exalted/card-frame-tierthree-bot.webm
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/exalted/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export function exaltedCardVideoUrl(
  tier: "one" | "two",
  part: "loop",
): string;
export function exaltedCardVideoUrl(
  tier: ExaltedTier,
  part: "top" | "bot" | "hover",
): string;
export function exaltedCardVideoUrl(
  tier: ExaltedTier,
  part: ExaltedCardPart,
): string {
  return staticVideoUrl(`exalted/card-frame-tier${tier}-${part}.webm`);
}

/**
 * Champ-select declare-intent (position-assignment) team side. The map reveal
 * and lane-path videos are authored per team side of Summoner's Rift:
 *   "north" — the blue-side view (matches the reference screenshot)
 *   "south" — the red-side view
 */
export type DeclareSide = "north" | "south";

/** Roles that ship a lane-path light-up video. Support has NO path (see below). */
export type DeclarePathRole = "top" | "jungle" | "middle" | "bottom";

/**
 * Champ-select declare-intent MAP-INTRO reveal video (webm, OPAQUE, 1280×720).
 * The full Summoner's Rift island reveal that opens the position-assignment
 * phase — played ONCE as the map stage backdrop.
 *
 *   declareMapIntroUrl("north") → …/video/position-assignment-intro/map-north-intro.webm
 *   declareMapIntroUrl("south") → …/video/position-assignment-intro/map-south-intro.webm
 *
 * NOTE: these live under the rcp-fe-lol-champ-select plugin's own `video/`
 * subtree (NOT the shared rcp-fe-lol-static-assets `videos/`). Confirmed HTTP
 * 206 video/webm (2026-07-14).
 *
 * Source: CommunityDragon rcp-fe-lol-champ-select · video/position-assignment-intro/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const declareMapIntroUrl = (side: DeclareSide): string =>
  `${CDRAGON_CHAMP_SELECT}/video/position-assignment-intro/map-${side}-intro.webm`;

/**
 * Champ-select declare-intent LANE-PATH light-up video (webm, straight alpha,
 * 264×214) for a team side + role — the glowing cyan lane that lights up when a
 * role is assigned, one-shot. Composited straight (own alpha) onto the lane on
 * the map stage.
 *
 * The catalog ships exactly 8 paths: {north,south} × {top,jungle,middle,bottom}.
 * There is NO support (`utility`) path — support is given pin-only treatment on
 * the map. This is why the role union here is {@link DeclarePathRole}, not the
 * full five-role set (calling with support would be a compile error).
 *
 * NOTE: the CDragon filenames use the abbreviated slug `bot` for the bottom
 * role; this helper maps `middle`→`mid` and `bottom`→`bot` accordingly.
 *
 *   declarePathUrl("north", "middle") → …/video/position-assignment/path_north_mid.webm
 *   declarePathUrl("south", "bottom") → …/video/position-assignment/path_south_bot.webm
 *
 * All 8 confirmed HTTP 206 video/webm (2026-07-14).
 *
 * Source: CommunityDragon rcp-fe-lol-champ-select · video/position-assignment/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const declarePathUrl = (
  side: DeclareSide,
  role: DeclarePathRole,
): string => {
  const SLUG: Record<DeclarePathRole, string> = {
    top: "top",
    jungle: "jungle",
    middle: "mid",
    bottom: "bot",
  };
  return `${CDRAGON_CHAMP_SELECT}/video/position-assignment/path_${side}_${SLUG[role]}.webm`;
};

/**
 * Champ-select declare-intent PIN-DROP video (webm, straight alpha) — a role
 * pin dropping from above onto a lane, one-shot. Two variants:
 *   "ally" → pin_intro(fixed).webm     (86×506)  the standard blue-white pin
 *   "me"   → pin_me_intro(fixed).webm  (138×532) the LOCAL player's pin,
 *            gold-accented and wider (visually distinct per the reference).
 *
 * CAVEAT: both filenames contain literal parentheses. Browsers 404 on raw
 * parens in a `<video src>`, so this helper percent-encodes them (`(`→`%28`,
 * `)`→`%29`) per the cdragon.ts parens caveat.
 *
 *   declarePinUrl("ally") → …/video/position-assignment/pin_intro%28fixed%29.webm
 *   declarePinUrl("me")   → …/video/position-assignment/pin_me_intro%28fixed%29.webm
 *
 * Both confirmed HTTP 206 video/webm (2026-07-14).
 *
 * Source: CommunityDragon rcp-fe-lol-champ-select · video/position-assignment/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const declarePinUrl = (variant: "ally" | "me"): string => {
  const FILE = variant === "me" ? "pin_me_intro(fixed)" : "pin_intro(fixed)";
  const encoded = FILE.replace(/\(/g, "%28").replace(/\)/g, "%29");
  return `${CDRAGON_CHAMP_SELECT}/video/position-assignment/${encoded}.webm`;
};

/**
 * Champ-select card-select webm — the animated summoner card states shown in
 * the champion-select carousel (idle loop, card intros, hover states).
 *
 * `name` is the filename WITHOUT extension, as listed in the CDragon dir JSON at
 * `json/latest/plugins/rcp-fe-lol-champ-select/global/default/video/card-select/`.
 * Verified names (2026-07):
 *   "champ_select_card_idle_loop"        loop behind an idle card
 *   "champ_select_default_card_intro"    default card reveal
 *   "champ_select_hover_state_idle_loop" hover glow loop
 *   "champ_select_hover_state_intro"     hover glow reveal
 *   "champ_select_lucky_card_intro"      lucky/legendary card reveal
 *   "champ_select_selected_state"        selected/locked card state
 *
 * CAVEAT: some CDragon video filenames contain parentheses (e.g.
 * `pin_intro(fixed)`). If a name contains `(` or `)`, pass it already
 * percent-encoded (`%28` / `%29`) — a browser <video src> will 404 on raw
 * parens. This helper does not encode for you.
 *
 * Source: CommunityDragon rcp-fe-lol-champ-select · video/card-select/{name}.webm
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const champSelectCardVideoUrl = (name: string): string =>
  `${CDRAGON_CHAMP_SELECT}/video/card-select/${name}.webm`;

/**
 * Real-client Your Shop navbar-icon magic videos (webm, straight alpha) for a
 * given state — the glowing gold "shop" glyph the live client pulses in the top
 * nav when a personalised Your Shop sale is available (120×120, small). Each
 * clip composites straight (own alpha) over the static icon, so a clip that
 * fails to load leaves the CSS/SVG glyph intact.
 *
 * States → `yourshop-icon-{state}.webm`:
 *   "call-to-action-intro" one-shot attention reveal — the gold glyph bursts in
 *                          with radial light rays, played once (1.0 s)
 *   "call-to-action-loop"  ambient attention loop — gentle gold shimmer/pulse
 *                          that idles to draw the eye (3.0 s, loops)
 *   "click"                one-shot activate burst — bright white flash fired
 *                          when the icon is clicked (0.6 s)
 *
 * All confirmed HTTP 206 video/webm with alpha (2026-07). Feed the returned URL
 * to a muted/playsInline `<video>` overlay layered over the static icon (e.g.
 * the `videoSources` of `YourShopIcon`). NO fetching happens here — pages supply
 * URLs.
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const yourShopIconVideoUrl = (
  state: "call-to-action-intro" | "call-to-action-loop" | "click",
): string => staticVideoUrl(`yourshop-icon-${state}.webm`);

/**
 * Challenge-crystal celebration levels — the 8 named tiers that ship a
 * crystal-level webm under `videos/challenges/crystal-levels/`. Distinct from
 * `ChallengeTier` (which also has `iron`, and whose lowest crystal video is
 * `bronze`): there is no `iron.webm` in the catalog, so this union is the exact
 * set of levels for which `challengeCrystalVideoUrl` resolves to a real asset.
 */
export type ChallengeCrystalLevel =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master"
  | "grandmaster"
  | "challenger";

/**
 * Real-client challenge-crystal celebration webm (issue #319) for a given
 * crystal level — the animated gem the live client plays over the static
 * challenge crystal (900×720, straight alpha, ~5.5–6.0 s one-shot celebration
 * per level; e.g. gold is a warm-gold gem burst, challenger an ornate blue gem).
 * Each clip composites straight (own alpha) over the static crystal glyph, so a
 * clip that fails to load leaves the static crystal intact.
 *
 * Levels → `challenges/crystal-levels/{level}.webm`:
 *   "bronze" · "silver" · "gold" · "platinum" · "diamond" ·
 *   "master" · "grandmaster" · "challenger"
 *
 * All 8 confirmed HTTP 206 video/webm with alpha (2026-07). Feed the returned
 * URL to a muted/playsInline `<video>` overlay layered over the static crystal
 * (e.g. the `crystalVideoSrc` of `ChallengesScreen`). NO fetching happens here —
 * pages supply URLs.
 *
 * NOTE: the catalog has no `iron` crystal video. Callers holding a full
 * `ChallengeTier` (which includes `iron`) must gate on the level being a
 * `ChallengeCrystalLevel` before calling — see the profile-screen wiring.
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/challenges/crystal-levels/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const challengeCrystalVideoUrl = (level: ChallengeCrystalLevel): string =>
  staticVideoUrl(`challenges/crystal-levels/${level}.webm`);

// ---------------------------------------------------------------------------
// Honor celebration videos (issue #360) — the in-client "CHECKPOINT REACHED"
// / "HONOR LEVEL UP" / "HONOR UNLOCKED" overlay's magic layer.
//
// All live under videos/honor/celebration/ (crest clips, straight alpha) plus
// videos/honor/{voting_bg,celebration/transition_green} for full-frame ambience.
// See docs/reference/VIDEO-ASSETS.md — 52 files under honor/, all MIRRORED (206).
// ---------------------------------------------------------------------------

/**
 * Checkpoint crest-video variant key — the catalog names checkpoint clips by an
 * `{honorLevel}-{checkpoint}` prefix (the honor level being approached and which
 * of its checkpoints was reached). Intro/loop exist for levels 2–4 × checkpoints
 * 1–3; the settled reference (`client-honor-checkpoint-celebration.png`) is the
 * `3-3` crest (last checkpoint before Honor level 3).
 */
export type HonorCheckpointVariant =
  | "2-1" | "2-2" | "2-3"
  | "3-1" | "3-2" | "3-3"
  | "4-1" | "4-2" | "4-3";

/** Checkpoint outro clips only exist for the level reached (3, 4, 5). */
export type HonorCheckpointOutroLevel = 3 | 4 | 5;

/**
 * Honor "CHECKPOINT REACHED" crest videos (issue #360) — the animated green-gold
 * honor crest the client plays into the celebration overlay's center slot.
 * 600×650 straight-alpha webm; sequence intro (4.1s one-shot) → loop (14.5s
 * idle) → outro (3.0s dismiss). Each composites straight over the gradient
 * backdrop, so a clip that fails to load leaves the static crest glyph intact.
 *
 *   honorCheckpointVideoUrl("intro", "3-3") → …/honor/celebration/3-3_checkpoint_intro.webm
 *   honorCheckpointVideoUrl("loop",  "3-3") → …/honor/celebration/3-3_checkpoint_loop.webm
 *   honorCheckpointVideoUrl("outro", 3)     → …/honor/celebration/3_checkpoint_outro.webm
 *
 * All confirmed HTTP 206 video/webm (2026-07). Feed the returned URL to the
 * `HonorCheckpointOverlay` crest slot; NO fetching happens here — pages supply URLs.
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/honor/celebration/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export function honorCheckpointVideoUrl(phase: "intro" | "loop", variant: HonorCheckpointVariant): string;
export function honorCheckpointVideoUrl(phase: "outro", level: HonorCheckpointOutroLevel): string;
export function honorCheckpointVideoUrl(
  phase: "intro" | "loop" | "outro",
  key: HonorCheckpointVariant | HonorCheckpointOutroLevel,
): string {
  return staticVideoUrl(`honor/celebration/${key}_checkpoint_${phase}.webm`);
}

/** Honor level-up crest video levels (per-level intro + idle loop, 1–5). */
export type HonorLevelUpLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Honor "HONOR LEVEL UP" crest videos (issue #360) — the level-up variant of the
 * celebration crest, 450×419 straight-alpha webm. `intro` is a one-shot per-level
 * reveal (4–7s), `loop` the 14.5s idle. Feed to the `HonorCheckpointOverlay`
 * crest slot for level-up celebrations.
 *
 *   honorLevelUpVideoUrl("intro", 3) → …/honor/celebration/3_levelup_intro.webm
 *   honorLevelUpVideoUrl("loop",  3) → …/honor/celebration/3_levelup_loop.webm
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/honor/celebration/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const honorLevelUpVideoUrl = (
  phase: "intro" | "loop",
  level: HonorLevelUpLevel,
): string => staticVideoUrl(`honor/celebration/${level}_levelup_${phase}.webm`);

/** Honor unlock intro clips only exist for levels 0–2 (450×419 one-shot). */
export type HonorUnlockLevel = 0 | 1 | 2;

/**
 * Honor "HONOR UNLOCKED" crest video (issue #360) — the unlock-intro variant,
 * 450×419 straight-alpha one-shot (4.0s). Feed to the `HonorCheckpointOverlay`
 * crest slot for unlock celebrations.
 *
 *   honorUnlockVideoUrl(0) → …/honor/celebration/0_unlock.webm
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/honor/celebration/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const honorUnlockVideoUrl = (level: HonorUnlockLevel): string =>
  staticVideoUrl(`honor/celebration/${level}_unlock.webm`);

/**
 * Honor full-frame green transition wipe (issue #360) — 1280×720 straight-alpha
 * webm (3.0s), the sweeping green wipe layered full-frame behind the crest.
 * Feed to the overlay's `backdropVideo` slot.
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/honor/celebration/transition_green.webm
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const honorTransitionVideoUrl = (): string =>
  staticVideoUrl("honor/celebration/transition_green.webm");

/**
 * Honor voting-backdrop video (issue #360) — 1280×720 OPAQUE webm (5.0s, no
 * alpha), the honor set's ambient fish-forest backdrop. Optional full-frame
 * `backdropVideo` for the overlay; because it is opaque it fully replaces the
 * gradient backdrop when supplied.
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/honor/voting_bg.webm
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const honorVotingBgVideoUrl = (): string =>
  staticVideoUrl("honor/voting_bg.webm");

// ---------------------------------------------------------------------------
// Champion-mastery celebration videos (issue #370) — the mastery level-up
// celebration overlay's magic layer.
//
// All live under videos/champion-mastery/. Unlike the honor crest clips (which
// are straight-alpha 600×650 emblems), these are OPAQUE 1280×720 (yuv420p, no
// alpha): the background is a self-contained deep-blue Hextech starfield loop,
// and each level clip is the animated mastery crest on a BLACK field (so it
// composites over the starfield with `mix-blend-mode: screen` — black drops
// out). See docs/reference/VIDEO-ASSETS.md — 13 files under champion-mastery/,
// all MIRRORED (206 video/webm).
// ---------------------------------------------------------------------------

/**
 * Champion-mastery level union — the catalog ships one celebration clip per
 * mastery level 1–10 (`cm-celebration-level-{N}.webm`). Each is a distinct
 * crest: level 1 is a bare bronze crest, mid levels add a green gem + wings,
 * level 10 is the ornate gold crest with an iridescent hex gem.
 */
export type MasteryCelebrationLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/**
 * Champion-mastery level-celebration crest video (issue #370) — the animated
 * mastery crest the client plays into the celebration overlay's center slot for
 * a given level. 1280×720 OPAQUE webm on a BLACK field (9–12s one-shot); the
 * crest reveals, flares an aurora burst, and settles on a stable resting pose it
 * holds on the last frame. Composite over the starfield backdrop with
 * `mix-blend-mode: screen` so the black field drops out and only the crest adds.
 *
 *   masteryCelebrationVideoUrl(5)  → …/champion-mastery/cm-celebration-level-5.webm
 *   masteryCelebrationVideoUrl(10) → …/champion-mastery/cm-celebration-level-10.webm
 *
 * All 10 confirmed HTTP 206 video/webm (2026-07). Feed the returned URL to the
 * `MasteryCelebrationOverlay` crest slot; NO fetching happens here — pages
 * supply URLs.
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/champion-mastery/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const masteryCelebrationVideoUrl = (
  level: MasteryCelebrationLevel,
): string =>
  staticVideoUrl(`champion-mastery/cm-celebration-level-${level}.webm`);

/**
 * Champion-mastery celebration backdrop video (issue #370) — 1280×720 OPAQUE
 * webm (5.0s), a seamless deep-blue Hextech starfield loop with drifting motes.
 * Because it is opaque it fully replaces the gradient backdrop when supplied;
 * feed to the overlay's `backdropVideo` slot (loops behind the crest clip).
 *
 * Confirmed HTTP 206 video/webm (2026-07).
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/champion-mastery/cm-celebration-background.webm
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const masteryCelebrationBackgroundUrl = (): string =>
  staticVideoUrl("champion-mastery/cm-celebration-background.webm");

/**
 * Champion-mastery crest aurora glow (issue #370) — 500×500 OPAQUE webm (3.0s),
 * a warm-gold radial aurora burst on a BLACK field. A reusable glow loop for
 * mastery surfaces (e.g. `collection/champion-detail`); the level-celebration
 * clips already bake in their own aurora, so the overlay does not need it. Kept
 * here for the champion-detail mastery tab. Composite with `mix-blend-mode:
 * screen` (black field drops out).
 *
 * Confirmed HTTP 206 video/webm (2026-07).
 *
 * Source: CommunityDragon rcp-fe-lol-static-assets · videos/champion-mastery/cm-crest-aurora.webm
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const masteryCrestAuroraUrl = (): string =>
  staticVideoUrl("champion-mastery/cm-crest-aurora.webm");

// ---------------------------------------------------------------------------
// LOCK IN button videos (issue #428) — official champ-select lock-in art.
//
// All 8 webms + the disabled PNG live ONLY at patch 7.5 of the champ-select
// plugin. The `latest` lock-in/ directory contains only the disabled PNG (the
// animated webms were removed/renamed in later patches). Patch 7.5 is pinned
// deliberately: it is the only version with the full animated set AND its
// disabled PNG matches the button shape used by TrapezoidButton (#427).
//
// All 8 webms + PNG confirmed HTTP 200 at:
//   https://raw.communitydragon.org/7.5/plugins/rcp-fe-lol-champ-select/global/default/video/lock-in/
// (probed 2026-07, issue #428 team-lead comment)
// ---------------------------------------------------------------------------

/**
 * Base URL for the official CommunityDragon lock-in button asset set.
 *
 * PINNED to patch 7.5 — the `latest` mirror's lock-in/ dir only carries the
 * disabled PNG; the animated webms are absent. Patch 7.5 ships all 8 webms +
 * the disabled PNG and the trapezoid geometry matches the shape used in
 * TrapezoidButton (#427). Do not change this to `latest` without confirming
 * the full webm set exists at the target patch.
 *
 * Fan-content policy: https://www.riotgames.com/en/legal (fan-made, non-commercial).
 */
const CDRAGON_LOCKIN =
  "https://raw.communitydragon.org/7.5/plugins/rcp-fe-lol-champ-select/global/default/video/lock-in";

/**
 * State machine keys for the real-client lock-in button animated videos.
 *
 * Sequence:
 *   `activeIntro` (once on mount) → `activeIdle` (loop)
 *   `activeHover` (loop while pointer over) ← → `activeOut` (one-shot on leave)
 *   `release` (one-shot on click/press)
 *   `disabledIntro` (once when disabled) — then fallback to the disabled PNG
 *
 * One-shot accents (no natural trigger in this component — exposed for callers
 * that have a signal):
 *   `changeChamp` — accent played when the champion selection changes
 *   `magicExpell` — gold magic burst accent (analogous to the PlayButton "magic" accent)
 */
export type LockInVideoState =
  | "activeIntro"
  | "activeIdle"
  | "activeHover"
  | "activeOut"
  | "changeChamp"
  | "release"
  | "disabledIntro"
  | "magicExpell";

/**
 * Real-client lock-in button magic video (webm, straight alpha) for a given
 * state — the authentic animated button layers composited over the CSS
 * TrapezoidButton. Each clip carries its own alpha channel (VP9 straight alpha)
 * so transparent regions let the CSS button read through; a clip that fails to
 * load leaves the static look intact.
 *
 * State → filename mapping (all under CDRAGON_LOCKIN/):
 *   "activeIntro"   lock-in-button-active-intro.webm   — enabled reveal (once on mount)
 *   "activeIdle"    lock-in-button-active-idle.webm    — enabled idle loop
 *   "activeHover"   lock-in-button-active-hover.webm   — hover loop (while pointer over)
 *   "activeOut"     lock-in-button-active-out.webm     — hover-out one-shot (pointer leave)
 *   "changeChamp"   lock-in-button-change-champ.webm   — change-champ accent (one-shot)
 *   "release"       lock-in-button-release.webm        — press/release one-shot
 *   "disabledIntro" lock-in-button-disabled-intro.webm — disabled reveal (once)
 *   "magicExpell"   lock-in-magic-expell.webm          — magic burst accent (one-shot)
 *
 * PATCH PIN: all assets live ONLY at patch 7.5 (see {@link CDRAGON_LOCKIN}).
 * All 8 confirmed HTTP 200 (2026-07, issue #428).
 *
 * Feed the returned URL to the `lockInVideoSources` prop of `LockInButton`;
 * NO fetching happens in `@low/ui` — pages supply URLs from `@low/fixtures`.
 *
 * Source: CommunityDragon rcp-fe-lol-champ-select (patch 7.5) · video/lock-in/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const lockInVideoUrl = (state: LockInVideoState): string => {
  const FILE: Record<LockInVideoState, string> = {
    activeIntro:   "lock-in-button-active-intro.webm",
    activeIdle:    "lock-in-button-active-idle.webm",
    activeHover:   "lock-in-button-active-hover.webm",
    activeOut:     "lock-in-button-active-out.webm",
    changeChamp:   "lock-in-button-change-champ.webm",
    release:       "lock-in-button-release.webm",
    disabledIntro: "lock-in-button-disabled-intro.webm",
    magicExpell:   "lock-in-magic-expell.webm",
  };
  return `${CDRAGON_LOCKIN}/${FILE[state]}`;
};

/**
 * Disabled-state static PNG for the lock-in button — the fallback shown after
 * the `disabledIntro` one-shot plays (or when the button is disabled and motion
 * is reduced). Same patch-7.5 pin as the webms; the disabled PNG defines the
 * canonical TrapezoidButton shape used in #427.
 *
 * Confirmed HTTP 200 (2026-07, issue #428).
 *
 * Source: CommunityDragon rcp-fe-lol-champ-select (patch 7.5) · video/lock-in/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const lockInDisabledPngUrl = (): string =>
  `${CDRAGON_LOCKIN}/lock-in-button-disabled-idle.png`;

// ---------------------------------------------------------------------------
// CHAMPION-RING splash frame art (issue #437) — the ornate circular frame the
// real champ-select loadout paints around the selected skin's splash.
//
// The client composes the ring from dedicated art (NOT drawn SVG): an authentic
// dashed tick-ring plus a pair of ornamental gold arcs authored as LEFT halves
// (mirror horizontally to complete the right side). Unlike the lock-in videos
// (#428) these images exist at BOTH patch 7.5 and `latest`, so we pin `latest`
// for longevity — the current-era set is coherent with the rest of the ring.
//
// All 3 confirmed HTTP 200 image/png at:
//   https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champ-select/global/default/images/champion-ring/
// (probed 2026-07, issue #437)
// ---------------------------------------------------------------------------

/**
 * Piece of the champ-select champion-ring frame art.
 *   "dashed"      → ring-splash-dashed.png       (2392×2392) — the full authentic
 *                   dashed tick-ring (replaces the drawn `strokeDasharray` ticks).
 *   "inner-left"  → ring-splash-inner-left.png   (332×1618)  — inner ornamental
 *                   gold arc, LEFT half only (mirror horizontally for the right).
 *   "outer-left"  → ring-splash-outer-left.png   (300×1610)  — outer ornamental
 *                   gold arc, LEFT half only (mirror horizontally for the right).
 */
export type ChampionRingPiece = "dashed" | "inner-left" | "outer-left";

/**
 * Champ-select champion-ring frame art URL (issue #437) — the ornamental circular
 * frame the live client wraps around the selected skin's splash in the loadout
 * panel. Three straight-alpha PNGs compose the ring: the full `dashed` tick-ring
 * plus the `inner-left` / `outer-left` gold arcs (authored as LEFT halves — the
 * consumer mirrors them with `scaleX(-1)` to form the right side).
 *
 * CURRENT-ERA: unlike the lock-in set ({@link lockInVideoUrl}, pinned 7.5), these
 * exist at `latest`, so we pin `latest` for longevity — coherent with the rest of
 * the current champ-select ring.
 *
 * All 3 confirmed HTTP 200 image/png (2026-07, issue #437):
 *   championRingUrl("dashed")     → …/images/champion-ring/ring-splash-dashed.png
 *   championRingUrl("inner-left") → …/images/champion-ring/ring-splash-inner-left.png
 *   championRingUrl("outer-left") → …/images/champion-ring/ring-splash-outer-left.png
 *
 * Feed the returned URLs to `SkinCarousel` (`ringDashedSrc` / `ringInnerLeftSrc`
 * / `ringOuterLeftSrc`); NO fetching happens in `@low/ui` — pages/showcase supply
 * URLs from `@low/fixtures`. Tokens rule applies to CSS colors, not asset URLs.
 *
 * Source: CommunityDragon rcp-fe-lol-champ-select · images/champion-ring/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const championRingUrl = (piece: ChampionRingPiece): string => {
  const FILE: Record<ChampionRingPiece, string> = {
    dashed:       "ring-splash-dashed.png",
    "inner-left": "ring-splash-inner-left.png",
    "outer-left": "ring-splash-outer-left.png",
  };
  return `${CDRAGON_CHAMP_SELECT}/images/champion-ring/${FILE[piece]}`;
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

// ---------------------------------------------------------------------------
// SOUND (.ogg) HELPERS — issue #432 (sound system v1)
//
// The real client's friend-finder UI SFX (click, status-window open/close,
// success/fail notifications, tab clicks). CommunityDragon mirrors these as
// small `audio/ogg` clips (~12–48 KB each). Like the lock-in videos (#428),
// they live ONLY at patch 7.5 — the `latest` friend-finder plugin dropped the
// sounds/ dir (404 at latest). Patch 7.5 is pinned deliberately.
//
// All 6 confirmed HTTP 200 audio/ogg at:
//   https://raw.communitydragon.org/7.5/plugins/rcp-fe-lol-friend-finder/global/default/sounds/
// (probed 2026-07, issue #432)
//
// Audio playback is a SIDE EFFECT and must NOT live in @low/ui — these helpers
// only build URLs. Pages/app hooks feed a returned URL to an HTMLAudioElement,
// and playback is user-gesture-initiated (no autoplay). See apps/web useSound.
// ---------------------------------------------------------------------------

/**
 * Base URL for the official CommunityDragon friend-finder SFX set.
 *
 * PINNED to patch 7.5 — the `latest` mirror's friend-finder plugin no longer
 * carries a sounds/ dir (404). Patch 7.5 ships the full set. Do not change this
 * to `latest` without confirming the sounds exist at the target patch. Same
 * pin/rationale as the lock-in videos ({@link lockInVideoUrl}).
 *
 * Fan-content policy: https://www.riotgames.com/en/legal (fan-made, non-commercial).
 */
const CDRAGON_SOUND =
  "https://raw.communitydragon.org/7.5/plugins/rcp-fe-lol-friend-finder/global/default/sounds";

/**
 * Typed id union for the friend-finder SFX catalog. Each id is a stable slug
 * used as the {@link SoundEntry.id} and consumed by {@link soundUrl}. Keeping
 * this a union (rather than `string`) means a caller playing an unknown clip is
 * a compile error, and {@link soundUrl}'s filename map is exhaustive.
 */
export type SfxId =
  | "click-generic"
  | "statuswindow-open"
  | "statuswindow-close"
  | "notif-success"
  | "login-fail"
  | "suggested-tab-click";

/**
 * Broad grouping used to organize the sound library UI into labelled sections.
 * Spans both catalogs: the friend-finder set ({@link FRIEND_FINDER_SFX}) uses
 * "UI"/"Notification"/"Social"; the uikit set ({@link UIKIT_SFX}, #439) adds
 * "Button"/"Input"/"Generic"/"Celebrate". The `SoundLibrary` component groups
 * rows by this string, so the union stays open to whichever catalog it renders.
 */
export type SoundCategory =
  | "UI"
  | "Notification"
  | "Social"
  | "Button"
  | "Input"
  | "Generic"
  | "Celebrate";

/**
 * One catalog entry describing a single client SFX. Presentational components
 * (e.g. `SoundLibrary`) import this TYPE from `@low/fixtures` and receive the
 * VALUES from pages/showcase — never fetching or constructing URLs themselves.
 *
 * Shared across catalogs: `id` is the catalog's own stable slug, resolved to a
 * streaming URL by that catalog's resolver — {@link soundUrl} for the
 * friend-finder set ({@link SfxId}), {@link uikitSoundUrl} for the uikit set
 * ({@link UikitSfxId}, #439). Kept `string` here so one type serves both id
 * spaces; each catalog's resolver keeps its own exhaustive, typed id union.
 */
export interface SoundEntry {
  /** Stable id — feed to the catalog's resolver (`soundUrl`/`uikitSoundUrl`). */
  id: string;
  /** Human-readable label shown in the library row (e.g. "Generic UI Click"). */
  label: string;
  /** Group the clip belongs to — drives the library's section grouping. */
  category: SoundCategory;
  /** The `.ogg` filename (without the base path) under the catalog's base. */
  filename: string;
}

/**
 * Friend-finder SFX streaming URL for a given {@link SfxId}. Mirrors the
 * `lockInVideoUrl` house style: a `Record<SfxId, string>` filename map (so a new
 * id fails typecheck instead of silently 404-ing) resolved against the pinned
 * patch-7.5 base.
 *
 * Feed the returned URL to an `HTMLAudioElement` in the APP layer (see the
 * `useSound` hook). NO fetching or playback happens here — this only builds a
 * URL, and audio playback must stay user-gesture-initiated.
 *
 * All 6 confirmed HTTP 200 audio/ogg (2026-07, issue #432):
 *   soundUrl("click-generic")       → …/sounds/sfx-soc-ui-click-generic.ogg
 *   soundUrl("statuswindow-open")   → …/sounds/sfx-soc-ui-statuswindow-open.ogg
 *   soundUrl("notif-success")       → …/sounds/sfx-soc-notif-success.ogg
 *
 * Source: CommunityDragon rcp-fe-lol-friend-finder (patch 7.5) · sounds/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const soundUrl = (id: SfxId): string => {
  const FILE: Record<SfxId, string> = {
    "click-generic":       "sfx-soc-ui-click-generic.ogg",
    "statuswindow-open":   "sfx-soc-ui-statuswindow-open.ogg",
    "statuswindow-close":  "sfx-soc-ui-statuswindow-close.ogg",
    "notif-success":       "sfx-soc-notif-success.ogg",
    "login-fail":          "sfx-login-notif-login-fail.ogg",
    "suggested-tab-click": "sfx-lobby-suggested-tab-click.ogg",
  };
  return `${CDRAGON_SOUND}/${FILE[id]}`;
};

/**
 * The friend-finder SFX catalog (issue #432) — the 6 social/UI clips the real
 * client plays around the friends list. Ordered UI → Notification → Social so
 * the library groups read top-to-bottom in that order. Pages/showcase pass this
 * to the `SoundLibrary` component; components import only the {@link SoundEntry}
 * TYPE, never this value.
 *
 * Resolve each entry's streaming URL with `soundUrl(entry.id)`.
 */
export const FRIEND_FINDER_SFX: readonly SoundEntry[] = [
  {
    id: "click-generic",
    label: "Generic UI Click",
    category: "UI",
    filename: "sfx-soc-ui-click-generic.ogg",
  },
  {
    id: "suggested-tab-click",
    label: "Suggested Tab Click",
    category: "UI",
    filename: "sfx-lobby-suggested-tab-click.ogg",
  },
  {
    id: "notif-success",
    label: "Success Notification",
    category: "Notification",
    filename: "sfx-soc-notif-success.ogg",
  },
  {
    id: "login-fail",
    label: "Login Failed",
    category: "Notification",
    filename: "sfx-login-notif-login-fail.ogg",
  },
  {
    id: "statuswindow-open",
    label: "Status Window Open",
    category: "Social",
    filename: "sfx-soc-ui-statuswindow-open.ogg",
  },
  {
    id: "statuswindow-close",
    label: "Status Window Close",
    category: "Social",
    filename: "sfx-soc-ui-statuswindow-close.ogg",
  },
];

// ---------------------------------------------------------------------------
// FRIEND-FINDER IMAGE HELPERS — poro empty-state mascots (#433) + mask glyphs (#434)
//
// The friend-finder plugin ships empty-state poros (poro_question/sad/sleeping)
// and mask glyphs (add_person_mask, icon_check_mask, …). Like the friend-finder
// SFX (#432) and the lock-in videos (#428), these images live at patch 7.5 (last
// live at 9.3; the `latest` mirror dropped this plugin from 9.4 onward). Patch
// 7.5 is pinned deliberately — do NOT change to `latest` without confirming the
// images exist at the target patch.
//
// Mask glyphs: opaque pixels are warm off-white / gold (#f0e6d2, exactly our
// `gold-1`) on transparent. Consume via CSS `mask-image` over a token background
// color so the glyph inherits `text-*` state colors (grey-1 → gold-1 on hover)
// rather than baking a fixed tint — see SocialHeader. Confirmed HTTP 200
// image/png at:
//   https://raw.communitydragon.org/7.5/plugins/rcp-fe-lol-friend-finder/global/default/images/
// ---------------------------------------------------------------------------

/**
 * Base URL for the official CommunityDragon friend-finder image set.
 *
 * PINNED to patch 7.5 — the `latest` mirror dropped the friend-finder plugin
 * from patch 9.4 onward (404 at latest). Patch 7.5 ships the full image set
 * (poros poro_question/sad/sleeping @ 102×96 RGBA; mask glyphs @ 72×72). Do not
 * change to `latest` without confirming the images exist at the target patch.
 * Same pin/rationale as the lock-in videos ({@link lockInVideoUrl}) and the
 * friend-finder SFX ({@link soundUrl}).
 *
 * Poro designs are timeless Hextech mascots — using a 7.5 poro for a current-era
 * empty state is era-coherent.
 *
 * Fan-content policy: https://www.riotgames.com/en/legal (fan-made, non-commercial).
 */
const CDRAGON_FRIEND_FINDER =
  "https://raw.communitydragon.org/7.5/plugins/rcp-fe-lol-friend-finder/global/default/images";

/**
 * Named poro variants served from the friend-finder image set. Feed one to
 * {@link poroUrl} to resolve its PNG src. Union (rather than a raw string) so a
 * typo fails typecheck instead of silently 404-ing.
 *
 * - `"question"` → poro with a "?" — the "no friends yet" empty state.
 * - `"sad"`      → droopy poro — a "search returned nothing" empty state.
 * - `"sleeping"` → dozing poro — a "loading / away" empty state.
 */
export type PoroVariant = "question" | "sad" | "sleeping";

/**
 * Poro mascot PNG URL for a given {@link PoroVariant}. Mirrors the `soundUrl`
 * house style: a `Record<PoroVariant, string>` filename map resolved against the
 * pinned patch-7.5 friend-finder base ({@link CDRAGON_FRIEND_FINDER}).
 *
 * Pass the returned URL as an `<img>` `src` in the APP/showcase layer — the
 * Tokens rule governs CSS colors, not asset URLs, so these are safe to use.
 *
 * All 3 confirmed HTTP 200 image/png (2026-07, issue #433):
 *   poroUrl("question") → …/images/poro_question.png
 *   poroUrl("sad")      → …/images/poro_sad.png
 *   poroUrl("sleeping") → …/images/poro_sleeping.png
 */
export const poroUrl = (variant: PoroVariant): string => {
  const FILE: Record<PoroVariant, string> = {
    question: "poro_question.png",
    sad:      "poro_sad.png",
    sleeping: "poro_sleeping.png",
  };
  return `${CDRAGON_FRIEND_FINDER}/${FILE[variant]}`;
};

/**
 * Friend-finder MASK glyph URL for a given `name` (filename WITHOUT the `.png`
 * extension). Mirrors the house style of the other cdragon.ts helpers: a base +
 * name join, no fetching, JSDoc pins the patch.
 *
 * These are 72×72 indexed-palette PNGs where opaque pixels are off-white/gold
 * (#f0e6d2) on transparent — MASK glyphs, not pre-tinted icons. Feed the URL to
 * a CSS `mask-image` on a token-colored box so the glyph picks up the element's
 * `text-*` color (and its hover/focus transitions). Do NOT tint by baking a
 * fixed color; let the token background drive it.
 *
 * Crispness note (issue #434): the 72×72 raster downscales cleanly to the
 * SocialHeader's 16px render — the filled person-bust + `+` reads sharp with no
 * meaningful blur, and it is more faithful than a hand-drawn outline SVG (the
 * client glyph is a FILLED silhouette). See SocialHeader's `iconMap.add`.
 *
 * Confirmed HTTP 200 image/png (2026-07, issue #434):
 *   friendFinderImageUrl("add_person_mask") → …/images/add_person_mask.png
 *   friendFinderImageUrl("icon_check_mask") → …/images/icon_check_mask.png
 *
 * Source: CommunityDragon rcp-fe-lol-friend-finder (patch 7.5) · images/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const friendFinderImageUrl = (name: string): string =>
  `${CDRAGON_FRIEND_FINDER}/${name}.png`;

/**
 * Social-plugin MASK glyph URL for a given `name` (filename WITHOUT the `.png`
 * extension). Companion to {@link friendFinderImageUrl} (#434): where that helper
 * serves the friend-finder `add_person_mask`, this one serves the remaining
 * SocialHeader glyphs that live at the rcp-fe-lol-social plugin root — groups
 * (`add_folder_mask`), list/sort (`sort_mask`), and search (`search_mask`).
 *
 * These are 72×72 monochrome-on-transparent PNGs — MASK glyphs, not pre-tinted
 * icons. Feed the URL to a CSS `mask-image` on a token-colored box so the glyph
 * picks up the element's `text-*` color and its hover/focus transitions (grey-1
 * → gold-1). Do NOT bake a fixed color; let the token background drive the tint.
 *
 * Pinned to `latest` (not patch 7.5 like the friend-finder set): these masks
 * survive to the current era — confirmed HTTP 200 image/png at `latest`, so they
 * are era-coherent with the rest of the current-client chrome, not dated art.
 *
 * Confirmed HTTP 200 image/png (2026-07, issue #440):
 *   socialMaskUrl("search_mask")     → …/rcp-fe-lol-social/…/search_mask.png
 *   socialMaskUrl("add_folder_mask") → …/rcp-fe-lol-social/…/add_folder_mask.png (groups)
 *   socialMaskUrl("sort_mask")       → …/rcp-fe-lol-social/…/sort_mask.png (list/sort)
 *
 * Source: CommunityDragon rcp-fe-lol-social (latest) · global/default/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const socialMaskUrl = (name: string): string =>
  `${CDRAGON_SOCIAL}/${name}.png`;

// ---------------------------------------------------------------------------
// PLAYER-NOTIFICATIONS MASK GLYPH — the notification-tray bell button (#399)
//
// The real client's notification button ships a single bell glyph in the
// player-notifications plugin. Like the friend-finder mask glyphs (#434), it is
// a monochrome-on-transparent raster meant to be consumed via CSS `mask-image`
// over a token background so the bell inherits the button's text color state
// (grey-1 → gold-1 on hover) rather than baking a fixed tint. See ProfileChip.
//
// PINNED to patch 7.5 — the player-notifications plugin was dropped from the
// `latest` mirror (404 at latest), same fate as the friend-finder plugin. A
// bell is timeless iconography, so a 7.5 glyph is era-coherent for the
// current-era chip. Do NOT change to `latest` without confirming it exists.
//
// Fan-content policy: https://www.riotgames.com/en/legal (fan-made, non-commercial).
// ---------------------------------------------------------------------------

/**
 * Notification bell mask-glyph URL — the real client's notification-tray button
 * icon (72×72 monochrome-on-transparent PNG). Mirrors the house style of the
 * other cdragon.ts helpers: a static base, no fetching, JSDoc pins the patch.
 *
 * Feed the returned URL to a CSS `mask-image` on a token-colored box so the bell
 * picks up the element's `text-*` color and its hover/focus transitions. Do NOT
 * bake a fixed color; let the token background drive the tint — same treatment
 * as {@link friendFinderImageUrl}. See ProfileChip's bell button.
 *
 * PINNED to patch 7.5 (see block comment above) — 404 at `latest`.
 *
 * Confirmed HTTP 200 image/png (2026-07, issue #399):
 *   notificationBellUrl() → …/rcp-fe-lol-player-notifications/…/notifications_button_icon.png
 *
 * Source: CommunityDragon rcp-fe-lol-player-notifications (patch 7.5).
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const notificationBellUrl = (): string =>
  "https://raw.communitydragon.org/7.5/plugins/rcp-fe-lol-player-notifications/global/default/notifications_button_icon.png";

// ---------------------------------------------------------------------------
// Champion-details plugin — Overview stat-wheel art + role-class glyphs (#438)
// ---------------------------------------------------------------------------

const CDRAGON_CHAMPION_DETAILS =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champion-details/global/default";

/**
 * Champion-details plugin asset URL for a given `filename` (with extension).
 * Mirrors the house style of the other cdragon.ts helpers: a base + name join,
 * no fetching, JSDoc pins the source. Feed the URL to an <img> `src`.
 *
 * The champion-overview UI is EVERGREEN — these assets are byte-identical on
 * patch `7.5` and `latest`, so the base is pinned to `latest` and needs no
 * per-patch bump. Files live directly at the plugin `global/default/` root
 * (NOT under an `images/` or `assets/` subdir — probed 2026-07, #438).
 *
 * Confirmed HTTP 200 image/png (2026-07, issue #438):
 *   championDetailAssetUrl("cdp_graph_backing.png")     → wheel backing plate
 *   championDetailAssetUrl("cdp-graph-segment-l3.png")  → 3-tier teal arc fan
 *   championDetailAssetUrl("role-icon-mage.png")        → gold class emblem
 *
 * Source: CommunityDragon rcp-fe-lol-champion-details · global/default/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const championDetailAssetUrl = (filename: string): string =>
  `${CDRAGON_CHAMPION_DETAILS}/${filename}`;

/** The six art-deco role-class emblem names (gold, 168×168). */
export type ChampionRoleClass =
  | "assassin"
  | "fighter"
  | "mage"
  | "marksman"
  | "support"
  | "tank";

/**
 * Gold art-deco role-class emblem URL (`role-icon-<class>.png`, 168×168).
 * These are the filled class emblems (assassin = hooded blade, mage = flame,
 * tank = shield, etc.) — pre-tinted gold on transparent, render as-is.
 */
export const championRoleIconUrl = (role: ChampionRoleClass): string =>
  championDetailAssetUrl(`role-icon-${role}.png`);

/**
 * Resolved URLs for the Overview `RadialStatWheel` art, ready to pass straight
 * into `ChampionDetail`'s `statWheelArt` prop. Values resolve at module init;
 * the component receives them as props (component contract: URLs in, no fetch).
 *
 * - `backing` — dark concentric target plate (grey role glyphs baked at corners)
 * - `segments` — filled teal arc-fan overlays, one per rating tier (l1/l2/l3);
 *   indexed by tier so `segments[difficulty - 1]` selects the right fan.
 */
export const CHAMPION_STAT_WHEEL_ART = {
  backing: championDetailAssetUrl("cdp_graph_backing.png"),
  segments: [
    championDetailAssetUrl("cdp-graph-segment-l1.png"),
    championDetailAssetUrl("cdp-graph-segment-l2.png"),
    championDetailAssetUrl("cdp-graph-segment-l3.png"),
  ],
} as const;

// ---------------------------------------------------------------------------
// End-of-Game (post-match) scoreboard assets — issue #441
//
// Two plugins feed the EOG screen. Both catalogs were probed 2026-07 via the
// CDragon dir JSON: every file cited here resolves 200 image/png.
//
// CAVEAT (mirrors #438): the rcp-fe-lol-match-history assets live directly at
// the plugin `global/default/` ROOT — NOT under an `images/` subdir (that path
// 404s). The objective/role/stat icons are current-era and byte-stable, so the
// base is pinned to `latest` and needs no per-patch bump.
// ---------------------------------------------------------------------------

const CDRAGON_MATCH_HISTORY =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-match-history/global/default";

const CDRAGON_POSTGAME =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-postgame/global/default";

/**
 * Match-history plugin asset URL for a given `filename` (with extension).
 * Generic escape hatch mirroring `championDetailAssetUrl` — a base + name join,
 * no fetching. Files live at the plugin ROOT (see caveat above). Feed the URL
 * to an <img> `src`.
 *
 * Confirmed HTTP 200 image/png (2026-07, issue #441):
 *   matchHistoryIconUrl("champion_frame.png") → portrait frame (63×126)
 *   matchHistoryIconUrl("icon_gold.png")      → gold coin glyph
 *   matchHistoryIconUrl("roleicon-mage.png")  → role class icon (72×72)
 *
 * Source: CommunityDragon rcp-fe-lol-match-history · global/default/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const matchHistoryIconUrl = (filename: string): string =>
  `${CDRAGON_MATCH_HISTORY}/${filename}`;

/** The six scoreboard role-class icon slugs (72×72, gold on transparent). */
export type ScoreboardRole =
  | "assassin"
  | "fighter"
  | "mage"
  | "marksman"
  | "support"
  | "tank";

/**
 * Match-history scoreboard role icon URL (`roleicon-<role>.png`, 72×72) — the
 * small gold class glyph shown beside each player row. Distinct from
 * `positionIconUrl` (lane positions) and `championRoleIconUrl` (168×168 art-deco
 * emblems from the champion-details plugin): these are the compact match-history
 * class icons.
 */
export const scoreboardRoleIconUrl = (role: ScoreboardRole): string =>
  matchHistoryIconUrl(`roleicon-${role}.png`);

/**
 * Neutral objective a team can take. The match-history plugin ships each as a
 * team-tinted 144×144 icon suffixed `-100` (blue/order side) and `-200`
 * (red/chaos side). Elemental dragons additionally carry per-element art
 * (`fire`/`water`/`air`/`earth`); the generic `dragon` icon is the soul-agnostic
 * drake.
 */
export type ObjectiveIcon =
  | "dragon"
  | "baron"
  | "herald"
  | "elder"
  | "fire"
  | "water"
  | "air"
  | "earth"
  | "tower"
  | "inhibitor";

/**
 * Objective summary icon URL (144×144, team-tinted). `side` picks the tint:
 * "blue" → `-100` (order), "red" → `-200` (chaos). Used by the EOG objectives
 * strip (dragons/baron/herald/towers/inhibitors counts).
 *
 * Confirmed HTTP 200 image/png (2026-07, issue #441):
 *   objectiveIconUrl("dragon", "blue")    → dragon-100.png
 *   objectiveIconUrl("baron", "red")      → baron-200.png
 *   objectiveIconUrl("fire", "blue")      → fire-100.png (Infernal drake)
 *   objectiveIconUrl("inhibitor", "red")  → inhibitor-200.png
 *
 * Source: CommunityDragon rcp-fe-lol-match-history · global/default/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const objectiveIconUrl = (
  id: ObjectiveIcon,
  side: "blue" | "red" = "blue",
): string => matchHistoryIconUrl(`${id}-${side === "blue" ? "100" : "200"}.png`);

/**
 * Postgame plugin asset URL for a given `filename` (with extension). Generic
 * escape hatch for the rcp-fe-lol-postgame plugin (mastery banners, victory/
 * defeat glyphs, score-meter frame). Files live at the plugin ROOT. No fetching.
 *
 * Confirmed HTTP 200 (2026-07, issue #441):
 *   postgameAssetUrl("icon-sr-victory.png")            → victory banner glyph
 *   postgameAssetUrl("banner-mastery-small-lvl7.png")  → per-player mastery banner
 *   postgameAssetUrl("frame-meter.png")                → score-meter frame
 *
 * Source: CommunityDragon rcp-fe-lol-postgame · global/default/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const postgameAssetUrl = (filename: string): string =>
  `${CDRAGON_POSTGAME}/${filename}`;

/**
 * Per-player mastery banner URL (`banner-mastery-small-lvl<n>.png`) — the small
 * gold pennant behind a player's score meter, one art per champion-mastery level
 * 1–7. Level 0 / no-mastery uses the `lvlempty` art.
 *
 * Source: CommunityDragon rcp-fe-lol-postgame · global/default/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const masteryBannerUrl = (level: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7): string =>
  postgameAssetUrl(`banner-mastery-small-lvl${level === 0 ? "empty" : level}.png`);

// ---------------------------------------------------------------------------
// UIKIT SOUND (.ogg) HELPERS — issue #439 (sound system v2, uikit SFX)
//
// An additive extension of the #432 sound system: the client-wide GENERIC
// interaction SFX (button click/hover, checkbox, radio, dropdown, purchase,
// nav-text, generic clicks) plus a couple of celebration stingers. These live
// in a DIFFERENT plugin from the friend-finder set — the uikit plugin — and,
// unlike friend-finder (whose clips sit under a sounds/ subdir), they sit at
// the plugin ROOT (confirmed 200 at the root, 404 under sounds/). So this
// needs its own base + resolver; #432's soundUrl/CDRAGON_SOUND stay untouched.
//
// All confirmed HTTP 200 audio/ogg (~12 KB each) at:
//   https://raw.communitydragon.org/7.5/plugins/rcp-fe-lol-uikit/global/default/
// (probed 2026-07, issue #439 — 20/20 200 audio/ogg, none under sounds/)
//
// Same 7.5 pin as the friend-finder SFX (#432) and lock-in videos (#428): the
// uikit chrome is timeless and also resolves at `latest`, but 7.5 is pinned to
// match the rest of the sound/video corpus. Audio playback is a SIDE EFFECT and
// must NOT live in @low/ui — these helpers only build URLs; the app's useSound
// hook drives an HTMLAudioElement and playback stays user-gesture-initiated.
// ---------------------------------------------------------------------------

/**
 * Base URL for the CommunityDragon uikit SFX set.
 *
 * PINNED to patch 7.5 (same rationale as {@link CDRAGON_SOUND} / the lock-in
 * videos). NOTE the shape difference from the friend-finder base: these clips
 * live at the PLUGIN ROOT (`…/rcp-fe-lol-uikit/global/default/<file>.ogg`), NOT
 * under a `sounds/` subdir — confirmed 200 at the root, 404 under sounds/. Do
 * not add a `sounds/` segment here.
 *
 * Fan-content policy: https://www.riotgames.com/en/legal (fan-made, non-commercial).
 */
const CDRAGON_UIKIT_SOUND =
  "https://raw.communitydragon.org/7.5/plugins/rcp-fe-lol-uikit/global/default";

/**
 * Typed id union for the uikit SFX catalog. Each id is a stable slug used as the
 * {@link SoundEntry.id} and consumed by {@link uikitSoundUrl}. Keeping this a
 * union (rather than `string`) means playing an unknown clip is a compile error
 * and {@link uikitSoundUrl}'s filename map stays exhaustive — the same guard
 * {@link SfxId} gives the friend-finder set.
 */
export type UikitSfxId =
  // Button
  | "button-gold-click"
  | "button-gold-hover"
  | "button-circlegold-hover"
  | "button-circlex-click"
  | "button-locked-click"
  | "magic-button-click"
  | "magic-button-hover"
  | "arrow-button-click"
  | "arrow-button-hover"
  | "purchase-button-click"
  | "purchase-button-hover"
  | "nav-button-text-click"
  // Input
  | "checkbox-click"
  | "radio-click"
  | "dropdown-click"
  | "dropdown-select"
  // Generic
  | "click-generic"
  | "generic-click-small"
  // Celebrate
  | "celebrate-notif-intro"
  | "celebrate-receive-generic";

/**
 * uikit SFX streaming URL for a given {@link UikitSfxId}. Mirrors the
 * {@link soundUrl} house style: a `Record<UikitSfxId, string>` filename map (so
 * a new id fails typecheck instead of silently 404-ing) resolved against the
 * pinned patch-7.5 uikit base ({@link CDRAGON_UIKIT_SOUND}).
 *
 * Parallel to `soundUrl` but a SEPARATE resolver because the uikit set lives in
 * a different plugin whose clips sit at the plugin ROOT (no `sounds/` subdir).
 * Feed the returned URL to an `HTMLAudioElement` in the APP layer (see the
 * `useSound` hook). NO fetching or playback happens here — this only builds a
 * URL, and audio playback must stay user-gesture-initiated.
 *
 * All 20 confirmed HTTP 200 audio/ogg (2026-07, issue #439):
 *   uikitSoundUrl("button-gold-click") → …/default/sfx-uikit-button-gold-click.ogg
 *   uikitSoundUrl("checkbox-click")    → …/default/sfx-uikit-checkbox-click.ogg
 *   uikitSoundUrl("dropdown-select")   → …/default/sfx-uikit-dropdown-select.ogg
 *
 * Source: CommunityDragon rcp-fe-lol-uikit (patch 7.5) · global/default/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const uikitSoundUrl = (id: UikitSfxId): string => {
  const FILE: Record<UikitSfxId, string> = {
    // Button
    "button-gold-click":       "sfx-uikit-button-gold-click.ogg",
    "button-gold-hover":       "sfx-uikit-button-gold-hover.ogg",
    "button-circlegold-hover": "sfx-uikit-button-circlegold-hover.ogg",
    "button-circlex-click":    "sfx-uikit-button-circlex-click.ogg",
    "button-locked-click":     "sfx-uikit-button-locked-click.ogg",
    "magic-button-click":      "sfx-uikit-magic-button-click.ogg",
    "magic-button-hover":      "sfx-uikit-magic-button-hover.ogg",
    "arrow-button-click":      "sfx-uikit-arrow-button-click.ogg",
    "arrow-button-hover":      "sfx-uikit-arrow-button-hover.ogg",
    "purchase-button-click":   "sfx-purchase-button-click.ogg",
    "purchase-button-hover":   "sfx-purchase-button-hover.ogg",
    "nav-button-text-click":   "sfx-nav-button-text-click.ogg",
    // Input
    "checkbox-click":          "sfx-uikit-checkbox-click.ogg",
    "radio-click":             "sfx-uikit-radio-click.ogg",
    "dropdown-click":          "sfx-uikit-dropdown-click.ogg",
    "dropdown-select":         "sfx-uikit-dropdown-select.ogg",
    // Generic
    "click-generic":           "sfx-uikit-click-generic.ogg",
    "generic-click-small":     "sfx-uikit-generic-click-small.ogg",
    // Celebrate
    "celebrate-notif-intro":     "sfx-celebrate-notif-intro.ogg",
    "celebrate-receive-generic": "sfx-celebrate-receive-generic.ogg",
  };
  return `${CDRAGON_UIKIT_SOUND}/${FILE[id]}`;
};

/**
 * The uikit SFX catalog (issue #439) — the ~20 generic client-wide interaction
 * clips the real client plays across buttons, inputs, dropdowns, and reward
 * celebrations. Zero overlap with {@link FRIEND_FINDER_SFX} (the social layer);
 * this is the generic UI layer. Ordered Button → Input → Generic → Celebrate so
 * the `SoundLibrary` groups read top-to-bottom in that order. Pages/showcase
 * pass this to the `SoundLibrary` component; components import only the
 * {@link SoundEntry} TYPE, never this value.
 *
 * Resolve each entry's streaming URL with `uikitSoundUrl(entry.id)` — the uikit
 * resolver, NOT `soundUrl` (different plugin/base; see {@link uikitSoundUrl}).
 */
export const UIKIT_SFX: readonly SoundEntry[] = [
  // Button
  { id: "button-gold-click",       label: "Gold Button Click",        category: "Button",    filename: "sfx-uikit-button-gold-click.ogg" },
  { id: "button-gold-hover",       label: "Gold Button Hover",        category: "Button",    filename: "sfx-uikit-button-gold-hover.ogg" },
  { id: "button-circlegold-hover", label: "Circle Gold Button Hover", category: "Button",    filename: "sfx-uikit-button-circlegold-hover.ogg" },
  { id: "button-circlex-click",    label: "Circle X Button Click",    category: "Button",    filename: "sfx-uikit-button-circlex-click.ogg" },
  { id: "button-locked-click",     label: "Locked Button Click",      category: "Button",    filename: "sfx-uikit-button-locked-click.ogg" },
  { id: "magic-button-click",      label: "Magic Button Click",       category: "Button",    filename: "sfx-uikit-magic-button-click.ogg" },
  { id: "magic-button-hover",      label: "Magic Button Hover",       category: "Button",    filename: "sfx-uikit-magic-button-hover.ogg" },
  { id: "arrow-button-click",      label: "Arrow Button Click",       category: "Button",    filename: "sfx-uikit-arrow-button-click.ogg" },
  { id: "arrow-button-hover",      label: "Arrow Button Hover",       category: "Button",    filename: "sfx-uikit-arrow-button-hover.ogg" },
  { id: "purchase-button-click",   label: "Purchase Button Click",    category: "Button",    filename: "sfx-purchase-button-click.ogg" },
  { id: "purchase-button-hover",   label: "Purchase Button Hover",    category: "Button",    filename: "sfx-purchase-button-hover.ogg" },
  { id: "nav-button-text-click",   label: "Nav Text Button Click",    category: "Button",    filename: "sfx-nav-button-text-click.ogg" },
  // Input
  { id: "checkbox-click",          label: "Checkbox Click",           category: "Input",     filename: "sfx-uikit-checkbox-click.ogg" },
  { id: "radio-click",             label: "Radio Click",              category: "Input",     filename: "sfx-uikit-radio-click.ogg" },
  { id: "dropdown-click",          label: "Dropdown Open",            category: "Input",     filename: "sfx-uikit-dropdown-click.ogg" },
  { id: "dropdown-select",         label: "Dropdown Select",          category: "Input",     filename: "sfx-uikit-dropdown-select.ogg" },
  // Generic
  { id: "click-generic",           label: "Generic Click",            category: "Generic",   filename: "sfx-uikit-click-generic.ogg" },
  { id: "generic-click-small",     label: "Generic Click (Small)",    category: "Generic",   filename: "sfx-uikit-generic-click-small.ogg" },
  // Celebrate
  { id: "celebrate-notif-intro",     label: "Celebration Intro",      category: "Celebrate", filename: "sfx-celebrate-notif-intro.ogg" },
  { id: "celebrate-receive-generic", label: "Celebration Receive",    category: "Celebrate", filename: "sfx-celebrate-receive-generic.ogg" },
];

/**
 * Party/lobby full-bleed background art (issue #461) — the dark forested
 * Summoner's Rift backdrop the live client paints behind the party lobby banner
 * grid. Each game mode ships its own under the game-data `gamemodeassets` tree
 * (`gamemodeassets/<mode>/img/parties-background.jpg`); `classic_sru` is the
 * default 5v5 SR. Pass the returned URL as an <img> `src` (or CSS
 * `background-image`) full-bleed behind the lobby content — keep a vignette /
 * scrim over it for text legibility. NO fetching happens here; pages supply the
 * resolved URL. Tokens rule applies to CSS colors, not asset URLs.
 *
 * The `latest` pin is evergreen: confirmed HTTP 200 image/jpeg at BOTH the 7.5
 * snapshot and `latest` (2026-07, issue #461), so `latest` tracks the current
 * live art without a version bump.
 *
 *   partiesBackgroundUrl()             → …/gamemodeassets/classic_sru/img/parties-background.jpg
 *   partiesBackgroundUrl("classic_sru") → same (default mode)
 *
 * Source: CommunityDragon rcp-be-lol-game-data · content/src/leagueclient/gamemodeassets/
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const partiesBackgroundUrl = (mode = "classic_sru"): string =>
  `${CDRAGON_GAME_DATA}/content/src/leagueclient/gamemodeassets/${mode}/img/parties-background.jpg`;
// Lobby (CONFIRM) button videos (issue #454) — the rcp-fe-lol-PATCHER plugin's
// native lobby-button state machine.
//
// PIN 7.5 (deliberate): unlike the other video helpers here, the patcher plugin
// mirror is NOT carried at `latest` — every lobby-button-*.webm 404s on the
// latest tree and returns 206 video/webm only at patch 7.5 (re-probed 2026-07,
// issue #454). So this family hard-pins the `7.5` CDN tag rather than reusing the
// `latest`-based `CDRAGON_*` bases above. Kept as its own const so a future
// re-pin touches one line.
//
// The clips are 146×58 VP8-with-alpha (alpha_mode=1) — the SAME frame family as
// the play-button set (`playButtonVideoUrl`), i.e. they carry the FULL button
// silhouette (concave-left arrow chevron, dark fill) for the opaque states
// (intro/hover-intro/release/magic-release) and a transparent-center frame-only
// shimmer for `hover-loop`/`hover-outro`. Because they carry the whole button
// FACE (not just an additive glow), the consuming button SWAPS its CSS frame for
// the video while active rather than stacking (issue #423 doubled-art class); see
// HextechButton `lobbyVideoSources`. `disabled-intro` is the shared 178×108
// disabled reveal.
// ---------------------------------------------------------------------------

const CDRAGON_PATCHER_VIDEOS_75 =
  "https://raw.communitydragon.org/7.5/plugins/rcp-fe-lol-patcher/global/default/videos";

/**
 * Lobby (CONFIRM) button state for {@link lobbyButtonVideoUrl}. Mirrors the
 * play-button / lock-in state machines:
 *   `intro`        one-shot enabled reveal — gold frame flashes cyan and settles
 *                  to the teal-framed dark idle face (played once on mount).
 *   `hoverIntro`   one-shot hover-in — the dark face brightens its teal frame.
 *   `hoverLoop`    ambient hover loop — frame-only travelling border shimmer
 *                  (transparent center; composites over the settled dark face).
 *   `hoverOutro`   one-shot hover-out — the hover shimmer fades back down.
 *   `release`      one-shot press-release — cyan energy streaks sweep the fill.
 *   `magicRelease` one-shot press-release accent — brighter magic flare variant.
 *   `disabledIntro` one-shot disabled reveal — the shared grey button-disabled
 *                  intro (178×108 canvas), settling to the grey disabled face.
 */
export type LobbyButtonVideoState =
  | "intro"
  | "hoverIntro"
  | "hoverLoop"
  | "hoverOutro"
  | "release"
  | "magicRelease"
  | "disabledIntro";

/**
 * Real-client lobby (CONFIRM) button state video (webm, VP8 straight alpha) for a
 * given state — the rcp-fe-lol-patcher plugin's native lobby-button animation set
 * (issue #454). Each clip is 146×58 (the shared 178×108 for `disabledIntro`) and
 * carries the FULL button face for the opaque states, so the consuming button
 * SWAPS its CSS frame for the video while the layer is active (issue #423) rather
 * than stacking (which would double the frame).
 *
 * PIN 7.5 — the patcher plugin videos are mirrored only at CDragon patch 7.5;
 * `latest` 404s (re-probed 2026-07). See {@link CDRAGON_PATCHER_VIDEOS_75}.
 *
 * States → file:
 *   "intro"         → lobby-button-intro.webm
 *   "hoverIntro"    → lobby-button-hover-intro.webm
 *   "hoverLoop"     → lobby-button-hover-loop.webm
 *   "hoverOutro"    → lobby-button-hover-outro.webm
 *   "release"       → lobby-button-release.webm
 *   "magicRelease"  → lobby-button-magic-release.webm
 *   "disabledIntro" → button-disabled-intro.webm  (shared disabled reveal)
 *
 * All seven confirmed HTTP 206 video/webm with alpha at patch 7.5 (2026-07).
 * Feed the returned URL to the `lobbyVideoSources` of `HextechButton` (primary
 * variant). NO fetching happens here — pages/showcase supply URLs.
 *
 * Source: CommunityDragon rcp-fe-lol-patcher · global/default/videos/ (patch 7.5)
 * License: Riot fan-content policy (non-commercial fan use).
 */
export const lobbyButtonVideoUrl = (state: LobbyButtonVideoState): string => {
  const FILE: Record<LobbyButtonVideoState, string> = {
    intro: "lobby-button-intro.webm",
    hoverIntro: "lobby-button-hover-intro.webm",
    hoverLoop: "lobby-button-hover-loop.webm",
    hoverOutro: "lobby-button-hover-outro.webm",
    release: "lobby-button-release.webm",
    magicRelease: "lobby-button-magic-release.webm",
    disabledIntro: "button-disabled-intro.webm",
  };
  return `${CDRAGON_PATCHER_VIDEOS_75}/${FILE[state]}`;
};
