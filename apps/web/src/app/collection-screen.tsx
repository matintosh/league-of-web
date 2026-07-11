"use client";

import { useState, useMemo } from "react";
import {
  SectionHeader,
  TabBar,
  ChampionCard,
  StatMedallion,
  SearchInput,
  HextechCheckbox,
  HextechSelect,
  SkinCard,
} from "@low/ui";
import { demoChampions, demoSkins, loadingArtUrl } from "@low/fixtures";
import type { SelectOption } from "@low/ui";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TABS = [
  { id: "champions", label: "Champions" },
  { id: "skins", label: "Skins" },
  { id: "emotes", label: "Emotes" },
];

const SORT_OPTIONS: SelectOption[] = [
  { value: "mastery", label: "Mastery" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
];

// ---------------------------------------------------------------------------
// Skins tab
// ---------------------------------------------------------------------------

interface SkinsTabProps {
  search: string;
  onSearchChange: (v: string) => void;
  showUnowned: boolean;
  onShowUnownedChange: (v: boolean) => void;
  championFilter: string;
  onChampionFilterChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
}

function SkinsTab({
  search,
  onSearchChange,
  showUnowned,
  onShowUnownedChange,
  championFilter,
  onChampionFilterChange,
  sort,
  onSortChange,
}: SkinsTabProps) {
  // Build champion filter options from demoSkins entries
  const championOptions: SelectOption[] = useMemo(
    () =>
      [
        // Enabled "all" entry — the disabled placeholder can't be re-selected,
        // so this is the only way back to the unfiltered view.
        { value: "all", label: "All Champions" },
        ...Object.entries(demoSkins).map(([id, { championName }]) => ({
          value: id,
          label: championName,
        })),
      ],
    []
  );

  // Total owned skins across all champions
  const totalOwned = useMemo(
    () =>
      Object.values(demoSkins).reduce(
        (sum, group) => sum + group.skins.filter((s) => s.owned).length,
        0
      ),
    []
  );

  // Filtered and sorted champion groups
  const groups = useMemo(() => {
    const query = search.trim().toLowerCase();

    let entries = Object.entries(demoSkins);

    // Champion filter dropdown
    if (championFilter && championFilter !== "all") {
      entries = entries.filter(([id]) => id === championFilter);
    }

    // Sort champion groups
    if (sort === "name-asc") {
      entries = [...entries].sort(([, a], [, b]) =>
        a.championName.localeCompare(b.championName)
      );
    } else if (sort === "name-desc") {
      entries = [...entries].sort(([, a], [, b]) =>
        b.championName.localeCompare(a.championName)
      );
    }
    // mastery = natural fixture order (default)

    return entries
      .map(([id, { championName, skins }]) => {
        let filtered = skins;

        // "Show Unowned" checkbox: when unchecked, hide unowned skins
        if (!showUnowned) {
          filtered = filtered.filter((s) => s.owned);
        }

        // Search: match skin name or champion name
        if (query) {
          filtered = filtered.filter(
            (s) =>
              s.name.toLowerCase().includes(query) ||
              championName.toLowerCase().includes(query)
          );
        }

        return { id, championName, skins: filtered, totalSkins: skins.length };
      })
      .filter(({ skins }) => skins.length > 0);
  }, [search, showUnowned, championFilter, sort]);

  const ownedCountForChampion = (id: string) =>
    demoSkins[id]?.skins.filter((s) => s.owned).length ?? 0;

  return (
    <div className="flex h-full min-h-0">
      {/* ------------------------------------------------------------------ */}
      {/* Left sidebar                                                        */}
      {/* ------------------------------------------------------------------ */}
      <aside className="flex w-[220px] shrink-0 flex-col items-center gap-4 border-r border-grey-3 bg-hextech-black px-4 py-6">
        {/* Owned skins stat */}
        <StatMedallion value={totalOwned} caption="Total skins owned" />

        {/* Search */}
        <div className="w-full">
          <SearchInput
            ariaLabel="Search skins"
            value={search}
            onChange={onSearchChange}
            placeholder="Search"
          />
        </div>

        {/* Show Unowned checkbox */}
        <div className="w-full">
          <HextechCheckbox
            checked={showUnowned}
            onChange={onShowUnownedChange}
            label="Show Unowned"
          />
        </div>

        {/* Champion filter */}
        <div className="w-full">
          <HextechSelect
            ariaLabel="Filter by champion"
            value={championFilter}
            onChange={onChampionFilterChange}
            options={championOptions}
            placeholder="Champion"
          />
        </div>

        {/* Sort select */}
        <div className="w-full">
          <HextechSelect
            ariaLabel="Sort skins"
            value={sort}
            onChange={onSortChange}
            options={SORT_OPTIONS}
            placeholder="Mastery"
          />
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Right scrollable grid area                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 overflow-y-auto bg-hextech-black">
        {groups.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="font-body text-sm text-grey-2">No skins found</p>
          </div>
        ) : (
          <div className="px-6 py-4 space-y-8">
            {groups.map(({ id, championName, skins, totalSkins }) => (
              <section key={id}>
                {/* Champion group header */}
                <div className="mb-3 flex items-baseline gap-3">
                  <span className="font-display text-sm uppercase tracking-wider text-gold-1">
                    {championName}
                  </span>
                  <span className="font-body text-sm text-grey-1">
                    {ownedCountForChampion(id)}/{totalSkins}
                  </span>
                </div>

                {/* Skin card row — wraps to multiple rows if needed */}
                <div className="flex flex-wrap gap-4">
                  {skins.map((skin) => (
                    <SkinCard
                      key={skin.skinIndex}
                      name={skin.name}
                      imageSrc={loadingArtUrl(id, skin.skinIndex)}
                      owned={skin.owned}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CollectionScreen
// ---------------------------------------------------------------------------

export function CollectionScreen() {
  const [activeTab, setActiveTab] = useState("champions");

  // Skins tab state — hoisted here so state survives tab switches
  const [skinSearch, setSkinSearch] = useState("");
  const [showUnowned, setShowUnowned] = useState(true);
  const [championFilter, setChampionFilter] = useState("");
  const [sort, setSort] = useState("");

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

      {/* Content area — min-h-0 so flex children can scroll inside fixed window */}
      <div className="relative flex-1 min-h-0">
        {/* Subtle top vignette */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-12"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-hextech-black) 0%, transparent 100%)",
          }}
        />

        {activeTab === "champions" && (
          <div className="h-full overflow-y-auto bg-hextech-black">
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
          </div>
        )}

        {activeTab === "skins" && (
          <div className="h-full min-h-0 flex">
            <SkinsTab
              search={skinSearch}
              onSearchChange={setSkinSearch}
              showUnowned={showUnowned}
              onShowUnownedChange={setShowUnowned}
              championFilter={championFilter}
              onChampionFilterChange={setChampionFilter}
              sort={sort}
              onSortChange={setSort}
            />
          </div>
        )}

        {activeTab !== "champions" && activeTab !== "skins" && (
          <div className="flex h-full items-center justify-center">
            <p className="font-body text-sm text-grey-2">Coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
