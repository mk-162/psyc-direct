# Psychology Direct Astro Webpage Builder

## Project Overview
Modern, professional website for Psychology Direct - a network of 1,000+ qualified psychologists providing expert witness services and educational psychology support across the UK.

## Technology Stack
- **Framework**: Astro 5.x (SSG with Islands Architecture)
- **Styling**: Tailwind CSS 4
- **TypeScript**: Strict mode enabled
- **Deployment**: GitHub Pages / Netlify / Vercel

## Brand Guidelines

### Colors
```css
--color-primary-dark: #032552    /* Navy blue */
--color-primary: #066aab         /* Medium blue */
--color-primary-light: #2eabe0   /* Light blue */
--color-accent: #00a8e8          /* Accent blue */
--color-text-dark: #1a1a1a       /* Dark text */
--color-text-light: #4a5568      /* Light text */
--color-bg-light: #f7fafc        /* Light background */
```

### Typography
- Primary font: Inter (Google Fonts)
- Headings: Font-weight 600-700
- Body: Font-weight 400
- Line height: 1.5-1.75 for readability

### Logo
- Location: `/public/images/PSYCHOLOGY.svg`
- Usage: Always use SVG for crisp rendering
- Size in header: 48px (mobile), 56px (desktop)

## File Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Card.astro
│   │   ├── Tabs.astro
│   │   ├── FAQ.astro
│   │   ├── ProcessFlow.astro
│   │   └── Testimonial.astro
│   ├── forms/           # Form components
│   │   └── ContactForm.astro
│   └── sections/        # Page sections
├── layouts/
│   └── Layout.astro     # Base layout with header/footer
├── pages/               # Pages (auto-routed)
│   ├── index.astro      # Homepage
│   ├── expert-witness.astro
│   └── [other-pages].astro
├── styles/
│   └── global.css       # Global styles with Tailwind
└── content/             # Content collections (optional)
```

## Component Standards

### 1. Layout Component
Every page should use the base Layout:

```astro
---
import Layout from '../layouts/Layout.astro';
---

<Layout
  title="Page Title - Psychology Direct"
  description="SEO meta description"
>
  <!-- Page content -->
</Layout>
```

### 2. Hero Section
Standard hero for landing pages:

```astro
<Hero
  title="Main Heading"
  subtitle="Supporting text"
  ctaText="Primary CTA"
  ctaLink="/contact"
  secondaryCtaText="Secondary CTA"
  secondaryCtaLink="/about"
/>
```

### 3. Cards
Use Card component for services, features:

```astro
<Card
  title="Card Title"
  icon={svgIcon}
  href="/link"
  variant="elevated"
>
  <p>Card content here</p>
</Card>
```

### 4. Interactive Tabs
For feature showcases:

```astro
<Tabs tabs={[
  {
    id: 'tab1',
    label: 'Tab Label',
    title: 'Section Title',
    content: 'HTML content'
  }
]} />
```

### 5. FAQ Accordion
For frequently asked questions:

```astro
<FAQ items={[
  {
    question: 'Question text?',
    answer: 'Answer HTML'
  }
]} />
```

## Page Creation Process

### Step 1: Create Page File
Create a new `.astro` file in `src/pages/`:

```bash
src/pages/new-service.astro
```

### Step 2: Define Frontmatter
Set up imports and data:

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/ui/Hero.astro';
// ... other imports

const pageData = {
  // Define page-specific data
};
---
```

### Step 3: Build Page Structure
Follow this typical structure:

1. Hero section
2. Introduction/overview
3. Main content sections
4. Process flow (if applicable)
5. FAQ (if applicable)
6. Contact form/CTA
7. Trust badges/statistics

### Step 4: Responsive Design
Always use Tailwind responsive prefixes:

```html
<div class="py-8 md:py-12 lg:py-16">
  <h2 class="text-2xl md:text-3xl lg:text-4xl">
    <!-- Responsive text sizes -->
  </h2>
</div>
```

## SEO Standards

### Meta Tags
Every page must include:

```astro
<Layout
  title="Page Title | Psychology Direct"
  description="150-160 character description with target keywords"
>
```

### Semantic HTML
Use proper heading hierarchy:
- One `<h1>` per page
- Logical `<h2>`, `<h3>` structure
- Semantic tags: `<section>`, `<article>`, `<nav>`, etc.

### Accessibility
- Alt text for all images
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus states for all interactive elements

## Content Guidelines

### Tone
- Professional and trustworthy
- Clear and concise
- Focused on benefits, not features
- Evidence-based (statistics, credentials)

### Key Messages
1. **Fast**: 1-hour response time, 24-hour CV delivery
2. **Quality**: 1,000+ HCPC registered psychologists
3. **Professional**: 15+ years experience
4. **Ethical**: Legal Aid compliant, transparent pricing

### Trust Signals
Always include:
- HCPC registration
- BPS membership
- DBS certification
- Company registration number (07008023)
- Years of operation (15+)

## Component Templates

### Service Page Template

```astro
---
import Layout from '../layouts/Layout.astro';
import Hero from '../components/ui/Hero.astro';
import Card from '../components/ui/Card.astro';
import FAQ from '../components/ui/FAQ.astro';
import ContactForm from '../components/forms/ContactForm.astro';

const serviceAreas = [
  { title: 'Area 1', description: 'Description' },
  // ...
];

const faqItems = [
  { question: 'Question?', answer: 'Answer' },
  // ...
];
---

<Layout title="Service Name | Psychology Direct">
  <Hero
    title="Service Name"
    subtitle="Service description"
    ctaText="Get Started"
    ctaLink="#contact"
  />

  <!-- Service Overview -->
  <section class="py-16 bg-white">
    <!-- Content -->
  </section>

  <!-- Service Areas -->
  <section class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid md:grid-cols-3 gap-8">
        {serviceAreas.map((area) => (
          <Card title={area.title}>
            <p>{area.description}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <FAQ items={faqItems} />

  <!-- Contact -->
  <ContactForm title="Request This Service" />
</Layout>
```

## Git Workflow

### Branch Strategy
- `main` - Production branch
- `develop` - Development branch (optional)
- `feature/page-name` - Feature branches

### Commit Messages
Format:
```
Type: Brief description

- Detailed change 1
- Detailed change 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Workflow
1. Create feature branch: `git checkout -b feature/new-service`
2. Make changes and test locally
3. Commit changes with descriptive message
4. Push to GitHub: `git push origin feature/new-service`
5. Create Pull Request (if using PRs)
6. Merge to main
7. Auto-deploy via GitHub Actions

## Deployment

### Build Command
```bash
npm run build
```

### Output Directory
```
dist/
```

### Environment Variables
- None required for static site
- Add API keys in deployment platform settings if needed

## Testing Checklist

Before committing, verify:
- [ ] Page loads without errors
- [ ] All links work
- [ ] Forms validate properly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Images have alt text
- [ ] SEO meta tags present
- [ ] No console errors
- [ ] Lighthouse score 90+ (Performance, Accessibility, SEO)

## Common Tasks

### Add a New Service Page
```bash
# Prompt:
"Create a new service page for [service name] following the service page template"
```

### Update Contact Form
```bash
# Prompt:
"Update the contact form to add a new field for [field name]"
```

### Add a New Component
```bash
# Prompt:
"Create a new component called [ComponentName] that displays [description]"
```

## Resources

- [Astro Docs](https://docs.astro.build)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Psychology Direct Brand Assets](./public/images/)
- [Original Website](https://www.psychologydirect.co.uk)

## Notes

- Always test locally before pushing
- Keep components reusable and modular
- Maintain consistent spacing (py-8, py-12, py-16)
- Use existing components when possible
- Document any new patterns in this file
