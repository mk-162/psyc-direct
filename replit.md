# Psychology Direct - Website

## Overview
A professional website for Psychology Direct, a UK-based provider of expert witness psychologists and psychiatrists for solicitors and insurers.

## Architecture
- **Frontend**: React + TypeScript with Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js (minimal - static content only)
- **Routing**: wouter
- **Animations**: framer-motion (hero staff slideshow)

## Design System
Based on the brand style guide:
- **Color Palette**: Dark Blue (#032552), Dark Azure (#00588e), Vivid Azure (#066aab), Azure (#2eabe0), Light Azure (#cee4f7), Light Blue (#f0f5ff)
- **Typography**: Libre Baskerville (serif, headings), Montserrat (sans-serif, body)
- **Tone**: Authoritative but approachable, clear and transparent

## Pages

### Home (`/`)
Landing page with hero staff slideshow, "Our Understanding" section (watermark bg), services grid, "What Sets Us Apart" tabbed differentiators, psychiatrist CTA, contact form, process steps, testimonial, resources, case studies, FAQ accordion, footer.

### Expert Witness (`/expert-witness`)
Dedicated landing page with:
- Large hero image with text overlay and CTAs
- Intro paragraph
- "What Sets Us Apart" horizontal tabs (Fast & Responsive, Outstanding Quality, Personal Service, Competitive Costs)
- Three-step process (Match, Instruct, Deliver)
- 6 practice area cards (Family, Criminal, Employment, Personal Injury, Immigration, Clinical Negligence)
- 3 case study cards
- Stats bar (1 Hour, 24 Hours, 100%)
- FAQ accordion (6 items)
- Contact form with GDPR consent
- Full footer

### Component Library (`/component-library`)
Centralised showcase of every reusable component. Includes:
- All existing components from other pages (heroes, cards, tabs, process steps, stats, FAQs, CTAs, forms, footer)
- 10 new components: Team Grid, Logo Cloud, Pricing Table, Timeline, Feature Comparison, Video Section, Newsletter Strip, Alert Banner, Testimonial Carousel, Metric Cards
- Sticky section navigation for quick jumping between components
- Each section labelled with component ID and description

### Knowledge Hub (`/knowledge-hub`)
SEO-focused knowledge base with:
- Search functionality
- Category filtering (Expert Witness, Mental Health, Legal Process, Family Law, Clinical Negligence, Neuropsychology)
- Tag-based navigation (18 tags)
- Featured article (large card)
- Article grid (standard cards)
- Compact article list
- Sidebar with CTA widget, tags, categories
- 3 CTA widget styles demo section

### Article Page (`/knowledge-hub/:slug`)
Individual article pages with:
- Schema.org structured data
- Breadcrumb navigation
- Article hero image
- Prose-styled content
- Mid-article CTA injection
- Related articles
- Sidebar with CTA widget and related articles
- Share functionality

## CTA Widget Styles
3 marketing widget styles for white paper promotion:
1. **CTABanner** - Full-width dark banner with guide image and email signup
2. **CTAInlineCard** - Compact card with checklist and inline email form
3. **CTASidebar** - Vertical sidebar widget with image and form

## Key Files
- `client/src/pages/home.tsx` - Landing page
- `client/src/pages/expert-witness.tsx` - Expert Witness landing page
- `client/src/components/site-header.tsx` - Shared header with mobile slide-out nav
- `client/src/components/ui-blocks.tsx` - 10 new reusable components (TeamGrid, LogoCloud, PricingTable, Timeline, etc.)
- `client/src/pages/component-library.tsx` - Component library showcase page
- `client/src/pages/knowledge-hub.tsx` - Knowledge Hub page
- `client/src/pages/article.tsx` - Article detail page
- `client/src/components/cta-widgets.tsx` - 3 CTA widget components
- `client/src/lib/articles.ts` - Article data, categories, tags, search/filter utilities
- `client/src/App.tsx` - App router
- `client/src/index.css` - Theme variables (brand colors)
- `client/public/images/` - Logo, staff photos, article images, CTA images

## Running
`npm run dev` starts Express + Vite on port 5000
