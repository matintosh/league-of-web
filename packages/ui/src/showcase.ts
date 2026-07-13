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
  /**
   * Filename of the reference screenshot in /docs/reference/, e.g. "client-home-news.jpg".
   * The file must also exist in apps/web/public/docs-ref/ to be served.
   * When set, a toggleable reference image panel appears above the variants list.
   */
  referenceImage?: string;
  /** Optional caption for the reference image — e.g. the source doc path or context note. */
  referenceNote?: string;
}
