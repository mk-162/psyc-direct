import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  CollectionReference,
  DocumentReference,
  Timestamp,
} from 'firebase/firestore';
import { db } from './client';

// Generic CRUD operations

// Create a document
export async function createDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: T
): Promise<void> {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

// Get a document by ID
export async function getDocument<T extends DocumentData>(
  collectionName: string,
  id: string
): Promise<T | null> {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  const docRef = doc(db, collectionName, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as unknown as T;
  }
  return null;
}

// Update a document
export async function updateDocument<T extends Partial<DocumentData>>(
  collectionName: string,
  id: string,
  data: T
): Promise<void> {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
}

// Delete a document
export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}

// Query documents
export async function queryDocuments<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[]
): Promise<T[]> {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as unknown as T[];
}

// Collection references (for real-time subscriptions)
export function getCollectionRef(collectionName: string): CollectionReference {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  return collection(db, collectionName);
}

export function getDocumentRef(collectionName: string, id: string): DocumentReference {
  if (!db) {
    throw new Error('Firestore not initialized');
  }
  return doc(db, collectionName, id);
}

// Export query builders
export { query, where, orderBy, limit, Timestamp };
