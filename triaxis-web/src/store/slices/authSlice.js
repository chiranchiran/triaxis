import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { defaultAutoLogin, getLoginData, getUserData, removeAllData, setAllData, setAuthenticated, setAutoLoginData } from "../../utils/localStorage";
import { logger } from "../../utils/logger";
import { refresh } from "../../api/modules/login";
/**redux管理数据
 * id
 * uername
 * avatar
 * role
 * rememberMe
 * autoLoginExpire
 * isAuthenticated
 */
//refreshToken获得最新的accessToekn
export const refreshTokens = createAsyncThunk('auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const { refreshToken } = getLoginData()
      if (!refreshToken) {
        logger.warn("没有refreshToken")
        return rejectWithValue('没有刷新令牌')
      }
      const res = await refresh()
      return res
    } catch (error) {
      return rejectWithValue(error.message || '登录失败')
    }
  }
)
// 从本地存储恢复状态的辅助函数
const getInitialStateFromStorage = () => {
  const userInfo = getUserData() || {};

  return {
    username: userInfo?.username || '',
    id: userInfo?.id || null,
    role: userInfo?.role || null,
    rememberMe: userInfo?.rememberMe || false,
    autoLoginExpire: userInfo?.autoLoginExpire || null,
    isAuthenticated: userInfo?.isAuthenticated || false,
    avatar: userInfo?.avatar || ""
  }
}
const initialState = getInitialStateFromStorage()
//用户认证相关
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      logger.debug("登录成功，更新redux中auth的状态", action.payload)
      state.isAuthenticated = true
      state.username = action.payload.userInfo?.username || ''
      state.id = action.payload.userInfo?.id || null
      state.role = action.payload.userInfo?.role || null
      state.avatar = action.payload.userInfo?.avatar || ""
      setAuthenticated(true)
      setAllData(action.payload)
    },
    loginFailure: (state) => {
      logger.debug("登录失败，更新redux中auth的状态")
      state.isAuthenticated = false;
      setAuthenticated(false)
      removeAllData()
    },
    logout: (state) => {
      logger.debug("登出，更新redux中auth的状态")
      state.username = ''
      state.id = null
      state.role = null
      state.isAuthenticated = false
      state.autoLoginExpire = null
      state.rememberMe = false
      state.avatar = ""
      removeAllData()
    },
    setAutoLogin: (state, action) => {
      logger.debug("修改自动登录", action.payload)
      state.autoLoginExpire = action.payload?.autoLoginExpire || Date.now() + defaultAutoLogin
      state.rememberMe = action.payload?.rememberMe || null
      setAutoLoginData(action.payload.rememberMe, action.payload.autoLoginExpire || Date.now() + defaultAutoLogin)
    }
  },
  extraReducers: (builder) => {
    builder
      //refresh开始
      .addCase(refreshTokens.pending, (state) => {
        logger.debug("refresh开始，更新redux中auth的状态")
        state.isAuthenticated = false
        setAuthenticated(false)
      })
      //refresh成功
      .addCase(refreshTokens.fulfilled, (state, action) => {
        logger.debug("refresh成功，更新redux中auth的状态", action.payload)
        state.username = action.payload.userInfo?.username || ""
        state.id = action.payload.userInfo?.id || null
        state.role = action.payload.userInfo?.role || null
        state.isAuthenticated = true
        state.avatar = action.payload.userInfo?.avatar || ""
        setAuthenticated(true)
        setAllData(action.payload)
      })
      //refresh失败
      .addCase(refreshTokens.rejected, (state) => {
        logger.debug("refresh失败，更新redux中auth的状态")
        state.username = ''
        state.id = null
        state.role = null
        state.isAuthenticated = false
        state.autoLoginExpire = null
        state.rememberMe = false
        state.avatar = ""
        removeAllData()
      })
  }
})

export const { logout, loginSuccess, loginFailure, setAutoLogin } = authSlice.actions
export default authSlice.reducer