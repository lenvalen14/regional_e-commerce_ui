import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from './api/apiSlice'
import { orderApi } from '../features/order/orderApi'
import authReducer from '../features/auth/authSlice'
import userReducer from '../features/user/userSlice'
import regionReducer from '../features/region/regionSlice'

export const store = configureStore({
  reducer: {
    api: apiSlice.reducer,
    orderApi: orderApi.reducer,
    auth: authReducer,
    user: userReducer,
    region: regionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, orderApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch