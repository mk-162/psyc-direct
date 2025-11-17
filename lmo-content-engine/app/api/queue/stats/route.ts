import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';

export async function GET(request: NextRequest) {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid token' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];

    // Verify the token
    let userId;
    try {
      const { auth: clientAuth } = await import('@/lib/firebase/config');
      const userCredential = await clientAuth.signInWithCustomToken(idToken);
      userId = userCredential.user.uid;
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    const adminDb = getAdminDb();
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }

    // Build base query
    let baseQuery = adminDb
      .collection(COLLECTIONS.JOBS)
      .where('userId', '==', userId);

    if (projectId) {
      baseQuery = baseQuery.where('projectId', '==', projectId);
    }

    // Get counts for different statuses
    const [queuedSnapshot, processingSnapshot, completedSnapshot, failedSnapshot] = await Promise.all([
      baseQuery.where('status', '==', 'queued').get(),
      baseQuery.where('status', '==', 'processing').get(),
      baseQuery.where('status', '==', 'completed').get(),
      baseQuery.where('status', '==', 'failed').get(),
    ]);

    const stats = {
      queued: queuedSnapshot.size,
      processing: processingSnapshot.size,
      completed: completedSnapshot.size,
      failed: failedSnapshot.size,
      total: queuedSnapshot.size + processingSnapshot.size + completedSnapshot.size + failedSnapshot.size,
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error('Get queue stats error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to get queue stats',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
