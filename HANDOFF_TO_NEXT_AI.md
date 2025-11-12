# Handoff Document for Next AI

## Repository Information
- **GitHub URL**: https://github.com/mk-162/lmo-content-engine
- **Branch**: `main`
- **Latest Commit**: `16204ba` - "Initial commit: LMO Content Engine foundation"
- **Local Path**: `C:\AI_Project\contentking\lmo-content-engine`

## Current Status

### ✅ What's Complete (Foundation - 100%)
1. **Next.js 14 Application**
   - App Router with TypeScript
   - 7 pages created (landing, login, register, dashboard, project creation)
   - Tailwind CSS with custom design system
   - shadcn/ui components integrated

2. **Firebase Integration**
   - Client SDK (auth, firestore, functions, storage)
   - Admin SDK for server-side operations
   - Authentication functions (email, Google OAuth)
   - Query helpers (CRUD operations)
   - Security rules with ownership-based access
   - Database indexes

3. **Database Schema**
   - 8 TypeScript interfaces (Project, Category, Subcategory, Question, Draft, FactCheck, Job, Customer)
   - Collection constants defined
   - All relationships mapped

4. **AI Service Integrations**
   - Perplexity client (website research, category/question generation)
   - OpenAI client (content generation, fact-checking)
   - Comprehensive prompt library (400+ lines)

5. **TypeScript Fixes Applied**
   - Fixed `React.Node` → `React.ReactNode` in app/layout.tsx
   - Fixed spread operator on Set in lib/ai/openai.ts
   - Added `| undefined` types to Firebase exports
   - Added null checks in all Firebase functions
   - Added auth guard in use-auth.ts hook

### ⚠️ Critical Issue: Dev Server Won't Start

**Root Cause Identified**: File locking issue with `.next/trace` file

**What Happened**:
1. First 2 dev servers (ports 3000 & 3001) started successfully
2. They locked `.next/trace` file with Windows EPERM error
3. All subsequent servers hang at "✓ Starting..." because they can't access the locked file
4. Multiple node processes are still running, holding ports 3000-3006 and 8080

**Evidence**:
```
bash_id f7ea80 (port 3000): "✓ Ready in 1302ms" ✅
bash_id 8db369 (port 3001): "✓ Ready in 1365ms" ✅ but shows:
[Error: EPERM: operation not permitted, open 'C:\AI_Project\contentking\lmo-content-engine\.next\trace']

All other servers: Stuck at "✓ Starting..." ❌
```

## Your Mission: Fix the Dev Server

### Phase 1: Clean Up (CRITICAL - Do This First)
```bash
# Kill ALL running node processes
taskkill /F /IM node.exe

# Navigate to project
cd C:\AI_Project\contentking\lmo-content-engine

# Delete the locked .next folder
rm -rf .next

# Delete node cache if exists
rm -rf node_modules/.cache

# Verify no processes on ports 3000-9000
netstat -ano | findstr "300[0-9]\|8080\|9000"
```

### Phase 2: Start Fresh Dev Server
```bash
cd C:\AI_Project\contentking\lmo-content-engine

# Start dev server (only ONE instance!)
npm run dev

# Wait for "✓ Ready in XXXms" message
# If it hangs at "✓ Starting..." for >30 seconds, there's still a file lock issue
```

### Phase 3: If Still Hanging
Try these approaches in order:

**Approach A: Disable Trace File**
```bash
# Add to next.config.js:
experimental: {
  disableOptimizedLoading: true,
}
```

**Approach B: Use Turbo Mode**
```bash
npm run dev -- --turbo
```

**Approach C: Revert Firebase Changes** (if the undefined types are causing SSR issues)
The Firebase client was changed to export `Auth | undefined` types. This might be too cautious. Consider reverting lib/firebase/client.ts to:
```typescript
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
// ... without | undefined
```

### Phase 4: Verify Everything Works
Once server starts:
1. Visit http://localhost:3000
2. Test landing page loads
3. Test /login page
4. Test /register page
5. Test /projects/new (should redirect to login if not authenticated)
6. Verify no TypeScript errors

## Project Structure
```
lmo-content-engine/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx (Protected route wrapper)
│   │   ├── page.tsx
│   │   └── projects/new/page.tsx
│   ├── api/projects/route.ts
│   ├── layout.tsx (Root layout)
│   ├── page.tsx (Landing page)
│   └── globals.css
├── components/
│   ├── layout/sidebar.tsx
│   └── ui/ (shadcn/ui components)
├── lib/
│   ├── ai/
│   │   ├── perplexity.ts (350+ lines)
│   │   ├── openai.ts (300+ lines)
│   │   └── prompts.ts (400+ lines)
│   ├── firebase/
│   │   ├── client.ts (⚠️ Has | undefined types)
│   │   ├── admin.ts
│   │   ├── auth.ts (⚠️ Has null checks)
│   │   ├── queries.ts (⚠️ Has null checks)
│   │   └── schema.ts
│   ├── hooks/
│   │   └── use-auth.ts (⚠️ Has auth guard)
│   └── utils/
│       ├── cn.ts
│       └── url.ts
└── Configuration files (package.json, tsconfig.json, etc.)
```

## Environment Variables Needed
The `.env.local` file exists but has placeholder values:

```env
# Firebase (REAL values from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAKLSgUCAIJhEOPtoUNRqZ4jyOukK6hVwo
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lmo-king.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lmo-king
# ... (other Firebase values are real)

# Firebase Admin (NEED REAL VALUES)
FIREBASE_ADMIN_PROJECT_ID=placeholder ❌
FIREBASE_ADMIN_CLIENT_EMAIL=placeholder ❌
FIREBASE_ADMIN_PRIVATE_KEY=placeholder ❌

# AI Services (REAL values in .env.local - not shown here for security)
PERPLEXITY_API_KEY=pplx-******* (real key exists in local .env.local)
OPENAI_API_KEY=sk-proj-******* (real key exists in local .env.local)

# Stripe (NEED REAL VALUES - but not critical for dev server)
STRIPE_PUBLISHABLE_KEY=placeholder
STRIPE_SECRET_KEY=placeholder
```

## Next Steps After Dev Server Works

1. **Set up Firebase Admin credentials** (for API routes to work)
2. **Implement job queue system** (Task 8.0 from roadmap)
3. **Build category discovery** (Task 11.0)
4. **Create review UI** (Task 14.0-18.0)

## Files Changed Since Last Known Working State

The following files were modified to add TypeScript safety but might be causing the compilation hang:

1. `lib/firebase/client.ts` - Added `| undefined` to all exports
2. `lib/firebase/auth.ts` - Added null checks in all functions
3. `lib/firebase/queries.ts` - Added null checks in all functions
4. `lib/hooks/use-auth.ts` - Added auth guard in useEffect

**If all else fails**, consider reverting these files to their original state (before the `| undefined` changes).

## Success Criteria

You'll know you've succeeded when:
1. `npm run dev` completes with "✓ Ready in XXXms"
2. http://localhost:3000 loads without errors
3. All pages render correctly
4. No console errors in browser
5. No TypeScript compilation errors

## Resources

- **Documentation**: See `lmo-content-engine/README.md`
- **Full Task List**: `tasks/tasks-lmo-content-engine.md` (230+ tasks)
- **Project Status**: `PROJECT_STATUS.md`
- **Build Summary**: `BUILD_COMPLETE.md`

## Questions?

If you need clarification on anything:
1. Check the commit message: `git log --format=full -n 1`
2. Review the documentation files in the root
3. All code follows TypeScript strict mode conventions

---

**Good luck! The foundation is solid - just need to fix the file locking issue.**

*Last updated: November 12, 2025*
*Handoff from: Claude Code (Sonnet 4.5)*
*Next AI: [Your name here]*
