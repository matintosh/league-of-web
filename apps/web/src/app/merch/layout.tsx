/**
 * /merch layout — imports the merch design token CSS so --color-merch-* variables
 * are available to the merch route and its descendants. The merch token set is
 * intentionally scoped here (not in the root layout) so it does not pollute the
 * Hextech client token namespace.
 *
 * Font strategy (mirrors real merch.riotgames.com):
 *   • riotSans  — display/heading/CTA font (weights 400 + 600). Self-hosted woff2
 *     files in public/fonts/ sourced from the real site's _next/static/media/.
 *     Wired onto --font-merch-display so merch headings, card titles, and CTAs
 *     render in the correct grotesque (matching the real store's letterforms).
 *   • Inter     — body copy, prices, breadcrumb chrome (same as real site).
 *     Wired onto --font-merch.
 *
 * Body background: set to var(--color-merch-bg) (#ffffff) to prevent hextech-navy
 * bleed on overscroll/rubber-band (globals.css sets body to bg-hextech-black which
 * leaks behind the merch layout on iOS and fast scrolls).
 */
import "@low/tokens/merch.css";
import "./merch-layout.css";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

/* Inter — body copy, prices, breadcrumb chrome (same role as on real merch site) */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/* riotSans — display font for headings, card titles, CTAs, footer links.
   Self-hosted from public/fonts/ (files sourced from merch.riotgames.com CDN;
   portfolio clone — consistent with how we already hotlink Riot images/logos).
   Weights 400 (body-level display) and 600 (headings + CTAs, as measured live). */
const riotSans = localFont({
  src: [
    {
      path: "../../../public/fonts/riotsans-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/riotsans-400-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../../public/fonts/riotsans-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/riotsans-600-italic.woff2",
      weight: "600",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-riotsans",
});

export default function MerchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-merch-layout
      className={`${inter.variable} ${riotSans.variable}`}
      style={
        {
          "--font-merch": "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif",
          "--font-merch-display": "var(--font-riotsans), Arial, sans-serif",
          /* Override hextech-black body bg so overscroll/rubber-band shows white,
             matching the real merch store (body bg is #ffffff on merch.riotgames.com). */
          backgroundColor: "var(--color-merch-bg)",
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
