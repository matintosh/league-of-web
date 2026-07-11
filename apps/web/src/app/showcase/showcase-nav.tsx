"use client";

/**
 * ShowcaseNav — client component for the showcase sidebar navigation.
 *
 * Renders:
 * - Desktop (≥md): static visible sidebar (no hamburger, no overlay).
 * - Mobile (<md): hamburger button toggles a full-height overlay drawer + backdrop.
 *
 * State is drawer open/close only. CSS breakpoints (md:hidden / hidden md:block)
 * handle visibility — no JS media queries.
 *
 * Out of scope: Escape-key close and focus trap (future enhancement).
 */

import { useState } from "react";
import Link from "next/link";
import { registry } from "@low/ui/registry";
import type { Area } from "@low/ui";

const AREA_LABELS: Record<Area, string> = {
  chrome: "Chrome",
  "champ-select": "Champion Select",
  collection: "Collection",
  login: "Login",
  store: "Store",
  lobby: "Lobby",
};

const AREA_ORDER: Area[] = ["chrome", "champ-select", "collection", "login", "store", "lobby"];

const AREAS = AREA_ORDER.filter((a) => registry.some((e) => e.area === a));

/**
 * Shared nav content — used inside both the desktop aside and the mobile
 * drawer. Module-level so its component identity is stable across renders
 * (defining it inside ShowcaseNav would remount the subtree on every state
 * change). Links stay <Link> in both contexts to keep Next.js prefetching;
 * the mobile drawer passes onNavigate to close itself on tap.
 */
function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <Link
        href="/showcase"
        className="font-display text-xl uppercase tracking-widest text-gold-1"
        onClick={onNavigate}
      >
        Showcase
      </Link>
      <nav className="mt-8 flex flex-col gap-6">
        {AREAS.length === 0 && (
          <p className="text-sm text-grey-2">No components yet.</p>
        )}
        {AREAS.map((area) => (
          <div key={area}>
            <h2 className="mb-2 text-xs uppercase tracking-widest text-gold-4">
              {AREA_LABELS[area]}
            </h2>
            <ul className="flex flex-col gap-1">
              {registry
                .filter((e) => e.area === area)
                .map((e) => (
                  <li key={e.slug}>
                    <Link
                      href={`/showcase/${e.slug}`}
                      onClick={onNavigate}
                      className="block px-2 py-1 text-sm text-grey-1 transition-colors hover:bg-grey-cool hover:text-gold-1"
                    >
                      {e.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </nav>
    </>
  );
}

export function ShowcaseNav() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <>
      {/* Desktop sidebar — hidden below md */}
      <aside className="hidden w-64 shrink-0 border-r border-gold-5 bg-blue-7 p-6 md:block">
        <NavContent />
      </aside>

      {/* Mobile: hamburger button — visible only below md */}
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded bg-blue-7 text-gold-1 md:hidden"
      >
        {/* Hamburger icon (three lines) */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <rect x="2" y="4" width="16" height="2" fill="currentColor" />
          <rect x="2" y="9" width="16" height="2" fill="currentColor" />
          <rect x="2" y="14" width="16" height="2" fill="currentColor" />
        </svg>
      </button>

      {/* Mobile: backdrop — z-30, one level below the drawer so taps anywhere
          on the grey overlay outside the drawer reach it */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-hextech-black/70 md:hidden"
          aria-hidden="true"
          onClick={close}
        />
      )}

      {/* Mobile: overlay drawer */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-gold-5 bg-blue-7 p-6 md:hidden",
          "transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-hidden={!open}
      >
        <NavContent onNavigate={close} />
      </aside>
    </>
  );
}
