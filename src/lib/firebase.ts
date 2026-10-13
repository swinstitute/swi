import { initializeApp, getApps, getApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  collection,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth,
} from 'firebase/auth';
import { SiteContent, Course, GalleryItem, Enquiry, FirebaseSettings } from './types';

// Default Firebase Configuration (Uses env vars or default fallback)
const defaultFirebaseConfig: FirebaseSettings = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyC4MoSpQe_QsgaCoupH2dKmgHSfLrNqhXA',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'swinstitute0.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'swinstitute0',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'swinstitute0.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '310303663506',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:310303663506:web:19032cd9fed954eeaf8d4b',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export const initFirebase = (customConfig?: FirebaseSettings): {
  app: FirebaseApp | null;
  db: Firestore | null;
  auth: Auth | null;
} => {
  if (typeof window === 'undefined') return { app: null, db: null, auth: null };

  const configToUse = customConfig && customConfig.projectId ? customConfig : defaultFirebaseConfig;

  if (!configToUse.projectId || !configToUse.apiKey) {
    console.warn('Firebase: Missing projectId or apiKey. Persistence running in local mode.');
    return { app: null, db: null, auth: null };
  }

  try {
    if (!getApps().length) {
      app = initializeApp(configToUse as unknown as FirebaseOptions);
    } else {
      app = getApp();
    }
    db = getFirestore(app);
    auth = getAuth(app);
    return { app, db, auth };
  } catch (error) {
    console.error('Firebase Initialization Error:', error);
    return { app: null, db: null, auth: null };
  }
};

export const getFirebaseAuth = (): Auth | null => {
  const { auth: currentAuth } = initFirebase();
  return currentAuth;
};

export const signInAdmin = async (email: string, pass: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) return { success: false, error: 'Firebase Auth is not available' };
  try {
    const cred = await signInWithEmailAndPassword(currentAuth, email.trim(), pass);
    return { success: true, user: cred.user };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to sign in to Firebase';
    return { success: false, error: message };
  }
};

export const signOutAdmin = async (): Promise<boolean> => {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) return false;
  try {
    await signOut(currentAuth);
    return true;
  } catch {
    return false;
  }
};

export const onAdminAuthStateChanged = (callback: (user: User | null) => void): (() => void) | null => {
  const currentAuth = getFirebaseAuth();
  if (!currentAuth) return null;
  return onAuthStateChanged(currentAuth, callback);
};

/**
 * Save Site Content to Firestore Document `site/content`
 */
export const saveContentToFirebase = async (content: SiteContent, config?: FirebaseSettings): Promise<boolean> => {
  const { db } = initFirebase(config);
  if (!db) return false;

  try {
    const docRef = doc(db, 'sw_site', 'content');
    await setDoc(docRef, content, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving content to Firebase Firestore:', error);
    return false;
  }
};

/**
 * Load Site Content once from Firestore
 */
export const loadContentFromFirebase = async (config?: FirebaseSettings): Promise<SiteContent | null> => {
  const { db } = initFirebase(config);
  if (!db) return null;

  try {
    const docRef = doc(db, 'sw_site', 'content');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as SiteContent;
    }
    return null;
  } catch (error) {
    console.error('Error loading content from Firebase:', error);
    return null;
  }
};

/**
 * Subscribe to Live Realtime Changes from Firebase Firestore
 */
export const subscribeToFirebaseContent = (
  callback: (content: SiteContent) => void,
  config?: FirebaseSettings
): (() => void) | null => {
  const { db } = initFirebase(config);
  if (!db) return null;

  try {
    const docRef = doc(db, 'sw_site', 'content');
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as SiteContent);
      }
    });
  } catch (error) {
    console.error('Error subscribing to Firebase content:', error);
    return null;
  }
};

/**
 * Save Student Enquiry directly to Firestore collection `enquiries` with deterministic ID
 */
export const saveEnquiryToFirebase = async (enquiry: Enquiry, config?: FirebaseSettings): Promise<boolean> => {
  const { db } = initFirebase(config);
  if (!db) return false;

  try {
    const docRef = doc(db, 'enquiries', enquiry.id);
    await setDoc(
      docRef,
      {
        ...enquiry,
        createdAt: enquiry.timestamp || new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Error saving enquiry to Firebase:', error);
    return false;
  }
};

/**
 * Subscribe to Live Realtime Enquiries from Firebase Firestore collection `enquiries`
 */
export const subscribeToFirebaseEnquiries = (
  callback: (enquiries: Enquiry[]) => void,
  config?: FirebaseSettings
): (() => void) | null => {
  const { db } = initFirebase(config);
  if (!db) return null;

  try {
    const colRef = collection(db, 'enquiries');
    return onSnapshot(colRef, (snapshot) => {
      const list: Enquiry[] = [];
      snapshot.forEach((docItem) => {
        const data = docItem.data();
        list.push({
          id: docItem.id,
          name: data.name || '',
          phone: data.phone || '',
          email: data.email || '',
          age: data.age || '',
          course: data.course || 'Both / Not Sure',
          message: data.message || '',
          timestamp: data.timestamp || data.createdAt || new Date().toISOString(),
          status: data.status || 'New',
        });
      });

      // Sort newest first
      list.sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime() || 0;
        const timeB = new Date(b.timestamp).getTime() || 0;
        return timeB - timeA;
      });

      callback(list);
    });
  } catch (error) {
    console.error('Error subscribing to Firebase enquiries:', error);
    return null;
  }
};

/**
 * Update Enquiry Status in Firestore
 */
export const updateEnquiryStatusInFirebase = async (
  enquiryId: string,
  status: Enquiry['status'],
  config?: FirebaseSettings
): Promise<boolean> => {
  const { db } = initFirebase(config);
  if (!db) return false;

  try {
    const docRef = doc(db, 'enquiries', enquiryId);
    await setDoc(docRef, { status }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating enquiry status in Firebase:', error);
    return false;
  }
};

/**
 * Delete Enquiry from Firestore
 */
export const deleteEnquiryFromFirebase = async (
  enquiryId: string,
  config?: FirebaseSettings
): Promise<boolean> => {
  const { db } = initFirebase(config);
  if (!db) return false;

  try {
    const docRef = doc(db, 'enquiries', enquiryId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting enquiry from Firebase:', error);
    return false;
  }
};

/**
 * Unified Full Cloud Backup:
 * Writes Site Content, Courses, Gallery, and Enquiries into Firestore.
 */
export const syncAllDataToFirebase = async (
  content: SiteContent,
  courses: Course[],
  gallery: GalleryItem[],
  enquiries: Enquiry[],
  config?: FirebaseSettings
): Promise<{ success: boolean; error?: string; enquiriesCount: number }> => {
  const { db } = initFirebase(config);
  if (!db) return { success: false, enquiriesCount: 0, error: 'Firebase could not be initialized. Please verify your Project ID and API Key.' };

  try {
    // 1. Save unified content document (contains embedded courses & gallery for instant single-fetch synchronization)
    const contentRef = doc(db, 'sw_site', 'content');
    await setDoc(
      contentRef,
      {
        ...content,
        courses,
        gallery,
        lastCloudSync: new Date().toISOString(),
      },
      { merge: true }
    );

    // 2. Save dedicated courses document
    const coursesRef = doc(db, 'sw_site', 'courses');
    await setDoc(
      coursesRef,
      {
        list: courses,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // 3. Save dedicated gallery document
    const galleryRef = doc(db, 'sw_site', 'gallery');
    await setDoc(
      galleryRef,
      {
        list: gallery,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // 4. Save/backup all existing enquiries with idempotent IDs
    let count = 0;
    for (const enq of enquiries) {
      const enqDocRef = doc(db, 'enquiries', enq.id);
      await setDoc(
        enqDocRef,
        {
          ...enq,
          syncedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      count++;
    }

    return { success: true, enquiriesCount: count };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to sync all data to Firebase';
    console.error('Error in syncAllDataToFirebase:', err);
    return { success: false, enquiriesCount: 0, error: message };
  }
};
