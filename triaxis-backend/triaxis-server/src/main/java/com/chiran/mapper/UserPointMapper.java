package com.chiran.mapper;

import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.toolkit.Constants;
import com.chiran.entity.Tag;
import com.chiran.entity.UserPoint;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Mapper
public interface UserPointMapper extends BaseMapper<UserPoint> {

    /**
     * 统计【获得积分】（指定类型，只累加正数）
     * @param userId 用户ID
     * @param pointsType 积分类型编码（1=上传资源，2=上传课程...）
     * @return 总和（无记录返回0）
     */
    @Select("SELECT IFNULL(SUM(points_change), 0) FROM user_points " +
            "WHERE user_id = #{userId} " +
            "AND deleted = 0 " +
            "AND points_type = #{pointsType} " +
            "AND points_change > 0") // 只算获得的正数
    Integer selectObtainedSum(
            @Param("userId") Integer userId,
            @Param("pointsType") Integer pointsType
    );

    /**
     * 统计【消耗积分】（指定类型，取负数的绝对值总和）
     * @param userId 用户ID
     * @param pointsType 积分类型编码（6=购买资源，7=购买课程...）
     * @return 总和（无记录返回0）
     */
    @Select("SELECT IFNULL(ABS(SUM(points_change)), 0) FROM user_points " +
            "WHERE user_id = #{userId} " +
            "AND deleted = 0 " +
            "AND points_type = #{pointsType} " +
            "AND points_change < 0") // 只算消耗的负数
    Integer selectConsumedSum(
            @Param("userId") Integer userId,
            @Param("pointsType") Integer pointsType
    );
}
