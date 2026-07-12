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

## Out of scope (noted)

- **SocialDock / SocialHeader** button glyphs: CommunityDragon social plugin ships mask
  overlays, not standalone button glyphs. Our inline SVGs are kept.
- **Window controls** (minimize/close): OS-level chrome, no CDN source.
- **Emerald ranked emblem**: 404 on jsDelivr. Use `ranked-mini-crests/emerald.svg` from
  CommunityDragon static-assets if needed by issue #141.
