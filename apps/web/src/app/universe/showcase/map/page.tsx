/**
 * /universe/showcase/map — Universe site map.
 *
 * Visual index of every page in the Universe surface clone: each entry shows the
 * reference screenshot (the 1:1 target), the route, and build status (Live → link
 * to the built route; Planned → build issue). Reviewers use this to traverse the
 * whole surface and diff each page against its reference.
 *
 * Nested under /universe/layout.tsx (universe tokens + top-nav). Server component:
 * no 'use client', no event handlers. Reference thumbnails are served from
 * /public/universe-map/*.png.
 */

import Link from "next/link";

type PageStatus = "live" | "planned";

interface UniversePage {
  name: string;
  route: string;
  ref: string; // filename under /universe-map/
  status: PageStatus;
  issue?: number;
  note: string;
}

const PAGES: UniversePage[] = [
  {
    name: "Home / Landing",
    route: "/universe",
    ref: "universe-landing.png",
    status: "live",
    note: "Top nav, hero splash carousel, LATEST grid, FEATURED grid.",
  },
  {
    name: "Explore",
    route: "/universe/explore",
    ref: "universe-explore.png",
    status: "planned",
    note: "Filter/sort bar + 4-column story-card grid across all content types.",
  },
  {
    name: "Champions",
    route: "/universe/champions",
    ref: "universe-live-champions.png",
    status: "planned",
    note: "Crest title + sort row + tall champion-card splash grid.",
  },
  {
    name: "Champion Bio",
    route: "/universe/champion/lux",
    ref: "universe-live-champion-bio.png",
    status: "planned",
    note: "Full-bleed splash hero, huge serif name + subtitle, breadcrumb, story rail.",
  },
  {
    name: "Regions",
    route: "/universe/region",
    ref: "universe-live-regions.png",
    status: "planned",
    note: "Runeterra region index — region tiles into region detail pages.",
  },
];

const liveCount = PAGES.filter((p) => p.status === "live").length;

export const metadata = {
  title: "Universe — Site Map",
  description: "Every page in the League Universe surface clone, with references.",
};

export default function UniverseSiteMapPage() {
  return (
    <div style={{ minHeight: "100vh", color: "var(--color-universe-story-ink)" }}>
      <style>{`
        .umap-card {
          border: 1px solid var(--color-universe-nav-border);
          background-color: var(--color-universe-card-bg);
          transition: border-color 150ms, transform 150ms, box-shadow 150ms;
          height: 100%;
          box-sizing: border-box;
          overflow: hidden;
        }
        .umap-card:hover {
          border-color: var(--color-gold-3);
          transform: translateY(-2px);
          box-shadow: 0 3px 22px color-mix(in srgb, var(--color-hextech-black) 65%, transparent);
        }
        .umap-link { text-decoration: none; display: block; }
        .umap-thumb {
          display: block; width: 100%; aspect-ratio: 16 / 10;
          object-fit: cover; object-position: top center;
          border-bottom: 1px solid var(--color-universe-nav-border);
        }
        .umap-back {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--color-gold-2); text-decoration: none; transition: color 150ms;
        }
        .umap-back:hover { color: var(--color-gold-1); }
      `}</style>

      {/* Hero */}
      <section
        style={{
          borderBottom: "1px solid var(--color-universe-nav-border)",
          padding: "56px 24px 40px",
        }}
      >
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <Link href="/universe/showcase" className="umap-back">
            ← Components
          </Link>
          <h1
            className="font-display"
            style={{
              marginTop: "20px",
              fontSize: "40px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--color-gold-1)",
            }}
          >
            Site Map
          </h1>
          <p
            style={{
              marginTop: "10px",
              maxWidth: "640px",
              fontSize: "15px",
              lineHeight: 1.6,
            }}
          >
            Every page in the Universe surface clone with its 1:1 reference. {liveCount}{" "}
            of {PAGES.length} live — the rest are being assembled by the build loop.
            Reviewers traverse this map to diff each page against its reference.
          </p>
        </div>
      </section>

      {/* Page grid */}
      <section style={{ padding: "36px 24px 80px" }}>
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: "22px",
          }}
        >
          {PAGES.map((page) => {
            const badge =
              page.status === "live"
                ? { text: "Live", fg: "var(--color-gold-1)", bd: "var(--color-gold-3)" }
                : { text: "Planned", fg: "var(--color-gold-2)", bd: "var(--color-universe-nav-border)" };
            const card = (
              <div className="umap-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="umap-thumb"
                  src={`/universe-map/${page.ref}`}
                  alt={`${page.name} reference`}
                />
                <div style={{ padding: "18px 20px 22px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <h2
                      className="font-display"
                      style={{
                        fontSize: "17px",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--color-gold-1)",
                      }}
                    >
                      {page.name}
                    </h2>
                    <span
                      style={{
                        flexShrink: 0,
                        fontSize: "11px",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: badge.fg,
                        border: `1px solid ${badge.bd}`,
                        borderRadius: "2px",
                        padding: "2px 8px",
                      }}
                    >
                      {badge.text}
                    </span>
                  </div>
                  <code
                    style={{
                      display: "block",
                      marginTop: "6px",
                      fontSize: "12px",
                      color: "var(--color-gold-2)",
                    }}
                  >
                    {page.route}
                  </code>
                  <p style={{ marginTop: "10px", fontSize: "13px", lineHeight: 1.5 }}>
                    {page.note}
                  </p>
                </div>
              </div>
            );
            return page.status === "live" ? (
              <Link key={page.route} href={page.route} className="umap-link">
                {card}
              </Link>
            ) : (
              <div key={page.route}>{card}</div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
