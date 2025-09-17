import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import reportSlice from './slices/reportSlice'
import notificationSlice from './slices/notificationSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    reports: reportSlice,
    notifications: notificationSlice,
    ui: uiSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
