import type { ShowcaseEntry } from "../showcase";
import { UniverseHeroCarousel } from "./universe-hero-carousel";
import { UniverseHeroCarouselDemo } from "./universe-hero-carousel.demo";
import { championSplashUrl } from "@low/fixtures";

const SLIDES = [
  {
    overline: "THE ASHEN EXORCIST",
    title: "LOCKE",
    splashUrl: championSplashUrl("Senna"),
    href: "#",
  },
  {
    overline: "THE GRANDMASTER AT ARMS",
    title: "JHIN",
    splashUrl: championSplashUrl("Jhin"),
    href: "#",
  },
  {
    overline: "THE NINE-TAILED FOX",
    title: "AHRI",
    splashUrl: championSplashUrl("Ahri"),
    href: "#",
  },
];

export const universeHeroCarouselShowcase: ShowcaseEntry = {
  slug: "universe-hero-carousel",
  name: "Universe Hero Carousel",
  area: "universe",
  description:
    "Home page hero carousel from universe.leagueoflegends.com. Full-width champion splash (~460px tall), dark vignette edges, circular gold-ringed prev/next arrow buttons. Centered: crest ornament SVG + overline (gold caps) + big title (font-display serif caps) + thin gold underline bar. Faded prev/next slide titles peek at edges. Controlled component — parent owns index.",
  referenceImage: "universe-landing.png",
  referenceNote: "docs/reference/universe-landing.png — top hero section",
  variants: [
    {
      name: "Static — index 0 (Senna)",
      notes: "Carousel frozen at index 0. Shows crest ornament, overline, title, gold underline, and prev/next peek titles.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-full max-w-4xl"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseHeroCarousel
            slides={SLIDES}
            index={0}
          />
        </div>
      ),
    },
    {
      name: "Static — index 1 (Jhin)",
      notes: "Carousel frozen at index 1 — verifies per-slide overline and title update.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-full max-w-4xl"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseHeroCarousel
            slides={SLIDES}
            index={1}
          />
        </div>
      ),
    },
    {
      name: "Single slide (no arrows)",
      notes: "When slides.length === 1 the arrows and peek titles are hidden.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="w-full max-w-4xl"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseHeroCarousel
            slides={SLIDES.slice(0, 1)}
            index={0}
          />
        </div>
      ),
    },
    {
      name: "Interactive demo",
      notes: "Stateful demo — prev/next buttons cycle through all slides.",
      backgrounds: ["dark"],
      render: () => <UniverseHeroCarouselDemo />,
    },
  ],
};
