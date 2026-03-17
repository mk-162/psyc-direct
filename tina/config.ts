import { defineConfig } from "tinacms";
import ProductSelectComponent from "./components/ProductSelect";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

const markdownPageFields = [
  { type: "string" as const, name: "title", label: "Title", isTitle: true, required: true },
  { type: "string" as const, name: "description", label: "Description" },
  { type: "string" as const, name: "url", label: "Canonical URL" },
  { type: "image" as const, name: "featured_image", label: "Featured Image" },
  { type: "boolean" as const, name: "show_hero_image", label: "Show as Hero Banner" },
  { type: "rich-text" as const, name: "body", label: "Body", isBody: true },
  { type: "string" as const, name: "tags", label: "Tags (link to related services)", list: true },
  { type: "string" as const, name: "keywords", label: "SEO Keywords", list: true },
];

// ---------------------------------------------------------------------------
// Block Templates for the Pages collection
// ---------------------------------------------------------------------------

const heroBlock = {
  name: "hero",
  label: "Hero",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow Text" },
    { type: "string" as const, name: "headline", label: "Headline" },
    { type: "string" as const, name: "subtitle", label: "Subtitle" },
    { type: "image" as const, name: "image", label: "Background Image" },
    { type: "string" as const, name: "primaryButtonText", label: "Primary Button Text" },
    { type: "string" as const, name: "primaryButtonAction", label: "Primary Button Action", options: ["link", "add-to-basket"], ui: { component: "select" } },
    { type: "string" as const, name: "primaryButtonUrl", label: "Primary Button URL (if Link)" },
    { type: "string" as const, name: "primaryButtonProductId", label: "Primary Button Product ID (if Add to Basket)" },
    { type: "string" as const, name: "secondaryButtonText", label: "Secondary Button Text" },
    { type: "string" as const, name: "secondaryButtonAction", label: "Secondary Button Action", options: ["link", "add-to-basket"], ui: { component: "select" } },
    { type: "string" as const, name: "secondaryButtonUrl", label: "Secondary Button URL (if Link)" },
    { type: "string" as const, name: "secondaryButtonProductId", label: "Secondary Button Product ID (if Add to Basket)" },
    { type: "string" as const, name: "theme", label: "Theme", options: [{ value: "off-white", label: "Cream (Mineral White)" }, { value: "green", label: "Deep Green" }, { value: "grey", label: "Warm Stone" }, { value: "terracotta", label: "Terracotta" }] },
  ],
};

const heroImmersiveBlock = {
  name: "heroImmersive",
  label: "Hero Immersive",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow Text" },
    { type: "string" as const, name: "headline", label: "Headline" },
    { type: "string" as const, name: "subtitle", label: "Subtitle" },
    { type: "image" as const, name: "image", label: "Background Image" },
    { type: "string" as const, name: "discoverText", label: "Discover Link Text" },
    { type: "string" as const, name: "discoverUrl", label: "Discover Link URL" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
  ],
};

const featureGridBlock = {
  name: "featureGrid",
  label: "Feature Grid",
  fields: [
    { type: "string" as const, name: "headline", label: "Headline" },
    { type: "string" as const, name: "description", label: "Description" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    {
      type: "object" as const,
      name: "features",
      label: "Features",
      list: true,
      fields: [
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "description", label: "Description" },
      ],
    },
  ],
};

const editorialGridBlock = {
  name: "editorialGrid",
  label: "Editorial Grid",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow Text" },
    { type: "string" as const, name: "headline", label: "Headline" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    {
      type: "object" as const,
      name: "items",
      label: "Items",
      list: true,
      fields: [
        { type: "image" as const, name: "image", label: "Image" },
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "description", label: "Description" },
        { type: "string" as const, name: "linkText", label: "Link Text" },
        { type: "string" as const, name: "linkUrl", label: "Link URL" },
      ],
    },
  ],
};

const sectionIntroBlock = {
  name: "sectionIntro",
  label: "Section Intro",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow Text" },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "bodyText", label: "Body Text", ui: { component: "textarea" } },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
  ],
};

const productStatsBlock = {
  name: "productStats",
  label: "Product Stats",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow Text" },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "description", label: "Description", ui: { component: "textarea" } },
    {
      type: "object" as const,
      name: "stats",
      label: "Stats",
      list: true,
      fields: [
        { type: "string" as const, name: "value", label: "Value", required: true },
        { type: "string" as const, name: "label", label: "Label", required: true },
      ],
    },
    { type: "string" as const, name: "buttonText", label: "Button Text" },
    { type: "string" as const, name: "buttonUrl", label: "Button URL" },
    { type: "image" as const, name: "image", label: "Image" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
  ],
};

const cardsPortraitBlock = {
  name: "cardsPortrait",
  label: "Cards Portrait",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow Text" },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    {
      type: "object" as const,
      name: "cards",
      label: "Cards",
      list: true,
      fields: [
        { type: "image" as const, name: "image", label: "Image" },
        { type: "string" as const, name: "label", label: "Label" },
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "description", label: "Description" },
      ],
    },
  ],
};

const fullWidthImageBlock = {
  name: "fullWidthImage",
  label: "Full-Width Image",
  fields: [
    { type: "image" as const, name: "image", label: "Image" },
    { type: "string" as const, name: "alt", label: "Alt Text" },
    { type: "string" as const, name: "height", label: "Height (e.g. 400px, 50vh)" },
    {
      type: "string" as const,
      name: "focalPoint",
      label: "Focal Point",
      description: "Where to focus the image (for cropping)",
      options: [
        { value: "center", label: "Center (default)" },
        { value: "top", label: "Top" },
        { value: "bottom", label: "Bottom" },
        { value: "left", label: "Left" },
        { value: "right", label: "Right" },
        { value: "face", label: "Face (top center)" },
      ],
      ui: { defaultValue: "center" },
    },
  ],
};

const asymmetricSplitBlock = {
  name: "asymmetricSplit",
  label: "Asymmetric Split",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow Text" },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "bodyText", label: "Body Text", ui: { component: "textarea" } },
    { type: "image" as const, name: "image", label: "Image" },
    { type: "string" as const, name: "buttonText", label: "Button Text" },
    { type: "string" as const, name: "buttonUrl", label: "Button URL" },
    { type: "string" as const, name: "mediaPosition", label: "Media Position", options: ["left", "right"] },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
  ],
};

const testimonialBlock = {
  name: "testimonial",
  label: "Testimonial",
  fields: [
    { type: "string" as const, name: "quote", label: "Quote", ui: { component: "textarea" } },
    { type: "string" as const, name: "authorName", label: "Author Name" },
    { type: "string" as const, name: "authorRole", label: "Author Role" },
    { type: "image" as const, name: "image", label: "Author Image" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
  ],
};

const personaCardsBlock = {
  name: "personaCards",
  label: "Persona Cards",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow Text" },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    {
      type: "object" as const,
      name: "cards",
      label: "Cards",
      list: true,
      fields: [
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "description", label: "Description" },
      ],
    },
  ],
};

const timelineBlock = {
  name: "timeline",
  label: "Timeline",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow Text" },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    {
      type: "object" as const,
      name: "steps",
      label: "Steps",
      list: true,
      fields: [
        { type: "string" as const, name: "number", label: "Step Number", required: true },
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "description", label: "Description" },
      ],
    },
  ],
};

const faqAccordionBlock = {
  name: "faqAccordion",
  label: "FAQ Accordion",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow Text" },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    {
      type: "object" as const,
      name: "items",
      label: "FAQ Items",
      list: true,
      fields: [
        { type: "string" as const, name: "question", label: "Question", required: true },
        { type: "string" as const, name: "answer", label: "Answer", required: true, ui: { component: "textarea" } },
      ],
    },
  ],
};

const includedGridBlock = {
  name: "includedGrid",
  label: "Included Grid",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow Text" },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    {
      type: "object" as const,
      name: "categories",
      label: "Categories",
      list: true,
      fields: [
        { type: "string" as const, name: "title", label: "Category Title", required: true },
        { type: "string" as const, name: "items", label: "Items", list: true },
      ],
    },
  ],
};

const darkCtaBlock = {
  name: "darkCta",
  label: "Dark CTA",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow Text" },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "bodyText", label: "Body Text", ui: { component: "textarea" } },
    { type: "string" as const, name: "primaryButtonText", label: "Primary Button Text" },
    { type: "string" as const, name: "primaryButtonUrl", label: "Primary Button URL" },
    { type: "string" as const, name: "secondaryButtonText", label: "Secondary Button Text" },
    { type: "string" as const, name: "secondaryButtonUrl", label: "Secondary Button URL" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
  ],
};

const signatureFooterBlock = {
  name: "signatureFooter",
  label: "Signature Footer",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow Text" },
    { type: "string" as const, name: "headline", label: "Headline" },
    { type: "string" as const, name: "buttonPrimaryText", label: "Primary Button Text" },
    { type: "string" as const, name: "buttonPrimaryUrl", label: "Primary Button URL" },
    { type: "string" as const, name: "buttonSecondaryText", label: "Secondary Button Text" },
    { type: "string" as const, name: "buttonSecondaryUrl", label: "Secondary Button URL" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
  ],
};

const hubHeroBlock = {
  name: "hubHero",
  label: "Hub Hero",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow" },
    { type: "string" as const, name: "headline", label: "Headline" },
    { type: "string" as const, name: "subtitle", label: "Subtitle" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
  ],
};

const categoryShowcaseBlock = {
  name: "categoryShowcase",
  label: "Category Showcase",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow" },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    {
      type: "object" as const, name: "items", label: "Categories", list: true,
      fields: [
        { type: "string" as const, name: "icon", label: "Icon (emoji)" },
        { type: "string" as const, name: "label", label: "Title" },
        { type: "string" as const, name: "description", label: "Description" },
        { type: "string" as const, name: "count", label: "Count Label" },
        { type: "string" as const, name: "url", label: "URL" },
      ],
    },
  ],
};

const linkDirectoryBlock = {
  name: "linkDirectory",
  label: "Link Directory",
  fields: [
    { type: "string" as const, name: "sectionTitle", label: "Section Title" },
    { type: "string" as const, name: "viewAllText", label: "View All Text" },
    { type: "string" as const, name: "viewAllUrl", label: "View All URL" },
    { type: "boolean" as const, name: "compact", label: "Compact (3 columns)" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    {
      type: "object" as const, name: "entries", label: "Links", list: true,
      fields: [
        { type: "string" as const, name: "label", label: "Title" },
        { type: "string" as const, name: "description", label: "Description" },
        { type: "string" as const, name: "url", label: "URL" },
      ],
    },
  ],
};

const featuredLinksBlock = {
  name: "featuredLinks",
  label: "Featured Links",
  fields: [
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    {
      type: "object" as const, name: "cards", label: "Featured Cards", list: true,
      fields: [
        { type: "string" as const, name: "eyebrow", label: "Eyebrow" },
        { type: "string" as const, name: "label", label: "Title" },
        { type: "string" as const, name: "description", label: "Description" },
        { type: "string" as const, name: "ctaText", label: "CTA Text" },
        { type: "string" as const, name: "url", label: "URL" },
      ],
    },
  ],
};

const contentWithMediaBlock = {
  name: "contentWithMedia",
  label: "Content + Media",
  fields: [
    { type: "string" as const, name: "headline", label: "Headline" },
    { type: "rich-text" as const, name: "content", label: "Content" },
    { type: "image" as const, name: "image", label: "Image" },
    { type: "string" as const, name: "imagePosition", label: "Image Position", options: ["left", "right"], ui: { defaultValue: "right" } },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
  ],
};

const editorialMosaicBlock = {
  name: "editorialMosaic",
  label: "Editorial Mosaic",
  fields: [
    { type: "string" as const, name: "headline", label: "Headline" },
    { type: "rich-text" as const, name: "content", label: "Content" },
    { type: "image" as const, name: "heroImage", label: "Hero Image" },
    {
      type: "object" as const,
      name: "sideImages",
      label: "Side Images",
      list: true,
      fields: [
        { type: "image" as const, name: "image", label: "Image" },
        { type: "string" as const, name: "alt", label: "Alt Text" },
      ],
    },
    { type: "string" as const, name: "featureText", label: "Feature Text" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
  ],
};

const contactFormBlock = {
  name: "contactForm",
  label: "Contact Form",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Form Eyebrow" },
    { type: "string" as const, name: "headline", label: "Form Headline" },
    { type: "string" as const, name: "infoEyebrow", label: "Info Eyebrow" },
    { type: "string" as const, name: "infoHeadline", label: "Info Headline" },
    { type: "string" as const, name: "mapPlaceholder", label: "Map Placeholder Text" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    {
      type: "object" as const,
      name: "contactMethods",
      label: "Contact Methods",
      list: true,
      fields: [
        { type: "string" as const, name: "icon", label: "Icon (symbol)" },
        { type: "string" as const, name: "label", label: "Label" },
        { type: "string" as const, name: "value", label: "Value" },
        { type: "string" as const, name: "href", label: "Link (tel:/mailto:/https://)" },
        { type: "string" as const, name: "note", label: "Note" },
      ],
    },
  ],
};

const processStepsBlock = {
  name: "processSteps",
  label: "Process Steps",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow Text" },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    {
      type: "object" as const,
      name: "steps",
      label: "Steps",
      list: true,
      fields: [
        { type: "string" as const, name: "number", label: "Step Number", required: true },
        { type: "string" as const, name: "title", label: "Title", required: true },
        { type: "string" as const, name: "description", label: "Description", ui: { component: "textarea" } },
      ],
    },
  ],
};

const productBuyButtonBlock = {
  name: "productBuyButton",
  label: "Product Buy Button",
  fields: [
    { type: "string" as const, name: "productId", label: "Product", required: true, ui: { component: ProductSelectComponent } },
    { type: "string" as const, name: "buttonText", label: "Button Text (optional)" },
    { type: "string" as const, name: "heading", label: "Heading (optional)" },
    { type: "string" as const, name: "description", label: "Description (optional)", ui: { component: "textarea" } },
    { type: "boolean" as const, name: "showPrice", label: "Show Price", ui: { defaultValue: true } },
    { type: "boolean" as const, name: "showDetails", label: "Show Details (type, duration)", ui: { defaultValue: true } },
    { type: "string" as const, name: "style", label: "Style", options: ["card", "primary", "subtle"] },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    { type: "string" as const, name: "companionType", label: "Companion Panel (card style only)", options: ["none", "text", "image"] },
    { type: "string" as const, name: "companionHeading", label: "Companion Heading" },
    { type: "string" as const, name: "companionText", label: "Companion Text", ui: { component: "textarea" } },
    { type: "image" as const, name: "companionImage", label: "Companion Image" },
    { type: "string" as const, name: "companionImageAlt", label: "Companion Image Alt Text" },
    { type: "string" as const, name: "cardPosition", label: "Card Position", options: ["left", "right"] },
  ],
};

const richTextBlock = {
  name: "richText",
  label: "Rich Text",
  fields: [
    { type: "rich-text" as const, name: "body", label: "Body" },
  ],
};

const bookingFormBlock = {
  name: "bookingForm",
  label: "Booking Form",
  fields: [
    { type: "string" as const, name: "productId", label: "Product", required: true, ui: { component: ProductSelectComponent } },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
  ],
};

const introGalleryBlock = {
  name: "introGallery",
  label: "Intro Gallery",
  fields: [
    { type: "string" as const, name: "headline", label: "Headline" },
    { type: "string" as const, name: "description", label: "Description" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    {
      type: "object" as const,
      name: "galleryItems",
      label: "Gallery Images",
      list: true,
      fields: [
        { type: "image" as const, name: "image", label: "Image" },
        { type: "string" as const, name: "caption", label: "Caption (optional)" },
      ],
    },
  ],
};

const productGridBlock = {
  name: "productGrid",
  label: "Product Grid",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow" },
    { type: "string" as const, name: "heading", label: "Heading" },
    { type: "string" as const, name: "description", label: "Description" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    { type: "string" as const, name: "linkBase", label: "Link Base URL", ui: { defaultValue: "/book" } },
    {
      type: "object" as const,
      name: "products",
      label: "Products",
      list: true,
      fields: [
        { type: "string" as const, name: "id", label: "Product ID", required: true },
        { type: "string" as const, name: "name", label: "Product Name", required: true },
        { type: "number" as const, name: "price", label: "Price", required: true },
        { type: "string" as const, name: "description", label: "Description" },
        { type: "string" as const, name: "category", label: "Category" },
        { type: "string" as const, name: "slug", label: "Slug (URL)" },
      ],
    },
  ],
};

const serviceSelectBarBlock = {
  name: "serviceSelectBar",
  label: "Service Select Bar",
  fields: [
    { type: "string" as const, name: "slug", label: "Service Slug", required: true, description: "The URL slug to match against Semble products" },
  ],
};

const dataTableBlock = {
  name: "dataTable",
  label: "Data Table",
  fields: [
    { type: "string" as const, name: "eyebrow", label: "Eyebrow" },
    { type: "string" as const, name: "headline", label: "Headline" },
    { type: "string" as const, name: "description", label: "Description" },
    { type: "string" as const, name: "theme", label: "Theme", options: ["off-white", "green", "grey", "terracotta"] },
    { type: "number" as const, name: "highlightColumn", label: "Highlight Column Index (0-based)", description: "Which column to highlight (e.g., 1 for second column)" },
    {
      type: "object" as const,
      name: "columns",
      label: "Columns",
      list: true,
      fields: [
        { type: "string" as const, name: "key", label: "Key (internal ID)", required: true },
        { type: "string" as const, name: "label", label: "Column Header", required: true },
      ],
    },
    {
      type: "object" as const,
      name: "rows",
      label: "Rows",
      list: true,
      fields: [
        { type: "string" as const, name: "col0", label: "Column 1" },
        { type: "string" as const, name: "col1", label: "Column 2" },
        { type: "string" as const, name: "col2", label: "Column 3" },
        { type: "string" as const, name: "col3", label: "Column 4" },
        { type: "string" as const, name: "col4", label: "Column 5" },
      ],
    },
    {
      type: "string" as const,
      name: "footnotes",
      label: "Footnotes",
      list: true,
    },
  ],
};

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
      {
        name: "pages",
        label: "Pages (Block Builder)",
        path: "content/pages",
        format: "json",
        ui: {
          router: ({ document }) =>
            document._sys.filename === "homepage"
              ? "/"
              : `/${document._sys.filename}`,
        },
        fields: [
          { type: "string" as const, name: "title", label: "Page Title", isTitle: true, required: true },
          { type: "string" as const, name: "description", label: "SEO Description" },
          { type: "rich-text" as const, name: "body", label: "Body Content (Markdown - use instead of blocks for simple pages)", description: "For simple text pages, use this field. For complex layouts with components, use Page Blocks below." },
          {
            type: "object" as const,
            name: "blocks",
            label: "Page Blocks (Components - optional)",
            list: true,
            templates: [
              heroBlock,
              heroImmersiveBlock,
              featureGridBlock,
              editorialGridBlock,
              editorialMosaicBlock,
              sectionIntroBlock,
              contentWithMediaBlock,
              productStatsBlock,
              cardsPortraitBlock,
              fullWidthImageBlock,
              asymmetricSplitBlock,
              testimonialBlock,
              personaCardsBlock,
              timelineBlock,
              faqAccordionBlock,
              includedGridBlock,
              darkCtaBlock,
              signatureFooterBlock,
              richTextBlock,
              hubHeroBlock,
              categoryShowcaseBlock,
              linkDirectoryBlock,
              featuredLinksBlock,
              contactFormBlock,
              processStepsBlock,
              productBuyButtonBlock,
              bookingFormBlock,
              introGalleryBlock,
              productGridBlock,
              serviceSelectBarBlock,
              dataTableBlock,
            ],
          },
          { type: "string" as const, name: "keywords", label: "SEO Keywords", list: true },
        ],
      },
      {
        name: "wellnessServices",
        label: "Wellness Services",
        path: "content/wellness-services",
        format: "md",
        ui: {
          router: ({ document }) =>
            document._sys.filename === "index"
              ? "/services"
              : `/services/${document._sys.filename}`,
        },
        fields: markdownPageFields,
      },
      {
        name: "membershipPages",
        label: "Membership",
        path: "content/membership",
        format: "md",
        ui: {
          router: ({ document }) =>
            document._sys.filename === "index"
              ? "/membership"
              : `/membership/${document._sys.filename}`,
        },
        fields: markdownPageFields,
      },
      {
        name: "knowledgeHubPages",
        label: "Knowledge Hub",
        path: "content/knowledge-hub",
        format: "md",
        ui: {
          router: ({ document }) =>
            document._sys.filename === "index"
              ? "/knowledge-hub"
              : `/knowledge-hub/${document._sys.filename}`,
        },
        fields: markdownPageFields,
      },
      {
        name: "ourStoryPages",
        label: "Our Story",
        path: "content/our-story",
        format: "md",
        ui: {
          router: ({ document }) =>
            document._sys.filename === "index"
              ? "/our-story"
              : `/our-story/${document._sys.filename}`,
        },
        fields: markdownPageFields,
      },
      {
        name: "articles",
        label: "Articles",
        path: "content/articles",
        format: "md",
        ui: {
          router: ({ document }) => `/articles/${document._sys.filename}`,
        },
        fields: [
          { type: "string" as const, name: "title", label: "Title", isTitle: true, required: true },
          { type: "string" as const, name: "description", label: "Description" },
          { type: "image" as const, name: "featured_image", label: "Featured Image" },
          { type: "string" as const, name: "author", label: "Author" },
          { type: "string" as const, name: "author_role", label: "Author Role" },
          { type: "datetime" as const, name: "date", label: "Publish Date" },
          { type: "string" as const, name: "read_time", label: "Read Time (e.g. 5 min)" },
          { type: "string" as const, name: "category", label: "Category", options: [
            "Longevity", "Nutrition", "Movement", "Mental Health", "Sleep",
            "Preventive Care", "Women's Health", "Men's Health", "Heart Health",
            "Hormones", "Cancer", "Weight", "Fertility", "Sexual Health",
          ]},
          { type: "string" as const, name: "tags", label: "Tags (match to service keywords)", list: true },
          { type: "rich-text" as const, name: "body", label: "Body", isBody: true },
          { type: "string" as const, name: "keywords", label: "SEO Keywords", list: true },
        ],
      },
      {
        name: "utilityPages",
        label: "Utility Pages",
        path: "content/utility",
        format: "md",
        ui: {
          router: ({ document }) =>
            document._sys.filename === "index"
              ? "/site-map"
              : `/${document._sys.filename}`,
        },
        fields: markdownPageFields,
      },
      {
        name: "myCocoonPages",
        label: "My Cocoon",
        path: "content/my-cocoon",
        format: "md",
        ui: {
          router: ({ document }) =>
            document._sys.filename === "index"
              ? "/my-cocoon"
              : `/my-cocoon/${document._sys.filename}`,
        },
        fields: markdownPageFields,
      },
      {
        name: "global",
        label: "Global Settings",
        path: "content/settings",
        format: "json",
        ui: {
          global: true,
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        match: {
          include: "global",
        },
        fields: [
          {
            type: "object" as const,
            name: "site",
            label: "Site Information",
            fields: [
              { type: "string" as const, name: "name", label: "Site Name" },
              { type: "string" as const, name: "tagline", label: "Tagline" },
              { type: "image" as const, name: "logo", label: "Site Logo" },
              { type: "string" as const, name: "phone", label: "Phone Number" },
              { type: "string" as const, name: "email", label: "Email Address" },
            ] as any,
          },
          {
            type: "object" as const,
            name: "social",
            label: "Social Media Links",
            fields: [
              { type: "string" as const, name: "instagram", label: "Instagram URL" },
              { type: "string" as const, name: "linkedin", label: "LinkedIn URL" },
              { type: "string" as const, name: "twitter", label: "Twitter URL" },
              { type: "string" as const, name: "facebook", label: "Facebook URL" },
            ] as any,
          },
        ] as any,
      },
      {
        name: "navigation",
        label: "Navigation Menu",
        path: "content/settings",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
          global: true,
        },
        match: {
          include: "navigation",
        },
        fields: [
          {
            type: "object" as const,
            name: "mainNav",
            label: "Main Navigation",
            list: true,
            description: "Add menu items (drag to reorder)",
            ui: {
              itemProps: (item: { label?: string }) => ({
                label: item.label || "Menu Item",
              }),
            },
            fields: [
              { type: "string" as const, name: "label", label: "Menu Label", required: true },
              { type: "string" as const, name: "url", label: "URL", required: true },
              {
                type: "object" as const,
                name: "children",
                label: "Submenu Items",
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
              itemProps: (item: { title?: string }) => ({
                label: item.title || "Column",
              }),
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
