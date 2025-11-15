package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.bo.CategoryBO;
import com.chiran.dto.ChatSendDTO;
import com.chiran.entity.Tag;
import com.chiran.entity.UserChat;
import com.chiran.entity.UserTag;
import com.chiran.mapper.TagMapper;
import com.chiran.mapper.UserChatMapper;
import com.chiran.mapper.UserTagMapper;
import com.chiran.result.PageResult;
import com.chiran.service.UserChatService;
import com.chiran.service.UserTagService;
import com.chiran.utils.BeanUtil;
import com.chiran.vo.UserChatVO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.chiran.constant.SystemConstant.SYSTEM_SENDID;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Service
@RequiredArgsConstructor
public class UserChatServiceImpl extends ServiceImpl<UserChatMapper, UserChat> implements UserChatService {
    @Autowired
    private UserChatMapper userChatMapper;
    @Override
    public PageResult<UserChat> getMessageSystem(Integer id) {
        LambdaQueryWrapper<UserChat> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserChat::getSenderId, SYSTEM_SENDID).eq(UserChat::getReceiverId, id)
                .select(UserChat::getId, UserChat::getSenderId, UserChat::getContent, UserChat::getIsRead, UserChat::getSendTime)
                .orderByDesc(UserChat::getSendTime);
        List<UserChat> list = this.list(queryWrapper);
        return new PageResult<>((long) list.size(), list);
    }

    @Override
    public PageResult<UserChatVO> getUserChats(Integer id) {
        List<UserChatVO> list = userChatMapper.getChats(id);
        List<UserChatVO> filteredList = list.stream()
                .filter(item -> item.getId() > 0) // 过滤条件：id大于0
                .collect(Collectors.toList()); // 收集到新 List
        return new PageResult<>((long) filteredList.size(), filteredList);
    }

    @Override
    public PageResult<UserChat> getUserChat(Integer id,Integer userId) {
        // 构建查询条件：包含「当前用户发给目标用户」和「目标用户发给当前用户」两种情况
        LambdaQueryWrapper<UserChat> queryWrapper = new LambdaQueryWrapper<>();
        // 条件1：当前用户（currentUserId）发给目标用户（targetId）
        queryWrapper.eq(UserChat::getSenderId, userId)
                .eq(UserChat::getReceiverId, id)
                // 条件2：目标用户（targetId）发给当前用户（userId），用or连接
                .or()
                .eq(UserChat::getSenderId, id)
                .eq(UserChat::getReceiverId, userId)
                // 按发送时间升序排列（保证消息顺序从旧到新）
                .orderByAsc(UserChat::getSendTime)
                // 可选：过滤已删除的消息（如果业务中有删除逻辑）
                .eq(UserChat::getDeleted, 0);

        // 查询符合条件的所有消息（双方互发的记录）
        List<UserChat> chatList = this.list(queryWrapper);

        // 返回分页结果（总数为消息列表长度，数据为消息列表）
        return new PageResult<>((long) chatList.size(), chatList);
    }

    @Override
    public void addUserChat(ChatSendDTO chatSendDTO) {
        UserChat userChat = new UserChat();
        BeanUtils.copyProperties(chatSendDTO,userChat);
        this.save(userChat);
    }
}