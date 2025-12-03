# Keystatic CMS Setup Guide

## ✅ Installation Complete!

Your Psychology Direct site now has a powerful, free CMS for non-technical content editors.

---

## What is Keystatic?

Keystatic is a **free, Git-based CMS** built specifically for Astro. Think of it as WordPress admin panel, but:
- ✅ **100% free forever** (no usage limits, no user limits)
- ✅ **Content stored in your Git repo** (no vendor lock-in, full version history)
- ✅ **Visual editor** (non-technical friendly)
- ✅ **No database needed** (content is markdown files)

---

## Quick Start for Marketing Team

### 1. Access the Admin Panel

**Local Development:**
```
http://localhost:4321/keystatic
```

**Production (Vercel):**
```
https://psyc-direct.vercel.app/keystatic
```

### 2. First Time Setup (GitHub OAuth)

When you first visit `/keystatic`, you'll need to connect to GitHub:

1. Click **"Sign in with GitHub"**
2. Authorize the Keystatic app
3. You'll be redirected back to the admin panel

**Important:** You need a GitHub account with access to the `mk-162/psyc-direct` repository.

---

## Content Types Available

### 📄 Service Pages
Create and edit psychology/psychiatry service pages:
- Family Law
- Criminal Law
- Prison Law
- Educational Psychology
- etc.

**Structure:**
- Hero section (title, subtitle, badge)
- Challenge section
- Solution section
- "Why Choose Us" benefits (with icons)
- FAQs (expandable)
- Trust signals (stats)
- SEO metadata

### 📝 Blog Posts
Write blog articles with:
- Featured image
- Category and tags
- Rich text editor
- Draft mode
- SEO metadata

### 👥 Team Members
Add psychologist/psychiatrist profiles:
- Professional photo
- Bio
- Qualifications
- Specializations
- Contact info

---

## How to Edit Content

### Creating a New Service Page

1. Go to `http://localhost:4321/keystatic`
2. Click **"Service Pages"** in sidebar
3. Click **"Create Entry"** button
4. Fill in the form:

```
Page Title: Prison Law Expert Witness Psychologists
SEO Title: Prison Law Psychologists | Psychology Direct
Meta Description: Court-ready psychological assessments for parole boards, risk assessment, and pre-sentencing reports...

Category: Expert Witness Psychology

Hero Section:
  Badge: Expert Witness Psychology
  Title: Prison Law Expert Witness Psychologists
  Subtitle: Court-ready psychological assessments for prisoners...

Challenge Section:
  Title: The Challenge
  Content: [Rich text editor - explain the client's problem]

Solution Section:
  Title: Our Solution
  Content: [Rich text editor - explain your service]

Why Choose Us Benefits:
  [Click "Add Item"]
  Icon: ⚖️ Legal
  Title: HCPC Registered
  Description: All our psychologists are HCPC registered...

FAQs:
  [Click "Add Item"]
  Question: How long does an assessment take?
  Answer: [Rich text editor]

Trust Signals:
  Stat 1: 500+ | Reports Delivered
  Stat 2: 15+ | Years Experience
  Stat 3: 100% | Court Accepted
```

5. Click **"Create"** (saves as draft in your local repo)
6. Click **"Commit"** to push to GitHub → auto-deploys to Vercel

### Editing an Existing Page

1. Go to `/keystatic`
2. Click **"Service Pages"**
3. Click the page you want to edit
4. Make your changes
5. Click **"Update"**
6. Click **"Commit"** to publish

### Creating a Blog Post

1. Go to `/keystatic`
2. Click **"Blog Posts"**
3. Click **"Create Entry"**
4. Fill in:
   - Title
   - Publish Date
   - Author
   - Category (Expert Witness, Family Law, etc.)
   - Excerpt (for listings)
   - Featured Image (upload)
   - SEO metadata
   - Post content (rich text)
   - Tags
   - Draft checkbox (check to save without publishing)
5. Click **"Create"**
6. Click **"Commit"** to publish

---

## Understanding the Workflow

### How Content Gets Published

```
1. Edit content in /keystatic
   ↓
2. Click "Update" or "Create"
   (Saves to local Git repo)
   ↓
3. Click "Commit"
   (Creates Git commit)
   ↓
4. Push to GitHub
   (Triggers Vercel deployment)
   ↓
5. Site rebuilds automatically
   (Live in ~2 minutes)
```

### Git-Based Benefits

Every content change creates a Git commit, which means:
- ✅ **Full version history** - See what changed and when
- ✅ **Rollback capability** - Revert to previous versions
- ✅ **Audit trail** - Know who changed what
- ✅ **No data loss** - Content is backed up in Git

---

## For Developers

### Project Structure

```
src/
├── content/
│   ├── pages/           # Service pages (managed by Keystatic)
│   ├── posts/           # Blog posts (managed by Keystatic)
│   └── team/            # Team members (managed by Keystatic)
├── pages/
│   ├── keystatic/
│   │   └── [...params].astro   # Admin UI
│   └── api/
│       └── keystatic/
│           └── [...params].ts   # API routes
keystatic.config.ts              # CMS configuration
```

### Adding New Fields to Schema

Edit `keystatic.config.ts`:

```typescript
// Example: Add a new field to service pages
pages: collection({
  schema: {
    // ... existing fields
    videoUrl: fields.text({
      label: 'YouTube Video URL',
      description: 'Optional video for hero section',
    }),
  },
}),
```

### Rendering Content in Astro Pages

```astro
---
// src/pages/services/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const pages = await getCollection('pages');
  return pages.map(page => ({
    params: { slug: page.slug },
    props: { page },
  }));
}

const { page } = Astro.props;
const { Content } = await page.render();
---

<Layout title={page.data.seoTitle}>
  <section class="hero">
    <h1>{page.data.hero.title}</h1>
    <p>{page.data.hero.subtitle}</p>
  </section>

  <Content />

  <!-- FAQs -->
  {page.data.faqs.map(faq => (
    <details>
      <summary>{faq.question}</summary>
      <div>{faq.answer}</div>
    </details>
  ))}
</Layout>
```

### Local Development

```bash
npm run dev
# Visit http://localhost:4321/keystatic
```

### Deployment

Push to GitHub → Vercel auto-deploys:

```bash
git add .
git commit -m "Update service pages"
git push
```

---

## Storage Mode: GitHub

**Current setup:** `storage: { kind: 'github' }`

This means:
- Content is stored in the `mk-162/psyc-direct` GitHub repo
- Changes create Git commits
- Requires GitHub authentication
- Works in production (Vercel)

### Alternative: Local Mode (for development)

If you want to test without GitHub:

```typescript
// keystatic.config.ts
storage: {
  kind: 'local',
}
```

Then:
- Content stored locally
- No GitHub required
- Won't work in production

---

## Content Collections Integration

Keystatic creates content that's compatible with Astro Content Collections.

### Define Collection Schema (Optional)

Create `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    seoTitle: z.string(),
    metaDescription: z.string(),
    category: z.enum(['expert-witness-psychology', 'expert-witness-psychiatry', 'educational-psychology']),
    hero: z.object({
      badge: z.string(),
      title: z.string(),
      subtitle: z.string(),
    }),
    // ... rest of schema
  }),
});

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    publishDate: z.date(),
    author: z.string(),
    category: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  pages: pagesCollection,
  posts: postsCollection,
};
```

This gives you:
- ✅ TypeScript autocomplete
- ✅ Build-time validation
- ✅ Type-safe content queries

---

## Migrating Existing Pages to Keystatic

You have 5 service pages already built. To migrate them to Keystatic:

### Option 1: Manual Entry (Recommended for Learning)
1. Go to `/keystatic`
2. Create new service page
3. Copy content from existing `.astro` file
4. Paste into Keystatic fields
5. Commit

### Option 2: Create Markdown Files Directly

Create files in `src/content/pages/`:

```markdown
---
# src/content/pages/prison-law-psychology.mdx
title: prison-law-psychology
seoTitle: Prison Law Expert Witness Psychologists | Psychology Direct
metaDescription: Court-ready psychological assessments for prisoners, parole boards...
category: expert-witness-psychology
hero:
  badge: Expert Witness Psychology
  title: Prison Law Expert Witness Psychologists
  subtitle: Court-ready psychological assessments for prisoners...
challenge:
  title: The Challenge
  content: |
    # Complex cases
    Prison law cases require...
solution:
  title: Our Solution
  content: |
    We provide...
whyChooseUs:
  - icon: legal
    title: HCPC Registered
    description: All our psychologists are HCPC registered...
  - icon: time
    title: Fast Turnaround
    description: Standard reports within 4-6 weeks...
faqs:
  - question: How long does an assessment take?
    answer: |
      Assessments typically take 2-3 hours...
trustSignals:
  stat1:
    number: 500+
    label: Reports Delivered
  stat2:
    number: 15+
    label: Years Experience
  stat3:
    number: 100%
    label: Court Accepted
---

Additional page content here (optional)...
```

Then edit via `/keystatic` interface.

---

## Troubleshooting

### "Sign in with GitHub" not working

**Solution:** You need to set up GitHub OAuth app.

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - Application name: `Psychology Direct CMS`
   - Homepage URL: `https://psyc-direct.vercel.app`
   - Authorization callback URL: `https://psyc-direct.vercel.app/api/keystatic/github/oauth/callback`
4. Click **"Register application"**
5. Copy Client ID and generate Client Secret
6. Add to Vercel environment variables:
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`

### Changes not appearing on live site

**Check:**
1. Did you click "Commit"? (not just "Update")
2. Did the commit push to GitHub?
3. Did Vercel deployment succeed? (check Vercel dashboard)

### "Collection not found" error

**Solution:** Make sure content directory exists:

```bash
mkdir -p src/content/pages
mkdir -p src/content/posts
mkdir -p src/content/team
```

### Images not uploading

**Solution:** Create image directories:

```bash
mkdir -p src/assets/images/blog
mkdir -p src/assets/images/team
```

---

## Next Steps

### For Marketing Team:
1. ✅ Visit `/keystatic` and sign in with GitHub
2. ✅ Create a test blog post
3. ✅ Edit an existing service page
4. ✅ Commit and watch it deploy

### For Developers:
1. ✅ Set up GitHub OAuth for production
2. ✅ Migrate existing 5 service pages to Keystatic
3. ✅ Create blog listing page
4. ✅ Create team member grid page
5. ✅ Add Content Collections schema for type safety

---

## Resources

- **Keystatic Docs:** https://keystatic.com/docs
- **Astro Content Collections:** https://docs.astro.build/en/guides/content-collections/
- **GitHub OAuth Setup:** https://keystatic.com/docs/github-mode

---

## Support

Questions? Check:
1. This guide
2. Keystatic docs (keystatic.com/docs)
3. Ask the development team

**Current Setup:**
- ✅ Keystatic installed and configured
- ✅ Admin UI at `/keystatic`
- ✅ GitHub storage mode
- ✅ 3 content types: Service Pages, Blog Posts, Team Members
- ✅ Vercel deployment configured
- ✅ Free forever (no limits)
