"use client";

import { useState } from "react";
import { PlayerBanner } from "./player-banner";
import { RoleSlotRow } from "./role-slot-row";
import { profileIconUrl } from "@low/fixtures";

// Stable profile icon URLs for demos
const AVATAR_1 = profileIconUrl(1);
const AVATAR_2 = profileIconUrl(29);
const AVATAR_3 = profileIconUrl(550);

// CommunityDragon role slug mapping (mirror role-selector.demo.tsx)
import type { Role } from "./role-selector";
import type { TierGem } from "./player-banner";
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
