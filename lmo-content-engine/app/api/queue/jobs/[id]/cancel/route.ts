import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const jobId = params.id;

    const adminDb = getAdminDb();
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }

    // Get the job
    const jobRef = adminDb.collection(COLLECTIONS.JOBS).doc(jobId);
    const jobDoc = await jobRef.get();

    if (!jobDoc.exists) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    const jobData = jobDoc.data();

    // Verify ownership
    if (jobData?.userId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - You do not have access to this job' },
        { status: 403 }
      );
    }

    // Check if job can be cancelled
    if (jobData?.status === 'completed' || jobData?.status === 'failed' || jobData?.status === 'cancelled') {
      return NextResponse.json(
        { error: `Cannot cancel job with status: ${jobData?.status}` },
        { status: 400 }
      );
    }

    // Update job status to cancelled
    await jobRef.update({
      status: 'cancelled',
      cancelledAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      error: 'Cancelled by user',
    });

    return NextResponse.json({
      success: true,
      message: 'Job cancelled successfully',
      jobId,
    });
  } catch (error: any) {
    console.error('Cancel job error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to cancel job',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
