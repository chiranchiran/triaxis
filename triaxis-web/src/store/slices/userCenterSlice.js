import { createSlice } from "@reduxjs/toolkit"
import { logger } from "../../utils/logger"

const userCenterSlice = createSlice({
  name: 'userCenter',
  initialState: {
    // userActiveKey: null,
    messageCount: {
      'total': 0,
      'chat': 0,
      'like': 0,
      'collect': 0,
      'review': 0,
      'system': 0
    },
    websocketStatus: 2
  },
  reducers: {
    // setUserActiveKey: (state, action) => {
    //   logger.debug("修改用户中心活动标签，更新redux中auth的状态", action.payload)
    //   state.userActiveKey = action.payload
    // },
    // removeUserActiveKey: (state, action) => {
    //   logger.debug("修改用户中心活动标签，更新redux中auth的状态", action.payload)
    //   state.userActiveKey = null
    // },
    setMessageCount: (state, action) => {
      logger.debug("修改用户中心消息数量，更新redux中auth的状态", action.payload)
      const updatedSubCounts = {
        ...state.messageCount,
        ...action.payload
      };
      updatedSubCounts.total = updatedSubCounts.chat +
        updatedSubCounts.like +
        updatedSubCounts.collect +
        updatedSubCounts.review + updatedSubCounts.system;
      state.messageCount = updatedSubCounts;
    },
    setWebsocketStatus: (state, action) => {
      state.websocketStatus = action.payload
    }

  }
})
export const { setMessageCount, setWebsocketStatus } = userCenterSlice.actions
export default userCenterSlice.reducer