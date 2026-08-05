# Launcher Fidelity Scorecard — the 1:1 ratchet

North star: **/launcher is a 1:1 clone of the Riot/League desktop launcher** at 1280×720 (bounded fixed window).
This scorecard is the worklist for the **launcher-fidelity** meta-loop: each idle tick it picks the next surface (⬜ never-diffed first, then oldest-audited), runs a holistic side-by-side visual diff vs the reference screenshots in `/Users/matintosh/Documents/lol-launcher-ref/`, files measured `launcher,status:ready` delta issues, and updates the row. The build-loop then builds them.

**Reference images:** `lol-launcher-ref/image.png` (Overview), `image-1.png` (Overview hover/dropdown), `image-2.png` (Patch Notes), `image-3.png` (Esports), `image-4.png` (Merch tab), `image-5.png` (Riot Home), `image-7.png` (Games library).

**Verdict:** ✅ pixel-match · ⚠️ deltas open (issue#s) · ⬜ never diffed

**Convergence:** when ALL rows ✅ and two full rotations file zero issues → CONVERGED.

---

## PAGES / SURFACES

| Surface | Ref image | Our route / component | Verdict | Last diff | Notes |
|---|---|---|---|---|---|
| LoL Overview tab | `image.png`, `image-1.png` | `/showcase/launcher-overview-page` (no direct route) | ⚠️ | 2026-08-05 (seed) | Hero fills content area ✓; wordmark typography/placement ⚠️; **Play button missing from hero overlay** ⬜ (ref has gold pill overlaid bottom-left of hero, we have no play button on this surface); carousel strip present but proportions off ⚠️; tab bar has no window-bar integration in showcase context |
| Patch Notes tab | `image-2.png` | `/showcase/launcher-patch-notes-page` (no direct route) | ⚠️ | 2026-08-05 (seed) | Full-bleed hero correct concept ✓; text block centered ✓; ref shows **NO** tab bar (patch notes fills under the tab bar without a visible bar — text just floats); our text block position and sizing approximately correct ⚠️ |
| Esports tab | `image-3.png` | `/showcase/launcher-esports-page` (no direct route) | ⚠️ | 2026-08-05 (seed) | Magazine grid present ✓; heading style matches ✓; **ref featured card is landscape/tall aspect with dominant color overlay text** — our card uses full-bleed champion splash which looks similar; secondary cards layout matches; no route integration |
| Merch tab | `image-4.png` | `/showcase/launcher-merch-page` (no direct route) | ⚠️ | 2026-08-05 (seed) | "Merch" heading ✓; featured banner present ✓; product card row present ✓; **product cards are visually too wide in showcase** (width constraint issue in showcase vs real 1:1 context); no route integration |
| Riot Home | `image-5.png` | `/launcher/home` | ⚠️ | 2026-08-05 (seed) | **BIGGEST GAP**: ref Home has NO right social panel — just rail + wide content; ours also has no panel ✓. Hero promo fills most of viewport ✓. BUT: **ref content area is LIGHT (#f5f5f5 / near-white) not dark** — our build is dark launcher bg throughout (structural color inversion). Ref "Home" heading is black on light bg. Promo hero is full-width within the light content area. "Latest Patch Notes" section at bottom is correct concept ✓. Rail looks correct ✓. |
| Games library | `image-7.png` | `/launcher/games` | ⚠️ | 2026-08-05 (seed) | Layout structure matches (My Games row + All Games grid) ✓; game tiles present ✓; game logos overlaid ✓; **ref shows NO right social panel** — our build also has none ✓; **ref content area background is LIGHT** (same as Home) — ours is dark throughout ⚠️; section heading font size/weight lighter in ref ⚠️ |
| LoL Launcher Shell (assembled) | `image.png` | no single direct route (components only) | ⬜ | — | The full 3-col shell (rail + tab content + social panel) is never assembled into a routed page for the LoL tabs (Overview/Patch Notes/Esports/Merch). Only the showcase entries exist. A `/launcher/lol` (or equivalent) route is missing. |
| Rail | `image.png` (left column) | `/showcase/launcher-rail` | ⚠️ | 2026-08-05 (seed) | Rail slot size ✓; active accent bar ✓; **ref rail shows larger, clearly-branded game icons with visible game wordmarks/emblems** — our icons at 36px are small and text-free SVGs that read as abstract shapes; ref has ~7 icons in ref image (home + 5–6 games), our showcase has 3; icon clarity is the dominant delta |
| Social panel | `image.png` (right column) | `/showcase/launcher-social-panel` | ⚠️ | 2026-08-05 (seed) | Friend list, avatar rings, groups, search all present ✓; **ref panel header shows username + tagline + 3 icon buttons in a clearly differentiated header row** — our panel header matches this ✓; **ref panel shows a distinct vertical separator line** at left edge — our has border-left ✓; overall panel fidelity is the best-matched component in the launcher |
| Window bar | all images | `/showcase/launcher-window-bar` | ⚠️ | 2026-08-05 (seed) | 28px bar with min/max/close ✓; **ref shows Riot logo + account chip on the LEFT** of the window bar — our `leftContent` slot is wired but the `/launcher/home` page passes no left content (just `<LauncherWindowBar />` with nothing in the left slot) ⚠️ |
| Tab bar | `image.png` | `/showcase/launcher-tab-bar` | ⚠️ | 2026-08-05 (seed) | 4 tabs (Overview/Patch Notes/Esports/Merch) ✓; gold active underline ✓; **ref tab bar sits INSIDE the content area with the Play button to the LEFT of the tabs** — our tab bar has no play button integration; overall tab bar dimensions and typography approximately match |

---

## STRUCTURAL GAPS (ranked by impact)

1. **No routed LoL launcher surface** — The Overview/Patch Notes/Esports/Merch tabs have no assembled route under `/launcher`. Every LoL launcher screen exists only as a showcase snippet. The shell is never assembled into a live page for the LoL game context. This is why the launcher "reads as not 1:1" — the actual user-facing route `/launcher` redirects and there is no `/launcher/lol` (or equivalent) assembled page with the full shell (rail + tab bar + social panel + content).
2. **Riot Home / Games content area should be LIGHT not dark** — `image-5.png` (Home) and `image-7.png` (Games) both show a clearly light-coloured content area (#f0f0f2 or similar near-white), not the dark launcher bg. Our Home and Games pages use `--color-launcher-content-bg` (#11131a) for the main content area, producing a fully-dark experience that is visually inverted vs the reference.
3. **Play button absent from LoL Overview hero** — `image.png` and `image-1.png` both show the gold "▶ Play" split button overlaid in the lower-left of the hero (below the LoL wordmark, above/beside the featured card). `LauncherPlayButton` exists as a component but is never composed into `LauncherOverviewHero` or `LauncherOverviewPage`. The play button is arguably the most iconic element of the LoL launcher UI and its absence is immediately obvious.

---

## ROTATION LOG (append one line per loop tick)

- 2026-08-05 — scorecard seeded from holistic visual audit (7 ref images × all components + 2 live routes). 3 top-priority structural issues filed (#TBD). All rows ⚠️ or ⬜ — no ✅ yet. Next up: ⬜ assembled LoL shell route (highest impact).
