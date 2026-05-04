/**
 * Scanner slice - food scan/upload state and last result
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FoodItem } from '@models/nutrition';

export interface ScannerSliceState {
  lastScannedItem: FoodItem | null;
  recognizedLabels: string[];
  visionConfidence: number;
  isAnalyzing: boolean;
  error: string | null;
  imageUri: string | null;
}

const initialState: ScannerSliceState = {
  lastScannedItem: null,
  recognizedLabels: [],
  visionConfidence: 0,
  isAnalyzing: false,
  error: null,
  imageUri: null,
};

const scannerSlice = createSlice({
  name: 'scanner',
  initialState,
  reducers: {
    setImageUri: (state, action: PayloadAction<string | null>) => {
      state.imageUri = action.payload;
      state.error = null;
    },
    setAnalyzing: (state, action: PayloadAction<boolean>) => {
      state.isAnalyzing = action.payload;
      if (action.payload) state.error = null;
    },
    setScanResult: (state, action: PayloadAction<FoodItem | null>) => {
      state.lastScannedItem = action.payload;
      state.isAnalyzing = false;
      state.error = null;
    },
    setVisionResult: (
      state,
      action: PayloadAction<{ labels: any; confidence: number }>,
    ) => {
      state.recognizedLabels = action.payload.labels;
      state.visionConfidence = action.payload.confidence;
      state.isAnalyzing = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isAnalyzing = false;
    },
    clearScan: () => initialState,
  },
});

export const {
  setImageUri,
  setAnalyzing,
  setScanResult,
  setVisionResult,
  setError,
  clearScan,
} = scannerSlice.actions;
export default scannerSlice.reducer;
