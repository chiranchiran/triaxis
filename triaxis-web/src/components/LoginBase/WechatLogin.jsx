import { useEffect, useRef, useState } from 'react';

// 微信登录内嵌二维码组件
const WechatLogin = ({ state }) => {
  // 1. 用于挂载二维码的 DOM 容器（必须确保先有 DOM 再实例化）
  const loginContainerRef = useRef(null);
  // 2. 存储微信 JS 文件的 script 标签（用于卸载时清理）
  const wxScriptRef = useRef(null);
  // 3. 存储 WxLogin 实例（用于卸载时销毁）
  const wxLoginInstanceRef = useRef(null);

  // 配置项（替换成你的实际配置）
  const WECHAT_CONFIG = {
    appid: '你的微信APPID', // 微信开放平台的网站应用APPID
    scope: 'snsapi_login', // 固定值（微信网页登录权限）
    callbackDomain: 'https://your-domain.com', // 微信开放平台配置的授权回调域（公网HTTPS）
    redirectUri: '/sso/wechat/callback', // 回调接口路径（拼接后：https://your-domain.com/sso/wechat/callback）
  };

  // 步骤2：动态引入微信 wxLogin.js（避免全局污染，组件挂载时加载）
  const loadWxLoginScript = () => {
    return new Promise((resolve, reject) => {
      // 避免重复引入
      if (window.WxLogin) {
        resolve();
        return;
      }

      // 创建 script 标签
      const script = document.createElement('script');
      script.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'; // 微信官方JS（支持HTTPS）
      script.type = 'text/javascript';
      script.onload = () => {
        console.log('微信 wxLogin.js 加载成功');
        resolve();
      };
      script.onerror = (err) => {
        console.error('微信 wxLogin.js 加载失败', err);
        reject(err);
      };

      // 插入到 body 并缓存
      document.body.appendChild(script);
      wxScriptRef.current = script;
    });
  };

  // 步骤3：初始化微信登录二维码（依赖 DOM 挂载 + JS 加载 + state 获取）
  useEffect(() => {
    let isUnmounted = false;

    const initWxLogin = async () => {
      try {
        // 1. 等待 3 个前置条件就绪：JS加载完成 + DOM挂载 + state获取
        loadWxLoginScript()

        if (isUnmounted || !loginContainerRef.current || !window.WxLogin) {
          return;
        }

        // 2. 处理 redirect_uri：拼接绝对路径 + URL编码（微信强制要求）
        const fullRedirectUri = `${WECHAT_CONFIG.callbackDomain}${WECHAT_CONFIG.redirectUri}`;
        const encodedRedirectUri = encodeURIComponent(fullRedirectUri);

        // 3. 实例化微信登录二维码（核心！）
        wxLoginInstanceRef.current = new window.WxLogin({
          self_redirect: false, // 关键：false = 扫码授权后通过 JS 回调返回 code；true = 直接跳转到 redirect_uri
          id: 'wechat_login_container', // 必须和 ref 绑定的 DOM id 一致
          appid: WECHAT_CONFIG.appid,
          scope: WECHAT_CONFIG.scope,
          redirect_uri: encodedRedirectUri, // 编码后的回调地址
          state: state, // 后端获取的防CSRF随机值
          style: 'black', // 二维码样式：black/white（可选）
          href: '', // 自定义二维码样式（可选，传入CSS链接，如 "https://xxx.com/custom.css"）
          onReady: (isReady) => {
            console.log('微信二维码初始化完成：', isReady); // 回调：二维码是否就绪
          },
        });
      } catch (err) {
        console.error('微信登录二维码初始化失败', err);
      }
    };

    initWxLogin();

    // 组件卸载时清理：移除 script 标签 + 销毁二维码实例
    return () => {
      isUnmounted = true;
      if (wxScriptRef.current) {
        document.body.removeChild(wxScriptRef.current);
        wxScriptRef.current = null;
      }
      if (wxLoginInstanceRef.current) {
        // 销毁二维码（微信 JS 未暴露 destroy 方法，直接清空 DOM 即可）
        loginContainerRef.current.innerHTML = '';
        wxLoginInstanceRef.current = null;
      }
    };
  }, []); // 空依赖：只初始化一次

  return (
    <div className="wechat-login-wrapper text-center mt-10 h-70 " style={{ width: '300px', margin: '20px auto' }}>
      <h3>微信扫码</h3>
      {/* 二维码挂载容器：id 必须和 WxLogin 配置的 id 一致 */}
      <div
        ref={loginContainerRef}
        id="wechat_login_container"
        className='h-60 mt-4'
        style={{ border: '1px solid #eee', padding: '10px' }}
      />
    </div>
  );
};

export default WechatLogin;