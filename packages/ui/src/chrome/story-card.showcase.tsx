import type { ShowcaseEntry } from "../showcase";
import { StoryCard } from "./story-card";
import { StoryCardDemo } from "./story-card.demo";
import { loadingArtUrl } from "@low/fixtures";

export const storyCardShowcase: ShowcaseEntry = {
  slug: "story-card",
  name: "StoryCard",
  area: "chrome",
  description:
    "Universe content card from universe.leagueoflegends.com — portrait art, eyebrow, clamped title, media badge + date footer.",
  variants: [
    {
      name: "Full card",
      notes: 'data-shot="story-full"',
      render: () => (
        <div data-shot="story-full" className="w-48">
          <StoryCard
            eyebrow="Ahri"
            title="The Nine-Tailed Fox"
            mediaType="Short Story"
            date="June 2026"
            imageSrc={loadingArtUrl("Ahri")}
          />
        </div>
      ),
    },
    {
      name: "No eyebrow",
      notes: "eyebrow omitted — title sits at the top of the body block",
      render: () => (
        <div className="w-48">
          <StoryCard
            title="Kalista's Embrace"
            mediaType="Comic"
            date="May 2026"
            imageSrc={loadingArtUrl("Kalista")}
          />
        </div>
      ),
    },
    {
      name: "Long title clamp",
      notes: "title exceeds 2 lines → ellipsis at line-clamp-2",
      render: () => (
        <div className="w-48">
          <StoryCard
            eyebrow="Demacia"
            title="The Light and the Shadow of the Demacian Crown: A Tale of Two Champions Divided by History"
            mediaType="Short Story"
            date="April 2026"
            imageSrc={loadingArtUrl("Lux")}
          />
        </div>
      ),
    },
    {
      name: "Clickable",
      notes: "onOpen provided → renders as <button>; click increments counter",
      render: () => <StoryCardDemo />,
    },
    {
      name: "Grid of 4",
      notes:
        "Matches the universe explore-grid layout (portrait cards side by side). Hover any card to see art zoom.",
      render: () => (
        <div className="grid grid-cols-4 gap-3 w-full max-w-2xl">
          <StoryCard
            eyebrow="Ahri"
            title="The Nine-Tailed Fox"
            mediaType="Short Story"
            date="June 2026"
            imageSrc={loadingArtUrl("Ahri")}
          />
          <StoryCard
            eyebrow="Jinx"
            title="Paint the Town Blue"
            mediaType="Comic"
            date="May 2026"
            imageSrc={loadingArtUrl("Jinx")}
          />
          <StoryCard
            title="Kalista's Embrace"
            mediaType="Short Story"
            date="April 2026"
            imageSrc={loadingArtUrl("Kalista")}
          />
          <StoryCard
            eyebrow="Lux"
            title="A Light in the Darkness: The Long Clamped Title That Wraps"
            mediaType="Cinematic"
            date="March 2026"
            imageSrc={loadingArtUrl("Lux")}
          />
        </div>
      ),
    },
    {
      name: "Hover note",
      notes:
        "Hover any card above — the art zooms via group-hover:scale-105. Both the <button> and <div> branches carry the `group` class, so zoom fires on both.",
      render: () => null,
    },
  ],
};
