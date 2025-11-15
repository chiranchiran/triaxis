import service from "../../utils/api/service"

//获取验证码
export const getCaptcha = (data) => {
  return service.post('/common/captcha', data)
}
export const uploadSimple = (formData) => {
  return service.post('/common/upload', formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 3600000,
    }
  )
}
//上传


export const uploadFile = (formData, onUploadProgress, onCancel) => {
  const controller = new AbortController()
  const signal = controller.signal
  if (typeof onCancel === 'function') {
    onCancel(() => controller.abort()) // 调用 onCancel 时传入取消函数
  }

  return service.post('/upload/small', formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
      timeout: 3600000,
      signal
    }
  )
}
export const uploadChunk = (formData, onCancel) => {
  const controller = new AbortController()
  const signal = controller.signal
  if (typeof onCancel === 'function') {
    onCancel(() => controller.abort()) // 调用 onCancel 时传入取消函数
  }
  return service.post('/upload/chunk', formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 3600000,
      signal
    }
  )
}
export const merge = (data, onCancel) => {
  const controller = new AbortController()
  const signal = controller.signal
  if (typeof onCancel === 'function') {
    onCancel(() => controller.abort()) // 调用 onCancel 时传入取消函数
  }
  return service.post('/upload/merge', data,
    {
      timeout: 3600000,
      signal
    }
  )
}
export const checkFile = (data, onCancel) => {
  const controller = new AbortController()
  const signal = controller.signal
  if (typeof onCancel === 'function') {
    onCancel(() => controller.abort()) // 调用 onCancel 时传入取消函数
  }
  return service.post('/upload/check', data, { signal }
  )
}


export const checkDownloadFile = (data, onCancel) => {
  const controller = new AbortController()
  const signal = controller.signal
  if (typeof onCancel === 'function') {
    onCancel(() => controller.abort())
  }
  return service.post('/download/check', data, { signal })
}

/**
 * 下载分片
 */
export const downloadChunk = (id, index, chunkSize, onCancel) => {
  const controller = new AbortController()
  const signal = controller.signal
  if (typeof onCancel === 'function') {
    onCancel(() => controller.abort())
  }
  return service.get('/download/chunk', {
    params: { id, index, chunkSize },
    responseType: 'blob',
    timeout: 3600000,
    signal
  })
}

/**
 * 标记下载完成
 */
export const completeDownload = (data, onCancel) => {
  const controller = new AbortController()
  const signal = controller.signal
  if (typeof onCancel === 'function') {
    onCancel(() => controller.abort())
  }
  return service.post('/download/complete', data, { signal })
}