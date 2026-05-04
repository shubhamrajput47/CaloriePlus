/**
 * Firebase initialization (Auth, Firestore)
 * Uses JS SDK for compatibility without native module linking
 */
import { initializeApp, getApps, FirebaseApp } from '@react-native-firebase/app';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { env } from '@config/env';
import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
} from '@react-native-firebase/auth';
// import { getApps } from '@react-native-firebase/app';

let app: FirebaseApp | null = null;
let authInstance: FirebaseAuthTypes.Module | null = null;
let db: FirebaseFirestoreTypes.Module | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (app) return app;
  const { firebase: config } = env;
  if (!config.apiKey || !config.projectId) return null;
  if (getApps().length > 0) {
    app = getApps()[0] as FirebaseApp;
    return app;
  }
  app = initializeApp({
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
  });
  return app;
}
console.log('-=-=-=---shivasm', app);

export function getFirebaseAuth(): FirebaseAuthTypes.Module | null {
  // if (authInstance) return authInstance;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  authInstance = auth();
  return authInstance;
}

export function getFirestore(): FirebaseFirestoreTypes.Module | null {
  // if (db) return db;
  // const firebaseApp = getFirebaseApp();
  // console.log('-=-=-=-=-firebaseApp',firebaseApp);
  
  // if (!firebaseApp) return null;
  db = firestore();
  return db;
}

export { firestore, FirebaseFirestoreTypes, FirebaseAuthTypes };

export async function signIn(
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.UserCredential> {
  const a = getFirebaseAuth();
  if (!a) throw new Error('Firebase not configured');
  return a.signInWithEmailAndPassword(email, password);
}

export async function register(
  email: string,
  password: string,
): Promise<FirebaseAuthTypes.UserCredential> {
  const a = getFirebaseAuth();
  if (!a) throw new Error('Firebase not configured');
  return a.createUserWithEmailAndPassword(email, password);
}

export async function signOut(): Promise<void> {
  const a = getFirebaseAuth();
  if (a) await a.signOut();
}

export function getCurrentUser(): FirebaseAuthTypes.User | null {
  const app = getApp(); // 🔥 New way
    const auth = getAuth(app);
  const a = auth;
  return a?.currentUser ?? null;
}
