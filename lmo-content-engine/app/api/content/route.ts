import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth, isAdminInitialized } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';

export async function GET(request: NextRequest) {
  // Check if Firebase Admin is initialized
  const adminDb = getAdminDb();
  const adminAuth = getAdminAuth();

  if (!isAdminInitialized() || !adminDb || !adminAuth) {
    return NextResponse.json(
      {
        error: 'Firebase Admin not configured',
        message: 'Firebase Admin SDK credentials are missing.',
      },
      { status: 503 }
    );
  }

  try {
    // Get auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const categoryId = searchParams.get('category');
    const subcategoryId = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const workflowStatus = searchParams.get('workflowStatus');
    const publicationStatus = searchParams.get('publicationStatus');
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Check project access
    const projectDoc = await adminDb
      .collection(COLLECTIONS.PROJECTS)
      .doc(projectId)
      .get();

    if (!projectDoc.exists) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const projectData = projectDoc.data();
    if (
      projectData?.ownerId !== userId &&
      !projectData?.editorIds?.includes(userId)
    ) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Build query for questions
    let query = adminDb
      .collection(COLLECTIONS.QUESTIONS)
      .where('projectId', '==', projectId);

    // Apply filters
    if (categoryId) {
      query = query.where('categoryId', '==', categoryId);
    }
    if (subcategoryId) {
      query = query.where('subcategoryId', '==', subcategoryId);
    }
    if (workflowStatus && workflowStatus !== 'all') {
      query = query.where('status', '==', workflowStatus);
    }
    if (publicationStatus && publicationStatus !== 'all') {
      query = query.where('publicationStatus', '==', publicationStatus);
    }

    // Execute query
    const questionsSnapshot = await query.get();

    // Get all questions
    let questions = questionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Apply search filter (client-side for now)
    if (search && search.length > 0) {
      const searchLower = search.toLowerCase();
      questions = questions.filter(
        (q: any) =>
          q.question?.toLowerCase().includes(searchLower) ||
          q.targetKeywords?.some((k: string) => k.toLowerCase().includes(searchLower))
      );
    }

    // Get category/subcategory titles for all questions
    const categoryIds = [...new Set(questions.map((q: any) => q.categoryId))];
    const subcategoryIds = [...new Set(questions.map((q: any) => q.subcategoryId).filter(Boolean))];

    const [categoriesSnapshot, subcategoriesSnapshot] = await Promise.all([
      categoryIds.length > 0
        ? adminDb
            .collection(COLLECTIONS.CATEGORIES)
            .where('__name__', 'in', categoryIds.slice(0, 10)) // Firestore limit
            .get()
        : Promise.resolve({ docs: [] }),
      subcategoryIds.length > 0
        ? adminDb
            .collection(COLLECTIONS.CATEGORIES)
            .where('__name__', 'in', subcategoryIds.slice(0, 10))
            .get()
        : Promise.resolve({ docs: [] }),
    ]);

    const categoryMap = new Map(
      categoriesSnapshot.docs.map((doc: any) => [doc.id, doc.data()])
    );
    const subcategoryMap = new Map(
      subcategoriesSnapshot.docs.map((doc: any) => [doc.id, doc.data()])
    );

    // Get drafts for questions that have them
    const questionIds = questions.filter((q: any) => q.draftCount > 0).map((q: any) => q.id);

    let draftsMap = new Map();
    if (questionIds.length > 0) {
      // Batch fetch drafts (Firestore limits to 10 per 'in' query)
      const draftBatches = [];
      for (let i = 0; i < questionIds.length; i += 10) {
        const batch = questionIds.slice(i, i + 10);
        draftBatches.push(
          adminDb
            .collection(COLLECTIONS.DRAFTS)
            .where('questionId', 'in', batch)
            .get()
        );
      }

      const draftSnapshots = await Promise.all(draftBatches);
      draftSnapshots.forEach((snapshot) => {
        snapshot.docs.forEach((doc: any) => {
          const draft = doc.data();
          if (!draftsMap.has(draft.questionId)) {
            draftsMap.set(draft.questionId, []);
          }
          draftsMap.get(draft.questionId).push({
            id: doc.id,
            ...draft,
          });
        });
      });
    }

    // Enrich questions with category/subcategory titles and draft content
    const enrichedQuestions = questions.map((question: any) => {
      const category = categoryMap.get(question.categoryId);
      const subcategory = subcategoryMap.get(question.subcategoryId);
      const drafts = draftsMap.get(question.id) || [];

      // Get current draft or latest draft
      const currentDraft = drafts.find((d: any) => d.id === question.currentDraftId) || drafts[0];

      // Convert Firestore timestamps to ISO strings for JSON serialization
      const createdAt = question.createdAt?.toDate?.() || question.createdAt;
      const updatedAt = question.updatedAt?.toDate?.() || question.updatedAt;

      return {
        id: question.id,
        question: question.question,
        content: currentDraft?.content,
        status: question.status,
        publicationStatus: question.publicationStatus,
        draftType: currentDraft?.type,
        wordCount: currentDraft?.wordCount,
        categoryTitle: category?.title,
        subcategoryTitle: subcategory?.title,
        createdAt: createdAt instanceof Date ? createdAt.toISOString() : createdAt,
        updatedAt: updatedAt instanceof Date ? updatedAt.toISOString() : updatedAt,
        targetKeywords: question.targetKeywords,
        searchIntent: question.searchIntent,
        categoryId: question.categoryId,
        subcategoryId: question.subcategoryId,
        currentDraftId: question.currentDraftId,
        hasShortDraft: question.hasShortDraft,
        hasLongDraft: question.hasLongDraft,
        draftCount: question.draftCount,
      };
    });

    // Sort
    enrichedQuestions.sort((a: any, b: any) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        // ISO strings can be compared directly
        const aTime = aVal || '';
        const bTime = bVal || '';
        return sortOrder === 'asc'
          ? aTime.localeCompare(bTime)
          : bTime.localeCompare(aTime);
      }

      // String comparison for title and status
      if (sortOrder === 'asc') {
        return String(aVal || '').localeCompare(String(bVal || ''));
      } else {
        return String(bVal || '').localeCompare(String(aVal || ''));
      }
    });

    // Apply pagination
    const total = enrichedQuestions.length;
    const paginatedQuestions = enrichedQuestions.slice(offset, offset + limit);

    return NextResponse.json(
      {
        items: paginatedQuestions,
        total,
        offset,
        limit,
      },
      {
        headers: {
          // Cache for 30 seconds, stale-while-revalidate for 60 seconds
          // Content changes frequently, so keep cache time short
          'Cache-Control': 'private, max-age=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content', message: error.message },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store', // Don't cache errors
        },
      }
    );
  }
}
