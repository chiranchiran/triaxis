package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.chiran.bo.CategoryBO;
import com.chiran.bo.UserActionsBO;
import com.chiran.entity.*;
import com.chiran.mapper.*;
import com.chiran.service.UserActionService;
import com.chiran.utils.BeanUtil;
import com.chiran.utils.CheckUserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserActionServiceImpl implements UserActionService {
    @Autowired
    private UserLikeMapper userLikeMapper;
    @Autowired
    private UserCollectionMapper userCollectionMapper;
    @Autowired
    private UserPurchaseMapper userPurchaseMapper;
    @Autowired
    private UserTagMapper userTagMapper;
    @Autowired
    private TagMapper tagMapper;

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

    @Override
    public UserActionsBO checkAllAction(Integer userId, Integer targetId, Integer targetType) {
        UserActionsBO userActionsBO = UserActionsBO.builder().isLiked(checkIsLiked(userId,targetId,targetType))
                        .isCollected(checkIsCollectd(userId,targetId,targetType))
                                .isPurchased(checkIsPurchased(userId,targetId,targetType)).build();
        return userActionsBO;
    }

    @Override
    public List<CategoryBO> selectTags(Integer targetId, Integer targetType) {
        LambdaQueryWrapper<UserTag> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.select(UserTag::getTagId).eq(UserTag::getTargetType,targetType)
                .eq(UserTag::getTargetId,targetId);
        List<UserTag> ids = userTagMapper.selectList(queryWrapper);
        if(ids.isEmpty()){
            return null;
        }
        List<Tag> list = tagMapper.selectBatchIds(ids);
        List<CategoryBO> tags = BeanUtil.copyList(list, CategoryBO::new);
        return tags;
    }

}
