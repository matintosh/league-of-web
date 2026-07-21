import type { Metadata } from "next";
import { Inter, Marcellus, Dancing_Script } from "next/font/google";
import "./globals.css";

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

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
      className={`${marcellus.variable} ${inter.variable} ${dancingScript.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
