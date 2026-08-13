"use client";

/**
 * ShowcaseNav — client component for the showcase sidebar navigation.
 *
 * Renders:
 * - Desktop (≥md): static visible sidebar (no hamburger, no overlay).
 * - Mobile (<md): hamburger button toggles a full-height overlay drawer + backdrop.
 *
 * State: drawer open/close + search query. CSS breakpoints (md:hidden / hidden md:block)
 * handle visibility — no JS media queries.
 *
 * Search features (#267):
 * - Controlled text input at top of sidebar, placeholder "Search components…"
 * - Case-insensitive substring match on entry.name
 * - Area headers show total component counts in parentheses: e.g. "Chrome (42)"
 * - While filtering: areas with zero matches are hidden; results shown flat (no area header)
 * - Escape clears the search and returns to normal grouped view
 * - Cmd+K / Ctrl+K global shortcut focuses the input; listener cleaned up on unmount
 *
 * Active highlight (#269):
 * - usePathname() drives per-link active state
 * - Active: bg-blue-5 text-gold-1 border-l-2 border-gold-3 pl-1
 * - Inactive: text-grey-1 hover:bg-grey-cool hover:text-gold-1 pl-[6px]
 * - Area group header turns text-gold-2 when its area contains the active component
 */

import { useState, useRef, useEffect, RefObject } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { registry } from "@low/ui/registry";
import type { Area } from "@low/ui";

const AREA_LABELS: Record<Area, string> = {
  chrome: "Chrome",
  "champ-select": "Champion Select",
  collection: "Collection",
  login: "Login",
  store: "Store",
  lobby: "Lobby",
  merch: "Merch",
  launcher: "Launcher",
  universe: "Universe",
};

const AREA_ORDER: Area[] = ["chrome", "champ-select", "collection", "login", "store", "lobby", "merch", "launcher", "universe"];

const AREAS = AREA_ORDER.filter((a) => registry.some((e) => e.area === a));

/** Total component count per area — computed once at module level. */
const AREA_COUNTS: Record<Area, number> = AREA_ORDER.reduce(
  (acc, area) => {
    acc[area] = registry.filter((e) => e.area === area).length;
    return acc;
  },
  {} as Record<Area, number>,
);

interface NavContentProps {
  onNavigate?: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
  pathname: string;
}

/**
 * Shared nav content — used inside both the desktop aside and the mobile
 * drawer. Module-level so its component identity is stable across renders
 * (defining it inside ShowcaseNav would remount the subtree on every state
 * change). Links stay <Link> in both contexts to keep Next.js prefetching;
 * the mobile drawer passes onNavigate to close itself on tap.
 */
function NavContent({ onNavigate, query, onQueryChange, searchInputRef, pathname }: NavContentProps) {
  const trimmed = query.trim();
  const lowerQuery = trimmed.toLowerCase();
  const isFiltering = trimmed.length > 0;

  /** Entries matching the current query (all areas). */
  const matchingEntries = isFiltering
    ? registry.filter((e) => e.name.toLowerCase().includes(lowerQuery))
    : [];

  /** Active area is derived from the current pathname. */
  const activeSlug = pathname.startsWith("/showcase/") ? pathname.slice("/showcase/".length) : null;
  const activeEntry = activeSlug ? registry.find((e) => e.slug === activeSlug) : null;
  const activeArea = activeEntry?.area ?? null;

  return (
    <>
      <Link
        href="/showcase"
        className="font-display text-xl uppercase tracking-widest text-gold-1"
        onClick={onNavigate}
      >
        Showcase
      </Link>

      {/* Client Map — infra page link, secondary to main heading */}
      <Link
        href="/showcase/client-map"
        onClick={onNavigate}
        className={[
          "mt-2 block font-display text-sm uppercase tracking-widest transition-colors duration-150",
          pathname === "/showcase/client-map"
            ? "text-gold-1"
            : "text-gold-2 hover:text-gold-1",
        ].join(" ")}
      >
        Client Map
      </Link>

      {/* Search input */}
      <div className="relative mt-4">
        <input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              onQueryChange("");
              e.currentTarget.blur();
            }
          }}
          placeholder="Search components…"
          aria-label="Search components"
          className="w-full rounded-sm border border-gold-5 bg-blue-6 px-3 py-1.5 text-sm text-grey-1 placeholder:text-grey-2 focus:border-gold-3 focus:outline-none"
        />
        {query.length > 0 && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onQueryChange("");
              searchInputRef.current?.focus();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-grey-2 hover:text-grey-1"
          >
            ×
          </button>
        )}
      </div>

      <nav className="mt-6 flex flex-col gap-6">
        {/* Flat search results — rendered when query is active */}
        {isFiltering && (
          <>
            {matchingEntries.length === 0 && (
              <p className="text-sm text-grey-2">No components found.</p>
            )}
            {matchingEntries.length > 0 && (
              <ul className="flex flex-col gap-1">
                {matchingEntries.map((e) => {
                  const isActive = pathname === `/showcase/${e.slug}`;
                  return (
                    <li key={e.slug}>
                      <Link
                        href={`/showcase/${e.slug}`}
                        onClick={onNavigate}
                        className={
                          isActive
                            ? "block border-l-2 border-gold-3 bg-blue-5 pl-1 py-1 text-sm text-gold-1"
                            : "block pl-[6px] py-1 text-sm text-grey-1 transition-colors hover:bg-grey-cool hover:text-gold-1"
                        }
                      >
                        {e.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}

        {/* Grouped area view — rendered when no query is active */}
        {!isFiltering && (
          <>
            {AREAS.length === 0 && (
              <p className="text-sm text-grey-2">No components yet.</p>
            )}
            {AREAS.map((area) => {
              const isActiveArea = activeArea === area;
              return (
                <div key={area}>
                  <h2
                    className={[
                      "mb-2 text-xs uppercase tracking-widest",
                      isActiveArea ? "text-gold-2" : "text-gold-4",
                    ].join(" ")}
                  >
                    {AREA_LABELS[area]}{" "}
                    <span className="text-gold-4 text-xs">
                      ({AREA_COUNTS[area]})
                    </span>
                  </h2>
                  <ul className="flex flex-col gap-1">
                    {registry
                      .filter((e) => e.area === area)
                      .map((e) => {
                        const isActive = pathname === `/showcase/${e.slug}`;
                        return (
                          <li key={e.slug}>
                            <Link
                              href={`/showcase/${e.slug}`}
                              onClick={onNavigate}
                              className={
                                isActive
                                  ? "block border-l-2 border-gold-3 bg-blue-5 pl-1 py-1 text-sm text-gold-1"
                                  : "block pl-[6px] py-1 text-sm text-grey-1 transition-colors hover:bg-grey-cool hover:text-gold-1"
                              }
                            >
                              {e.name}
                            </Link>
                          </li>
                        );
                      })}
                  </ul>
                </div>
              );
            })}
          </>
        )}
      </nav>
    </>
  );
}

export function ShowcaseNav() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  function close() {
    setOpen(false);
  }

  /** Cmd+K / Ctrl+K global shortcut — focuses the visible search input.
   * Two NavContent instances share searchInputRef; the last one mounted wins
   * (the mobile drawer, which is display:none). Instead, query the visible
   * aside directly so focus always lands on the rendered input.
   */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const visibleInput = document.querySelector<HTMLInputElement>(
          "aside:not([aria-hidden='true']) input[type='text']",
        );
        visibleInput?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const navProps: NavContentProps = {
    query,
    onQueryChange: setQuery,
    searchInputRef,
    pathname,
  };

  return (
    <>
      {/* Desktop sidebar — hidden below md */}
      <aside className="hidden w-64 shrink-0 border-r border-gold-5 bg-blue-7 p-6 md:block">
        <NavContent {...navProps} />
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
        <NavContent {...navProps} onNavigate={close} />
      </aside>
    </>
  );
}
