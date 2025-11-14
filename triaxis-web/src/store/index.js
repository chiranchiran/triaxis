import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './slices/authSlice'
import communitySliceReducer from './slices/communitySlice'
import userCenterSliceReducer from './slices/userCenterSlice'
import uploadSliceReducer from './slices/uploadSlice'
import storageSession from 'redux-persist/lib/storage/session'
import persistReducer from "redux-persist/es/persistReducer";
import storage from 'redux-persist/lib/storage';
import persistStore from "redux-persist/es/persistStore";

// 配置persist
const authConfig = {
  key: 'persist-auth',
  storage: storage,
};
const communityConfig = {
  key: 'persist-community',
  storage: storageSession,
};
const userCenterConfig = {
  key: 'persist-userCenter',
  storage: storageSession,
};
const uploadConfig = {
  key: 'persist-upload',
  storage: storageSession,
};

//包装reducer
const authReducer = persistReducer(authConfig, authSliceReducer);
const communityReducer = persistReducer(communityConfig, communitySliceReducer);
const userCenterReducer = persistReducer(userCenterConfig, userCenterSliceReducer);
const uploadReducer = persistReducer(uploadConfig, uploadSliceReducer);


export const store = configureStore({
  reducer: {
    auth: authReducer,
    community: communityReducer,
    userCenter: userCenterReducer,
    upload: uploadReducer
  },
  // 忽略persist相关action的序列化检查
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER']
      }
    })
})

// 创建persistor（单个即可，会处理所有持久化的reducer）
export const persistor = persistStore(store);