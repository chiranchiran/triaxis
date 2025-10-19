/**
 * 本地存储
 * accessToken
 * refreshToken
 * usrinfo
    * id
    * uername
    * role
    * rememberMe
    * autoLoginExpire
    * isAuthenticated
    * avatar
 * preference
    * language
    * theme
*/
//自动登录默认30天
export const defaultAutoLogin = 30 * 24 * 60 * 60 * 1000
//设置、删除、获取登录数据
export const setLoginData = (accessToken, refreshToken) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken)
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken)
}
export const removeLoginData = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
}
export const getLoginData = () => {
  return {
    accessToken: localStorage.getItem("accessToken") || "",
    refreshToken: localStorage.getItem("refreshToken") || ""
  }
}

//设置、删除、获取用户数据
export const setUserData = user => {
  const userInfo = getUserData()
  const { username, id, role, avatar } = user
  userInfo.username = username
  userInfo.id = id
  userInfo.role = role
  userInfo.avatar = avatar
  if (user && 'isAuthenticated' in user) {
    userInfo.isAuthenticated = user.isAuthenticated;
  }
  if (user && 'rememberMe' in user) {
    userInfo.rememberMe = user.rememberMe;
  }
  if (user && 'autoLoginExpire' in user) {
    userInfo.autoLoginExpire = user.autoLoginExpire;
  }
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
}
export const removeUserData = () => {
  localStorage.removeItem("userInfo")
}
export const getUserData = () => {
  return JSON.parse(localStorage.getItem("userInfo")) || {}
}
//修改认证状态
export const setAuthenticated = isAuthenticated => {
  const userInfo = getUserData()
  userInfo.isAuthenticated = isAuthenticated
  setUserData(userInfo)
}
//修改登录状态
export const setAutoLoginData = (rememberMe, autoLoginExpire) => {
  const userInfo = getUserData()
  if (rememberMe) userInfo.rememberMe = rememberMe
  if (autoLoginExpire) {
    userInfo.autoLoginExpire = autoLoginExpire
  } else {
    const expireTime = Date.now() + defaultAutoLogin;
    userInfo.autoLoginExpire = expireTime
  }
  setUserData(userInfo)
}

//设置、查询、删除所有数据
export const setAllData = data => {
  const { accessToken, refreshToken, userInfo } = data
  setLoginData(accessToken, refreshToken)
  setUserData(userInfo)
}
export const removeAllData = () => {
  removeLoginData();
  removeUserData()
}
export const getAllData = () => {
  return { ...getLoginData(), ...getUserData() } || {}
}

//设置、查询、删除用户偏好数据
export const setPreferenceData = (data) => {
  const preference = getPreferenceData()
  if (data && 'language' in data) {
    preference.language = data.language;
  }
  if (data && 'theme' in data) {
    preference.theme = data.theme;
  }
  localStorage.setItem('preference', JSON.stringify(preference))
}
export const removePreferenceData = () => {
  localStorage.removeItem("preference")
}
export const getPreferenceData = () => {
  let result = JSON.parse(localStorage.getItem("preference"))
  if (!result) {
    result = { language: 'Chinese', theme: 'light' }
    localStorage.setItem('preference', JSON.stringify(result))
  }
  return result
}
