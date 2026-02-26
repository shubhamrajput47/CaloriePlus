# CaloriePlus – MCA Major Project Documentation

## 1. Project overview

**CaloriePlus** is an AI-based food nutrition scanner and daily calorie tracker. Users can:

- Scan or upload food images and get calorie and nutrition details (AI-backed).
- Track daily calorie intake with a simple log.
- Get diet recommendations based on current intake vs goal.
- Generate personalized diet plans.

The app is built with **React Native (CLI)**, **TypeScript**, **Redux Toolkit**, **React Navigation v6**, **Firebase** (optional), **Formik + Yup**, and chart/UI libraries. It is structured for scalability, testability, and store readiness.

## 2. Scalability

- **Feature-based folders**: Screens and logic are grouped by feature (auth, scanner, tracker, diet), making it easy to add new features or modules without touching unrelated code.
- **Redux slices**: Each domain (auth, scanner, tracker, diet) has its own slice. New domains can be added as new slices and composed in the root reducer.
- **Services layer**: API and Firebase logic live in `services/`. Backend or AI provider can be swapped by changing service implementations.
- **Absolute imports**: Path aliases (`@/`, `@components/`, etc.) keep imports stable when moving files.
- **Performance**: Memoized components, optional API caching (`useCachedNutrition`), FlatList for long lists, and image size constraints before upload reduce re-renders and payload size.

## 3. Comparison with existing apps

| Aspect        | CaloriePlus (this project)     | Typical calorie apps (e.g. MyFitnessPal) |
|---------------|--------------------------------|------------------------------------------|
| Input         | Camera/upload + AI analysis   | Manual search, barcode, manual entry     |
| AI            | Central (analyze image → nutrition) | Often limited or premium only       |
| Architecture  | Redux + feature folders       | Varies (often less modular)             |
| Auth          | Firebase or demo mode         | Often proprietary backend                |
| Diet plans    | Generated from goal + duration| Predefined or paid plans                 |
| Target        | MCA project + store-ready     | Consumer product only                    |

## 4. Limitations and assumptions

- **AI nutrition**: Real nutrition-from-image requires a backend (or third-party API). The app includes a mock analyzer when no API is configured so the flow is demonstrable without a live backend.
- **Camera**: The scanner screen currently simulates capture on unsupported environments; full Vision Camera integration requires device/permissions and is wired for production use.
- **Offline**: Tracker and diet state are in-memory (Redux). Persistence (e.g. Redux Persist or AsyncStorage sync) can be added for offline-first behavior.
- **Firebase**: Optional. Without Firebase config, the app uses demo auth so it runs and is gradable without a Firebase project.
- **Platform**: Built and tested for iOS and Android; same codebase for both.

## 5. Clean code and maintainability

- **TypeScript strict mode**: Reduces runtime errors and improves refactoring.
- **ESLint + Prettier**: Enforce style and catch common mistakes.
- **Comments**: Key files (slices, services, navigators) have short header comments describing their role.
- **Naming**: Consistent naming (slices, screens, services) and shared constants in `constants/index.ts`.

## 6. Testability

- **Unit tests**: Redux slices (e.g. authSlice) and utils (e.g. date) are tested with Jest.
- **Component tests**: React Native Testing Library for UI components (e.g. Button).
- **Mocked env**: `__tests__/__mocks__/env.ts` and Jest `moduleNameMapper` for `@env` so tests run without a real `.env`.

## 7. Build and run

- **Android**: `npm run android` (requires Android SDK and emulator or device).
- **iOS**: `cd ios && pod install && cd ..` then `npm run ios`.
- **Lint**: `npm run lint`; **TypeScript**: `npm run typecheck`; **Tests**: `npm test`.

## 8. References

- React Native: https://reactnative.dev
- Redux Toolkit: https://redux-toolkit.js.org
- React Navigation: https://reactnavigation.org
- Firebase (JS): https://firebase.google.com/docs/web/setup
