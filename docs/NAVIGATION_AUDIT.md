# Navigation UX Audit

## Current Sitemap Structure

### Primary Navigation (5 items)

| Section | Sub-items | Pages Exist |
|---------|-----------|-------------|
| **1. Wellness Services** | 14 services | ✅ 15 pages |
| **2. My Cocoon** | Portal page | ✅ 1 page |
| **3. Knowledge Hub** | 4 sections | ✅ 4 pages |
| **4. The Cocoon Story** | 4 main areas | ✅ 7 pages |
| **5. Membership** | 3 tiers + more | ✅ 4 pages |

### Total: 48 pages

---

## UX Recommendations

### Problem: 14 services in dropdown = too many choices
**Solution: Group into 4 logical categories**

```
WELLNESS SERVICES
├── Health Screenings
│   ├── Male Health Screening
│   ├── Women's Health Screening
│   ├── 60+ Health Screening
│   ├── Cancer Screening
│   ├── Targeted Cancer Screening
│   └── Fertility Health Screening
├── Specialist Clinics
│   ├── Menopause Specialist
│   ├── Weight Clinic
│   ├── Tired All The Time
│   └── Liver Health Package
├── Performance & Optimization
│   ├── Sports Performance
│   ├── Brain & Cognitive Health
│   └── Sexual Health Screening
└── Membership
    └── Monthly Membership
```

### Problem: "The Cocoon Story" has 7 pages but scattered content
**Solution: Consolidate into 4 logical groups**

```
THE COCOON STORY
├── About Us
│   ├── Our Story (overview)
│   ├── The Cocoon Difference
│   └── Founder's Letter
├── The Team
│   └── Meet Your Care Team
├── Locations
│   └── Our Spaces
└── Join Us
    ├── Careers
    └── Press & Media
```

### Problem: Knowledge Hub has nested structure
**Solution: Flatten to main sections only (content lives within pages)**

```
KNOWLEDGE HUB
├── Wellness Library
├── Member Stories
├── Guides & Resources
└── FAQ
```

### Problem: Missing utility navigation
**Solution: Add top utility bar**

```
[LOGO]                    [Member Login] [Contact] [Search] [Begin Your Journey]
```

---

## Final Navigation Structure

### Primary Nav (5 items)
1. **Wellness Services** → 4-column mega dropdown
2. **My Cocoon** → Single link
3. **Knowledge Hub** → 4-item dropdown
4. **The Cocoon Story** → 4-item dropdown
5. **Membership** → 4-item dropdown (3 tiers + overview)

### Utility Nav (Top right)
- Member Login → /my-cocoon
- Contact → /contact
- Search → /site-map
- **Begin Your Journey** (CTA button) → /membership

### Mobile
- Hamburger menu with accordion sections
- CTA button always visible
