import type { ShowcaseEntry } from "../showcase";
import { UniverseBreadcrumb } from "./universe-breadcrumb";

export const universeBreadcrumbShowcase: ShowcaseEntry = {
  slug: "universe-breadcrumb",
  name: "Universe Breadcrumb",
  area: "universe",
  description:
    "Caps breadcrumb trail for Universe interior pages. Diamond glyph prefix, gold-2 link segments, gold-1 current (last) segment, '›' separators.",
  referenceImage: "universe-live-champion-bio.png",
  referenceNote:
    "docs/reference/universe-live-champion-bio.png top-left + universe-live-champions.png",
  variants: [
    {
      name: "Champion bio — CHAMPIONS › LUX",
      notes: "Two segments: CHAMPIONS links, LUX is current (gold-1, no link).",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="px-6 py-4"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseBreadcrumb
            items={[
              { label: "CHAMPIONS", href: "/universe/champions" },
              { label: "LUX" },
            ]}
          />
        </div>
      ),
    },
    {
      name: "Champions page — CHAMPIONS",
      notes: "Single segment (current page, no link).",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="px-6 py-4"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseBreadcrumb
            items={[{ label: "CHAMPIONS" }]}
          />
        </div>
      ),
    },
    {
      name: "Deep trail — HOME › REGIONS › DEMACIA",
      notes: "Three segments — HOME and REGIONS link, DEMACIA is current.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="px-6 py-4"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseBreadcrumb
            items={[
              { label: "HOME", href: "/" },
              { label: "REGIONS", href: "/universe/regions" },
              { label: "DEMACIA" },
            ]}
          />
        </div>
      ),
    },
    {
      name: "Comics trail — COMICS › THE RUINATION",
      notes: "Two segments, comics context.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="px-6 py-4"
          style={{ backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseBreadcrumb
            items={[
              { label: "COMICS", href: "/universe/comics" },
              { label: "THE RUINATION" },
            ]}
          />
        </div>
      ),
    },
  ],
};
