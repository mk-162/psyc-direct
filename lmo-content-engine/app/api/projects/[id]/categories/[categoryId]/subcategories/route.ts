import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth, isAdminInitialized } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';
import { PerplexityClient } from '@/lib/ai/perplexity';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; categoryId: string } }
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

    // Get the category
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

    // Verify category belongs to this project
    if (categoryData?.projectId !== params.id) {
      return NextResponse.json(
        { error: 'Category does not belong to this project' },
        { status: 400 }
      );
    }

    // Generate subcategories using Perplexity
    console.log(`🔍 Generating subcategories for: ${categoryData.title}`);
    const perplexity = new PerplexityClient();
    const result = await perplexity.generateSubcategories(
      categoryData.title,
      categoryData.description,
      projectData.websiteUrl
    );

    console.log(`✅ Generated ${result.subcategories.length} subcategories`);

    // Create subcategories in Firestore
    const batch = adminDb.batch();
    const now = new Date();
    let subcategoryCount = 0;

    result.subcategories.forEach((subcategory, index) => {
      const subcategoryRef = adminDb.collection(COLLECTIONS.CATEGORIES).doc();
      const slug = subcategory.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      batch.set(subcategoryRef, {
        projectId: params.id,
        title: subcategory.title,
        description: subcategory.description,
        slug,
        order: index,
        level: (categoryData.level || 0) + 1,
        parentId: params.categoryId,
        generatedBy: 'perplexity',
        confidence: subcategory.confidence,
        isExpanded: false,
        hasSubcategories: false,
        subcategoryCount: 0,
        stats: {
          totalQuestions: 0,
          questionsGenerated: 0,
          questionsAccepted: 0,
        },
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
      });

      subcategoryCount++;
    });

    // Update parent category
    const categoryRef = adminDb.collection(COLLECTIONS.CATEGORIES).doc(params.categoryId);
    batch.update(categoryRef, {
      hasSubcategories: true,
      subcategoryCount,
      isExpanded: true,
      updatedAt: now,
    });

    // Commit all changes
    await batch.commit();

    // Update project stats
    const currentTotalSubcategories = projectData.stats?.totalSubcategories || 0;
    await adminDb.collection(COLLECTIONS.PROJECTS).doc(params.id).update({
      'stats.totalSubcategories': currentTotalSubcategories + subcategoryCount,
      updatedAt: now,
      lastActivityAt: now,
    });

    console.log(`✅ Created ${subcategoryCount} subcategories`);

    return NextResponse.json({
      message: 'Subcategories generated successfully',
      count: subcategoryCount,
    });
  } catch (error: any) {
    console.error('Error generating subcategories:', error);
    return NextResponse.json(
      { error: 'Failed to generate subcategories', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; categoryId: string } }
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

    // Get subcategories
    const subcategoriesSnapshot = await adminDb
      .collection(COLLECTIONS.CATEGORIES)
      .where('projectId', '==', params.id)
      .where('parentId', '==', params.categoryId)
      .get();

    const subcategories = subcategoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort by order field
    subcategories.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    return NextResponse.json(
      { subcategories },
      {
        headers: {
          // Cache for 3 minutes, stale-while-revalidate for 5 minutes
          'Cache-Control': 'private, max-age=180, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching subcategories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subcategories', message: error.message },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store', // Don't cache errors
        },
      }
    );
  }
}
