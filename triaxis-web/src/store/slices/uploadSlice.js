import { createSlice } from "@reduxjs/toolkit"
import { logger } from "../../utils/logger"

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    formValue: {
    },
  },
  reducers: {
    removeFormValue: (state, action) => {
      logger.debug("删除上传表单数据，更新redux的状态")
      state.formValue = null;
    },
    setFormValue: (state, action) => {
      logger.debug("修改上传表单数据，更新redux的状态", action.payload)
      state.formValue = action.payload;
    },
  }
})
export const { removeFormValue, setFormValue } = uploadSlice.actions
export default uploadSlice.reducer