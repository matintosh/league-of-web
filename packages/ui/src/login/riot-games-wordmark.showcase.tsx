import type { ShowcaseEntry } from "../showcase";
import { RiotGamesWordmark } from "./riot-games-wordmark";

/**
 * Showcase for RiotGamesWordmark — stacked two-line Riot Games lockup.
 * Server-safe: no 'use client'.
 *
 * issue #960
 */
export const riotGamesWordmarkShowcase: ShowcaseEntry = {
  slug: "riot-games-wordmark",
  name: "RiotGamesWordmark",
  area: "login",
  description:
    "Stacked two-line Riot Games brand lockup: 'RIOT' on line 1, 'GAMES' on line 2. " +
    "Uses currentColor — set fill via text-* class. Default width=98px, height=26px " +
    "(pixel-measured from riot-login-page.png). Used in the current login panel header.",
  variants: [
    {
      name: "Riot red on white (login panel context)",
      backgrounds: ["light"],
      render: () => (
        <div className="flex items-center justify-center rounded bg-login-bg p-6">
          <RiotGamesWordmark width={98} className="text-riot-red" />
        </div>
      ),
    },
    {
      name: "Default size (98px)",
      backgrounds: ["light"],
      render: () => (
        <div className="flex items-center justify-center p-4">
          <RiotGamesWordmark className="text-riot-red" />
        </div>
      ),
    },
    {
      name: "Large (160px)",
      backgrounds: ["light"],
      render: () => (
        <div className="flex items-center justify-center p-4">
          <RiotGamesWordmark width={160} className="text-riot-red" />
        </div>
      ),
    },
    {
      name: "On dark background",
      backgrounds: ["dark"],
      render: () => (
        <div className="flex items-center justify-center p-6">
          <RiotGamesWordmark width={98} className="text-riot-red" />
        </div>
      ),
    },
    {
      name: "White fill (dark context)",
      backgrounds: ["dark"],
      render: () => (
        <div className="flex items-center justify-center bg-hextech-black p-6">
          <RiotGamesWordmark width={98} className="text-white" />
        </div>
      ),
    },
  ],
};
