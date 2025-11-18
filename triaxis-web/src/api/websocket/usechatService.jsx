// // src/services/chatApiService.js
// import webSocketService from './websocketService';
// // 预定义的订阅类型
// export const SubscriptionTypes = {
//   // 聊天相关
//   CHAT_NEW_MESSAGE: 'CHAT_NEW_MESSAGE',
//   CHAT_MESSAGE_SENT: 'CHAT_MESSAGE_SENT',
//   CHAT_DETAIL: 'CHAT_DETAIL',
//   CHAT_DELETE: 'CHAT_DELETE',
//   CHAT_REVOKE: 'CHAT_REVOKE',

//   // 消息统计
//   MESSAGE_COUNT: 'MESSAGE_COUNT',

//   // 各类消息
//   LIKE_MESSAGES: 'LIKE_MESSAGES',
//   COLLECT_MESSAGES: 'COLLECT_MESSAGES',
//   REVIEW_MESSAGES: 'REVIEW_MESSAGES',
//   SYSTEM_MESSAGES: 'SYSTEM_MESSAGES',

//   // 聊天会话
//   CHAT_LISTS: 'CHAT_LISTS',
// };

// // 订阅类型到STOMP路径的映射
// const SubscriptionPaths = {
//   [SubscriptionTypes.CHAT_NEW_MESSAGE]: '/user/queue/chat.new',
//   [SubscriptionTypes.CHAT_MESSAGE_SENT]: '/user/queue/chat.sent',
//   [SubscriptionTypes.CHAT_DETAIL]: '/user/queue/chat.detail',
//   [SubscriptionTypes.CHAT_DELETE]: '/user/queue/chat.delete',
//   [SubscriptionTypes.CHAT_REVOKE]: '/user/queue/chat.revoke',
//   [SubscriptionTypes.MESSAGE_COUNT]: '/user/queue/messages.count',
//   [SubscriptionTypes.LIKE_MESSAGES]: '/user/queue/messages.like',
//   [SubscriptionTypes.COLLECT_MESSAGES]: '/user/queue/messages.collect',
//   [SubscriptionTypes.REVIEW_MESSAGES]: '/user/queue/messages.review',
//   [SubscriptionTypes.SYSTEM_MESSAGES]: '/user/queue/messages.system',
//   [SubscriptionTypes.CHAT_LISTS]: '/user/queue/chats.list',
// };

// const useChat = () => {
  
//   /**
//    * @description 连接与断开
//    */

//   // 连接WebSocket
//  const  connect=(onConnect, onError)=> {
//     const success = () => {

//       console.log('聊天组件：WebSocket连接成功');
//       onConnect(this.getStatus)

//     }
//     const handelError = (error) => {

//       console.error('聊天组件：WebSocket连接失败:', error);
//       onError(error);
//       messageApi.error('连接服务器失败，请检查网络');
//     }
//     webSocketService.connect(success, handelError);
//   }
//   // 当前状态
//   getStatus() {
//     return webSocketService.status;
//   }
//   // 断开连接
//   disconnect() {
//     webSocketService.disconnect();
//   }
//   // 状态检查
//   checkConnection(status = null, callback = null) {
//     const currentStatus = this.getStatus();
//     console.log("当前状态为", currentStatus);
//     if (currentStatus !== status) {
//       callback(currentStatus);
//     }
//   };

//   /**
//    * @description 批量注册、取消注册底层的方法
//    */

//   // 为组件注册订阅
//   register(name, subscriptionTypes, callbacks) {
//     const id = `${name}_${Date.now()}`;

//     // 将订阅类型转换为实际的STOMP路径
//     const subscriptions = {};
//     subscriptionTypes.forEach(type => {
//       const path = SubscriptionPaths[type];
//       if (path && callbacks[type]) {
//         subscriptions[path] = callbacks[type];
//       }
//     });

//     // 注册到WebSocket服务
//     webSocketService.register(id, subscriptions);


//     console.log(`[${name}] 注册订阅:`, subscriptionTypes);
//     return id;
//   }
//   // 取消组件订阅
//   unregister(id) {
//     webSocketService.unregister(id);
//     console.log(`组件 ${id} 取消订阅`);
//   }

//   /**
//    * @description 不同类型的注册、取消注册的方法，不同类型有多个path
//    */

//   // 订阅全部数量
//   subscribeMessageCount(name, callbacks) {
//     const allTypes = [
//       SubscriptionTypes.MESSAGE_COUNT,
//     ];

//     return this.register(name, allTypes, callbacks);
//   }
//   // 订阅消息各种数量相关
//   subscribeAllMessageCount(name, callbacks) {
//     const messageTypes = [
//       SubscriptionTypes.LIKE_MESSAGES,
//       SubscriptionTypes.COLLECT_MESSAGES,
//       SubscriptionTypes.REVIEW_MESSAGES,
//       SubscriptionTypes.SYSTEM_MESSAGES,
//     ];

//     return this.register(name, messageTypes, callbacks);
//   }
//   // 订阅聊天列表
//   subscribeChats(name, callbacks) {
//     const messageTypes = [
//       SubscriptionTypes.CHAT_LISTS,
//     ];

//     return this.register(name, messageTypes, callbacks);
//   }
//   // 订阅聊天框相关消息
//   subscribeChat(name, callbacks) {
//     const chatTypes = [
//       SubscriptionTypes.CHAT_DETAIL,
//       SubscriptionTypes.CHAT_NEW_MESSAGE,
//       SubscriptionTypes.CHAT_MESSAGE_SENT,
//       SubscriptionTypes.CHAT_DELETE,
//       SubscriptionTypes.CHAT_REVOKE,
//     ];

//     return this.register(name, chatTypes, callbacks);
//   }
//   // 订阅单一类型
//   subscribeOne(name, subscriptionType, callback) {
//     return this.register(name, [subscriptionType], {
//       [subscriptionType]: callback
//     });
//   }

//   /**
//    * @description 消息发布
//    */

//   sendChatMessage(content, receiverId) {
//     const message = {
//       content: content,
//       receiverId: receiverId,
//       type: 1,
//       timestamp: new Date().toISOString()
//     };
//     return webSocketService.publish('/app/chat.send', message);
//   }
//   delChatMessage(id) {
//     return webSocketService.publish('/app/chat.delete', { id });
//   }
//   revokeChatMessage(id) {
//     return webSocketService.publish('/app/chat.revoke', { id });
//   }
//   getMessagesCount() {
//     return webSocketService.publish('/app/messages.count.get', {});
//   }

//   getLikeMessages() {
//     return webSocketService.publish('/app/messages.like.get', {});
//   }

//   getCollectMessages() {
//     return webSocketService.publish('/app/messages.collect.get', {});
//   }

//   getReviewMessages() {
//     return webSocketService.publish('/app/messages.review.get', {});
//   }

//   getSystemMessages() {
//     return webSocketService.publish('/app/messages.system.get', {});
//   }

//   getChats() {
//     return webSocketService.publish('/app/chats.list', {});
//   }

//   getChatDetail(id) {
//     return webSocketService.publish('/app/chat.detail', { id });
//   }
// }
// // 创建单例实例
// const chatService = new ChatService();
// export default chatService;