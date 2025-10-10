import authConfig from "./authConfig";
import commonConfig from "./commonConfig";

export const apiConfigs = {
  auth: authConfig,
  common: commonConfig

}

export const getApiConfig = (module, apiName, type = 'error') => {
  if (!apiConfigs[module] || !apiConfigs[module][apiName]) {
    //默认配置只显示成功和失败,并且只有成功默认显示
    return {
      showMessage: type === 'success',
      messge: type === 'success' ? "成功" : '失败',
      handler: null
    }
  }
  return apiConfigs[module][apiName][type]
}