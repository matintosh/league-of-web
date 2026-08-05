import { notFound } from "next/navigation";
import { registry } from "@low/ui/registry";
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

  const variantsList = (
    <div className="flex flex-col gap-8">
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
  );

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gold-4">{entry.area}</p>
      <h1 className="mt-1 font-display text-3xl uppercase tracking-widest text-gold-1">
        {entry.name}
      </h1>
      <p className="mt-3 max-w-xl text-grey-1">{entry.description}</p>

      {entry.referenceImage ? (
        /* Two-column layout: sticky reference panel left, variants right */
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-6">
          {/* Reference panel — sticky on lg+ so it stays visible while scrolling variants */}
          <div className="shrink-0 lg:sticky lg:top-6 lg:w-[420px]">
            <p className="mb-2 text-xs uppercase tracking-widest text-gold-4">Reference</p>
            {entry.referenceNote && (
              <p className="mb-2 text-xs text-grey-2">{entry.referenceNote}</p>
            )}
            <div className="overflow-hidden rounded-sm border border-grey-4">
              <img
                src={`/docs-ref/${entry.referenceImage}`}
                alt={`Reference screenshot: ${entry.referenceImage}`}
                className="max-w-full"
              />
            </div>
            <p className="mt-2 text-xs text-grey-3">
              <code className="font-mono text-grey-2">{entry.referenceImage}</code>
            </p>
          </div>

          {/* Variants — take remaining width */}
          <div className="min-w-0 flex-1">
            {variantsList}
          </div>
        </div>
      ) : (
        /* Single-column layout when no reference image */
        <div className="mt-4">
          {variantsList}
        </div>
      )}
    </div>
  );
}
