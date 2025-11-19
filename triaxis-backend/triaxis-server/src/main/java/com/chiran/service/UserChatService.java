package com.chiran.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.chiran.bo.CategoryBO;
import com.chiran.dto.ChatSendDTO;
import com.chiran.dto.MessageDTO;
import com.chiran.entity.UserChat;
import com.chiran.entity.UserTag;
import com.chiran.result.PageResult;
import com.chiran.vo.UserChatVO;

import java.util.List;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
public interface UserChatService extends IService<UserChat> {
    PageResult<UserChat> getMessageSystem(MessageDTO dto);

    PageResult<UserChatVO> getUserChats(MessageDTO dto, Integer userId);
    PageResult<UserChat> getUserChat(MessageDTO dto, Integer userId);

    UserChat addUserChat(ChatSendDTO chatSendDTO);
}
