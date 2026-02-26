/**
 * Auth service - login, register, persist token, map Firebase user to profile
 */
import { getFirebaseAuth, signIn as fbSignIn, register as fbRegister, signOut as fbSignOut } from './firebase';
import { storage } from '@utils/storage';
import { UserProfile } from '@models/user';
import { DEFAULT_CALORIE_TARGET } from '@constants';
import { store } from '@store';
import { setCredentials, logout as logoutAction } from '@store/slices/authSlice';

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams extends LoginParams {
  displayName?: string;
}

function mapFirebaseUserToProfile(
  uid: string,
  email: string,
  displayName?: string,
  photoURL?: string,
): UserProfile {
  return {
    id: uid,
    email: email ?? '',
    displayName: displayName ?? undefined,
    photoURL: photoURL ?? undefined,
    dailyCalorieGoal: DEFAULT_CALORIE_TARGET,
  };
}

export async function login(
  params: LoginParams,
): Promise<{ user: UserProfile; token: string }> {
  const auth = getFirebaseAuth();
  if (!auth) {
    // Demo mode: no Firebase, use mock
    const mockUser: UserProfile = {
      id: 'demo_user',
      email: params.email,
      displayName: 'Demo User',
      dailyCalorieGoal: DEFAULT_CALORIE_TARGET,
    };
    const token = 'demo_token_' + Date.now();
    await storage.setToken(token);
    store.dispatch(setCredentials({ user: mockUser, token }));
    return { user: mockUser, token };
  }
  const cred = await fbSignIn(params.email, params.password);
  const idToken = await cred.user.getIdToken();
  const user = mapFirebaseUserToProfile(
    cred.user.uid,
    cred.user.email ?? params.email,
    cred.user.displayName ?? undefined,
    cred.user.photoURL ?? undefined,
  );
  await storage.setToken(idToken);
  store.dispatch(setCredentials({ user, token: idToken }));
  return { user, token: idToken };
}

export async function register(
  params: RegisterParams,
): Promise<{ user: UserProfile; token: string }> {
  const auth = getFirebaseAuth();
  if (!auth) {
    const mockUser: UserProfile = {
      id: 'demo_user_' + Date.now(),
      email: params.email,
      displayName: params.displayName ?? 'User',
      dailyCalorieGoal: DEFAULT_CALORIE_TARGET,
    };
    const token = 'demo_token_' + Date.now();
    await storage.setToken(token);
    store.dispatch(setCredentials({ user: mockUser, token }));
    return { user: mockUser, token };
  }
  const cred = await fbRegister(params.email, params.password);
  const idToken = await cred.user.getIdToken();
  const user = mapFirebaseUserToProfile(
    cred.user.uid,
    cred.user.email ?? params.email,
    params.displayName ?? cred.user.displayName ?? undefined,
    cred.user.photoURL ?? undefined,
  );
  await storage.setToken(idToken);
  store.dispatch(setCredentials({ user, token: idToken }));
  return { user, token: idToken };
}

export async function logout(): Promise<void> {
  await fbSignOut();
  await storage.removeToken();
  store.dispatch(logoutAction());
}

export async function restoreSession(): Promise<boolean> {
  const token = await storage.getToken();
  if (!token) return false;
  const auth = getFirebaseAuth();
  if (auth?.currentUser) {
    const u = auth.currentUser;
    const user = mapFirebaseUserToProfile(
      u.uid,
      u.email ?? '',
      u.displayName ?? undefined,
      u.photoURL ?? undefined,
    );
    store.dispatch(setCredentials({ user, token }));
    return true;
  }
  if (token.startsWith('demo_token_')) {
    const mockUser: UserProfile = {
      id: 'demo_user',
      email: 'demo@calorieplus.app',
      displayName: 'Demo User',
      dailyCalorieGoal: DEFAULT_CALORIE_TARGET,
    };
    store.dispatch(setCredentials({ user: mockUser, token }));
    return true;
  }
  await storage.removeToken();
  return false;
}
