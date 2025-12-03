# Image Assets Guide

## Folder Structure

```
src/assets/images/
├── team/           # Team member photos, psychologist headshots
├── services/       # Service-related imagery (courts, schools, etc.)
├── testimonials/   # Client testimonial photos (if used)
├── hero/          # Hero section background images
└── README.md      # This file
```

## Image Optimization

All images in this folder are automatically optimized by Astro:
- ✅ Converted to WebP format
- ✅ Multiple sizes generated for responsive images
- ✅ Lazy loading by default
- ✅ Proper caching headers

## How to Use Images

### Method 1: Using OptimizedImage Component (Recommended)

```astro
---
import OptimizedImage from '@/components/ui/OptimizedImage.astro';
import psychologistPhoto from '@/assets/images/team/dr-smith.jpg';
---

<OptimizedImage
  src={psychologistPhoto}
  alt="Dr. Sarah Smith, Clinical Psychologist"
  width={400}
  height={400}
  class="rounded-lg"
/>
```

### Method 2: Direct Astro Image Component

```astro
---
import { Image } from 'astro:assets';
import heroImage from '@/assets/images/hero/family-law-hero.jpg';
---

<Image
  src={heroImage}
  alt="Family Law Psychology Services"
  width={1920}
  height={1080}
  format="webp"
  quality={80}
  loading="eager"
/>
```

### Method 3: Public Folder (for static images)

For images that don't need optimization (logos, icons), use `/public/images/`:

```astro
<img src="/images/PSYCHOLOGY.svg" alt="Psychology Direct" />
```

## Image Best Practices

### Recommended Sizes:
- **Hero images**: 1920x1080px (or larger)
- **Team photos**: 800x800px (square)
- **Service imagery**: 1200x800px (3:2 ratio)
- **Testimonial photos**: 400x400px (square)

### File Naming:
- Use lowercase
- Use hyphens, not spaces
- Be descriptive

**Good**: `family-law-consultation.jpg`, `dr-jane-doe-psychologist.jpg`
**Bad**: `IMG_1234.jpg`, `photo 1.jpg`

### Formats:
- **Photos**: Use `.jpg` (Astro will convert to WebP)
- **Graphics with transparency**: Use `.png`
- **Logos**: Use `.svg` (keep in `/public/images/`)

## Alt Text Guidelines

Always provide descriptive alt text for accessibility:

```astro
<!-- Good alt text -->
<OptimizedImage
  src={image}
  alt="Clinical psychologist conducting ADHD assessment with child in bright, welcoming office"
/>

<!-- Bad alt text -->
<OptimizedImage
  src={image}
  alt="Image"
/>
```

## Example Page Usage

```astro
---
// src/pages/about/meet-the-team.astro
import Layout from '@/layouts/Layout.astro';
import OptimizedImage from '@/components/ui/OptimizedImage.astro';
import drSmith from '@/assets/images/team/dr-smith.jpg';
import drJones from '@/assets/images/team/dr-jones.jpg';
---

<Layout title="Meet the Team">
  <section class="py-20">
    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <OptimizedImage
          src={drSmith}
          alt="Dr. Sarah Smith, Lead Clinical Psychologist"
          width={300}
          height={300}
          class="rounded-full mx-auto mb-4"
        />
        <h3>Dr. Sarah Smith</h3>
        <p>Lead Clinical Psychologist</p>
      </div>

      <div class="text-center">
        <OptimizedImage
          src={drJones}
          alt="Dr. Michael Jones, Forensic Psychologist"
          width={300}
          height={300}
          class="rounded-full mx-auto mb-4"
        />
        <h3>Dr. Michael Jones</h3>
        <p>Forensic Psychologist</p>
      </div>
    </div>
  </section>
</Layout>
```

## Hero Section with Background Image

```astro
---
import heroImage from '@/assets/images/hero/prison-law-hero.jpg';
---

<section
  class="relative py-20 text-white"
  style={`background-image: linear-gradient(rgba(3, 37, 82, 0.8), rgba(3, 37, 82, 0.9)), url(${heroImage.src}); background-size: cover; background-position: center;`}
>
  <div class="max-w-7xl mx-auto px-4">
    <h1 class="text-5xl font-bold">Prison Law Psychology Services</h1>
  </div>
</section>
```

## Next Steps

1. **Add your images** to the appropriate folders
2. **Use OptimizedImage component** for automatic optimization
3. **Test performance** - check Network tab to see WebP serving
4. **Verify accessibility** - all images have descriptive alt text

## Performance Tips

- Use `loading="eager"` only for above-the-fold images
- Use `loading="lazy"` (default) for everything else
- Compress images before uploading (aim for <500KB per image)
- Consider using placeholder backgrounds while images load
