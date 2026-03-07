# Psychology Direct - Landing Page

## Overview
A professional landing page for Psychology Direct, a UK-based provider of expert witness psychologists and psychiatrists for solicitors and insurers.

## Architecture
- **Frontend**: React + TypeScript with Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js (minimal - static content only)
- **Routing**: wouter

## Design System
Based on the brand style guide:
- **Color Palette**: Dark Blue (#032552), Dark Azure (#00588e), Vivid Azure (#066aab), Azure (#2eabe0), Light Azure (#cee4f7), Light Blue (#f0f5ff)
- **Typography**: Libre Baskerville (serif, headings), Montserrat (sans-serif, body)
- **Tone**: Authoritative but approachable, clear and transparent

## Page Structure
Single landing page with sections:
1. Header with navigation and phone CTA
2. Hero section (dark blue background)
3. Trust bar with key stats
4. Introduction section
5. Services grid (6 cards)
6. "Need a Psychiatrist?" CTA banner
7. Contact form
8. Process steps (3-step)
9. Testimonial
10. Resource centre articles
11. Case studies
12. FAQ accordion
13. Bottom CTA
14. Footer with links and contact info

## Key Files
- `client/src/pages/home.tsx` - Main landing page component
- `client/src/App.tsx` - App router
- `client/src/index.css` - Theme variables (brand colors)
- `client/public/images/logo.png` - Psychology Direct logo

## Running
`npm run dev` starts Express + Vite on port 5000
