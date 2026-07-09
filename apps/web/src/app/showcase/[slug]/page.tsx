import { notFound } from "next/navigation";
import { registry } from "@low/ui/registry";

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

      <div className="mt-10 flex flex-col gap-8">
        {entry.variants.map((variant) => (
          <section key={variant.name}>
            <h2 className="mb-3 text-sm uppercase tracking-widest text-gold-2">
              {variant.name}
            </h2>
            <div className="rounded-sm border border-grey-4 bg-blue-7 p-10">
              {variant.render()}
            </div>
            {variant.notes && <p className="mt-2 text-sm text-grey-2">{variant.notes}</p>}
          </section>
        ))}
      </div>
    </div>
  );
}
