# Universe fidelity scorecard

1:1 clone of **universe.leagueoflegends.com/en_us** — the League Universe lore hub.
Editorial dark/gold site: champion bios, regions, stories, comics. New surface added
2026-08-12. Route: `/universe`. Components: `packages/ui/src/universe/`. Real assets via
Data Dragon splash helpers (`championSplashUrl`) + CDN story art.

## Method

Same loop as launcher/login/client: **discover** visual deltas vs the `docs/reference/universe-*.png`
references, **build-loop (:11)** builds from `universe,status:ready` issues. Lightweight
source-aware production diff (Read component source for real selectors → measure
`/showcase/<slug>` on prod → compare to ref → file measured deltas or DRY). Tokens-only.

## Palette / tokens

Reuse Hextech gold tokens (`gold-1..5`, `text-gold-1`, `font-display`). Add `--color-universe-*`
in `packages/tokens/src/theme.css` as sampled (bg near-black ~#0a0a0e, card surface ~#111015,
hairline gold). NO raw hex outside tokens.

## References (docs/reference/)

- `universe-landing.png` — HOME: top nav, hero carousel (splash + crest + title + arrows), LATEST grid, FEATURED
- `universe-explore.png` — EXPLORE: header, filter tabs, sort, 4-col story-card grid
- `universe-filter-tabs.png` — detail crop: FILTER BY row (Everything active white + gold underline; others gold; SORT BY Newest + arrows)
- `universe-crest-divider.png` — detail crop: gold crest ornament section divider
- `universe-live-champions.png` — CHAMPIONS: title crest, sort row, tall champion-card grid (splash + name + region)
- `universe-live-champion-bio.png` — CHAMPION BIO: full-bleed splash hero + huge name + subtitle + breadcrumb
- `universe-live-regions.png` — REGIONS index

## Component inventory (legend: ⬜ not built · 🔨 building · ◐ partial · ✅ verified-match)

| Component | Ref(s) | Status | Date | Notes |
|---|---|---|---|---|
| universe-top-nav | landing, all | ◐ | built #966 | Riot-logo + "Universe" wordmark + CHAMPIONS/REGIONS/COMICS/ALT UNIVERSE/MAP▾/EXPLORE/SEARCH + SIGN IN + PLAY NOW (blue pill). ~48px tall, near-black bg, gold-on-hover links, caps, letter-spaced. |
| universe-hero-carousel | landing | 🔨 | #971 | Full-width champion splash slide + left/right circular gold arrows + centered crest-divider with "THE ASHEN EXORCIST / LOCKE" title; faded prev/next titles either side. |
| universe-crest-divider | crest-divider, landing | ◐ | built #967 | Gold hextech crest ornament centered over a label ("LATEST"/"FEATURED"/"CHAMPIONS"), thin gold underline. Section header. |
| universe-story-card | explore, landing LATEST | ◐ | built #968 | Art thumbnail (16:9-ish), region/champion overline (gold caps), TITLE (serif caps), badge (Read Story / comic-page count). Hover lift. |
| universe-champion-card | live-champions | 🔨 | #969 | Tall champion splash portrait card, name (serif caps) + region overline at bottom, dark gradient. Grid item. |
| universe-filter-tabs | filter-tabs, explore | 🔨 | #970 | FILTER BY + Everything/Short Stories/Comics/Videos/Music (active=white+gold underline, rest gold) + right SORT BY Newest + up/down arrows. |
| universe-champion-bio-hero | live-champion-bio | ⬜ | — | Full-bleed splash, huge serif champion name, gold subtitle title, top breadcrumb (CHAMPIONS / LUX). |
| universe-breadcrumb | live-champion-bio | ⬜ | — | Gold crest + caps trail (CHAMPIONS › LUX). |
| universe-cookie-banner | landing (bottom) | ⬜ | — | Bottom full-width dark bar: cookie text + Privacy Notice link + Manage Preferences button. |
| universe-footer | (scroll) | ⬜ | — | Riot footer (logo, links, legal). Capture on scroll. |

## Pages (assembled routes)

| Page | Route | Ref | Status |
|---|---|---|---|
| Home / Landing | `/universe` | universe-landing.png | ⬜ 🔨 (scaffold merged, PR#972) |
| Explore | `/universe/explore` | universe-explore.png | ⬜ |
| Champions index | `/universe/champions` | universe-live-champions.png | ⬜ |
| Champion bio | `/universe/champion/[slug]` | universe-live-champion-bio.png | ⬜ |
| Regions | `/universe/region` | universe-live-regions.png | ⬜ |

## Rotation log

- 2026-08-12 — Surface CREATED. Captured 3 live refs (champions, champion-bio, regions) + had 4 pre-existing (landing, explore, filter-tabs, crest-divider). Scorecard seeded: 10 components, 5 pages. Home/landing = first milestone (highest component density). Filing scaffolding issues for foundational components (top-nav, crest-divider/section-header, story-card) → build-loop builds. Universe-fidelity loop to be armed.
- 2026-08-12 (loop t1) — Still scaffolding (0 built). Queued 3 more build issues: #969 champion-card, #970 filter-tabs, #971 hero-carousel. 6 universe issues now status:ready (966-971) for build-loop :11. Remaining unqueued: champion-bio-hero, breadcrumb, cookie-banner, footer (next batch). No diffs yet — nothing built.
- 2026-08-12 (build) — PR #972 MERGED (reviewed: raw rgba()→color-mix fix wave, both gates re-verified green). 3 foundational components live: universe-top-nav, universe-crest-divider, universe-story-card + /universe route/layout/landing scaffold + 6 --color-universe-* tokens. Deployed prod. Next: universe-loop :14 diffs the 3 built components vs refs; build-loop continues #969/#970/#971 (champion-card, filter-tabs, hero-carousel).
