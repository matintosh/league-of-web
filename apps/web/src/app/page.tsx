import Link from "next/link";
import { UniverseCrestDivider } from "@low/ui";
import { championSplashUrl } from "@low/fixtures";

/**
 * Landing hub — root of league-of-web.
 *
 * Editorial hub in the League Universe design language (near-black + gold,
 * Beaufort display type, champion-splash cards). Entry points to every surface:
 * Client, Login, Launcher, Merch, and the Universe lore-hub clone — plus a
 * utility link to the component showcase.
 *
 * Server component: no 'use client'. Tokens-only; hover via a <style> block.
 * Card backdrops use championSplashUrl (real Data Dragon art) supplied here at
 * the page layer — @low/ui components never fetch.
 */

interface HubProject {
  id: string;
  label: string;
  system: string; // design-system overline
  description: string;
  href: string;
  /** DDragon champion id for the splash backdrop. */
  champion: string;
  showcase?: { label: string; href: string };
}

const PROJECTS: HubProject[] = [
  {
    id: "universe",
    label: "Universe",
    system: "Universe design system",
    description:
      "1:1 clone of the League Universe lore hub — champion bios, regions, and stories in an editorial dark/gold language.",
    href: "/universe",
    champion: "Lux",
    showcase: { label: "Components", href: "/universe/showcase" },
  },
  {
    id: "client",
    label: "Client",
    system: "Hextech design system",
    description:
      "1:1 web recreation of the League of Legends client — interactive, component-for-component faithful.",
    href: "/client",
    champion: "Jayce",
  },
  {
    id: "login",
    label: "Login",
    system: "Hextech design system",
    description:
      "The League sign-in screen — animated background, credential form, and Hextech chrome.",
    href: "/login",
    champion: "Caitlyn",
  },
  {
    id: "launcher",
    label: "Launcher",
    system: "Launcher design system",
    description:
      "The Riot/League game launcher — Overview, Patch Notes, Esports, plus the Riot multi-game Home and Games library.",
    href: "/launcher",
    champion: "Ekko",
  },
  {
    id: "merch",
    label: "Merch",
    system: "Merch design system",
    description:
      "Riot merch store scaffold — a section with its own modern e-commerce design language.",
    href: "/merch",
    champion: "Jinx",
    showcase: { label: "Components", href: "/merch/showcase" },
  },
];

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-universe-bg)",
        color: "var(--color-universe-story-ink)",
      }}
    >
      <style>{`
        .hub-card {
          position: relative;
          display: block;
          overflow: hidden;
          border: 1px solid var(--color-universe-nav-border);
          background-color: var(--color-universe-card-bg);
          aspect-ratio: 3 / 4;
          transition: border-color 200ms, transform 200ms, box-shadow 200ms;
        }
        .hub-card:hover {
          border-color: var(--color-gold-3);
          transform: translateY(-3px);
          box-shadow: 0 6px 30px color-mix(in srgb, var(--color-hextech-black) 70%, transparent);
        }
        .hub-card-art {
          position: absolute; inset: 0; width: 100%; height: 100%;
          object-fit: cover; object-position: top center;
          transition: transform 400ms ease, opacity 200ms;
        }
        .hub-card:hover .hub-card-art { transform: scale(1.05); opacity: 0.92; }
        .hub-card-scrim {
          position: absolute; inset: 0;
          background: linear-gradient(
            to top,
            color-mix(in srgb, var(--color-hextech-black) 92%, transparent) 0%,
            color-mix(in srgb, var(--color-hextech-black) 70%, transparent) 42%,
            color-mix(in srgb, var(--color-hextech-black) 12%, transparent) 100%
          );
        }
        .hub-enter {
          text-decoration: none; letter-spacing: 0.12em; text-transform: uppercase;
          font-size: 12px; color: var(--color-gold-1);
          border-bottom: 1px solid transparent; transition: border-color 150ms;
        }
        .hub-card:hover .hub-enter { border-color: var(--color-gold-3); }
        .hub-shop {
          text-decoration: none; letter-spacing: 0.08em; text-transform: uppercase;
          font-size: 11px; color: var(--color-gold-2); transition: color 150ms;
        }
        .hub-shop:hover { color: var(--color-gold-1); }
        .hub-utility {
          text-decoration: none; letter-spacing: 0.1em; text-transform: uppercase;
          font-size: 13px; color: var(--color-gold-2); transition: color 150ms;
        }
        .hub-utility:hover { color: var(--color-gold-1); }
      `}</style>

      {/* ── Masthead ─────────────────────────────────────────────── */}
      <header style={{ padding: "80px 24px 8px", textAlign: "center" }}>
        <p
          style={{
            fontSize: "12px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--color-gold-2)",
          }}
        >
          A portfolio project
        </p>
        <h1
          className="font-display"
          style={{
            marginTop: "14px",
            fontSize: "clamp(40px, 7vw, 76px)",
            lineHeight: 1.02,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-gold-1)",
          }}
        >
          League of Web
        </h1>
        <p
          style={{
            margin: "18px auto 0",
            maxWidth: "620px",
            fontSize: "15px",
            lineHeight: 1.65,
            color: "var(--color-universe-story-ink)",
          }}
        >
          1:1 web recreations of Riot&rsquo;s surfaces — the LoL client, the sign-in
          screen, the game launcher, a merch store, and the Universe lore hub — each
          built component-by-component and browsable in a live showcase.
        </p>
      </header>

      {/* ── Projects ─────────────────────────────────────────────── */}
      <section style={{ padding: "40px 24px 24px" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
          <UniverseCrestDivider label="Projects" />

          <div
            style={{
              marginTop: "36px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "20px",
            }}
          >
            {PROJECTS.map((p) => (
              <div key={p.id} className="hub-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="hub-card-art"
                  src={championSplashUrl(p.champion)}
                  alt=""
                  aria-hidden="true"
                />
                <div className="hub-card-scrim" />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "22px 22px 24px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--color-gold-2)",
                    }}
                  >
                    {p.system}
                  </p>
                  <Link
                    href={p.href}
                    className="font-display"
                    style={{
                      marginTop: "6px",
                      fontSize: "28px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--color-gold-1)",
                      textDecoration: "none",
                    }}
                  >
                    {p.label}
                  </Link>
                  <p
                    style={{
                      marginTop: "10px",
                      fontSize: "13px",
                      lineHeight: 1.5,
                      color: "var(--color-universe-story-ink)",
                    }}
                  >
                    {p.description}
                  </p>
                  <div
                    style={{
                      marginTop: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                    }}
                  >
                    <Link href={p.href} className="hub-enter">
                      Enter →
                    </Link>
                    {p.showcase && (
                      <Link href={p.showcase.href} className="hub-shop">
                        {p.showcase.label} →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer utility ───────────────────────────────────────── */}
      <footer
        style={{
          padding: "16px 24px 72px",
          textAlign: "center",
        }}
      >
        <Link href="/showcase" className="hub-utility">
          Component Showcase →
        </Link>
      </footer>
    </main>
  );
}
