import type { ShowcaseEntry } from "../showcase";
import { BanStatusStrip } from "./ban-status-strip";

// Fixture portrait URLs — representative champion squares from the real DDragon CDN.
// These are hardcoded here (showcase-only) — fixture values never belong in @low/ui.
const AATROX = "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Aatrox.png";
const JHIN = "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jhin.png";
const SIVIR = "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Sivir.png";
const TEEMO = "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Teemo.png";
const YASUO = "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Yasuo.png";
const ZED = "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Zed.png";
const CAITLYN = "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Caitlyn.png";
const THRESH = "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Thresh.png";
const JINX = "https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jinx.png";

export const banStatusStripShowcase: ShowcaseEntry = {
  slug: "ban-status-strip",
  name: "BanStatusStrip",
  area: "champ-select",
  description:
    "Horizontal strip of 10 ban slot icons (5 ally + 5 enemy). Banned slots show grayscale portrait with dark overlay + red X. Active slot glows; empty upcoming slots are dark grey squares.",
  variants: [
    {
      name: "Player turn — all empty",
      notes: "activeAllySlot=0, all slots null — player has not yet picked a ban.",
      render: () => (
        <div className="w-full bg-hextech-black p-2">
          <BanStatusStrip
            allyBanSrcs={[null, null, null, null, null]}
            enemyBanSrcs={[null, null, null, null, null]}
            activeAllySlot={0}
          />
        </div>
      ),
    },
    {
      name: "Ban in progress — player slot 0 active",
      notes: "Ally slots 1–4 pre-filled, all 5 enemy slots filled. Player's slot (0) is active.",
      render: () => (
        <div className="w-full bg-hextech-black p-2">
          <BanStatusStrip
            allyBanSrcs={[null, AATROX, JHIN, SIVIR, TEEMO]}
            enemyBanSrcs={[YASUO, ZED, CAITLYN, THRESH, JINX]}
            activeAllySlot={0}
          />
        </div>
      ),
    },
    {
      name: "All bans done — 10 slots filled",
      notes: "No active slot. All portraits show grayscale + red X overlay.",
      render: () => (
        <div className="w-full bg-hextech-black p-2">
          <BanStatusStrip
            allyBanSrcs={[TEEMO, AATROX, JHIN, SIVIR, CAITLYN]}
            enemyBanSrcs={[YASUO, ZED, THRESH, JINX, CAITLYN]}
          />
        </div>
      ),
    },
    {
      name: "Enemy turn — slot 2 active",
      notes: "activeEnemySlot=2. Ally has 2 bans, enemy has 2 and is picking slot 2.",
      render: () => (
        <div className="w-full bg-hextech-black p-2">
          <BanStatusStrip
            allyBanSrcs={[TEEMO, AATROX, null, null, null]}
            enemyBanSrcs={[YASUO, ZED, null, null, null]}
            activeEnemySlot={2}
          />
        </div>
      ),
    },
    {
      name: "Partial bans — ally 2, enemy 3",
      notes: "Mixed state: 2 ally bans filled, 3 enemy bans filled. Ally slot 2 is active.",
      render: () => (
        <div className="w-full bg-hextech-black p-2">
          <BanStatusStrip
            allyBanSrcs={[TEEMO, SIVIR, null, null, null]}
            enemyBanSrcs={[YASUO, ZED, CAITLYN, null, null]}
            activeAllySlot={2}
          />
        </div>
      ),
    },
  ],
};
