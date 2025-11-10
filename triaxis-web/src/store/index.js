import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './slices/authSlice'
import communitySliceReducer from './slices/communitySlice'
import userCenterSliceReducer from './slices/userCenterSlice'


export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    community: communitySliceReducer,
    userCenter: userCenterSliceReducer,
  }
})
