package com.chiran.service;

import com.chiran.bo.UserActionsBO;

public interface UserActionService {

    boolean checkIsLiked(Integer userId, Integer targetId, Integer targetType);
    //检查是否收藏
    boolean checkIsCollectd(Integer userId, Integer targetId, Integer targetType);
    //检查是否购买
    boolean checkIsPurchased(Integer userId, Integer targetId, Integer targetType);
    UserActionsBO checkAllAction(Integer userId, Integer targetId, Integer targetType);
}
