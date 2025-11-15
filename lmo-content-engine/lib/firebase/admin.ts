import admin from 'firebase-admin';

// Check if Firebase Admin credentials are configured
const hasAdminCredentials =
  process.env.FIREBASE_ADMIN_PROJECT_ID &&
  process.env.FIREBASE_ADMIN_PROJECT_ID !== 'placeholder' &&
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
  process.env.FIREBASE_ADMIN_CLIENT_EMAIL !== 'placeholder' &&
  process.env.FIREBASE_ADMIN_PRIVATE_KEY &&
  process.env.FIREBASE_ADMIN_PRIVATE_KEY !== 'placeholder';

// Initialize Firebase Admin SDK only if credentials are available
if (!admin.apps.length && hasAdminCredentials) {
  try {
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY!.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
        privateKey: privateKey,
      }),
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Firebase admin initialization error:', error);
  }
} else if (!admin.apps.length && !hasAdminCredentials) {
  console.warn(
    '⚠️  Firebase Admin credentials not configured. API routes requiring authentication will not work.\n' +
    '   To fix: Add real Firebase Admin credentials to .env.local\n' +
    '   Get them from: Firebase Console → Project Settings → Service Accounts'
  );
}

// Helper function to check if admin is initialized (checks actual SDK state)
export function isAdminInitialized(): boolean {
  return admin.apps.length > 0;
}

// Export safe versions that can be checked before use
// These getters check the actual admin.apps state each time they're called
export function getAdminDb() {
  return isAdminInitialized() ? admin.firestore() : null;
}

export function getAdminAuth() {
  return isAdminInitialized() ? admin.auth() : null;
}

export default admin;
