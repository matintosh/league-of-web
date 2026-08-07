/**
 * Typed dummy content for the /merch/pages/[slug] info-page route.
 *
 * MERCH FIXTURES — values only. Types are exported for @low/ui to import.
 * Content is intentionally representative (FAQ / Shipping / Returns style)
 * to match the real merch.riotgames.com prose pages.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MerchInfoBlock {
  /** Block type drives rendering: heading vs prose vs list vs accordion. */
  type: "paragraph" | "heading2" | "heading3" | "ul" | "ol" | "faq-accordion";
  /** Raw text for headings/paragraphs; array of strings for ul/ol items. */
  content: string | string[];
  /**
   * FAQ accordion sections — only used when type === "faq-accordion".
   * Each section has a category heading and an ordered list of Q&A pairs.
   */
  sections?: MerchFaqSection[];
}

/** A Q&A pair within an FAQ accordion section. */
export interface MerchFaqItem {
  /** The question text — rendered as the collapsible trigger (h3). */
  question: string;
  /** The answer text — rendered inside the collapsed panel. */
  answer: string;
}

/** A category section within the FAQ accordion. */
export interface MerchFaqSection {
  /**
   * Category heading — rendered as h2 (Inter 18px/600, no uppercase, black).
   * Real labels: "GENERAL QUESTIONS", "BILLING AND ORDER QUESTIONS", "TECHNICAL QUESTIONS".
   */
  heading: string;
  /** Ordered Q&A pairs within this category. */
  items: MerchFaqItem[];
}

// ---------------------------------------------------------------------------
// Support form types (MerchSupportForm)
// ---------------------------------------------------------------------------

export type MerchSupportFormFieldType = "text" | "email";

export interface MerchSupportFormField {
  /** Input id and name attribute. */
  id: string;
  /** Label text above the input. */
  label: string;
  type: MerchSupportFormFieldType;
}

export interface MerchSupportFormConfig {
  /**
   * Form layout variant.
   * "row" = fields side-by-side (flex row) — order-status & gift-card-balance.
   * "lookup" = field+button in a 2-col grid with an illustration — verify-your-product.
   */
  variant: "row" | "lookup";
  fields: MerchSupportFormField[];
  /** Button label text (displayed uppercase). */
  submitLabel: string;
  /** Optional static illustration src for the lookup variant's left column. */
  illustrationSrc?: string;
  illustrationAlt?: string;
}

export interface MerchInfoPageContent {
  /** Section h2 title rendered in the content area, e.g. "Frequently Asked Questions". */
  title: string;
  /** Ordered list of content blocks rendered top-to-bottom. Omit when formConfig is present. */
  blocks: MerchInfoBlock[];
  /**
   * When set, the page route renders MerchSupportForm instead of MerchInfoPage prose.
   * Only the 3 form slugs (order-status, gift-card-balance, verify-your-product) set this.
   */
  formConfig?: MerchSupportFormConfig;
}

/**
 * A single tab in the MerchSupportTabStrip.
 * Measured from merch.riotgames.com support portal (9 sections).
 */
export interface MerchSupportTab {
  /** URL-safe slug matching /merch/pages/[slug]. */
  slug: string;
  /** Display label for the pill button. */
  label: string;
}

/**
 * Ordered list of the 9 support sections matching the real tab strip on
 * merch.riotgames.com/en-us/faqs/ and sibling pages.
 * Fixture values only — supplied to components by the page route.
 */
/**
 * Ordered list of the 9 support section tabs matching the real tab strip on
 * merch.riotgames.com/en-us/faqs/ — measured from live site, exact labels.
 * Fixture values only — supplied to components by the page route.
 */
export const MERCH_SUPPORT_TABS: MerchSupportTab[] = [
  { slug: "accessibility",        label: "accessibility" },
  { slug: "collectability-guide", label: "collectability guide" },
  { slug: "faqs",                 label: "faqs" },
  { slug: "gift-card-balance",    label: "gift card balance" },
  { slug: "order-status",         label: "order status / code lookup" },
  { slug: "returns",              label: "return policy" },
  { slug: "riot-mart",            label: "riot mart / my shop" },
  { slug: "shipping",             label: "shipping methods & estimated arrival times" },
  { slug: "verify-your-product",  label: "verify your product" },
];

// ---------------------------------------------------------------------------
// Content map keyed by slug
// ---------------------------------------------------------------------------

export const MERCH_INFO_PAGES: Record<string, MerchInfoPageContent> = {
  faqs: {
    /*
     * Real page title: 'FAQs' (not 'Frequently Asked Questions') per issue #826.
     * Real: h2 'FAQs' with 32px top+bottom padding on the content area.
     */
    title: "FAQs",
    blocks: [
      {
        type: "faq-accordion",
        content: "",
        sections: [
          {
            /*
             * Real h2 category headings: Inter 18px/600, no uppercase, black.
             * Labels: "GENERAL QUESTIONS", "BILLING AND ORDER QUESTIONS", "TECHNICAL QUESTIONS".
             */
            heading: "GENERAL QUESTIONS",
            items: [
              {
                question: "What is the Riot Games Merch Store?",
                answer:
                  "The Riot Games Merch Store is the official online store for Riot Games merchandise, including apparel, collectibles, accessories, and more inspired by League of Legends, VALORANT, Teamfight Tactics, and other Riot titles.",
              },
              {
                question: "How do I create an account?",
                answer:
                  "You can sign in using your existing Riot Games account. If you don't have one, visit account.riotgames.com to create one. Your Riot account gives you access to order history, wishlists, and personalised offers.",
              },
              {
                question: "Are your products officially licensed?",
                answer:
                  "Yes. All products sold in the Riot Games Merch Store are officially licensed and produced to Riot's quality standards. Look for the Riot Games seal on all product pages.",
              },
              {
                question: "How do I know if an item is authentic?",
                answer:
                  "Collectibles purchased through our official store include a certificate of authenticity or holographic seal where applicable. Use our Product Validation tool to verify your item's authenticity code.",
              },
              {
                question: "Can I purchase gift cards?",
                answer:
                  "Yes, Riot Games Gift Cards are available in select denominations and can be redeemed on any eligible order at checkout. Check your gift card balance at any time on the Gift Card Balance page.",
              },
            ],
          },
          {
            heading: "BILLING AND ORDER QUESTIONS",
            items: [
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept credit and debit cards (Visa, Mastercard, American Express), PayPal, Riot Games Gift Cards, and Apple Pay or Google Pay where available.",
              },
              {
                question: "Can I change or cancel my order?",
                answer:
                  "Orders can be modified or cancelled within 1 hour of placement. Please contact our support team as quickly as possible — once an order enters fulfilment it cannot be changed.",
              },
              {
                question: "How do I track my order?",
                answer:
                  "Once your order ships you will receive a tracking number via email. You can also visit the Order Status page and enter your order number and billing last name to see real-time updates.",
              },
              {
                question: "When will I be charged?",
                answer:
                  "Your payment method is charged at the time your order is placed. For pre-order items, you are charged immediately and your item ships when it becomes available.",
              },
              {
                question: "I was charged but didn't receive a confirmation email. What should I do?",
                answer:
                  "Check your spam or junk folder first. If you still can't find it, log in to your Riot account and view your order history. If the charge appears without a matching order, contact our support team.",
              },
            ],
          },
          {
            heading: "TECHNICAL QUESTIONS",
            items: [
              {
                question: "Why can't I add items to my cart?",
                answer:
                  "Items that are sold out or no longer available cannot be added to your cart. If an available item won't add, try clearing your browser cache and cookies, or try a different browser. If the problem persists, contact support.",
              },
              {
                question: "Why is a product showing as unavailable in my region?",
                answer:
                  "Some products have regional shipping restrictions due to licensing, customs regulations, or carrier limitations. Check the product page for regional availability details.",
              },
              {
                question: "The website isn't loading correctly. What can I do?",
                answer:
                  "Try clearing your browser cache and cookies, disabling browser extensions, or switching to a different browser. If the issue persists, check our status page or contact our support team.",
              },
              {
                question: "How do I redeem a promo code?",
                answer:
                  "Enter your promo code in the discount code field at checkout. Only one promo code can be applied per order. Codes cannot be combined with other offers unless otherwise stated.",
              },
            ],
          },
        ],
      },
    ],
  },

  shipping: {
    title: "Shipping Information",
    blocks: [
      { type: "heading2", content: "Processing Times" },
      {
        type: "paragraph",
        content:
          "Orders are processed within 1–3 business days (Monday–Friday, excluding holidays). You will receive an email confirmation once your order ships.",
      },
      { type: "heading2", content: "Domestic Shipping (United States)" },
      {
        type: "paragraph",
        content: "We offer the following shipping options for US orders:",
      },
      {
        type: "ol",
        content: [
          "Standard Shipping (5–7 business days) — Free on orders over $50",
          "Expedited Shipping (2–3 business days) — Flat rate $12.99",
          "Overnight Shipping (next business day) — Flat rate $24.99",
        ],
      },
      { type: "heading2", content: "International Shipping" },
      {
        type: "paragraph",
        content:
          "We ship to over 60 countries. International delivery typically takes 7–21 business days depending on the destination and customs processing times.",
      },
      {
        type: "paragraph",
        content:
          "Please note that the recipient is responsible for any customs duties, taxes, or import fees imposed by their country.",
      },
      { type: "heading3", content: "Countries we do not currently ship to" },
      {
        type: "paragraph",
        content:
          "Some regions are unavailable due to shipping restrictions or regulatory requirements. Please check at checkout whether your country is supported.",
      },
      { type: "heading2", content: "Order Tracking" },
      {
        type: "paragraph",
        content:
          "A tracking number is emailed once your order leaves our warehouse. Use the Order Status page or paste the tracking number directly on the carrier's website for real-time updates.",
      },
      { type: "heading2", content: "Shipping Delays" },
      {
        type: "paragraph",
        content:
          "During peak seasons (major game launches, holiday periods) and due to external factors like carrier disruptions or customs backlogs, delivery may take longer than the estimates above. We will communicate any known delays via email.",
      },
    ],
  },

  returns: {
    title: "Returns & Exchanges",
    blocks: [
      { type: "heading2", content: "Return Policy Overview" },
      {
        type: "paragraph",
        content:
          "We want you to love your purchase. If for any reason you are not satisfied, we accept returns and exchanges within 30 days of the delivery date.",
      },
      { type: "heading2", content: "How to Start a Return" },
      {
        type: "ol",
        content: [
          "Visit our Order Status page and locate your order.",
          "Select the item(s) you wish to return and choose a reason.",
          "Print the prepaid return shipping label (US orders only).",
          "Drop your package at any authorized carrier location.",
          "Refunds are processed within 5–10 business days of receipt.",
        ],
      },
      { type: "heading2", content: "Eligibility Requirements" },
      {
        type: "paragraph",
        content:
          "To be eligible for a return, items must meet all of the following conditions:",
      },
      {
        type: "ul",
        content: [
          "Returned within 30 days of delivery",
          "Unworn, unused, and in original condition",
          "Original tags and packaging intact",
          "Accompanied by proof of purchase",
        ],
      },
      { type: "heading2", content: "Non-Returnable Items" },
      {
        type: "ul",
        content: [
          "Opened or displayed collectibles and limited-edition items",
          "Digital codes and downloadable content",
          "Personalized or customized products",
          "Final Sale items (clearly marked at purchase)",
          "Gift cards",
        ],
      },
      { type: "heading2", content: "Exchanges" },
      {
        type: "paragraph",
        content:
          "Exchanges for a different size or colour are subject to product availability. If the requested variant is out of stock, we will issue a refund instead.",
      },
      { type: "heading2", content: "Damaged or Defective Items" },
      {
        type: "paragraph",
        content:
          "If your item arrived damaged or defective, please contact us within 7 days of delivery with photos of the damage and your order number. We will arrange a replacement or full refund at no cost to you.",
      },
    ],
  },

  "collectability-guide": {
    title: "Collectability Guide",
    blocks: [
      { type: "heading2", content: "What Is the Collectability Guide?" },
      {
        type: "paragraph",
        content:
          "This guide helps you understand the rarity and collectability ratings we assign to products in the Riot Games Merch Store, so you can make informed purchasing decisions.",
      },
      { type: "heading2", content: "Rarity Tiers" },
      { type: "heading3", content: "Standard" },
      {
        type: "paragraph",
        content:
          "Standard items are available year-round without a quantity cap. These include everyday apparel, accessories, and most plush items.",
      },
      { type: "heading3", content: "Limited Edition" },
      {
        type: "paragraph",
        content:
          "Limited Edition items are produced in a defined run (quantity noted on the product page). Once sold out, they will not be restocked.",
      },
      { type: "heading3", content: "Numbered Edition" },
      {
        type: "paragraph",
        content:
          "Numbered Edition collectibles include an individually numbered certificate of authenticity. These are strictly limited to the stated print or production run.",
      },
      { type: "heading3", content: "Exclusive" },
      {
        type: "paragraph",
        content:
          "Exclusive items are available only during a specific event window (e.g., Worlds, MSI, or a game anniversary). They cannot be purchased outside that window.",
      },
      { type: "heading2", content: "Authenticity Verification" },
      {
        type: "paragraph",
        content:
          "Use our Product Validation tool to confirm the authenticity of any collectible you have purchased. Enter the serial number or scan the holographic seal to verify.",
      },
      { type: "heading2", content: "Care & Display" },
      {
        type: "paragraph",
        content:
          "To preserve the value and appearance of your collectibles, we recommend keeping them away from direct sunlight and humidity. Numbered edition statues and figures ship in collector-grade packaging that doubles as a display case.",
      },
    ],
  },

  accessibility: {
    title: "Accessibility",
    blocks: [
      { type: "heading2", content: "Our Commitment" },
      {
        type: "paragraph",
        content:
          "Riot Games is committed to making the Merch Store accessible to everyone, including people with disabilities. We aim to meet or exceed the Web Content Accessibility Guidelines (WCAG) 2.1 AA standard.",
      },
      { type: "heading2", content: "Features" },
      {
        type: "ul",
        content: [
          "Keyboard navigation for all interactive elements",
          "Screen reader–compatible markup with descriptive ARIA labels",
          "Sufficient color contrast ratios across all text and interactive elements",
          "Text resizes up to 200% without loss of functionality",
          "Alternative text on all meaningful images",
          "Focus indicators visible on all focusable elements",
        ],
      },
      { type: "heading2", content: "Known Limitations" },
      {
        type: "paragraph",
        content:
          "We are actively working to improve accessibility across all parts of the store. Some third-party widgets (e.g., payment processing overlays) may not yet meet our target standards. We work with our partners to resolve these as quickly as possible.",
      },
      { type: "heading2", content: "Contact Us" },
      {
        type: "paragraph",
        content:
          "If you experience any accessibility barriers while using the Riot Games Merch Store, please contact our support team. We will do our best to provide the content or functionality you need through an alternative means.",
      },
    ],
  },

  legal: {
    title: "Legal Information",
    blocks: [
      { type: "heading2", content: "Intellectual Property" },
      {
        type: "paragraph",
        content:
          "All content on this website — including text, graphics, logos, images, and software — is the property of Riot Games, Inc. and is protected by applicable intellectual property laws. Unauthorized reproduction or distribution is prohibited.",
      },
      { type: "heading2", content: "Trademarks" },
      {
        type: "paragraph",
        content:
          'Riot Games, League of Legends, VALORANT, Teamfight Tactics, Legends of Runeterra, and their respective logos are trademarks or registered trademarks of Riot Games, Inc. All other trademarks are the property of their respective owners.',
      },
      { type: "heading2", content: "Limitation of Liability" },
      {
        type: "paragraph",
        content:
          "To the fullest extent permitted by law, Riot Games shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of this website or the purchase of products.",
      },
      { type: "heading2", content: "Governing Law" },
      {
        type: "paragraph",
        content:
          "These terms are governed by the laws of the State of California, United States, without regard to its conflict of law principles.",
      },
      { type: "heading2", content: "Dispute Resolution" },
      {
        type: "paragraph",
        content:
          "Any dispute arising from your use of this store or these terms shall first be addressed through informal negotiation. If unresolved, disputes shall be settled by binding arbitration in Los Angeles, California.",
      },
    ],
  },

  cookies: {
    title: "Cookie Preferences",
    blocks: [
      { type: "heading2", content: "What Are Cookies?" },
      {
        type: "paragraph",
        content:
          "Cookies are small text files stored on your device when you visit a website. They allow the site to remember your preferences, keep you signed in, and understand how you interact with our store.",
      },
      { type: "heading2", content: "Types of Cookies We Use" },
      { type: "heading3", content: "Strictly Necessary" },
      {
        type: "paragraph",
        content:
          "These cookies are required for the store to function. They enable core features like your shopping cart, checkout, and account login. You cannot opt out of these.",
      },
      { type: "heading3", content: "Performance & Analytics" },
      {
        type: "paragraph",
        content:
          "These cookies help us understand how visitors use our site — which pages are popular, where users drop off, and how performance can be improved. All data is aggregated and anonymized.",
      },
      { type: "heading3", content: "Functional" },
      {
        type: "paragraph",
        content:
          "Functional cookies remember your preferences such as language, currency, and region so you don't have to re-enter them each visit.",
      },
      { type: "heading3", content: "Advertising & Targeting" },
      {
        type: "paragraph",
        content:
          "We may use these cookies to deliver relevant advertising on third-party platforms. You can opt out below or via your browser settings.",
      },
      { type: "heading2", content: "Managing Your Preferences" },
      {
        type: "paragraph",
        content:
          "You can update your cookie preferences at any time by visiting this page. You can also control cookies through your browser settings; however, disabling certain cookies may affect site functionality.",
      },
    ],
  },

  terms: {
    title: "Terms & Conditions",
    blocks: [
      { type: "heading2", content: "Acceptance of Terms" },
      {
        type: "paragraph",
        content:
          "By accessing or purchasing from the Riot Games Merch Store, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please do not use this store.",
      },
      { type: "heading2", content: "Eligibility" },
      {
        type: "paragraph",
        content:
          "You must be at least 13 years of age (or the minimum age of digital consent in your country) to use this store. If you are under 18, you must have parental or guardian consent.",
      },
      { type: "heading2", content: "Orders & Pricing" },
      {
        type: "ul",
        content: [
          "Prices are listed in USD unless otherwise indicated.",
          "We reserve the right to refuse or cancel orders at our discretion.",
          "Prices and availability are subject to change without notice.",
          "Promotional prices apply only during the stated promotion period.",
        ],
      },
      { type: "heading2", content: "Product Descriptions" },
      {
        type: "paragraph",
        content:
          "We make every effort to display product images and descriptions accurately. However, color representation may vary depending on your monitor settings. We do not warrant that product descriptions are error-free.",
      },
      { type: "heading2", content: "Prohibited Uses" },
      {
        type: "paragraph",
        content:
          "You may not use this store to resell products for commercial gain without our written consent, or to engage in any fraudulent activity.",
      },
      { type: "heading2", content: "Changes to Terms" },
      {
        type: "paragraph",
        content:
          "We reserve the right to update these Terms & Conditions at any time. Continued use of the store after changes are posted constitutes acceptance of the revised terms.",
      },
    ],
  },

  privacy: {
    title: "Privacy Policy",
    blocks: [
      { type: "heading2", content: "Information We Collect" },
      {
        type: "paragraph",
        content:
          "When you visit the Riot Games Merch Store or make a purchase, we may collect the following categories of information:",
      },
      {
        type: "ul",
        content: [
          "Contact information: name, email address, phone number, shipping/billing address",
          "Payment information: processed securely through our payment provider — we do not store full card numbers",
          "Account information: Riot ID, linked game account data",
          "Usage data: pages visited, items viewed, device and browser type, IP address",
          "Communications: any messages you send us via support channels",
        ],
      },
      { type: "heading2", content: "How We Use Your Information" },
      {
        type: "ol",
        content: [
          "Process and fulfill your orders",
          "Send order confirmations, shipping updates, and customer support communications",
          "Improve our website and product offerings",
          "Send marketing communications (with your consent where required by law)",
          "Detect and prevent fraudulent transactions",
          "Comply with legal obligations",
        ],
      },
      { type: "heading2", content: "Sharing Your Information" },
      {
        type: "paragraph",
        content:
          "We do not sell your personal information. We may share it with trusted service providers who assist us in operating our store (e.g., payment processors, shipping carriers, analytics platforms), each bound by strict data processing agreements.",
      },
      { type: "heading2", content: "Data Retention" },
      {
        type: "paragraph",
        content:
          "We retain your personal data only as long as necessary to fulfill the purposes described in this policy, or as required by law (e.g., tax and accounting requirements).",
      },
      { type: "heading2", content: "Your Rights" },
      {
        type: "paragraph",
        content:
          "Depending on your jurisdiction, you may have rights including: access to your data, rectification, erasure, restriction of processing, data portability, and the right to object. Contact our privacy team to exercise these rights.",
      },
      { type: "heading2", content: "Contact" },
      {
        type: "paragraph",
        content:
          "For privacy-related inquiries, please contact our Privacy Team at privacy@riotgames.com or write to: Riot Games, Inc., 12333 W Olympic Blvd, Los Angeles, CA 90064.",
      },
    ],
  },

  "riot-mart": {
    title: "Riot Mart / My Shop",
    blocks: [
      { type: "heading2", content: "What Is Riot Mart?" },
      {
        type: "paragraph",
        content:
          "Riot Mart (also known as My Shop) is a personalised in-client storefront that surfaces curated offers and discounts based on your play history. Offers are unique to your account and are available for a limited time.",
      },
      { type: "heading2", content: "How Do I Access My Shop?" },
      {
        type: "paragraph",
        content:
          "My Shop can be found inside the League of Legends client under the Store tab. If you are eligible, a \"My Shop\" button will appear during the promotion window.",
      },
      { type: "heading2", content: "Why Don't I Have a My Shop?" },
      {
        type: "ul",
        content: [
          "My Shop is not available in all regions.",
          "You may not meet the activity threshold required for personalised offers.",
          "The current My Shop promotion window may have ended.",
        ],
      },
    ],
  },

  "verify-your-product": {
    title: "Verify Your Product",
    blocks: [],
    formConfig: {
      variant: "lookup",
      fields: [
        { id: "product-auth-code", label: "Authenticity Code", type: "text" },
      ],
      submitLabel: "LOOKUP",
    },
  },

  "gift-card-balance": {
    title: "Gift Card Balance",
    blocks: [],
    formConfig: {
      variant: "row",
      fields: [
        { id: "gcp_last", label: "Last 4 Characters", type: "text" },
        { id: "gcp_email", label: "Email Address", type: "email" },
      ],
      submitLabel: "Check Balance",
    },
  },

  "order-status": {
    title: "Order Status / Code Lookup",
    blocks: [],
    formConfig: {
      variant: "row",
      fields: [
        { id: "order-number", label: "Order Number", type: "text" },
        { id: "billing-last-name", label: "Billing Last Name", type: "text" },
        { id: "order-email", label: "Email Address", type: "email" },
      ],
      submitLabel: "Find My Order",
    },
  },
};
