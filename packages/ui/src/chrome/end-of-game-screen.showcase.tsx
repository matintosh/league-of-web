import type { ShowcaseEntry } from "../showcase";
import {
  EndOfGameVictoryDemo,
  EndOfGameDefeatDemo,
  EndOfGameLeaverDemo,
  EndOfGameLopsidedDemo,
} from "./end-of-game-screen.demo";

export const endOfGameScreenShowcase: ShowcaseEntry = {
  slug: "end-of-game-screen",
  name: "EndOfGameScreen",
  area: "chrome",
  description:
    "Post-match end-of-game scoreboard. VICTORY/DEFEAT banner header (team-tinted) with queue + duration; two stacked team blocks with five player rows each (champion portrait + champion_frame + level, role icon, name/rank, KDA + ratio, CS + gold with real icons, 6-slot item build + trinket, mastery banner + score meter); an objectives summary strip (dragons/baron/herald/towers/inhibitors) using the 144×144 match-history icons; PLAY AGAIN / CONTINUE footer. All icons stream from CDragon match-history + postgame plugins and DDragon items.",
  variants: [
    {
      name: "Victory — ranked 5v5",
      notes:
        "Local player's blue team wins. Gold VICTORY banner + sr-victory glyph. Local row (isMe) highlighted with a blue accent bar. Blue leads dragons/baron/towers — the dragons cell shows the SPECIFIC elemental drakes taken (fire/air/water/earth) via each team's dragonKinds, blue-tinted for the ally and red-tinted for the enemy's single drake.",
      render: () => <EndOfGameVictoryDemo />,
    },
    {
      name: "Defeat — ranked 5v5",
      notes:
        "Same match from the losing side: red DEFEAT banner + sr-defeat glyph, red-tinted header wash. Play Again is de-emphasized on defeat.",
      render: () => <EndOfGameDefeatDemo />,
    },
    {
      name: "With leaver row",
      notes:
        "Defeat where an ally left: bottom blue row is dimmed with the sr-leaver glyph over the portrait and a poor KDA/score. Enemy team ran away with every objective.",
      render: () => <EndOfGameLeaverDemo />,
    },
    {
      name: "Lopsided objectives — stomp",
      notes:
        "21:47 victory: ally sweeps every objective (4 dragons, baron, 2 heralds, 11 towers, 3 inhibitors) while the enemy secures zero of each — the objectives strip shows a lopsided count.",
      render: () => <EndOfGameLopsidedDemo />,
    },
  ],
};
