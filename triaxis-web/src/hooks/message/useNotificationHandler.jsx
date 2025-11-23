import { useDispatch } from "react-redux";
import { useMessage, useNotification } from "../../components/AppProvider";
import { useTranslation } from "react-i18next";

// 基础通知处理 Hook
export const useNotificationHandler = () => {
  const notification = useNotification();
  const message = useMessage();
  const { t } = useTranslation()
  // 基础成功提示
  const showSuccess = (message, description = null) => {
    if (description) {
      notification.success({
        message: t(message),
        description: description ? t(description) : undefined
      });
    } else {
      // 如果没有description，使用message.success样式的提示
      // 这里假设你的useNotification也提供了message风格的方法
      // 如果没有，可以统一使用notification
      message.success(t(message));
    }
  };

  // 基础错误提示
  const showError = (message, description = null) => {
    if (description) {
      notification.error({
        message: t(message),
        description: description ? t(description) : undefined
      });
    } else {
      message.error(t(message));
    }
  };

  // 基础警告提示
  const showWarning = (message, description = null) => {
    if (description) {
      notification.warning({
        message: t(message),
        description: description ? t(description) : undefined
      });
    } else {
      message.warning(t(message));
    }
  };

  // 基础信息提示
  const showInfo = (message, description = null) => {
    if (description) {
      notification.info({
        message: t(message),
        description: description ? t(description) : undefined
      });
    } else {
      message.info(t(message));
    }
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    // dispatch,
    // navigate
  };
};


