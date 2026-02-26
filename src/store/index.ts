/**
 * Redux store - CaloriePlus
 * Single store with auth, scanner, tracker, diet slices
 */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import scannerReducer from './slices/scannerSlice';
import trackerReducer from './slices/trackerSlice';
import dietReducer from './slices/dietSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    scanner: scannerReducer,
    tracker: trackerReducer,
    diet: dietReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        ignoredPaths: ['scanner.lastScannedItem'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
