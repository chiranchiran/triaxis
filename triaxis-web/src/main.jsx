
import { createRoot } from 'react-dom/client'
import { store } from './store/index.js'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './utils/api/queryClient.js'
import { handleGlobalError } from './utils/error/errorHandler.js'
import { AppProvider } from './components/AppProvider.jsx'
import { ConfigProvider } from 'antd'

//全局错误处理
handleGlobalError()
createRoot(document.getElementById('root')).render(
  <ConfigProvider
    theme={{
      cssVar: true,
      components: {
        Input: {
          inputFontSize: 16,
        },
        Button: {
          contentFontSize: 14,
          contentFontSizeLG: 16,
        }
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
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </QueryClientProvider>
    </AppProvider>
  </ConfigProvider>

)