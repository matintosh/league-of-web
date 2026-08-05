import { ShowcaseNav } from "./showcase-nav";

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <ShowcaseNav />
      <main className="min-w-0 w-full p-4 md:flex-1 md:p-10">{children}</main>
    </div>
  );
}
