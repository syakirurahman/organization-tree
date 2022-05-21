import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import employees from '../pages/employees/Employees.slice';

export const store = configureStore({
  reducer: {
    employees
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
