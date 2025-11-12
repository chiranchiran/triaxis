package com.chiran.service;

import com.chiran.bo.UserBO;
import com.chiran.dto.UserUpdateDTO;
import com.chiran.entity.User;
import com.baomidou.mybatisplus.extension.service.IService;
import com.chiran.result.PageResult;
import com.chiran.vo.*;

/**
 * <p>
 *  服务类
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
public interface UserService extends IService<User> {
    UserBO selectUploader(Integer userId);
    /**
     * 获取用户详情
     */

    /**
     * 更新用户信息
     */
    Boolean updateUserProfile(Integer userId, UserUpdateDTO dto);

    /**
     * 获取用户统计信息
     */
    UserStatsVO getUserStats(Integer userId);

    /**
     * 获取会员信息
     */
    MembershipVO getMembershipInfo(Integer userId);

    /**
     * 获取积分信息
     */
    PointsVO getPointsInfo(Integer userId);

    /**
     * 更新最后登录信息
     */
    void updateLastLoginInfo(Integer userId, String ip);

    UserProfileVO getUserProfile(Integer id);

    UserDetailVO getUserDetail(Integer id);

    UserMySettingsVO getUserSettings(Integer id);

    UserMyPointsVO getUserPoints(Integer id);

    UserMyVipVO getUserVip(Integer id);

    PageResult<UserMessageVO> getUserMessages(Integer id, Integer type);

    UserChatVO getUserChats(Integer id);
}
