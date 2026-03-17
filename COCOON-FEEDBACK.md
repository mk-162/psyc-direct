# Cocoon Feedback Tasks

## Files to Edit
- `src/app/globals.css` — main stylesheet
- `src/components/Header.tsx` — nav component
- `src/components/blocks/Hero.tsx` — hero block
- `src/components/blocks/SignatureFooter.tsx` — italic parsing reference
- `src/components/blocks/SectionIntro.tsx` — needs italic parsing
- `src/components/blocks/PersonaCards.tsx` — layout rules
- `src/components/blocks/CardsPortrait.tsx` — layout rules (max 3 wide)
- `src/components/blocks/Testimonial.tsx` — remove italics
- `src/components/blocks/FullWidthImage.tsx` — height prop broken
- `src/components/blocks/EditorialGrid.tsx` — spacing adjustment
- `src/components/blocks/DarkCta.tsx` — button height
- `src/components/blocks/ProductStats.tsx` — button height
- `src/components/blocks/IntroGallery.tsx` — DELETE this file

## Brand Palette (confirmed)
- Deep Olive: #4B563B (dark sections, nav, footer)
- Off-White: #F4F3EF (main background + alternate section bg)
- Warm Stone: #C6BEB4 (accents, borders, subtle elements)
- Sage Mist: #B7B9AE (accents, borders — NOT section backgrounds anymore)
- Terracotta: #7A3E2D (CTAs, links, highlights)

---

## Task 1: Sage section backgrounds → Off-White
In `globals.css`, change `section-sage` background from `#B7B9AE` to `#F4F3EF`.
Change `section-sage-light` similarly. The sage colour stays in the palette for accents/borders but NOT as section backgrounds.

## Task 2: Nav — logo +50%, text +20%, "Enquire" → "Book Now"
In `Header.tsx`:
- Change logo Image width from 180 to 270 (50% bigger)
- Change `ENQUIRE` text to `BOOK NOW`

In `globals.css`:
- `.nav-menu-btn` and `.nav-cta` font-size from 13px to 16px
- Mobile versions: scale proportionally (10px → 12px)

## Task 3: Italic text support across all heading blocks
The SignatureFooter already has italic parsing: `headline.split('*').map(...)` wrapping odd segments in `<span className="italic">`.

Apply the SAME pattern to these components' heading fields:
- `Hero.tsx` — `data.headline`
- `SectionIntro.tsx` — `data.heading`
- `EditorialGrid.tsx` — `data.headline`
- `PersonaCards.tsx` — `data.heading`
- `CardsPortrait.tsx` — `data.heading`
- `DarkCta.tsx` — `data.heading`
- `ProductStats.tsx` — `data.heading`
- `Testimonial.tsx` — NOT here (separate task removes italics)

Create a shared helper function in a utils file if needed, or just inline the same split pattern. The italic class is already defined: `.italic { font-style: italic; font-family: var(--font-display); }`

Also add to globals.css if not present:
```css
.italic {
  font-style: italic;
  font-family: var(--font-display);
}
```

## Task 4: Hero button theming — button bg matches headline text colour
The hero has theme variants. The PRIMARY button background should match the headline text colour for each theme:
- **dark theme**: headline is cream (#F4F3EF), button bg already cream ✓
- **light theme**: headline is dark olive (#4B563B), button bg should be #4B563B with cream text
- **sage theme**: headline is dark olive (#4B563B), button bg should be #4B563B with cream text  
- **warm-sand theme**: headline is dark olive (#4B563B), button bg should be #4B563B with cream text

This should be the DEFAULT state, not hover.

Also fix the secondary button border — ensure all sides are equal width (1px solid).

In CSS, for `.hero-actions .btn-secondary`, ensure `border: 1px solid` is applied uniformly (currently border-bottom may be styled differently).

## Task 5: Check all colours against brand palette
Audit globals.css and ensure all colour variables use ONLY the 5 brand colours:
- #4B563B, #F4F3EF, #C6BEB4, #B7B9AE, #7A3E2D
Plus black/white/transparency variations of these.
Flag and fix any colours that don't match (e.g. #3A4530 should probably be #4B563B).

## Task 6: Remove Intro Gallery
- Delete `src/components/blocks/IntroGallery.tsx`
- Remove all `.intro-gallery-*` CSS from `globals.css`
- Remove IntroGallery from any block registry/renderer (check `EditorialPageClient.tsx` or `PremiumPageRenderer.tsx`)

## Task 7: Editorial Grid spacing — match Rosewood
Looking at Rosewood reference: images are taller (portrait, roughly 4:5 aspect), gaps between columns are tighter, text sits close under images.

In `globals.css`:
- `.editorial-card-image` padding-bottom: change from 125% to 133% (4:5 → closer to 3:4, taller)
- `.editorial-grid` gap: reduce from `var(--space-8)` to `var(--space-6)` (tighter)
- `.editorial-card-image` margin-bottom: reduce from `var(--space-6)` to `var(--space-4)`

## Task 8: Stats section button height
The `ds-btn` inside ProductStats seems shorter. Ensure it uses standard button padding:
`padding: 0.875rem 2rem` (same as `.ds-btn` base). Check if anything overrides it.

## Task 9: Persona Cards heading font-weight
In `globals.css`, `.persona-card-title` has `font-weight: 700` (from the old product-stat section).
Change to `font-weight: 400` to match site heading convention. 

Also: `.product-stat-value` font-weight 700 → 400.

## Task 10: Persona Cards layout rules based on count
In `PersonaCards.tsx`, dynamically set grid columns based on card count:
- 2 cards: `grid-template-columns: repeat(2, 1fr)`
- 3 cards: `grid-template-columns: repeat(3, 1fr)` (current default)
- 4 cards: `grid-template-columns: repeat(2, 1fr)`
- 5 cards: special — top row 3, bottom row 2 centered
- 6 cards: `grid-template-columns: repeat(3, 1fr)`

For 5 cards, use a flex-based approach or grid with justify-content center on the wrapper.

Apply inline style or a dynamic class.

## Task 11: Same layout rules for CardsPortrait (Feature Grid)
Apply the same count-based layout logic from Task 10 to `CardsPortrait.tsx`.
Also enforce max 3 columns wide (never 4+).

## Task 12: Testimonial — remove italics
In `globals.css`, `.testimonial-blockquote` currently has `font-style: italic`.
Change to `font-style: normal`.

Also in `Testimonial.tsx` if there's inline italic styling.

## Task 13: FullWidthImage height prop
The `height` prop in `FullWidthImageData` isn't being applied. In `FullWidthImage.tsx`:
```tsx
<img
  src={data.image}
  alt={data.alt || ''}
  className="image-band-img"
  style={data.height ? { height: data.height, objectFit: 'cover' } : undefined}
/>
```
Also check the TinaCMS schema for this block — the height field type might need to be a string like "50vh" or "400px". Check `tina/config.ts` or similar.

## Task 14: CTA button height
In `DarkCta.tsx`, the buttons use `ds-btn ds-btn-primary`. Ensure padding matches standard: `0.875rem 2rem`.

## Task 15: Remove ALL hover states on buttons
In `globals.css`, remove or neutralise ALL button hover effects:
- `.btn-primary:hover` — remove background/color change
- `.btn-secondary:hover` — remove background/color change  
- `.btn-tertiary:hover` — remove color change
- `.ds-btn-primary:hover` — remove
- `.ds-btn-secondary:hover` — remove
- `.signature-btn-primary:hover` — remove
- `.signature-btn-secondary:hover` — remove
- `.hero-actions .btn-primary:hover` — remove
- `.hero-actions .btn-secondary:hover` — remove
- `.section-deep-green .btn-primary:hover` — remove
- `.section-deep-green .btn-secondary:hover` — remove
- `.product-cta:hover` — remove
- `.widget-cta .btn-primary:hover` — remove
- `.btn-white:hover` — remove
- `.finder-start-btn:hover` — remove
- `.footer-cta-btn:hover` — remove
- `.form-submit:hover` — remove
- `.btn-cream:hover`, `.btn-ghost:hover` — if they exist, remove

Make hover states identical to default states (solid colours, no transitions on background/color for buttons).
Keep cursor:pointer.
