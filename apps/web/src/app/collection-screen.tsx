"use client";

import { useState } from "react";
import { SectionHeader, TabBar, ChampionCard } from "@low/ui";
import { demoChampions, loadingArtUrl } from "@low/fixtures";

const TABS = [
  { id: "champions", label: "Champions" },
  { id: "skins", label: "Skins" },
  { id: "emotes", label: "Emotes" },
];

export function CollectionScreen() {
  const [activeTab, setActiveTab] = useState("champions");

  return (
    <div className="flex h-full flex-col bg-hextech-black">
      {/* Header */}
      <div className="shrink-0 px-6 pt-6 pb-4">
        <SectionHeader
          size="md"
          align="left"
          eyebrow="CHOOSE YOUR"
          title="CHAMPION"
        />
      </div>

      {/* Tab bar */}
      <TabBar
        tabs={TABS}
        activeId={activeTab}
        onSelect={setActiveTab}
        label="Collection tabs"
      />

      {/* Scrollable content area */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-hextech-black">
        {activeTab === "champions" ? (
          <div className="grid grid-cols-5 gap-4 p-6">
            {demoChampions.map((c) => (
              <ChampionCard
                key={c.id}
                champion={c}
                artSrc={loadingArtUrl(c.id)}
                onSelect={(id) => console.log("selected", id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="font-body text-sm text-grey-2">Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
