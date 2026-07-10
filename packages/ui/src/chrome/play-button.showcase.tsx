import type { ShowcaseEntry } from "../showcase";
import { PlayButton } from "./play-button";

export const playButtonShowcase: ShowcaseEntry = {
  slug: "play-button",
  name: "Play Button",
  area: "chrome",
  description: "Medallion + notched bar CTA used in the client navbar.",
  variants: [
    { name: "Default", render: () => <PlayButton /> },
    { name: "Custom label", render: () => <PlayButton>Custom</PlayButton> },
    { name: "Hover note", notes: "Hover for teal glow + border brighten", render: () => <PlayButton /> },
    { name: "Disabled", notes: "disabled prop", render: () => <PlayButton disabled /> },
  ],
};
