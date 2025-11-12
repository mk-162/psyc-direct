import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  User,
  UserCredential,
} from 'firebase/auth';
import { auth } from './client';

// Sign up with email and password
export async function signUpWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Sign in with email and password
export async function signInWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Sign in with Google
export async function signInWithGoogle(): Promise<UserCredential> {
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }
  const provider = new GoogleAuthProvider();
  try {
    const userCredential = await signInWithPopup(auth, provider);
    return userCredential;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Sign out
export async function signOut(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Send password reset email
export async function resetPassword(email: string): Promise<void> {
  if (!auth) {
    throw new Error('Firebase auth not initialized');
  }
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Get current user
export function getCurrentUser(): User | null {
  if (!auth) {
    return null;
  }
  return auth.currentUser;
}
