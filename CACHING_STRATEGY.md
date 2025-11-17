# Caching Strategy Analysis & Recommendations

## Current State (CRITICAL ISSUES)

### ❌ Problems Identified

1. **No Client-Side Caching**
   - React Query is installed but NOT being used
   - All data fetching uses plain `fetch()` in `useEffect`
   - Every component mount triggers new API calls
   - No request deduplication
   - No stale-while-revalidate

2. **No API Route Caching**
   - No `Cache-Control` headers on API responses
   - Every request hits Firestore directly
   - No HTTP caching layer

3. **Excessive Database Queries**
   Looking at server logs, a single page load triggers:
   - 2-3x `/api/projects` calls
   - 1-2x `/api/projects/[id]/categories` calls
   - Multiple `/api/projects/[id]/categories/[categoryId]/subcategories` calls (one per category)
   - Multiple `/api/content` calls (on every filter change)
   - `/api/quota` calls (failing with 401, but still hitting the API)

4. **Component Re-fetch Issues**
   - Content page refetches on every filter change
   - Categories refetch on project selection
   - No data persistence between page navigations
   - Quota API is being called but returning 401 (not implemented?)

### 💰 Cost Impact

**Firestore Pricing (approximate):**
- Document reads: $0.06 per 100,000 reads
- A single page load currently triggers ~15-20 document reads
- With 1,000 page loads/day = 15,000-20,000 reads/day = 450,000-600,000 reads/month
- Monthly cost: $0.27-$0.36 (low but scales linearly with traffic)

**With 10 users actively browsing:**
- 600,000 reads/month × 10 = 6,000,000 reads/month
- Monthly cost: ~$3.60

**Without caching, this scales exponentially with:**
- More users
- More categories/subcategories
- More frequent interactions
- Real-time updates

---

## Recommended Caching Strategy

### 1. Client-Side Caching with React Query (IMMEDIATE)

**Priority: HIGH - Quick Win**

#### Implementation Steps:

1. **Set up QueryClientProvider** in root layout
2. **Convert fetch calls to React Query hooks**
3. **Configure stale times and cache times**

#### Benefits:
- ✅ Automatic request deduplication
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Stale-while-revalidate
- ✅ 80-90% reduction in API calls

#### Recommended Cache Times:
```typescript
{
  projects: { staleTime: 5 minutes, cacheTime: 10 minutes },
  categories: { staleTime: 3 minutes, cacheTime: 10 minutes },
  subcategories: { staleTime: 3 minutes, cacheTime: 10 minutes },
  content: { staleTime: 30 seconds, cacheTime: 5 minutes },
  quota: { staleTime: 1 minute, cacheTime: 5 minutes }
}
```

#### Example Conversion:
```typescript
// BEFORE (current)
const [projects, setProjects] = useState([]);
useEffect(() => {
  fetchProjects(); // Runs on every mount
}, [user]);

// AFTER (React Query)
const { data: projects } = useQuery({
  queryKey: ['projects', user?.uid],
  queryFn: fetchProjects,
  staleTime: 5 * 60 * 1000, // 5 minutes
  enabled: !!user,
});
```

---

### 2. API Route Response Caching (IMMEDIATE)

**Priority: HIGH - Easy Implementation**

Add `Cache-Control` headers to API routes:

```typescript
// For relatively static data (projects, categories)
return NextResponse.json({ categories }, {
  headers: {
    'Cache-Control': 'private, s-maxage=180, stale-while-revalidate=300'
  }
});

// For dynamic data (content)
return NextResponse.json({ items }, {
  headers: {
    'Cache-Control': 'private, s-maxage=30, stale-while-revalidate=60'
  }
});
```

---

### 3. Request Batching & Deduplication (MEDIUM PRIORITY)

**Issue:** Subcategories are fetched individually in a loop
```typescript
// Current: O(n) requests
for (const category of categories) {
  fetch(`/api/projects/${id}/categories/${category.id}/subcategories`)
}
```

**Solution:** Batch endpoint
```typescript
// Single request: O(1)
fetch(`/api/projects/${id}/categories/subcategories/batch`, {
  body: JSON.stringify({ categoryIds })
})
```

---

### 4. Firestore Query Optimization (MEDIUM PRIORITY)

**Current Issues:**
- Subcategories fetched separately for each category
- Stats calculated on every request
- No composite indexes for common queries

**Recommendations:**
1. **Pre-compute stats** in category documents (using Cloud Functions)
2. **Batch subcategory fetches** in a single query
3. **Add composite indexes** for common query patterns
4. **Use `select()` to fetch only needed fields**

Example:
```typescript
// BEFORE: Fetches entire document
const categoriesSnapshot = await adminDb
  .collection(COLLECTIONS.CATEGORIES)
  .where('projectId', '==', projectId)
  .get();

// AFTER: Fetches only needed fields
const categoriesSnapshot = await adminDb
  .collection(COLLECTIONS.CATEGORIES)
  .where('projectId', '==', projectId)
  .select('title', 'hasSubcategories', 'subcategoryCount', 'stats')
  .get();
```

---

### 5. Server-Side Caching with Redis (LOW PRIORITY - FUTURE)

**When to implement:**
- After 1,000+ daily active users
- When Firestore costs become significant (>$50/month)
- When response times exceed 500ms

**What to cache:**
- User sessions
- Project metadata
- Category trees (updated on mutations)
- Frequently accessed content

**Cost Comparison:**
- Redis (Upstash): ~$10-20/month for caching layer
- Firestore savings: Could reduce by 70-80%
- Break-even: ~5,000+ daily active users

---

### 6. Optimistic Updates (MEDIUM PRIORITY)

For category/subcategory creation, implement optimistic updates:

```typescript
const mutation = useMutation({
  mutationFn: createCategory,
  onMutate: async (newCategory) => {
    // Cancel ongoing queries
    await queryClient.cancelQueries({ queryKey: ['categories'] });

    // Snapshot previous value
    const previous = queryClient.getQueryData(['categories']);

    // Optimistically update
    queryClient.setQueryData(['categories'], (old) => [...old, newCategory]);

    return { previous };
  },
  onError: (err, newCategory, context) => {
    // Rollback on error
    queryClient.setQueryData(['categories'], context.previous);
  },
});
```

---

## Implementation Priority

### Phase 1: Immediate Wins (1-2 hours)
1. Set up React Query provider
2. Convert projects/categories/content fetching to useQuery
3. Add Cache-Control headers to API routes
4. Fix quota API or remove calls if not needed

**Expected Impact:** 70-80% reduction in database queries

### Phase 2: Optimization (2-4 hours)
1. Implement batch subcategories endpoint
2. Add Firestore query optimizations (select fields)
3. Implement optimistic updates for mutations

**Expected Impact:** Additional 10-15% reduction

### Phase 3: Advanced (Future - when needed)
1. Redis caching layer
2. Real-time subscriptions for live updates
3. Background data prefetching
4. Service worker for offline support

---

## Monitoring & Metrics

### What to Track:
1. **Firestore reads per day** (Firebase Console)
2. **API response times** (Vercel Analytics)
3. **Cache hit rates** (React Query DevTools)
4. **User-perceived performance** (Core Web Vitals)

### Alert Thresholds:
- Firestore reads > 1M/month
- API response time > 500ms (p95)
- Cache hit rate < 60%

---

## Cost Projection

### Current State (No Caching):
| Users/Day | Reads/Month | Cost/Month |
|-----------|-------------|------------|
| 10        | 600K        | $0.36      |
| 100       | 6M          | $3.60      |
| 1,000     | 60M         | $36.00     |
| 10,000    | 600M        | $360.00    |

### With React Query + API Caching:
| Users/Day | Reads/Month | Cost/Month | Savings |
|-----------|-------------|------------|---------|
| 10        | 120K        | $0.07      | 80%     |
| 100       | 1.2M        | $0.72      | 80%     |
| 1,000     | 12M         | $7.20      | 80%     |
| 10,000    | 120M        | $72.00     | 80%     |

### With Redis (at scale):
| Users/Day | Reads/Month | Firestore | Redis | Total | Savings vs No Cache |
|-----------|-------------|-----------|-------|-------|---------------------|
| 10,000    | 120M → 30M  | $18.00    | $15   | $33   | 91%                 |

---

## Next Steps

1. **Review this document** - Confirm priorities
2. **Implement Phase 1** - React Query setup (highest ROI)
3. **Monitor impact** - Track Firestore reads before/after
4. **Plan Phase 2** - Based on usage patterns

Would you like me to implement Phase 1 now?
