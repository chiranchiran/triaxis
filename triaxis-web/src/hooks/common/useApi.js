import { getApiConfig } from "../../api/config"
import { useMutation, useQuery } from "@tanstack/react-query"
import queryClient from "../../utils/api/queryClient"
import { logger } from "../../utils/logger"
import { useMessage, useNotification } from "./useMessage"
import { handlePromiseError } from "../../utils/error/errorHandler"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useEffect } from "react"
export const useApi = (apiFunc, {
  queryKey = [],
  config,
  enabled = true,
  onSuccess: apiOnSuccess,
  onError: apiOnError,
  params = null,
  isMutation = false
}) => {
  //获取api配置
  const messageApi = useMessage()
  const notification = useNotification()
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const successConfig = getApiConfig(config, 'success')
  const errorConfig = getApiConfig(config, 'error')

  //默认成功处理
  const defaultOnSuccess = (data) => {
    //全局成功处理
    logger.debug("请求成功默认处理开始")
    //配置文件handler
    const handler = successConfig.handler
    if (handler && typeof handler === 'function') {
      logger.debug("成功handler开始执行", data)
      handler(data, dispatch, navigate)
    }
    //提示成功消息
    if (successConfig.showMessage) {
      if (successConfig.description) {
        notification.success({ message: successConfig.message, description: successConfig.description })
      } else {
        messageApi.success(successConfig.message)
      }
    }
    //刷新缓存
    if (isMutation) {
      queryClient.invalidateQueries({ queryKey });
    }
  }

  //默认错误处理
  const defaultOnError = (error) => {
    //根据拦截器返回的自定义error分别处理
    if (!errorConfig.noDetail) handlePromiseError(error, notification, messageApi, navigate)
    //配置文件handler
    const handler = errorConfig.handler
    if (handler && typeof handler === 'function') {
      logger.debug("失败handler开始执行", error)
      handler(error, dispatch, navigate)
    }
    //错误消息显示
    if (errorConfig.showMessage) {
      showError(error)
    }
  }
  // 根据错误级别显示不同提示
  function showError(error) {
    const { message, level = 'error' } = error
    switch (level) {
      case 'warn':
        messageApi.warning({ message })
        break
      case 'info':
        messageApi.info({ message })
        break
      default:
        messageApi.error({ message })
    }
  }
  const handleSuccess = (data) => {
    logger.debug("成功onsuccess开始执行", data)
    defaultOnSuccess(data);
    if (apiOnSuccess && typeof apiOnSuccess === 'function') {
      logger.debug("自定义成功onsuccess开始执行", data)
      apiOnSuccess(data);
    }
  };

  const handleError = (error) => {
    logger.debug("失败onerror开始执行", error)
    defaultOnError(error);
    if (apiOnError && typeof apiOnError === 'function') {
      logger.debug("自定义失败onerror开始执行", error)
      apiOnError(error);
    }
  };
  const requestResult = isMutation

    ? useMutation({
      mutationFn: (params) => apiFunc(params),
      onSuccess: handleSuccess,
      onError: handleError
    })
    : useQuery({
      queryKey,
      queryFn: () => apiFunc(params),
      enabled,
      onSuccess: handleSuccess,
      onError: handleError,
      keepPreviousData: true
    });


  // 主要的错误和成功处理通过 useEffect
  useEffect(() => {
    if (requestResult.isError && requestResult.error) {
      handleError(requestResult.error);
    }
  }, [requestResult.isError, requestResult.error]);

  useEffect(() => {
    if (requestResult.isSuccess && requestResult.data) {
      handleSuccess(requestResult.data);
    }
  }, [requestResult.isSuccess, requestResult.data]);
  return {
    ...requestResult,
    handleSuccess,
    handleError
  };

}