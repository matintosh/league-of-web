import { partiesBgLoopUrl, summonerObjectMagicUrl } from "@low/fixtures";
import type { ShowcaseEntry } from "../showcase";
import { AmbientVideoLayer } from "./ambient-video-layer";

// Ambient "magic" loop URLs from @low/fixtures (values supplied by showcase,
// never built inside the component).
const PARTY_LOOP = partiesBgLoopUrl("party-status");
const QUEUE_LOOP = partiesBgLoopUrl("queue-delay");
const SOCIAL_LOOP = partiesBgLoopUrl("social-panel");
const SELF_MAGIC = summonerObjectMagicUrl("gold", "idle");

export const ambientVideoLayerShowcase: ShowcaseEntry = {
  slug: "ambient-video-layer",
  name: "Ambient Video Layer",
  area: "chrome",
  description:
    "The client's 'magic' backdrop layer — an absolutely-positioned, pointer-events-none <video> ambient loop that sits behind content. Presentational: takes a webm URL (from @low/fixtures), never fetches. Additive: renders nothing when src is absent, so the static background shows through unchanged. Hidden entirely under prefers-reduced-motion. Used by FindingMatchPanel, TeamPlayerRow, and the party-lobby shell.",
  variants: [
    {
      name: "Without src — renders nothing (static bg preserved)",
      notes:
        "src omitted: the component returns null and the underlying static background is untouched — this is the fallback / no-video baseline.",
      render: () => (
        <div className="relative h-40 w-72 overflow-hidden rounded-sm bg-blue-7">
          <AmbientVideoLayer />
          <div className="relative z-10 flex h-full items-center justify-center">
            <span className="font-body text-xs text-grey-1">
              Static bg only (no ambient video)
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "Party-status loop over dark panel",
      notes:
        "src = partiesBgLoopUrl('party-status'), default opacity 0.5 + screen blend: the party-lobby ambient backdrop composited over bg-hextech-black.",
      render: () => (
        <div className="relative h-40 w-72 overflow-hidden rounded-sm bg-hextech-black">
          <AmbientVideoLayer src={PARTY_LOOP} />
          <div className="relative z-10 flex h-full items-center justify-center">
            <span className="font-display text-sm uppercase tracking-widest text-gold-1">
              Party
            </span>
          </div>
        </div>
      ),
    },
    {
      name: "Queue-delay loop (FindingMatchPanel backdrop)",
      notes:
        "src = partiesBgLoopUrl('queue-delay') at opacity 0.4 over bg-blue-7 — the same loop wired behind FindingMatchPanel.",
      render: () => (
        <div className="relative h-40 w-72 overflow-hidden rounded-sm bg-blue-7">
          <AmbientVideoLayer src={QUEUE_LOOP} opacity={0.4} />
          <div className="relative z-10 flex h-full items-center justify-center">
            <span className="font-display text-2xl text-gold-cream">20:03</span>
          </div>
        </div>
      ),
    },
    {
      name: "Summoner-object magic (champ-select self slot)",
      notes:
        "src = summonerObjectMagicUrl('gold','idle') at opacity 0.45 — the gem/rune flourish behind the local player's active summoner slot.",
      render: () => (
        <div className="relative h-40 w-72 overflow-hidden rounded-sm bg-hextech-black">
          <AmbientVideoLayer src={SELF_MAGIC} opacity={0.45} />
          <div className="relative z-10 flex h-full items-center justify-center">
            <span className="font-body text-sm text-gold-cream">cherwood</span>
          </div>
        </div>
      ),
    },
    {
      name: "Reduced opacity — social-panel loop (0.2)",
      notes:
        "Lower opacity reads as barely-there ambience; the layer is a decoration, not a focal element. src = partiesBgLoopUrl('social-panel').",
      render: () => (
        <div className="relative h-40 w-72 overflow-hidden rounded-sm bg-hextech-black">
          <AmbientVideoLayer src={SOCIAL_LOOP} opacity={0.2} />
          <div className="relative z-10 flex h-full items-center justify-center">
            <span className="font-body text-xs text-grey-1">Social rail</span>
          </div>
        </div>
      ),
    },
  ],
};
