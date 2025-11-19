package com.chiran.controller;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.chiran.dto.ChatSendDTO;
import com.chiran.dto.MessageDTO;
import com.chiran.entity.UserChat;
import com.chiran.result.PageResult;
import com.chiran.result.Result;
import com.chiran.service.UserChatService;
import com.chiran.service.UserService;
import com.chiran.vo.UserChatVO;
import com.chiran.vo.UserMessageCountVO;
import com.chiran.vo.UserMessageVO;
import lombok.Data;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.messaging.simp.annotation.SubscribeMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;

@Slf4j
@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserService userService;

    @Autowired
    private UserChatService userChatService;

    // ==================== 消息数量实时推送 ====================

    /**
     * 订阅用户消息数量 - 当用户订阅时会立即推送当前数量
     */
    @SubscribeMapping("/user/queue/messages.count")
    public Result<UserMessageCountVO> subscribeMessageCount(Principal principal) {
        Integer userId = Integer.parseInt(principal.getName());
        log.info("用户 {} 订阅消息数量", userId);
        return Result.success(getUserMessagesCount(userId));
    }

    /**
     * 请求获取消息数量
     */
    @MessageMapping("/messages.count.get")
    @SendToUser("/queue/messages.count")
    public Result<UserMessageCountVO> getMessageCount(Principal principal) {
        Integer userId = Integer.parseInt(principal.getName());
        return Result.success(getUserMessagesCount(userId));
    }

    /**
     * 获取消息数量的通用方法
     */
    private UserMessageCountVO getUserMessagesCount(Integer userId) {
        MessageDTO messageDTO1 = new MessageDTO();
        messageDTO1.setId(userId);
        messageDTO1.setPageSize(20);
        PageResult<UserMessageVO> like = userService.getUserMessages(messageDTO1, 1);
        PageResult<UserMessageVO> collect = userService.getUserMessages(messageDTO1, 2);
        PageResult<UserMessageVO> review = userService.getUserMessages(messageDTO1, 3);
        PageResult<UserChat> system = userChatService.getMessageSystem(messageDTO1);
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setPage(1);
        messageDTO.setPageSize(20);
        PageResult<UserChatVO> chats = userChatService.getUserChats(messageDTO, userId);

        long likeCount = like.getTotal();
        long collectCount = collect.getTotal();
        long reviewCount = review.getTotal();
        long systemCount = system.getTotal();
        long chatCount = 0;
        for (UserChatVO i : chats.getRecords()) {
            chatCount += i.getUnread();
        }
        log.debug("消息数量{}", chatCount);
        long totalCount = likeCount + collectCount + reviewCount + systemCount + chatCount;

        UserMessageCountVO user = UserMessageCountVO.builder()
                .like((int) likeCount)
                .collect((int) collectCount)
                .system((int) systemCount)
                .chat((int) chatCount)
                .review((int) reviewCount)
                .total((int) totalCount)
                .build();
        return user;
    }

    // ==================== 各类消息列表实时推送 ====================

    /**
     * 获取点赞消息列表
     */
    @MessageMapping("/messages.like.get")
    @SendToUser("/queue/messages.like")
    public Result<PageResult> getLikeMessages(Principal principal,MessageDTO messageDTO) {
        Integer userId = Integer.parseInt(principal.getName());
        log.info("用户 {} 获取点赞消息", userId);
        messageDTO.setId(userId);
        PageResult<UserMessageVO> like = userService.getUserMessages(messageDTO, 1);
        return Result.success(like);
    }

    /**
     * 获取收藏消息列表
     */
    @MessageMapping("/messages.collect.get")
    @SendToUser("/queue/messages.collect")
    public Result<PageResult> getCollectMessages(Principal principal,MessageDTO messageDTO) {
        Integer userId = Integer.parseInt(principal.getName());
        log.info("用户 {} 获取收藏消息", userId);
        messageDTO.setId(userId);
        PageResult<UserMessageVO> collect = userService.getUserMessages(messageDTO, 2);
        return Result.success(collect);
    }

    /**
     * 获取审核消息列表
     */
    @MessageMapping("/messages.review.get")
    @SendToUser("/queue/messages.review")
    public Result<PageResult> getReviewMessages(Principal principal,MessageDTO messageDTO) {
        Integer userId = Integer.parseInt(principal.getName());
        log.info("用户 {} 获取评论消息", userId);
        messageDTO.setId(userId);
        PageResult<UserMessageVO> review = userService.getUserMessages(messageDTO, 3);
        return Result.success(review);
    }

    /**
     * 获取系统消息列表
     */
    @MessageMapping("/messages.system.get")
    @SendToUser("/queue/messages.system")
    public Result<PageResult> getSystemMessages(Principal principal,MessageDTO messageDTO) {
        Integer userId = Integer.parseInt(principal.getName());
        log.info("用户 {} 获取系统消息", userId);
        messageDTO.setId(userId);
        PageResult<UserChat> system = userChatService.getMessageSystem(messageDTO);
        return Result.success(system);
    }

    // ==================== 聊天功能实时推送 ====================

    /**
     * 获取聊天会话列表
     */
    @MessageMapping("/chats.list")
    @SendToUser("/queue/chats.list")
    public Result<PageResult> getChatSessions(@Payload MessageDTO dto, Principal principal) {
        Integer userId = Integer.parseInt(principal.getName());
        log.info("用户 {} 获取聊天会话列表", userId);
        PageResult<UserChatVO> chats = userChatService.getUserChats(dto, userId);
        return Result.success(chats);
    }

    /**
     * 获取特定聊天记录
     */
    @MessageMapping("/chat.detail")
    @SendToUser("/queue/chat.detail")
    public Result<PageResult> getChatDetail(@Payload MessageDTO dto, Principal principal) {
        System.out.println("控制器收到的Principal：" + (principal == null ? "null" : principal.getName()));
        Integer userId = Integer.parseInt(principal.getName());
        log.info("用户 {} 获取聊天记录", userId);
        PageResult<UserChat> chat = userChatService.getUserChat(dto, userId);
        return Result.success(chat);
    }

    /**
     * 发送聊天消息
     */
    @MessageMapping("/chat.send")
    public void sendChatMessage(@Payload ChatSendDTO chatSendDTO, Principal principal) {
        Integer userId = Integer.parseInt(principal.getName());
        chatSendDTO.setSenderId(userId);

        log.info("用户 {} 发送消息给用户 {}: {}", userId, chatSendDTO.getReceiverId(), chatSendDTO.getContent());

        // 保存聊天记录
        UserChat userChat = userChatService.addUserChat(chatSendDTO);

        changeChat(chatSendDTO.getReceiverId(), userId, userChat);
    }

    /**
     * 查看聊天消息
     */
    @MessageMapping("/chat.read")
    public Result sendChatMessage(@Payload MessageDTO dto, Principal principal) {
        Integer userId = Integer.parseInt(principal.getName());
        Integer id = dto.getId();

        log.info("用户 {} 查看消息给用户", userId);
        // 保存聊天记录
        UpdateWrapper<UserChat> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("sender_id", id)
                .eq("receiver_id", userId)
                // 优化：只更新未读的（is_read = false），减少不必要的更新
                .eq("is_read", false);
        UserChat updateEntity = new UserChat();
        updateEntity.setIsRead(true);
        userChatService.update(updateEntity, updateWrapper);
        changeAllChat(userId, id);
        return Result.success();
    }

    /**
     * 删除聊天消息
     */
    @MessageMapping("/chat.delete")
    public void delChatMessage(@Payload MessageDTO dto, Principal principal) {
        Integer userId = Integer.parseInt(principal.getName());
        Integer id = dto.getId();

        UserChat chat = userChatService.getById(id);
        // 2. 判断当前用户是发送者还是接收者，构建更新条件
        LambdaUpdateWrapper<UserChat> updateWrapper = new LambdaUpdateWrapper<>();
        updateWrapper.eq(UserChat::getId, id); // 仅更新当前消息

        if (chat.getSenderId().equals(userId)) {
            // 2.1 是发送者：标记 sender_del = true
            updateWrapper.set(UserChat::getSenderDel, true);
        } else if (chat.getReceiverId().equals(userId)) {
            // 2.2 是接收者：标记 receiver_del = true
            updateWrapper.set(UserChat::getReceiverDel, true);
        } else {
            // 3. 既不是发送者也不是接收者，无权删除
            throw new IllegalArgumentException("无权删除该消息");
        }

        // 4. 执行更新（逻辑删除）
userChatService.update(updateWrapper);
        // userChatService.removeById(id);
        // 更新发送者的消息计数
        // UserMessageCountVO userMessagesCount = getUserMessagesCount(userId);
        // messagingTemplate.convertAndSendToUser(
        //         userId.toString(),
        //         "/queue/messages.count",
        //         Result.success(userMessagesCount)
        // );
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setPage(1);
        messageDTO.setPageSize(20);
        PageResult<UserChatVO> senderChats = userChatService.getUserChats(messageDTO, userId);
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/chats.list",
                Result.success(senderChats)
        );
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/chat.delete",
                Result.success(id)
        );
        MessageDTO messageDTO2 = new MessageDTO();
        messageDTO2.setPage(1);
        messageDTO2.setPageSize(20);
        if (chat.getSenderId().equals(userId)) {
            // 2.1 是发送者：标记 sender_del = true
            messageDTO2.setId(chat.getReceiverId());
        } else {
            // 2.2 是接收者：标记 receiver_del = true
            messageDTO2.setId(chat.getSenderId());
        }
        PageResult<UserChat> detail = userChatService.getUserChat(messageDTO2, userId);

        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/chat.detail", // 对应前端订阅的会话列表路径
                Result.success(detail)
        );
        log.info("用户 {} 删除消息给用户", userId);
    }

    /**
     * 撤回聊天消息
     */
    @MessageMapping("/chat.revoke")
    public void removeChatMessage(@Payload MessageDTO dto, Principal principal) {
        Integer userId = Integer.parseInt(principal.getName());
        Integer id = dto.getId();
        UserChat chat = userChatService.getById(id);
        Integer receiverId = chat.getReceiverId();
        chat.setIsRevoke(true);
        userChatService.updateById(chat);
        // userChatService.removeById(id);
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/chat.revoke",
                Result.success(id)
        );
        changeAllChat(userId, receiverId);
        log.info("用户 {} 撤回消息给用户 {}", userId, id);
    }

    private void changeAllChat(Integer userId, Integer receiverId) {
        // 更新双方的消息计数
        updateMessageCounts(userId, receiverId);
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setPage(1);
        messageDTO.setPageSize(20);
        PageResult<UserChatVO> senderChats = userChatService.getUserChats(messageDTO, userId);
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/chats.list",
                Result.success(senderChats)
        );
        MessageDTO messageDTO1 = new MessageDTO();
        messageDTO1.setPage(1);
        messageDTO1.setPageSize(20);
        PageResult<UserChatVO> receiverChats = userChatService.getUserChats(messageDTO1, userId);
        messagingTemplate.convertAndSendToUser(
                receiverId.toString(),
                "/queue/chats.list", // 对应前端订阅的会话列表路径
                Result.success(receiverChats)
        );
        MessageDTO messageDTO2 = new MessageDTO();
        messageDTO2.setPage(1);
        messageDTO2.setPageSize(20);
        messageDTO2.setId(receiverId);
        PageResult<UserChat> detail = userChatService.getUserChat(messageDTO2, userId);

        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/chat.detail", // 对应前端订阅的会话列表路径
                Result.success(detail)
        );
        messagingTemplate.convertAndSendToUser(
                receiverId.toString(),
                "/queue/chat.detail", // 对应前端订阅的会话列表路径
                Result.success(detail)
        );
    }

    private void changeChat(Integer recevier, Integer userId, UserChat userChat) {
        // 实时推送给接收者
        messagingTemplate.convertAndSendToUser(
                recevier.toString(),
                "/queue/chat.new",
                Result.success(userChat)
        );

        // 同时推送给发送者（确认发送成功）
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/chat.sent",
                Result.success(userChat)
        );

        // 更新双方的消息计数
        updateMessageCounts(userId, userChat.getReceiverId());
        MessageDTO messageDTO1 = new MessageDTO();
        messageDTO1.setPage(1);
        messageDTO1.setPageSize(20);
        PageResult<UserChatVO> receiverChats = userChatService.getUserChats(messageDTO1, userId);
        messagingTemplate.convertAndSendToUser(
                recevier.toString(),
                "/queue/chats.list", // 对应前端订阅的会话列表路径
                Result.success(receiverChats)
        );

// 5. 推送给发送者：更新聊天会话列表
        MessageDTO messageDTO = new MessageDTO();
        messageDTO.setPage(1);
        messageDTO.setPageSize(20);
        PageResult<UserChatVO> senderChats = userChatService.getUserChats(messageDTO, userId);
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/chats.list",
                Result.success(senderChats)
        );
        MessageDTO messageDTO2 = new MessageDTO();
        messageDTO2.setPage(1);
        messageDTO2.setPageSize(20);
        messageDTO2.setId(recevier);
        PageResult<UserChat> detail = userChatService.getUserChat(messageDTO2, userId);

        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/chat.detail", // 对应前端订阅的会话列表路径
                Result.success(detail)
        );
        messagingTemplate.convertAndSendToUser(
                recevier.toString(),
                "/queue/chat.detail", // 对应前端订阅的会话列表路径
                Result.success(detail)
        );

    }
// ==================== 实时通知推送 ====================

    /**
     * 当有新消息时推送通知
     */
    // public void pushNewMessageNotification(Integer receiverId, String message) {
    //     MessageNotification notification = MessageNotification.builder()
    //             .type("NEW_MESSAGE")
    //             .content(message)
    //             .timestamp(LocalDateTime.now())
    //             .build();
    //
    //     messagingTemplate.convertAndSendToUser(
    //             receiverId.toString(),
    //             "/queue/notifications",
    //             notification
    //     );
    // }

    /**
     * 更新用户消息计数
     */
    private void updateMessageCounts(Integer senderId, Integer receiverId) {
        // 更新接收者的消息计数
        UserMessageCountVO userMessagesCount = getUserMessagesCount(receiverId);
        messagingTemplate.convertAndSendToUser(
                receiverId.toString(),
                "/queue/messages.count",
                Result.success(userMessagesCount)
        );

        // 更新发送者的消息计数
        UserMessageCountVO messagesCount = getUserMessagesCount(senderId);
        messagingTemplate.convertAndSendToUser(
                senderId.toString(),
                "/queue/messages.count",
                Result.success(messagesCount)
        );
    }

// ==================== 心跳检测 ====================

    /**
     * 处理心跳
     */
    @MessageMapping("/heartbeat")
    public void handleHeartbeat(Principal principal) {
        Integer userId = Integer.parseInt(principal.getName());
        log.debug("用户 {} 心跳检测", userId);
        // 可以在这里更新用户在线状态
    }
}

// ==================== 请求DTO类 ====================

// @Data
// class MessageNotification {
//     private String type;
//     private String content;
//     private LocalDateTime timestamp;
//
//     // builder 方法
//     public static MessageNotificationBuilder builder() {
//         return new MessageNotificationBuilder();
//     }
//
//     public static class MessageNotificationBuilder {
//         private String type;
//         private String content;
//         private LocalDateTime timestamp;
//
//         public MessageNotificationBuilder type(String type) {
//             this.type = type;
//             return this;
//         }
//
//         public MessageNotificationBuilder content(String content) {
//             this.content = content;
//             return this;
//         }
//
//         public MessageNotificationBuilder timestamp(LocalDateTime timestamp) {
//             this.timestamp = timestamp;
//             return this;
//         }
//
//         public MessageNotification build() {
//             MessageNotification notification = new MessageNotification();
//             notification.type = this.type;
//             notification.content = this.content;
//             notification.timestamp = this.timestamp;
//             return notification;
//         }
//     }
// }
