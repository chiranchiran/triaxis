package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.JwtUtil;
import com.chiran.dto.UserLoginCountDTO;
import com.chiran.dto.UserRegisterPhoneDTO;
import com.chiran.entity.User;
import com.chiran.mapper.UserMapper;
import com.chiran.service.RegisterService;
import com.chiran.utils.ExceptionUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;


@Slf4j
@Service
public class RegisterServiceImpl extends ServiceImpl<UserMapper, User>  implements RegisterService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    JwtUtil jwtUtil;

    @Override
    public void registerPhone(UserRegisterPhoneDTO userRegisterPhoneDTO) {
        String phone = userRegisterPhoneDTO.getPhone();
        String captcha = userRegisterPhoneDTO.getCaptcha();
        // 查询用户是否存在（通过手机号）
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getPhone, phone);
        User user = userMapper.selectOne(queryWrapper);
        if(user!=null){
            //账号已经存在
            log.info("用户已经存在");
            throw ExceptionUtil.create(12003);
        }

        // 校验验证码
        boolean flag = jwtUtil.verifyCode(phone, captcha);
        if (!flag) {
            log.info("手机号{}验证码无效", phone);
            throw ExceptionUtil.create(12006);
        }
        User newUser = new User();
        BeanUtils.copyProperties(userRegisterPhoneDTO, newUser);
        newUser.setUsername(phone);
        userMapper.insert(newUser);
    }

    @Override
    public void registerCount(UserLoginCountDTO userLoginCountDTO) {
        String username = userLoginCountDTO.getUsername();
        String password = userLoginCountDTO.getPassword();

        // 1. 查询用户是否存在
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getUsername, username);
        User user = userMapper.selectOne(queryWrapper);
        if(user!=null){
            //账号已经存在
            log.info("用户已经存在");
            throw ExceptionUtil.create(12002);
        }
        userLoginCountDTO.setPassword(DigestUtils.md5DigestAsHex(password.getBytes()));
        User newUser = new User();
        BeanUtils.copyProperties(userLoginCountDTO, newUser);
        userMapper.insert(newUser);
    }
}
