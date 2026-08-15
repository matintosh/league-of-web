# Fidelity method (ALL surfaces: client · launcher · login · merch · universe)

Canonical process for every review / refine / fidelity agent and every build brief,
across ALL surfaces — not just universe. Two principles:

## 1. HYBRID — real computed styles + visual ref (never screenshot-only)

Screenshot-only matching makes you match your own guesses. It repeatedly marked
components "converged" that had wrong colours, wrong weights/sizes, wrong text
alignment, missing ornaments, missing hover behaviour, and even the wrong component
variant. Instead, for every component:

1. **Extract REAL values from the live site** (source of truth for styling):
   ```
   node scripts/extract_styles.mjs <live-url> --anchor "<unique text>" [--hover] [--selector ".cls"] [--no-accept]
   ```
   Prints the live element's exact computed styles (colours as rgb, border,
   radius, padding, gap, font-size/weight/letter-spacing/family, clip-path,
   filter), DOM structure, and hover deltas. Build to THESE values; map each
   colour → nearest `--color-*` token (add a token if none; hex only in
   packages/tokens/src/theme.css, synced across @theme / :root / index.ts).
2. **Confirm LAYOUT + VARIANT against the reference** screenshot + annotated crop
   (docs/reference/…). The live DOM class names reveal variants (e.g. a home card
   vs an index card are different components).
3. **Measure OUR** deployed `/showcase/<slug>` (or assembled page) and diff vs 1 & 2.

Real values win for styling; the ref wins for layout/variant. Diff **assembled
pages**, not just component showcases — wiring gaps (a built-but-unwired component)
are invisible to per-component diffs.

## 2. REAL ASSETS — use the real logos/icons/images, not hand-drawn SVGs

Prefer the real brand assets from the public CDN over approximated SVGs. Reference
them by URL via a fixtures helper (never re-host), under Riot's Fan Content Policy —
the same basis as `championSplashUrl` / `runeterraPinUrl` / `universeContentIcon` /
`riotFistLogoUrl` / `regionCrestUrl` already in `@low/fixtures`.

- Collect real asset URLs from the live site (network sweep or `--selector "img"`),
  **verify each returns 200**, then add a typed helper in `packages/fixtures/src/`.
- Applies to logos, crest/content-type icons, region crests, rank/emblem icons,
  splash/loading art, map pins, store product imagery, etc.
- If a hashed CDN URL 404s later (build rotation), re-collect and update the helper.

## Applying per surface

Each surface's fidelity loop should, per tick: pick a component → run the hybrid
extract against its real live source → build to real values + real assets → gate →
deploy → verify. Live sources: client/login/launcher = the real League client
(reference screenshots + any live web equivalents); merch = merch.riotgames.com;
universe = universe.leagueoflegends.com. Where no live web source exists (native
client screens), the reference screenshots remain the source of truth, but still
prefer real CDN assets (Data Dragon, CommunityDragon) over hand-drawn icons.
