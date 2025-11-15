import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth, isAdminInitialized } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';

export async function PATCH(
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

    // Parse request body
    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Get the draft
    const draftDoc = await adminDb.collection(COLLECTIONS.DRAFTS).doc(params.id).get();

    if (!draftDoc.exists) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    const draftData = draftDoc.data();
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

    // Calculate word count
    const wordCount = content.split(/\s+/).filter((word: string) => word.length > 0).length;

    // Update draft
    await adminDb.collection(COLLECTIONS.DRAFTS).doc(params.id).update({
      content,
      wordCount,
      updatedAt: now,
    });

    return NextResponse.json({
      message: 'Draft updated successfully',
      wordCount,
    });
  } catch (error: any) {
    console.error('Error updating draft:', error);
    return NextResponse.json(
      { error: 'Failed to update draft', message: error.message },
      { status: 500 }
    );
  }
}

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

    // Get the draft
    const draftDoc = await adminDb.collection(COLLECTIONS.DRAFTS).doc(params.id).get();

    if (!draftDoc.exists) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 });
    }

    const draftData = draftDoc.data();
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

    return NextResponse.json({
      draft: {
        id: draftDoc.id,
        ...draftData,
      },
    });
  } catch (error: any) {
    console.error('Error fetching draft:', error);
    return NextResponse.json(
      { error: 'Failed to fetch draft', message: error.message },
      { status: 500 }
    );
  }
}
