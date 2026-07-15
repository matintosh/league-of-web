# Icon Sources

Catalog of all Hextech iconography URL patterns used in league-of-web, researched in
the #147 real-iconography sweep (2026-07). All CommunityDragon assets are sourced under
the Riot Games Fan Content Policy (non-commercial, fan-made).

---

## CommunityDragon — rcp-fe-lol-static-assets

Base: `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/`

### Currency

| Asset | Path | Used in |
|-------|------|---------|
| RP coin SVG (13×14) | `currency/icons/rp.svg` | CurrencyDisplay `rpIconSrc` |
| BE hexagon PNG | `images/be-icon.png` | CurrencyDisplay `beIconSrc`, Essence nav button |
| RP icon 24px | `images/icon-rp-24.png` | (available, not yet wired) |
| RP icon 32px | `images/icon-rp-32.png` | (available, not yet wired) |
| RP icon 48px | `images/icon-rp-48.png` | (available, not yet wired) |
| RP icon 72px | `images/icon-rp-72.png` | (available, not yet wired) |

### Navigation bar icons

| Asset | Path | Used in |
|-------|------|---------|
| Loot SVG | `images/nav-icon-loot.svg` | Shell loot nav button |
| Collections SVG | `images/nav-icon-collections.svg` | (available, not yet wired) |
| Store SVG | `images/nav-icon-store.svg` | (available, not yet wired) |
| Profile SVG | `images/nav-icon-profile.svg` | (available, not yet wired) |

Note: There is no `nav-icon-essence.svg` in CommunityDragon. The Essence nav button uses
`images/be-icon.png` at 18px instead.

---

## Current-era nav icons (era-shift epic #384 / asset hunt #389)

The modern client's top nav band carries a **right-side icon cluster** (menu-access glyphs),
a **currency + RP top-up** group, then the **profile chip** with **window controls** at the
far top-right. The assets below are the real CDN sources for that band. All curl-verified
**HTTP 200** on 2026-07-15 against CommunityDragon `latest`. Glyphs were rasterized and
visually confirmed (noted in the "Depicts" column).

### A. Menu-access glyphs — static-assets `images/` (nav-band SVGs)

Base: `.../rcp-fe-lol-static-assets/global/default/images/`

| Asset | Path | Dims (viewBox) | Depicts | For issue |
|-------|------|----------------|---------|-----------|
| Loot | `nav-icon-loot.svg` | 27×25 | Hextech chest (loot) | #386 loot |
| Collections | `nav-icon-collections.svg` | 26×24 | Stacked cards (collection) | #386 |
| Store | `nav-icon-store.svg` | 20×19 | Three stacked coins (`#f0e6d2` fill) | #386 store |
| Profile | `nav-icon-profile.svg` | 26×24 | Bust-in-frame silhouette | #387 profile |
| Updates/notifications | `top-nav-updates-eat-icon.svg` | 26×24 | Player-bust badge (updates/notif) — same band canvas as profile/collections | #386 notif |
| Loyalty medallion | `loyalty-nav-bar.svg` | 30×30 | Gold circular scroll medallion (loyalty) | #386 (optional) |

### B. RP top-up button — static-assets `images/` (3 interactive states)

Circular dark disc with a gold **`+`**; the "add RP" affordance next to currency.

| State | Path | Dims |
|-------|------|------|
| Resting | `rp-top-up-nav-resting.svg` | 20×20 |
| Hover | `rp-top-up-nav-hover.svg` | 20×20 |
| Pressed | `rp-top-up-nav-pressed.svg` | 20×20 |

(`rp-top-up-nav-resting.png` / `-hover.png` / `-pressed.png` / `-loading.png` raster
variants also exist alongside the SVGs.)

### C. Window / app controls — **rcp-fe-lol-navigation** plugin root

Base: `.../rcp-fe-lol-navigation/global/default/`

**Corrects the earlier "Window controls: no CDN source" note** — the navigation plugin
ships them. All **72×72 PNG**, cream `#cdbe91`-family glyph on transparent:

| Asset | Path | Depicts | For issue |
|-------|------|---------|-----------|
| Close | `control-close.png` | X | #385/#387 window ctl |
| Hide (minimize) | `control-hide.png` | Bottom minimize dash | #385/#387 |
| Settings | `control-settings.png` | Gear | #386/#387 settings |
| Settings (disabled) | `control-settings-disabled.png` | Dimmed gear | #386/#387 |
| Help | `control-help.png` | Question mark | #386/#387 |

### D. Missions / objectives — **rcp-fe-lol-navigation** plugin root

| Asset | Path | Dims | Depicts |
|-------|------|------|---------|
| Mission (scroll) | `missionicon.svg` | 20×20 | Gold scroll/objective list (`#cdbe91`) |
| Daily / FWOTD | `dailyicon.svg` | 20×20 | Down-arrow daily reward |
| All (list) | `allicon.svg` | 20×20 | Grid/list rows ("all missions") |
| Mission-XP chevron | `mxp-icon.svg` | 20×20 | Blue double-chevron (`#616EFF`) |
| Blue-XP | `bxp-icon.png` | 20×20 | Blue XP glyph |
| Mission tracker button | `mission_tracker_button.png` | 152×768 | 6-state scroll button sprite (default/hover/pressed/selected/…) |
| Store RP (nav) | `store-rp.png` | 72×72 | RP purchase gem/shards glyph |

### E. Social status glyphs — static-assets `images/`

| Asset | Path | Dims | Depicts | For issue |
|-------|------|------|---------|-----------|
| Friend status sprite | `friend_icons.png` | 72×216 | 3-stacked person glyphs: **available (cream)**, **away (gold `#e8a000`)**, **offline (grey)** — the social presence dot/bust colors | #388 social colors |

### F. Generic uikit glyphs (fallbacks — not nav-band specific)

Base: `.../rcp-fe-lol-uikit/global/default/images/`

| Asset | Path | Dims | Depicts |
|-------|------|------|---------|
| Settings | `icon_settings.png` | 72×72 | Fine gear (uikit variant) |
| Close | `close.png` | 72×72 | X |
| Drawer close | `drawer-close-button.svg` | 24×24 | X (thin) |
| Info | `info-icon.svg` | 18×18 | i-in-circle |
| Clock | `hextech-ui-icons/clock.svg` | 14×14 | Clock (static-assets) |
| Lock closed | `hextech-ui-icons/lock-closed.svg` | 27×40 | Padlock (static-assets) |
| Question mark | `hextech-ui-icons/question-mark.svg` | 20×20 | Help (static-assets) |

**Search glyph — lives in the SOCIAL RAIL header, not the nav band.** The committed
current-era capture (`client-current-home-activity-center.jpg`) confirms the magnifying-glass
search sits in the social rail header row (alongside add-friend / create-group / group-list),
NOT in the nav-band icon cluster. There is no dedicated nav-band magnifying-glass in the
static-assets, navigation, social, or uikit plugins (only `uikit/images/search-box-clear.png`
= the clear-X inside a search field, and `static-assets/images/icon-search-empty-poro.svg` =
an empty-state poro). So #386's tentative "search?" nav icon should be **dropped from the nav
band**; the search affordance belongs to the rail header (#388 territory) as a uikit-style glyph.

### Current-era reference captures (committed)

Real full-window client screenshots of the **current-era chrome** (post-2024/2025 redesign),
committed to `docs/reference/` as the visual ground truth for the era-shift epic #384. All
are Riot-published assets (not fan concepts) from the official *`/dev`: Seasons in 2025*
article, hosted on Riot's CMS. Riot Games Fan Content Policy (non-commercial reference use).

Source article (all five): https://www.leagueoflegends.com/en-us/news/dev/dev-seasons-in-2025/
Direct-image host: `https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/`

| File | Dims | Depicts (chrome features visible) |
|------|------|-----------------------------------|
| `client-current-home-activity-center.jpg` | 1280×720 | **Best full-chrome home ref.** No title bar; PLAY top-left; LEAGUE/TFT/LoR nav; right-side icon cluster (collections/missions/loot/store/coins + gold Your-Shop CTA); stacked currency (2152 RP / 30456 BE) with `+` top-up; profile chip far top-right (lvl 350, name, bell) with help/minimize/gear/close controls; slim social rail with search glyph in its header |
| `client-current-home-ambessa.jpg` | 1280×720 | Same chrome; Ambessa new-champion Activity Center variant |
| `client-current-battlepass-chapter.jpg` | 1280×720 | Battle Pass "Chapter II" track, full nav + chip + rail |
| `client-current-battlepass-level.jpg` | 1280×720 | Battle Pass level detail, full chrome |
| `client-current-objectives-modal.jpg` | 1920×1080 | **Highest-res.** Objectives modal over ARAM lobby; PARTY button top-left, full nav band, profile chip (status text), social rail |

Note: these carry a mocked "V11.9" version tag (Riot's demo build for the 2025 reveal) but the
chrome IS the live current-era Activity Center layout (Season 1 Act 1 "Welcome to Noxus" /
Ambessa / Arcane content confirms late-2024/2025). Wiki `Client.png` was rejected — despite a
2026 upload date it is the OLD 2017-era inline-tab layout (no top-right profile chip).

### Position (role) icons

All at 34×34, using hardcoded fills:
- Default variant: gold fills (`#c8aa6e` + `#785a28` at 0.5 opacity) — readable on dark tokens
- Light variant: near-white fills (`#edeeee` + `#c0c2c2` at 0.5 opacity) — for selected state
- Red variant: enemy-side use (not used in our client clone)

The SVGs reference `./glow.css` which does not exist on the CDN; the base fills still render correctly.

| Role | CommunityDragon slug | Default path | Light path |
|------|---------------------|--------------|------------|
| Top | `top` | `svg/position-top.svg` | `svg/position-top-light.svg` |
| Jungle | `jungle` | `svg/position-jungle.svg` | `svg/position-jungle-light.svg` |
| Mid | `middle` | `svg/position-middle.svg` | `svg/position-middle-light.svg` |
| Bottom | `bottom` | `svg/position-bottom.svg` | `svg/position-bottom-light.svg` |
| Support | `utility` | `svg/position-utility.svg` | `svg/position-utility-light.svg` |

Note the slug mapping: **mid → middle**, **support → utility**.

### Ranked

| Asset | Path | Notes |
|-------|------|-------|
| Ranked mini-crests | `ranked-mini-crests/{tier}.svg` | tier = iron/bronze/silver/gold/platinum/diamond/master/grandmaster/challenger/emerald |
| (see also jsDelivr emblems below) | | |

### Hextech UI icons

| Asset family | Path pattern | Notes |
|-------------|-------------|-------|
| Honor icons | `images/honor-*.png` | Pre/post-game honor voting |
| Mastery icons | `images/champion-mastery-*.png` | Mastery levels 1–7 |
| Hextech UI misc | `images/hextech-*.svg` | Loot frame borders, crafting glyphs |
| Control ward icons | `images/control-ward-*.png` | Store/shop item images |

### Parties interactive states

| Asset | Path | Notes |
|-------|------|-------|
| Parties icon default | `images/parties-icon-*.svg` | Party hub UI glyphs |
| Interactive state assets | See rcp-fe-lol-parties plugin | Prefer parties plugin for party-specific art |

---

## CommunityDragon — rcp-fe-lol-parties

Base: `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-parties/global/default/`

### Map crests (PNGs)

| Map | Key | Path | Used in |
|-----|-----|------|---------|
| Summoner's Rift | `sr` | `map_sr.png` | GameModeCard, ModeSelectScreen |
| Howling Abyss (ARAM) | `ha` | `map_ha.png` | GameModeCard, ModeSelectScreen |
| Teamfight Tactics | `tft` | `map_tft.png` | GameModeCard, ModeSelectScreen |
| Twisted Treeline | `tt` | `map_tt.png` | GameModeCard, ModeSelectScreen |
| Rotating Game Mode | `rgm` | `map_rgm.png` | (available, not yet wired) |

All verified HTTP 200 as of 2026-07.

---

## CommunityDragon — client video (.webm) assets

DDragon ships **no video assets** — CommunityDragon is the only mirror for the client's
ambient/magic `.webm` loops. The CDN honors HTTP range requests (returns `206 video/webm`),
so these URLs stream directly from a `<video src>` element; no download step is needed.
Helpers live in `@low/fixtures` (cdragon.ts), added by issue #301. No components consume
them yet — this issue lands the helpers only.

Enumerate any directory below via its JSON listing:
`https://raw.communitydragon.org/json/latest/plugins/<plugin>/global/default/<dir>/`

**CAVEAT:** some filenames are URL-encoded on the CDN, e.g.
`pin_intro%28fixed%29.webm` (raw `(` `)`). A browser `<video src>` must use the encoded
form — encode `(` → `%28`, `)` → `%29`.

### rcp-fe-lol-parties — ambient background loops

Base: `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-parties/global/default/`

| Asset | Path | Helper |
|-------|------|--------|
| Party status loop | `party-status-bg-loop.webm` | `partiesBgLoopUrl("party-status")` |
| Queue delay loop | `queue-delay-bg-loop.webm` | `partiesBgLoopUrl("queue-delay")` |
| Social panel loop | `social-panel-bg-loop.webm` | `partiesBgLoopUrl("social-panel")` |

(+17 total `*-bg-loop.webm` in the dir — enumerate via JSON listing.)

### rcp-fe-lol-champ-select — /video/

Base: `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-champ-select/global/default/video/`

| Dir | Contents | Helper |
|-----|----------|--------|
| `summoner-object/` | 9 files `summoner-object-magic-action-{blue,gold,red}-{intro,idle,outro}.webm` | `summonerObjectMagicUrl(side, phase)` |
| `card-select/` | idle loop, card intros, hover states (6 files) | `champSelectCardVideoUrl(name)` |
| `champion-ring/` | `ban-circle-slash-{red,blue}` | (no helper — enumerate) |
| `position-assignment/` | 8 `path_{north,south}_{role}`; note encoded `pin_intro%28fixed%29.webm` | (no helper — enumerate) |
| `lock-in/`, `cherry/` | lock-in + Arena (cherry) flourishes | (no helper — enumerate) |

### rcp-fe-lol-uikit — /videos/

Base: `https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-uikit/global/default/videos/`

| Asset | Path | Helper |
|-------|------|--------|
| Celebration backdrop (~1.2 MB) | `celebration-bg-magic.webm` | `uikitCelebrationMagicUrl("celebration-bg")` |
| Celebration vignette intro | `vignette-celebration-intro-magic.webm` | `uikitCelebrationMagicUrl("vignette-celebration-intro")` |

### Other video dirs (no helper yet — enumerate via JSON listing)

| Plugin | Dir / asset | Notes |
|--------|-------------|-------|
| rcp-fe-lol-navigation | `eog_looping_bgmagic.webm` | ~3.9 MB end-of-game backdrop loop |
| rcp-fe-lol-tft | `videos/background-sparkles`, `videos/claimable-sparkles-{free,keystone,premium}` | TFT hub sparkles |
| rcp-fe-lol-event-hub | `videos/` (~19 webms) | season-pass / milestone flourishes |

### CloudFront — champion ability preview clips (future collection use)

Base: `https://d28xe8vt774jo5.cloudfront.net/champion-abilities/<4-digit-champId>/`
Pattern: `ability_<4-digit-champId>_<Q1|W1|E1|R1|P1>.webm`
(canonical path per the `abilityVideoPath` field in CDragon champion JSON).

Example (verified `206`, served as `application/octet-stream` — valid webm bytes,
just untyped by CloudFront): `champion-abilities/0266/ability_0266_Q1.webm` (Aatrox Q).

Not wrapped in a helper in issue #301 — reserved for a future collection/champion-detail
ability-preview feature. When wired, add an `abilityPreviewUrl(champId, slot)` helper here
following the CDragon helper pattern (zero-pad champId to 4 digits).

---

## jsDelivr — magisteriis/lol-icons-and-emblems

Base: `https://cdn.jsdelivr.net/gh/magisteriis/lol-icons-and-emblems@main/ranked-emblems/`  
License: **Unlicense** (public domain) — https://github.com/magisteriis/lol-icons-and-emblems

Full-size ranked emblem PNGs: `Emblem_{Tier}.png`

| Tier | Available | Notes |
|------|-----------|-------|
| Iron | ✓ | |
| Bronze | ✓ | |
| Silver | ✓ | |
| Gold | ✓ | |
| Platinum | ✓ | |
| Diamond | ✓ | |
| Master | ✓ | |
| Grandmaster | ✓ | |
| Challenger | ✓ | |
| Emerald | ✗ | 404 — not in this repo; use CommunityDragon mini-crest as fallback |

Used by: `rankedEmblemUrl(tier)` in `@low/fixtures` (cdragon.ts). Consumed by issue #141
(Profile ranked panel) — that issue lands the UI; this issue lands the helpers.

---

## Reference design — Ricky Linn / Hextech Iconography

`docs/reference/hextech-iconography-sheet.jpg` — design-language reference sheet (800×600).
Designed by Ricky Linn; published on Behance/Pinterest as part of the Hextech visual
identity system. Used for design reference only — not served in the app.
Source: https://www.pinterest.com/pin/hextech-iconography/

---

## Era-shift placeholder gap analysis (#389 → #386/#387/#388)

Cross-check of what each era-shift child issue needs vs what the asset hunt found. See the
"Current-era nav icons" section above for the exact paths.

**#386 — nav icon cluster:** all covered, no placeholders needed.
- loot → `nav-icon-loot.svg` ✓ · collections → `nav-icon-collections.svg` ✓ ·
  store → `nav-icon-store.svg` (three coins) ✓ · missions/objectives → `missionicon.svg` /
  `mission_tracker_button.png` ✓ · updates/notifications → `top-nav-updates-eat-icon.svg` ✓ ·
  loyalty → `loyalty-nav-bar.svg` ✓ · RP top-up `+` → `rp-top-up-nav-{resting,hover,pressed}.svg` ✓
- **"search?" nav icon: DROP IT** — the capture shows search in the social-rail header, not the
  nav band (see search-glyph note above). No nav-band placeholder required.

**#387 — profile chip top-right:** mostly covered.
- profile glyph → `nav-icon-profile.svg` ✓ · window controls (close/hide/settings/help) →
  `control-*.png` (navigation plugin, 72×72) ✓
- **GAP (soft): notification bell glyph.** The capture shows a small bell beside the profile
  name. No standalone bell asset was found (`top-nav-updates-eat-icon.svg` is a player-bust
  badge, not a bell). If #387 needs the literal bell → **placeholder (tokens hex-glyph) + note**,
  or reuse the updates badge. Likely a uikit-internal glyph not exposed as a discrete file.

**#388 — social rail slim pass:** covered.
- friend status colors → `friend_icons.png` (72×216 sprite: available cream / away gold
  `#e8a000` / offline grey) ✓ — authoritative source for the "weird social colors" retune.
- rail-header search glyph → uikit-style magnifying glass (rail header, per capture) ✓

**Net:** one soft placeholder gap only (the #387 notification bell). Everything else in the
era-shift cluster has a real CDN asset. If #389 closes before #386/#387/#388 build, file a
one-line follow-up only for the bell.

---

## Out of scope (noted)

- **SocialDock / SocialHeader** button glyphs: CommunityDragon social plugin ships mask
  overlays, not standalone button glyphs. Our inline SVGs are kept.
- **Window controls** (minimize/close/settings/help): ~~OS-level chrome, no CDN source~~
  **UPDATED (#389):** the `rcp-fe-lol-navigation` plugin **does** ship them as 72×72 PNGs
  (`control-close.png`, `control-hide.png`, `control-settings.png`, `control-help.png`) —
  see "Current-era nav icons › C. Window / app controls" above.
- **Emerald ranked emblem**: 404 on jsDelivr. Use `ranked-mini-crests/emerald.svg` from
  CommunityDragon static-assets if needed by issue #141.
