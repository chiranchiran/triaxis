package com.chiran.service;

import com.chiran.dto.UserLoginCountDTO;
import com.chiran.dto.UserLoginPhoneDTO;
import com.chiran.vo.UserInfoVO;

public interface LoginService {

    UserInfoVO loginPhone(UserLoginPhoneDTO userLoginPhoneDTO);

    UserInfoVO loginCount(UserLoginCountDTO userLoginCountDTO);

    UserInfoVO loginAuto(Integer id);
}
