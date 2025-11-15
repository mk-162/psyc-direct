import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth, isAdminInitialized } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';
import { PerplexityClient } from '@/lib/ai/perplexity';

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const { categoryId, projectId } = body;

    if (!categoryId || !projectId) {
      return NextResponse.json(
        { error: 'Missing required fields: categoryId, projectId' },
        { status: 400 }
      );
    }

    // Get the project to check access
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

    // Check if user has access (owner or editor)
    if (
      projectData?.ownerId !== userId &&
      !projectData?.editorIds?.includes(userId)
    ) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Get the category/subcategory
    const categoryDoc = await adminDb
      .collection(COLLECTIONS.CATEGORIES)
      .doc(categoryId)
      .get();

    if (!categoryDoc.exists) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const categoryData = categoryDoc.data();

    // Verify category belongs to this project
    if (categoryData?.projectId !== projectId) {
      return NextResponse.json(
        { error: 'Category does not belong to this project' },
        { status: 400 }
      );
    }

    // Generate questions using Perplexity
    console.log(`🔍 Generating questions for: ${categoryData.title}`);
    const perplexity = new PerplexityClient();
    const result = await perplexity.generateQuestions(
      categoryData.title,
      categoryData.description,
      projectData.websiteUrl
    );

    console.log(`✅ Generated ${result.questions.length} questions`);

    // Create questions in Firestore
    const batch = adminDb.batch();
    const now = new Date();
    let questionCount = 0;

    result.questions.forEach((q, index) => {
      const questionRef = adminDb.collection(COLLECTIONS.QUESTIONS).doc();
      const questionSlug = q.question
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .substring(0, 100);

      batch.set(questionRef, {
        projectId,
        categoryId: categoryData.parentId || categoryId,
        subcategoryId: categoryData.parentId ? categoryId : null,
        question: q.question,
        questionSlug,
        searchIntent: q.searchIntent,
        targetKeywords: q.keywords || [],
        relatedTerms: [],
        generatedBy: 'perplexity',
        status: 'pending',
        draftCount: 0,
        hasShortDraft: false,
        hasLongDraft: false,
        factCheckStatus: 'pending',
        order: index,
        createdAt: now,
        updatedAt: now,
      });

      questionCount++;
    });

    // Update category stats
    const categoryRef = adminDb.collection(COLLECTIONS.CATEGORIES).doc(categoryId);
    batch.update(categoryRef, {
      'stats.totalQuestions': (categoryData.stats?.totalQuestions || 0) + questionCount,
      'stats.questionsGenerated': (categoryData.stats?.questionsGenerated || 0) + questionCount,
      updatedAt: now,
    });

    // If this is a subcategory, also update parent category
    if (categoryData.parentId) {
      const parentRef = adminDb.collection(COLLECTIONS.CATEGORIES).doc(categoryData.parentId);
      const parentDoc = await parentRef.get();
      const parentData = parentDoc.data();

      batch.update(parentRef, {
        'stats.totalQuestions': (parentData?.stats?.totalQuestions || 0) + questionCount,
        'stats.questionsGenerated': (parentData?.stats?.questionsGenerated || 0) + questionCount,
        updatedAt: now,
      });
    }

    // Commit all changes
    await batch.commit();

    // Update project stats
    await adminDb.collection(COLLECTIONS.PROJECTS).doc(projectId).update({
      'stats.totalQuestions': (projectData.stats?.totalQuestions || 0) + questionCount,
      'stats.questionsGenerated': (projectData.stats?.questionsGenerated || 0) + questionCount,
      updatedAt: now,
      lastActivityAt: now,
    });

    console.log(`✅ Created ${questionCount} questions`);

    return NextResponse.json({
      message: 'Questions generated successfully',
      count: questionCount,
    });
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions', message: error.message },
      { status: 500 }
    );
  }
}
