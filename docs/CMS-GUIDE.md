# Cocoon Website — CMS & Technical Guide

**For:** Design agency (Matt Naughton / team)
**Last updated:** February 2026

---

## Stack overview

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| CMS | TinaCMS (visual editing) | 3.5.x |
| Styling | Pure CSS (globals.css) | — |
| Fonts | Benton Modern Display + Sweet Sans Pro (Typekit) | Kit `hvc0dvt` |
| Hosting | Vercel | — |
| Analytics | GA4 (via env var `NEXT_PUBLIC_GA_ID`) | — |
| Contact forms | `/api/contact` → Resend email | — |

**No Tailwind.** All styling is in `src/app/globals.css` using CSS custom properties.

---

## How content editing works

TinaCMS provides a visual editor at `/admin/index.html`. Editors see a live preview of the page on the left and a form panel on the right. Changes save directly to content files (JSON or Markdown) which are committed to the Git repo.

### Accessing the CMS

- **Local dev:** `http://localhost:3002/admin/index.html`
- **Production:** `https://[domain]/admin/index.html`

No login required in local dev. Production uses TinaCMS Cloud authentication.

---

## Content collections

The CMS has 8 collections. Each maps to a folder of content files and a set of URL routes.

### 1. Pages (Block Builder)

**Path:** `content/pages/*.json`
**URL:** `/p/[filename]`
**Format:** JSON

This is the main page builder. Each page is composed of **blocks** — reusable content sections that can be added, removed, and reordered in the visual editor.

**Existing pages:**
- `homepage.json` → `/p/homepage` (also rendered at `/`)
- `contact.json` → `/p/contact`
- `knowledge-hub.json` → `/p/knowledge-hub`
- `male-health-screening.json` → `/p/male-health-screening`

**To create a new page:** In the CMS sidebar, go to "Pages (Block Builder)" → click "Create New" → give it a filename (this becomes the URL slug) → add blocks.

### 2. Wellness Services

**Path:** `content/wellness-services/*.md`
**URL:** `/services/[filename]` (or `/services` for `index.md`)
**Format:** Markdown with frontmatter

Individual service pages (health screenings, packages, etc.). Each has a title, description, optional hero image, and rich-text body content.

### 3. Membership

**Path:** `content/membership/*.md`
**URL:** `/membership/[filename]`
**Format:** Markdown

Membership tier pages and information.

### 4. Knowledge Hub

**Path:** `content/knowledge-hub/*.md`
**URL:** `/knowledge-hub/[filename]`
**Format:** Markdown

Articles, guides, and educational content.

### 5. Our Story

**Path:** `content/our-story/*.md`
**URL:** `/our-story/[filename]`
**Format:** Markdown

About pages, team profiles, clinic story.

### 6. My Cocoon

**Path:** `content/my-cocoon/*.md`
**URL:** `/my-cocoon/[filename]`
**Format:** Markdown

Patient portal / member area pages.

### 7. Utility Pages

**Path:** `content/utility/*.md`
**URL:** `/[filename]`
**Format:** Markdown

Legal, privacy, terms, sitemap, etc.

### 8. Global Settings

**Path:** `content/settings/global.json`
**Not a page** — stores site-wide settings: site name, tagline, logo, phone, email, social media links. Accessible from any component.

### 9. Navigation Menu

**Path:** `content/settings/navigation.json`
**Not a page** — controls the main navigation and footer link columns. Drag to reorder. Supports one level of submenu items.

---

## Available page blocks

When building a page in the "Pages (Block Builder)" collection, these blocks are available:

| Block | What it does |
|-------|-------------|
| **Hero** | Full-width header with eyebrow, headline, subtitle, background image, two CTA buttons. Theme: light/dark/sage/warm-sand. |
| **Hero Immersive** | Full-viewport hero with background image and discover link. |
| **Feature Grid** | Grid of feature cards with icon, title, and description. |
| **Editorial Grid** | Magazine-style grid layout for content teasers. |
| **Intro Gallery** | Image gallery with editorial introduction text. |
| **Section Intro** | Eyebrow + heading + body text section divider. |
| **Product Stats** | Statistics/numbers display with labels. |
| **Cards Portrait** | Portrait-oriented cards with image, tag, title, description. |
| **Full-Width Image** | Edge-to-edge image band with optional overlay text. |
| **Asymmetric Split** | Two-column layout with different widths (text + image). |
| **Testimonial** | Customer quote with attribution and optional image. |
| **Persona Cards** | Cards for different customer personas / user types. |
| **Timeline** | Vertical process/timeline with steps. |
| **FAQ Accordion** | Expandable question-and-answer list. |
| **Included Grid** | Grid showing what's included in a service/package. |
| **Dark CTA Section** | Dark-background call to action with headline and button. |
| **Signature Footer** | Branded section footer with logo and tagline. |
| **Rich Text** | Free-form rich text content (markdown). |
| **Hub Hero** | Category/hub page hero with search or navigation. |
| **Category Showcase** | Grid of category cards for hub pages. |
| **Link Directory** | Organised list of links grouped by category. |
| **Featured Links** | Highlighted link cards. |
| **Contact Form** | Contact form with info panel, contact methods, and map placeholder. |
| **Process Steps** | Numbered step-by-step process display. |

### Theme options

Most blocks support a `theme` field with these options:
- **light** — cream/white background, dark text
- **dark** — deep olive background, light text
- **sage** — sage green background
- **warm-sand** — warm neutral background

---

## Design tokens (CSS custom properties)

All colours, fonts, and spacing are defined in `src/app/globals.css` as CSS custom properties. Key tokens:

### Colours

| Token | Value | Use |
|-------|-------|-----|
| `--color-primary` | `#4B563B` (deep olive) | Headers, nav, footer, primary actions |
| `--color-figmav1-cream` | `#F4F3EF` | Page backgrounds, light sections |
| `--color-figmav1-black` | `#2A2418` | Body text |
| `--color-sage-green` | `#B7B9AE` | Sage theme backgrounds |
| `--color-text-secondary` | `#6B6456` | Secondary/muted text |

### Fonts

| Token | Font | Use |
|-------|------|-----|
| `--font-primary` | Benton Modern Display (serif) | Headlines, display text |
| `--font-accent` | Sweet Sans Pro (sans-serif) | Eyebrows, labels, buttons, uppercase text |
| `--font-body` | Benton Modern Display (serif) | Body text (editorial feel) |

Both fonts load from Adobe Typekit (kit ID: `hvc0dvt`). The `<link>` tag is in the HTML `<head>`.

### Spacing

Uses a scale: `--space-1` through `--space-32` (4px increments up to 128px).

---

## File structure (key files)

```
src/
├── app/
│   ├── layout.tsx          ← Root layout (header, footer, GA4)
│   ├── globals.css         ← ALL styles (single file)
│   ├── page.tsx            ← Homepage
│   ├── p/[slug]/page.tsx   ← Block builder pages
│   ├── services/           ← Wellness service pages
│   ├── careers/page.tsx    ← Recruitment landing page
│   └── api/contact/        ← Contact form endpoint
├── components/
│   ├── Header.tsx          ← Site navigation
│   ├── Footer.tsx          ← Site footer with signup form
│   └── blocks/             ← All block components (one per block type)
├── lib/
│   ├── markdown.ts         ← Content file readers
│   ├── analytics.ts        ← GA4 event helpers
│   └── types.ts            ← TypeScript types
content/
├── pages/                  ← Block builder JSON files
├── wellness-services/      ← Service markdown files
├── membership/
├── knowledge-hub/
├── our-story/
├── my-cocoon/
├── utility/
└── settings/
    ├── global.json         ← Site name, contact details, social links
    └── navigation.json     ← Menu structure
tina/
├── config.ts               ← CMS schema (collections, block definitions)
└── __generated__/          ← Auto-generated types + GraphQL client
```

---

## Adding a new block type

1. **Define the block** in `tina/config.ts` — create a `const myNewBlock = { name, label, fields }` object
2. **Add it to the templates array** inside the `pages` collection
3. **Create the component** in `src/components/blocks/MyNewBlock.tsx`
4. **Register it in the renderer** — add the case to `src/components/blocks/PremiumPageRenderer.tsx` or `EditorialPageClient.tsx`
5. **Restart the dev server** — TinaCMS regenerates types on restart

---

## Adding a new standalone page (not CMS-managed)

Create a file at `src/app/[route]/page.tsx`. It will use the site header and footer automatically from the root layout.

Example: `src/app/careers/page.tsx` — the recruitment landing page.

---

## Forms & analytics

All contact forms post to `/api/contact` (in `src/app/api/contact/route.ts`). The endpoint supports:
- **Resend** (set `CONTACT_EMAIL_PROVIDER=resend` + `RESEND_API_KEY` in `.env.local`)
- **Console logging** in dev (when no provider is configured)

**GA4 conversion tracking** fires a `generate_lead` event on every successful form submission, with `form_name` identifying which form:
- `contact_form` — main contact block
- `footer_signup` — footer email form
- `careers_form` — careers page (also sends `role`)

GA4 measurement ID is set via `NEXT_PUBLIC_GA_ID` in `.env.local`.

---

## Local development

```bash
# Start everything (Next.js + TinaCMS + LAN proxy)
./dev.sh

# Site:      http://localhost:3002
# CMS:       http://localhost:3002/admin/index.html
# Tina API:  http://localhost:4001/graphql
# LAN:       http://192.168.1.70:3002
```

---

## Deployment

Hosted on Vercel. Push to `main` triggers automatic deployment (if auto-deploy is connected) or deploy manually from the Vercel dashboard.

Environment variables needed in Vercel:
- `NEXT_PUBLIC_GA_ID` — GA4 measurement ID
- `RESEND_API_KEY` — for contact form emails
- `CONTACT_EMAIL_PROVIDER` — set to `resend`
- `CONTACT_TO_EMAIL` — recipient email
- `CONTACT_FROM_EMAIL` — sender email
- `NEXT_PUBLIC_TINA_CLIENT_ID` — TinaCMS Cloud client ID
- `TINA_TOKEN` — TinaCMS Cloud read token
