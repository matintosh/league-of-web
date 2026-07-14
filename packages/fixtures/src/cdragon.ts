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
