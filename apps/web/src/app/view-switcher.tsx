"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * ViewSwitcher — slim portfolio-level tab strip placed ABOVE the 1280×720 client window.
 *
 * Renders on / and /login only (imported directly by each page — NOT in root layout,
 * so /showcase never sees it).
 *
 * Active tab: derived from `usePathname()`. Active treatment mirrors TabBar:
 * font-display uppercase tracking-widest text-sm, text-gold-1 + 2px border-gold-3 underline.
 *
 * Contrast decision: on /login the background is login-bg (white #ffffff).
 * text-grey-1 (#a09b8c) on white yields ~2.5:1 contrast — below WCAG AA 4.5:1.
 * Therefore inactive tabs use text-login-ink (#343434, ~12.8:1) when on the /login route,
 * falling back to text-grey-1 on the dark hextech-black background of /.
 */
export function ViewSwitcher() {
  const pathname = usePathname();
  const onLoginRoute = pathname === "/login";
  // The ViewSwitcher floats above /client and /login only; active detection
  // uses exact match so /client doesn't fire on / (the hub) or /login.
  const inactiveColor = onLoginRoute ? "text-login-ink" : "text-grey-1";

  const tabs = [
    { label: "Client", href: "/client" },
    { label: "Login", href: "/login" },
  ];

  return (
    <nav
      aria-label="Experience switcher"
      className="flex items-end justify-center gap-8 pb-2"
    >
      {tabs.map(({ label, href }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={[
              "shrink-0 font-display uppercase tracking-widest text-sm",
              "border-b-2 pb-0.5 transition-colors duration-150",
              isActive
                ? "border-gold-3 text-gold-1"
                : `border-transparent ${inactiveColor} hover:text-gold-1`,
            ].join(" ")}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
