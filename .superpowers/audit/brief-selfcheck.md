# Auditor brief — SELFCHECK (reference-free defect sweep)

## Why this modality exists

The PLAY-button double-logo bug (#423) sat on prod in plain sight while all
three auditors idled "material-gated": screens/details/discovery all compare
OUR render against REFERENCE captures, so with no new references they had no
fuel. But #423 needed no reference at all — two overlapping L logos and a
1.5px off-ring medallion are visible from our own render alone. Selfcheck
audits the build against ITSELF: internal consistency, geometry, and layer
sanity. Its fuel is every deployed screen and showcase entry, so it is
NEVER material-gated and always eligible for LIGHT cycles.

## What to hunt (defect classes, in priority order)

1. **Doubled art / swap-not-stack violations.** Any place a video layer
   carries complete art (logo, medallion, banner, ring) AND a static
   img/svg of the same art stays visible beneath it. DOM probe: inside one
   visual box, >1 visible element (opacity>0, not display:none) whose
   content depicts the same glyph — e.g. `<img>` + `<video>` both painting
   an L. The WAD videos that are ADDITIVE accents (glows, particles,
   sweeps) are fine to stack; videos that contain the full art REPLACE the
   static layer. When unsure, screenshot with the video hidden vs shown —
   if the composition shows the same shape twice, it's a defect.
2. **Concentric misalignment.** Rings, medallions, sockets, radial motifs:
   the centers of concentric layers must coincide. Measure from hi-DPI
   (deviceScaleFactor 3-4) crops: locate each ring's bounding box by color
   family (gold: R>120 ∧ R−B>50; teal/cyan: B>120 ∧ B−R>40), diff the
   centers. Δ>1px CSS = finding; report measured centers.
3. **Layer-stack sanity.** Both-visible crossfade pairs (two `<video>`s at
   opacity 1 in one slot), z-order bleed (overlay art escaping its clip),
   stray seams at container edges, art clipped by an overflow box.
4. **Duplicate asset renders.** Same asset URL painted twice in one
   component's box (querySelectorAll by src, group by nearest positioned
   ancestor).
5. **Scale artifacts.** Art rendered >1.5× its native size (video
   videoWidth/Height vs getBoundingClientRect), blurry upscales.
6. **Containment / band-seating.** Decorative art (avatar frames, medallions,
   badges) that OVERFLOWS its intended container and spills into a
   neighboring region — measure the art's getBoundingClientRect vs its host
   band/box: art bottom > band bottom or art top < band top = spill. AND
   slot mis-seating: within a fixed-height band (the top-nav h-22, a lobby
   header, a footer), each slot's content should be vertically centered
   unless the design says otherwise — measure content-center-y vs
   band-center-y; a slot dropped to the top/bottom edge (Δ>8px from band
   center) while its siblings are centered is a finding. This is what let
   #527 through: a bottom-aligned profile slot + an 85px frame spilled 24px
   below the nav band. When a band contains an oversized decorative element,
   always check both its containment (no spill) and its slot alignment
   (centered vs siblings).

## Method (binding)

- Audit the PRODUCTION build of origin/main: fresh worktree or main tree,
  `pnpm build` + `pnpm --filter web exec next start -p 3900` (kill by port
  after). NEVER audit the dev server.
- Playwright from the repo's node_modules; viewport 1280×720; dsf 3.
- **Park the pointer** at (50,400) before any idle capture — hover states
  contaminate idle sampling (documented false-FAIL, convergence loop).
- Dismiss the launch splash (click body, wait for fade) before captures.
- Sweep BOTH the client routes ('/', champ select flow, store, collection,
  login) AND `/showcase` entries — showcase isolates components the shell
  hides behind interaction.
- For every video-bearing component, capture idle AND hover AND (where
  reachable) press states; the state machines differ per state.
- Findings must be MEASURED (centers, deltas, both-visible element lists),
  not impressions. Screenshot evidence per finding, saved to scratchpad,
  key crops attached to the issue.
- File max 2-3 issues per cycle, most-visible first, standard dispatch-brief
  format, label `status:ready`. Small/cosmetic clusters may share one issue.
- Log the cycle in audit-ledger.md (zones swept, probes run, findings,
  dry/not), push the ledger commit (verify SHA on origin/main).

## Standing rules inherited

- Verify against origin/main before filing (someone may have fixed it).
- dry×2 → LIGHT cycles (rotate zones, lighter probes), never full stop.
- Reference-era questions are out of scope here — selfcheck never claims
  "the client does X"; it only claims "our render is internally broken."
  If a finding needs a reference to adjudicate, hand it to details/screens
  instead of filing.
