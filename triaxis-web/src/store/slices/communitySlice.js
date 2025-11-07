import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { defaultAutoLogin, getLoginData, getUserData, removeAllData, setAllData, setAuthenticated, setAutoLoginData } from "../../utils/localStorage";
import { logger } from "../../utils/logger";
import { refresh } from "../../api/modules/login";
/**redux管理数据
 * params 帖子的搜索参数
 */

//用户认证相关
const communitySlice = createSlice({
  name: 'community',
  initialState: {
    params: {
      searchParams: {},
      selectedFilters: {}
    },
    isReturn: false
  },
  reducers: {
    saveSearchParams: (state, action) => {
      logger.debug("保存社区的搜索参数成功，更新redux中auth的状态", action.payload)
      state.params.searchParams = action.payload.searchParams
      state.params.selectedFilters = action.payload.selectedFilters
    },
    returnCommunity: (state, action) => {
      logger.debug("返回社区，更新redux中auth的状态", action.payload)
      state.isReturn = true
    },
    removeReturnCommunity: (state, action) => {
      logger.debug("取消返回社区，更新redux中auth的状态", action.payload)
      state.isReturn = false
    },
    // loginFailure: (state) => {
    //   logger.debug("登录失败，更新redux中auth的状态")
    //   state.isAuthenticated = false;
    //   setAuthenticated(false)
    //   removeAllData()
    // },
    // logout: (state) => {
    //   logger.debug("登出，更新redux中auth的状态")
    //   state.username = ''
    //   state.id = null
    //   state.role = null
    //   state.isAuthenticated = false
    //   state.autoLoginExpire = null
    //   state.rememberMe = false
    //   state.avatar = ""
    //   removeAllData()
    // },
    // setAutoLogin: (state, action) => {
    //   logger.debug("修改自动登录", action.payload)
    //   state.autoLoginExpire = action.payload?.autoLoginExpire || Date.now() + defaultAutoLogin
    //   state.rememberMe = action.payload?.rememberMe || null
    //   setAutoLoginData(action.payload.rememberMe, action.payload.autoLoginExpire || Date.now() + defaultAutoLogin)
    // }
  },
  // extraReducers: (builder) => {
  //   builder
  //     //refresh开始
  //     .addCase(refreshTokens.pending, (state) => {
  //       logger.debug("refresh开始，更新redux中auth的状态")
  //       state.isAuthenticated = false
  //       setAuthenticated(false)
  //     })
  //     //refresh成功
  //     .addCase(refreshTokens.fulfilled, (state, action) => {
  //       logger.debug("refresh成功，更新redux中auth的状态", action.payload)
  //       state.username = action.payload.userInfo?.username || ""
  //       state.id = action.payload.userInfo?.id || null
  //       state.role = action.payload.userInfo?.role || null
  //       state.isAuthenticated = true
  //       state.avatar = action.payload.userInfo?.avatar || ""
  //       setAuthenticated(true)
  //       setAllData(action.payload)
  //     })
  //     //refresh失败
  //     .addCase(refreshTokens.rejected, (state) => {
  //       logger.debug("refresh失败，更新redux中auth的状态")
  //       state.username = ''
  //       state.id = null
  //       state.role = null
  //       state.isAuthenticated = false
  //       state.autoLoginExpire = null
  //       state.rememberMe = false
  //       state.avatar = ""
  //       removeAllData()
  //     })
  // }
})

export const { saveSearchParams, returnCommunity, removeReturnCommunity } = communitySlice.actions
export default communitySlice.reducer