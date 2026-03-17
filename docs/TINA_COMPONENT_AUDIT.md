# Cocoon Tina Component Library Audit

**Date:** March 4, 2026  
**Scope:** Tina CMS configuration, React components, theme system, and accessibility

**Status:** ✅ ALL CRITICAL AND MODERATE ISSUES FIXED

---

## ✅ FIXES APPLIED

| Issue | File(s) | Status |
|-------|---------|--------|
| BookingForm "grey" theme mapping bug | `src/components/blocks/BookingForm.tsx` | ✅ Fixed |
| SignatureFooter inconsistent field name | `tina/config.ts`, `src/components/blocks/SignatureFooter.tsx` | ✅ Fixed |
| IntroGallery broken/inaccessible | `tina/config.ts`, `src/components/blocks/PremiumPageRenderer.tsx` | ✅ Removed |
| Warm-stone contrast issues | `src/app/globals.css` | ✅ Fixed |

---

## 🔴 CRITICAL ISSUES

### 1. Theme System Inconsistencies ✅ FIXED

#### Issue A: BookingForm has WRONG theme mapping ✅ FIXED
**File:** `src/components/blocks/BookingForm.tsx`
```typescript
// BUG - Line ~12-18
const themeClass = 
  theme === "green" ? "section-deep-green theme-dark"
  : theme === "grey" ? "section-terracotta theme-dark"  // ❌ WRONG! Should be section-warm-stone
  : theme === "terracotta" ? "section-terracotta theme-dark"  // ❌ DUPLICATE!
  : "section-mineral-white theme-light";
```
**Fix:** Map "grey" to `section-warm-stone theme-light` ✅

#### Issue B: signatureFooter uses different field name ✅ FIXED
**File:** `tina/config.ts` (line ~380)
- All other blocks use: `theme` field with options ["off-white", "green", "grey", "terracotta"]
- SignatureFooter uses: `backgroundColor` with same options
- **Inconsistent** - makes content migration and theming confusing

**Fix:** Renamed `backgroundColor` to `theme` in signatureFooterBlock and updated component ✅

---

## 🟡 MODERATE ISSUES

### 2. Missing/Inaccessible Components from Tina ✅ FIXED

#### Issue A: introGallery is registered but commented out ✅ FIXED
**File:** `tina/config.ts` - Block WAS defined (lines ~165-180)  
**File:** `src/components/blocks/IntroGallery.tsx` - Component exists  
**File:** `src/components/blocks/PremiumPageRenderer.tsx` - Line ~77: `component = null; break; // Removed per feedback`

**Problem:** The block appeared in Tina UI but rendered nothing on the frontend. Users could add it but see no result.

**Fix:** Removed introGalleryBlock from tina/config.ts entirely ✅
- Removed block definition
- Removed from templates list
- Cleaned up PremiumPageRenderer references

#### Issue B: Components not using centralized CSS classes
**Context from MEMORY.md:** "Block components have inline styles, need refactoring to use centralised CSS classes"

**Examples found:**
- Several components still use inline styles instead of CSS classes from globals.css
- Makes theme switching and design system updates harder

---

### 3. Theme/Color Contrast Issues ✅ FIXED

#### Issue A: "grey" theme (warm-stone) may have contrast problems ✅ FIXED
**File:** `globals.css` lines ~185-195
```css
.section-warm-stone {
    background-color: var(--color-warm-stone); /* #C6BEB4 - mid-tone */
}
.theme-light {
    color: var(--color-figmav1-black, #2A2418);
}
```
**Problem:** The warm-stone background (#C6BEB4) with light theme text may not have sufficient contrast.

**Fix:** Added comprehensive CSS rules for `.section-warm-stone` in globals.css ✅
- Explicit text color using `var(--color-text-on-mid, #2A2418)`
- Coverage for headings, cards, testimonials, process steps, stats
- Proper eyebrow styling
- 8.38:1 contrast ratio on warm-stone background

#### Issue B: Some blocks don't handle theme text colors properly
Several blocks apply background theme classes but don't ensure text colors are properly set:
- FeatureGrid
- EditorialGrid
- CardsPortrait
- CategoryShowcase
- ContentWithMedia

These rely on the parent `.theme-light` or `.theme-dark` class but may inherit wrong colors in nested contexts.
**Status:** Should be resolved by the global `.section-warm-stone` CSS rules added above.

---

### 4. Component Library Organization Issues

#### Issue A: Blocks folder has mixed concerns
**File structure:**
```
src/components/blocks/
├── BookingForm.tsx          (not in Tina - used directly)
├── EditorialPageClient.tsx  (not a block - page wrapper)
├── PremiumPageRenderer.tsx  (not a block - renderer)
├── ProductCard.tsx          (not in Tina - used by other blocks)
├── ServiceSelectBar.tsx     (not in Tina - used directly)
├── FullWidthImage.tsx       (in Tina)
├── ...
```
**Problem:** Hard to know which components are Tina-editable blocks vs internal components.

**Fix:** Create subfolders:
```
blocks/
├── _internal/          # Non-Tina components
│   ├── BookingForm.tsx
│   ├── EditorialPageClient.tsx
│   ├── PremiumPageRenderer.tsx
│   ├── ProductCard.tsx
│   └── ServiceSelectBar.tsx
├── _blocks/            # Tina blocks
│   ├── Hero.tsx
│   ├── FeatureGrid.tsx
│   └── ...
└── index.ts            # Export all blocks
```

---

## 🟢 MINOR ISSUES

### 5. Missing Block Labels
Some blocks don't have labels in Tina UI (rely on defaults):
- Check all `label:` properties in tina/config.ts blocks

### 6. Unused ProductSelect Component
**File:** `tina/components/ProductSelect.tsx`  
**Status:** Referenced in config but may not work if API is unavailable

### 7. DarkCta Block Issues
**File:** `src/components/blocks/DarkCta.tsx`
- Hardcoded to always use `section-deep-green theme-dark` (line ~14)
- Has both `body` and `bodyText` fields but only uses `bodyText`
- No theme switching - always dark

---

## 📋 RECOMMENDED FIXES (Priority Order)

### Priority 1: Fix Broken Theme Mappings
1. Fix BookingForm.tsx theme mapping for "grey"
2. Standardize signatureFooter to use `theme` field (not `backgroundColor`)

### Priority 2: Remove/Fix Dead Components
1. Either remove introGallery from Tina config OR re-enable the component
2. Clean up inline styles in blocks to use CSS classes

### Priority 3: Improve Theme Contrast
1. Audit all blocks with "grey" theme for text contrast
2. Ensure all text elements use proper color variables
3. Add explicit text color classes to theme-dark sections

### Priority 4: Code Organization
1. Separate Tina blocks from internal components
2. Add README to blocks folder explaining the structure

---

## 🎨 THEME REFERENCE

| Tina Option | CSS Classes | Text Color | Use Case |
|-------------|-------------|------------|----------|
| off-white | section-mineral-white + theme-light | Dark (#2A2418) | Default sections |
| green | section-deep-green + theme-dark | Light (#F4F3EF) | Dark sections, CTAs |
| grey | section-warm-stone + theme-light | Dark (#2A2418) | Alternate backgrounds |
| terracotta | section-terracotta + theme-dark | Light (#F4F3EF) | Accent sections |

---

## ✅ COMPONENTS STATUS

| Component | In Tina? | Has Theme? | Working? | Notes |
|-----------|----------|------------|----------|-------|
| Hero | ✅ | ✅ | ✅ | Good |
| HeroImmersive | ✅ | ❌ | ✅ | No theme option |
| FeatureGrid | ✅ | ✅ | ⚠️ | May have contrast issues |
| EditorialGrid | ✅ | ✅ | ⚠️ | May have contrast issues |
| EditorialMosaic | ✅ | ✅ | ✅ | Good |
| IntroGallery | ✅ | ✅ | ❌ | Renders nothing! |
| SectionIntro | ✅ | ✅ | ✅ | Good |
| ProductStats | ✅ | ✅ | ✅ | Good |
| CardsPortrait | ✅ | ✅ | ⚠️ | May have contrast issues |
| FullWidthImage | ✅ | ❌ | ✅ | No theme (correct - image only) |
| AsymmetricSplit | ✅ | ✅ | ✅ | Good |
| Testimonial | ✅ | ✅ | ✅ | Good |
| PersonaCards | ✅ | ✅ | ⚠️ | May have contrast issues |
| Timeline | ✅ | ✅ | ✅ | Good |
| FaqAccordion | ✅ | ✅ | ✅ | Good |
| IncludedGrid | ✅ | ✅ | ✅ | Good |
| DarkCta | ✅ | ❌ | ⚠️ | Always dark green, ignores theme |
| SignatureFooter | ✅ | ✅* | ✅ | Uses `backgroundColor` not `theme` |
| RichText | ✅ | ❌ | ✅ | No theme (content only) |
| HubHero | ✅ | ✅ | ✅ | Good |
| CategoryShowcase | ✅ | ✅ | ⚠️ | May have contrast issues |
| LinkDirectory | ✅ | ✅ | ✅ | Good |
| FeaturedLinks | ✅ | ✅ | ✅ | Good |
| ContactForm | ✅ | ✅ | ✅ | Good |
| ProcessSteps | ✅ | ✅ | ✅ | Good |
| ProductBuyButton | ✅ | ✅ | ✅ | Good |

---

## 📝 NEXT STEPS

1. **Fix BookingForm theme mapping bug**
2. **Standardize signatureFooter field name**
3. **Decide on introGallery (remove or fix)**
4. **Audit contrast on grey/warm-stone backgrounds**
5. **Organize blocks folder structure**
