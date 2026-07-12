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
// Full party — all five banners (self center + 4 teammates)
// ---------------------------------------------------------------------------

export function PlayerBannerFullPartyDemo() {
  return (
    <div className="flex items-center justify-center gap-2 p-8 bg-blue-6">
      <PlayerBanner
        name="JinxFan99"
        title="The Loose Cannon"
        avatarSrc={AVATAR_3}
        wingTier="teal"
      >
        <RoleSlotRow slots={[{ role: "top" }, { role: "jungle" }]} iconSrcFor={roleIconSrc} />
      </PlayerBanner>

      <PlayerBanner
        name="VioletStorm"
        title="Tempest"
        avatarSrc={AVATAR_2}
        wingTier="green"
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
      >
        <RoleSlotRow slots={[{ role: "mid" }, { role: "support" }]} iconSrcFor={roleIconSrc} />
      </PlayerBanner>

      <PlayerBanner
        name="DragonMaster"
        title="Fire Dancer"
        avatarSrc={AVATAR_2}
        wingTier="blue"
      >
        <RoleSlotRow slots={[{ role: "bottom" }, { role: "support" }]} iconSrcFor={roleIconSrc} />
      </PlayerBanner>

      <PlayerBanner
        name="SoloBrave"
        title=""
        avatarSrc={AVATAR_3}
        wingTier="bronze"
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
