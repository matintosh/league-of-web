"use client";

import { useState } from "react";
import { SpellsTab } from "./spells-tab";
import { SUMMONER_SPELLS } from "@low/fixtures";

/** Default demo — Teleport selected (matches reference screenshot) */
export function SpellsTabDefaultDemo() {
  const [selectedSpellId, setSelectedSpellId] = useState("SummonerTeleport");

  return (
    <div className="h-[500px] bg-hextech-black">
      <SpellsTab
        spells={SUMMONER_SPELLS}
        selectedSpellId={selectedSpellId}
        onSelectSpell={setSelectedSpellId}
      />
    </div>
  );
}

/** Flash-selected demo — a different selection pre-set for variant coverage */
export function SpellsTabFlashSelectedDemo() {
  const [selectedSpellId, setSelectedSpellId] = useState("SummonerFlash");

  return (
    <div className="h-[500px] bg-hextech-black">
      <SpellsTab
        spells={SUMMONER_SPELLS}
        selectedSpellId={selectedSpellId}
        onSelectSpell={setSelectedSpellId}
      />
    </div>
  );
}

/** No-preview-art demo — all spells have no previewSrc, exercising the fallback bg-blue-8 */
export function SpellsTabNoPreviewDemo() {
  const [selectedSpellId, setSelectedSpellId] = useState("SummonerFlash");

  const spellsNoPreview = SUMMONER_SPELLS.map(({ previewSrc: _p, ...s }) => s);

  return (
    <div className="h-[500px] bg-hextech-black">
      <SpellsTab
        spells={spellsNoPreview}
        selectedSpellId={selectedSpellId}
        onSelectSpell={setSelectedSpellId}
      />
    </div>
  );
}
