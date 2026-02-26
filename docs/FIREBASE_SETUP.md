# CaloriePlus – Firebase Setup Guide

## 1. Create a Firebase project

1. Go to [Firebase Console](https://console.firebase.google.com).
2. Click **Add project** and follow the steps.
3. Register your app: add an **iOS** and/or **Android** app (bundle ID / package name from your `app.json` and native projects).

## 2. Enable Authentication

1. In the project, go to **Build → Authentication**.
2. Click **Get started**.
3. Under **Sign-in method**, enable **Email/Password**.

## 3. Get config for React Native (JS SDK)

This app uses the **Firebase JavaScript SDK** (no native Firebase modules).

1. In Project settings (gear icon), under **Your apps**, select the **Web** app (or add one with “</>”).
2. Copy the `firebaseConfig` object.

## 4. Add config to `.env`

Map the config to our env vars:

```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789
FIREBASE_APP_ID=1:123456789:web:abc123
```

(We do not use `FIREBASE_MEASUREMENT_ID` for basic auth.)

## 5. Security rules (optional)

If you add Firestore later:

- Restrict read/write to authenticated users.
- Use `request.auth != null` and user-specific document paths.

## 6. Demo mode

If you leave Firebase env vars empty, the app still runs with **demo auth** (mock login/register and in-memory session). No Firebase project is required for development or grading.
