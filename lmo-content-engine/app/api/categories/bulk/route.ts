import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase/admin';
import { auth } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/schema';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
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

    // Verify the token using the client auth (server-side verification)
    let decodedToken;
    try {
      const { auth: clientAuth } = await import('@/lib/firebase/config');
      const userCredential = await clientAuth.signInWithCustomToken(idToken);
      decodedToken = { uid: userCredential.user.uid };
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const userId = decodedToken.uid;

    // Parse request body
    const body = await request.json();
    const {
      categoryIds,
      action,
      projectId,
    } = body as {
      categoryIds: string[];
      action: 'generateSubcategories' | 'generateQuestions' | 'archive' | 'delete' | 'export';
      projectId: string;
    };

    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return NextResponse.json(
        { error: 'Category IDs are required' },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const adminDb = getAdminDb();
    if (!adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }

    // Verify project ownership
    const projectDoc = await adminDb.collection(COLLECTIONS.PROJECTS).doc(projectId).get();
    if (!projectDoc.exists) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const projectData = projectDoc.data();
    if (projectData?.ownerId !== userId && !projectData?.editorIds?.includes(userId)) {
      return NextResponse.json(
        { error: 'Unauthorized - You do not have access to this project' },
        { status: 403 }
      );
    }

    // Execute the bulk action
    let result;
    switch (action) {
      case 'generateSubcategories':
        result = await handleGenerateSubcategories(categoryIds, projectId, userId);
        break;
      case 'generateQuestions':
        result = await handleGenerateQuestions(categoryIds, projectId, userId);
        break;
      case 'archive':
        result = await handleArchive(categoryIds, projectId);
        break;
      case 'delete':
        result = await handleDelete(categoryIds, projectId);
        break;
      case 'export':
        result = await handleExport(categoryIds, projectId);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Bulk category operation error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to perform bulk operation',
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

async function handleGenerateSubcategories(
  categoryIds: string[],
  projectId: string,
  userId: string
) {
  const adminDb = getAdminDb()!;
  const batch = adminDb.batch();
  const jobIds: string[] = [];

  for (const categoryId of categoryIds) {
    // Create a job for each category
    const jobRef = adminDb.collection(COLLECTIONS.JOBS).doc();
    batch.set(jobRef, {
      type: 'generate_subcategories',
      status: 'queued',
      projectId,
      categoryId,
      userId,
      input: { categoryId },
      progress: 0,
      processedCount: 0,
      totalCount: 1,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    jobIds.push(jobRef.id);
  }

  await batch.commit();

  return {
    success: true,
    message: `Created ${jobIds.length} subcategory generation jobs`,
    jobIds,
  };
}

async function handleGenerateQuestions(
  categoryIds: string[],
  projectId: string,
  userId: string
) {
  const adminDb = getAdminDb()!;
  const batch = adminDb.batch();
  const jobIds: string[] = [];

  for (const categoryId of categoryIds) {
    // Create a job for each category
    const jobRef = adminDb.collection(COLLECTIONS.JOBS).doc();
    batch.set(jobRef, {
      type: 'generate_questions',
      status: 'queued',
      projectId,
      categoryId,
      userId,
      input: { categoryId },
      progress: 0,
      processedCount: 0,
      totalCount: 1,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    jobIds.push(jobRef.id);
  }

  await batch.commit();

  return {
    success: true,
    message: `Created ${jobIds.length} question generation jobs`,
    jobIds,
  };
}

async function handleArchive(categoryIds: string[], projectId: string) {
  const adminDb = getAdminDb()!;
  const batch = adminDb.batch();

  for (const categoryId of categoryIds) {
    const categoryRef = adminDb.collection(COLLECTIONS.CATEGORIES).doc(categoryId);
    batch.update(categoryRef, {
      status: 'archived',
      archivedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  await batch.commit();

  return {
    success: true,
    message: `Archived ${categoryIds.length} categories`,
    count: categoryIds.length,
  };
}

async function handleDelete(categoryIds: string[], projectId: string) {
  const adminDb = getAdminDb()!;
  const batch = adminDb.batch();

  for (const categoryId of categoryIds) {
    // Soft delete by adding deletedAt timestamp
    const categoryRef = adminDb.collection(COLLECTIONS.CATEGORIES).doc(categoryId);
    batch.update(categoryRef, {
      deletedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // Also mark subcategories as deleted
    const subcategoriesSnapshot = await adminDb
      .collection(COLLECTIONS.SUBCATEGORIES)
      .where('categoryId', '==', categoryId)
      .get();

    subcategoriesSnapshot.docs.forEach((doc) => {
      batch.update(doc.ref, {
        deletedAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
  }

  await batch.commit();

  return {
    success: true,
    message: `Deleted ${categoryIds.length} categories`,
    count: categoryIds.length,
  };
}

async function handleExport(categoryIds: string[], projectId: string) {
  const adminDb = getAdminDb()!;
  const categories: any[] = [];

  for (const categoryId of categoryIds) {
    const categoryDoc = await adminDb.collection(COLLECTIONS.CATEGORIES).doc(categoryId).get();
    if (categoryDoc.exists) {
      const categoryData = categoryDoc.data();

      // Get subcategories
      const subcategoriesSnapshot = await adminDb
        .collection(COLLECTIONS.SUBCATEGORIES)
        .where('categoryId', '==', categoryId)
        .get();

      const subcategories = subcategoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      categories.push({
        id: categoryDoc.id,
        ...categoryData,
        subcategories,
      });
    }
  }

  return {
    success: true,
    data: categories,
    format: 'json',
    count: categories.length,
  };
}
