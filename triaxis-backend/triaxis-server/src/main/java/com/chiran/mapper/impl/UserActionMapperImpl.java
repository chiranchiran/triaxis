package com.chiran.mapper.impl;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chiran.entity.UserCollection;
import com.chiran.entity.UserLike;
import com.chiran.entity.UserPurchase;
import com.chiran.mapper.UserActionMapper;
import com.chiran.utils.CheckUserUtil;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper
public class UserActionMapperImpl implements UserActionMapper {
    @Autowired
    private BaseMapper<UserLike> userLikeMapper;
    @Autowired
    private BaseMapper<UserCollection> userCollectionMapper;
    @Autowired
    private BaseMapper<UserPurchase> userPurchaseMapper;
    @Override
    public boolean checkIsLiked(Integer userId, Integer targetId, Integer targetType) {
        return CheckUserUtil.checkAction(userId,targetId,targetType, UserLike::getUserId,UserLike::getTargetId,UserLike::getTargetType,userLikeMapper);
    }

    @Override
    public boolean checkIsCollectd(Integer userId, Integer targetId, Integer targetType) {
        return CheckUserUtil.checkAction(userId,targetId,targetType, UserCollection::getUserId,UserCollection::getTargetId,UserCollection::getTargetType,userCollectionMapper);
    }

    @Override
    public boolean checkIsPurchased(Integer userId, Integer targetId, Integer targetType) {
        return CheckUserUtil.checkAction(userId,targetId,targetType, UserPurchase::getUserId,UserPurchase::getTargetId,UserPurchase::getTargetType,userPurchaseMapper);
    }

}
