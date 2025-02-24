import { configureStore } from '@reduxjs/toolkit';
import { meetingApiSlice } from './features/api/meetingApiSlice';

export const store = configureStore({
  reducer: {
    [meetingApiSlice.reducerPath]: meetingApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(meetingApiSlice.middleware),
}); 