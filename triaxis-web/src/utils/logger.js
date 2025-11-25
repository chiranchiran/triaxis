import { LOGS_URL, logs, logsFetch } from "../api/modules/logs"


//错误级别
const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  CRITICAL: 4
}
//不同环境下日志输出级别
const getLogLevel = () => {
  if (import.meta.env.DEV) {
    return LogLevel.DEBUG
  }
  return LogLevel.ERROR
}

let currentLogLevel = getLogLevel()
//日志核心类
class Logger {
  constructor() {
    this.queue = []
    this.maxLength = 50
    this.isSending = false
    this.sendInterval = 3000000
    this.addContext = null
    this.url = LOGS_URL
    //定时发送，页面卸载前发送所有日志
    setInterval(() => this.flush(), this.sendInterval)
    window.addEventListener('beforeunload', () => {
      this.flushSync()
    })
  }
  //设置日志用户信息
  setUserContext(id, username) {
    this.userContext = { id, username }
  }
  //一些其他想信息
  addContext(key, value) {
    this.addContext[key] = value
  }
  //记录日志
  getCallerInfo() {
    // 生产环境直接返回空（避免暴露路径）
    if (!import.meta.env.DEV || typeof window === "undefined") {
      return { file: "", line: "", column: "" };
    }

    try {
      // 创建临时 Error，获取调用栈
      const error = new Error();
      if (!error.stack) return { file: "", line: "", column: "" };

      // 分割栈帧（每一行是一个调用栈）
      const stackFrames = error.stack.split("\n").filter(frame => frame.trim());

      // 过滤无效栈帧：
      // 1. 排除 Error 构造函数本身的栈帧（第一行）
      // 2. 排除 Logger 类内部的调用（含当前文件路径、log/debug/info 等方法）
      // 3. 排除 node_modules 依赖的调用
      const targetFrame = stackFrames.find(frame => {
        return !frame.includes("Logger.") && // 排除 Logger 内部方法
          !frame.includes("node_modules") && // 排除依赖
          !frame.includes("Error") && // 排除 Error 构造函数
          frame.includes("http"); // 只保留用户代码（Vite 开发环境路径是 http 开头）
      });

      if (!targetFrame) return { file: "", line: "", column: "" };

      // 正则解析栈帧：匹配 "at 函数名 (http://xxx/文件名:行号:列号)" 或 "at http://xxx/文件名:行号:列号"
      const regex = /\((http.*?):(\d+):(\d+)\)$/;
      const match = targetFrame.match(regex);

      if (!match) return { file: "", line: "", column: "" };

      // 提取文件名（从完整路径中截取最后一段，避免路径过长）
      const fullPath = match[1];
      const fileName = fullPath.split("/").pop(); // 取文件名（如 "RootApp.jsx"）

      return {
        file: fileName,
        line: match[2], // 行号
        column: match[3] // 列号
      };
    } catch (e) {
      // 解析失败时返回空，避免影响日志核心逻辑
      return { file: "", line: "", column: "" };
    }
  }

  // 记录日志（核心修改：整合调用位置信息）
  log(level, message, data) {
    if (level < currentLogLevel) {
      return;
    }

    // 获取调用位置信息（文件名、行号、列号）
    const { file, line, column } = this.getCallerInfo();

    // 具体日志结构（新增 file、line、column 字段）
    const logEntry = {
      time: new Date().toISOString(), // UTC时间
      level: Object.keys(LogLevel).find(key => LogLevel[key] === level),
      message,
      data,
      url: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
      file, // 新增：文件名
      line, // 新增：行号
      column, // 新增：列号
      ...this.userContext,
      ...this.addContext
    };

    // 开发环境直接输出控制台（显示文件位置）
    if (import.meta.env.DEV) {
      const method = level === LogLevel.ERROR ? "error" :
        level === LogLevel.WARN ? "warn" :
          level === LogLevel.INFO ? "info" : "log";

      // 拼接文件位置：[文件名:行号:列号]
      const locationStr = file ? `[${file}:${line}:${column}] ` : "";
      console[method](`[${logEntry.level}] ${locationStr}${message}`, data);
    } else {
      // 生产环境添加到队列（可选是否保留 file/line/column，这里注释掉避免暴露）
      delete logEntry.file;
      delete logEntry.line;
      delete logEntry.column;
      this.queue.push(logEntry);

      // 队列满了立马发送
      if (this.queue.length >= this.maxLength) {
        this.flush();
      }
    }
  }

  //发送日志
  async flush() {
    if (this.isSending || this.queue.length === 0) {
      return
    }
    //复制当前日志，防止堵塞后续日志
    this.isSending = true
    const logsQueue = [...this.queue]
    this.queue = []

    //优先使用axios，fetch兜底
    try {
      if (window.service) {
        await logs(logsQueue)
        this.info("同步日志axios发送成功")
      } else {
        this.info("axios不存在，fetch发送")
        await logsFetch(logsQueue)
        this.info("同步日志axios发送成功")
      }
    } catch (e) {
      console.error('平时日志发送失败', e)
    } finally {
      this.isSending = false
    }
  }
  //页面卸载前sendBeacon可靠发送+fetch+XHR保底
  flushSync() {

    if (this.queue.length === 0) {
      return;
    }

    const logsToSend = [...this.queue];
    this.queue = [];

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(logsToSend)], {
        type: 'application/json'
      });
      const flag = navigator.sendBeacon(this.url, blob);
      if (flag) {
        this.info("页面卸载前日志通过sendBeacon发送成功")
        return
      }
      this.warn("sendBeason发送失败")
    }
    try {
      logsFetch(logsToSend)
        .catch(() => {
          this.warn('fetch+keepalive 发送失败，尝试最终兜底方案')
          try {
            // 同步XMLHttpRequest作为最后手段
            const xhr = new XMLHttpRequest();
            xhr.open('POST', this.url, false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(logsToSend));
            this.info('同步XHR日志发送成功')
            return
          } catch (e) {
            this.warn('同步XHR发送方案均失败:', e)
          }
        })
    } catch (e) {
      this.warn('所有日志发送方案均失败:', e)
    }
  }
  //便捷方法
  debug(message, data = null) {
    this.log(LogLevel.DEBUG, message, data)
  }
  info(message, data = null) {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message, data = null) {
    this.log(LogLevel.WARN, message, data);
  }

  error(message, data = null) {
    this.log(LogLevel.ERROR, message, data);
  }

  critical(message, data = null) {
    this.log(LogLevel.CRITICAL, message, data);
  }

}
export const logger = new Logger();