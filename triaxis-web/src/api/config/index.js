import authConfig from "./authConfig";
import commonConfig from "./commonConfig";

export const apiConfigs = {
  auth: authConfig,
  common: commonConfig

}

export const getApiConfig = (config, type = 'error') => {
  if (!config || !config[type]) {
    //默认配置只显示成功和失败,并且只有成功默认显示
    return {
      success: {
        showMessage: false,
        message: "成功",
      },
      error: {
        noDetail: false,
        showMessage: false,
        message: "失败！",
      }
    }
  }
  return config[type]
}