/**
 * /universe layout — Universe site surface scaffold.
 *
 * Sets the near-black Universe background (--color-universe-bg, #0a0a0e) and
 * wires up the UniverseTopNav at the top of every Universe route.
 *
 * The Universe site uses Beaufort (font-display) for headings and a standard
 * sans-serif for body copy — both are already loaded by the root layout so
 * no additional font wiring is needed here.
 *
 * Background override: globals.css sets body to bg-hextech-black. The Universe
 * bg (#0a0a0e) is close but distinct — set explicitly on the layout wrapper so
 * overscroll rubber-band shows the correct dark tone.
 */

import { UniverseTopNavWrapper } from "./universe-top-nav-wrapper";

export default function UniverseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-universe-layout
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-universe-bg)" }}
    >
      <UniverseTopNavWrapper />
      <main>{children}</main>
    </div>
  );
}
