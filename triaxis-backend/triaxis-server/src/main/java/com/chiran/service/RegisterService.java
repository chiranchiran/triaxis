package com.chiran.service;

import com.chiran.dto.UserLoginCountDTO;
import com.chiran.dto.UserRegisterPhoneDTO;


public interface RegisterService {

    void registerPhone(UserRegisterPhoneDTO userRegisterPhoneDTO);
    void registerCount(UserLoginCountDTO userLoginCountDTO);
}
