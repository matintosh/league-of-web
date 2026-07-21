import type { ShowcaseEntry } from "../showcase";
import { SoundLibraryDemo } from "./sound-library.demo";

export const soundLibraryShowcase: ShowcaseEntry = {
  slug: "sound-library",
  name: "Sound Library",
  area: "chrome",
  description:
    "Browsable, playable list of client sound effects grouped by category (issue #432). Presentational: emits onPlay(id)/onStop() — the app's useSound hook resolves soundUrl(id) and drives an HTMLAudioElement. First catalog is the 6 friend-finder SFX (patch-7.5 CDragon, audio/ogg).",
  variants: [
    {
      name: "Friend-finder SFX (playable)",
      notes:
        "The 6 friend-finder SFX grouped UI → Notification → Social. Click a play control to actually stream + play the ogg from CommunityDragon (patch 7.5); the playing row swaps to a stop control with a gold ring + blue glow, and finishing/stopping resets it.",
      render: () => <SoundLibraryDemo />,
    },
  ],
};
