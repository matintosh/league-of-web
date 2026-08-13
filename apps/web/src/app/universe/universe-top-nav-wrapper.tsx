"use client";

/**
 * UniverseTopNavWrapper — client component that wires UniverseTopNav to real
 * routing for the /universe layout.
 *
 * Kept separate from the layout so the layout itself stays a server component.
 * Maps each nav key to a /universe route via next/navigation, derives the active
 * link from the current pathname, and wires the logo (→ home), SIGN IN (→ /login)
 * and PLAY NOW (→ /client) actions across the portfolio surfaces.
 *
 * Routes without a dedicated page yet (comics, alt-universe, map, search) fall
 * back to the closest existing surface so no nav item is a dead click.
 */

import { useRouter, usePathname } from "next/navigation";
import { UniverseTopNav } from "@low/ui";
import type { UniverseNavKey } from "@low/ui";

/** Nav key → destination route. */
const NAV_ROUTES: Record<UniverseNavKey, string> = {
  champions: "/universe/champions",
  regions: "/universe/region",
  explore: "/universe/explore",
  // No dedicated route yet — fall back to the closest existing surface.
  comics: "/universe/explore",
  "alt-universe": "/universe/explore",
  map: "/universe/region",
  search: "/universe/explore",
};

/** Derive the active nav key from the current pathname. */
function activeKeyFor(pathname: string): UniverseNavKey | undefined {
  if (pathname.startsWith("/universe/champion")) return "champions";
  if (pathname.startsWith("/universe/region")) return "regions";
  if (pathname.startsWith("/universe/explore")) return "explore";
  return undefined; // home (or showcase) — no tab highlighted
}

export function UniverseTopNavWrapper() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <UniverseTopNav
      activeKey={activeKeyFor(pathname)}
      onNavigate={(key) => router.push(NAV_ROUTES[key])}
      onHome={() => router.push("/universe")}
      onSignIn={() => router.push("/login")}
      onPlayNow={() => router.push("/client")}
    />
  );
}
