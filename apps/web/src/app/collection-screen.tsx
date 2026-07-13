"use client";

import { useState, useMemo } from "react";
import {
  SectionHeader,
  TabBar,
  ChampionCard,
  ChampionDetail,
  StatMedallion,
  SearchInput,
  HextechCheckbox,
  HextechSelect,
  HextechButton,
  SkinCard,
  SkinPreview,
  EmoteTile,
  EmoteWheel,
  RunesScreen,
  SpellsTab,
} from "@low/ui";
import type { RunePage } from "@low/ui";
import {
  demoChampions,
  demoSkins,
  demoChromas,
  demoEmotes,
  demoRunePages,
  defaultEmoteSlots,
  loadingArtUrl,
  championSplashUrl,
  warwickDetail,
  RUNE_PATHS,
  SUMMONER_SPELLS,
} from "@low/fixtures";
import type { SelectOption, TierEntry } from "@low/ui";
import type { SlotId } from "@low/fixtures";

// ---------------------------------------------------------------------------
// Skin-tier breakdown fixture data — CDragon assets, counts fixed at zero
// (placeholder; a real client would derive from the player's skin inventory).
// ---------------------------------------------------------------------------

const CDRAGON_GEMS =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/rarity-gem-icons";
const CDRAGON_SKINS_VIEWER =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-collections/global/default/images/skins-viewer";
const CDRAGON_GEMS_COLS =
  "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-collections/global/default/images/gems";

const SKIN_TIER_BREAKDOWN: TierEntry[][] = [
  // Row A — 4 gem icons (Legendary, Epic, Rare/Legacy, Mythic)
  [
    { label: "Legendary", count: 0, iconSrc: `${CDRAGON_GEMS}/legendary.png` },
    { label: "Epic",      count: 0, iconSrc: `${CDRAGON_GEMS}/epic.png` },
    { label: "Rare",      count: 0, iconSrc: `${CDRAGON_GEMS_COLS}/rare.png` },
    { label: "Mythic",    count: 0, iconSrc: `${CDRAGON_GEMS}/mythic.png` },
  ],
  // Row B — 2 special-currency icons (ward skin token, chroma token)
  [
    { label: "Ward Skins",    count: 2, iconSrc: `${CDRAGON_SKINS_VIEWER}/icon-legacy.png` },
    { label: "Chroma Tokens", count: 0, iconSrc: `${CDRAGON_SKINS_VIEWER}/icon-chroma.png` },
  ],
];

// ---------------------------------------------------------------------------
// Sub-nav tab definitions.
// Champions + Skins are live; Chromas goes live here (#143).
// Emotes/Runes/Spells/Items/Icons/Wards are dead (aria-disabled).
// Emotes activates in its own issue (#144).
// ---------------------------------------------------------------------------

const TABS = [
  { id: "champions", label: "Champions", live: true },
  { id: "skins",     label: "Skins",     live: true },
  { id: "emotes",    label: "Emotes",    live: true },
  { id: "runes",     label: "Runes",     live: true },
  { id: "spells",    label: "Spells",    live: true },
  { id: "items",     label: "Items",     live: false },
  { id: "icons",     label: "Icons",     live: false },
  { id: "wards",     label: "Wards",     live: false },
  { id: "chromas",   label: "Chromas",   live: true },
];

const SORT_OPTIONS: SelectOption[] = [
  { value: "mastery",   label: "Mastery" },
  { value: "name-asc",  label: "Name (A–Z)" },
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
  /** Called when the user clicks a skin card to open the detail overlay. */
  onSkinSelect?: (champId: string, skinIndex: number) => void;
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
  onSkinSelect,
}: SkinsTabProps) {
  const championOptions: SelectOption[] = useMemo(
    () => [
      { value: "all", label: "All Champions" },
      ...Object.entries(demoSkins).map(([id, { championName }]) => ({
        value: id,
        label: championName,
      })),
    ],
    []
  );

  const totalOwned = useMemo(
    () =>
      Object.values(demoSkins).reduce(
        (sum, group) => sum + group.skins.filter((s) => s.owned).length,
        0
      ),
    []
  );

  const groups = useMemo(() => {
    const query = search.trim().toLowerCase();
    let entries = Object.entries(demoSkins);

    if (championFilter && championFilter !== "all") {
      entries = entries.filter(([id]) => id === championFilter);
    }

    if (sort === "name-asc") {
      entries = [...entries].sort(([, a], [, b]) =>
        a.championName.localeCompare(b.championName)
      );
    } else if (sort === "name-desc") {
      entries = [...entries].sort(([, a], [, b]) =>
        b.championName.localeCompare(a.championName)
      );
    }

    return entries
      .map(([id, { championName, skins }]) => {
        let filtered = skins;
        if (!showUnowned) filtered = filtered.filter((s) => s.owned);
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
      <aside className="flex w-[220px] shrink-0 flex-col items-center gap-4 border-r border-grey-3 bg-hextech-black px-4 py-6">
        <StatMedallion
          value={totalOwned}
          caption="Total skins owned"
          tierBreakdown={SKIN_TIER_BREAKDOWN}
        />
        <div className="w-full">
          <SearchInput
            ariaLabel="Search skins"
            value={search}
            onChange={onSearchChange}
            placeholder="Search"
          />
        </div>
        <div className="w-full">
          <HextechCheckbox
            checked={showUnowned}
            onChange={onShowUnownedChange}
            label="Show Unowned"
          />
        </div>
        <div className="w-full">
          <HextechSelect
            ariaLabel="Filter by champion"
            value={championFilter}
            onChange={onChampionFilterChange}
            options={championOptions}
            placeholder="Champion"
          />
        </div>
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

      <div className="flex-1 overflow-y-auto bg-hextech-black">
        {groups.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="font-body text-sm text-grey-2">No skins found</p>
          </div>
        ) : (
          <div className="px-6 py-4 space-y-8">
            {groups.map(({ id, championName, skins, totalSkins }) => (
              <section key={id}>
                <div className="mb-3 flex items-baseline gap-3">
                  <span className="font-display text-sm uppercase tracking-wider text-gold-1">
                    {championName}
                  </span>
                  <span className="font-body text-sm text-grey-1">
                    {ownedCountForChampion(id)}/{totalSkins}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {skins.map((skin) => (
                    <SkinCard
                      key={skin.skinIndex}
                      name={skin.name}
                      imageSrc={loadingArtUrl(id, skin.skinIndex)}
                      owned={skin.owned}
                      onSelect={
                        onSkinSelect
                          ? () => onSkinSelect(id, skin.skinIndex)
                          : undefined
                      }
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
// ChromaCard — page-level markup, ~200×170px dark tile.
//
// ASSET DIVERGENCE (documented per issue): DDragon v16.13.1 has no chroma
// render images. v1 uses the base skin's loadingArtUrl dimmed (brightness-50)
// as tile background, plus colored circle dots from fixture `palette` data
// to identify variants visually. A diamond lock badge marks unowned chromas,
// mirroring SkinCard's lock pattern. The `palette` hex values are DATA (the
// actual chroma colors from Riot's palette system), not style tokens — stored
// in fixtures (allowed per issue decision), never hardcoded in components.
// ---------------------------------------------------------------------------

interface ChromaCardProps {
  name: string;
  imageSrc: string;
  owned: boolean;
  /** Palette hex strings from fixture data — Riot chroma colors, not style tokens. */
  palette: string[];
}

function ChromaCard({ name, imageSrc, owned, palette }: ChromaCardProps) {
  return (
    <div
      aria-label={name}
      className="relative flex flex-col border border-grey-3 bg-hextech-black overflow-hidden"
      style={{ width: 200, height: 170 }}
    >
      {/* Dimmed base-skin loading art (asset-divergence: no chroma CDN images) */}
      <img
        src={imageSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover brightness-50"
        style={{ objectPosition: "50% 15%" }}
      />

      {/* Fixture palette as color-dot strip — chroma visual identifier */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-1.5">
        {palette.map((hex, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="block rounded-full border border-white/20"
            style={{ width: 10, height: 10, backgroundColor: hex }}
          />
        ))}
      </div>

      {/* Diamond lock badge for unowned — mirrors SkinCard lock pattern */}
      {!owned && (
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 pointer-events-none">
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <rect
              x="4" y="4" width="14" height="14"
              fill="none"
              stroke="var(--color-gold-3)"
              strokeWidth="1.5"
              transform="rotate(45, 11, 11)"
            />
            <rect x="8" y="12" width="6" height="4" rx="0.5" fill="var(--color-gold-3)" />
            <path d="M9 12 V10 A2 2 0 0 1 13 10 V12" fill="none" stroke="var(--color-gold-3)" strokeWidth="1.2" />
          </svg>
          <span className="sr-only">not owned</span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chromas tab
// ---------------------------------------------------------------------------

interface ChromasTabProps {
  search: string;
  onSearchChange: (v: string) => void;
  showUnowned: boolean;
  onShowUnownedChange: (v: boolean) => void;
  showUnavailable: boolean;
  onShowUnavailableChange: (v: boolean) => void;
  championFilter: string;
  onChampionFilterChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
}

function ChromasTab({
  search,
  onSearchChange,
  showUnowned,
  onShowUnownedChange,
  showUnavailable,
  onShowUnavailableChange,
  championFilter,
  onChampionFilterChange,
  sort,
  onSortChange,
}: ChromasTabProps) {
  const championOptions: SelectOption[] = useMemo(
    () => [
      { value: "all", label: "All Champions" },
      ...demoChromas.map((g) => ({
        value: g.championId,
        label: g.championName,
      })),
    ],
    []
  );

  const totalOwned = useMemo(
    () =>
      demoChromas.reduce(
        (sum, g) =>
          sum +
          g.skinLines.reduce(
            (s2, sl) => s2 + sl.chromas.filter((c) => c.owned).length,
            0
          ),
        0
      ),
    []
  );

  // Total chromas available (all, unfiltered) — for counter display
  const totalAvailable = useMemo(
    () =>
      demoChromas.reduce(
        (sum, g) =>
          sum + g.skinLines.reduce((s2, sl) => s2 + sl.chromas.length, 0),
        0
      ),
    []
  );

  // Per-champion owned/total — computed from full (unfiltered) demoChromas
  const champStats = useMemo(
    () =>
      Object.fromEntries(
        demoChromas.map((g) => {
          const total = g.skinLines.reduce((s, sl) => s + sl.chromas.length, 0);
          const owned = g.skinLines.reduce(
            (s, sl) => s + sl.chromas.filter((c) => c.owned).length,
            0
          );
          return [g.championId, { total, owned }];
        })
      ),
    []
  );

  // Per skin-line total — from full fixture (not post-filter) for accurate x/y
  const skinLineTotals = useMemo(() => {
    const map: Record<string, number> = {};
    for (const g of demoChromas) {
      for (const sl of g.skinLines) {
        map[sl.skinLineName] = sl.chromas.length;
      }
    }
    return map;
  }, []);

  // Per skin-line owned — also from the full fixture, so the "x/y" header
  // stays accurate while search/toggles narrow the visible cards (mirrors
  // champStats; counting the filtered array would undercount during search).
  const skinLineOwned = useMemo(() => {
    const map: Record<string, number> = {};
    for (const g of demoChromas) {
      for (const sl of g.skinLines) {
        map[sl.skinLineName] = sl.chromas.filter((c) => c.owned).length;
      }
    }
    return map;
  }, []);

  const groups = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = [...demoChromas];

    if (championFilter && championFilter !== "all") {
      list = list.filter((g) => g.championId === championFilter);
    }

    if (sort === "name-asc") {
      list = [...list].sort((a, b) =>
        a.championName.localeCompare(b.championName)
      );
    } else if (sort === "name-desc") {
      list = [...list].sort((a, b) =>
        b.championName.localeCompare(a.championName)
      );
    }

    return list
      .map((g) => {
        const skinLines = g.skinLines
          .map((sl) => {
            let chromas = sl.chromas;
            if (!showUnowned) chromas = chromas.filter((c) => c.owned);
            if (!showUnavailable)
              chromas = chromas.filter((c) => c.available !== false);
            if (query) {
              chromas = chromas.filter(
                (c) =>
                  c.name.toLowerCase().includes(query) ||
                  sl.skinLineName.toLowerCase().includes(query) ||
                  g.championName.toLowerCase().includes(query)
              );
            }
            return { ...sl, chromas };
          })
          .filter((sl) => sl.chromas.length > 0);

        return { ...g, skinLines };
      })
      .filter((g) => g.skinLines.length > 0);
  }, [search, showUnowned, showUnavailable, championFilter, sort]);

  return (
    <div className="flex h-full min-h-0">
      {/* ------------------------------------------------------------------ */}
      {/* Left sidebar                                                        */}
      {/* ------------------------------------------------------------------ */}
      <aside className="flex w-[220px] shrink-0 flex-col items-center gap-4 border-r border-grey-3 bg-hextech-black px-4 py-6">
        <StatMedallion value={totalOwned} caption="Total chromas owned" />

        {/* Mini counter block — owned + available tallies.
            Dot glyphs approximate the Hextech currency icons (teal/blue)
            shown in the reference; no CDN chroma-token icons available. */}
        <div className="w-full flex flex-col gap-1.5 px-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {/* Teal dot — owned chroma indicator (approximates green Chroma token icon) */}
              <span
                aria-hidden="true"
                className="block w-2.5 h-2.5 rounded-full shrink-0 bg-blue-2"
              />
              <span className="font-body text-xs text-grey-1">Owned</span>
            </div>
            <span className="font-body text-xs text-gold-2">{totalOwned}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {/* Blue dot — available chroma indicator (approximates blue Essence icon) */}
              <span
                aria-hidden="true"
                className="block w-2.5 h-2.5 rounded-full shrink-0 bg-blue-3"
              />
              <span className="font-body text-xs text-grey-1">Available</span>
            </div>
            <span className="font-body text-xs text-gold-2">{totalAvailable}</span>
          </div>
        </div>

        <div className="w-full">
          <SearchInput
            ariaLabel="Search chromas"
            value={search}
            onChange={onSearchChange}
            placeholder="Search"
          />
        </div>

        <div className="w-full">
          <HextechCheckbox
            checked={showUnowned}
            onChange={onShowUnownedChange}
            label="Show Unowned"
          />
        </div>

        <div className="w-full">
          <HextechCheckbox
            checked={showUnavailable}
            onChange={onShowUnavailableChange}
            label="Show Unavailable"
          />
        </div>

        <div className="w-full">
          <HextechSelect
            ariaLabel="Filter by champion"
            value={championFilter}
            onChange={onChampionFilterChange}
            options={championOptions}
            placeholder="Champion"
          />
        </div>

        <div className="w-full">
          <HextechSelect
            ariaLabel="Sort chromas"
            value={sort}
            onChange={onSortChange}
            options={SORT_OPTIONS}
            placeholder="Mastery"
          />
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Right — two-level grouped grid                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 overflow-y-auto bg-hextech-black">
        {groups.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="font-body text-sm text-grey-2">No chromas found</p>
          </div>
        ) : (
          <div className="px-6 py-4 space-y-8">
            {groups.map((g) => (
              <section key={g.championId}>
                {/* Level 1 header — champion name, bold gold, uppercase */}
                <div className="mb-2 flex items-baseline gap-3">
                  <span className="font-display text-base uppercase tracking-wider text-gold-1">
                    {g.championName}
                  </span>
                  <span className="font-body text-sm text-grey-1">
                    {champStats[g.championId]?.owned ?? 0}/
                    {champStats[g.championId]?.total ?? 0}
                  </span>
                </div>

                {/* Level 2 — skin-line sub-groups */}
                {g.skinLines.map((sl) => {
                  const slOwned = skinLineOwned[sl.skinLineName] ?? 0;
                  const slTotal = skinLineTotals[sl.skinLineName] ?? sl.chromas.length;

                  return (
                    <div key={sl.skinLineName} className="mb-6">
                      {/* Sub-header — skin-line name, smaller, gold-cream */}
                      <div className="mb-3 flex items-baseline gap-3">
                        <span className="font-display text-xs uppercase tracking-wider text-gold-cream">
                          {sl.skinLineName}
                        </span>
                        <span className="font-body text-xs text-grey-1">
                          {slOwned}/{slTotal}
                        </span>
                      </div>

                      {/* Chroma card row */}
                      <div className="flex flex-wrap gap-3">
                        {sl.chromas.map((chroma) => (
                          <ChromaCard
                            key={chroma.name}
                            name={chroma.name}
                            imageSrc={loadingArtUrl(g.championId, sl.baseSkinIndex)}
                            owned={chroma.owned}
                            palette={chroma.palette}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmotesTab
//
// Layout: left inventory sidebar (~420px) + right emote wheel editor.
//
// Assign flow (documented):
//   Option A: click inventory emote first → then click a wheel slot to assign.
//   Option B: click wheel slot first → then click an inventory emote to assign.
//   Both directions are supported; the first click sets the "pending" side,
//   and the second click completes the assignment. Unowned emotes are blocked.
//
// ASSET DIVERGENCE: Emote art is not available on DDragon v16.13.1.
// profileIconUrl stand-ins are used (circular icons). All IDs verified HTTP 200.
// ---------------------------------------------------------------------------

const EMOTE_SORT_OPTIONS: SelectOption[] = [
  { value: "acquired", label: "Acquired Date" },
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "name-desc", label: "Name (Z–A)" },
];

interface EmotesTabProps {
  emoteSort: string;
  onEmoteSortChange: (v: string) => void;
  showUnowned: boolean;
  onShowUnownedChange: (v: boolean) => void;
  slots: Record<SlotId, string | null>;
  savedSlots: Record<SlotId, string | null>;
  selectedSlot: SlotId | undefined;
  selectedEmoteId: string | undefined;
  onSlotClick: (slot: SlotId) => void;
  onEmoteSelect: (id: string) => void;
  onSave: () => void;
  onRevert: () => void;
}

function EmotesTab({
  emoteSort,
  onEmoteSortChange,
  showUnowned,
  onShowUnownedChange,
  slots,
  savedSlots,
  selectedSlot,
  selectedEmoteId,
  onSlotClick,
  onEmoteSelect,
  onSave,
  onRevert,
}: EmotesTabProps) {
  const hasChanges = JSON.stringify(slots) !== JSON.stringify(savedSlots);

  const visibleEmotes = useMemo(() => {
    let list = [...demoEmotes];
    if (!showUnowned) list = list.filter((e) => e.owned);
    if (emoteSort === "name-asc") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (emoteSort === "name-desc") {
      list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    }
    return list;
  }, [showUnowned, emoteSort]);

  const totalOwned = demoEmotes.filter((e) => e.owned).length;
  const totalEmotes = demoEmotes.length;

  return (
    <div className="flex h-full min-h-0">
      {/* ------------------------------------------------------------------ */}
      {/* Left inventory sidebar — ~420px                                     */}
      {/* ------------------------------------------------------------------ */}
      <aside className="flex w-[420px] shrink-0 flex-col border-r border-grey-3 bg-hextech-black">
        {/* Header */}
        <div className="shrink-0 flex items-baseline gap-3 px-5 pt-5 pb-3">
          <span className="font-display text-sm uppercase tracking-widest text-gold-cream">
            Emotes
          </span>
          <span className="font-body text-sm text-grey-1">
            {totalOwned}/{totalEmotes}
          </span>
        </div>

        {/* Controls row */}
        <div className="shrink-0 flex items-center gap-3 px-5 pb-3">
          <div className="flex-1">
            <HextechSelect
              ariaLabel="Sort emotes"
              value={emoteSort}
              onChange={onEmoteSortChange}
              options={EMOTE_SORT_OPTIONS}
              placeholder="Acquired Date"
            />
          </div>
          <HextechCheckbox
            checked={showUnowned}
            onChange={onShowUnownedChange}
            label="Show Unowned"
          />
        </div>

        {/* Scrollable 4-column emote grid */}
        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {visibleEmotes.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="font-body text-sm text-grey-2">No emotes found</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {visibleEmotes.map((emote) => (
                <EmoteTile
                  key={emote.id}
                  name={emote.name}
                  imageSrc={emote.imageSrc}
                  owned={emote.owned}
                  selected={selectedEmoteId === emote.id}
                  onSelect={() => onEmoteSelect(emote.id)}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Right — emote wheel editor                                          */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-hextech-black px-8 py-6">
        <EmoteWheel
          slots={slots}
          selectedSlot={selectedSlot}
          onSlotClick={onSlotClick}
        />

        {/* Action row: revert icon + SAVE button */}
        <div className="flex items-center gap-4">
          {/* Revert icon button */}
          <button
            type="button"
            aria-label="Revert changes"
            title="Revert changes"
            disabled={!hasChanges}
            onClick={onRevert}
            className={[
              "flex items-center justify-center w-8 h-8 rounded border transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-3",
              hasChanges
                ? "border-grey-3 text-grey-1 hover:border-gold-4 hover:text-gold-2 cursor-pointer"
                : "border-grey-3 text-grey-3 cursor-not-allowed opacity-40",
            ].join(" ")}
          >
            {/* Circular undo arrow */}
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
              <path
                d="M3.5 5.5H7a4.5 4.5 0 1 1 0 9H4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M3.5 5.5L5.5 3M3.5 5.5L5.5 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <HextechButton
            variant="primary"
            disabled={!hasChanges}
            onClick={onSave}
          >
            SAVE
          </HextechButton>
        </div>

        {/* Assign-flow hint */}
        <p className="font-body text-xs text-grey-2 text-center max-w-xs">
          {selectedSlot
            ? "Slot selected — click an emote in the inventory to assign"
            : selectedEmoteId
            ? "Emote selected — click a wheel slot to assign"
            : "Click a wheel slot or an inventory emote to start"}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CollectionScreen
// ---------------------------------------------------------------------------

export function CollectionScreen() {
  const [activeTab, setActiveTab] = useState("champions");

  // Champion detail overlay — null = grid visible; string = champion id with overlay open.
  // Currently only Warwick has a full ChampionDetail fixture; other champions fall back
  // to Warwick's data with the correct name/id swapped is not in scope — for now only
  // Warwick opens the real overlay; other cards log to console as before.
  const [detailChampId, setDetailChampId] = useState<string | null>(null);

  // Skins tab state — hoisted so state survives tab switches
  const [skinSearch, setSkinSearch] = useState("");
  const [showUnowned, setShowUnowned] = useState(true);
  const [championFilter, setChampionFilter] = useState("");
  const [sort, setSort] = useState("");
  // Skin preview overlay — null = grid; { champId, skinIndex } = overlay open
  const [skinPreview, setSkinPreview] = useState<{
    champId: string;
    skinIndex: number;
  } | null>(null);

  // Chromas tab state — hoisted so state survives tab switches
  const [chromaSearch, setChromaSearch] = useState("");
  const [chromaShowUnowned, setChromaShowUnowned] = useState(true);
  const [chromaShowUnavailable, setChromaShowUnavailable] = useState(false);
  const [chromaChampionFilter, setChromaChampionFilter] = useState("");
  const [chromaSort, setChromaSort] = useState("");

  // Runes tab state — hoisted so state survives tab switches
  const runePages: RunePage[] = demoRunePages;
  const [runeSelectedPageId, setRuneSelectedPageId] = useState<string | undefined>(undefined);
  const [runeSearchQuery, setRuneSearchQuery] = useState("");
  const [runeHidePresets, setRuneHidePresets] = useState(false);
  const [runeActivePathFilter, setRuneActivePathFilter] = useState<string | null>(null);

  // Spells tab state — hoisted so state survives tab switches
  const [selectedSpellId, setSelectedSpellId] = useState("SummonerTeleport");

  // Emotes tab state — hoisted so state survives tab switches
  const [emoteSort, setEmoteSort] = useState("acquired");
  const [emoteShowUnowned, setEmoteShowUnowned] = useState(true);
  const [emoteSlots, setEmoteSlots] = useState<Record<SlotId, string | null>>(defaultEmoteSlots);
  const [emoteSavedSlots, setEmoteSavedSlots] = useState<Record<SlotId, string | null>>(defaultEmoteSlots);
  const [emoteSelectedSlot, setEmoteSelectedSlot] = useState<SlotId | undefined>(undefined);
  const [emoteSelectedId, setEmoteSelectedId] = useState<string | undefined>(undefined);

  function handleEmoteSlotClick(slot: SlotId) {
    // Toggle deselect if same slot clicked again
    if (emoteSelectedSlot === slot) {
      setEmoteSelectedSlot(undefined);
      return;
    }
    // If an emote is pending in inventory, assign immediately
    if (emoteSelectedId) {
      const emote = demoEmotes.find((e) => e.id === emoteSelectedId);
      if (emote?.owned) {
        setEmoteSlots((prev) => ({ ...prev, [slot]: emote.imageSrc }));
        setEmoteSelectedSlot(undefined);
        setEmoteSelectedId(undefined);
        return;
      }
    }
    setEmoteSelectedSlot(slot);
  }

  function handleEmoteSelect(emoteId: string) {
    const emote = demoEmotes.find((e) => e.id === emoteId);
    if (!emote?.owned) return; // Unowned emotes cannot be assigned

    // Toggle deselect if same emote clicked again
    if (emoteSelectedId === emoteId) {
      setEmoteSelectedId(undefined);
      return;
    }
    // If a slot is pending on the wheel, assign immediately
    if (emoteSelectedSlot) {
      setEmoteSlots((prev) => ({ ...prev, [emoteSelectedSlot]: emote.imageSrc }));
      setEmoteSelectedSlot(undefined);
      setEmoteSelectedId(undefined);
      return;
    }
    setEmoteSelectedId(emoteId);
  }

  function handleEmoteSave() {
    console.log("Emote wheel saved", emoteSlots);
    setEmoteSavedSlots({ ...emoteSlots });
  }

  function handleEmoteRevert() {
    setEmoteSlots({ ...emoteSavedSlots });
    setEmoteSelectedSlot(undefined);
    setEmoteSelectedId(undefined);
  }

  // Dead tabs are no-ops — clicking them does not change activeTab
  const handleTabSelect = (id: string) => {
    const tab = TABS.find((t) => t.id === id);
    if (!tab?.live) return;
    setActiveTab(id);
  };

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

      {/* Full 9-tab sub-nav. Dead tabs use aria-disabled and cursor-default. */}
      <div
        role="tablist"
        aria-label="Collection tabs"
        className="flex h-10 w-full shrink-0 items-end overflow-hidden border-b border-gold-5 bg-blue-6 px-4 gap-6"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const isDead = !tab.live;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-disabled={isDead || undefined}
              onClick={() => handleTabSelect(tab.id)}
              className={[
                "shrink-0 font-display uppercase tracking-widest text-sm",
                "border-b-2 pb-0.5 transition-colors duration-150",
                isDead
                  ? "border-transparent text-grey-3 cursor-default"
                  : isActive
                  ? "border-gold-3 text-gold-2 cursor-pointer"
                  : "border-transparent text-grey-1 hover:text-gold-1 cursor-pointer",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

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

        {activeTab === "champions" && detailChampId !== null && (
          /* Champion detail overlay — covers content area; rail/nav stay visible */
          <div className="absolute inset-0 z-20">
            <ChampionDetail
              champion={warwickDetail}
              onClose={() => setDetailChampId(null)}
            />
          </div>
        )}

        {activeTab === "champions" && detailChampId === null && (
          <div className="h-full overflow-y-auto bg-hextech-black">
            <div className="grid grid-cols-5 gap-4 p-6">
              {demoChampions.map((c) => (
                <ChampionCard
                  key={c.id}
                  champion={c}
                  artSrc={loadingArtUrl(c.id)}
                  onSelect={(id) => setDetailChampId(id)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === "skins" && skinPreview !== null && (() => {
          const champData = demoSkins[skinPreview.champId];
          const skins = champData?.skins ?? [];
          const currentSkinIdx = skins.findIndex(
            (s) => s.skinIndex === skinPreview.skinIndex
          );
          const currentSkin = skins[currentSkinIdx];
          const thumbnails = skins.map((s) => ({
            name: s.name,
            imageSrc: loadingArtUrl(skinPreview.champId, s.skinIndex),
            owned: s.owned,
          }));
          return (
            <div className="absolute inset-0 z-20">
              <SkinPreview
                skinName={currentSkin?.name ?? ""}
                description={
                  currentSkin?.skinIndex === 8 && skinPreview.champId === "Kayle"
                    ? "Given to players who purchased the Retail Collector's Edition of League of Legends."
                    : undefined
                }
                acquiredDate={currentSkin?.owned ? "25/11/2010" : undefined}
                owned={currentSkin?.owned ?? false}
                splashSrc={championSplashUrl(
                  skinPreview.champId,
                  currentSkin?.skinIndex ?? 0
                )}
                thumbnails={thumbnails}
                selectedIndex={currentSkinIdx >= 0 ? currentSkinIdx : 0}
                onPrev={() => {
                  const prevIdx =
                    (currentSkinIdx - 1 + skins.length) % skins.length;
                  const prevSkin = skins[prevIdx];
                  if (prevSkin)
                    setSkinPreview({ champId: skinPreview.champId, skinIndex: prevSkin.skinIndex });
                }}
                onNext={() => {
                  const nextIdx = (currentSkinIdx + 1) % skins.length;
                  const nextSkin = skins[nextIdx];
                  if (nextSkin)
                    setSkinPreview({ champId: skinPreview.champId, skinIndex: nextSkin.skinIndex });
                }}
                onThumbnailSelect={(i) => {
                  const thumb = skins[i];
                  if (thumb)
                    setSkinPreview({ champId: skinPreview.champId, skinIndex: thumb.skinIndex });
                }}
                onClose={() => setSkinPreview(null)}
              />
            </div>
          );
        })()}

        {activeTab === "skins" && skinPreview === null && (
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
              onSkinSelect={(champId, skinIndex) =>
                setSkinPreview({ champId, skinIndex })
              }
            />
          </div>
        )}

        {activeTab === "chromas" && (
          <div className="h-full min-h-0 flex">
            <ChromasTab
              search={chromaSearch}
              onSearchChange={setChromaSearch}
              showUnowned={chromaShowUnowned}
              onShowUnownedChange={setChromaShowUnowned}
              showUnavailable={chromaShowUnavailable}
              onShowUnavailableChange={setChromaShowUnavailable}
              championFilter={chromaChampionFilter}
              onChampionFilterChange={setChromaChampionFilter}
              sort={chromaSort}
              onSortChange={setChromaSort}
            />
          </div>
        )}

        {activeTab === "runes" && (
          <div className="h-full min-h-0 flex flex-col">
            <RunesScreen
              paths={Object.values(RUNE_PATHS)}
              pages={runePages}
              maxPages={3}
              selectedPageId={runeSelectedPageId}
              onSelectPage={setRuneSelectedPageId}
              onCreatePage={() => console.log("create rune page")}
              onDeletePage={(id) => {
                console.log("delete rune page", id);
                if (runeSelectedPageId === id) setRuneSelectedPageId(undefined);
              }}
              searchQuery={runeSearchQuery}
              onSearchChange={setRuneSearchQuery}
              hidePresets={runeHidePresets}
              onHidePresetsChange={setRuneHidePresets}
              activePathFilter={runeActivePathFilter}
              onPathFilterChange={setRuneActivePathFilter}
            />
          </div>
        )}

        {activeTab === "spells" && (
          <div className="h-full min-h-0 flex">
            <SpellsTab
              spells={SUMMONER_SPELLS}
              selectedSpellId={selectedSpellId}
              onSelectSpell={setSelectedSpellId}
            />
          </div>
        )}

        {activeTab === "emotes" && (
          <div className="h-full min-h-0 flex">
            <EmotesTab
              emoteSort={emoteSort}
              onEmoteSortChange={setEmoteSort}
              showUnowned={emoteShowUnowned}
              onShowUnownedChange={setEmoteShowUnowned}
              slots={emoteSlots}
              savedSlots={emoteSavedSlots}
              selectedSlot={emoteSelectedSlot}
              selectedEmoteId={emoteSelectedId}
              onSlotClick={handleEmoteSlotClick}
              onEmoteSelect={handleEmoteSelect}
              onSave={handleEmoteSave}
              onRevert={handleEmoteRevert}
            />
          </div>
        )}

        {/* Dead + unknown tabs show coming-soon placeholder */}
        {activeTab !== "champions" &&
          activeTab !== "skins" &&
          activeTab !== "chromas" &&
          activeTab !== "emotes" &&
          activeTab !== "runes" &&
          activeTab !== "spells" && (
            <div className="flex h-full items-center justify-center">
              <p className="font-body text-sm text-grey-2">Coming soon</p>
            </div>
          )}
      </div>
    </div>
  );
}
