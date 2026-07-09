import Link from "next/link";
import { registry } from "@low/ui/registry";
import type { Area } from "@low/ui";

const AREA_LABELS: Record<Area, string> = {
  chrome: "Chrome",
  "champ-select": "Champion Select",
  collection: "Collection",
  login: "Login",
  store: "Store",
};

const AREA_ORDER: Area[] = ["chrome", "champ-select", "collection", "login", "store"];

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  const areas = AREA_ORDER.filter((a) => registry.some((e) => e.area === a));

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r border-gold-5 bg-blue-7 p-6">
        <Link href="/showcase" className="font-display text-xl uppercase tracking-widest text-gold-1">
          Showcase
        </Link>
        <nav className="mt-8 flex flex-col gap-6">
          {areas.length === 0 && (
            <p className="text-sm text-grey-2">No components yet.</p>
          )}
          {areas.map((area) => (
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
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
