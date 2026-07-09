import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="font-display text-5xl uppercase tracking-widest text-gold-1">
        League of Web
      </h1>
      <p className="max-w-md text-center text-grey-1">
        A web recreation of the League of Legends client, built component by component.
      </p>
      <Link
        href="/showcase"
        className="border border-gold-4 px-8 py-3 font-display text-sm uppercase tracking-widest text-gold-2 transition-colors hover:border-gold-2 hover:text-gold-1"
      >
        Component Showcase
      </Link>
    </main>
  );
}
