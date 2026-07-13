import { notFound } from "next/navigation";
import { registry } from "@low/ui/registry";
import { ReferenceToggle } from "./reference-toggle.client";
import { VariantCanvas } from "./variant-canvas.client";

export function generateStaticParams() {
  return registry.map((e) => ({ slug: e.slug }));
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = registry.find((e) => e.slug === slug);
  if (!entry) notFound();

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gold-4">{entry.area}</p>
      <h1 className="mt-1 font-display text-3xl uppercase tracking-widest text-gold-1">
        {entry.name}
      </h1>
      <p className="mt-3 max-w-xl text-grey-1">{entry.description}</p>

      {entry.referenceImage && (
        <div className="mt-8">
          <ReferenceToggle
            referenceImage={entry.referenceImage}
            referenceNote={entry.referenceNote}
          />
        </div>
      )}

      <div className="mt-4 flex flex-col gap-8">
        {entry.variants.map((variant) => (
          <section key={variant.name}>
            <h2 className="mb-3 border-b border-gold-5 pb-2 text-sm uppercase tracking-widest text-gold-2">
              {variant.name}
            </h2>
            <VariantCanvas backgrounds={variant.backgrounds ?? ["dark"]}>
                {variant.render()}
              </VariantCanvas>
            {variant.notes && (
              <div className="mt-2 border-l-2 border-gold-4 bg-blue-6 px-3 py-2 text-sm text-grey-1">
                {variant.notes}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
