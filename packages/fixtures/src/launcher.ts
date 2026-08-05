/**
 * Launcher fixture types — Riot multi-game launcher home surface.
 *
 * FeaturedPromoData — big hero banner (FeaturedGamePromoHero).
 * PatchNoteData     — cross-game patch note card (PatchNoteCard).
 *
 * Values are supplied by pages and showcase files. Types only here.
 */

/** Data for the large featured-game promo hero banner. */
export interface FeaturedPromoData {
  /** Short game key, e.g. "lol" | "valorant" | "tft" | "2xko". */
  gameKey: string;
  /** URL (or data URI) for the game logo — displayed top-left in the overlay column. */
  gameLogo: string;
  /** Heading below the logo, e.g. "League Classic is Here". */
  tagline: string;
  /** 1–2 sentence body copy below the tagline. */
  description: string;
  /** CTA button label, e.g. "Try Classic". */
  ctaLabel: string;
  /** Full-bleed background splash art URL. */
  splashUrl: string;
}

/** Data for a single cross-game patch note card. */
export interface PatchNoteData {
  /** Unique id used for onClick callback. */
  id: string;
  /** Short game key, e.g. "valorant" | "lol" | "tft". */
  gameKey: string;
  /** Display name, e.g. "VALORANT". */
  gameName: string;
  /** URL (or data URI) for the game logo — overlaid on the card thumbnail. */
  gameLogo: string;
  /** Card heading, e.g. "VALORANT Patch Notes 13.02". */
  title: string;
  /** Card thumbnail image URL. */
  thumbUrl: string;
  /** ISO date string, e.g. "2026-07-15T00:00:00Z". */
  publishedAt: string;
  /** Link href (presentational — no navigation in @low/ui). */
  href: string;
}
