import type { ShowcaseEntry } from "../showcase";
import { CountdownHeader } from "./countdown-header";
import { TickingCountdownDemo } from "./countdown-header.demo";

export const countdownHeaderShowcase: ShowcaseEntry = {
  slug: "countdown-header",
  name: "Countdown Header",
  area: "champ-select",
  description:
    "Centered phase header for champion select: display-font title flanked by filigree scroll brackets (gold-4/gold-5, traced from the reference ornament), and a large gold-1 seconds counter centered between two symmetric teal progress bars that drain OUTWARD from the number. Parent owns the interval.",
  variants: [
    {
      name: "Full — 90 of 90s",
      notes:
        "Both bars full; the bright teal cap rides each outer leading edge. Filigree brackets flank the title, curling toward center.",
      render: () => (
        <div className="bg-hextech-black px-8 py-6 w-full max-w-lg">
          <CountdownHeader
            title="Choose Your Loadout!"
            secondsRemaining={90}
            totalSeconds={90}
          />
        </div>
      ),
    },
    {
      name: "Mid — 62 of 90s",
      notes:
        "Bars at ~69%; the fill has receded outward, leaving empty track at the outer ends and teal still hugging the number.",
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
      name: "Low — 5 of 90s",
      notes:
        "Bars at ~5.6%; only a sliver of teal remains hugging the number on each side.",
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
        "Both bars fully drained (0% width) — bare dark tracks with the gold baseline. Fraction clamped to 0; no negative rendering.",
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
        "Live 30-second countdown managed by TickingCountdownDemo (client component). Both bars drain in real time; resets to 30 when it hits 0.",
      render: () => <TickingCountdownDemo />,
    },
  ],
};
