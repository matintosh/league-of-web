import type { ReactNode } from "react";

export type Area = "chrome" | "champ-select" | "collection" | "login" | "store" | "lobby";

export interface ShowcaseVariant {
  name: string;
  /** Short note rendered under the variant — props used, state shown, gotchas. */
  notes?: string;
  render: () => ReactNode;
}

export interface ShowcaseEntry {
  /** URL slug, kebab-case, unique. e.g. "hextech-button" */
  slug: string;
  /** Display name. e.g. "Hextech Button" */
  name: string;
  area: Area;
  description: string;
  variants: ShowcaseVariant[];
}
