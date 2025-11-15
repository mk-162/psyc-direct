import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth, isAdminInitialized } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';

export async function POST(
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

    // Get the draft
    const draftDoc = await adminDb.collection(COLLECTIONS.DRAFTS).doc(params.id).get();

    if (!draftDoc.exists) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    const draftData = draftDoc.data();
    const questionId = draftData?.questionId;
    const projectId = draftData?.projectId;

    // Check access
    const projectDoc = await adminDb.collection(COLLECTIONS.PROJECTS).doc(projectId).get();
    const projectData = projectDoc.data();

    if (
      projectData?.ownerId !== userId &&
      !projectData?.editorIds?.includes(userId)
    ) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const now = new Date();

    // Update draft status
    await adminDb.collection(COLLECTIONS.DRAFTS).doc(params.id).update({
      status: 'accepted',
      acceptedBy: userId,
      acceptedAt: now,
      updatedAt: now,
    });

    // Update question status
    await adminDb.collection(COLLECTIONS.QUESTIONS).doc(questionId).update({
      status: 'accepted',
      reviewedBy: userId,
      reviewedAt: now,
      updatedAt: now,
    });

    // Update project stats
    const currentAccepted = projectData.stats?.questionsAccepted || 0;
    await adminDb.collection(COLLECTIONS.PROJECTS).doc(projectId).update({
      'stats.questionsAccepted': currentAccepted + 1,
      updatedAt: now,
      lastActivityAt: now,
    });

    return NextResponse.json({
      message: 'Draft accepted successfully',
    });
  } catch (error: any) {
    console.error('Error accepting draft:', error);
    return NextResponse.json(
      { error: 'Failed to accept draft', message: error.message },
      { status: 500 }
    );
  }
}
