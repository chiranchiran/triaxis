package com.chiran.service;

import com.baomidou.mybatisplus.core.toolkit.support.SFunction;
import com.chiran.dto.UserLoginCountDTO;
import com.chiran.dto.UserLoginPhoneDTO;
import com.chiran.entity.User;
import com.chiran.vo.UserInfoVO;

public interface LoginService {

    UserInfoVO loginPhone(UserLoginPhoneDTO userLoginPhoneDTO);

    UserInfoVO loginCount(UserLoginCountDTO userLoginCountDTO);

    UserInfoVO loginAuto(Integer id);
    <T> UserInfoVO baseCheck(SFunction<User,T> fn, T t) ;
}
