package com.chiran.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chiran.entity.UserChat;
import com.chiran.entity.UserTag;
import com.chiran.vo.UserChatVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Mapper
public interface UserChatMapper extends BaseMapper<UserChat> {
    Page<UserChatVO> getChats(Page<UserChatVO> page, @Param("userId")Integer id);
}
