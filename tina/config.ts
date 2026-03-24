import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

// ─── Block Templates ──────────────────────────────────────────────────────────

const heroBlock = {
  name: "hero",
  label: "Hero Section",
  fields: [
    { type: "string" as const, name: "variant", label: "Variant", options: ["gradient", "image"], ui: { defaultValue: "gradient" } },
    { type: "string" as const, name: "headline", label: "Headline", required: true },
    { type: "string" as const, name: "subtitle", label: "Subtitle", ui: { component: "textarea" } },
    { type: "string" as const, name: "primaryCtaText", label: "Primary CTA Text" },
    { type: "string" as const, name: "primaryCtaLink", label: "Primary CTA Link" },
    { type: "string" as const, name: "secondaryCtaText", label: "Secondary CTA Text" },
    { type: "string" as const, name: "secondaryCtaLink", label: "Secondary CTA Link" },
    { type: "image" as const, name: "backgroundImage", label: "Background Image (image variant only)" },
  ],
};

const trustBarBlock = {
  name: "trustBar",
  label: "Trust Bar",
  fields: [
    {
      type: "object" as const,
      name: "items",
      label: "Items",
      list: true,
      ui: { itemProps: (item: { text?: string }) => ({ label: item.text || "Item" }) },
      fields: [
        { type: "string" as const, name: "text", label: "Text", required: true },
      ],
    },
  ],
};

const statsBarBlock = {
  name: "statsBar",
  label: "Stats Bar",
  fields: [
    {
      type: "object" as const,
      name: "stats",
      label: "Stats",
      list: true,
      ui: { itemProps: (item: { value?: string; label?: string }) => ({ label: [item.value, item.label].filter(Boolean).join(" ") || "Stat" }) },
      fields: [
        { type: "string" as const, name: "value", label: "Value (e.g. 1,000+)", required: true },
        { type: "string" as const, name: "label", label: "Label", required: true },
      ],
    },
  ],
};

const serviceCardsBlock = {
  name: "serviceCards",
  label: "Service Cards",
  fields: [
    { type: "string" as const, name: "heading", label: "Section Heading" },
    { type: "string" as const, name: "subheading", label: "Subheading (optional)" },
    {
      type: "object" as const,
      name: "cards",
      label: "Cards",
      list: true,
      ui: { itemProps: (item: { title?: string }) => ({ label: item.title || "Card" }) },
      fields: [
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "description", label: "Description", ui: { component: "textarea" } },
        { type: "string" as const, name: "link", label: "Link URL" },
        { type: "string" as const, name: "iconHint", label: "Icon Hint (optional)" },
        { type: "image" as const, name: "image", label: "Card Image (optional)" },
      ],
    },
  ],
};

const practiceAreaCardsBlock = {
  name: "practiceAreaCards",
  label: "Practice Area Cards",
  fields: [
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "cards",
      label: "Cards",
      list: true,
      ui: { itemProps: (item: { title?: string }) => ({ label: item.title || "Card" }) },
      fields: [
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "description", label: "Description", ui: { component: "textarea" } },
        { type: "string" as const, name: "iconHint", label: "Icon Hint (optional)" },
        { type: "string" as const, name: "link", label: "Link URL" },
      ],
    },
  ],
};

const processStepsBlock = {
  name: "processSteps",
  label: "Process Steps",
  fields: [
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "steps",
      label: "Steps",
      list: true,
      ui: { itemProps: (item: { title?: string }) => ({ label: item.title || "Step" }) },
      fields: [
        { type: "number" as const, name: "number", label: "Step Number", required: true },
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "description", label: "Description", ui: { component: "textarea" } },
      ],
    },
    { type: "string" as const, name: "ctaText", label: "CTA Text (below steps)" },
    { type: "string" as const, name: "ctaLink", label: "CTA Link" },
  ],
};

const testimonialCarouselBlock = {
  name: "testimonialCarousel",
  label: "Testimonial Carousel",
  fields: [
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "testimonials",
      label: "Testimonials",
      list: true,
      ui: { itemProps: (item: { quote?: string }) => ({ label: item.quote ? item.quote.slice(0, 40) + "…" : "Testimonial" }) },
      fields: [
        { type: "string" as const, name: "quote", label: "Quote", required: true, ui: { component: "textarea" } },
        { type: "string" as const, name: "name", label: "Author Name" },
        { type: "string" as const, name: "title", label: "Author Title/Role" },
        { type: "string" as const, name: "organization", label: "Organisation" },
        { type: "image" as const, name: "photo", label: "Author Photo (optional)" },
      ],
    },
  ],
};

const tabbedContentBlock = {
  name: "tabbedContent",
  label: "Tabbed Content",
  fields: [
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "tabs",
      label: "Tabs",
      list: true,
      ui: { itemProps: (item: { label?: string }) => ({ label: item.label || "Tab" }) },
      fields: [
        { type: "string" as const, name: "label", label: "Tab Label", required: true },
        { type: "string" as const, name: "content", label: "Tab Content", ui: { component: "textarea" } },
      ],
    },
  ],
};

const faqAccordionBlock = {
  name: "faqAccordion",
  label: "FAQ Accordion",
  fields: [
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "faqs",
      label: "FAQ Items",
      list: true,
      ui: { itemProps: (item: { question?: string }) => ({ label: item.question || "Q&A" }) },
      fields: [
        { type: "string" as const, name: "question", label: "Question", required: true },
        { type: "string" as const, name: "answer", label: "Answer", required: true, ui: { component: "textarea" } },
      ],
    },
  ],
};

const ctaBannerBlock = {
  name: "ctaBanner",
  label: "CTA Banner",
  fields: [
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "bodyText", label: "Body Text", ui: { component: "textarea" } },
    { type: "string" as const, name: "primaryCtaText", label: "Primary CTA Text" },
    { type: "string" as const, name: "primaryCtaLink", label: "Primary CTA Link" },
    { type: "string" as const, name: "secondaryCtaText", label: "Secondary CTA Text" },
    { type: "string" as const, name: "secondaryCtaLink", label: "Secondary CTA Link" },
  ],
};

const ctaInlineBlock = {
  name: "ctaInline",
  label: "CTA Inline",
  fields: [
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "bodyText", label: "Body Text", ui: { component: "textarea" } },
    { type: "string" as const, name: "primaryCtaText", label: "Primary CTA Text" },
    { type: "string" as const, name: "primaryCtaLink", label: "Primary CTA Link" },
    { type: "string" as const, name: "secondaryCtaText", label: "Secondary CTA Text (optional)" },
    { type: "string" as const, name: "secondaryCtaLink", label: "Secondary CTA Link" },
  ],
};

const featureComparisonBlock = {
  name: "featureComparison",
  label: "Feature Comparison",
  fields: [
    { type: "string" as const, name: "heading", label: "Section Heading" },
    { type: "string" as const, name: "col1Header", label: "Column 1 Header", ui: { defaultValue: "Psychology Direct" } },
    { type: "string" as const, name: "col2Header", label: "Column 2 Header", ui: { defaultValue: "Alternative" } },
    {
      type: "object" as const,
      name: "rows",
      label: "Rows",
      list: true,
      ui: { itemProps: (item: { feature?: string }) => ({ label: item.feature || "Feature" }) },
      fields: [
        { type: "string" as const, name: "feature", label: "Feature", required: true },
        { type: "string" as const, name: "col1", label: "Column 1 Value" },
        { type: "string" as const, name: "col2", label: "Column 2 Value" },
      ],
    },
  ],
};

const caseStudyCardsBlock = {
  name: "caseStudyCards",
  label: "Case Study Cards",
  fields: [
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "caseStudies",
      label: "Case Studies",
      list: true,
      ui: { itemProps: (item: { title?: string }) => ({ label: item.title || "Case Study" }) },
      fields: [
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "summary", label: "Summary", ui: { component: "textarea" } },
        { type: "string" as const, name: "sector", label: "Sector Tag (e.g. Education, Legal)" },
        { type: "string" as const, name: "link", label: "Link URL" },
        { type: "image" as const, name: "thumbnail", label: "Thumbnail Image (optional)" },
      ],
    },
  ],
};

const teamGridBlock = {
  name: "teamGrid",
  label: "Team Grid",
  fields: [
    { type: "string" as const, name: "heading", label: "Section Heading" },
    {
      type: "object" as const,
      name: "team",
      label: "Team Members",
      list: true,
      ui: { itemProps: (item: { name?: string }) => ({ label: item.name || "Team Member" }) },
      fields: [
        { type: "string" as const, name: "name", label: "Name", required: true },
        { type: "string" as const, name: "role", label: "Role/Title", required: true },
        { type: "string" as const, name: "bio", label: "Bio (1 sentence)" },
        { type: "image" as const, name: "photo", label: "Photo" },
      ],
    },
  ],
};

const videoSectionBlock = {
  name: "videoSection",
  label: "Video Section",
  fields: [
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "videoUrl", label: "Video URL (YouTube or embed)" },
    { type: "string" as const, name: "caption", label: "Caption" },
    { type: "image" as const, name: "thumbnail", label: "Thumbnail (optional)" },
  ],
};

const alertBannerBlock = {
  name: "alertBanner",
  label: "Alert Banner",
  fields: [
    { type: "string" as const, name: "type", label: "Type", options: ["info", "warning", "success"], ui: { defaultValue: "info" } },
    { type: "string" as const, name: "text", label: "Text", required: true },
    { type: "string" as const, name: "ctaText", label: "CTA Text (optional)" },
    { type: "string" as const, name: "ctaLink", label: "CTA Link" },
  ],
};

const imageFeatureBlock = {
  name: "imageFeature",
  label: "Image Feature",
  fields: [
    { type: "string" as const, name: "layout", label: "Layout", options: ["image-left", "image-right"], ui: { defaultValue: "image-left" } },
    { type: "image" as const, name: "image", label: "Image" },
    { type: "string" as const, name: "imageAlt", label: "Image Alt Text" },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "bodyText", label: "Body Text", ui: { component: "textarea" } },
    { type: "string" as const, name: "ctaText", label: "CTA Text (optional)" },
    { type: "string" as const, name: "ctaLink", label: "CTA Link" },
  ],
};

const richTextBlock = {
  name: "richText",
  label: "Rich Text",
  fields: [
    { type: "rich-text" as const, name: "body", label: "Body" },
  ],
};

// ─── Shared page SEO fields ───────────────────────────────────────────────────

const seoFields = [
  { type: "string" as const, name: "title", label: "Page Title", isTitle: true, required: true },
  { type: "string" as const, name: "description", label: "Meta Description" },
  { type: "string" as const, name: "url", label: "Canonical URL (e.g. /contact/)" },
  { type: "string" as const, name: "keywords", label: "SEO Keywords", list: true },
];

const allBlocks = [
  heroBlock,
  trustBarBlock,
  statsBarBlock,
  serviceCardsBlock,
  practiceAreaCardsBlock,
  processStepsBlock,
  testimonialCarouselBlock,
  tabbedContentBlock,
  faqAccordionBlock,
  ctaBannerBlock,
  ctaInlineBlock,
  featureComparisonBlock,
  caseStudyCardsBlock,
  teamGridBlock,
  videoSectionBlock,
  alertBannerBlock,
  richTextBlock,
  imageFeatureBlock,
];

const blockPageFields = [
  ...seoFields,
  {
    type: "object" as const,
    name: "blocks",
    label: "Page Blocks",
    list: true,
    templates: allBlocks,
  },
];

const markdownPageFields = [
  { type: "string" as const, name: "title", label: "Title", isTitle: true, required: true },
  { type: "string" as const, name: "description", label: "Meta Description" },
  { type: "rich-text" as const, name: "body", label: "Body", isBody: true },
  { type: "string" as const, name: "keywords", label: "SEO Keywords", list: true },
];

// For LAN dev access: override the GraphQL URL so remote browsers can reach Tina
const tinaApiUrl = process.env.NEXT_PUBLIC_TINA_API_URL || undefined;

export default defineConfig({
  branch,
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  contentApiUrlOverride: tinaApiUrl,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      // ── Main block-based pages (homepage, contact, tools, etc.) ──────────────
      {
        name: "pages",
        label: "Pages",
        path: "content/pages",
        format: "json",
        ui: {
          router: ({ document }) =>
            document._sys.filename === "homepage"
              ? "/"
              : `/${document._sys.filename}/`,
        },
        fields: blockPageFields,
      },

      // ── Expert Witness section ───────────────────────────────────────────────
      {
        name: "expertWitness",
        label: "Expert Witness Pages",
        path: "content/expert-witness",
        format: "json",
        ui: {
          router: ({ document }) =>
            document._sys.filename === "overview"
              ? "/expert-witness-psychologists/"
              : `/expert-witness-psychologists/${document._sys.filename}/`,
        },
        fields: blockPageFields,
      },

      // ── Education section ────────────────────────────────────────────────────
      {
        name: "education",
        label: "Education Pages",
        path: "content/education",
        format: "json",
        ui: {
          router: ({ document }) =>
            document._sys.filename === "overview"
              ? "/educational-psychologist/"
              : `/educational-psychologist/${document._sys.filename}/`,
        },
        fields: blockPageFields,
      },

      // ── About section ────────────────────────────────────────────────────────
      {
        name: "about",
        label: "About Pages",
        path: "content/about",
        format: "json",
        ui: {
          router: ({ document }) =>
            document._sys.filename === "overview"
              ? "/about/"
              : `/about/${document._sys.filename}/`,
        },
        fields: blockPageFields,
      },

      // ── Tools section ────────────────────────────────────────────────────────
      {
        name: "tools",
        label: "Tools Pages",
        path: "content/tools",
        format: "json",
        ui: {
          router: ({ document }) => `/tools/${document._sys.filename}/`,
        },
        fields: blockPageFields,
      },

      // ── Resources section ─────────────────────────────────────────────────────
      {
        name: "resources",
        label: "Resources Pages",
        path: "content/resources",
        format: "json",
        ui: {
          router: ({ document }) =>
            document._sys.filename === "overview"
              ? "/resources/"
              : `/resources/${document._sys.filename}/`,
        },
        fields: blockPageFields,
      },

      // ── News / Articles ──────────────────────────────────────────────────────
      {
        name: "articles",
        label: "News & Articles",
        path: "content/articles",
        format: "md",
        ui: {
          router: ({ document }) => `/news/${document._sys.filename}/`,
        },
        fields: [
          ...markdownPageFields,
          { type: "string" as const, name: "author", label: "Author" },
          { type: "datetime" as const, name: "date", label: "Publish Date" },
          { type: "string" as const, name: "category", label: "Category" },
          { type: "image" as const, name: "featuredImage", label: "Featured Image" },
        ],
      },

      // ── Case Studies ──────────────────────────────────────────────────────────
      {
        name: "caseStudies",
        label: "Case Studies",
        path: "content/case-studies",
        format: "md",
        ui: {
          router: ({ document }) => `/case-studies/${document._sys.filename}/`,
        },
        fields: [
          ...markdownPageFields,
          { type: "string" as const, name: "sector", label: "Sector" },
          { type: "image" as const, name: "featuredImage", label: "Featured Image" },
        ],
      },

      // ── Utility / Policy pages ────────────────────────────────────────────────
      {
        name: "utility",
        label: "Utility Pages (Policy, Login, etc.)",
        path: "content/utility",
        format: "md",
        ui: {
          router: ({ document }) => `/${document._sys.filename}/`,
        },
        fields: markdownPageFields,
      },

      // ── Global settings ───────────────────────────────────────────────────────
      {
        name: "global",
        label: "Global Settings",
        path: "content/settings",
        format: "json",
        ui: {
          global: true,
          allowedActions: { create: false, delete: false },
        },
        match: { include: "global" },
        fields: [
          {
            type: "object" as const,
            name: "site",
            label: "Site Information",
            fields: [
              { type: "string" as const, name: "name", label: "Site Name" },
              { type: "string" as const, name: "tagline", label: "Tagline" },
              { type: "image" as const, name: "logo", label: "Header Logo" },
              { type: "string" as const, name: "phone", label: "Phone Number" },
              { type: "string" as const, name: "email", label: "Email Address" },
              { type: "string" as const, name: "canonicalDomain", label: "Canonical Domain (e.g. https://www.psychologydirect.co.uk)" },
            ] as any,
          },
          {
            type: "object" as const,
            name: "social",
            label: "Social Links",
            fields: [
              { type: "string" as const, name: "linkedin", label: "LinkedIn URL" },
              { type: "string" as const, name: "twitter", label: "Twitter/X URL" },
              { type: "string" as const, name: "facebook", label: "Facebook URL" },
            ] as any,
          },
        ] as any,
      },

      // ── Navigation ────────────────────────────────────────────────────────────
      {
        name: "navigation",
        label: "Navigation Menu",
        path: "content/settings",
        format: "json",
        ui: {
          global: true,
          allowedActions: { create: false, delete: false },
        },
        match: { include: "navigation" },
        fields: [
          {
            type: "object" as const,
            name: "mainNav",
            label: "Main Navigation",
            list: true,
            ui: {
              itemProps: (item: { label?: string }) => ({ label: item.label || "Item" }),
            },
            fields: [
              { type: "string" as const, name: "label", label: "Label", required: true },
              { type: "string" as const, name: "url", label: "URL", required: true },
              {
                type: "object" as const,
                name: "children",
                label: "Sub-items",
                list: true,
                fields: [
                  { type: "string" as const, name: "label", label: "Label", required: true },
                  { type: "string" as const, name: "url", label: "URL", required: true },
                ] as any,
              },
            ] as any,
          },
          {
            type: "object" as const,
            name: "footerNav",
            label: "Footer Navigation",
            list: true,
            ui: {
              itemProps: (item: { title?: string }) => ({ label: item.title || "Column" }),
            },
            fields: [
              { type: "string" as const, name: "title", label: "Column Title", required: true },
              {
                type: "object" as const,
                name: "links",
                label: "Links",
                list: true,
                fields: [
                  { type: "string" as const, name: "label", label: "Label", required: true },
                  { type: "string" as const, name: "url", label: "URL", required: true },
                ] as any,
              },
            ] as any,
          },
        ] as any,
      },
    ],
  },
});
