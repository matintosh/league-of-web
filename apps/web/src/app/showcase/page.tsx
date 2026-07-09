import { registry } from "@low/ui/registry";

export default function ShowcaseIndex() {
  return (
    <div>
      <h1 className="font-display text-3xl uppercase tracking-widest text-gold-1">
        Component Showcase
      </h1>
      <p className="mt-4 max-w-xl text-grey-1">
        Every component of league-of-web, browsable with its variants.
        {registry.length} component{registry.length === 1 ? "" : "s"} registered.
      </p>
    </div>
  );
}
