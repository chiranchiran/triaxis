package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.bo.CategoryBO;
import com.chiran.dto.ChatSendDTO;
import com.chiran.dto.MessageDTO;
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
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
@Service
@RequiredArgsConstructor
public class UserChatServiceImpl extends ServiceImpl<UserChatMapper, UserChat> implements UserChatService {
    @Autowired
    private UserChatMapper userChatMapper;
    @Override
    public PageResult<UserChat> getMessageSystem(MessageDTO dto) {
        Integer id = dto.getId();
        Integer pageNum = dto.getPage();
        Integer pageSize = dto.getPageSize();
        pageNum = (pageNum == null || pageNum < 1) ? 1 : pageNum;
        pageSize = (pageSize == null || pageSize < 1) ? 20 : pageSize;
        Page<UserChat> page = new Page<>(pageNum, pageSize);

        LambdaQueryWrapper<UserChat> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(UserChat::getSenderId, SYSTEM_SENDID).eq(UserChat::getReceiverId, id)
                .select(UserChat::getId, UserChat::getSenderId, UserChat::getContent, UserChat::getIsRead, UserChat::getSendTime)
                .orderByDesc(UserChat::getSendTime);
        IPage<UserChat> pageResult = this.page(page, queryWrapper);
        return new PageResult<>(pageResult.getTotal(), pageResult.getRecords(),pageNum,pageSize);
    }

    @Override
    public PageResult<UserChatVO> getUserChats(MessageDTO dto, Integer userId) {
        Integer pageNum = dto.getPage();
        Integer pageSize = dto.getPageSize();
        pageNum = (pageNum == null || pageNum < 1) ? 1 : pageNum;
        pageSize = (pageSize == null || pageSize < 1) ? 20 : pageSize;

        Page<UserChatVO> page = new Page<>(pageNum, pageSize);

        Page<UserChatVO> resultPage = userChatMapper.getChats(page, userId);

        return new PageResult<>(resultPage.getTotal(), resultPage.getRecords());
    }

    @Override
    public PageResult<UserChat> getUserChat(MessageDTO dto,Integer userId) {

        Integer pageNum = dto.getPage();
        Integer pageSize = dto.getPageSize();
        log.debug("加载用户聊天记录第{}页",pageNum);
        pageNum = (pageNum == null || pageNum < 1) ? 1 : pageNum;
        pageSize = (pageSize == null || pageSize < 1) ? 20 : pageSize;

        Page<UserChat> page = new Page<>(pageNum, pageSize);
        // 构建查询条件：包含「当前用户发给目标用户」和「目标用户发给当前用户」两种情况
        LambdaQueryWrapper<UserChat> queryWrapper = new LambdaQueryWrapper<>();
        // 条件1：当前用户（currentUserId）发给目标用户（targetId）
        queryWrapper.and(w -> w
                        .eq(UserChat::getSenderId, userId)
                        .eq(UserChat::getReceiverId, dto.getId())
                        .eq(UserChat::getSenderDel, false) // 新增：当前用户作为发送者，未删除该消息
                )
// 用 or() 嵌套第二个分支：目标用户发给当前用户 + 接收者未删除
                .or(w -> w
                        .eq(UserChat::getSenderId, dto.getId())
                        .eq(UserChat::getReceiverId, userId)
                        .eq(UserChat::getReceiverDel, false) // 新增：当前用户作为接收者，未删除该消息
                )
// 按发送时间降序（最新消息在前）
                .orderByDesc(UserChat::getSendTime)
// 保留原有逻辑：过滤物理删除的消息
                .eq(UserChat::getDeleted, 0);

        // 查询符合条件的所有消息（双方互发的记录）
        IPage<UserChat> pageResult = this.page(page, queryWrapper);

        // 5. 反转当前页的消息列表（将“新→旧”转为“旧→新”）
        List<UserChat> records = pageResult.getRecords();
        Collections.reverse(records); // 反转当前页的顺序

        // 6. 返回处理后的分页结果（总条数不变，消息列表已反转）
        return new PageResult<>(pageResult.getTotal(), records,pageNum,pageSize);
    }

    @Override
    public UserChat addUserChat(ChatSendDTO chatSendDTO) {
        UserChat userChat = new UserChat();
        BeanUtils.copyProperties(chatSendDTO,userChat);
        boolean save = this.save(userChat);
        if(save) {
            return userChat;
        }
        return null;

    }
}