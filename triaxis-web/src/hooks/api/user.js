
import { useGet } from "../common/useData";
import { getUserDetail, getUserPoints, getUserProfile, getUserSettings, getUserVip } from '../../api/modules/user'

export const useGetUserProfile = (options) => useGet(getUserProfile, ['user', 'profile'], null, options)
export const useGetUserDetail = (options) => useGet(getUserDetail, ['user', 'detail'], null, options)
export const useGetUserSettings = (options) => useGet(getUserSettings, ['user', 'settings'], null, options)
export const useGetUserPoints = (options) => useGet(getUserPoints, ['user', 'points'], null, options)
export const useGetUserVip = (options) => useGet(getUserVip, ['user', 'vip'], null, options)