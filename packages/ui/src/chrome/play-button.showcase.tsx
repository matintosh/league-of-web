import type { ShowcaseEntry } from "../showcase";
import { PlayButton } from "./play-button";
import {
  PlayButtonQueueingToggleDemo,
  PlayButtonVideoMagicDemo,
  PlayButtonMedallionMagicDemo,
} from "./play-button.demo";

export const playButtonShowcase: ShowcaseEntry = {
  slug: "play-button",
  name: "Play Button",
  area: "chrome",
  description:
    "v7 play button matched to the hi-res Riot reference: heavy-sans PLAY (Inter 800) at ~38% cap-height, " +
    "fill-region centering, enlarged gold-L medallion extending above/below the bar, double-stroke teal frame " +
    "(bright outer over dark inner edge), and a magic-button hover crossfade (idle/hover frame layers + radial glow). " +
    "Concave-left SVG arrow bar, STOP slide toggle, GoldLine/GreenLine frame layers preserved.",
  variants: [
    {
      name: "Default",
      notes:
        "Default state — double-stroke teal frame (80%-alpha 3-stop cyan bright band over a dark teal-frame inner edge), " +
        "grey-4 fill, heavy-sans PLAY label centered in the fill region.",
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
        "Hover crossfades between stacked frame layers (idle → hover) per the Hextech magic-button anatomy — an opacity " +
        "transition between full frame layers, not a property restyle. Hover layer: bright-cyan double-stroke, lifted fill " +
        "gradient (#1D3B4A→#082734), and a radial cyan glow bloom behind the frame, plus the outer-wrapper drop-shadow.",
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
      name: "Party label (lobby state)",
      notes:
        "label='PARTY' + disabled — renders the greyed button with 'PARTY' label as seen in the reference navbar while in a party lobby. " +
        "label prop overrides the idle slide text without touching the STOP toggle or children slot. " +
        "Default 'PLAY' label is untouched when label is omitted.",
      render: () => <PlayButton label="PARTY" disabled emblemSrc="/lol-emblem.png" />,
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
    {
      name: "v8 video magic layers (interactive)",
      notes:
        "issue #309 — the REAL client magic-button videos (WAD corpus) layered over the CSS v7 button: 146×58 frame videos " +
        "(enabled-intro on mount, hover-intro→hover-loop→hover-outro on pointer, release/magic-release on press) + the 64×54 " +
        "league-logo videos on the medallion socket (intro→loop-idle, loop-active on hover, magic accent). All webm carry " +
        "straight alpha and composite over the CSS button — a missing/failed clip leaves the v7 look intact. pointer-events-none, " +
        "below the label, and fully suppressed under prefers-reduced-motion (motion-reduce:hidden). Videos stream from CommunityDragon " +
        "via @low/fixtures (playButtonVideoUrl / buttonParticlesVideoUrl / leagueLogoVideoUrl). Emblem resolves from apps/web/public/, " +
        "so this variant only renders fully inside apps/web.",
      render: () => <PlayButtonVideoMagicDemo />,
    },
    {
      name: "v8 medallion socket videos only (interactive)",
      notes:
        "The league-logo medallion videos alone (medallionVideoSources) with the pure-CSS v7 frame — bronze→gold reveal handing off " +
        "to the calm idle swirl, energetic swirl on hover. Demonstrates the two video state machines are independent: frame videos " +
        "omitted, socket videos on.",
      render: () => <PlayButtonMedallionMagicDemo />,
    },
  ],
};
