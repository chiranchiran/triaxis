// hooks/useBusinessHandlers.js
import { useNotificationHandler } from "./useNotificationHandler";

// 通用业务处理 Hook
export const useBusiness = () => {
  const { showSuccess, showError, showWarning, showInfo, dispatch, navigate } = useNotificationHandler();

  // 创建成功处理
  const handleCreateSuccess = (message = "创建成功", data = null) => {
    showSuccess(message);
    // 可以在这里添加通用的创建成功逻辑
    return data;
  };

  // 更新成功处理
  const handleUpdateSuccess = (message = "更新成功", data = null) => {
    showSuccess(message);
    return data;
  };

  // 删除成功处理
  const handleDeleteSuccess = (message = "删除成功", data = null) => {
    showSuccess(message);
    return data;
  };

  // 操作成功处理（通用）
  const handleOperationSuccess = (message, data = null) => {
    showSuccess(message);
    return data;
  };

  // 业务错误处理（根据错误类型显示不同提示）
  // const handleBusinessError = (error) => {
  //   if (!error) return;

  //   const { type, level = 'error', message, code } = error;

  //   switch (type) {
  //     case 'AUTH_ERROR':
  //       if (code === 11000 || code === 11001) {
  //         showInfo("请登录！", message);
  //         // 可以在这里添加跳转到登录页的逻辑
  //         setTimeout(() => navigate('/login'), 1000);
  //       } else if (code === 11002) {
  //         showWarning("权限错误！", message);
  //       } else {
  //         showError("认证错误", message);
  //       }
  //       break;

  //     case 'NETWORK_ERROR':
  //       showError("网络错误", message);
  //       break;

  //     case 'SERVER_ERROR':
  //       showError("服务器错误", message);
  //       break;

  //     case 'VALIDATION_ERROR':
  //     case 'BUSINESS_ERROR':
  //       showError(message);
  //       break;

  //     case 'USER_ERROR':
  //       showError("用户错误", message);
  //       break;

  //     case 'PAYMENT_ERROR':
  //       showError("支付失败", message);
  //       break;

  //     default:
  //       showError("未知错误", "请重试！");
  //   }
  // };

  // // 路由跳转处理
  // const handleNavigate = (path, state = {}) => {
  //   navigate(path, { state });
  // };

  // // 状态更新处理
  // const handleDispatch = (action) => {
  //   dispatch(action);
  // };

  return {
    handleCreateSuccess,
    handleUpdateSuccess,
    handleDeleteSuccess,
    handleOperationSuccess,
    // handleBusinessError,
    // handleNavigate,
    // handleDispatch
  };
};