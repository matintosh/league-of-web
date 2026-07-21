import type { Metadata } from "next";
import { Dancing_Script } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

// Real League client display face. Self-hosted .otf under ./fonts (see #539) —
// used for headings, titles, buttons via --font-display.
const beaufort = localFont({
  src: [
    { path: "./fonts/beaufortforlol-regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/beaufortforlol-medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/beaufortforlol-bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/beaufortforlol-heavy.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-beaufort",
  display: "swap",
});

// Real League client body face. Self-hosted .otf under ./fonts (see #539) —
// used for body text via --font-body.
const spiegel = localFont({
  src: [
    { path: "./fonts/spiegel-regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/spiegel-semibold.otf", weight: "600", style: "normal" },
    { path: "./fonts/spiegel-bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-spiegel",
  display: "swap",
});

// Handwriting-script face for the PlayerBanner signature flourish (issue #471).
// FONT-SUBSTITUTION divergence: the real client renders the summoner name as a
// bespoke rendered signature; no such asset is extractable, so we stand in a
// script web font. See PlayerBanner `signature` prop.
const dancingScript = Dancing_Script({
  weight: ["600", "700"],
  subsets: ["latin"],
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: "league-of-web",
  description: "A web recreation of the League of Legends client, component by component.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${beaufort.variable} ${spiegel.variable} ${dancingScript.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
