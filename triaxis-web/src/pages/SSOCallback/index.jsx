import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetToken } from '../../hooks/api/login';
import { loginSuccess } from '../../store/slices/authSlice';


const SSOCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const ssoState = searchParams.get('state');
  const originalPath = searchParams.get('originalPath');
  const { loginState } = useSelector(state => state.userCenter)

  // 核心逻辑：页面加载后，从Redux拿state换token（必须）
  const { data, isSuccess, isFetching, isError } = useGetToken({ state: ssoState })
  // sso登录
  const handleLogin = () => {
    const state = generateSafeState();
    // dispatch(setLoginState(state))
    const redirectUri = '/sso/callback';
    navigate(`/login?state=${state}&redirectUri=${redirectUri}&originalPath=${originalPath}`)
  }
  // 换token成功，跳首页（或业务页）
  useEffect(() => {
    if (isSuccess) {
      dispatch(loginSuccess(data))
      if (originalPath === '/register') {
        navigate('/')
      } else {
        navigate(originalPath)
      }
    }
  }, [isSuccess]);

  // 加载中显示（避免用户以为卡住）
  if (isFetching) return <div style={{ textAlign: 'center', marginTop: '10rem' }}>登录中...</div>;

  // 错误显示（给用户提示）
  if (isError) return <div style={{ textAlign: 'center', marginTop: '10rem', color: 'red' }}>登录失败<button onClick={handleLogin}>重新登录</button></div>;

  return null;
};

export default SSOCallback;