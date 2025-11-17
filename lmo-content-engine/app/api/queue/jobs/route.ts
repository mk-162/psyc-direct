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
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    const adminDb = getAdminDb();
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }

    // Build query
    let query = adminDb
      .collection(COLLECTIONS.JOBS)
      .where('userId', '==', userId);

    if (projectId) {
      query = query.where('projectId', '==', projectId);
    }

    if (status) {
      query = query.where('status', '==', status);
    }

    // Get jobs
    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const jobs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate().toISOString(),
      startedAt: doc.data().startedAt?.toDate().toISOString(),
      completedAt: doc.data().completedAt?.toDate().toISOString(),
    }));

    return NextResponse.json({
      jobs,
      count: jobs.length,
    });
  } catch (error: any) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to get jobs',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
