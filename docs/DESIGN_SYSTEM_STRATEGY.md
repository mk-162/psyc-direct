# Cocoon Healthcare: Design System & CMS Strategy

## 1. Core Principles: The "Single Source of Truth" Architecture

The fundamental philosophy driving this platform is the absolute separation of **content**, **structure**, and **presentation**. 

*   **Centralized Design (Zero Inline Styles):** To maintain absolute consistency across the platform, inline styles are strictly forbidden. Every margin, color, typography scale, and layout structure is governed centrally via `src/app/globals.css`. If the client requests a color tweak or a padding adjustment, it is changed in *one* place, and every component on the site updates instantly.
*   **Component-Driven Architecture:** Pages are not treated as giant, unstructured text documents. Instead, they are built by stacking discrete, pre-designed React components (Blocks).
*   **Thematically Fluid:** Components are not rigid in their appearance. Through the CMS, the client can apply predefined "Themes" (e.g., Dark, Light, Sage, Warm Sand) to any block. These themes apply global CSS classes (e.g., `.theme-dark`), automatically inverting text colors and adjusting backgrounds while adhering to the central design rules.

## 2. Design Ethic: The "Editorial Luxury" Aesthetic

Our design system is directly informed by high-end, editorial references (e.g., the "Rosewood Living" Figma grabs). This aesthetic is characterized by:

*   **Generous Pacing & Spacing:** Using expansive padding (e.g., 160px sections) to allow content to breathe. Space is treated as a premium design element, not just emptiness.
*   **Delicate, Deliberate Typography:** High-contrast typographic pairings. Large, light-weight serif headlines (`Playfair Display`, `Austin Trial`) contrast with tiny, widely tracked uppercase sans-serif labels for tags and eyebrows.
*   **Asymmetric & Masonry Layouts:** Moving away from rigid, boxy grids. We use asymmetric image placements and overlapping elements to create an editorial, magazine-like feel (e.g., the `IntroGallery` component).
*   **Subdued, Earthy Palette:** Moving away from stark hospital whites and clinical blues. The palette utilizes warm creams, deep olives/browns (`#4a483a`), warm stones, and sage greens to feel like a "Personal Sanctuary" rather than a clinic.

## 3. The Block & Theme Strategy

To allow the client to build world-class pages without touching code, we bridge the React components and Tina CMS using a structured schema.

### The Mechanism
1.  **React Component:** We build a structurally perfect component (e.g., `EditorialGrid.tsx`). It expects a specific set of data and a `theme` prop.
2.  **Tina CMS Schema:** We define a block in `tina/config.ts` that perfectly mirrors the component's expected data, including a dropdown for the Color Theme.
3.  **The Renderer:** A central `PremiumPageRenderer` loops through the page's JSON data, reads the `_template` type, and renders the corresponding React component, passing the chosen theme as a CSS class.

### Available Themes
Every major structural block offers these curated theme variants:
*   **Light (Mineral White):** Default high-contrast reading environment.
*   **Dark (Deep Olive/Black):** For dramatic hero sections, footers, or to break up page pacing. Forces text to reverse to cream.
*   **Sage (Subtle Green):** For calming, wellness-focused informational sections.
*   **Warm Sand:** For highlighting features or separating content logically.

## 4. Workflow: Creating Fantastic Pages

The workflow empowers the client to be an editor rather than a web developer.

1.  **Start with an Archetype:** The client selects a Page Template (see Section 5) as a starting point.
2.  **Stack Blocks for Rhythm:** The client uses the Tina CMS interface to add sections (`Hero`, `EditorialMosaic`, `FeatureGrid`). 
3.  **Establish Pacing via Color:** The secret to the luxury aesthetic is *alternating themes*. A page shouldn't be entirely white. The client can set the Hero to `Dark`, the Introduction to `Light`, and the Features to `Warm Sand`. The CSS ensures the transitions are flawless.
4.  **Populate Content:** The client fills in the structured fields (Headline, Subtitle, Image Uploads). The design system automatically handles the typography scaling, image aspect ratios, and responsive mobile stacking.

## 5. Page Template Library Definitions

To prevent the "blank canvas" problem, we provide predefined page archetypes built from our standard blocks. These serve as starting points that guarantee a high-quality layout.

### A. The Service Page Template
**Purpose:** A high-converting, deeply informative page for a specific medical offering (e.g., "Women's Health Screening").
**Typical Block Structure:**
1.  `ContainedHero` (Dark Theme) - Establishes authority.
2.  `EditorialMosaic` (Light Theme) - Explains the philosophy behind the service with asymmetric imagery.
3.  `FeatureGrid` (Warm Sand Theme) - Breaks down "What's Included" (diagnostics, consultations) into digestible cards.
4.  `ContentWithMedia` (Sage Theme) - Highlights specific technology or the patient experience.
5.  `SignatureFooter` (Dark Theme) - The final call to action to book.

### B. The Membership Details Template
**Purpose:** To convey the exclusivity, value, and benefits of a premium subscription tier.
**Typical Block Structure:**
1.  `FullBleedHero` (Dark Theme with background image) - Sets a luxurious, aspirational tone.
2.  `IntroGallery` (Light Theme) - Showcases the lifestyle and facility.
3.  `Stats/PricingHighlight` (Warm Sand Theme) - Clear, unmissable pricing and core value propositions.
4.  `EditorialGrid` (Sage Theme) - Detailed breakdown of membership benefits (Unlimited Consultations, Health Orchestration).

### C. The Category Home Template
**Purpose:** A beautifully paced directory page (e.g., "All Wellness Services" or "Knowledge Hub") that guides users to specific details.
**Typical Block Structure:**
1.  `MinimalHeader` (Light/Warm Theme) - Large typography, short introductory text.
2.  `EditorialGrid` (Alternating Themes) - Large, image-led cards acting as gateways to the sub-pages.
3.  `SignatureFooter` (Dark Theme) - CTA for those who need help choosing a path.

### D. The Editorial / Blog Post Template
**Purpose:** For founder's letters, deep-dive health articles, and patient stories. Optimized for reading comfort.
**Typical Block Structure:**
1.  `StandardHeader` - Eyebrow category, large title, no overwhelming background.
2.  `RichTextBody` - Narrow, central column (max 800px) utilizing `Austin Trial` serif for long-form reading. Supports elegant blockquotes and inline imagery.
3.  `AuthorBio` (Sage Theme) - Establishes medical credibility.
