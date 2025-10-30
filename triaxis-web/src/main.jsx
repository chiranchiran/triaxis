
import { createRoot } from 'react-dom/client'
import { store } from './store/index.js'
import './utils/i18n'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './utils/api/queryClient.js'
import { handleGlobalError } from './utils/error/errorHandler.js'
import { AppProvider } from './components/AppProvider.jsx'
import { ConfigProvider } from 'antd'
import zh_CN from 'antd/locale/zh_CN';
import en_US from 'antd/locale/en_US';
import { LocaleProvider } from '@douyinfe/semi-ui';
import zh_CN_Semi from '@douyinfe/semi-ui/lib/cjs/locale/source/zh_CN';
import en_US_Semi from '@douyinfe/semi-ui/lib/cjs/locale/source/en_US';
import { PreferenceProvider, usePreference } from './components/usePreference.jsx'
import { logger } from './utils/logger.js'
import dayjs from 'dayjs';
import './index.css'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const RootApp = () => {
  const { language } = usePreference();
  logger.debug("当前语言", language);
  const antdLocale = language === 'Chinese' ? zh_CN : en_US;
  const semiLocale = language === 'Chinese' ? zh_CN_Semi : en_US_Semi;
  const dayjsLocale = language === 'Chinese' ? 'zh-cn' : 'en';
  const i18nLang = language === 'Chinese' ? 'zh-CN' : 'en-US';
  const { i18n } = useTranslation()
  //检查语言和设置
  useEffect(() => {

    i18n.changeLanguage(i18nLang);
  }, [i18nLang, i18n]);

  useEffect(() => {
    dayjs.locale(dayjsLocale);
  }, [dayjsLocale]);
  return (
    <ConfigProvider
      locale={antdLocale}
      theme={{
        cssVar: true,
        components: {
          Input: { inputFontSize: 16 },
          Button: { contentFontSize: 14, contentFontSizeLG: 16 }
        },
        token: {
          colorPrimary: 'var(--primary)',
          colorText: 'var(--text)',
          colorTextSecondary: 'var(--text-secondary)',
          colorBgBase: 'var(--bg)',
          colorBgContainer: 'var(--bg)',
          contentFontSize: 16,
          fontSize: 16,
          fontSizeLG: 16,
          colorBorder: 'var(--bg-hover)',
        },
      }}
    >
      <LocaleProvider locale={semiLocale}>
        <AppProvider>
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </Provider>
          </QueryClientProvider>
        </AppProvider>
      </LocaleProvider>
    </ConfigProvider>
  );
};

// 全局错误处理
handleGlobalError();

// 渲染根组件
createRoot(document.getElementById('root')).render(
  <PreferenceProvider>
    <RootApp />
  </PreferenceProvider>
);