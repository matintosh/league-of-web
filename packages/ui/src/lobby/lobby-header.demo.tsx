"use client";

import { useState } from "react";
import { LobbyHeader } from "./lobby-header";
import { gameModeMapUrl } from "@low/fixtures";

/** Default static state — party closed, with crest. */
export function LobbyHeaderDefaultDemo() {
  return (
    <div className="w-full max-w-xl bg-hextech-black">
      <LobbyHeader
        title="SR · Normal Draft"
        crestSrc={gameModeMapUrl("sr")}
        onBack={() => console.log("back")}
        onInfo={() => console.log("info")}
        partyOpen={false}
        onPartyToggle={() => {}}
      />
    </div>
  );
}

/** No crest variant. */
export function LobbyHeaderNoCrestDemo() {
  return (
    <div className="w-full max-w-xl bg-hextech-black">
      <LobbyHeader
        title="ARAM · Howling Abyss"
        onBack={() => console.log("back")}
        onInfo={() => console.log("info")}
        partyOpen={false}
        onPartyToggle={() => {}}
      />
    </div>
  );
}

/** Party-open state. */
export function LobbyHeaderPartyOpenDemo() {
  return (
    <div className="w-full max-w-xl bg-hextech-black">
      <LobbyHeader
        title="SR · Normal Draft"
        crestSrc={gameModeMapUrl("sr")}
        onBack={() => console.log("back")}
        onInfo={() => console.log("info")}
        partyOpen={true}
        onPartyToggle={() => {}}
      />
    </div>
  );
}

/** Interactive demo — pill toggle state is live. */
export function LobbyHeaderInteractiveDemo() {
  const [partyOpen, setPartyOpen] = useState(false);
  return (
    <div className="w-full max-w-xl bg-hextech-black">
      <LobbyHeader
        title="SR · Normal Draft"
        crestSrc={gameModeMapUrl("sr")}
        onBack={() => console.log("back")}
        onInfo={() => console.log("info")}
        partyOpen={partyOpen}
        onPartyToggle={setPartyOpen}
      />
    </div>
  );
}

/** Long title truncation demo. */
export function LobbyHeaderLongTitleDemo() {
  return (
    <div className="w-[320px] bg-hextech-black">
      <LobbyHeader
        title="Summoner's Rift · Ultimate Spellbook — Season 2026 Special Edition"
        crestSrc={gameModeMapUrl("sr")}
        onBack={() => console.log("back")}
        onInfo={() => console.log("info")}
        partyOpen={false}
        onPartyToggle={() => {}}
      />
    </div>
  );
}

/** Segmented title with Change Mode button. */
export function LobbyHeaderSegmentedDemo() {
  return (
    <div className="w-full max-w-xl bg-hextech-black">
      <LobbyHeader
        title="Summoner's Rift · Normal"
        segments={["Intro", "Blind", "Summoner's Rift 5v5"]}
        queueCount={30}
        crestSrc={gameModeMapUrl("sr")}
        onBack={() => console.log("back")}
        onInfo={() => console.log("info")}
        onChangeMode={() => console.log("change mode")}
        partyOpen={false}
        onPartyToggle={() => {}}
      />
    </div>
  );
}

/** Segmented title — no Change Mode button. */
export function LobbyHeaderSegmentsNoCMDemo() {
  return (
    <div className="w-full max-w-xl bg-hextech-black">
      <LobbyHeader
        title="Summoner's Rift · Normal"
        segments={["Blind", "Summoner's Rift 5v5"]}
        crestSrc={gameModeMapUrl("sr")}
        onBack={() => console.log("back")}
        partyOpen={false}
        onPartyToggle={() => {}}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 2025 redesign demos — supply `breadcrumb` to switch to the new look.
// ---------------------------------------------------------------------------

/** 2025 default — middot breadcrumb, mode gem, copy/stats icons, green toggle pair. */
export function LobbyHeader2025DefaultDemo() {
  return (
    <div className="w-full max-w-2xl bg-hextech-black">
      <LobbyHeader
        title="SR · Ranked Solo/Duo · Draft"
        breadcrumb={["SR", "RANKED SOLO/DUO", "DRAFT"]}
        crestSrc={gameModeMapUrl("sr")}
        onBack={() => console.log("back")}
        onInfo={() => console.log("info")}
        onCopyInvite={() => console.log("copy invite")}
        onStats={() => console.log("stats")}
        partyOpen={false}
        onPartyToggle={() => {}}
        invitePermission={false}
        onInvitePermissionToggle={() => {}}
      />
    </div>
  );
}

/** 2025 — party-privacy half on (green check). */
export function LobbyHeader2025PartyOpenDemo() {
  return (
    <div className="w-full max-w-2xl bg-hextech-black">
      <LobbyHeader
        title="SR · Ranked Solo/Duo · Draft"
        breadcrumb={["SR", "RANKED SOLO/DUO", "DRAFT"]}
        crestSrc={gameModeMapUrl("sr")}
        onBack={() => console.log("back")}
        onInfo={() => console.log("info")}
        onCopyInvite={() => console.log("copy invite")}
        onStats={() => console.log("stats")}
        partyOpen={true}
        onPartyToggle={() => {}}
        invitePermission={false}
        onInvitePermissionToggle={() => {}}
      />
    </div>
  );
}

/** 2025 — invite-permission half on (green person). */
export function LobbyHeader2025InvitePermissionDemo() {
  return (
    <div className="w-full max-w-2xl bg-hextech-black">
      <LobbyHeader
        title="SR · Ranked Solo/Duo · Draft"
        breadcrumb={["SR", "RANKED SOLO/DUO", "DRAFT"]}
        crestSrc={gameModeMapUrl("sr")}
        onBack={() => console.log("back")}
        onInfo={() => console.log("info")}
        onCopyInvite={() => console.log("copy invite")}
        onStats={() => console.log("stats")}
        partyOpen={true}
        onPartyToggle={() => {}}
        invitePermission={true}
        onInvitePermissionToggle={() => {}}
      />
    </div>
  );
}

/** 2025 interactive — both green toggle halves live. */
export function LobbyHeader2025InteractiveDemo() {
  const [partyOpen, setPartyOpen] = useState(false);
  const [invitePermission, setInvitePermission] = useState(false);
  return (
    <div className="w-full max-w-2xl bg-hextech-black">
      <LobbyHeader
        title="SR · Ranked Solo/Duo · Draft"
        breadcrumb={["SR", "RANKED SOLO/DUO", "DRAFT"]}
        crestSrc={gameModeMapUrl("sr")}
        onBack={() => console.log("back")}
        onInfo={() => console.log("info")}
        onCopyInvite={() => console.log("copy invite")}
        onStats={() => console.log("stats")}
        partyOpen={partyOpen}
        onPartyToggle={setPartyOpen}
        invitePermission={invitePermission}
        onInvitePermissionToggle={setInvitePermission}
      />
    </div>
  );
}

/** 2025 long breadcrumb — truncation of the middle segment. */
export function LobbyHeader2025LongDemo() {
  return (
    <div className="w-[380px] bg-hextech-black">
      <LobbyHeader
        title="SR · Ranked Solo/Duo · Draft"
        breadcrumb={[
          "SR",
          "RANKED SOLO/DUO — SEASON 2026 SPECIAL EDITION QUEUE",
          "DRAFT",
        ]}
        crestSrc={gameModeMapUrl("sr")}
        onBack={() => console.log("back")}
        onInfo={() => console.log("info")}
        onCopyInvite={() => console.log("copy invite")}
        onStats={() => console.log("stats")}
        partyOpen={false}
        onPartyToggle={() => {}}
        invitePermission={false}
        onInvitePermissionToggle={() => {}}
      />
    </div>
  );
}
