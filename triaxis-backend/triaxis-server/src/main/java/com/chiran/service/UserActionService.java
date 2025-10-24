package com.chiran.service;

import com.chiran.bo.CategoryBO;
import com.chiran.bo.UserActionsBO;
import com.chiran.dto.UserLoginCountDTO;
import com.chiran.dto.UserLoginPhoneDTO;
import com.chiran.vo.UserInfoVO;

import java.util.List;

public interface UserActionService {

    boolean checkIsLiked(Integer userId, Integer targetId, Integer targetType);
    //检查是否收藏
    boolean checkIsCollectd(Integer userId, Integer targetId, Integer targetType);
    //检查是否购买
    boolean checkIsPurchased(Integer userId, Integer targetId, Integer targetType);
    UserActionsBO checkAllAction(Integer userId, Integer targetId, Integer targetType);
    List<CategoryBO> selectTags(Integer targetId, Integer targetType);
}
