import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth, isAdminInitialized } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';

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

    // Get the project to check access
    const projectDoc = await adminDb
      .collection(COLLECTIONS.PROJECTS)
      .doc(params.id)
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

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build query
    let query = adminDb
      .collection(COLLECTIONS.QUESTIONS)
      .where('projectId', '==', params.id);

    if (status) {
      query = query.where('status', '==', status);
    }

    // Add limit
    query = query.limit(limit);

    const questionsSnapshot = await query.get();

    let questions = questionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // If category filter is provided, filter by categoryId OR subcategoryId
    if (categoryId) {
      questions = questions.filter(
        (q: any) => q.categoryId === categoryId || q.subcategoryId === categoryId
      );
    }

    // Sort by order field
    questions.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions', message: error.message },
      { status: 500 }
    );
  }
}
