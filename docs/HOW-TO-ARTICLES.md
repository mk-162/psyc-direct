# How to Create Articles & Knowledge Hub Pages with Sidebar

## Overview

Articles and Knowledge Hub pages support a **two-column layout** with a sticky sidebar containing topic tags, related service links, and a call-to-action block. Related services are linked automatically by matching **tags** on the article to **keywords** on services.

---

## Creating an Article

### 1. Add content in Tina

Go to **Tina Admin → Articles** and create a new article. Or create a markdown file in `content/articles/`.

### 2. Required fields

| Field | Example | Notes |
|-------|---------|-------|
| **Title** | Why Regular Health Screening Matters | Page heading |
| **Description** | Most serious conditions are treatable when caught early... | SEO + hero subtitle |
| **Body** | Rich text (markdown) | Main article content |

### 3. Optional fields

| Field | Example | Notes |
|-------|---------|-------|
| **Featured Image** | Upload via Tina | Full-width below hero |
| **Author** | Dr. Ben Naughton | Shown in meta bar |
| **Author Role** | Clinical Director | Below author name |
| **Publish Date** | 2026-03-01 | Formatted as "1 March 2026" |
| **Read Time** | 5 min | Shown as "5 min read" |
| **Category** | Preventive Care | Tag above the title (pick from dropdown) |
| **Tags** | `health screening`, `cardiovascular screening men` | **These link to services** |
| **SEO Keywords** | `health screening`, `preventive health` | For meta tags only |

### 4. URL

Articles live at `/articles/[filename]`. So `content/articles/my-article.md` → `/articles/my-article`.

---

## Adding Sidebar to Knowledge Hub Pages

Knowledge Hub pages (`content/knowledge-hub/`) also support the sidebar. The sidebar **activates automatically** when a page has tags.

- **Page with tags** → two-column layout with sidebar
- **Page without tags** → plain editorial layout (unchanged)

Just add `tags` to the frontmatter of any knowledge hub markdown file.

---

## How Tag Matching Works

### The connection: Article tags ↔ Service keywords

```
Article tag: "men's health screening"
         ↕ (case-insensitive match)
Service keyword: "men's health screening"  →  Male Health Screening service
```

### Step by step

1. You add **tags** to an article (e.g. `cardiovascular screening men`, `testosterone testing`)
2. At build time, the system reads **all services** and their `keywords` fields
3. Any service whose keywords overlap with the article's tags appears in the sidebar
4. Services are **sorted by number of matching tags** (most relevant first)
5. Maximum **4 services** shown

### Where to find service keywords

Each service file in `content/wellness-services/` has a `keywords` list in its frontmatter. To link an article to a service, use one or more of that service's keywords as your article tags.

**Example — linking to Male Health Screening:**

```yaml
# In content/wellness-services/male-health-screening.md
keywords:
  - men's health screening
  - male health check
  - testosterone testing
  - prostate health
  - cardiovascular screening men
```

Use any of those as a tag on your article:

```yaml
# In your article
tags:
  - men's health screening
  - testosterone testing
```

→ Male Health Screening will appear in the sidebar with "men's health screening" and "testosterone testing" shown as matched tags.

---

## Quick Reference: Service Keywords

| Service | Keywords to use as tags |
|---------|------------------------|
| Male Health Screening | `men's health screening`, `male health check`, `testosterone testing`, `prostate health`, `cardiovascular screening men` |
| Women's Health Screening | `women's health screening`, `female health check`, `hormonal assessment`, `reproductive health`, `menopause screening` |
| Cancer Screening | `cancer screening`, `early cancer detection`, `tumour markers`, `cancer prevention screening` |
| Menopause Specialist | `menopause specialist`, `perimenopause support`, `hormone replacement therapy`, `menopause clinic` |
| Sports Performance | `sports performance testing`, `athletic health screening`, `performance optimisation`, `athlete health check` |
| Brain & Cognitive Health | `cognitive health assessment`, `brain health screening`, `memory clinic`, `brain optimisation` |
| Liver Health | `liver health screening`, `liver function test`, `liver check`, `fatty liver assessment` |
| Weight Clinic | `weight management clinic`, `medical weight loss`, `metabolic assessment` |
| Tired All The Time | `chronic fatigue assessment`, `low energy clinic`, `fatigue investigation`, `tired all the time` |
| Fertility Health | `fertility screening`, `fertility assessment`, `preconception health`, `reproductive health check` |
| Sexual Health | `sexual health screening`, `STI testing`, `sexual health check` |
| 60+ Health Screening | `health screening over 60`, `senior health check`, `cognitive health assessment`, `healthy ageing clinic` |

---

## What the Sidebar Shows

1. **Topic tags** — all tags on the article, displayed as styled chips
2. **Related Services** — up to 4 services matched by tags, each showing:
   - Service title (linked to `/services/[slug]`)
   - First 120 chars of description
   - Which tags matched (highlighted)
3. **CTA block** — dark background with:
   - "Book a Consultation" button → `/utility/contact`
   - "Browse all services" link → `/services`

---

## Sidebar CTA Customisation

The CTA block text can be customised per-collection:

- **Articles**: "Take the next step" / general health messaging
- **Knowledge Hub**: "Need guidance?" / clinical team messaging

To change these, edit the `ctaHeading` and `ctaText` props where `ArticleSidebar` is used:
- Articles: `src/components/ArticlePage.tsx`
- Knowledge Hub: `src/components/KnowledgeHubWithSidebar.tsx`

---

## File Locations

| What | Where |
|------|-------|
| Article content | `content/articles/*.md` |
| Knowledge Hub content | `content/knowledge-hub/*.md` |
| Service content (keywords here) | `content/wellness-services/*.md` |
| Article route | `src/app/articles/[slug]/page.tsx` |
| Knowledge Hub route | `src/app/knowledge-hub/[slug]/page.tsx` |
| Article page component | `src/components/ArticlePage.tsx` |
| Knowledge Hub sidebar component | `src/components/KnowledgeHubWithSidebar.tsx` |
| Shared sidebar component | `src/components/ArticleSidebar.tsx` |
| Tag matching logic | `src/lib/relatedServices.ts` |
| Tina schema | `tina/config.ts` (articles collection + markdownPageFields) |
| CSS | `src/app/globals.css` (search "ARTICLE TEMPLATE") |

---

## Category Options (Articles only)

Longevity · Nutrition · Movement · Mental Health · Sleep · Preventive Care · Women's Health · Men's Health · Heart Health · Hormones · Cancer · Weight · Fertility · Sexual Health

---

## Tips

- **More tags = more service matches.** Use 4–6 tags per article for good sidebar coverage.
- **Tags are case-insensitive.** `Men's Health Screening` matches `men's health screening`.
- **Add new service keywords** to `content/wellness-services/[service].md` frontmatter — they'll be picked up automatically.
- **No tags = no sidebar.** Knowledge Hub pages without tags keep their existing full-width layout.
- **Sidebar is sticky.** It follows the reader as they scroll on desktop. On mobile (<900px) it stacks below the content.
