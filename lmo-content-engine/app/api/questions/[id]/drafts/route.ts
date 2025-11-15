import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth, isAdminInitialized } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';
import { OpenAIClient } from '@/lib/ai/openai';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get the question
    const questionDoc = await adminDb
      .collection(COLLECTIONS.QUESTIONS)
      .doc(params.id)
      .get();

    if (!questionDoc.exists) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const questionData = questionDoc.data();
    const projectId = questionData?.projectId;

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

    // Get context from category/subcategory
    let context = `Website: ${projectData.websiteUrl}`;

    if (questionData.subcategoryId) {
      const subcategoryDoc = await adminDb
        .collection(COLLECTIONS.CATEGORIES)
        .doc(questionData.subcategoryId)
        .get();

      if (subcategoryDoc.exists) {
        const subcategoryData = subcategoryDoc.data();
        context += `\nCategory: ${subcategoryData?.title}\nDescription: ${subcategoryData?.description}`;
      }
    } else if (questionData.categoryId) {
      const categoryDoc = await adminDb
        .collection(COLLECTIONS.CATEGORIES)
        .doc(questionData.categoryId)
        .get();

      if (categoryDoc.exists) {
        const categoryData = categoryDoc.data();
        context += `\nCategory: ${categoryData?.title}\nDescription: ${categoryData?.description}`;
      }
    }

    // Update question status to generating
    await adminDb.collection(COLLECTIONS.QUESTIONS).doc(params.id).update({
      status: 'generating',
      updatedAt: new Date(),
    });

    // Generate drafts using OpenAI
    console.log(`📝 Generating drafts for question: ${questionData.question}`);
    const openai = new OpenAIClient();

    // Generate both short and long drafts in parallel
    const [shortResult, longResult] = await Promise.all([
      openai.generateShortDraft(questionData.question, context),
      openai.generateLongDraft(questionData.question, context),
    ]);

    console.log(`✅ Generated short draft (${shortResult.wordCount} words)`);
    console.log(`✅ Generated long draft (${longResult.wordCount} words)`);

    // Create draft documents
    const batch = adminDb.batch();
    const now = new Date();

    // Short draft
    const shortDraftRef = adminDb.collection(COLLECTIONS.DRAFTS).doc();
    batch.set(shortDraftRef, {
      questionId: params.id,
      projectId,
      type: 'short',
      content: shortResult.content,
      wordCount: shortResult.wordCount,
      generatedBy: 'gpt4',
      model: 'gpt-4-turbo-preview',
      citations: shortResult.citations.map((citation) => ({
        text: citation,
        url: citation.startsWith('http') ? citation : '',
        source: citation,
        relevance: 1.0,
      })),
      version: 1,
      isDraft: true,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    });

    // Long draft
    const longDraftRef = adminDb.collection(COLLECTIONS.DRAFTS).doc();
    batch.set(longDraftRef, {
      questionId: params.id,
      projectId,
      type: 'long',
      content: longResult.content,
      wordCount: longResult.wordCount,
      generatedBy: 'gpt4',
      model: 'gpt-4-turbo-preview',
      citations: longResult.citations.map((citation) => ({
        text: citation,
        url: citation.startsWith('http') ? citation : '',
        source: citation,
        relevance: 1.0,
      })),
      version: 1,
      isDraft: true,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
    });

    // Update question with draft info
    const questionRef = adminDb.collection(COLLECTIONS.QUESTIONS).doc(params.id);
    batch.update(questionRef, {
      status: 'ready_for_review',
      hasShortDraft: true,
      hasLongDraft: true,
      draftCount: 2,
      currentDraftId: longDraftRef.id, // Use long draft as default
      updatedAt: now,
    });

    // Commit all changes
    await batch.commit();

    console.log(`✅ Drafts saved to Firestore`);

    return NextResponse.json({
      message: 'Drafts generated successfully',
      shortDraft: {
        id: shortDraftRef.id,
        wordCount: shortResult.wordCount,
      },
      longDraft: {
        id: longDraftRef.id,
        wordCount: longResult.wordCount,
      },
    });
  } catch (error: any) {
    console.error('Error generating drafts:', error);

    // Update question status to error
    try {
      await adminDb.collection(COLLECTIONS.QUESTIONS).doc(params.id).update({
        status: 'pending',
        updatedAt: new Date(),
      });
    } catch (updateError) {
      console.error('Failed to update question status:', updateError);
    }

    return NextResponse.json(
      { error: 'Failed to generate drafts', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Get the question
    const questionDoc = await adminDb
      .collection(COLLECTIONS.QUESTIONS)
      .doc(params.id)
      .get();

    if (!questionDoc.exists) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    const questionData = questionDoc.data();
    const projectId = questionData?.projectId;

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

    // Get drafts for this question
    const draftsSnapshot = await adminDb
      .collection(COLLECTIONS.DRAFTS)
      .where('questionId', '==', params.id)
      .get();

    const drafts = draftsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by version descending
    drafts.sort((a: any, b: any) => (b.version || 0) - (a.version || 0));

    return NextResponse.json({ drafts });
  } catch (error: any) {
    console.error('Error fetching drafts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch drafts', message: error.message },
      { status: 500 }
    );
  }
}
