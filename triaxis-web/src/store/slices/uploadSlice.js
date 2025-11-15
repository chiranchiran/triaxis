import { createSlice } from "@reduxjs/toolkit"
import { logger } from "../../utils/logger"

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    formValue: {
    },
    tasks: null
  },
  reducers: {
    removeFormValue: (state, action) => {
      logger.debug("删除上传表单数据，更新redux的状态")
      state.formValue = null;
    },
    setFormValue: (state, action) => {
      logger.debug("修改上传表单数据，更新redux的状态", action.payload)
      state.formValue = {
        ...state.formValue,
        ...action.payload
      };
    },
    setTasks: (state, action) => {
      logger.debug("修改上传表单数据，更新redux的状态", action.payload)
      state.tasks = action.payload
    },
  }
})
export const { removeFormValue, setFormValue, setTasks } = uploadSlice.actions
export default uploadSlice.reducer