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
