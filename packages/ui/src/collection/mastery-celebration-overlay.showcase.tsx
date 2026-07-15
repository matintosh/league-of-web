import type { ShowcaseEntry } from "../showcase";
import {
  MasteryCelebrationOverlayReplayDemo,
  MasteryCelebrationOverlayStaticPreview,
} from "./mastery-celebration-overlay.demo";

export const masteryCelebrationOverlayShowcase: ShowcaseEntry = {
  slug: "mastery-celebration-overlay",
  name: "Mastery Celebration Overlay",
  area: "collection",
  description:
    "The champion-mastery level-up celebration full-screen overlay — 'MASTERY LEVEL N', an optional champion subtitle, a deep-blue Hextech starfield backdrop, top/bottom gold hairline rules, and a centered animated mastery crest. The crest is a single opaque one-shot (probe-informed): the level clip reveals the crest, flares an aurora, then end-holds on its resting pose (no loop, no outro) — composited mix-blend-mode:screen over the starfield so the clip's black field drops out. When no crest video is supplied (or under reduced motion) a static SVG mastery crest glyph swaps in over the backdrop — they are not stacked (the opaque screen-blended clip and a differently-posed glyph would double the crest). Dismiss (OK, backdrop click, or Escape) starts the fade IMMEDIATELY — it never waits for the crest clip — then fires onFinished once on a single idempotent path. Under prefers-reduced-motion it still renders in full (static crest + gradient, no crest video) and waits for an explicit dismiss; it never auto-closes. Presentational: page/demo supplies crest/backdrop URLs from @low/fixtures (masteryCelebrationVideoUrl / masteryCelebrationBackgroundUrl). Not wired into a live flow — no mastery trigger exists yet; showcase-driven today. NO CHROME REFERENCE: no public screenshot of the real overlay chrome exists — the layout is convention-based (follows honor-checkpoint-overlay #365), not a measured reference. The videos are the real client's; only the surrounding frame is best-effort.",
  referenceNote:
    "NO chrome reference (four dry hunts, issue #370) — layout follows honor-checkpoint-overlay (#365) conventions, refine when a reference lands. Videos: docs/reference/VIDEO-ASSETS.md — champion-mastery/cm-celebration-level-{1..10}.webm (1280×720 opaque, 9–12s one-shot, distinct crest per level), champion-mastery/cm-celebration-background.webm (1280×720 opaque starfield loop, 5.0s), champion-mastery/cm-crest-aurora.webm (500×500, reusable glow for champion-detail — not used by this overlay; the level clips bake in their own aurora).",
  variants: [
    {
      name: "Replay demo (levels 1 / 5 / 10)",
      notes:
        "Pick a mastery level to play its overlay in a framed stage. Each play key-remounts the overlay so the crest clip restarts from frame 0; a counter shows onFinished firing once per run (OK / backdrop click / Escape). Dismiss starts the fade immediately — it never waits for the clip. Honors prefers-reduced-motion (renders in full with a static crest + gradient, no crest video, and waits for an explicit dismiss).",
      render: () => <MasteryCelebrationOverlayReplayDemo />,
    },
    {
      name: "Mastery level 5 — crest video",
      notes:
        "Persistent static preview of the celebration surface (level-5 crest clip over the starfield backdrop). The crest reveals, flares its aurora, and holds on the resting pose. mix-blend-mode:screen composites the clip over the starfield.",
      render: () => (
        <MasteryCelebrationOverlayStaticPreview level={5} subtitle="You've mastered Ahri" />
      ),
    },
    {
      name: "Mastery level 10 — crest video",
      notes:
        "The pinnacle crest (ornate gold, iridescent hex gem), showing a distinct per-level clip vs level 5. Same layout, different crest and title.",
      render: () => (
        <MasteryCelebrationOverlayStaticPreview level={10} subtitle="You've mastered Ahri" />
      ),
    },
    {
      name: "Reduced motion / videos absent (static crest)",
      notes:
        "Exactly what renders under prefers-reduced-motion or when every crest/backdrop URL is omitted: the static SVG mastery crest glyph (bronze-gold winged shield + gem) over the deep-blue gradient, hairline rules, title, and OK button — the full surface, no video, no auto-dismiss.",
      render: () => <MasteryCelebrationOverlayStaticPreview level={5} withVideo={false} />,
    },
  ],
};
