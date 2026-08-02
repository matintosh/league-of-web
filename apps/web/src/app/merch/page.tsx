import { MerchStore } from "@low/ui";
import type { MerchNavLink } from "@low/ui";

const NAV_LINKS: MerchNavLink[] = [
  { id: "new",        label: "New Arrivals", href: "#" },
  { id: "apparel",    label: "Apparel",      href: "#" },
  { id: "lifestyle",  label: "Lifestyle",    href: "#" },
  { id: "sale",       label: "Sale",         href: "#" },
];

/**
 * /merch page — Riot merch store scaffold.
 *
 * This is the FOUNDATION shell: MerchStore provides header + nav + footer;
 * the main slot carries a "coming together" placeholder until later build
 * loops fill in real merch content. Merch tokens (--color-merch-*) are loaded
 * by the /merch layout and apply to this entire route subtree.
 */
export default function MerchPage() {
  return (
    <MerchStore navLinks={NAV_LINKS}>
      {/* Coming-together placeholder — replaced by product grids / content loops */}
      <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-32 text-center">
        <p
          className="text-xs uppercase tracking-[0.3em]"
          style={{ color: "var(--color-merch-red, #d13639)" }}
        >
          Coming soon
        </p>
        <h2
          className="mt-4 text-3xl font-bold uppercase tracking-widest"
          style={{ color: "var(--color-merch-ink, #1a1a1a)" }}
        >
          Riot Merch
        </h2>
        <p
          className="mt-4 max-w-md text-base"
          style={{ color: "var(--color-merch-muted, #737373)" }}
        >
          The merch store is coming together. Official Riot Games merchandise
          — apparel, lifestyle, and collectibles — will be available here soon.
        </p>
        <a
          href="/"
          className="mt-10 inline-flex items-center gap-2 border px-6 py-3 text-sm uppercase tracking-wider transition-opacity duration-150 hover:opacity-70"
          style={{
            borderColor: "var(--color-merch-border, #e5e5e5)",
            color: "var(--color-merch-ink, #1a1a1a)",
          }}
        >
          ← Back to hub
        </a>
      </section>
    </MerchStore>
  );
}
