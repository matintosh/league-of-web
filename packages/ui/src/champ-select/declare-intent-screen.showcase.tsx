import type { ShowcaseEntry } from "../showcase";
import { DeclareIntentScreen } from "./declare-intent-screen";
import type { DeclareRosterEntry } from "./declare-intent-screen";
import {
  positionIconUrl,
  summonerSpellIconUrl,
  declareMapIntroUrl,
  declarePathUrl,
  declarePinUrl,
} from "@low/fixtures";

// ---------------------------------------------------------------------------
// Fixture roster — five roles, local player (self) declaring MID, floated to
// the top to match the reference (docs/reference/client-champ-select-declare-intent.png).
// ---------------------------------------------------------------------------

const ROSTER: DeclareRosterEntry[] = [
  { summonerName: "cherwood", role: "middle", roleIconSrc: positionIconUrl("middle"), isSelf: true },
  { summonerName: "qlxHarlan", role: "bottom", roleIconSrc: positionIconUrl("bottom") },
  { summonerName: "Oppeohtelar", role: "top", roleIconSrc: positionIconUrl("top") },
  { summonerName: "HowarqLqUq", role: "jungle", roleIconSrc: positionIconUrl("jungle") },
  { summonerName: "CallMeCallMeStar", role: "utility", roleIconSrc: positionIconUrl("utility") },
];

const VIDEO = {
  mapIntroSrc: declareMapIntroUrl("north"),
  pathSrcs: {
    top: declarePathUrl("north", "top"),
    jungle: declarePathUrl("north", "jungle"),
    middle: declarePathUrl("north", "middle"),
    bottom: declarePathUrl("north", "bottom"),
  },
  pinSrc: declarePinUrl("ally"),
  mePinSrc: declarePinUrl("me"),
};

const SPELLS: [string, string] = [
  summonerSpellIconUrl("summoner_flash"),
  summonerSpellIconUrl("summonerignite"),
];

/** Fixed-size 1280×720 stage wrapper so the screen renders at its real aspect. */
function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-hidden border border-gold-5">
      <div className="relative mx-auto" style={{ width: 1280, height: 720, maxWidth: "100%" }}>
        {children}
      </div>
    </div>
  );
}

export const declareIntentScreenShowcase: ShowcaseEntry = {
  slug: "declare-intent-screen",
  name: "Declare Intent Screen",
  area: "champ-select",
  description:
    "The champ-select declare-intent (position-assignment) phase: DECLARE YOUR CHAMPION! header + countdown, a left roster of 5 role rows — circular gold-ringed role medallions on a faint diamond connector rail, the local player's (self) row marked by a Declaring Intent sublabel, a brighter medallion ring, and an ~8px gold active bar at the far-left edge — a center Summoner's Rift map stage (map-intro reveal video → per-role lane paths light up → role pins drop, the me-pin distinct), a collapsed loadout tray (runes/spells/emote — visual only), and a bottom-right queue label. Presentational: roster, countdown, video URLs and labels via props; the parent owns the timer and auto-advance to the ban phase. Map/path/pin clips stream from CommunityDragon (straight-alpha overlays played once; reduced-motion or a failed clip degrades to a static map + static pins).",
  variants: [
    {
      name: "Intro — map reveal (9s of 12s)",
      notes:
        "The full phase mid-play: map-north-intro reveal video as the stage, cyan lane paths lit for the four laned roles, ally/me pins dropped (support is pin-only — no path). Timer near the top of the countdown. Videos stream from CommunityDragon under the champ-select plugin video/ subtree.",
      render: () => (
        <Stage>
          <DeclareIntentScreen
            secondsRemaining={9}
            totalSeconds={12}
            roster={ROSTER}
            video={VIDEO}
            side="north"
            queueLabel="5V5"
            queueSublabel="Ranked Solo/Duo"
            runePageName="Sorcery: The Calamity"
            spellSrcs={SPELLS}
          />
        </Stage>
      ),
    },
    {
      name: "Settled — near end (2s of 12s)",
      notes:
        "Countdown almost drained (bar hugging the left, self-row chip at ◀2) just before auto-advance to bans. Same video stage — the clips have settled onto their lanes.",
      render: () => (
        <Stage>
          <DeclareIntentScreen
            secondsRemaining={2}
            totalSeconds={12}
            roster={ROSTER}
            video={VIDEO}
            side="north"
            queueLabel="5V5"
            queueSublabel="Ranked Solo/Duo"
            runePageName="Sorcery: The Calamity"
            spellSrcs={SPELLS}
          />
        </Stage>
      ),
    },
    {
      name: "Reduced motion / no video — static map + pins",
      notes:
        "No video sources supplied — the stage falls back to the static Hextech rift backdrop with a diamond outline and static teardrop pins per role (me-pin gold, allies teal). This is exactly what renders under prefers-reduced-motion: reduce, or when every clip fails to load (additive-safe).",
      render: () => (
        <Stage>
          <DeclareIntentScreen
            secondsRemaining={9}
            totalSeconds={12}
            roster={ROSTER}
            side="north"
            queueLabel="5V5"
            queueSublabel="Ranked Solo/Duo"
            runePageName="Sorcery: The Calamity"
            spellSrcs={SPELLS}
          />
        </Stage>
      ),
    },
  ],
};
