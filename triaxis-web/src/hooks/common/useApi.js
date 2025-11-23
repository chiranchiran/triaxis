import { getApiConfig } from "../../api/config"
import { useMutation, useQuery } from "@tanstack/react-query"
import queryClient from "../../utils/api/queryClient"
import { logger } from "../../utils/logger"
import { handlePromiseError } from "../../utils/error/errorHandler"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { useMessage, useNotification } from "../../components/AppProvider"
import { httpPool } from "../../utils/api/HttpPool"
// export function useApi(apiFunc, {
//   queryKey = [],
//   config,
//   enabled = true,
//   onSuccess: apiOnSuccess,
//   onError: apiOnError,
//   params = null,
//   isMutation = false
// }) {
//   //获取api配置
//   const messageApi = useMessage()
//   const notificationApi = useNotification()
//   const navigate = useNavigate();
//   const dispatch = useDispatch()
//   const successConfig = getApiConfig(config, 'success')
//   const errorConfig = getApiConfig(config, 'error')

//   //默认成功处理
//   const defaultOnSuccess = (data) => {
//     //全局成功处理
//     logger.debug("请求成功默认处理开始")
//     //配置文件handler
//     const handler = successConfig.handler
//     if (handler && typeof handler === 'function') {
//       logger.debug("成功handler开始执行", data)
//       handler(data, dispatch, navigate)
//     }
//     //提示成功消息
//     if (successConfig.showMessage) {
//       if (successConfig.description) {
//         notificationApi.success({ message: successConfig.message, description: successConfig.description })
//       } else {
//         messageApi.success(successConfig.message)
//       }
//     }
//     //刷新缓存
//     if (isMutation) {
//       queryClient.invalidateQueries({ queryKey });
//     }
//   }

//   //默认错误处理
//   const defaultOnError = (error) => {
//     //根据拦截器返回的自定义error分别处理
//     handlePromiseError(error, !errorConfig.noDetail, notificationApi, messageApi, navigate)
//     //配置文件handler
//     const handler = errorConfig.handler
//     if (handler && typeof handler === 'function') {
//       logger.debug("失败handler开始执行", error)
//       handler(error, dispatch, navigate)
//     }
//     //错误消息显示
//     if (errorConfig.showMessage) {
//       messageApi.error(errorConfig.message)
//     }
//   }
//   const handleSuccess = (data) => {
//     logger.debug("成功onsuccess开始执行", data)
//     defaultOnSuccess(data);
//     if (apiOnSuccess && typeof apiOnSuccess === 'function') {
//       logger.debug("自定义成功onsuccess开始执行", data)
//       apiOnSuccess(data);
//     }
//   };

//   const handleError = (error) => {
//     logger.debug("失败onerror开始执行", error)
//     defaultOnError(error);
//     if (apiOnError && typeof apiOnError === 'function') {
//       logger.debug("自定义失败onerror开始执行", error)
//       apiOnError(error);
//     }
//   };
//   const requestResult = isMutation

//     ? useMutation({
//       mutationFn: apiFunc,
//       cancelPrevious: false,
//       onSuccess: handleSuccess,
//       onError: handleError
//     })
//     : useQuery({
//       queryKey,
//       queryFn: () => apiFunc(params),
//       enabled,
//       keepPreviousData: true
//     });


//   // useQuery通过 useEffect
//   useEffect(() => {
//     if (!isMutation && requestResult.isError && requestResult.error) {
//       handleError(requestResult.error);
//     }
//   }, [requestResult.isError, requestResult.error]);

//   useEffect(() => {
//     if (!isMutation && requestResult.isSuccess && requestResult.data) {
//       handleSuccess(requestResult.data);
//     }
//   }, [requestResult.isSuccess, requestResult.data]);
//   return {
//     ...requestResult,
//     handleSuccess,
//     handleError
//   };

// }
export function useApi(apiFunc, {
  queryKey = [],
  params = null,
  enabled = true,
  onSuccess,
  onError,
  config = { onSuccess: [], onError: [] },
  isMutation = false,
  enableRequestPool = true // 是否启用请求池
}) {
  const notificationApi = useNotification();
  console.log(onSuccess, enabled)

  // 生成请求的唯一标识
  const generateRequestId = (vars) => {
    const funcName = apiFunc.name || 'anonymous';
    // Query 用 params，Mutation 用 variables，确保不同参数不重复
    const paramsOrVars = isMutation ? vars : params;
    const paramsStr = paramsOrVars ? JSON.stringify(paramsOrVars) : '';
    return `api_${funcName}_${paramsStr}`;
  };

  let isDuplicate = false;
  // 封装 API 调用，集成请求池
  const wrappedApiFunc = async (variables) => {
    const requestId = generateRequestId(variables); // 传入 variables
    // 创建控制器
    const controller = new AbortController();

    // 添加到请求池：关键修正2：requestKey → requestId（之前拼写错误）
    if (enableRequestPool) {
      const added = httpPool.addRequest(requestId, controller);
      isDuplicate = !added;
    }
    if (isDuplicate) {
      const error = new Error('重复请求已取消');
      error.isCanceled = true;
      error.type = 'duplicate';
      throw error;
    }
    try {
      let result;

      if (isMutation) {
        // Mutation: 调用 API 函数并传入变量
        result = await apiFunc({
          ...variables,
          signal: controller.signal
        });
      } else {
        // Query: 调用 API 函数并传入参数
        result = await apiFunc({
          ...params,
          signal: controller.signal
        });
      }

      return result;
    } catch (error) {
      // 捕获 AbortError（取消请求的错误），标记 isCanceled
      if (error.name === 'AbortError' || error.isCanceled) {
        error.isCanceled = true;
        error.type = 'cancel';
      }
      error.requestId = requestId;
      return Promise.reject(error) // 抛给 React Query 处理
    } finally {
      // 请求完成，从池中移除
      if (enableRequestPool) {
        httpPool.completeRequest(requestId);
      }
    }
  };

  // 处理成功回调
  const handleSuccess = (data, variables, context) => {
    logger.debug("react queryAPI请求成功", data);
    if (isMutation) {
      queryClient.invalidateQueries({ queryKey });
    }
    // 调用用户自定义的成功处理函数
    if (onSuccess && typeof onSuccess === 'function') {
      onSuccess(data, variables, context);
    }
    if (config.onSuccess) {
      config.onSuccess.forEach(i => {
        i(data, variables, context);
      });
    }
  };

  // 处理错误回调
  const handleError = (error, variables, context) => {
    // 如果是重复请求跳过，不执行错误回调
    if (error.isCanceled) {
      logger.debug("重复请求已跳过，不执行错误处理");
      return;
    }

    logger.debug("react queryAPI请求失败");
    handlePromiseError(error, notificationApi)
    // 调用用户自定义的错误处理函数
    if (onError && typeof onError === 'function') {
      onError(error, variables, context);
    }
    if (config.onError) {
      config.onError.forEach(i => {
        i(error, variables, context);
      });
    }
  };

  // Mutation 配置
  const mutationConfig = {
    mutationFn: wrappedApiFunc,
    onSuccess: handleSuccess,
    onError: handleError
  };
  // Query 配置
  const queryConfig = {
    queryKey,
    queryFn: wrappedApiFunc,
    enabled,
  };

  // 使用 React Query
  const requestResult = isMutation
    ? useMutation(mutationConfig)
    : useQuery(queryConfig);

  // useQuery通过 useEffect
  useEffect(() => {
    if (!isMutation && requestResult.isError && requestResult.error) {

      handleError(requestResult.error);
    }
  }, [requestResult.isError, requestResult.error]);

  useEffect(() => {
    if (!isMutation && requestResult.isSuccess && requestResult.data) {
      handleSuccess(requestResult.data);
    }
  }, [requestResult.isSuccess, requestResult.data]);
  //卸载取消请求
  useEffect(() => {
    return () => {
      // 从 requestResult 中拿 variables，生成对应的 requestId
      const vars = isMutation ? requestResult.variables : params;
      const requestId = generateRequestId(vars);
      if (enableRequestPool && requestId) {
        httpPool.cancelRequest(requestId);
      }
    };
  }, [requestResult.variables, enableRequestPool, isMutation, params]);
  // 监听状态变化
  useEffect(() => {
    console.log('📊 Query 状态变化', {
      isError: requestResult.isError,
      error: requestResult.error,
      isSuccess: requestResult.isSuccess,
      data: requestResult.data
    });
  }, [requestResult.isError, requestResult.error, requestResult.isSuccess, requestResult.data]);
  // 暴露取消方法给组件（关键：让组件能手动取消）
  const cancelCurrentRequest = () => {
    if (enableRequestPool && !isDuplicate) {
      httpPool.cancelRequest(requestId);
    }
  };

  return requestResult;
}