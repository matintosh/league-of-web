# Video Assets

Catalog of the real League client's per-component `.webm` "magic layer" videos,
extracted by the repo owner from the game's WAD archives and cross-checked against
CommunityDragon. Per `docs/reference/HEXTECH-UI-NOTES.md`, video **is** the client's
magic layer: "ethereal, magical effects or highly-detailed mechanical animations"
ship as HTML5 `<video>` webm (mostly with an alpha channel) sequenced intro → loop →
outro. This doc is the durable record; the extraction folder itself
(`~/Downloads/videos`) is volatile and not committed.

- **Source:** repo owner's WAD extraction of the live client (198 `.webm`, 136 MB),
  probed 2026-07-13.
- **Licensing:** Riot Games Fan Content Policy (non-commercial, fan-made) — the same
  basis as every CommunityDragon asset in `docs/reference/ICON-SOURCES.md`.
- **Codecs:** VP8 or VP9, all alpha-capable. 194/198 carry a real alpha channel; the
  4 opaque files are full-frame backgrounds/splash (`npe-ft-intro-video`,
  `video-splash-ss19-c`, `champion-mastery/cm-celebration-background`,
  `honor/voting_bg`).

---

## Key finding: the whole corpus is one CDragon subtree

Every one of the 198 extracted files maps **1:1, by exact relative path**, into a
single CommunityDragon directory:

```
https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/videos/
```

i.e. the local `ranked/emblem-wings-magic-gold.webm` is
`…/videos/ranked/emblem-wings-magic-gold.webm` on the CDN. All 198 URLs were
curl-verified `206 video/webm` (range request `bytes=0-100`) on 2026-07-13. The CDN
honors range requests, so these stream directly from a `<video src>` with no download
step — exactly like the helpers issue #301 already added in `packages/fixtures/src/cdragon.ts`.

**Nothing in this corpus needs to be committed to the repo.** The other plugins named
in the research brief (`rcp-fe-lol-ranked`, `-honor`, `-champion-mastery`, `-challenges`,
`-store`, `-yourshop`) ship **no** `.webm` of their own — the client centralizes all of
these ambient/magic videos under `rcp-fe-lol-static-assets/…/videos/`. (`rcp-fe-lol-loot`
has 131 webm and `rcp-fe-lol-navigation` 43, but none overlap this extraction — those are
separate loot-reveal / nav backdrops.)

### Serving strategy

1. **Default: stream from CDragon** via a `@low/fixtures` helper. Add a
   `staticVideoUrl(path)` builder (and named helpers per family, following the
   `partiesBgLoopUrl` / `summonerObjectMagicUrl` pattern already in `cdragon.ts`) that
   returns `…/rcp-fe-lol-static-assets/global/default/videos/<path>`. Feed it to the
   existing `AmbientVideoLayer` primitive (`packages/ui/src/chrome/ambient-video-layer.tsx`)
   or a component-local `<video>` per the Hextech notes' intro→loop→outro pattern.
2. **Local commit only as a fallback**, and only when a file is **unmirrored AND
   <500 KB AND wired to a shipping component**, dropped into `apps/web/public/media/`.
   Given the finding above, **no file currently qualifies** — the corpus is fully
   mirrored, so the local-copy path is documented for completeness but unused. Never
   commit the whole corpus.
3. **Reduced motion:** `AmbientVideoLayer` already hides the video under
   `prefers-reduced-motion: reduce`; component-local players should match.

### Column notes for the catalog

- **alpha** — probed by drawing a mid-duration frame to a canvas and scanning for any
  pixel with `alpha < 255` (mid-seek avoids blank intro frames).
- **CDragon** — `MIRRORED` means the URL `…/videos/<dir>/<file>` returns `206`
  (all 198 do). Prefix the base above.
- **surface** — the league-of-web component/screen this would drive, or `no surface yet`.

---

## Catalog

Base for every CDragon URL below:
`https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/videos/` + the file's relative path. All 198 = `MIRRORED (206)`.

### (root) — chrome / lobby / ready-check / progress

| file | dims | dur | size | alpha | what it shows | our surface |
|------|------|-----|------|-------|---------------|-------------|
| banner_ally.webm | 272×620 | 1.8s | 655 KB | yes | ally profile-banner sweep flourish | `lobby/player-banner`, `chrome/profile-banner` |
| banner_primary.webm | 272×620 | 1.8s | 612 KB | yes | primary/self profile-banner sweep | `lobby/player-banner`, `chrome/profile-banner` |
| button-disabled-intro.webm | 178×108 | 2.1s | 162 KB | yes | disabled PLAY-tier button settle-in | `chrome/play-button` (#309) |
| division_up.webm | 1280×720 | 5.0s | 1013 KB | yes | ranked division-up burst (full-frame) | `collection/profile-ranked-screen` — no rank-change surface yet |
| find-match-button-active.webm | 230×100 | 1.3s | 130 KB | yes | FIND MATCH pressed/active flash | `chrome/finding-match-panel` / FIND MATCH btn (#310) |
| find-match-button-all-returned.webm | 300×200 | 5.0s | 274 KB | yes | "all players returned" celebratory loop | FIND MATCH btn (#310) |
| find-match-button-hover.webm | 230×100 | 4.8s | 323 KB | yes | FIND MATCH hover loop | FIND MATCH btn (#310) |
| find-match-button-idle.webm | 230×100 | 7.6s | 813 KB | yes | FIND MATCH idle ambient loop | FIND MATCH btn (#310) |
| find-match-button-intro.webm | 230×100 | 1.1s | 140 KB | yes | FIND MATCH reveal | FIND MATCH btn (#310) |
| find-match-button-pulse.webm | 300×200 | 1.6s | 143 KB | yes | FIND MATCH attention pulse | FIND MATCH btn (#310) |
| league-logo-intro.webm | 64×54 | 2.9s | 23 KB | yes | navbar League logo reveal | `chrome/top-navbar` |
| league-logo-loop-active.webm | 64×54 | 2.4s | 11 KB | yes | navbar logo active loop | `chrome/top-navbar` |
| league-logo-loop-idle.webm | 64×54 | 4.8s | 18 KB | yes | navbar logo idle loop | `chrome/top-navbar` |
| league-logo-magic.webm | 64×54 | 1.2s | 13 KB | yes | navbar logo magic accent | `chrome/top-navbar` |
| lobby-button-hover-intro.webm | 146×58 | 1.1s | 16 KB | yes | lobby (secondary) button hover-in | `chrome/hextech-button` / lobby |
| lobby-button-hover-loop.webm | 146×58 | 2.4s | 79 KB | yes | lobby button hover loop | `chrome/hextech-button` / lobby |
| lobby-button-hover-outro.webm | 146×58 | 433ms | 5 KB | yes | lobby button hover-out | `chrome/hextech-button` / lobby |
| lobby-button-intro.webm | 146×58 | 1.6s | 74 KB | yes | lobby button reveal | `chrome/hextech-button` / lobby |
| lobby-button-magic-release.webm | 146×58 | 1.1s | 36 KB | yes | lobby button magic release | `chrome/hextech-button` / lobby |
| lobby-button-release.webm | 146×58 | 1.2s | 25 KB | yes | lobby button press release | `chrome/hextech-button` / lobby |
| lobby-button-to-play-button.webm | 146×58 | 1.6s | 73 KB | yes | lobby→PLAY morph transition | `chrome/play-button` (#309) |
| lobby-crystal-intro-player.webm | 1058×720 | 1.5s | 437 KB | yes | party-lobby crystal reveal (self) | `lobby/lobby-header` — no surface yet |
| lobby-crystal-intro-member.webm | 211×210 | 884ms | 206 KB | yes | party-lobby crystal reveal (member) | `lobby/lobby-header` / `lobby/lobby-player-card` — no surface yet |
| long-progress-bar-border-loop.webm | 776×66 | 2.4s | 239 KB | yes | wide progress-bar animated border | no surface yet (pass/reward track) |
| long-progress-bar-main-loop.webm | 752×36 | 2.4s | 221 KB | yes | wide progress-bar fill shimmer | no surface yet |
| long-progress-bar-tip-loop.webm | 272×120 | 2.4s | 47 KB | yes | wide progress-bar leading-edge tip | no surface yet |
| lootcrafting_upgradeabletile.webm | 75×75 | 4.0s | 235 KB | yes | loot "upgradeable" tile glow | `store/loot-tab` |
| lp_penalty_effect.webm | 195×195 | 2.0s | 288 KB | yes | LP-loss penalty effect | `collection/profile-ranked-screen` — no surface yet |
| lp_returned_effect.webm | 195×195 | 1.5s | 324 KB | yes | LP-returned (dodge protection) effect | `collection/profile-ranked-screen` — no surface yet |
| npe-ft-intro-video.webm | 1920×1080 | 33.7s | 4.2 MB | **no** | new-player first-time full-screen intro | no surface yet (onboarding) |
| patcher-component-outro.webm | 178×108 | 2.5s | 374 KB | yes | patcher panel outro (→ ready to play) | `chrome/launch-splash` |
| patcher-frame-intro.webm | 162×40 | 1.9s | 22 KB | yes | patcher progress-frame intro | `chrome/launch-splash` |
| patcher-to-play-button-enabled.webm | 178×108 | 2.5s | 374 KB | yes | patcher→PLAY-enabled transition | `chrome/play-button` (#309) |
| play-button-enabled-intro.webm | 146×58 | 1.6s | 75 KB | yes | PLAY button enabled reveal | `chrome/play-button` (#309) |
| play-button-hover-intro.webm | 146×58 | 1.1s | 16 KB | yes | PLAY hover-in | `chrome/play-button` (#309) |
| play-button-hover-loop.webm | 146×58 | 2.4s | 90 KB | yes | PLAY hover loop | `chrome/play-button` (#309) |
| play-button-hover-outro.webm | 146×58 | 433ms | 6 KB | yes | PLAY hover-out | `chrome/play-button` (#309) |
| play-button-magic-release.webm | 146×58 | 1.1s | 34 KB | yes | PLAY magic release (click) | `chrome/play-button` (#309) |
| play-button-release.webm | 146×58 | 1.2s | 27 KB | yes | PLAY press release | `chrome/play-button` (#309) |
| po-reveal-intro.webm | 400×500 | 2.3s | 614 KB | yes | tall Hextech reveal-card frame open (gold/teal) | no surface yet (loot/reveal card) |
| po-reveal-outro.webm | 400×500 | 1.3s | 378 KB | yes | reveal-card frame close | no surface yet |
| po-unrevealed-loop.webm | 300×400 | 8.0s | 704 KB | yes | unrevealed card blue-energy loop | no surface yet |
| progress-bar-border-loop.webm | 148×60 | 3.2s | 229 KB | yes | standard progress-bar border loop | no surface yet |
| progress-bar-main-loop.webm | 122×32 | 3.2s | 68 KB | yes | standard progress-bar fill shimmer | no surface yet |
| progress-bar-tip-intro.webm | 92×122 | 1.2s | 7 KB | yes | progress-bar leading tip intro | no surface yet |
| progress-bar-tip-loop.webm | 154×64 | 1.2s | 108 KB | yes | progress-bar leading tip loop | no surface yet |
| provisional-banner-loop.webm | 272×660 | 6.6s | 1.1 MB | yes | provisional-rank profile banner loop | `chrome/profile-banner` / `collection/profile-ranked-screen` |
| reward-item-checkmark-claimed.webm | 64×64 | 2.0s | 25 KB | yes | reward "claimed" checkmark pop | no surface yet (reward track) |
| reward-item-claimable-glow-hover.webm | 150×150 | 5.0s | 204 KB | yes | claimable reward hover glow | no surface yet |
| reward-item-claimable-glow-idle.webm | 150×150 | 5.0s | 192 KB | yes | claimable reward idle glow | no surface yet |
| reward-item-claimable-glow.webm | 300×200 | 2.0s | 139 KB | yes | claimable reward glow (single) | no surface yet |
| reward-track-progress-bar.webm | 200×70 | 4.0s | 148 KB | yes | reward-track progress segment | no surface yet |
| timer-accepted-idle.webm | 552×554 | 5.0s | 1.5 MB | yes | ready-check ACCEPTED ring idle | `lobby/match-found-modal` (#311) |
| timer-accepted-intro.webm | 552×554 | 1.5s | 566 KB | yes | ready-check ACCEPTED ring intro | `lobby/match-found-modal` (#311) |
| timer-countdown.webm | 552×554 | 10.7s | 2.6 MB | yes | ready-check countdown ring sweep | `lobby/match-found-modal` (#311) |
| timer-declined.webm | 552×554 | 1.1s | 352 KB | yes | ready-check DECLINED ring | `lobby/match-found-modal` (#311) |
| video-splash-ss19-c.webm | 1056×720 | 26.9s | 9.7 MB | **no** | Season-2019 client login splash (ambient) | `chrome/launch-splash` / login bg |
| yourshop-icon-call-to-action-intro.webm | 120×120 | 1.0s | 92 KB | yes | Your Shop navbar-icon CTA intro | `store/your-shop-screen` / `chrome/top-navbar` |
| yourshop-icon-call-to-action-loop.webm | 120×120 | 3.0s | 190 KB | yes | Your Shop CTA loop | `store/your-shop-screen` / `chrome/top-navbar` |
| yourshop-icon-click.webm | 120×120 | 600ms | 18 KB | yes | Your Shop icon click burst | `store/your-shop-screen` / `chrome/top-navbar` |

### buttons/ — generic magic-button particle layers

| file | dims | dur | size | alpha | what it shows | our surface |
|------|------|-----|------|-------|---------------|-------------|
| buttons/particles-default.webm | 150×80 | 5.0s | 95 KB | yes | magic-button idle particle field | `chrome/hextech-button`, `chrome/play-button` (#309) |
| buttons/particles-hover.webm | 150×80 | 5.0s | 119 KB | yes | magic-button hover particles | `chrome/hextech-button`, `chrome/play-button` (#309) |
| buttons/particles-pressed.webm | 150×80 | 366ms | 4 KB | yes | magic-button press particles | `chrome/hextech-button`, `chrome/play-button` (#309) |

### challenges/ — challenges hub, tooltips, customizer, postgame

| file | dims | dur | size | alpha | what it shows | our surface |
|------|------|-----|------|-------|---------------|-------------|
| challenges/challenge-card-new-indicator.webm | 300×350 | 2.0s | 315 KB | yes | "NEW" challenge-card indicator | `collection/challenges-screen` |
| challenges/challenge-card-new-indicator-legacy.webm | 300×350 | 2.0s | 317 KB | yes | legacy "NEW" indicator variant | `collection/challenges-screen` |
| challenges/challenges-tooltip-leaderboard-video-idle.webm | 300×96 | 4.6s | 524 KB | yes | leaderboard tooltip idle loop | `collection/challenges-screen` (tooltip) |
| challenges/challenges-tooltip-leaderboard-video-intro.webm | 300×96 | 2.8s | 175 KB | yes | leaderboard tooltip intro | `collection/challenges-screen` (tooltip) |
| challenges/identity-customizer-banner-intro.webm | 350×850 | 1.0s | 155 KB | yes | identity customizer banner intro | no surface yet (identity customizer) |
| challenges/lobby-banner-intro.webm | 350×850 | 1.0s | 158 KB | yes | challenges lobby banner intro | `lobby/lobby-header` — no banner surface yet |
| challenges/lobby-banner-v2-intro.webm | 350×850 | 1.0s | 122 KB | yes | challenges lobby banner v2 intro | no surface yet |
| challenges/lobby-banner-v2-waiting.webm | 320×760 | 3.0s | 75 KB | yes | lobby banner v2 waiting loop | no surface yet |
| challenges/lobby-banner-v2-waiting-outro.webm | 320×760 | 1.0s | 60 KB | yes | lobby banner v2 waiting outro | no surface yet |
| challenges/vgn_crs_flare.webm | 900×720 | 3.0s | 747 KB | yes | challenges crest flare/spark burst | `collection/challenges-screen` |
| challenges/crystal-levels/bronze.webm | 900×720 | 5.7s | 1.1 MB | yes | Bronze challenge-crystal celebration | `collection/challenges-screen` |
| challenges/crystal-levels/silver.webm | 900×720 | 5.7s | 1.2 MB | yes | Silver challenge-crystal celebration | `collection/challenges-screen` |
| challenges/crystal-levels/gold.webm | 900×720 | 5.7s | 1.4 MB | yes | Gold challenge-crystal celebration | `collection/challenges-screen` |
| challenges/crystal-levels/platinum.webm | 900×720 | 5.5s | 1.3 MB | yes | Platinum challenge-crystal celebration | `collection/challenges-screen` |
| challenges/crystal-levels/diamond.webm | 900×720 | 5.9s | 1.4 MB | yes | Diamond challenge-crystal celebration | `collection/challenges-screen` |
| challenges/crystal-levels/master.webm | 900×720 | 6.0s | 1.5 MB | yes | Master challenge-crystal celebration | `collection/challenges-screen` |
| challenges/crystal-levels/grandmaster.webm | 900×720 | 5.9s | 1.3 MB | yes | Grandmaster challenge-crystal celebration | `collection/challenges-screen` |
| challenges/crystal-levels/challenger.webm | 900×720 | 6.0s | 1.5 MB | yes | Challenger challenge-crystal celebration | `collection/challenges-screen` |
| challenges/customizer/preview-banner.webm | 350×850 | 1.0s | 155 KB | yes | customizer banner preview | no surface yet (identity customizer) |
| challenges/customizer/preview-border.webm | 500×500 | 1.8s | 193 KB | yes | customizer border preview | no surface yet |
| challenges/customizer/preview-border-ranked.webm | 500×500 | 1.8s | 204 KB | yes | customizer ranked-border preview | no surface yet |
| challenges/customizer/preview-icon.webm | 150×150 | 1.4s | 123 KB | yes | customizer icon preview | no surface yet |
| challenges/customizer/preview-title.webm | 250×200 | 1.8s | 199 KB | yes | customizer title preview | no surface yet |
| challenges/customizer/preview-token.webm | 100×100 | 1.1s | 64 KB | yes | customizer token preview | no surface yet |
| challenges/postgame/postgame-challenges-card-intro.webm | 300×350 | 1.3s | 263 KB | yes | postgame challenges card intro | no surface yet (end-of-game) |
| challenges/postgame/postgame-eternals-card-intro.webm | 300×350 | 1.5s | 170 KB | yes | postgame eternals card intro | `chrome/mastery-eternals-panel` — no EOG surface |
| challenges/postgame/postgame-spark-large.webm | 300×300 | 1.3s | 72 KB | yes | postgame spark (large) | no surface yet |
| challenges/postgame/postgame-spark-medium.webm | 300×300 | 1.0s | 50 KB | yes | postgame spark (medium) | no surface yet |
| challenges/postgame/postgame-spark-small.webm | 300×300 | 700ms | 34 KB | yes | postgame spark (small) | no surface yet |

### champion-mastery/ — mastery-level celebration overlays

| file | dims | dur | size | alpha | what it shows | our surface |
|------|------|-----|------|-------|---------------|-------------|
| champion-mastery/cm-celebration-background.webm | 1280×720 | 5.0s | 1.4 MB | **no** | mastery celebration backdrop (full-frame) | `collection/champion-detail` (mastery tab) — no celebration surface yet |
| champion-mastery/cm-celebration-level-1.webm | 1280×720 | 9.0s | 1.4 MB | yes | mastery level-1 celebration | `collection/champion-detail` — no surface yet |
| champion-mastery/cm-celebration-level-2.webm | 1280×720 | 9.0s | 1.7 MB | yes | mastery level-2 celebration | `collection/champion-detail` — no surface yet |
| champion-mastery/cm-celebration-level-3.webm | 1280×720 | 9.0s | 1.6 MB | yes | mastery level-3 celebration | `collection/champion-detail` — no surface yet |
| champion-mastery/cm-celebration-level-4.webm | 1280×720 | 9.0s | 4.1 MB | yes | mastery level-4 celebration | `collection/champion-detail` — no surface yet |
| champion-mastery/cm-celebration-level-5.webm | 1280×720 | 9.0s | 4.0 MB | yes | mastery level-5 celebration | `collection/champion-detail` — no surface yet |
| champion-mastery/cm-celebration-level-6.webm | 1280×720 | 9.0s | 4.1 MB | yes | mastery level-6 celebration | `collection/champion-detail` — no surface yet |
| champion-mastery/cm-celebration-level-7.webm | 1280×720 | 10.0s | 3.0 MB | yes | mastery level-7 celebration | `collection/champion-detail` — no surface yet |
| champion-mastery/cm-celebration-level-8.webm | 1280×720 | 10.0s | 3.9 MB | yes | mastery level-8 celebration | `collection/champion-detail` — no surface yet |
| champion-mastery/cm-celebration-level-9.webm | 1280×720 | 12.0s | 4.8 MB | yes | mastery level-9 celebration | `collection/champion-detail` — no surface yet |
| champion-mastery/cm-celebration-level-10.webm | 1280×720 | 9.0s | 3.2 MB | yes | mastery level-10 celebration | `collection/champion-detail` — no surface yet |
| champion-mastery/cm-crest-aurora.webm | 500×500 | 3.0s | 860 KB | yes | mastery crest aurora glow loop | `collection/champion-detail` / `chrome/mastery-eternals-panel` |

### exalted/ — Exalted (Mythic) store card frames

| file | dims | dur | size | alpha | what it shows | our surface |
|------|------|-----|------|-------|---------------|-------------|
| exalted/card-frame-tierone-top.webm | 400×512 | 2.4s | 429 KB | yes | tier-1 exalted card top border | `store/mythic-shop-panel` |
| exalted/card-frame-tierone-bot.webm | 400×512 | 1.5s | 374 KB | yes | tier-1 card bottom border | `store/mythic-shop-panel` |
| exalted/card-frame-tierone-hover.webm | 400×512 | 2.7s | 445 KB | yes | tier-1 card hover flourish | `store/mythic-shop-panel` |
| exalted/card-frame-tierone-loop.webm | 400×512 | 3.0s | 454 KB | yes | tier-1 card idle loop | `store/mythic-shop-panel` |
| exalted/card-frame-tiertwo-top.webm | 400×512 | 1.1s | 82 KB | yes | tier-2 card top border | `store/mythic-shop-panel` |
| exalted/card-frame-tiertwo-bot.webm | 400×512 | 1.0s | 135 KB | yes | tier-2 card bottom border | `store/mythic-shop-panel` |
| exalted/card-frame-tiertwo-hover.webm | 400×512 | 2.7s | 460 KB | yes | tier-2 card hover flourish | `store/mythic-shop-panel` |
| exalted/card-frame-tiertwo-loop.webm | 400×512 | 3.0s | 549 KB | yes | tier-2 card idle loop | `store/mythic-shop-panel` |
| exalted/card-frame-tierthree-top.webm | 400×512 | 1.0s | 21 KB | yes | tier-3 card top border | `store/mythic-shop-panel` |
| exalted/card-frame-tierthree-bot.webm | 400×512 | 1.0s | 118 KB | yes | tier-3 card bottom border | `store/mythic-shop-panel` |
| exalted/card-frame-tierthree-hover.webm | 400×512 | 2.7s | 281 KB | yes | tier-3 card hover flourish | `store/mythic-shop-panel` |

### honor/ — end-of-game honor voting + celebration

No honor / end-of-game screen exists in league-of-web yet; the whole family is
`no surface yet`. Grouped summaries (dims/dur/size ranges) rather than 52 rows:

| file group | count | dims | dur | size range | alpha | what it shows |
|------------|-------|------|-----|------------|-------|---------------|
| honor/eog_cool_{1-2,3,4} | 3 | 500×500 | 2–3s | 25–249 KB | yes | "Cool" honor category burst (stages) |
| honor/eog_heart_{1-2,3,4} | 3 | 500×500 | 2–3s | 23–250 KB | yes | "Heart" honor category burst |
| honor/eog_shotcaller_{1-2,3,4} | 3 | 500×500 | 2–3s | 24–247 KB | yes | "Shotcaller" honor category burst |
| honor/eog_scoreboard_honor.webm | 1 | 444×100 | 3.5s | 279 KB | yes | scoreboard honor row flourish |
| honor/eog_sidebar_beam.webm | 1 | 600×719 | 3.0s | 195 KB | yes | EOG sidebar light beam |
| honor/eog_teamchoice_intro.webm | 1 | 800×200 | 4.0s | 144 KB | yes | team-choice banner intro |
| honor/honor_selected_{2,3,4}_player.webm | 3 | 700×720 | 2–3s | 568–818 KB | yes | honor-cast confirmation (N players) |
| honor/voting_bg.webm | 1 | 1280×720 | 5.0s | 1.2 MB | **no** | honor-voting full-frame backdrop |
| honor/voting_votecast_celebration_v2.webm | 1 | 400×400 | 2.0s | 510 KB | yes | vote-cast celebration burst |
| honor/celebration/{0,1,2}_unlock.webm | 3 | 450×419 | 4.0s | 123–197 KB | yes | honor-level unlock intros |
| honor/celebration/{1..5}_levelup_intro.webm | 5 | 450×419 | 4–7s | 106 KB–2.0 MB | yes | honor level-up intros (per level) |
| honor/celebration/{1..5}_levelup_loop.webm | 5 | 450×419 | 14.5s | 132 KB–3.8 MB | yes | honor level-up idle loops |
| honor/celebration/{2,3,4}-{1,2,3}_checkpoint_intro.webm | 9 | 600×650 | 4.1s | 524–702 KB | yes | honor checkpoint intros |
| honor/celebration/{2,3,4}-{1,2,3}_checkpoint_loop.webm | 9 | 600×650 | 14.5s | 200–333 KB | yes | honor checkpoint loops |
| honor/celebration/{3,4,5}_checkpoint_outro.webm | 3 | 600×650 | 3.0s | 249–439 KB | yes | honor checkpoint outros |
| honor/celebration/transition_green.webm | 1 | 1280×720 | 3.0s | 798 KB | yes | honor green full-frame transition wipe |

(52 files total in `honor/` — all `MIRRORED (206)` under the base + relative path.)

### ranked/ — emblem wings + tier promotions

| file group | count | dims | dur | size range | alpha | what it shows | our surface |
|------------|-------|------|-----|------------|-------|---------------|-------------|
| ranked/emblem-wings-magic-{tier}.webm | 9 | 208×270 | 2.7–3.0s | 173–548 KB | yes | animated ranked-emblem wings per tier (bronze→challenger, incl. emerald) | `collection/profile-ranked-screen`, `lobby/player-banner` |
| ranked/tier-promotion-from-{tier}.webm | 10 | 1280×720 | 2.4s | 183–523 KB | yes | promotion "from old tier" full-frame (incl. unranked/iron) | `collection/profile-ranked-screen` — no promotion surface yet |
| ranked/tier-promotion-to-{tier}.webm | 10 | 1280×720 | 4.6–6.8s | 813 KB–2.0 MB | yes | promotion "to new tier" celebration full-frame | `collection/profile-ranked-screen` — no promotion surface yet |

Emblem-wing tiers present: bronze, silver, gold, platinum, emerald, diamond, master,
grandmaster, challenger (**note: this set includes emerald**, unlike the jsDelivr
emblem PNGs in `ICON-SOURCES.md` which 404 on emerald). `tier-promotion-to-` set adds
iron + challenger; `-from-` set adds iron + unranked.

### rewards/ — claimable reward particles

| file | dims | dur | size | alpha | what it shows | our surface |
|------|------|-----|------|-------|---------------|-------------|
| rewards/reward-claimable-particles-default.webm | 150×150 | 5.0s | 237 KB | yes | claimable-reward idle particles | no surface yet (reward track / event hub) |
| rewards/reward-claimable-particles-hover.webm | 150×150 | 5.0s | 233 KB | yes | claimable-reward hover particles | no surface yet |

---

## Follow-up filings

Implementation issues worth filing beyond the already-filed video issues (#309
PlayButton video, #310 FIND MATCH button video, #311 MATCH FOUND timer video). Each
lists the exact file set + target component. **The controller adjudicates which to
file — this is a ranked recommendation, not a filing.** Order is roughly by
surface-readiness × visual payoff.

1. **Ranked emblem wings → Profile Ranked tab.** Animate the tier crest on
   `collection/profile-ranked-screen` (and optionally `lobby/player-banner`) with
   `ranked/emblem-wings-magic-{tier}.webm` (9 files, 208×270, alpha). Surface already
   exists — this is the highest-readiness win. Emerald is available here (fills the
   `ICON-SOURCES.md` emerald gap).

2. **Ranked tier-promotion celebration → Profile Ranked.** `ranked/tier-promotion-to-{tier}`
   (10) + `ranked/tier-promotion-from-{tier}` (10) + `division_up.webm` +
   `lp_returned_effect` / `lp_penalty_effect`. Needs a new promotion/rank-change
   overlay surface layered over `collection/profile-ranked-screen` (none today).

3. **Champion-mastery celebrations → Champion Detail mastery tab.**
   `champion-mastery/cm-celebration-level-{1..10}.webm` + `cm-celebration-background.webm`
   + `cm-crest-aurora.webm` (12 files, mostly 1280×720, some >4 MB — stream from CDragon,
   never commit). Target `collection/champion-detail`; needs a mastery-level-up
   celebration surface (`chrome/mastery-eternals-panel` is the nearest existing panel).

4. **Challenges crystal-level celebrations → Challenges screen.**
   `challenges/crystal-levels/{bronze..challenger}.webm` (8, 900×720, ~1–1.5 MB) +
   `challenges/vgn_crs_flare.webm` + `challenges/challenge-card-new-indicator*.webm` +
   the two `challenges-tooltip-leaderboard-*` clips. Target `collection/challenges-screen`
   (exists) — crystal celebration + "NEW" indicator are drop-in.

5. **Exalted (Mythic) store card frames → Mythic shop.**
   `exalted/card-frame-tier{one,two,three}-{top,bot,hover,loop}.webm` (11, 400×512).
   Target `store/mythic-shop-panel` (exists) — animated card-frame borders per tier.

6. **Your Shop navbar icon animation.** `yourshop-icon-call-to-action-intro/loop.webm`
   + `yourshop-icon-click.webm` (3, 120×120, small). Target `store/your-shop-screen`
   and/or the navbar entry in `chrome/top-navbar` (both exist) — cheap, high polish.

7. **League-logo navbar magic.** `league-logo-intro/loop-idle/loop-active/magic.webm`
   (4, 64×54, tiny — all <25 KB). Target `chrome/top-navbar`. Smallest-footprint upgrade
   in the corpus; could even qualify for `apps/web/public/media/` local commit if a
   future need arises (still <500 KB and mirrored, so CDragon streaming is preferred).

8. **Lobby crystal intros → party lobby.** `lobby-crystal-intro-player.webm` (1058×720)
   + `lobby-crystal-intro-member.webm`. Target `lobby/lobby-header` /
   `lobby/lobby-player-card`; needs a crystal-reveal surface (none today).

9. **Progress-bar video layers → reward/pass tracks.** `progress-bar-*` (4) +
   `long-progress-bar-*` (3) + `reward-track-progress-bar.webm` +
   `reward-item-claimable-glow*` (3) + `reward-item-checkmark-claimed.webm` +
   `rewards/reward-claimable-particles-*` (2). No reward-track/battle-pass progress
   surface consumes video yet (`chrome/battle-pass-screen` exists but is static) —
   file once that surface is built.

10. **Honor / end-of-game set → (new EOG screen).** 52 `honor/**` files (voting,
    category bursts, level-up + checkpoint celebrations). No honor or end-of-game screen
    exists in league-of-web at all — this is a whole-screen build, lowest readiness.
    Defer until an EOG/honor screen is scoped.

11. **Patcher / launch-splash videos.** `patcher-frame-intro`, `patcher-component-outro`,
    `patcher-to-play-button-enabled`, `button-disabled-intro`, `video-splash-ss19-c`
    (9.7 MB opaque splash). Target `chrome/launch-splash` (exists) — patcher→PLAY
    transition polish; the splash is a login-background candidate.

Not recommended for filing: `po-*` reveal-card frames, `challenges/customizer/*` and
`identity-customizer-*`, `npe-ft-intro-video` — no matching surface is planned and no
issue would have a clear home yet.
