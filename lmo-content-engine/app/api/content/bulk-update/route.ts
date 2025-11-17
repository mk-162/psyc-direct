import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth, isAdminInitialized } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';
import { FieldValue } from 'firebase-admin/firestore';

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
    const { projectId, itemIds, action } = body;

    if (!projectId || !itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    if (!['generate', 'approve', 'publish', 'archive', 'delete'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
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

    // Perform bulk operation using batch
    const batch = adminDb.batch();
    let successCount = 0;
    let failureCount = 0;

    for (const itemId of itemIds) {
      try {
        const questionRef = adminDb
          .collection(COLLECTIONS.QUESTIONS)
          .doc(itemId);

        const questionDoc = await questionRef.get();
        if (!questionDoc.exists) {
          failureCount++;
          continue;
        }

        const questionData = questionDoc.data();
        if (questionData?.projectId !== projectId) {
          failureCount++;
          continue;
        }

        // Apply the appropriate action
        switch (action) {
          case 'generate':
            batch.update(questionRef, {
              status: 'generating',
              updatedAt: FieldValue.serverTimestamp(),
            });
            // Note: Actual generation would be triggered by a background job
            break;

          case 'approve':
            batch.update(questionRef, {
              status: 'accepted',
              updatedAt: FieldValue.serverTimestamp(),
            });
            break;

          case 'publish':
            batch.update(questionRef, {
              publicationStatus: 'published',
              publishedAt: FieldValue.serverTimestamp(),
              updatedAt: FieldValue.serverTimestamp(),
            });
            break;

          case 'archive':
            batch.update(questionRef, {
              publicationStatus: 'archived',
              archivedAt: FieldValue.serverTimestamp(),
              updatedAt: FieldValue.serverTimestamp(),
            });
            break;

          case 'delete':
            batch.delete(questionRef);
            break;
        }

        successCount++;
      } catch (error) {
        console.error(`Failed to process item ${itemId}:`, error);
        failureCount++;
      }
    }

    // Commit the batch
    await batch.commit();

    return NextResponse.json({
      success: true,
      successCount,
      failureCount,
      total: itemIds.length,
    });
  } catch (error: any) {
    console.error('Error in bulk update:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk update', message: error.message },
      { status: 500 }
    );
  }
}
