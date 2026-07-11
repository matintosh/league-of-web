import type { ShowcaseEntry } from "../showcase";
import { PlayButton } from "./play-button";
import { PlayButtonQueueingToggleDemo } from "./play-button.demo";

export const playButtonShowcase: ShowcaseEntry = {
  slug: "play-button",
  name: "Play Button",
  area: "chrome",
  description:
    "XAML-spec v4 play button: concave-left SVG arrow bar, 3-stop state gradients, STOP slide toggle. Medallion + GoldLine/GreenLine frame layers.",
  variants: [
    {
      name: "Default",
      notes: "Default state — 80%-alpha 3-stop cyan gradient stroke, grey-4 fill, PLAY label.",
      render: () => <PlayButton />,
    },
    {
      name: "Hero",
      notes: "size='hero' — proportionally scaled from XAML at ~1.64× the default bar height.",
      render: () => <PlayButton size="hero" />,
    },
    {
      name: "Hover note",
      notes:
        "Hover for bright-cyan 3-stop stroke, lifted fill gradient (#1D3B4A→#082734), and drop-shadow glow on the outer wrapper.",
      render: () => <PlayButton />,
    },
    {
      name: "Queueing (static)",
      notes:
        "queueing prop — flat grey-2 stroke, grey-4 fill, grey-3 text. STOP label has slid in. No hover effects.",
      render: () => <PlayButton queueing />,
    },
    {
      name: "Queueing Hero (static)",
      notes: "hero + queueing — same grey state at hero scale.",
      render: () => <PlayButton size="hero" queueing />,
    },
    {
      name: "Disabled",
      notes: "disabled prop — grey-3 stroke, grey-4 fill, glyph and ring greyed out, no glow.",
      render: () => <PlayButton disabled />,
    },
    {
      name: "Hero Disabled",
      notes: "hero + disabled.",
      render: () => <PlayButton size="hero" disabled />,
    },
    {
      name: "Custom label",
      notes: "Children override the PLAY label; STOP is always the queueing label.",
      render: () => <PlayButton>Practice Tool</PlayButton>,
    },
    {
      name: "Queueing toggle (interactive)",
      notes:
        "Click to toggle queueing. PLAY exits downward / STOP enters from above — 500ms cubic-bezier ease-in-out matching the XAML Checked/UnChecked storyboards.",
      render: () => <PlayButtonQueueingToggleDemo />,
    },
    {
      name: "With real emblem (default)",
      notes:
        "emblemSrc='/lol-emblem.png' — the real LoL fist-and-banner crest (497×474 RGBA) rendered at XAML Height=38 inside the medallion socket. " +
        "Note: '/lol-emblem.png' resolves from apps/web/public/; this variant only renders correctly when the showcase runs inside apps/web.",
      render: () => <PlayButton emblemSrc="/lol-emblem.png" />,
    },
    {
      name: "With real emblem (hero)",
      notes:
        "size='hero' + emblemSrc — emblem scales proportionally with the hero bar height (~62px socket). Explicit width/height on <img> prevents layout shift.",
      render: () => <PlayButton size="hero" emblemSrc="/lol-emblem.png" />,
    },
  ],
};
