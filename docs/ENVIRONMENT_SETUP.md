# CaloriePlus – Environment Setup Guide

## Prerequisites

- **Node.js** >= 22.11.0 (see `package.json` engines)
- **React Native CLI** (project uses React Native 0.84)
- **Xcode** (for iOS) and **Android Studio** (for Android)
- **CocoaPods** (for iOS): `sudo gem install cocoapods`

## 1. Clone and install

```bash
git clone <repo-url>
cd CaloriePlus
npm install
```

## 2. Environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

- **API_BASE_URL** – Your backend base URL (e.g. `https://api.yourapp.com/v1`)
- **API_KEY** – API key for your backend
- **Firebase** – From [Firebase Console](https://console.firebase.google.com): create a project, enable Authentication (Email/Password), then copy the config into `.env`
- **NUTRITION_AI_*** – Optional; use if you have a dedicated nutrition AI endpoint

Without Firebase configured, the app runs in **demo mode** (mock login/register).

## 3. iOS

```bash
cd ios
pod install
cd ..
npm run ios
```

If you use Vision Camera, ensure camera usage is in `Info.plist` and permissions are requested at runtime.

## 4. Android

```bash
npm run android
```

Ensure `AndroidManifest.xml` has camera permission if using Vision Camera.

## 5. Scripts

| Script           | Description                |
|-----------------|----------------------------|
| `npm start`     | Start Metro bundler        |
| `npm run ios`   | Run on iOS simulator       |
| `npm run android` | Run on Android emulator |
| `npm run lint`  | Run ESLint                 |
| `npm run typecheck` | TypeScript check      |
| `npm test`      | Run Jest tests             |
| `npm run format`| Format with Prettier       |

## 6. Troubleshooting

- **Metro cache**: `npx react-native start --reset-cache`
- **Pods**: `cd ios && pod install && cd ..`
- **Build errors**: Ensure Xcode/Android Studio and SDKs are up to date.
