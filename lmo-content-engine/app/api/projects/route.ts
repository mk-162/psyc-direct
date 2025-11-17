import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb, getAdminAuth, isAdminInitialized } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';
import { normalizeUrl, validateUrl } from '@/lib/utils/url';
import { PerplexityClient } from '@/lib/ai/perplexity';

export async function GET(request: NextRequest) {
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

    // Get projects where user is owner
    const ownerSnapshot = await adminDb
      .collection(COLLECTIONS.PROJECTS)
      .where('ownerId', '==', userId)
      .limit(50)
      .get();

    // Get projects where user is an editor
    const editorSnapshot = await adminDb
      .collection(COLLECTIONS.PROJECTS)
      .where('editorIds', 'array-contains', userId)
      .limit(50)
      .get();

    // Combine and deduplicate projects
    const projectsMap = new Map();

    ownerSnapshot.docs.forEach((doc) => {
      projectsMap.set(doc.id, { id: doc.id, ...doc.data() });
    });

    editorSnapshot.docs.forEach((doc) => {
      if (!projectsMap.has(doc.id)) {
        projectsMap.set(doc.id, { id: doc.id, ...doc.data() });
      }
    });

    // Sort by createdAt descending
    const projects = Array.from(projectsMap.values()).sort(
      (a: any, b: any) => b.createdAt?.toMillis() - a.createdAt?.toMillis()
    );

    return NextResponse.json(
      { projects },
      {
        headers: {
          // Cache for 5 minutes, stale-while-revalidate for 10 minutes
          // Projects change rarely
          'Cache-Control': 'private, max-age=300, stale-while-revalidate=600',
        },
      }
    );
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', message: error.message },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store', // Don't cache errors
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const { websiteUrl, name } = body;

    if (!websiteUrl) {
      return NextResponse.json(
        { error: 'Website URL is required' },
        { status: 400 }
      );
    }

    // Normalize and validate URL
    const normalizedUrl = normalizeUrl(websiteUrl);
    if (!validateUrl(normalizedUrl)) {
      return NextResponse.json(
        { error: 'Invalid URL format', message: 'Please provide a valid HTTP or HTTPS URL' },
        { status: 400 }
      );
    }

    // Extract domain from URL
    let domain: string;
    try {
      domain = new URL(normalizedUrl).hostname.replace('www.', '');
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid URL format', message: 'Unable to parse domain from URL' },
        { status: 400 }
      );
    }

    // Create project document
    const projectRef = adminDb.collection(COLLECTIONS.PROJECTS).doc();
    const now = new Date();

    const projectData = {
      name: name || domain,
      websiteUrl: normalizedUrl,
      domain,
      status: 'initializing',
      ownerId: userId,
      editorIds: [],
      categoryTreeGenerated: false,
      stats: {
        totalCategories: 0,
        totalSubcategories: 0,
        totalQuestions: 0,
        questionsGenerated: 0,
        questionsAccepted: 0,
        questionsRejected: 0,
        averageConfidence: 0,
      },
      settings: {
        brandVoice: 'professional',
        contentDepth: 'detailed',
        factCheckThreshold: 0.7,
        autoGenerateQuestions: true,
      },
      createdAt: now,
      updatedAt: now,
      lastActivityAt: now,
    };

    await projectRef.set(projectData);

    // === START: Synchronous Research Pipeline ===
    try {
      // Update status to researching
      await projectRef.update({
        status: 'researching',
        updatedAt: new Date()
      });

      // Initialize Perplexity client and research the website
      const perplexity = new PerplexityClient();
      console.log(`🔍 Researching website: ${normalizedUrl}`);

      const researchResult = await perplexity.researchWebsite(normalizedUrl);
      console.log(`✅ Found ${researchResult.categories.length} categories`);

      // Create categories in Firestore
      const batch = adminDb.batch();
      let categoryCount = 0;

      researchResult.categories.forEach((category, index) => {
        const categoryRef = adminDb.collection(COLLECTIONS.CATEGORIES).doc();
        const slug = category.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        batch.set(categoryRef, {
          projectId: projectRef.id,
          title: category.title,
          description: category.description,
          slug,
          order: index,
          level: 0,
          parentId: null,
          generatedBy: 'perplexity',
          confidence: category.confidence,
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

        categoryCount++;
      });

      // Commit all categories
      await batch.commit();
      console.log(`✅ Created ${categoryCount} categories`);

      // Update project to active with stats
      await projectRef.update({
        status: 'active',
        categoryTreeGenerated: true,
        'stats.totalCategories': categoryCount,
        updatedAt: new Date(),
        lastActivityAt: new Date(),
      });

      console.log(`✅ Project ${projectRef.id} research completed`);
    } catch (researchError: any) {
      // If research fails, update project status to error
      console.error('Research error:', researchError);
      await projectRef.update({
        status: 'error',
        updatedAt: new Date(),
      });

      return NextResponse.json({
        project: {
          id: projectRef.id,
          ...projectData,
        },
        error: 'Research failed',
        message: researchError.message,
      }, { status: 500 });
    }
    // === END: Synchronous Research Pipeline ===

    // Fetch updated project data to return
    const updatedProject = await projectRef.get();

    return NextResponse.json({
      project: {
        id: projectRef.id,
        ...updatedProject.data(),
      },
      message: 'Project created and researched successfully',
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project', message: error.message },
      { status: 500 }
    );
  }
}
