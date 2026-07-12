import { profileIconUrl } from "./ddragon";

// ---------------------------------------------------------------------------
// Emote types
// ---------------------------------------------------------------------------

/**
 * Emote — a single emote item in the player's collection.
 *
 * ASSET DIVERGENCE: Riot's DDragon CDN (v16.13.1) does not publish emote art.
 * Version 1 uses profileIconUrl stand-ins — small circular icons that visually
 * approximate the emote tile circular art format. All icon IDs verified 200 OK
 * against ddragon.leagueoflegends.com/cdn/16.13.1/img/profileicon/{id}.png.
 * Icon IDs drawn from verified demoFriends usage: 6402, 4368, 5205, 29, 1,
 * 743, 4294, 3. Additional IDs spot-curled: 29, 6, 11, 23, 50, 100.
 */
export interface Emote {
  /** Unique emote slug — used as assignment value in wheel slots. */
  id: string;
  /** Display name shown below the tile. */
  name: string;
  /** Stand-in art URL (profileIconUrl). */
  imageSrc: string;
  /** Whether the player owns this emote. */
  owned: boolean;
}

// ---------------------------------------------------------------------------
// Slot types
// ---------------------------------------------------------------------------

/**
 * SlotId — the 9 assignable positions of the emote wheel.
 *
 * Central cluster: "center", "wheel-n", "wheel-e", "wheel-s", "wheel-w"
 * Satellite (contextual): "start", "first-blood", "ace", "victory"
 */
export type SlotId =
  | "center"
  | "wheel-n"
  | "wheel-e"
  | "wheel-s"
  | "wheel-w"
  | "start"
  | "first-blood"
  | "ace"
  | "victory";

export const ALL_SLOT_IDS: SlotId[] = [
  "center",
  "wheel-n",
  "wheel-e",
  "wheel-s",
  "wheel-w",
  "start",
  "first-blood",
  "ace",
  "victory",
];

// ---------------------------------------------------------------------------
// Demo fixture — 12 emotes, mix of owned/unowned
// ---------------------------------------------------------------------------

/**
 * demoEmotes — 12 fixture emotes.
 *
 * ASSET DIVERGENCE: Uses profileIconUrl ids as circular art stand-ins.
 * Verified icon IDs (HTTP 200): 6402, 4368, 5205, 29, 1, 743, 4294, 3, 6, 11, 23, 50.
 */
export const demoEmotes: Emote[] = [
  { id: "thumbs-up",     name: "Thumbs Up",     imageSrc: profileIconUrl(6402), owned: true  },
  { id: "pog",           name: "Pog",            imageSrc: profileIconUrl(4368), owned: true  },
  { id: "gg",            name: "GG",             imageSrc: profileIconUrl(5205), owned: true  },
  { id: "100",           name: "100",            imageSrc: profileIconUrl(29),   owned: true  },
  { id: "clap",          name: "Clap",           imageSrc: profileIconUrl(1),    owned: true  },
  { id: "ez",            name: "Ez",             imageSrc: profileIconUrl(743),  owned: true  },
  { id: "rip",           name: "RIP",            imageSrc: profileIconUrl(4294), owned: true  },
  { id: "nice",          name: "Nice",           imageSrc: profileIconUrl(3),    owned: false },
  { id: "wow",           name: "Wow",            imageSrc: profileIconUrl(6),    owned: false },
  { id: "hype",          name: "Hype",           imageSrc: profileIconUrl(11),   owned: false },
  { id: "nope",          name: "Nope",           imageSrc: profileIconUrl(23),   owned: false },
  { id: "victory-dance", name: "Victory Dance",  imageSrc: profileIconUrl(50),   owned: false },
];

// ---------------------------------------------------------------------------
// Default wheel loadout — pre-populated for showcase / first-load.
// Values are image URLs (EmoteWheel.slots renders them directly as <image>
// hrefs); resolved from demoEmotes by id so the two stay in sync.
// ---------------------------------------------------------------------------

const emoteSrc = (id: string): string => {
  const e = demoEmotes.find((x) => x.id === id);
  if (!e) throw new Error(`defaultEmoteSlots references unknown emote id "${id}"`);
  return e.imageSrc;
};

export const defaultEmoteSlots: Record<SlotId, string | null> = {
  "center":      emoteSrc("thumbs-up"),
  "wheel-n":     emoteSrc("pog"),
  "wheel-e":     emoteSrc("gg"),
  "wheel-s":     emoteSrc("100"),
  "wheel-w":     emoteSrc("clap"),
  "start":       emoteSrc("ez"),
  "first-blood": emoteSrc("rip"),
  "ace":         null,
  "victory":     null,
};
