import { createSlice } from "@reduxjs/toolkit"
import { logger } from "../../utils/logger"

const userCenterSlice = createSlice({
  name: 'userCenter',
  initialState: {
    userActiveKey: null
  },
  reducers: {
    setUserActiveKey: (state, action) => {
      logger.debug("修改用户中心活动标签，更新redux中auth的状态", action.payload)
      state.userActiveKey = action.payload.userActiveKey
    },
    removeUserActiveKey: (state, action) => {
      logger.debug("修改用户中心活动标签，更新redux中auth的状态", action.payload)
      state.userActiveKey = null
    }
  }
})
export const { setUserActiveKey, removeUserActiveKey } = userCenterSlice.actions
export default userCenterSlice.reducer