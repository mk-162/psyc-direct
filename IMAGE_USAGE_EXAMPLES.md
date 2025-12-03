# Image Usage Examples for Psychology Direct

## Setup Complete! ✅

Your site is now configured for optimized images:
- ✅ Folder structure created: `src/assets/images/{team,services,testimonials,hero}`
- ✅ OptimizedImage component created
- ✅ HeroWithImage component created
- ✅ Path aliases configured (`@/`, `@components/`, `@assets/`)

---

## Quick Start

### 1. Add Your Images

Place your images in the appropriate folders:

```
src/assets/images/
├── team/
│   ├── dr-sarah-smith.jpg
│   └── dr-john-doe.jpg
├── services/
│   ├── family-law-consultation.jpg
│   ├── prison-psychology.jpg
│   └── educational-assessment.jpg
├── hero/
│   ├── family-law-hero.jpg
│   └── prison-law-hero.jpg
└── testimonials/
    └── client-headshot.jpg
```

### 2. Use Images in Pages

#### Example 1: Hero with Background Image

```astro
---
// src/pages/expert-witness-psychologists/family.astro
import Layout from '@/layouts/Layout.astro';
import HeroWithImage from '@/components/sections/HeroWithImage.astro';
import familyLawHero from '@/assets/images/hero/family-law-hero.jpg';
---

<Layout title="Family Law">
  <HeroWithImage
    title="Family Law Expert Witness Psychologists"
    subtitle="Expert parenting capacity assessments for family courts"
    badge="Expert Witness Psychology"
    imageSrc={familyLawHero}
    imageAlt="Psychologist conducting family assessment"
    imagePosition="right"
  />

  <!-- Rest of page content -->
</Layout>
```

#### Example 2: Team Member Photos

```astro
---
import OptimizedImage from '@/components/ui/OptimizedImage.astro';
import drSmith from '@/assets/images/team/dr-sarah-smith.jpg';
import drJones from '@/assets/images/team/dr-michael-jones.jpg';
---

<section class="py-20 bg-white">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="text-4xl font-bold text-center mb-12">Meet Our Psychologists</h2>

    <div class="grid md:grid-cols-3 gap-8">
      <div class="text-center">
        <OptimizedImage
          src={drSmith}
          alt="Dr. Sarah Smith, HCPC-registered Clinical Psychologist specializing in family law"
          width={300}
          height={300}
          class="rounded-full mx-auto mb-4 shadow-lg"
        />
        <h3 class="text-xl font-semibold">Dr. Sarah Smith</h3>
        <p class="text-gray-600">Clinical Psychologist</p>
        <p class="text-sm text-gray-500 mt-2">HCPC Registered | 15+ years experience</p>
      </div>

      <div class="text-center">
        <OptimizedImage
          src={drJones}
          alt="Dr. Michael Jones, Forensic Psychologist with expertise in criminal law"
          width={300}
          height={300}
          class="rounded-full mx-auto mb-4 shadow-lg"
        />
        <h3 class="text-xl font-semibold">Dr. Michael Jones</h3>
        <p class="text-gray-600">Forensic Psychologist</p>
        <p class="text-sm text-gray-500 mt-2">HCPC Registered | Prison law specialist</p>
      </div>
    </div>
  </div>
</section>
```

#### Example 3: Service Images with Cards

```astro
---
import OptimizedImage from '@/components/ui/OptimizedImage.astro';
import familyLawImage from '@/assets/images/services/family-law-consultation.jpg';
import prisonLawImage from '@/assets/images/services/prison-psychology.jpg';
import educationImage from '@/assets/images/services/educational-assessment.jpg';
---

<section class="py-20 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4">
    <div class="grid md:grid-cols-3 gap-8">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <OptimizedImage
          src={familyLawImage}
          alt="Family law psychological assessment session"
          width={400}
          height={250}
          class="w-full h-48 object-cover"
        />
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2">Family Law</h3>
          <p class="text-gray-600">Expert parenting capacity assessments for care proceedings and contact disputes.</p>
          <a href="/expert-witness-psychologists/family" class="text-[#2eabe0] hover:underline mt-4 inline-block">
            Learn more →
          </a>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <OptimizedImage
          src={prisonLawImage}
          alt="Prison law psychological assessment"
          width={400}
          height={250}
          class="w-full h-48 object-cover"
        />
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2">Prison Law</h3>
          <p class="text-gray-600">Parole board assessments, risk evaluations, and pre-sentencing reports.</p>
          <a href="/expert-witness-psychologists/prison-law" class="text-[#2eabe0] hover:underline mt-4 inline-block">
            Learn more →
          </a>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        <OptimizedImage
          src={educationImage}
          alt="Educational psychologist conducting EHCP assessment"
          width={400}
          height={250}
          class="w-full h-48 object-cover"
        />
        <div class="p-6">
          <h3 class="text-xl font-semibold mb-2">Educational Psychology</h3>
          <p class="text-gray-600">EHCP assessments, SEND support, and whole-school consultations.</p>
          <a href="/educational-psychologist" class="text-[#2eabe0] hover:underline mt-4 inline-block">
            Learn more →
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

#### Example 4: Testimonials with Photos

```astro
---
import OptimizedImage from '@/components/ui/OptimizedImage.astro';
import testimonial1 from '@/assets/images/testimonials/solicitor-headshot.jpg';
---

<section class="py-20 bg-white">
  <div class="max-w-4xl mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>

    <div class="bg-gray-50 rounded-xl p-8">
      <div class="flex items-start gap-6">
        <OptimizedImage
          src={testimonial1}
          alt="Sarah Johnson, Family Law Solicitor"
          width={80}
          height={80}
          class="rounded-full flex-shrink-0"
        />
        <div>
          <p class="text-gray-700 italic mb-4">
            "Psychology Direct provided an excellent expert witness for our care proceedings case. The report was thorough, delivered on time, and withstood cross-examination perfectly."
          </p>
          <p class="font-semibold">Sarah Johnson</p>
          <p class="text-sm text-gray-600">Family Law Solicitor, London</p>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Image Optimization Results

When you add images, Astro automatically:

1. **Converts to WebP** - Smaller file sizes, better performance
2. **Generates responsive sizes** - Serves the right size for each device
3. **Lazy loads** - Images load as user scrolls (except `loading="eager"`)
4. **Caches efficiently** - Browsers cache optimized images

### Before/After Example:
- Original JPG: `family-law.jpg` (2.5 MB)
- Optimized WebP: `family-law.webp` (180 KB) ⚡ **93% smaller!**

---

## Best Practices for Your Photos

### For Professional Headshots (Team Members):
- **Size**: 800x800px minimum
- **Format**: JPG or PNG
- **Style**: Professional, well-lit, neutral background
- **Filename**: `dr-firstname-lastname.jpg`

### For Service Images:
- **Size**: 1200x800px (3:2 ratio)
- **Format**: JPG
- **Style**: Professional, relevant to service (courtroom, school, consultation room)
- **Filename**: `service-name-description.jpg` (e.g., `family-law-consultation.jpg`)

### For Hero Images:
- **Size**: 1920x1080px or larger
- **Format**: JPG
- **Style**: High-quality, professional, not too busy (text needs to be readable on top)
- **Filename**: `service-hero.jpg`

---

## Testing Your Images

After adding images, check:

1. **Performance**: Open DevTools → Network tab → Look for `.webp` files
2. **Lazy Loading**: Scroll down page → Images load as you scroll
3. **Responsive**: Resize browser → Different image sizes load
4. **Accessibility**: Right-click → Inspect → Verify alt text is present

---

## Need Help?

- **Image optimization not working?** Make sure images are in `src/assets/images/` (not `public/`)
- **Path aliases not working?** Restart the dev server after updating `tsconfig.json`
- **Images too large?** Compress them before adding (use tools like TinyPNG or Squoosh)

---

## Next Steps

1. ✅ Add your professional photos to `src/assets/images/team/`
2. ✅ Add service images to `src/assets/images/services/`
3. ✅ Update one of your service pages to use `HeroWithImage`
4. ✅ Test performance in DevTools
