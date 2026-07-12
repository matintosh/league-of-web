import type { ShowcaseEntry } from "../showcase";
import { EmoteTile } from "./emote-tile";
import { EmoteTileClickableDemo } from "./emote-tile.demo";
import { profileIconUrl } from "@low/fixtures";

// Profile icon IDs — verified HTTP 200 against DDragon v16.13.1
const ART_OWNED = profileIconUrl(6402);
const ART_OWNED_2 = profileIconUrl(4368);
const ART_UNOWNED = profileIconUrl(5205);

export const emoteTileShowcase: ShowcaseEntry = {
  slug: "emote-tile",
  name: "Emote Tile",
  area: "collection",
  description:
    "~80×80px inventory tile for an emote. Circular art inside; unowned tiles are dimmed; selected tile gets a gold-2 border. NOTE: Uses profileIconUrl stand-ins — DDragon v16.13.1 has no emote art.",
  variants: [
    {
      name: "Owned",
      notes: "owned=true (default) — full brightness, grey-3 border",
      render: () => (
        <div className="p-6 bg-hextech-black flex gap-4 items-start">
          <EmoteTile name="Thumbs Up" imageSrc={ART_OWNED} owned />
        </div>
      ),
    },
    {
      name: "Unowned",
      notes: "owned=false — art dimmed to brightness-50, muted name text",
      render: () => (
        <div className="p-6 bg-hextech-black flex gap-4 items-start">
          <EmoteTile name="Nope" imageSrc={ART_UNOWNED} owned={false} />
        </div>
      ),
    },
    {
      name: "Selected",
      notes: "selected=true — border switches from grey-3 to gold-2",
      render: () => (
        <div className="p-6 bg-hextech-black flex gap-4 items-start">
          <EmoteTile name="Thumbs Up" imageSrc={ART_OWNED} owned selected />
        </div>
      ),
    },
    {
      name: "Clickable (interactive)",
      notes: "onSelect provided — renders as <button>, aria-pressed reflects selection. Click to select/deselect.",
      render: () => <EmoteTileClickableDemo />,
    },
    {
      name: "Grid row — owned + unowned mix",
      notes: "4-column grid mix; unowned tiles are dimmed",
      render: () => (
        <div className="p-6 bg-hextech-black">
          <div className="grid grid-cols-4 gap-2 w-fit">
            <EmoteTile name="Thumbs Up" imageSrc={ART_OWNED} owned />
            <EmoteTile name="Pog" imageSrc={ART_OWNED_2} owned />
            <EmoteTile name="Nope" imageSrc={ART_UNOWNED} owned={false} />
            <EmoteTile name="A Very Long Emote Name" imageSrc={ART_OWNED} owned />
          </div>
        </div>
      ),
    },
  ],
};
