
import { useGet } from "../common/useData";
import { getUserChat, getUserChats, getUserDetail, getUserMessagesCollect, getUserMessagesCount, getUserMessagesLike, getUserMessagesReview, getUserMessagesSystem, getUserPoints, getUserProfile, getUserSettings, getUserVip } from '../../api/modules/user'

export const useGetUserProfile = (options) => useGet(getUserProfile, ['user', 'profile'], null, options)
export const useGetUserDetail = (options) => useGet(getUserDetail, ['user', 'detail'], null, options)
export const useGetUserSettings = (options) => useGet(getUserSettings, ['user', 'settings'], null, options)
export const useGetUserPoints = (options) => useGet(getUserPoints, ['user', 'points'], null, options)
export const useGetUserVip = (options) => useGet(getUserVip, ['user', 'vip'], null, options)

export const useGetUserMessagesCount = (options) => useGet(getUserMessagesCount, ['user', 'messages', 'count'], null, options)
export const useGetUserMessagesLike = (options) => useGet(getUserMessagesLike, ['user', 'messages', 'like'], null, options)
export const useGetUserMessagesCollect = (options) => useGet(getUserMessagesCollect, ['user', 'messages', 'collect'], null, options)
export const useGetUserMessagesReview = (options) => useGet(getUserMessagesReview, ['user', 'messages', 'review'], null, options)
export const useGetUserMessagesSystem = (options) => useGet(getUserMessagesSystem, ['user', 'messages', 'system'], null, options)
export const useGetUserChats = (options) => useGet(getUserChats, ['user', 'chats'], null, options)
export const useGetUserChat = (id, options) => useGet(getUserChat, ['user', 'chat', id], id, options)