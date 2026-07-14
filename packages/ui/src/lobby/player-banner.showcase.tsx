import type { ShowcaseEntry } from "../showcase";
import {
  PlayerBannerSelfDemo,
  PlayerBannerFullPartyDemo,
  PlayerBannerEmptyDemo,
  PlayerBannerWingTiersDemo,
  PlayerBannerTruncationDemo,
  PlayerBannerAutofillDemo,
  PlayerBannerHeraldShapeDemo,
  PlayerBannerLevelBadgeDemo,
  PlayerBannerQueueingDemo,
  PlayerBannerTierGemDemo,
  PlayerBannerBadgeSlotsDemo,
  PlayerBannerSweepDemo,
  PlayerBannerInvitedDemo,
} from "./player-banner.demo";

export const playerBannerShowcase: ShowcaseEntry = {
  slug: "player-banner",
  name: "Player Banner",
  area: "lobby",
  description:
    "Vertical heraldic banner card for the pre-game lobby. The flag chrome is the REAL client party-banner art (issue #336) — CommunityDragon rcp-fe-lol-parties `banner-filled.png`, a straight-alpha PNG that carries the whole silhouette (scooped-neck top, ornate gold corner scrolls, double-V pointed bottom) plus its gold trim, dropped in as one background <img>. The avatar crest / tier gem / level badge / badges / role row / footer composite on top; content is padded clear of the pointed-bottom band. Crown+name above the shape. Self reuses the same art brightened (its baked medallion ring lives in the unused current-player-banner art, so the live AvatarCrest ring isn't doubled). Widths stay 120px (self) / 96px (teammate); height derives from the art aspect (h/w≈1.44). Empty: large grey + circle (~90px). Queue treatment (queueing=true): empty slots show dark circle with blue glow ring; self banner shows asterisk foot glyph. Wing art from CommunityDragon ranked-emblem PNGs. tierGem prop adds a ranked-mini-crest PNG at 12 o'clock on the portrait ring; badges tuple adds 3 circular badge slots below the role row.",
  variants: [
    {
      name: "Heraldic shape — self + teammate + empty circle",
      notes:
        "Shows the real client banner art (banner-filled.png) on self (brightened) and teammate banners — scooped-neck top, gold corner scrolls, double-V pointed bottom, baked gold trim — with crown+name floating above, level badge on medallion, and the + circle empty slot side by side.",
      render: () => <PlayerBannerHeraldShapeDemo />,
    },
    {
      name: "Self banner (gold wings, autofill protected)",
      notes:
        "isSelf=true: wider panel, gold wings, crown glyph + name above shape, heraldic silhouette, level badge, autofill-protected chip at foot. RoleSlotRow (mid + support).",
      render: () => <PlayerBannerSelfDemo />,
    },
    {
      name: "Full party (5 banners)",
      notes:
        "All five banner cards side by side: self (center, gold) + four teammates in teal, green, blue, and bronze wings.",
      render: () => <PlayerBannerFullPartyDemo />,
    },
    {
      name: "Empty slots (+ circles)",
      notes:
        "empty=true: 90px grey double-ring + circle. Matches solo lobby reference showing 4 large circular empty slots.",
      render: () => <PlayerBannerEmptyDemo />,
    },
    {
      name: "All WingTiers",
      notes:
        "Every WingTier: default (iron), bronze, gold, teal (platinum), green (emerald), blue (diamond). All use heraldic shape.",
      render: () => <PlayerBannerWingTiersDemo />,
    },
    {
      name: "Long name + title truncation",
      notes:
        "Extremely long summoner name and title. Name truncates in above-banner row; title truncates inside the shape.",
      render: () => <PlayerBannerTruncationDemo />,
    },
    {
      name: "Level badge variants (1, 247, 999, absent→15)",
      notes:
        "Exercises level prop: single-digit, 3-digit (247 = demoSummoner fixture level), 3-digit maximum (999), and absent (defaults to 15). Badge minWidth grows to fit 3 digits without clipping.",
      render: () => <PlayerBannerLevelBadgeDemo />,
    },
    {
      name: "Autofill chip (non-self)",
      notes:
        "autofillProtected=true on a teammate banner. Shield glyph + text chip at banner foot.",
      render: () => <PlayerBannerAutofillDemo />,
    },
    {
      name: "Queueing state — blue glow empty slots + self asterisk",
      notes:
        "queueing=true: empty slots render as dark circles with glowing blue rings (replacing the + placeholder). Self banner shows an asterisk glyph at the foot marking the queued player. Matches the queue-in-lobby reference (issue #174).",
      render: () => <PlayerBannerQueueingDemo />,
    },
    {
      name: "Tier gem — all TierGem values at 12 o'clock of portrait ring",
      notes:
        "tierGem prop: all 10 tiers (iron, bronze, silver, gold, platinum, diamond, master, grandmaster, challenger, unranked) plus self/gold variant. Gem rendered from CommunityDragon ranked-mini-crests PNGs at 12 o'clock of the medallion ring. No gem when tierGem is omitted.",
      render: () => <PlayerBannerTierGemDemo />,
    },
    {
      name: "Badge slots — filled + empty combinations",
      notes:
        "badges tuple (3 optional BadgeSlot entries): filled slots show icon art with a colored ring; empty slots render as dark circles with a muted ring. Shows all-filled, two-filled, one-filled, all-empty, and no-badges-prop (legacy) states.",
      render: () => <PlayerBannerBadgeSlotsDemo />,
    },
    {
      name: "Banner sweep — one-shot entrance flourish (with / without)",
      notes:
        "sweepVideoSrc: the real-client 272×620 banner-sweep webm plays ONCE over the flag on mount then unmounts to the static banner (an entrance flourish, not a loop). Self uses bannerSweepVideoUrl(\"primary\"), ally uses (\"ally\"); the third banner has no sweepVideoSrc as the static baseline. Click Replay to remount and re-fire the sweep. The overlay sits above the banner art but below the crest/text/badges (they stay legible mid-flourish); suppressed under prefers-reduced-motion; a load error drops the layer leaving the static flag.",
      render: () => <PlayerBannerSweepDemo />,
    },
    {
      name: "Invited slot — animated pending-invite flag (issue #347)",
      notes:
        "invited=true: a pending party member the captain has invited but who hasn't accepted. Replaces the plain empty + circle with an animated heraldic flag (dark panel, glowing blue summon ring, rising blue mist). invitedVideoSrc loops continuously (an idle \"searching\" pulse, not a one-shot); the clip carries its own silhouette + gold trim in alpha so it fills the flag box standalone. Two shipped clips: the 5s \"classic pulse\" (its 178×550 frame matches the static PNG exactly) and a subtler 3s loop — both user-extracted (WAD), NOT CommunityDragon-mirrored (parties plugin ships only invited-banner.png), so served from local /media/. The static invited PNG (invitedFallbackSrc = partyBannerUrl(\"invited\")) sits beneath and is the sole visual under prefers-reduced-motion or on video load error. Third banner has no video → static-only (same as the reduced-motion look). pointer-events-none, no layout contract change.",
      render: () => <PlayerBannerInvitedDemo />,
    },
  ],
};
