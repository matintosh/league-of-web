import type { ShowcaseEntry } from "../showcase";
import { RiotGamesWordmark } from "./riot-games-wordmark";

/**
 * Showcase for RiotGamesWordmark — colosseum icon + stacked text lockup.
 * Server-safe: no 'use client'.
 *
 * issue #964
 */
export const riotGamesWordmarkShowcase: ShowcaseEntry = {
  slug: "riot-games-wordmark",
  name: "RiotGamesWordmark",
  area: "login",
  description:
    "Full Riot Games brand lockup: colosseum/crest icon on the left (~29px) " +
    "followed by stacked 'RIOT' / 'GAMES' text on the right (~63px). " +
    "Total width ≈98px, height ≈26px (pixel-measured from riot-login-page.png). " +
    "Uses currentColor — set fill via text-* class (e.g. text-riot-red). " +
    "Used in the login panel header.",
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
