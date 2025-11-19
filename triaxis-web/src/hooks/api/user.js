
import { useAdd, useGet } from "../common/useData";
import { getUserChat, getUserChats, getUserDetail, getUserMessagesCollect, getUserMessagesCount, getUserMessagesLike, getUserMessagesReview, getUserMessagesSystem, getUserPoints, getUserProfile, getUserSettings, getUserVip, sendChat } from '../../api/modules/user'
import { useApi } from "../common/useApi";

export const useGetUserProfile = (options) => useGet(getUserProfile, ['user', 'profile'], null, options)
export const useGetUserDetail = (options) => useGet(getUserDetail, ['user', 'detail'], null, options)
export const useGetUserSettings = (options) => useGet(getUserSettings, ['user', 'settings'], null, options)
export const useGetUserPoints = (options) => useGet(getUserPoints, ['user', 'points'], null, options)
export const useGetUserVip = (options) => useGet(getUserVip, ['user', 'vip'], null, options)

export const useGetUserMessagesCount = (params, options) => useGet(getUserMessagesCount, ['user', 'messages', 'count', params.page], params, options)
export const useGetUserMessagesLike = (params, options) => useGet(getUserMessagesLike, ['user', 'messages', 'like', params.page], params, options)
export const useGetUserMessagesCollect = (params, options) => useGet(getUserMessagesCollect, ['user', 'messages', 'collect', params.page], params, options)
export const useGetUserMessagesReview = (params, options) => useGet(getUserMessagesReview, ['user', 'messages', 'review', params.page], params, options)
export const useGetUserMessagesSystem = (params, options) => useGet(getUserMessagesSystem, ['user', 'messages', 'system', params.page], params, options)
export const useGetUserChats = (options) => useGet(getUserChats, ['user', 'chats'], null, options)
export const useGetUserChat = (id, options) => useGet(getUserChat, ['user', 'chat', id], id, options)
export const useSendChat = (data, options) => useApi(sendChat, {
  queryKey: ['user', 'chat', data?.receiverId],
  params: data,
  isMutation: true,
  ...options
})