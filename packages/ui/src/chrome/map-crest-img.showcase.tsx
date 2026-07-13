import type { ShowcaseEntry } from "../showcase";
import { MapCrestImg } from "./map-crest-img";
import { gameModeMapUrl } from "@low/fixtures";

export const mapCrestImgShowcase: ShowcaseEntry = {
  slug: "map-crest-img",
  name: "MapCrestImg",
  area: "chrome",
  description:
    "Shared atlas-crop primitive for CDragon map crest PNGs. Crops the two-frame vertical atlas (lit top, dark bottom) to a single square frame. Used inside PartyStatusPanel, FindingMatchPanel, and LobbyHeader.",
  variants: [
    {
      name: "Active frame — SR (36px)",
      notes:
        "Default size (36px), active frame = lit top half. Used in rail party/queue indicators.",
      render: () => (
        <div className="flex items-center gap-4 bg-blue-7 p-6">
          <MapCrestImg src={gameModeMapUrl("sr")} frame="active" size={36} />
        </div>
      ),
    },
    {
      name: "Inactive frame — SR (36px)",
      notes: "Inactive frame = dark bottom half. Same atlas, bottom-anchored.",
      render: () => (
        <div className="flex items-center gap-4 bg-blue-7 p-6">
          <MapCrestImg src={gameModeMapUrl("sr")} frame="inactive" size={36} />
        </div>
      ),
    },
    {
      name: "Active vs Inactive side by side — SR",
      notes:
        "Both frames from the same atlas at 36px. Left = active (lit), right = inactive (dark).",
      render: () => (
        <div className="flex items-center gap-6 bg-blue-7 p-6">
          <div className="flex flex-col items-center gap-1">
            <MapCrestImg src={gameModeMapUrl("sr")} frame="active" size={36} />
            <span className="font-body text-xs text-grey-1">active</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <MapCrestImg src={gameModeMapUrl("sr")} frame="inactive" size={36} />
            <span className="font-body text-xs text-grey-1">inactive</span>
          </div>
        </div>
      ),
    },
    {
      name: "All four maps — active frame (36px)",
      notes: "SR / HA (ARAM) / TFT / TT at rail size. Verifies crop works for all atlas shapes.",
      render: () => (
        <div className="flex items-center gap-4 bg-blue-7 p-6">
          {(["sr", "ha", "tft", "tt"] as const).map((map) => (
            <div key={map} className="flex flex-col items-center gap-1">
              <MapCrestImg src={gameModeMapUrl(map)} frame="active" size={36} />
              <span className="font-body text-xs text-grey-1">{map}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      name: "Large size — SR active (128px)",
      notes: "size=128; used in GameModeCard icon slot on the mode-select screen.",
      render: () => (
        <div className="flex items-center bg-hextech-black p-6">
          <MapCrestImg src={gameModeMapUrl("sr")} frame="active" size={128} />
        </div>
      ),
    },
    {
      name: "Medium size — LobbyHeader context (24px)",
      notes: "size=24; used as the inline queue crest in LobbyHeader.",
      render: () => (
        <div className="flex items-center gap-4 bg-blue-7 p-6">
          {(["sr", "ha", "tft", "tt"] as const).map((map) => (
            <div key={map} className="flex flex-col items-center gap-1">
              <MapCrestImg src={gameModeMapUrl(map)} frame="active" size={24} />
              <span className="font-body text-xs text-grey-1">{map}</span>
            </div>
          ))}
        </div>
      ),
    },
  ],
};
