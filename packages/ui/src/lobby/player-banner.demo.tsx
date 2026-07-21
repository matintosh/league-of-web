"use client";

import { useState } from "react";
import { PlayerBanner } from "./player-banner";
import { RoleSlotRow } from "./role-slot-row";
import {
  profileIconUrl,
  bannerSweepVideoUrl,
  partyBannerUrl,
  regaliaBannerUrl,
  championSplashUrl,
  masteryCrestUrl,
} from "@low/fixtures";
import type { RankedTier } from "@low/fixtures";

// Stable profile icon URLs for demos
const AVATAR_1 = profileIconUrl(1);
const AVATAR_2 = profileIconUrl(29);
const AVATAR_3 = profileIconUrl(550);

// CommunityDragon role slug mapping (mirror role-selector.demo.tsx)
import type { Role } from "./role-selector";
import type { TierGem, WingTier } from "./player-banner";
import { positionIconUrl } from "@low/fixtures";

const ROLE_TO_CDRAGON: Record<Role, "top" | "jungle" | "middle" | "bottom" | "utility"> = {
  top: "top",
  jungle: "jungle",
  mid: "middle",
  bottom: "bottom",
  support: "utility",
};

function roleIconSrc(role: Role): string {
  return positionIconUrl(ROLE_TO_CDRAGON[role]);
}

// ---------------------------------------------------------------------------
// Self banner (gold wings, large, crown, autofill protected)
// ---------------------------------------------------------------------------

export function PlayerBannerSelfDemo() {
  return (
    <div className="flex items-end justify-center gap-4 p-8 bg-blue-6">
      <PlayerBanner
        name="TristanaPrey"
        title="Dark Child"
        avatarSrc={AVATAR_1}
        wingTier="gold"
        isSelf
        autofillProtected
      >
        <RoleSlotRow
          slots={[{ role: "mid" }, { role: "support" }]}
          iconSrcFor={roleIconSrc}
        />
      </PlayerBanner>
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2025 ornate rank-frame (self banner) — issues #471 / #475
//
// The regalia tier banner (regaliaBannerUrl) is the ornate frame backdrop +
// wreath foot; the champion splash (championSplashUrl) masks in red-tinted
// behind the crest; masteryCrestUrl feeds the three medallions; `signature`
// is the handwriting-font stand-in for the real client's rendered signature.
// ---------------------------------------------------------------------------

const RANK_SPLASH = championSplashUrl("Ahri");
const RANK_MASTERY = [
  masteryCrestUrl(10),
  masteryCrestUrl(9),
  masteryCrestUrl(7),
];

export function PlayerBannerRankFrameDemo() {
  return (
    <div className="flex items-end justify-center gap-6 p-8 bg-blue-6">
      <PlayerBanner
        name="matintosh"
        title="Final Boss Faker"
        avatarSrc={AVATAR_1}
        isSelf
        crownChip
        wingTier="blue"
        tierGem="challenger"
        signature="matintosh"
        regaliaSrc={regaliaBannerUrl("challenger")}
        backdropSrc={RANK_SPLASH}
        masteryCrests={RANK_MASTERY}
        onEditLoadout={() => {}}
      />
    </div>
  );
}

// Variants across a few tiers — the wreath foot / frame accent is tier-coloured.
export function PlayerBannerRankTiersDemo() {
  // Each tier pairs its regalia banner with the wing-clasp art + gem for the top
  // medallion (WingTier / TierGem). The foot wreath is red-tinted uniformly.
  const rows: { tier: RankedTier; wing: WingTier; gem: TierGem }[] = [
    { tier: "unranked", wing: "default", gem: "unranked" },
    { tier: "gold", wing: "gold", gem: "gold" },
    { tier: "emerald", wing: "green", gem: "diamond" },
    { tier: "challenger", wing: "blue", gem: "challenger" },
  ];
  return (
    <div className="flex flex-wrap items-end justify-center gap-4 p-8 bg-blue-6">
      {rows.map(({ tier, wing, gem }) => (
        <PlayerBanner
          key={tier}
          name="matintosh"
          title="Final Boss Faker"
          avatarSrc={AVATAR_1}
          isSelf
          crownChip
          wingTier={wing}
          tierGem={gem}
          signature="matintosh"
          regaliaSrc={regaliaBannerUrl(tier)}
          backdropSrc={RANK_SPLASH}
          masteryCrests={RANK_MASTERY}
          onEditLoadout={() => {}}
        />
      ))}
    </div>
  );
}

// Prestige/event banner — raw slug via the string overload (Spirit Blossom).
export function PlayerBannerPrestigeDemo() {
  return (
    <div className="flex items-end justify-center gap-6 p-8 bg-blue-6">
      <PlayerBanner
        name="matintosh"
        title="Spirit Blossom Festival"
        avatarSrc={AVATAR_2}
        isSelf
        crownChip
        wingTier="blue"
        tierGem="challenger"
        signature="matintosh"
        regaliaSrc={regaliaBannerUrl("challenger")}
        backdropSrc={championSplashUrl("Ahri", 4)}
        masteryCrests={RANK_MASTERY}
        onEditLoadout={() => {}}
      />
      {/* No splash backdrop → plain dark panel behind the crest */}
      <PlayerBanner
        name="NoSplash"
        title="Frame only"
        avatarSrc={AVATAR_3}
        isSelf
        wingTier="blue"
        tierGem="diamond"
        signature="NoSplash"
        regaliaSrc={regaliaBannerUrl("diamond")}
        masteryCrests={[masteryCrestUrl(7)]}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full party — all five banners (self center + 4 teammates) with tier gems + badges
// ---------------------------------------------------------------------------

export function PlayerBannerFullPartyDemo() {
  const CDRAGON_MINI =
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests";
  return (
    <div className="flex items-center justify-center gap-2 p-8 bg-blue-6">
      <PlayerBanner
        name="JinxFan99"
        title="The Loose Cannon"
        avatarSrc={AVATAR_3}
        wingTier="teal"
        tierGem="platinum"
        badges={[
          { iconSrc: `${CDRAGON_MINI}/platinum.png`, ringColor: "var(--color-teal-ring)" },
          { iconSrc: `${CDRAGON_MINI}/gold.png`, ringColor: "var(--color-gold-3)" },
          undefined,
        ]}
      >
        <RoleSlotRow slots={[{ role: "top" }, { role: "jungle" }]} iconSrcFor={roleIconSrc} />
      </PlayerBanner>

      <PlayerBanner
        name="VioletStorm"
        title="Tempest"
        avatarSrc={AVATAR_2}
        wingTier="green"
        tierGem="diamond"
        badges={[
          { iconSrc: `${CDRAGON_MINI}/diamond.png`, ringColor: "var(--color-blue-2)" },
          { iconSrc: `${CDRAGON_MINI}/gold.png`, ringColor: "var(--color-gold-3)" },
          { iconSrc: `${CDRAGON_MINI}/silver.png`, ringColor: "var(--color-grey-1)" },
        ]}
      >
        <RoleSlotRow slots={[{ role: "jungle" }, { role: "mid" }]} iconSrcFor={roleIconSrc} />
      </PlayerBanner>

      <PlayerBanner
        name="TristanaPrey"
        title="Dark Child"
        avatarSrc={AVATAR_1}
        wingTier="gold"
        isSelf
        autofillProtected
        tierGem="gold"
        badges={[
          { iconSrc: `${CDRAGON_MINI}/gold.png`, ringColor: "var(--color-gold-3)" },
          { iconSrc: `${CDRAGON_MINI}/challenger.png`, ringColor: "var(--color-gold-2)" },
          undefined,
        ]}
      >
        <RoleSlotRow slots={[{ role: "mid" }, { role: "support" }]} iconSrcFor={roleIconSrc} />
      </PlayerBanner>

      <PlayerBanner
        name="DragonMaster"
        title="Fire Dancer"
        avatarSrc={AVATAR_2}
        wingTier="blue"
        tierGem="gold"
        badges={[undefined, undefined, undefined]}
      >
        <RoleSlotRow slots={[{ role: "bottom" }, { role: "support" }]} iconSrcFor={roleIconSrc} />
      </PlayerBanner>

      <PlayerBanner
        name="SoloBrave"
        title=""
        avatarSrc={AVATAR_3}
        wingTier="bronze"
        tierGem="bronze"
        badges={[
          { iconSrc: `${CDRAGON_MINI}/bronze.png`, ringColor: "var(--color-gold-4)" },
          undefined,
          undefined,
        ]}
      >
        <RoleSlotRow slots={[{ role: "support" }, {}]} iconSrcFor={roleIconSrc} />
      </PlayerBanner>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Heraldic shape — self + teammate + empty circle
// ---------------------------------------------------------------------------

export function PlayerBannerHeraldShapeDemo() {
  return (
    <div className="flex items-end justify-center gap-6 p-8 bg-blue-6">
      <PlayerBanner
        name="cherwood"
        avatarSrc={AVATAR_1}
        wingTier="gold"
        isSelf
        crownChip
        autofillProtected
      >
        <RoleSlotRow
          slots={[{ role: "mid" }, { role: "support" }]}
          iconSrcFor={roleIconSrc}
        />
      </PlayerBanner>
      <PlayerBanner
        name="Teammate"
        avatarSrc={AVATAR_2}
        wingTier="teal"
      />
      <PlayerBanner name="" avatarSrc="" empty />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Empty banner (+ circles)
// ---------------------------------------------------------------------------

export function PlayerBannerEmptyDemo() {
  return (
    <div className="flex items-center justify-center gap-4 p-8 bg-blue-6">
      <PlayerBanner name="" avatarSrc="" empty />
      <PlayerBanner name="" avatarSrc="" empty />
      <PlayerBanner name="" avatarSrc="" empty />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Invited banner (animated pending-invite flag) — issue #347
//
// The invited-flag clips are user-extracted (WAD) and NOT CommunityDragon-
// mirrored, so pages/demos supply a LOCAL /media/ URL rather than a cdragon
// helper. The static invited PNG (partyBannerUrl("invited")) is the resting-
// frame fallback shown under reduced-motion / on video error.
// ---------------------------------------------------------------------------

// Two distinct shipped clips (probe #347): the 5s VP8 "classic pulse" whose
// 178×550 silhouette matches the static PNG family (resting-state approximation), and the subtler 3s VP9 loop.
const INVITED_PULSE_SRC = "/media/invited-banner/invited-banner-pulse.webm";
const INVITED_LOOP_SRC = "/media/invited-banner/invited-banner-loop.webm";
const INVITED_STATIC_SRC = partyBannerUrl("invited");

export function PlayerBannerInvitedDemo() {
  return (
    <div className="flex items-center justify-center gap-6 p-8 bg-blue-6">
      {/* Animated pulse (5s VP8) over the static fallback */}
      <PlayerBanner
        name=""
        avatarSrc=""
        invited
        invitedVideoSrc={INVITED_PULSE_SRC}
        invitedFallbackSrc={INVITED_STATIC_SRC}
      />
      {/* Subtler loop variant (3s VP9) */}
      <PlayerBanner
        name=""
        avatarSrc=""
        invited
        invitedVideoSrc={INVITED_LOOP_SRC}
        invitedFallbackSrc={INVITED_STATIC_SRC}
      />
      {/* No video supplied → static invited PNG only (also the reduced-motion look) */}
      <PlayerBanner
        name=""
        avatarSrc=""
        invited
        invitedFallbackSrc={INVITED_STATIC_SRC}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Each WingTier variant
// ---------------------------------------------------------------------------

export function PlayerBannerWingTiersDemo() {
  const tiers = ["default", "bronze", "gold", "teal", "green", "blue"] as const;
  return (
    <div className="flex flex-wrap items-end justify-center gap-3 p-8 bg-blue-6">
      {tiers.map((tier) => (
        <PlayerBanner
          key={tier}
          name={tier.toUpperCase()}
          title={`${tier} wings`}
          avatarSrc={AVATAR_1}
          wingTier={tier}
        >
          <RoleSlotRow slots={[{ role: "mid" }, {}]} iconSrcFor={roleIconSrc} />
        </PlayerBanner>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Long name truncation
// ---------------------------------------------------------------------------

export function PlayerBannerTruncationDemo() {
  return (
    <div className="flex items-end justify-center gap-4 p-8 bg-blue-6">
      <PlayerBanner
        name="AVeryLongSummonerNameThatShouldTruncate"
        title="The Champion of Champions of Champions"
        avatarSrc={AVATAR_2}
        wingTier="gold"
      />
      <PlayerBanner
        name="ShortName"
        avatarSrc={AVATAR_3}
        wingTier="teal"
        isSelf
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3-digit level badge — badge must grow, not clip
// ---------------------------------------------------------------------------

export function PlayerBannerLevelBadgeDemo() {
  return (
    <div className="flex items-end justify-center gap-4 p-8 bg-blue-6">
      <PlayerBanner
        name="LevelTest"
        avatarSrc={AVATAR_1}
        wingTier="gold"
        isSelf
        level={1}
      />
      <PlayerBanner
        name="LevelTest"
        avatarSrc={AVATAR_2}
        wingTier="gold"
        isSelf
        level={247}
      />
      <PlayerBanner
        name="LevelTest"
        avatarSrc={AVATAR_3}
        wingTier="gold"
        isSelf
        level={999}
      />
      <PlayerBanner
        name="NoLevel"
        avatarSrc={AVATAR_1}
        wingTier="teal"
        level={undefined}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Autofill chip only (non-self)
// ---------------------------------------------------------------------------

export function PlayerBannerAutofillDemo() {
  return (
    <div className="flex items-end justify-center gap-4 p-8 bg-blue-6">
      <PlayerBanner
        name="AutofillPlayer"
        title="Always Ready"
        avatarSrc={AVATAR_1}
        wingTier="default"
        autofillProtected
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Autofill pill UNDER the banner (#474) — "possible" (reference), "protected",
// and the reconciliation: autofillState wins over the deprecated inside-foot
// autofillProtected chip so only one indicator shows.
// ---------------------------------------------------------------------------

export function PlayerBannerAutofillPillDemo() {
  return (
    <div className="flex items-start justify-center gap-6 p-8 bg-blue-6">
      {/* Self rank-frame + "Autofill Possible" pill (the 2025 idle-lobby state) */}
      <PlayerBanner
        name="Matintosh"
        title="Final Boss Faker"
        isSelf
        crownChip
        avatarSrc={AVATAR_1}
        wingTier="blue"
        tierGem="challenger"
        regaliaSrc={regaliaBannerUrl("challenger")}
        backdropSrc={championSplashUrl("Ahri")}
        masteryCrests={[masteryCrestUrl(10), masteryCrestUrl(9), masteryCrestUrl(7)]}
        signature="Matintosh"
        autofillState="possible"
      />
      {/* Legacy V11 self flag + "Autofill Protected" pill */}
      <PlayerBanner
        name="Protected"
        title="Locked In"
        isSelf
        avatarSrc={AVATAR_2}
        wingTier="gold"
        // autofillProtected is set too, but autofillState supersedes it — the
        // inside-foot chip is suppressed so only the pill shows.
        autofillProtected
        autofillState="protected"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tier gem — all TierGem values on teammate banners
// ---------------------------------------------------------------------------

export function PlayerBannerTierGemDemo() {
  const CDRAGON_MINI =
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests";
  const tiers: TierGem[] = [
    "iron", "bronze", "silver", "gold",
    "platinum", "diamond", "master", "grandmaster", "challenger", "unranked",
  ];
  return (
    <div className="flex flex-wrap items-end justify-center gap-3 p-8 bg-blue-6">
      {tiers.map((tier) => (
        <PlayerBanner
          key={tier}
          name={tier.toUpperCase()}
          avatarSrc={AVATAR_1}
          wingTier="default"
          tierGem={tier}
        />
      ))}
      {/* Self variant with gold gem */}
      <PlayerBanner
        name="Self (Gold)"
        avatarSrc={AVATAR_1}
        wingTier="gold"
        isSelf
        tierGem="gold"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Badge slots — filled + empty combinations
// ---------------------------------------------------------------------------

export function PlayerBannerBadgeSlotsDemo() {
  const CDRAGON_MINI =
    "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/ranked-mini-crests";
  return (
    <div className="flex flex-wrap items-end justify-center gap-4 p-8 bg-blue-6">
      {/* All three filled */}
      <PlayerBanner
        name="AllFilled"
        title="Three badges"
        avatarSrc={AVATAR_1}
        wingTier="gold"
        isSelf
        tierGem="gold"
        badges={[
          { iconSrc: `${CDRAGON_MINI}/gold.png`, ringColor: "var(--color-gold-3)" },
          { iconSrc: `${CDRAGON_MINI}/diamond.png`, ringColor: "var(--color-blue-2)" },
          { iconSrc: `${CDRAGON_MINI}/challenger.png`, ringColor: "var(--color-gold-2)" },
        ]}
      />
      {/* Two filled, one empty */}
      <PlayerBanner
        name="TwoFilled"
        title="Two filled"
        avatarSrc={AVATAR_2}
        wingTier="teal"
        tierGem="platinum"
        badges={[
          { iconSrc: `${CDRAGON_MINI}/platinum.png`, ringColor: "var(--color-teal-ring)" },
          { iconSrc: `${CDRAGON_MINI}/gold.png`, ringColor: "var(--color-gold-3)" },
          undefined,
        ]}
      />
      {/* One filled, two empty */}
      <PlayerBanner
        name="OneFilled"
        title="One filled"
        avatarSrc={AVATAR_3}
        wingTier="green"
        tierGem="bronze"
        badges={[
          { iconSrc: `${CDRAGON_MINI}/bronze.png`, ringColor: "var(--color-gold-4)" },
          undefined,
          undefined,
        ]}
      />
      {/* All empty */}
      <PlayerBanner
        name="NoBadges"
        title="All empty"
        avatarSrc={AVATAR_1}
        wingTier="default"
        badges={[undefined, undefined, undefined]}
      />
      {/* No badges prop at all — legacy */}
      <PlayerBanner
        name="Legacy"
        title="No badges prop"
        avatarSrc={AVATAR_2}
        wingTier="blue"
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Banner sweep — one-shot entrance flourish (issue #329)
//
// The sweep plays ONCE on mount then unmounts to the static flag, so this demo
// remounts both banners via a changing `key` to replay it. Primary marks the
// self slot; ally marks the teammate. A third banner with no sweepVideoSrc shows
// the unchanged static baseline.
// ---------------------------------------------------------------------------

const SWEEP_PRIMARY_SRC = bannerSweepVideoUrl("primary");
const SWEEP_ALLY_SRC = bannerSweepVideoUrl("ally");

export function PlayerBannerSweepDemo() {
  const [replayKey, setReplayKey] = useState(0);
  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-blue-6">
      <button
        type="button"
        onClick={() => setReplayKey((k) => k + 1)}
        className="rounded-sm border border-gold-4 px-3 py-1 font-body text-xs uppercase tracking-wide text-gold-1 hover:bg-gold-5/30"
      >
        Replay sweep
      </button>
      <div className="flex items-end justify-center gap-6">
        {/* Self — primary sweep */}
        <PlayerBanner
          key={`self-${replayKey}`}
          name="TristanaPrey"
          avatarSrc={AVATAR_1}
          wingTier="gold"
          isSelf
          autofillProtected
          tierGem="gold"
          sweepVideoSrc={SWEEP_PRIMARY_SRC}
        >
          <RoleSlotRow slots={[{ role: "mid" }, { role: "support" }]} iconSrcFor={roleIconSrc} />
        </PlayerBanner>
        {/* Ally — ally sweep */}
        <PlayerBanner
          key={`ally-${replayKey}`}
          name="Teammate"
          avatarSrc={AVATAR_2}
          wingTier="teal"
          tierGem="platinum"
          sweepVideoSrc={SWEEP_ALLY_SRC}
        >
          <RoleSlotRow slots={[{ role: "jungle" }, { role: "top" }]} iconSrcFor={roleIconSrc} />
        </PlayerBanner>
        {/* No sweep — static baseline */}
        <PlayerBanner
          name="NoSweep"
          avatarSrc={AVATAR_3}
          wingTier="green"
          tierGem="diamond"
        >
          <RoleSlotRow slots={[{ role: "bottom" }, { role: "support" }]} iconSrcFor={roleIconSrc} />
        </PlayerBanner>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Queueing state — blue glow empty slots + self asterisk glyph (issue #174)
// ---------------------------------------------------------------------------

export function PlayerBannerQueueingDemo() {
  return (
    <div className="flex items-center justify-center gap-3 p-8 bg-hextech-black">
      <PlayerBanner name="" avatarSrc="" empty queueing />
      <PlayerBanner name="" avatarSrc="" empty queueing />
      <PlayerBanner
        name="TristanaPrey"
        avatarSrc={AVATAR_1}
        wingTier="gold"
        isSelf
        autofillProtected
        queueing
      >
        <RoleSlotRow
          slots={[{ role: "mid" }, { role: "support" }]}
          iconSrcFor={roleIconSrc}
        />
      </PlayerBanner>
      <PlayerBanner name="" avatarSrc="" empty queueing />
      <PlayerBanner name="" avatarSrc="" empty queueing />
    </div>
  );
}
