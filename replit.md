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
Landing page with hero, services, process, testimonial, FAQ, contact form, footer.

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
- `client/src/pages/knowledge-hub.tsx` - Knowledge Hub page
- `client/src/pages/article.tsx` - Article detail page
- `client/src/components/cta-widgets.tsx` - 3 CTA widget components
- `client/src/lib/articles.ts` - Article data, categories, tags, search/filter utilities
- `client/src/App.tsx` - App router
- `client/src/index.css` - Theme variables (brand colors)
- `client/public/images/` - Logo, staff photos, article images, CTA images

## Running
`npm run dev` starts Express + Vite on port 5000
