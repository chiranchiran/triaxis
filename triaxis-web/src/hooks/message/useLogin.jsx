// hooks/useAuthHandlers.js
import { useNotificationHandler } from "./useNotificationHandler";
import { loginSuccess, loginFailure, logout } from "../../store/slices/authSlice";
import { useNotification } from "../../components/AppProvider";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useGoLogin } from "../api/login";
import { generateSafeState } from "../../utils/commonUtil";

// 认证处理 Hook
export const useLogin = () => {
  const { showSuccess, showError } = useNotificationHandler();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutateAsync: doGoLogin } = useGoLogin()
  const pathname = useLocation().pathname
  const goLogin = async () => {
    const state = generateSafeState();
    await doGoLogin({ state })

    // dispatch(setLoginState(state))
    const redirectUri = '/sso/callback';
    navigate(`/login?state=${state}&redirectUri=${redirectUri}&originalPath=${pathname}`)
  }

  // 登录成功处理
  const handleLoginSuccess = (data) => {
    showSuccess("登录成功", "欢迎使用Triaxis~");
    dispatch(loginSuccess(data));

  };

  // 登录错误处理
  const handleLoginError = (error) => {
    // 登录失败通常不需要显示具体错误信息，由组件处理
    showError("登录失败", error.message);
    dispatch(loginFailure());
  };

  // 自动登录成功处理
  const handleAutoLoginSuccess = (data) => {
    dispatch(loginSuccess(data));
    // 自动登录成功不显示提示
  };

  // 自动登录错误处理
  const handleAutoLoginError = (error) => {
    // 自动登录失败不显示提示，静默处理
    dispatch(logout()); // 根据需求决定是否要登出
  };

  // 验证码发送成功处理
  const handleCaptchaSuccess = (data) => {
    showSuccess('验证码已发送至您的手机，请注意查收（5分钟内有效）', data);
    // 如果需要更新验证码相关信息，可以在这里处理
  };
  const handleCaptchaError = (error) => {
    showError('验证码获取失败！）', error.message);
    // 如果需要更新验证码相关信息，可以在这里处理
  };
  // 注册成功处理
  const handleRegisterSuccess = (data) => {
    showSuccess("注册成功", "请使用注册的账户登录");
    // 注册成功后可以跳转到登录页
    goLogin()
  };

  // 注册错误处理
  const handleRegisterError = (error) => {
    // 注册错误由组件根据具体错误码处理
    showError("注册失败", error.message);
  };

  // 登出处理
  const handleLogout = (error = null) => {
    if (!error) {
      showSuccess("成功退出登录");
    }
    dispatch(logout());
  };

  return {
    handleLoginSuccess,
    handleLoginError,
    handleAutoLoginSuccess,
    handleAutoLoginError,
    handleCaptchaSuccess,
    handleCaptchaError,
    handleRegisterSuccess,
    handleRegisterError,
    handleLogout
  };
};