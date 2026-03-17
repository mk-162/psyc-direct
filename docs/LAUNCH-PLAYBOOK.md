# Website Launch Playbook

**How to take a new site from zero to live using the Cocoon stack.**

This is the repeatable process we used to build Cocoon. Follow these steps in order. Each step feeds the next.

---

## Overview

```
1. Reference Guide    →  Brand voice, tone, terminology
2. Sitemap            →  Every page, URL, and hierarchy
3. Content Generation →  AI agent writes all page content as Markdown
4. Template Mapping   →  Apply content to block components in TinaCMS
5. Design Polish      →  Visual review, CSS adjustments, imagery
6. Go Live            →  Vercel deployment, domain, analytics
```

Total time (with AI assistance): **2–5 days** for a 40–80 page site.

---

## Step 1: Create the Writing Style Reference

**What:** A document that defines how the site should sound. Every piece of content — headlines, body copy, button labels, meta descriptions — should follow this guide.

**Deliverables:** A single Markdown file covering:

- **Brand voice** — 3–5 adjectives (e.g. Cocoon: "warm, expert, unhurried, human, reassuring")
- **Tone spectrum** — where does the brand sit? (formal ↔ casual, clinical ↔ conversational)
- **Terminology** — preferred words and words to avoid (e.g. "wellness" not "healthcare products", "Member" not "customer")
- **Headline style** — sentence case or title case? Short or long? With or without punctuation?
- **Body copy rules** — sentence length, paragraph length, reading level target
- **CTA language** — button text conventions (e.g. "Begin Your Journey" not "Sign Up Now")
- **SEO guidelines** — meta title format, description length, keyword approach

**How to create it:**

1. Gather existing brand materials (brand book, tone of voice doc, existing copy the client likes)
2. Scrape the client's current site if one exists (use web_fetch to pull key pages into Markdown)
3. Ask the AI agent to analyse the copy and extract a style guide
4. Review with the client / designer — iterate once

**Example prompt for the agent:**
> "Here are 5 pages from the client's existing website. Analyse the writing style and produce a brand voice guide covering tone, terminology, headline style, body copy rules, and CTA language. Format as Markdown."

**Save to:** `workspace/[project]/style-guide.md`

---

## Step 2: Build the Sitemap

**What:** A complete list of every page the site needs, with URLs, page types, and hierarchy.

**Deliverables:** A Markdown file with:

- Primary navigation structure (top-level items + dropdowns)
- Every page listed with its URL slug
- Page type for each (block builder page, markdown content page, utility page)
- Content priority (launch essential vs. phase 2)
- Estimated page count

**How to create it:**

1. Start with the client's existing site structure (if migrating) or their business offering
2. Map out the information architecture with the client
3. For each section, list individual pages needed
4. Assign URL slugs following the CMS collection structure:
   - Service pages → `/services/[slug]`
   - About pages → `/our-story/[slug]`
   - Articles → `/knowledge-hub/[slug]`
   - Block builder pages → `/p/[slug]`
   - Utility pages → `/[slug]`
5. Flag which pages need the block builder (landing pages, homepage) vs. simple markdown (articles, service detail)

**Save to:** `workspace/[project]/sitemap.md`

---

## Step 3: Generate Content with an AI Agent

**What:** Use an AI agent to write all page content as Markdown files, following the style guide and sitemap.

**This is the bulk of the work — and where AI saves weeks.**

### 3a. Prepare the agent brief

Create a prompt file that includes:
- The style guide (from Step 1)
- The sitemap (from Step 2)
- Any client-provided content, brochures, or source material
- The target audience
- Key messages / USPs

### 3b. Generate content in batches

Spawn a sub-agent for each content section:

```
Task: "Write content for the following 15 service pages.
Follow the style guide at workspace/[project]/style-guide.md.
Each page needs: title, meta description, hero headline, hero subtitle,
3-4 body sections with headings, a benefits list, and a CTA section.
Output as individual Markdown files named per the sitemap slugs."
```

**Batch by collection:**
1. **Service pages** — one agent run for all services
2. **About/story pages** — one agent run
3. **Knowledge hub articles** — one agent run
4. **Utility pages** (privacy, terms, FAQ) — one agent run
5. **Homepage + landing pages** — these need block-level content (see Step 4)

### 3c. Review and refine

- Read through the generated content
- Check tone against the style guide
- Flag anything that needs client input (specific claims, pricing, team bios)
- Run a second agent pass for refinements if needed

**Save to:** `workspace/[project]/content/[collection]/[slug].md`

---

## Step 4: Apply Content to Templates

**What:** Take the Markdown content and load it into the CMS, mapping content sections to the appropriate block components.

### For Markdown pages (services, articles, about)

These are straightforward — the Markdown files go directly into the content folders:

```
workspace/[project]/content/services/male-health-screening.md
  → copy to repo: content/wellness-services/male-health-screening.md
```

Each file needs frontmatter:

```yaml
---
title: "Male Health Screening"
description: "Comprehensive health assessment designed specifically for men."
featured_image: "/images/services/male-health.jpg"
---

# Male Health Screening

Body content here...
```

### For block builder pages (homepage, landing pages)

These need to be assembled as JSON, mapping content to specific blocks. The agent writes the content; you (or an agent) map it to the block structure.

**Process:**

1. Decide the block sequence for the page (e.g. Hero → Section Intro → Feature Grid → Testimonial → CTA)
2. Take the agent's content and slot it into the block fields
3. Create the JSON file in `content/pages/[slug].json`

**Example block builder JSON:**

```json
{
  "title": "Homepage",
  "description": "Welcome to Cocoon",
  "blocks": [
    {
      "_template": "hero",
      "eyebrow": "Preventative Healthcare",
      "headline": "Healthcare designed for life",
      "subtitle": "A proactive, human-first approach...",
      "primaryButtonText": "Book Consultation",
      "primaryButtonUrl": "/utility/book-visit",
      "theme": "dark"
    },
    {
      "_template": "featureGrid",
      "headline": "Why choose Cocoon?",
      "description": "What makes us different",
      "theme": "light",
      "features": [
        { "title": "Longer consultations", "description": "..." },
        { "title": "Continuity of care", "description": "..." }
      ]
    }
  ]
}
```

**Or use the visual editor:** Open `/admin/index.html`, create a new page in "Pages (Block Builder)", and paste content into the block fields using the GUI. This is often faster for one-off pages.

### Available blocks for page composition

See `CMS-GUIDE.md` for the full list. The most commonly used for landing pages:

| Block | Typical use |
|-------|------------|
| Hero | Page header with headline + CTA |
| Section Intro | Section divider with heading + body |
| Feature Grid | Benefits / USP cards |
| Asymmetric Split | Text + image side-by-side |
| Testimonial | Customer quote |
| Cards Portrait | Service/product cards |
| FAQ Accordion | Common questions |
| Contact Form | Enquiry form with contact details |
| Dark CTA | Final call to action |

---

## Step 5: Design Polish

**What:** Visual review, image sourcing, CSS refinements.

### Images

- Source hero images, service photography, team photos
- Optimise for web (WebP or compressed JPEG, max 1200px wide for content, 2400px for heroes)
- Place in `public/images/[section]/`
- Update content files to reference the image paths

### CSS adjustments

- All styles in `src/app/globals.css`
- Use existing design tokens (see `CMS-GUIDE.md` for colour/font/spacing tokens)
- Add new section themes if the brand needs colours beyond the existing light/dark/sage/warm-sand

### Design system review

- Load `/design-system/components` locally
- Toggle each component through theme options
- Check mobile responsive behaviour
- Verify font loading (Typekit kit must be configured for the production domain)

---

## Step 6: Go Live

### Vercel setup

1. Connect the repo to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_GA_ID` — GA4 measurement ID
   - `RESEND_API_KEY` — contact form email delivery
   - `CONTACT_EMAIL_PROVIDER` — `resend`
   - `CONTACT_TO_EMAIL` — where enquiries go
   - `CONTACT_FROM_EMAIL` — sender address
   - `NEXT_PUBLIC_TINA_CLIENT_ID` — TinaCMS Cloud ID
   - `TINA_TOKEN` — TinaCMS Cloud token
3. Deploy

### Domain

- Add custom domain in Vercel dashboard
- Update DNS (CNAME to `cname.vercel-dns.com` or A record)
- SSL is automatic

### Typekit

- Add the production domain to the Typekit kit's allowed domains
- Kit ID: update in the HTML `<head>` if using a different kit

### Analytics

- Replace `G-XXXXXXXXXX` with real GA4 measurement ID
- In GA4, mark `generate_lead` as a conversion event (tracks all form submissions)
- Set up any campaign tracking (UTM parameters for LinkedIn ads, etc.)

### Post-launch checks

- [ ] All pages load without errors
- [ ] Contact forms submit and emails arrive
- [ ] Navigation links all work
- [ ] Mobile responsive — check on real devices
- [ ] Meta titles and descriptions render in search preview
- [ ] GA4 receiving pageview and event data
- [ ] Typekit fonts loading on production domain
- [ ] Social sharing previews (Open Graph) look correct
- [ ] Sitemap at `/sitemap.xml` is valid

---

## Timelines (realistic)

| Phase | Time | Who |
|-------|------|-----|
| Style guide | 2–4 hours | Agent + review |
| Sitemap | 1–2 hours | With client |
| Content generation | 4–8 hours | Agent (batched) |
| Content review | 2–4 hours | Human review |
| Template mapping | 4–8 hours | Agent + manual for block pages |
| Image sourcing | 4–8 hours | Designer / stock |
| Design polish | 4–8 hours | Designer + dev |
| Deployment | 1–2 hours | Dev |
| **Total** | **2–5 days** | |

---

## File reference

| File | Purpose |
|------|---------|
| `docs/CMS-GUIDE.md` | Full CMS technical reference |
| `docs/LAUNCH-PLAYBOOK.md` | This document |
| `tina/config.ts` | CMS schema — collections and block definitions |
| `src/app/globals.css` | All styles and design tokens |
| `src/components/blocks/` | Block component implementations |
| `content/` | All CMS content files |
