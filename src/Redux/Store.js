import { configureStore } from '@reduxjs/toolkit'

import userInfoReducer from './userInfo'
import backendInfoReducer from './backendInfo'


export const Store = configureStore({
  reducer: {
    userInfo: userInfoReducer,
    backendInfo: backendInfoReducer, 
  },
})