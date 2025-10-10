package com.chiran.mapper;

import com.chiran.entity.User;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chiran.vo.UserStatsVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Mapper
public interface UserMapper extends BaseMapper<User> {
    /**
     * 获取用户统计信息
     */
    UserStatsVO selectUserStats(Integer userId);

    /**
     * 更新用户积分
     */
    int updateUserPoints(@Param("userId") Integer userId,
                         @Param("points") Integer points);
}
