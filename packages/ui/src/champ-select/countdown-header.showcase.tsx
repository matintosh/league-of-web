import type { ShowcaseEntry } from "../showcase";
import { CountdownHeader } from "./countdown-header";
import { TickingCountdownDemo } from "./countdown-header.demo";

export const countdownHeaderShowcase: ShowcaseEntry = {
  slug: "countdown-header",
  name: "Countdown Header",
  area: "champ-select",
  description:
    "Centered phase header for champion select: display-font title with gold-4 flanking hairlines, a teal/blue-2 draining progress bar on a grey-3 track, and a large gold-1 seconds counter. Parent owns the interval.",
  variants: [
    {
      name: "Full — 62 of 90s",
      notes:
        "Bar at ~69% width, matching the reference screenshot (62s remaining of 90s total). Title uppercase via CSS transform.",
      render: () => (
        <div className="bg-hextech-black px-8 py-6 w-full max-w-lg">
          <CountdownHeader
            title="Choose Your Loadout!"
            secondsRemaining={62}
            totalSeconds={90}
          />
        </div>
      ),
    },
    {
      name: "Nearly empty — 5 of 90s",
      notes:
        "Bar at ~5.6% width, hugging the left. End-cap gold-4 tab visible near the left edge.",
      render: () => (
        <div className="bg-hextech-black px-8 py-6 w-full max-w-lg">
          <CountdownHeader
            title="Choose Your Loadout!"
            secondsRemaining={5}
            totalSeconds={90}
          />
        </div>
      ),
    },
    {
      name: "Zero — 0 of 90s",
      notes:
        "Bar fully drained (0% width). End-cap hidden. Fraction clamped to 0 — no negative rendering.",
      render: () => (
        <div className="bg-hextech-black px-8 py-6 w-full max-w-lg">
          <CountdownHeader
            title="Choose Your Loadout!"
            secondsRemaining={0}
            totalSeconds={90}
          />
        </div>
      ),
    },
    {
      name: "Ticking demo — live countdown",
      notes:
        "Live 30-second countdown managed by TickingCountdownDemo (client component). Bar drains in real time; resets to 30 when it hits 0.",
      render: () => <TickingCountdownDemo />,
    },
  ],
};
