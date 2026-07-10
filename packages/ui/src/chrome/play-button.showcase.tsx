import type { ShowcaseEntry } from "../showcase";
import { PlayButton } from "./play-button";

export const playButtonShowcase: ShowcaseEntry = {
  slug: "play-button",
  name: "Play Button",
  area: "chrome",
  description:
    "Medallion + double-teal-frame pointed-bar CTA used as the primary Play action in the client.",
  variants: [
    {
      name: "Default",
      render: () => <PlayButton />,
    },
    {
      name: "Hero",
      notes: "size='hero' — landing-CTA scale (medallion 72px, bar 56px, text-2xl)",
      render: () => <PlayButton size="hero" />,
    },
    {
      name: "Disabled",
      notes: "disabled prop — glow removed, frame and glyph go grey",
      render: () => <PlayButton disabled />,
    },
    {
      name: "Hero Disabled",
      notes: "hero + disabled",
      render: () => <PlayButton size="hero" disabled />,
    },
    {
      name: "Custom label",
      render: () => <PlayButton>Practice Tool</PlayButton>,
    },
    {
      name: "Hover note",
      notes:
        "Hover for teal drop-shadow glow (filter:drop-shadow on outer wrapper) + gold border brighten + blue-2 inner teal accent",
      render: () => <PlayButton />,
    },
  ],
};
