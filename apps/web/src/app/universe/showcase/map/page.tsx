/**
 * /universe/showcase/map — Universe site map.
 *
 * Visual index of every page in the Universe surface clone. Each page shows:
 *  - the reference screenshot (the 1:1 target) + route + build status
 *  - the EXPECTED COMPONENTS that compose the page, each with its build status
 *    (Built → link to its showcase; Planned → build issue) and the spec/reference
 *    it is diffed against.
 *
 * Built-status for components is derived from the shared registry (area==universe),
 * so the map self-updates as components merge. Nested under /universe/layout.tsx.
 * Server component: no 'use client', no event handlers.
 */

import Link from "next/link";
import { registry } from "@low/ui/registry";

const builtSlugs = new Set(
  registry.filter((e) => e.area === "universe").map((e) => e.slug),
);

/** Component spec: what it is + the reference it is measured against. */
interface ComponentSpec {
  slug: string;
  name: string;
  ref: string; // filename under /universe-map/ (the spec image)
  refNote: string; // which part of the ref
  issue?: number; // build/fix issue when not yet built
}

const COMPONENTS: Record<string, ComponentSpec> = {
  "universe-top-nav": {
    slug: "universe-top-nav",
    name: "Top Nav",
    ref: "universe-landing.png",
    refNote: "nav row (top ~48px)",
  },
  "universe-hero-carousel": {
    slug: "universe-hero-carousel",
    name: "Hero Carousel",
    ref: "universe-landing.png",
    refNote: "splash + arrows + crest lockup",
    issue: 971,
  },
  "universe-crest-divider": {
    slug: "universe-crest-divider",
    name: "Crest Divider",
    ref: "universe-crest-divider.png",
    refNote: "section header ornament",
  },
  "universe-story-card": {
    slug: "universe-story-card",
    name: "Story Card",
    ref: "universe-explore.png",
    refNote: "grid card",
  },
  "universe-cookie-banner": {
    slug: "universe-cookie-banner",
    name: "Cookie Banner",
    ref: "universe-landing.png",
    refNote: "bottom bar",
  },
  "universe-filter-tabs": {
    slug: "universe-filter-tabs",
    name: "Filter Tabs",
    ref: "universe-filter-tabs.png",
    refNote: "filter + sort row",
    issue: 970,
  },
  "universe-champion-card": {
    slug: "universe-champion-card",
    name: "Champion Card",
    ref: "universe-live-champions.png",
    refNote: "tall splash grid tile",
    issue: 969,
  },
  "universe-breadcrumb": {
    slug: "universe-breadcrumb",
    name: "Breadcrumb",
    ref: "universe-live-champion-bio.png",
    refNote: "crest + caps trail",
  },
  "universe-champion-bio-hero": {
    slug: "universe-champion-bio-hero",
    name: "Champion Bio Hero",
    ref: "universe-live-champion-bio.png",
    refNote: "full-bleed splash + name + subtitle",
  },
  "universe-region-card": {
    slug: "universe-region-card",
    name: "Region Card",
    ref: "universe-live-regions.png",
    refNote: "region tile",
  },
};

type PageStatus = "live" | "planned";

interface UniversePage {
  name: string;
  route: string;
  ref: string;
  status: PageStatus;
  note: string;
  components: string[]; // keys into COMPONENTS
}

const PAGES: UniversePage[] = [
  {
    name: "Home / Landing",
    route: "/universe",
    ref: "universe-landing.png",
    status: "live",
    note: "Top nav, hero splash carousel, LATEST grid, FEATURED grid.",
    components: [
      "universe-top-nav",
      "universe-hero-carousel",
      "universe-crest-divider",
      "universe-story-card",
      "universe-cookie-banner",
    ],
  },
  {
    name: "Explore",
    route: "/universe/explore",
    ref: "universe-explore.png",
    status: "live",
    note: "Filter/sort bar + 4-column story-card grid across all content types.",
    components: [
      "universe-top-nav",
      "universe-filter-tabs",
      "universe-story-card",
    ],
  },
  {
    name: "Champions",
    route: "/universe/champions",
    ref: "universe-live-champions.png",
    status: "live",
    note: "Crest title + sort row + tall champion-card splash grid.",
    components: [
      "universe-top-nav",
      "universe-crest-divider",
      "universe-champion-card",
    ],
  },
  {
    name: "Champion Bio",
    route: "/universe/champion/lux",
    ref: "universe-live-champion-bio.png",
    status: "live",
    note: "Full-bleed splash hero, serif name + subtitle, breadcrumb, story rail.",
    components: [
      "universe-top-nav",
      "universe-breadcrumb",
      "universe-champion-bio-hero",
      "universe-story-card",
    ],
  },
  {
    name: "Regions",
    route: "/universe/region",
    ref: "universe-live-regions.png",
    status: "planned",
    note: "Runeterra region index — region tiles into region detail pages.",
    components: [
      "universe-top-nav",
      "universe-crest-divider",
      "universe-region-card",
    ],
  },
];

const liveCount = PAGES.filter((p) => p.status === "live").length;
const allComponentKeys = new Set(PAGES.flatMap((p) => p.components));
const builtComponentCount = [...allComponentKeys].filter((k) =>
  builtSlugs.has(k),
).length;

export const metadata = {
  title: "Universe — Site Map",
  description: "Every page in the League Universe clone, its components, and references.",
};

export default function UniverseSiteMapPage() {
  return (
    <div style={{ minHeight: "100vh", color: "var(--color-universe-story-ink)" }}>
      <style>{`
        .umap-card {
          border: 1px solid var(--color-universe-nav-border);
          background-color: var(--color-universe-card-bg);
          transition: border-color 150ms, box-shadow 150ms;
          height: 100%; box-sizing: border-box; overflow: hidden;
        }
        .umap-card:hover { border-color: var(--color-gold-3); }
        .umap-thumb-link { display: block; text-decoration: none; }
        .umap-thumb {
          display: block; width: 100%; aspect-ratio: 16 / 10;
          object-fit: cover; object-position: top center;
          border-bottom: 1px solid var(--color-universe-nav-border);
          transition: opacity 150ms;
        }
        .umap-thumb-link:hover .umap-thumb { opacity: 0.86; }
        .umap-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--color-gold-2); text-decoration: none; transition: color 150ms;
        }
        .umap-back:hover { color: var(--color-gold-1); }
        .umap-comp {
          display: flex; align-items: baseline; gap: 8px;
          padding: 7px 0; border-top: 1px solid var(--color-universe-nav-border);
        }
        .umap-comp-name { text-decoration: none; transition: color 150ms; }
        a.umap-comp-name:hover { color: var(--color-gold-1); }
        .umap-dot {
          flex-shrink: 0; width: 7px; height: 7px; border-radius: 50%;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Hero */}
      <section
        style={{
          borderBottom: "1px solid var(--color-universe-nav-border)",
          padding: "56px 24px 40px",
        }}
      >
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <Link href="/universe/showcase" className="umap-back">
            ← Components
          </Link>
          <h1
            className="font-display"
            style={{
              marginTop: "20px", fontSize: "40px", letterSpacing: "0.14em",
              textTransform: "uppercase", color: "var(--color-gold-1)",
            }}
          >
            Site Map
          </h1>
          <p style={{ marginTop: "10px", maxWidth: "680px", fontSize: "15px", lineHeight: 1.6 }}>
            Every page in the Universe clone with its 1:1 reference and the components
            that compose it. {liveCount}/{PAGES.length} pages live ·{" "}
            {builtComponentCount}/{allComponentKeys.size} components built. Each component
            lists the spec/reference it is diffed against. Reviewers traverse this map to
            drive the surface to 1:1.
          </p>
          {/* Legend */}
          <div style={{ marginTop: "18px", display: "flex", gap: "20px", fontSize: "12px", letterSpacing: "0.04em" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
              <span className="umap-dot" style={{ backgroundColor: "var(--color-gold-2)" }} /> Built (links to showcase)
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
              <span className="umap-dot" style={{ backgroundColor: "var(--color-universe-nav-border)", border: "1px solid var(--color-gold-2)" }} /> Planned (build issue)
            </span>
          </div>
        </div>
      </section>

      {/* Page grid */}
      <section style={{ padding: "36px 24px 80px" }}>
        <div
          style={{
            maxWidth: "1180px", margin: "0 auto", display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "22px",
          }}
        >
          {PAGES.map((page) => {
            const badge =
              page.status === "live"
                ? { text: "Live", fg: "var(--color-gold-1)", bd: "var(--color-gold-3)" }
                : { text: "Planned", fg: "var(--color-gold-2)", bd: "var(--color-universe-nav-border)" };
            const thumb = (
              <img
                className="umap-thumb"
                // eslint-disable-next-line @next/next/no-img-element
                src={`/universe-map/${page.ref}`}
                alt={`${page.name} reference`}
              />
            );
            return (
              <div key={page.route} className="umap-card">
                {page.status === "live" ? (
                  <Link href={page.route} className="umap-thumb-link">
                    {thumb}
                  </Link>
                ) : (
                  thumb
                )}
                <div style={{ padding: "18px 20px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                    <h2
                      className="font-display"
                      style={{ fontSize: "17px", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-gold-1)" }}
                    >
                      {page.name}
                    </h2>
                    <span
                      style={{
                        flexShrink: 0, fontSize: "11px", letterSpacing: "0.08em",
                        textTransform: "uppercase", color: badge.fg,
                        border: `1px solid ${badge.bd}`, borderRadius: "2px", padding: "2px 8px",
                      }}
                    >
                      {badge.text}
                    </span>
                  </div>
                  <code style={{ display: "block", marginTop: "6px", fontSize: "12px", color: "var(--color-gold-2)" }}>
                    {page.route}
                  </code>
                  <p style={{ marginTop: "10px", fontSize: "13px", lineHeight: 1.5 }}>{page.note}</p>

                  {/* Expected components */}
                  <div style={{ marginTop: "16px" }}>
                    <div
                      style={{
                        fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase",
                        color: "var(--color-gold-2)", marginBottom: "2px",
                      }}
                    >
                      Components ({page.components.filter((k) => builtSlugs.has(k)).length}/{page.components.length})
                    </div>
                    {page.components.map((key) => {
                      const c = COMPONENTS[key];
                      if (!c) return null;
                      const built = builtSlugs.has(key);
                      return (
                        <div key={key} className="umap-comp">
                          <span
                            className="umap-dot"
                            style={
                              built
                                ? { backgroundColor: "var(--color-gold-2)" }
                                : { backgroundColor: "var(--color-universe-nav-border)", border: "1px solid var(--color-gold-2)" }
                            }
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            {built ? (
                              <Link
                                href={`/showcase/${c.slug}`}
                                className="umap-comp-name"
                                style={{ fontSize: "13px", color: "var(--color-universe-story-ink)", fontWeight: 600 }}
                              >
                                {c.name}
                              </Link>
                            ) : (
                              <span
                                className="umap-comp-name"
                                style={{ fontSize: "13px", color: "var(--color-universe-story-ink)", fontWeight: 600, opacity: 0.85 }}
                              >
                                {c.name}
                                {c.issue ? (
                                  <span style={{ color: "var(--color-gold-2)", fontWeight: 400 }}> · #{c.issue}</span>
                                ) : (
                                  <span style={{ color: "var(--color-gold-2)", fontWeight: 400 }}> · planned</span>
                                )}
                              </span>
                            )}
                            <div style={{ fontSize: "11.5px", color: "var(--color-gold-2)", marginTop: "1px" }}>
                              spec: {c.ref} — {c.refNote}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
