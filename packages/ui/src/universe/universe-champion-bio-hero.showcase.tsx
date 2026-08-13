import type { ShowcaseEntry } from "../showcase";
import { UniverseChampionBioHero } from "./universe-champion-bio-hero";
import { championSplashUrl } from "@low/fixtures";

export const universeChampionBioHeroShowcase: ShowcaseEntry = {
  slug: "universe-champion-bio-hero",
  name: "Universe Champion Bio Hero",
  area: "universe",
  description:
    "Full-bleed champion splash hero for bio pages on universe.leagueoflegends.com. Champion art (object-cover), dark vignette on bottom + sides, centered lower-third: crest glyph, large Beaufort name, gold subtitle.",
  referenceImage: "universe-live-champion-bio.png",
  referenceNote: "docs/reference/universe-live-champion-bio.png — top hero section",
  variants: [
    {
      name: "Lux — Lady of Luminosity",
      notes: "Default crest visible, Lux splash, title subtitle. Matches reference screenshot closely.",
      backgrounds: ["dark"],
      render: () => (
        <div style={{ backgroundColor: "var(--color-universe-bg)" }}>
          <UniverseChampionBioHero
            name="Lux"
            title="The Lady of Luminosity"
            splashUrl={championSplashUrl("Lux", 0)}
            showCrest
          />
        </div>
      ),
    },
    {
      name: "Ahri — Nine-Tailed Fox (no crest)",
      notes: "showCrest=false — removes the shield glyph above the name.",
      backgrounds: ["dark"],
      render: () => (
        <div style={{ backgroundColor: "var(--color-universe-bg)" }}>
          <UniverseChampionBioHero
            name="Ahri"
            title="The Nine-Tailed Fox"
            splashUrl={championSplashUrl("Ahri", 0)}
            showCrest={false}
          />
        </div>
      ),
    },
    {
      name: "Jinx — Loose Cannon (custom height)",
      notes: "height=380 — shorter hero variant.",
      backgrounds: ["dark"],
      render: () => (
        <div style={{ backgroundColor: "var(--color-universe-bg)" }}>
          <UniverseChampionBioHero
            name="Jinx"
            title="The Loose Cannon"
            splashUrl={championSplashUrl("Jinx", 0)}
            height={380}
          />
        </div>
      ),
    },
    {
      name: "No splash (fallback)",
      notes: "No splashUrl provided — renders dark bg placeholder with text overlay.",
      backgrounds: ["dark"],
      render: () => (
        <div style={{ backgroundColor: "var(--color-universe-bg)" }}>
          <UniverseChampionBioHero
            name="Unknown"
            title="The Mysterious Champion"
          />
        </div>
      ),
    },
  ],
};
