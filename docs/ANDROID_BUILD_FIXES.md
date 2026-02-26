# Android Build Fixes Applied

## Issue: Codegen error with react-native-screens

React Native 0.82's codegen does not support `UnionTypeAnnotation` in event props (e.g. `DirectEventHandler<X> | null`) emitted by **react-native-screens** 4.23, causing:

```
Error: Received invalid event property type UnionTypeAnnotation
```

## Fixes applied

### 1. react-native-screens (source patches)

- **SearchBarNativeComponent.ts**: Removed `| null` from event handler props (`onSearchFocus`, `onSearchBlur`, etc.).
- **BottomTabsScreenNativeComponent.ts**: Removed `| null` and `| undefined | null` from color and title props.

These edits are in `node_modules/react-native-screens/src/`. After a fresh `npm install`, re-apply them or use the `patches/` folder with `patch-package` (run `npx patch-package react-native-screens` to regenerate the patch).

### 2. @react-native/codegen (node_modules patch)

The following files under `node_modules/react-native/node_modules/@react-native/codegen/lib/generators/components/` were patched to handle `UnionTypeAnnotation` so the build succeeds even if a library emits it:

- **GenerateEventEmitterCpp.js**: Added a `case 'UnionTypeAnnotation'` that treats the union as the member type (or `StringTypeAnnotation` if missing).
- **GenerateEventEmitterH.js**: Added `case 'UnionTypeAnnotation'` returning the string type and skipping struct generation.

**Important:** These codegen changes live under `node_modules`. They will be lost on a full reinstall (`rm -rf node_modules && npm install`). To persist them you can:

1. Run `npx patch-package react-native` after applying the edits (this will create `patches/react-native+0.82.0.patch`), or  
2. Re-apply the same edits to the two files above after each install.

## Result

- `npm run android` completes successfully.
- APK installs on device/emulator (e.g. "Installed on 1 device").
- First build may take several minutes (codegen + native compile).

## Re-running the build

```bash
npm run android
```

Or only build and install the APK:

```bash
cd android && ./gradlew app:installDebug -PreactNativeDevServerPort=8081 && cd ..
```

Ensure an Android emulator is running or a device is connected with USB debugging enabled.
