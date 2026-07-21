import type { ShowcaseEntry } from "../showcase";

/**
 * Typography specimen for the two real League client faces plus the signature
 * stand-in (issue #539). Pure static text — no component, server-safe.
 *
 * - BeaufortforLOL → `font-display` (headings, titles, buttons). Weights 400/500/700/900.
 * - Spiegel → `font-body` (body copy). Weights 400/600/700.
 * - Dancing Script → `font-signature` (PlayerBanner signature stand-in, #471).
 */

/** One display-face specimen row: label on the left, sample heading on the right. */
function DisplayRow({
  label,
  weight,
  sample,
}: {
  label: string;
  weight: 400 | 500 | 700 | 900;
  sample: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-gold-4/20 pb-4">
      <span className="font-body text-xs uppercase tracking-widest text-grey-1">{label}</span>
      <span
        className="font-display uppercase tracking-wide text-gold-1"
        style={{ fontWeight: weight, fontSize: "2rem" }}
      >
        {sample}
      </span>
    </div>
  );
}

/** One body-face specimen row: label on the left, sample paragraph on the right. */
function BodyRow({
  label,
  weight,
  sample,
}: {
  label: string;
  weight: 400 | 600 | 700;
  sample: string;
}) {
  return (
    <div className="flex flex-col gap-1 border-b border-gold-4/20 pb-4">
      <span className="font-body text-xs uppercase tracking-widest text-grey-1">{label}</span>
      <p className="font-body text-base text-grey-1" style={{ fontWeight: weight }}>
        {sample}
      </p>
    </div>
  );
}

export const typographyShowcase: ShowcaseEntry = {
  slug: "typography",
  name: "Typography",
  area: "chrome",
  description:
    "The real self-hosted League client type system — BeaufortforLOL for display (headings, titles, buttons) and Spiegel for body copy, plus the Dancing Script signature stand-in. Faces are wired to the --font-display / --font-body / --font-signature tokens.",
  variants: [
    {
      name: "Display — BeaufortforLOL",
      notes:
        "font-display (--font-beaufort). Angular condensed League display face; used for headings, PLAY, GO TO STORE, section titles. Weights 400/500/700/900.",
      render: () => (
        <div data-shot="typography-display" className="flex w-full flex-col gap-4 px-8 py-4">
          <DisplayRow label="Regular · 400" weight={400} sample="Summoner's Rift" />
          <DisplayRow label="Medium · 500" weight={500} sample="Ranked Solo/Duo" />
          <DisplayRow label="Bold · 700" weight={700} sample="Play" />
          <DisplayRow label="Heavy · 900" weight={900} sample="Victory" />
        </div>
      ),
    },
    {
      name: "Body — Spiegel",
      notes: "font-body (--font-spiegel). Client body/UI face for paragraphs and labels. Weights 400/600/700.",
      render: () => (
        <div data-shot="typography-body" className="flex w-full flex-col gap-4 px-8 py-4">
          <BodyRow
            label="Regular · 400"
            weight={400}
            sample="Battle across the Fields of Justice with your team to destroy the enemy Nexus."
          />
          <BodyRow
            label="Semibold · 600"
            weight={600}
            sample="Battle across the Fields of Justice with your team to destroy the enemy Nexus."
          />
          <BodyRow
            label="Bold · 700"
            weight={700}
            sample="Battle across the Fields of Justice with your team to destroy the enemy Nexus."
          />
        </div>
      ),
    },
    {
      name: "Signature — Dancing Script",
      notes:
        "font-signature (--font-dancing). Handwriting-script stand-in for the client's rendered summoner-name signature on PlayerBanner (#471).",
      render: () => (
        <div data-shot="typography-signature" className="flex w-full flex-col gap-1 px-8 py-4">
          <span className="font-body text-xs uppercase tracking-widest text-grey-1">
            Signature · 700
          </span>
          <span className="font-signature text-gold-1" style={{ fontSize: "3rem" }}>
            Faker
          </span>
        </div>
      ),
    },
  ],
};
