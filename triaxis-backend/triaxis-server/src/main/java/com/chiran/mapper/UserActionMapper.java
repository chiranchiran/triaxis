package com.chiran.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chiran.entity.UserLike;
import com.chiran.utils.CheckUserUtil;
import org.apache.ibatis.annotations.Mapper;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Mapper
public interface UserActionMapper{
    //检查是否点赞
    boolean checkIsLiked(Integer userId, Integer targetId, Integer targetType);
    //检查是否收藏
    boolean checkIsCollectd(Integer userId, Integer targetId, Integer targetType);
    //检查是否购买
    boolean checkIsPurchased(Integer userId, Integer targetId, Integer targetType);

}
