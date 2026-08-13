import type { ShowcaseEntry } from "../showcase";
import { UniverseCookieBanner } from "./universe-cookie-banner";
import { UniverseCookieBannerInteractiveDemo } from "./universe-cookie-banner.demo";

export const universeCookieBannerShowcase: ShowcaseEntry = {
  slug: "universe-cookie-banner",
  name: "Universe Cookie Banner",
  area: "universe",
  description:
    "Fixed-bottom cookie consent bar for Universe pages. Dark near-black surface, thin top hairline, left notice text with Privacy Notice link (gold-2 underline), right Manage Preferences pill button.",
  referenceImage: "universe-landing.png",
  referenceNote: "docs/reference/universe-landing.png — bottom edge cookie banner",
  variants: [
    {
      name: "Default (static, no callbacks)",
      notes: "Static cookie banner — visible=true, no callbacks passed (all props optional).",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="relative"
          style={{ height: "80px", backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseCookieBanner
            privacyHref="#"
          />
        </div>
      ),
    },
    {
      name: "With dismiss button (interactive)",
      notes: "onAccept + onManage callbacks held in client demo — click × to dismiss, Manage Preferences to handle.",
      backgrounds: ["dark"],
      render: () => <UniverseCookieBannerInteractiveDemo />,
    },
    {
      name: "Custom text (static)",
      notes: "Custom text prop — shorter notice text, no callbacks.",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="relative"
          style={{ height: "80px", backgroundColor: "var(--color-universe-bg)" }}
        >
          <UniverseCookieBanner
            text="We use cookies to improve your experience. See our"
            privacyHref="#"
          />
        </div>
      ),
    },
    {
      name: "Hidden (visible=false)",
      notes: "visible=false — renders nothing (placeholder div shown).",
      backgrounds: ["dark"],
      render: () => (
        <div
          className="flex items-center justify-center"
          style={{ height: "80px", backgroundColor: "var(--color-universe-bg)" }}
        >
          <span
            className="text-[11px] uppercase tracking-widest"
            style={{ color: "var(--color-gold-4)" }}
          >
            Banner hidden (visible=false)
          </span>
          <UniverseCookieBanner
            privacyHref="#"
            visible={false}
          />
        </div>
      ),
    },
  ],
};
