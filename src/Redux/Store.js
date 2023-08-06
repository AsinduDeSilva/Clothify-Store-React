import { configureStore } from '@reduxjs/toolkit'
import userInfoReducer from './userInfo'

export const Store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
  },
})