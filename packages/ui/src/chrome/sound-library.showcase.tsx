import type { ShowcaseEntry } from "../showcase";
import { SoundLibraryDemo, UikitSoundLibraryDemo } from "./sound-library.demo";

export const soundLibraryShowcase: ShowcaseEntry = {
  slug: "sound-library",
  name: "Sound Library",
  area: "chrome",
  description:
    "Browsable, playable list of client sound effects grouped by category (issues #432, #439). Presentational: emits onPlay(id)/onStop() — the app resolves each catalog's URL (soundUrl / uikitSoundUrl) and drives an HTMLAudioElement. Two catalogs: the 6 friend-finder SFX (#432) and the ~20 generic uikit SFX (#439), both patch-7.5 CDragon audio/ogg.",
  variants: [
    {
      name: "Friend-finder SFX (playable)",
      notes:
        "The 6 friend-finder SFX grouped UI → Notification → Social. Click a play control to actually stream + play the ogg from CommunityDragon (patch 7.5); the playing row swaps to a stop control with a gold ring + blue glow, and finishing/stopping resets it.",
      render: () => <SoundLibraryDemo />,
    },
    {
      name: "uikit SFX (playable)",
      notes:
        "The ~20 generic client-wide uikit SFX (#439) grouped Button → Input → Generic → Celebrate — the button/checkbox/radio/dropdown/hover clips wired into chrome primitives. Resolved via uikitSoundUrl (uikit plugin root, patch 7.5 — a different base than the friend-finder set). Click any play control to stream + play the ogg from CommunityDragon.",
      render: () => <UikitSoundLibraryDemo />,
    },
  ],
};
