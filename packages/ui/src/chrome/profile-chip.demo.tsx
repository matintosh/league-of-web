"use client";

import { ProfileChip } from "./profile-chip";
import {
  demoSummoner,
  demoFriends,
  profileIconUrl,
  notificationBellUrl,
  avatarBorderUrl,
} from "@low/fixtures";
import type { Summoner } from "@low/fixtures";

// Real-client notification bell glyph (#399) — resolved once, passed to the
// navband chips (the current-era chip that owns the bell). CSS mask-image tints
// it to the button's token color so it keeps the grey-1 → gold-1 hover.
const BELL_SRC = notificationBellUrl();

// Real-client themed-border avatar frame (#489) — theme-3 (gold ring + cyan
// accents + gold-framed level-plate), the closest match to the current-era nav
// reference. Passed to the navband + rail-with-frame demos below.
const BORDER_SRC = avatarBorderUrl(3);

// Showcase helpers — derive availability-variant summoners from fixtures
const awayFriend   = demoFriends[2]!; // Baus — away
const inGameFriend = demoFriends[0]!; // Faker — in-game
const offlineSummoner: Summoner = {
  ...demoSummoner,
  availability: "offline",
};
const longNameSummoner: Summoner = {
  ...demoSummoner,
  gameName: "VeryLongSummonerNameThatOverflows",
  availability: "online",
};

export function ProfileChipOnlineDemo() {
  return (
    <div className="w-[200px]">
      <ProfileChip
        summoner={demoSummoner}
        level={demoSummoner.level}
        profileIconSrc={profileIconUrl(demoSummoner.profileIconId)}
        onNotifications={() => console.log("notifications")}
      />
    </div>
  );
}

export function ProfileChipAwayDemo() {
  return (
    <div className="w-[200px]">
      <ProfileChip
        summoner={awayFriend.summoner}
        level={awayFriend.summoner.level}
        profileIconSrc={profileIconUrl(awayFriend.summoner.profileIconId)}
        onNotifications={() => console.log("notifications")}
      />
    </div>
  );
}

export function ProfileChipInGameDemo() {
  return (
    <div className="w-[200px]">
      <ProfileChip
        summoner={inGameFriend.summoner}
        level={inGameFriend.summoner.level}
        profileIconSrc={profileIconUrl(inGameFriend.summoner.profileIconId)}
        onNotifications={() => console.log("notifications")}
      />
    </div>
  );
}

export function ProfileChipOfflineDemo() {
  return (
    <div className="w-[200px]">
      <ProfileChip
        summoner={offlineSummoner}
        level={offlineSummoner.level}
        profileIconSrc={profileIconUrl(offlineSummoner.profileIconId)}
        onNotifications={() => console.log("notifications")}
      />
    </div>
  );
}

export function ProfileChipLongNameDemo() {
  return (
    <div className="w-[200px]">
      <ProfileChip
        summoner={longNameSummoner}
        level={longNameSummoner.level}
        profileIconSrc={profileIconUrl(longNameSummoner.profileIconId)}
        onNotifications={() => console.log("notifications")}
      />
    </div>
  );
}

export function ProfileChipStatusTextDemo() {
  return (
    <div className="w-[200px]">
      <ProfileChip
        summoner={demoSummoner}
        level={demoSummoner.level}
        profileIconSrc={profileIconUrl(demoSummoner.profileIconId)}
        onNotifications={() => console.log("notifications")}
        statusText="Creating Ranked Solo/Duo Game..."
      />
    </div>
  );
}

export function ProfileChipRailBorderDemo() {
  return (
    <div className="w-[200px]">
      <ProfileChip
        summoner={demoSummoner}
        level={demoSummoner.level}
        profileIconSrc={profileIconUrl(demoSummoner.profileIconId)}
        avatarBorderSrc={BORDER_SRC}
        onNotifications={() => console.log("notifications")}
      />
    </div>
  );
}

// ── navband variant — the current-era compact chip in the TopNavbar band ──
// Rendered over bg-blue-7 to mimic the nav band it lives in.

export function ProfileChipNavbandDemo() {
  return (
    <div className="flex justify-end bg-blue-7 px-4 py-2">
      <ProfileChip
        variant="navband"
        summoner={demoSummoner}
        level={demoSummoner.level}
        profileIconSrc={profileIconUrl(demoSummoner.profileIconId)}
        avatarBorderSrc={BORDER_SRC}
        notificationBellSrc={BELL_SRC}
        onNotifications={() => console.log("notifications")}
        onOpenProfile={() => console.log("open profile")}
      />
    </div>
  );
}

export function ProfileChipNavbandInGameDemo() {
  return (
    <div className="flex justify-end bg-blue-7 px-4 py-2">
      <ProfileChip
        variant="navband"
        summoner={inGameFriend.summoner}
        level={inGameFriend.summoner.level}
        profileIconSrc={profileIconUrl(inGameFriend.summoner.profileIconId)}
        avatarBorderSrc={BORDER_SRC}
        notificationBellSrc={BELL_SRC}
        onNotifications={() => console.log("notifications")}
      />
    </div>
  );
}

export function ProfileChipNavbandStatusTextDemo() {
  return (
    <div className="flex justify-end bg-blue-7 px-4 py-2">
      <ProfileChip
        variant="navband"
        summoner={demoSummoner}
        level={demoSummoner.level}
        profileIconSrc={profileIconUrl(demoSummoner.profileIconId)}
        avatarBorderSrc={BORDER_SRC}
        notificationBellSrc={BELL_SRC}
        onNotifications={() => console.log("notifications")}
        statusText="In Queue"
      />
    </div>
  );
}
