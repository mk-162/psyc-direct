# LMO Content Engine

A modern, scalable platform for automated Q&A content generation optimized for generative AI visibility. Built with Next.js 14 App Router, shadcn/ui, Firebase, and Stripe.

## Overview

The LMO Content Engine transforms any website into a comprehensive knowledge base of SEO-optimized Q&A content through AI-powered research, generation, and review workflows.

### Key Features

- **Automated Website Research**: AI-powered analysis using Perplexity API to discover relevant content topics
- **Interactive Category Tree**: Hierarchical content organization with expandable categories and subcategories
- **Question Generation**: Automatic generation of 10-20 relevant questions per topic
- **Dual-Length Drafts**: Both short (80-word) and long (250+ word) answer formats
- **Fact-Checking**: Automated verification using OpenAI with confidence scoring
- **Review Workflow**: Rich text editor with keyboard shortcuts for efficient content review
- **Subscription Billing**: Stripe integration with usage-based billing

## Technology Stack

### Frontend
- Next.js 14.2+ (App Router, React Server Components)
- shadcn/ui (Radix UI primitives)
- TypeScript 5.3+
- Tailwind CSS 3.4+
- Zustand (State management)
- React Query (Server state)
- Framer Motion (Animations)

### Backend & Database
- Firebase Auth (Google & Email authentication)
- Firestore (Primary database)
- Firebase Functions (Serverless functions)

### AI Services
- Perplexity API (`sonar-pro`) - Research & topic discovery
- OpenAI GPT-4 Turbo - Content generation & fact-checking

### Payments
- Stripe Firebase Extension - Subscription management

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Firebase account
- OpenAI API key
- Perplexity API key
- Stripe account (for payments)

### Installation

1. **Clone and Install Dependencies**

```bash
cd lmo-content-engine
npm install
```

2. **Configure Environment Variables**

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Required environment variables:

```env
# Firebase (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Download from Firebase Console > Project Settings > Service Accounts)
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# AI Services
PERPLEXITY_API_KEY=pplx-xxxxx
OPENAI_API_KEY=sk-xxxxx

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
```

3. **Set Up Firebase**

   a. Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)

   b. Enable Authentication:
      - Go to Authentication > Sign-in method
      - Enable "Email/Password" and "Google" providers

   c. Create Firestore Database:
      - Go to Firestore Database > Create database
      - Start in production mode

   d. Deploy Firestore rules and indexes:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init  # Select Firestore
   firebase deploy --only firestore
   ```

4. **Install Stripe Firebase Extension**

```bash
firebase ext:install stripe/firestore-stripe-payments
```

Follow the prompts to configure with your Stripe API keys.

5. **Run Development Server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Core Collections

- **projects**: Website projects being analyzed
- **categories**: Top-level content categories
- **subcategories**: Second-level content organization
- **questions**: Generated Q&A pairs
- **drafts**: Content drafts (short & long)
- **fact_checks**: Automated fact-checking results
- **jobs**: Background job queue
- **customers**: User subscription data (Stripe synced)
- **products**: Stripe product/pricing data

See `lib/firebase/schema.ts` for complete TypeScript interfaces.

## Development Status

### ✅ Completed

- [x] Next.js 14 project setup with TypeScript & Tailwind
- [x] Firebase configuration (client & admin SDKs)
- [x] Firestore security rules and indexes
- [x] Database schema with TypeScript interfaces
- [x] shadcn/ui component system setup
- [x] Base UI components (Button, Card, Input, Badge)
- [x] Authentication functions (email, Google)
- [x] Firestore query helpers

### 🚧 In Progress

The following features are scaffolded but require implementation:

- [ ] Authentication UI (login/register pages)
- [ ] Project creation workflow
- [ ] Category discovery system
- [ ] Interactive category tree UI
- [ ] Question generation
- [ ] Draft generation (GPT-4)
- [ ] Fact-checking system
- [ ] Review dashboard
- [ ] Rich text editor
- [ ] Keyboard shortcuts
- [ ] Stripe pricing page
- [ ] Usage tracking
- [ ] Error monitoring (Sentry)
- [ ] Performance optimization
- [ ] Testing (Vitest + Playwright)

## Project Roadmap

See `/tasks/tasks-lmo-content-engine.md` for the complete implementation task list (230+ tasks).

### Phase 1: Foundation (Weeks 1-2) ✅
- Project initialization
- Firebase setup
- Database schema
- Basic UI components

### Phase 2: Core Features (Weeks 3-4)
- Project creation
- Category discovery
- Question generation
- Tree UI

### Phase 3: Review System (Weeks 5-6)
- Draft generation
- Fact-checking
- Review dashboard
- Rich text editor

### Phase 4: Polish & Launch (Weeks 7-8)
- Pricing/billing
- Testing
- Performance optimization
- Deployment

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│              Next.js 14 Frontend                │
│         (shadcn/ui + TailwindCSS)              │
└────────────┬────────────────────────────────────┘
             │
             ├──────────────┬──────────────┬───────────────┐
             │              │              │               │
    ┌────────▼──────┐  ┌───▼────────┐  ┌──▼──────────┐ ┌─▼─────────┐
    │   Firebase    │  │  Vercel    │  │  Perplexity │ │  OpenAI   │
    │     Auth      │  │   Edge     │  │     API     │ │    API    │
    └────────┬──────┘  │ Functions  │  └─────────────┘ └───────────┘
             │         └────────────┘
             │
    ┌────────▼──────────────────────────────────────┐
    │              Firestore Database                │
    └───────────────────────┬───────────────────────┘
                            │
                   ┌────────▼────────┐
                   │ Stripe Firebase │
                   │   Extension     │
                   └─────────────────┘
```

## Contributing

This project follows the implementation plan in `/tasks/tasks-lmo-content-engine.md`. Each task should be completed sequentially and marked off upon completion.

## License

Proprietary - All Rights Reserved

## Support

For questions or issues, please refer to the task list and implementation blueprint in the `tasks/` directory.
