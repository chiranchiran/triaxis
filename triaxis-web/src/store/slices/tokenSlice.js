import { createSlice } from "@reduxjs/toolkit"
import { logger } from "../../utils/logger"

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    formValue: {
    },
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
    setFormValue: (state, action) => {
      logger.debug("修改上传表单数据，更新redux的状态", action.payload)
      state.formValue = action.payload;
    },
  }
})
export const { setMessageCount } = uploadSlice.actions
export default uploadSlice.reducer