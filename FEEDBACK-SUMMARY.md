# Cocoon Design Feedback — Changes Summary

All items from the feedback list have been implemented. Here's what's been done:

---

## Brand Colours
- Main background now uses the off-white (#F4F3EF) throughout
- The sage (#B7B9AE) has been removed as a section background colour — it's still available for accents/borders but sections now read as off-white broken up by the deep green and imagery
- All colours checked against the brand palette (#4B563B, #F4F3EF, #C6BEB4, #B7B9AE, #7A3E2D)

## Navigation
- Logo size increased by ~50%
- Menu and Book Now text increased by ~20%
- "Enquire" changed to "Book Now"

## Italic Text in Headings
- You can now make any word italic in headings by wrapping it in asterisks: `*Soul*`
- Works across all block types: Hero, Section Intro, Editorial Grid, Persona Cards, Portrait Cards, Dark CTA, Product Stats, and Signature Footer
- Fully editable in TinaCMS — just type asterisks around the words you want italic

## Hero Buttons & Theme Colours
- Primary button background now matches the headline text colour (e.g. green text = green button)
- This is the default state, not just on hover
- Secondary button border fixed — uniform thickness on all sides

## Intro Gallery
- Removed entirely — Editorial Grid covers the same use case

## Editorial Grid
- Image spacing tightened to match the Rosewood reference
- Images are taller (portrait orientation), gaps between columns are narrower, text sits closer to the images

## Stats Section
- Button height adjusted to match standard button sizing across the site

## Persona Cards
- Section heading font weight reduced from bold to 400 (consistent with the rest of the site)
- Layout now adapts based on how many cards there are:
  - 2 cards → 2 columns
  - 3 cards → 1 row of 3
  - 4 cards → 2 rows of 2
  - 5 cards → top row of 3, bottom row of 2
  - 6 cards → 2 rows of 3

## Testimonial
- Italics removed from quote text

## Full Width Image
- Height control now works — you can set values like "50vh" or "400px" in TinaCMS

## Feature Grid (Portrait Cards)
- Maximum 3 columns wide
- Same adaptive layout rules as Persona Cards (2/3/4/5/6 logic)

## CTA Block
- Button height adjusted to match standard sizing

## Hover States
- All button hover effects removed across the entire site
- Buttons now show solid background colours at all times — no colour changes on hover
