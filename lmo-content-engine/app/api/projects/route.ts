import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { COLLECTIONS } from '@/lib/firebase/schema';

export async function GET(request: NextRequest) {
  try {
    // Get auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get projects where user is owner or editor
    const projectsSnapshot = await adminDb
      .collection(COLLECTIONS.PROJECTS)
      .where('ownerId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const projects = projectsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Extract domain from URL
    const domain = new URL(websiteUrl).hostname.replace('www.', '');

    // Create project document
    const projectRef = adminDb.collection(COLLECTIONS.PROJECTS).doc();
    const now = new Date();

    const projectData = {
      name: name || domain,
      websiteUrl,
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

    // TODO: Create research job
    // const jobRef = adminDb.collection(COLLECTIONS.JOBS).doc();
    // await jobRef.set({
    //   type: 'research_site',
    //   projectId: projectRef.id,
    //   ...
    // });

    return NextResponse.json({
      project: {
        id: projectRef.id,
        ...projectData,
      },
      message: 'Project created successfully',
    });
  } catch (error: any) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project', message: error.message },
      { status: 500 }
    );
  }
}
