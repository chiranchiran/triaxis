package com.chiran.mapper;

import com.chiran.vo.UserInfoVO;
import com.chiran.vo.UserLoginVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface LoginMapper {
    UserInfoVO loginPhone(String phone);
    UserInfoVO loginCount(String username);

    UserInfoVO loginAuto(Integer id);
}
