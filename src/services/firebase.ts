/**
 * Firebase initialization (Auth, Firestore)
 * Uses JS SDK for compatibility without native module linking
 */
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
  UserCredential,
} from 'firebase/auth';
import { env } from '@config/env';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

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

export function getFirebaseAuth(): Auth | null {
  if (auth) return auth;
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) return null;
  auth = getAuth(firebaseApp);
  return auth;
}

export async function signIn(
  email: string,
  password: string,
): Promise<UserCredential> {
  const a = getFirebaseAuth();
  if (!a) throw new Error('Firebase not configured');
  return signInWithEmailAndPassword(a, email, password);
}

export async function register(
  email: string,
  password: string,
): Promise<UserCredential> {
  const a = getFirebaseAuth();
  if (!a) throw new Error('Firebase not configured');
  return createUserWithEmailAndPassword(a, email, password);
}

export async function signOut(): Promise<void> {
  const a = getFirebaseAuth();
  if (a) await firebaseSignOut(a);
}

export function getCurrentUser(): User | null {
  const a = getFirebaseAuth();
  return a?.currentUser ?? null;
}
