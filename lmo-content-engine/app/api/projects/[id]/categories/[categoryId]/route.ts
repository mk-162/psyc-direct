import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth, isAdminInitialized } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; categoryId: string } }
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

    // Check if category exists and belongs to this project
    const categoryDoc = await adminDb
      .collection(COLLECTIONS.CATEGORIES)
      .doc(params.categoryId)
      .get();

    if (!categoryDoc.exists) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const categoryData = categoryDoc.data();

    if (categoryData?.projectId !== params.id) {
      return NextResponse.json(
        { error: 'Category does not belong to this project' },
        { status: 403 }
      );
    }

    // Get request body
    const body = await request.json();
    const { title, description } = body;

    // Build update object
    const updates: any = {
      updatedAt: new Date(),
    };

    if (title !== undefined) {
      if (!title) {
        return NextResponse.json(
          { error: 'Title cannot be empty' },
          { status: 400 }
        );
      }
      updates.title = title;
    }

    if (description !== undefined) {
      updates.description = description;
    }

    // Update the category
    await adminDb
      .collection(COLLECTIONS.CATEGORIES)
      .doc(params.categoryId)
      .update(updates);

    // Fetch and return updated category
    const updatedCategoryDoc = await adminDb
      .collection(COLLECTIONS.CATEGORIES)
      .doc(params.categoryId)
      .get();

    return NextResponse.json({
      id: updatedCategoryDoc.id,
      ...updatedCategoryDoc.data(),
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; categoryId: string } }
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

    // Check if category exists and belongs to this project
    const categoryDoc = await adminDb
      .collection(COLLECTIONS.CATEGORIES)
      .doc(params.categoryId)
      .get();

    if (!categoryDoc.exists) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const categoryData = categoryDoc.data();

    if (categoryData?.projectId !== params.id) {
      return NextResponse.json(
        { error: 'Category does not belong to this project' },
        { status: 403 }
      );
    }

    // Delete subcategories first
    const subcategoriesSnapshot = await adminDb
      .collection(COLLECTIONS.CATEGORIES)
      .where('projectId', '==', params.id)
      .where('parentId', '==', params.categoryId)
      .get();

    const batch = adminDb.batch();

    // Delete all subcategories
    subcategoriesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Delete the category itself
    batch.delete(adminDb.collection(COLLECTIONS.CATEGORIES).doc(params.categoryId));

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: 'Category and its subcategories deleted successfully',
      deletedSubcategories: subcategoriesSnapshot.size,
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category', message: error.message },
      { status: 500 }
    );
  }
}
