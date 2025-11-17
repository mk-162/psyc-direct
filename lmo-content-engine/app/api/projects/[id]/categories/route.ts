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
        message: 'Firebase Admin SDK credentials are missing. Add them to .env.local to use API routes.',
      },
      { status: 503 }
    );
  }

  try {
    // Get auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get the project first to check access
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

    // Get categories for this project
    const categoriesSnapshot = await adminDb
      .collection(COLLECTIONS.CATEGORIES)
      .where('projectId', '==', params.id)
      .where('level', '==', 0)
      .get();

    const categories = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by order field
    categories.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    return NextResponse.json(
      { categories },
      {
        headers: {
          // Cache for 3 minutes, stale-while-revalidate for 5 minutes
          'Cache-Control': 'private, max-age=180, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories', message: error.message },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store', // Don't cache errors
        },
      }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminDb = getAdminDb();
  const adminAuth = getAdminAuth();

  if (!isAdminInitialized() || !adminDb || !adminAuth) {
    return NextResponse.json(
      {
        error: 'Firebase Admin not configured',
        message: 'Firebase Admin SDK credentials are missing. Add them to .env.local to use API routes.',
      },
      { status: 503 }
    );
  }

  try {
    // Get auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get the project first to check access
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

    // Get request body
    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Get current max order to append new category at the end
    const categoriesSnapshot = await adminDb
      .collection(COLLECTIONS.CATEGORIES)
      .where('projectId', '==', params.id)
      .where('level', '==', 0)
      .orderBy('order', 'desc')
      .limit(1)
      .get();

    const maxOrder = categoriesSnapshot.empty
      ? 0
      : (categoriesSnapshot.docs[0].data().order || 0);

    // Create new category
    const newCategoryRef = adminDb.collection(COLLECTIONS.CATEGORIES).doc();
    const newCategory = {
      title,
      description: description || '',
      projectId: params.id,
      level: 0,
      order: maxOrder + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
    };

    await newCategoryRef.set(newCategory);

    return NextResponse.json({
      id: newCategoryRef.id,
      ...newCategory,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category', message: error.message },
      { status: 500 }
    );
  }
}
