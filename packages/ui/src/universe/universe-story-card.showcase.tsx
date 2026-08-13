import type { ShowcaseEntry } from "../showcase";
import { UniverseStoryCard } from "./universe-story-card";
import { championSplashUrl } from "@low/fixtures";

export const universeStoryCardShowcase: ShowcaseEntry = {
  slug: "universe-story-card",
  name: "Universe Story Card",
  area: "universe",
  description:
    "Story/article card from the Universe Explore grid — art thumbnail on top, dark body panel below with overline (gold-2, caps), Beaufort title, and a bottom row: badge pill (left) + optional date (right).",
  referenceImage: "universe-explore.png",
  referenceNote: "docs/reference/universe-explore.png — 4-col Explore grid",
  variants: [
    {
      name: "Story card — default",
      notes: "kind=\"story\" — green Short Story pill badge with art on top, body below. Art via championSplashUrl.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-64"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseStoryCard
            art={championSplashUrl("Lux")}
            overline="Demacia"
            title="EVERYWHERE, AND EVERYONE"
            kind="story"
            date="Mar 5, 2025"
          />
        </div>
      ),
    },
    {
      name: "Comic card",
      notes: "kind=\"comic\" — blue page-count chip badge with book icon.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-64"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseStoryCard
            art={championSplashUrl("Jinx")}
            overline="Zaun"
            title="PAINTINGS FRAMED IN HALF-LIGHT"
            kind="comic"
            badgeText="6 Pages"
          />
        </div>
      ),
    },
    {
      name: "Video card",
      notes: "kind=\"video\" — Watch pill with play icon.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-64"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseStoryCard
            art={championSplashUrl("Yasuo")}
            overline="Ionia"
            title="THE WILL OF THE BLADE"
            kind="video"
          />
        </div>
      ),
    },
    {
      name: "Music card",
      notes: "kind=\"music\" — Listen pill with music note icon.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-64"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseStoryCard
            art={championSplashUrl("Sona")}
            overline="Piltover"
            title="SHINE SO BRIGHT"
            kind="music"
          />
        </div>
      ),
    },
    {
      name: "4-column Explore grid",
      notes: "Grid of 4 cards as seen in the Explore page. Mix of story and comic kinds.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="grid grid-cols-4 gap-3 p-4"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseStoryCard
            art={championSplashUrl("Ahri")}
            overline="Ionia"
            title="EVERYWHERE, AND EVERYONE"
            kind="story"
          />
          <UniverseStoryCard
            art={championSplashUrl("Vi")}
            overline="Zaun"
            title="PAINTINGS FRAMED IN HALF-LIGHT"
            kind="comic"
            badgeText="4 Pages"
          />
          <UniverseStoryCard
            art={championSplashUrl("Nasus")}
            overline="Shurima"
            title="HOUNDS OF IRON"
            kind="story"
          />
          <UniverseStoryCard
            art={championSplashUrl("Jinx")}
            overline="Alt Universe · Ruination"
            title="RUINATION PROLOGUE"
            kind="story"
          />
        </div>
      ),
    },
    {
      name: "Long title edge case",
      notes: "Verifies line-clamp-2 on very long title text stays within the card.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-48"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseStoryCard
            art={championSplashUrl("LeeSin")}
            overline="Ionia · Monasteries"
            title="MILIO'S SUPER SPECIAL ADVENTURE REPORTS FROM THE ACADEMY"
            kind="story"
          />
        </div>
      ),
    },
  ],
};
