/**
 * /merch layout — imports the merch design token CSS so --color-merch-* variables
 * are available to the merch route and its descendants. The merch token set is
 * intentionally scoped here (not in the root layout) so it does not pollute the
 * Hextech client token namespace.
 *
 * Inter is loaded here via next/font and wired onto --font-merch so all merch
 * components inherit it. The CSS variable approach keeps the font reference
 * inside layout.tsx; merch components use var(--font-merch) as usual.
 */
import "@low/tokens/merch.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default function MerchLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={inter.variable}
      style={{ "--font-merch": "var(--font-inter), system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Helvetica, Arial, sans-serif" } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
