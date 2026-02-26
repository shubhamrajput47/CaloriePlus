/**
 * Diet slice - recommendations and generated plans
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DietPlan, DietRecommendation } from '@models/diet';

export interface DietSliceState {
  recommendations: DietRecommendation[];
  currentPlan: DietPlan | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: DietSliceState = {
  recommendations: [],
  currentPlan: null,
  isLoading: false,
  error: null,
};

const dietSlice = createSlice({
  name: 'diet',
  initialState,
  reducers: {
    setRecommendations: (
      state,
      action: PayloadAction<DietRecommendation[]>,
    ) => {
      state.recommendations = action.payload;
      state.error = null;
    },
    setCurrentPlan: (state, action: PayloadAction<DietPlan | null>) => {
      state.currentPlan = action.payload;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearPlan: (state) => {
      state.currentPlan = null;
    },
  },
});

export const {
  setRecommendations,
  setCurrentPlan,
  setLoading,
  setError,
  clearPlan,
} = dietSlice.actions;
export default dietSlice.reducer;
