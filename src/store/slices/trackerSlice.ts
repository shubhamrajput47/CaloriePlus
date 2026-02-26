/**
 * Tracker slice - daily intake and history
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DailyIntake, FoodItem } from '@models/nutrition';

export interface TrackerSliceState {
  today: DailyIntake | null;
  history: Record<string, DailyIntake>; // date -> DailyIntake
  goalCalories: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: TrackerSliceState = {
  today: null,
  history: {},
  goalCalories: 2000,
  isLoading: false,
  error: null,
};

const getDateKey = (d: Date) =>
  d.getFullYear() +
  '-' +
  String(d.getMonth() + 1).padStart(2, '0') +
  '-' +
  String(d.getDate()).padStart(2, '0');

const trackerSlice = createSlice({
  name: 'tracker',
  initialState,
  reducers: {
    setGoalCalories: (state, action: PayloadAction<number>) => {
      state.goalCalories = action.payload;
      if (state.today) state.today.goalCalories = action.payload;
    },
    setToday: (state, action: PayloadAction<DailyIntake | null>) => {
      state.today = action.payload;
    },
    addFoodToDay: (
      state,
      action: PayloadAction<{ date: string; item: FoodItem }>,
    ) => {
      const { date, item } = action.payload;
      if (!state.history[date]) {
        state.history[date] = {
          date,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          items: [],
          goalCalories: state.goalCalories,
        };
      }
      const day = state.history[date];
      day.items.push(item);
      day.totalCalories += item.nutrition.calories;
      day.totalProtein += item.nutrition.protein;
      day.totalCarbs += item.nutrition.carbs;
      day.totalFat += item.nutrition.fat;
      if (date === getDateKey(new Date())) state.today = { ...day };
    },
    removeFoodFromDay: (
      state,
      action: PayloadAction<{ date: string; itemId: string }>,
    ) => {
      const { date, itemId } = action.payload;
      const day = state.history[date];
      if (!day) return;
      const idx = day.items.findIndex((i) => i.id === itemId);
      if (idx === -1) return;
      const item = day.items[idx];
      day.items.splice(idx, 1);
      day.totalCalories -= item.nutrition.calories;
      day.totalProtein -= item.nutrition.protein;
      day.totalCarbs -= item.nutrition.carbs;
      day.totalFat -= item.nutrition.fat;
      if (date === getDateKey(new Date())) state.today = { ...day };
    },
    setHistory: (
      state,
      action: PayloadAction<Record<string, DailyIntake>>,
    ) => {
      state.history = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setGoalCalories,
  setToday,
  addFoodToDay,
  removeFoodFromDay,
  setHistory,
  setLoading,
  setError,
} = trackerSlice.actions;
export default trackerSlice.reducer;
