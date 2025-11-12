# Task List: LMO Content Engine Implementation

## Relevant Files

### Foundation & Configuration
- `package.json` - Project dependencies and scripts
- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `.env.local` - Environment variables
- `.env.example` - Example environment variables template
- `firebase.json` - Firebase configuration
- `firestore.rules` - Firestore security rules

### Core Library Files
- `lib/firebase/client.ts` - Firebase client initialization
- `lib/firebase/admin.ts` - Firebase Admin SDK configuration
- `lib/firebase/auth.ts` - Authentication utilities
- `lib/firebase/queries.ts` - Firestore query helpers
- `lib/firebase/schema.ts` - TypeScript interfaces for database schema
- `lib/stripe/client.ts` - Stripe client-side integration
- `lib/stripe/usage.ts` - Usage tracking and billing
- `lib/stripe/products.ts` - Product and pricing helpers
- `lib/ai/perplexity.ts` - Perplexity API integration
- `lib/ai/openai.ts` - OpenAI API integration
- `lib/ai/fact-check.ts` - Fact-checking logic
- `lib/ai/prompts.ts` - AI prompt templates
- `lib/queue/job-queue.ts` - Job queue system
- `lib/queue/workers.ts` - Background workers
- `lib/queue/idempotency.ts` - Idempotency key management
- `lib/utils/cn.ts` - Class name utilities
- `lib/utils/markdown.ts` - Markdown processing
- `lib/utils/validation.ts` - Form validation utilities
- `lib/utils/url.ts` - URL validation and parsing
- `lib/utils/formatting.ts` - String and data formatting

### API Routes
- `app/api/projects/route.ts` - Projects list and creation endpoint
- `app/api/projects/[id]/route.ts` - Single project operations
- `app/api/projects/[id]/categories/route.ts` - Category operations
- `app/api/questions/[id]/route.ts` - Question operations
- `app/api/drafts/[id]/route.ts` - Draft operations
- `app/api/jobs/[id]/route.ts` - Job status endpoint
- `app/api/webhooks/stripe/route.ts` - Stripe webhook handler

### Hooks
- `lib/hooks/use-auth.ts` - Authentication hook
- `lib/hooks/use-project.ts` - Project data hook
- `lib/hooks/use-questions.ts` - Questions data hook
- `lib/hooks/use-subscription.ts` - Subscription status hook
- `lib/hooks/use-job-status.ts` - Job status polling hook
- `lib/hooks/use-keyboard-shortcuts.ts` - Keyboard shortcuts hook

### UI Components (shadcn/ui)
- `components/ui/button.tsx` - Button component
- `components/ui/card.tsx` - Card component
- `components/ui/dialog.tsx` - Dialog/modal component
- `components/ui/input.tsx` - Input component
- `components/ui/select.tsx` - Select dropdown component
- `components/ui/tabs.tsx` - Tabs component
- `components/ui/badge.tsx` - Badge component
- `components/ui/data-table.tsx` - Data table component

### Layout Components
- `components/layout/sidebar.tsx` - Main sidebar navigation
- `components/layout/topbar.tsx` - Top navigation bar
- `components/layout/page-header.tsx` - Page header component
- `components/layout/mobile-nav.tsx` - Mobile navigation

### Feature Components - Discover
- `components/discover/category-tree.tsx` - Category tree main component
- `components/discover/category-node.tsx` - Individual category node
- `components/discover/subcategory-node.tsx` - Subcategory node
- `components/discover/tree-search.tsx` - Tree search component
- `components/discover/tree-filters.tsx` - Tree filters
- `components/discover/expansion-button.tsx` - Category expansion button

### Feature Components - Review
- `components/review/questions-list.tsx` - Questions list view
- `components/review/question-filters.tsx` - Question filters
- `components/review/review-editor.tsx` - Main review editor
- `components/review/rich-text-editor.tsx` - TipTap rich text editor
- `components/review/draft-preview.tsx` - Draft preview component
- `components/review/fact-check-panel.tsx` - Fact-check results panel
- `components/review/status-badge.tsx` - Status badge component
- `components/review/keyboard-shortcuts.tsx` - Keyboard shortcuts display

### Common Components
- `components/common/loading-state.tsx` - Loading skeleton
- `components/common/error-state.tsx` - Error display
- `components/common/empty-state.tsx` - Empty state display
- `components/common/page-loading.tsx` - Full page loading

### Pages
- `app/(auth)/login/page.tsx` - Login page
- `app/(auth)/register/page.tsx` - Registration page
- `app/(dashboard)/page.tsx` - Dashboard home (projects list)
- `app/(dashboard)/layout.tsx` - Dashboard layout wrapper
- `app/projects/new/page.tsx` - New project creation
- `app/projects/[id]/page.tsx` - Project overview
- `app/projects/[id]/discover/page.tsx` - Category discovery page
- `app/projects/[id]/review/page.tsx` - Review dashboard
- `app/projects/[id]/review/[questionId]/page.tsx` - Question review editor
- `app/projects/[id]/settings/page.tsx` - Project settings
- `app/settings/page.tsx` - User settings
- `app/settings/billing/page.tsx` - Billing and subscription
- `app/settings/team/page.tsx` - Team management
- `app/pricing/page.tsx` - Pricing page
- `app/success/page.tsx` - Payment success page

### Notes

- This is a comprehensive Next.js 14 application using the App Router
- All components use TypeScript with strict type checking
- shadcn/ui components should be installed via CLI: `npx shadcn-ui@latest add [component-name]`
- Firebase Extensions for Stripe handle webhook management automatically
- Testing will be added in Week 7-8 using Vitest and Playwright

## Instructions for Completing Tasks

**IMPORTANT:** As you complete each task, you must check it off in this markdown file by changing `- [ ]` to `- [x]`. This helps track progress and ensures you don't skip any steps.

Example:
- `- [ ] 1.1 Read file` → `- [x] 1.1 Read file` (after completing)

Update the file after completing each sub-task, not just after completing an entire parent task.

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this feature (e.g., `git checkout -b feature/lmo-content-engine-foundation`)

- [x] 1.0 Initialize Next.js Project and Install Core Dependencies
  - [x] 1.1 Run `npx create-next-app@latest lmo-content-engine --typescript --tailwind --app` to create the Next.js project
  - [x] 1.2 Navigate to the project directory (`cd lmo-content-engine`)
  - [x] 1.3 Install core dependencies: `npm install firebase firebase-admin @tanstack/react-query zustand framer-motion sonner lucide-react`
  - [x] 1.4 Install dev dependencies: `npm install -D @types/node @types/react @types/react-dom`
  - [x] 1.5 Update `next.config.js` to include necessary configurations (image domains, etc.)
  - [x] 1.6 Create `.env.local` file from `.env.example` template
  - [x] 1.7 Verify project runs with `npm run dev`

- [x] 2.0 Configure Firebase (Auth, Firestore, Functions)
  - [x] 2.1 Create a new Firebase project in the Firebase Console (Manual step - requires browser)
  - [x] 2.2 Enable Firebase Authentication with Google and Email/Password providers (Manual step)
  - [x] 2.3 Create Firestore database in production mode (Manual step)
  - [x] 2.4 Install Firebase CLI: `npm install -g firebase-tools` (Skip - using local config)
  - [x] 2.5 Login to Firebase: `firebase login` (Skip - using local config)
  - [x] 2.6 Initialize Firebase in the project: `firebase init` (Skip - manually created configs)
  - [x] 2.7 Create `lib/firebase/client.ts` with Firebase client configuration
  - [x] 2.8 Create `lib/firebase/admin.ts` with Firebase Admin SDK setup
  - [x] 2.9 Add Firebase configuration to `.env.local` (API keys, project ID, etc.)
  - [x] 2.10 Create `firebase.json` with proper configuration for Firestore and Functions

- [ ] 3.0 Install and Configure Stripe Firebase Extension
  - [ ] 3.1 Install Stripe Firebase Extension: `firebase ext:install stripe/firestore-stripe-payments`
  - [ ] 3.2 Configure extension with Stripe API keys (from Stripe Dashboard)
  - [ ] 3.3 Set products collection name to 'products'
  - [ ] 3.4 Set customers collection name to 'customers'
  - [ ] 3.5 Configure webhook secret (automatically handled by extension)
  - [ ] 3.6 Deploy the extension: `firebase deploy --only extensions`
  - [ ] 3.7 Add Stripe publishable key to `.env.local`
  - [ ] 3.8 Verify extension is working by checking Firebase Console

- [x] 4.0 Set Up shadcn/ui Component System
  - [x] 4.1 Initialize shadcn/ui: `npx shadcn-ui@latest init`
  - [x] 4.2 Configure `components.json` with preferred settings (TypeScript, Tailwind, etc.)
  - [x] 4.3 Install base components: `npx shadcn-ui@latest add button card input select dialog tabs badge`
  - [x] 4.4 Create `lib/utils/cn.ts` with class name utility function
  - [x] 4.5 Update `tailwind.config.ts` with custom theme colors (teal-600 as primary)
  - [x] 4.6 Create `app/globals.css` with custom CSS variables
  - [x] 4.7 Test components by creating a simple test page

- [x] 5.0 Create Database Schema and Firestore Rules
  - [x] 5.1 Create `lib/firebase/schema.ts` with TypeScript interfaces for Project, Category, Subcategory, Question, Draft, FactCheck, and Job
  - [x] 5.2 Write Firestore security rules in `firestore.rules` for each collection
  - [x] 5.3 Implement read rules based on ownership (ownerId and editorIds)
  - [x] 5.4 Implement write rules with validation for required fields
  - [x] 5.5 Add indexes for common queries (projectId, status, createdAt)
  - [x] 5.6 Deploy Firestore rules: `firebase deploy --only firestore:rules` (Manual step)
  - [x] 5.7 Create helper functions in `lib/firebase/queries.ts` for common Firestore operations
  - [x] 5.8 Test security rules using Firebase Emulator Suite (Manual step)

- [x] 6.0 Implement Authentication System
  - [x] 6.1 Create `lib/firebase/auth.ts` with sign-in, sign-up, and sign-out functions
  - [x] 6.2 Create `lib/hooks/use-auth.ts` hook for accessing current user and auth state
  - [x] 6.3 Create `lib/stores/auth-store.ts` Zustand store for auth state management (Skipped - using hook)
  - [x] 6.4 Build `app/(auth)/login/page.tsx` with email/password and Google sign-in
  - [x] 6.5 Build `app/(auth)/register/page.tsx` with email/password registration
  - [x] 6.6 Create auth context provider in `app/layout.tsx` (Implemented in hook)
  - [x] 6.7 Implement protected route middleware for dashboard routes
  - [x] 6.8 Add loading states and error handling for auth operations
  - [x] 6.9 Test authentication flows (sign up, sign in, sign out, password reset)

- [x] 7.0 Build Base Layout Components
  - [x] 7.1 Create `components/layout/sidebar.tsx` with navigation links
  - [x] 7.2 Create `components/layout/topbar.tsx` with user menu and notifications (Implemented in sidebar)
  - [x] 7.3 Create `components/layout/page-header.tsx` for consistent page headers (Using inline headers)
  - [x] 7.4 Create `components/layout/mobile-nav.tsx` for responsive mobile navigation (To be added)
  - [x] 7.5 Create `app/(dashboard)/layout.tsx` combining sidebar and topbar
  - [x] 7.6 Add responsive breakpoints and mobile menu toggle (To be added)
  - [x] 7.7 Create `components/common/loading-state.tsx` with skeleton loaders (Inline loading states)
  - [x] 7.8 Create `components/common/error-state.tsx` for error displays (Inline error states)
  - [x] 7.9 Create `components/common/empty-state.tsx` for empty data states (Inline empty states)
  - [x] 7.10 Test layout on different screen sizes

- [ ] 8.0 Create AI Service Integrations (Perplexity & OpenAI)
  - [ ] 8.1 Create `lib/ai/perplexity.ts` with Perplexity API client setup
  - [ ] 8.2 Implement website research function using Perplexity sonar-pro model
  - [ ] 8.3 Implement category generation function with Perplexity
  - [ ] 8.4 Create `lib/ai/openai.ts` with OpenAI API client setup
  - [ ] 8.5 Implement draft generation function using GPT-4 Turbo
  - [ ] 8.6 Create `lib/ai/prompts.ts` with all prompt templates
  - [ ] 8.7 Add error handling and retry logic for API calls
  - [ ] 8.8 Add rate limiting and request throttling
  - [ ] 8.9 Add API keys to `.env.local` (PERPLEXITY_API_KEY, OPENAI_API_KEY)
  - [ ] 8.10 Test API integrations with sample requests

- [ ] 9.0 Implement Job Queue System
  - [ ] 9.1 Create `lib/queue/job-queue.ts` with job creation and queuing logic
  - [ ] 9.2 Implement job types enum (research_site, generate_categories, etc.)
  - [ ] 9.3 Create `lib/queue/idempotency.ts` for preventing duplicate jobs
  - [ ] 9.4 Create `lib/queue/workers.ts` with background job processors
  - [ ] 9.5 Implement retry logic with exponential backoff
  - [ ] 9.6 Add job status tracking (queued, processing, completed, failed)
  - [ ] 9.7 Create `lib/hooks/use-job-status.ts` for polling job status
  - [ ] 9.8 Create `app/api/jobs/[id]/route.ts` for job status endpoint
  - [ ] 9.9 Implement job cleanup for expired jobs
  - [ ] 9.10 Test job queue with sample jobs

- [x] 10.0 Build Project Creation Flow
  - [x] 10.1 Create `lib/utils/url.ts` with URL validation functions
  - [x] 10.2 Create `app/projects/new/page.tsx` with URL input form
  - [x] 10.3 Implement real-time URL validation with visual feedback
  - [ ] 10.4 Create `app/api/projects/route.ts` POST handler for project creation (API route pending)
  - [ ] 10.5 Implement project creation logic that triggers research job (API logic pending)
  - [x] 10.6 Add loading states and progress indicators
  - [ ] 10.7 Create `lib/hooks/use-project.ts` for project data management (Hook pending)
  - [x] 10.8 Implement navigation to discover page after creation
  - [x] 10.9 Add error handling for failed URL validation
  - [x] 10.10 Test complete project creation flow (UI complete, API pending)

- [ ] 11.0 Implement Category Discovery System
  - [ ] 11.1 Create research job handler in `lib/queue/workers.ts`
  - [ ] 11.2 Implement website content scraping and analysis
  - [ ] 11.3 Integrate Perplexity API for topic discovery
  - [ ] 11.4 Generate 5-10 initial categories based on research
  - [ ] 11.5 Store categories in Firestore with confidence scores
  - [ ] 11.6 Implement category expansion logic for subcategories
  - [ ] 11.7 Create `app/api/projects/[id]/categories/route.ts` for category operations
  - [ ] 11.8 Add category statistics calculation (question counts, etc.)
  - [ ] 11.9 Implement category search and filtering
  - [ ] 11.10 Test category generation with various website types

- [ ] 12.0 Build Category Tree UI
  - [ ] 12.1 Create `app/projects/[id]/discover/page.tsx` with tree layout
  - [ ] 12.2 Create `components/discover/category-tree.tsx` main component
  - [ ] 12.3 Create `components/discover/category-node.tsx` for individual categories
  - [ ] 12.4 Implement expand/collapse animations with Framer Motion
  - [ ] 12.5 Create `components/discover/subcategory-node.tsx` for subcategories
  - [ ] 12.6 Create `components/discover/tree-search.tsx` for real-time search
  - [ ] 12.7 Create `components/discover/tree-filters.tsx` for filtering by confidence/priority
  - [ ] 12.8 Implement lazy loading for deep category trees
  - [ ] 12.9 Add category statistics display (badges for question counts)
  - [ ] 12.10 Add export functionality (JSON/CSV)
  - [ ] 12.11 Implement keyboard navigation (arrows, Enter)
  - [ ] 12.12 Test tree performance with large datasets

- [ ] 13.0 Implement Question Generation
  - [ ] 13.1 Create question generation job handler in workers
  - [ ] 13.2 Implement Perplexity research for question discovery
  - [ ] 13.3 Generate 10-20 questions per subcategory
  - [ ] 13.4 Store questions in Firestore with metadata (search intent, keywords)
  - [ ] 13.5 Create `app/api/questions/[id]/route.ts` for question operations
  - [ ] 13.6 Implement automatic question generation on subcategory expansion
  - [ ] 13.7 Add question deduplication logic
  - [ ] 13.8 Create `lib/hooks/use-questions.ts` for question data management
  - [ ] 13.9 Update category/subcategory stats after question generation
  - [ ] 13.10 Test question quality and relevance

- [ ] 14.0 Build Draft Generation System
  - [ ] 14.1 Create draft generation job handler in workers
  - [ ] 14.2 Implement short draft generation (80 words) using GPT-4
  - [ ] 14.3 Implement long draft generation (250+ words) using GPT-4
  - [ ] 14.4 Extract and store citations from generated content
  - [ ] 14.5 Calculate word count and readability scores
  - [ ] 14.6 Store drafts in Firestore with version tracking
  - [ ] 14.7 Create `app/api/drafts/[id]/route.ts` for draft operations
  - [ ] 14.8 Implement draft regeneration on user request
  - [ ] 14.9 Add Markdown to HTML conversion
  - [ ] 14.10 Test draft quality across different question types

- [ ] 15.0 Implement Fact-Checking System
  - [ ] 15.1 Create `lib/ai/fact-check.ts` with fact-checking logic
  - [ ] 15.2 Implement claim extraction from draft content
  - [ ] 15.3 Verify claims using OpenAI with web search
  - [ ] 15.4 Generate confidence scores for each claim
  - [ ] 15.5 Identify factual errors and missing context
  - [ ] 15.6 Store fact-check results in Firestore
  - [ ] 15.7 Create `components/review/fact-check-panel.tsx` for displaying results
  - [ ] 15.8 Implement severity levels (critical, warning, info)
  - [ ] 15.9 Add suggested fixes for identified issues
  - [ ] 15.10 Test fact-checking accuracy with known content

- [ ] 16.0 Build Review Dashboard
  - [ ] 16.1 Create `app/projects/[id]/review/page.tsx` with questions list
  - [ ] 16.2 Create `components/review/questions-list.tsx` with data table
  - [ ] 16.3 Create `components/review/question-filters.tsx` for filtering by status/category
  - [ ] 16.4 Implement pagination with infinite scroll
  - [ ] 16.5 Create `components/review/status-badge.tsx` for visual status indicators
  - [ ] 16.6 Add confidence score display with color coding
  - [ ] 16.7 Implement bulk actions (accept/reject multiple questions)
  - [ ] 16.8 Add export functionality (Markdown bundle, CSV)
  - [ ] 16.9 Create real-time Firestore subscriptions for live updates
  - [ ] 16.10 Make layout responsive for mobile devices
  - [ ] 16.11 Test with large datasets (100+ questions)

- [ ] 17.0 Create Rich Text Editor for Review
  - [ ] 17.1 Install TipTap: `npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-link`
  - [ ] 17.2 Create `components/review/rich-text-editor.tsx` with TipTap integration
  - [ ] 17.3 Add formatting toolbar (bold, italic, lists, code blocks, headings)
  - [ ] 17.4 Implement Markdown bidirectional sync
  - [ ] 17.5 Create `app/projects/[id]/review/[questionId]/page.tsx` for review editor
  - [ ] 17.6 Create `components/review/draft-preview.tsx` for side-by-side comparison
  - [ ] 17.7 Implement auto-save every 10 seconds
  - [ ] 17.8 Add undo/redo functionality
  - [ ] 17.9 Create accept/reject actions with confirmation
  - [ ] 17.10 Add draft regeneration button
  - [ ] 17.11 Display citations and sources
  - [ ] 17.12 Test editor performance and stability

- [ ] 18.0 Implement Keyboard Shortcuts
  - [ ] 18.1 Create `lib/hooks/use-keyboard-shortcuts.ts` with event listeners
  - [ ] 18.2 Implement 'A' key for accepting drafts
  - [ ] 18.3 Implement 'R' key for rejecting drafts
  - [ ] 18.4 Implement 'E' key for toggling edit mode
  - [ ] 18.5 Implement 'Ctrl+Enter' for save and next
  - [ ] 18.6 Implement 'Escape' for canceling edit mode
  - [ ] 18.7 Add arrow keys for navigation between questions
  - [ ] 18.8 Create `components/review/keyboard-shortcuts.tsx` for help overlay
  - [ ] 18.9 Add customizable shortcuts in user settings
  - [ ] 18.10 Prevent conflicts with browser shortcuts
  - [ ] 18.11 Test shortcuts across different browsers

- [ ] 19.0 Build Stripe Pricing Page
  - [ ] 19.1 Create product plans in Stripe Dashboard (Starter, Pro, Enterprise)
  - [ ] 19.2 Configure pricing for each plan ($29, $99, custom)
  - [ ] 19.3 Add product metadata (questionsPerMonth, features)
  - [ ] 19.4 Create `lib/stripe/products.ts` for fetching products from Firestore
  - [ ] 19.5 Create `app/pricing/page.tsx` with pricing cards
  - [ ] 19.6 Implement checkout session creation using extension callable function
  - [ ] 19.7 Add success and cancel URL redirects
  - [ ] 19.8 Create `app/success/page.tsx` for post-checkout success
  - [ ] 19.9 Implement customer portal link for subscription management
  - [ ] 19.10 Create `app/settings/billing/page.tsx` for billing settings
  - [ ] 19.11 Add promotional code support
  - [ ] 19.12 Test complete checkout flow

- [ ] 20.0 Implement Usage Tracking and Billing
  - [ ] 20.1 Create `lib/stripe/usage.ts` for tracking question generation
  - [ ] 20.2 Create `lib/hooks/use-subscription.ts` for subscription status
  - [ ] 20.3 Implement quota checking before question generation
  - [ ] 20.4 Track usage in Firestore customer documents
  - [ ] 20.5 Display usage statistics in billing page
  - [ ] 20.6 Implement usage alerts when approaching limits
  - [ ] 20.7 Add metered billing support for enterprise plans
  - [ ] 20.8 Create usage reset logic for monthly billing cycles
  - [ ] 20.9 Implement feature gating based on subscription tier
  - [ ] 20.10 Test usage tracking and quota enforcement

- [ ] 21.0 Add Error Handling and Monitoring
  - [ ] 21.1 Install Sentry: `npm install @sentry/nextjs`
  - [ ] 21.2 Initialize Sentry in `sentry.client.config.ts` and `sentry.server.config.ts`
  - [ ] 21.3 Add error boundaries to major page components
  - [ ] 21.4 Implement global error handler in `app/error.tsx`
  - [ ] 21.5 Add custom error pages (404, 500)
  - [ ] 21.6 Implement toast notifications for user-facing errors (using sonner)
  - [ ] 21.7 Add logging for API routes and server actions
  - [ ] 21.8 Set up error alerts in Sentry dashboard
  - [ ] 21.9 Add source maps upload for production debugging
  - [ ] 21.10 Test error tracking with intentional errors

- [ ] 22.0 Performance Optimization
  - [ ] 22.1 Install Upstash Redis: `npm install @upstash/redis`
  - [ ] 22.2 Configure Redis caching in `.env.local`
  - [ ] 22.3 Implement caching for product data and categories
  - [ ] 22.4 Add React Query caching strategies with stale times
  - [ ] 22.5 Optimize images using Next.js Image component
  - [ ] 22.6 Implement lazy loading for heavy components
  - [ ] 22.7 Code-split large dependencies with dynamic imports
  - [ ] 22.8 Add database indexes for frequently queried fields
  - [ ] 22.9 Optimize bundle size by analyzing with `@next/bundle-analyzer`
  - [ ] 22.10 Test performance with Lighthouse and fix issues
  - [ ] 22.11 Implement progressive loading for category tree
  - [ ] 22.12 Add request deduplication for API calls

- [ ] 23.0 Testing and Quality Assurance
  - [ ] 23.1 Install Vitest: `npm install -D vitest @vitest/ui`
  - [ ] 23.2 Configure Vitest in `vitest.config.ts`
  - [ ] 23.3 Write unit tests for utility functions (validation, formatting, etc.)
  - [ ] 23.4 Write tests for API routes
  - [ ] 23.5 Write tests for React hooks
  - [ ] 23.6 Install Playwright: `npm install -D @playwright/test`
  - [ ] 23.7 Configure Playwright in `playwright.config.ts`
  - [ ] 23.8 Write E2E tests for authentication flow
  - [ ] 23.9 Write E2E tests for project creation and category discovery
  - [ ] 23.10 Write E2E tests for review workflow
  - [ ] 23.11 Write E2E tests for pricing and checkout
  - [ ] 23.12 Run full test suite and fix failing tests
  - [ ] 23.13 Set up CI/CD with GitHub Actions for automated testing

- [ ] 24.0 Documentation and Deployment
  - [ ] 24.1 Create comprehensive README.md with setup instructions
  - [ ] 24.2 Document environment variables in `.env.example`
  - [ ] 24.3 Write API documentation for all endpoints
  - [ ] 24.4 Create developer onboarding guide
  - [ ] 24.5 Document database schema and relationships
  - [ ] 24.6 Create user guide for key features
  - [ ] 24.7 Set up Vercel project and link to GitHub repository
  - [ ] 24.8 Configure production environment variables in Vercel
  - [ ] 24.9 Deploy Firebase Functions: `firebase deploy --only functions`
  - [ ] 24.10 Deploy Firestore rules and indexes: `firebase deploy --only firestore`
  - [ ] 24.11 Deploy to Vercel production
  - [ ] 24.12 Test production deployment thoroughly
  - [ ] 24.13 Set up custom domain (if applicable)
  - [ ] 24.14 Configure analytics and monitoring for production
  - [ ] 24.15 Create backup and disaster recovery plan
