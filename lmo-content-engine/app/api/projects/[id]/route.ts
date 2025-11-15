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
        hint: 'Get credentials from: Firebase Console → Project Settings → Service Accounts → Generate New Private Key'
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

    // Get the project
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

    return NextResponse.json({
      project: {
        id: projectDoc.id,
        ...projectData,
      },
    });
  } catch (error: any) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project', message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
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
    // Get auth token
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get the project
    const projectRef = adminDb.collection(COLLECTIONS.PROJECTS).doc(params.id);
    const projectDoc = await projectRef.get();

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

    // Parse request body
    const body = await request.json();
    const updateData = {
      ...body,
      updatedAt: new Date(),
    };

    // Don't allow updating certain fields
    delete updateData.id;
    delete updateData.ownerId;
    delete updateData.createdAt;

    await projectRef.update(updateData);

    const updatedDoc = await projectRef.get();

    return NextResponse.json({
      project: {
        id: updatedDoc.id,
        ...updatedDoc.data(),
      },
      message: 'Project updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project', message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Get the project
    const projectRef = adminDb.collection(COLLECTIONS.PROJECTS).doc(params.id);
    const projectDoc = await projectRef.get();

    if (!projectDoc.exists) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const projectData = projectDoc.data();

    // Only owner can delete
    if (projectData?.ownerId !== userId) {
      return NextResponse.json(
        { error: 'Only the project owner can delete the project' },
        { status: 403 }
      );
    }

    // Soft delete by setting deletedAt
    await projectRef.update({
      deletedAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project', message: error.message },
      { status: 500 }
    );
  }
}

