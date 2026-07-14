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
