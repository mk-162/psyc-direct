import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth, isAdminInitialized } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminDb = getAdminDb();
  const adminAuth = getAdminAuth();

  if (!isAdminInitialized() || !adminDb || !adminAuth) {
    return NextResponse.json(
      { error: 'Firebase Admin not configured' },
      { status: 503 }
    );
  }

  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get the project to check access
    const projectDoc = await adminDb
      .collection(COLLECTIONS.PROJECTS)
      .doc(params.id)
      .get();

    if (!projectDoc.exists) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const projectData = projectDoc.data();

    if (
      projectData?.ownerId !== userId &&
      !projectData?.editorIds?.includes(userId)
    ) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Fetch recent questions (no orderBy to avoid index requirement)
    const questionsSnapshot = await adminDb
      .collection(COLLECTIONS.QUESTIONS)
      .where('projectId', '==', params.id)
      .limit(50)
      .get();

    // Fetch recent drafts (no orderBy to avoid index requirement)
    const draftsSnapshot = await adminDb
      .collection(COLLECTIONS.DRAFTS)
      .where('projectId', '==', params.id)
      .limit(50)
      .get();

    const activity: any[] = [];

    // Process questions
    for (const doc of questionsSnapshot.docs) {
      const question = doc.data();

      if (question.status === 'ready_for_review' && question.draftCount > 0) {
        activity.push({
          id: `draft_created_${doc.id}`,
          type: 'draft_created',
          question: question.question,
          contentSnippet: null,
          timestamp: question.updatedAt,
        });
      } else if (question.status === 'pending' || question.status === 'generating') {
        activity.push({
          id: `question_${doc.id}`,
          type: 'question_generated',
          question: question.question,
          contentSnippet: null,
          timestamp: question.createdAt || question.updatedAt,
        });
      }
    }

    // Process drafts
    for (const doc of draftsSnapshot.docs) {
      const draft = doc.data();
      const questionId = draft.questionId;

      // Get the question for this draft
      const questionDoc = await adminDb
        .collection(COLLECTIONS.QUESTIONS)
        .doc(questionId)
        .get();

      if (questionDoc.exists) {
        const questionData = questionDoc.data();

        if (draft.status === 'accepted') {
          // Extract text snippet from content
          const contentSnippet = extractTextSnippet(draft.content);

          activity.push({
            id: `accepted_${doc.id}`,
            type: 'draft_accepted',
            question: questionData?.question || 'Unknown Question',
            contentSnippet,
            timestamp: draft.acceptedAt || draft.updatedAt,
          });
        } else if (draft.status === 'rejected') {
          activity.push({
            id: `rejected_${doc.id}`,
            type: 'draft_rejected',
            question: questionData?.question || 'Unknown Question',
            contentSnippet: null,
            timestamp: draft.updatedAt,
          });
        }
      }
    }

    // Sort by timestamp descending
    activity.sort((a, b) => {
      const aTime = a.timestamp?._seconds || a.timestamp?.seconds || 0;
      const bTime = b.timestamp?._seconds || b.timestamp?.seconds || 0;
      return bTime - aTime;
    });

    // Return top 10
    return NextResponse.json({ activity: activity.slice(0, 10) });
  } catch (error: any) {
    console.error('Error fetching activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity', message: error.message },
      { status: 500 }
    );
  }
}

function extractTextSnippet(content: string): string {
  if (!content) return '';

  // Remove HTML tags
  const text = content.replace(/<[^>]*>/g, ' ');

  // Clean up whitespace
  const cleaned = text.replace(/\s+/g, ' ').trim();

  // Return first 120 characters
  return cleaned.length > 120 ? cleaned.substring(0, 120) + '...' : cleaned;
}
