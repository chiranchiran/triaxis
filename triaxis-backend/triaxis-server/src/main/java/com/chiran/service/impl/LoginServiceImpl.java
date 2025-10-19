package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.support.SFunction;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.JwtUtil;
import com.chiran.dto.UserLoginCountDTO;
import com.chiran.dto.UserLoginPhoneDTO;
import com.chiran.entity.User;
import com.chiran.mapper.UserMapper;
import com.chiran.service.LoginService;
import com.chiran.utils.ExceptionUtil;
import com.chiran.vo.UserInfoVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;


@Slf4j
@Service
public class LoginServiceImpl extends ServiceImpl<UserMapper, User> implements LoginService {
    @Autowired
    private UserMapper userMapper;
    @Autowired
    JwtUtil jwtUtil;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    private <T> UserInfoVO baseCheck(SFunction<User,T> fn,T t) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(fn, t).select(User::getId, User::getUsername, User::getPassword,
                User::getRole, User::getStatus,User::getAvatar,User::getVipLevel,User::getVipTime,User::getPoints);
        User user = userMapper.selectOne(queryWrapper);
        //处理各种异常情况（用户名不存在、密码不对、账号被锁定）
        if (user == null) {
            //账号不存在
            log.info("用户不存在");
            throw ExceptionUtil.create(12000);
        }
        if (user.getStatus()==0) {
            //账号被锁定
            log.info("{}账号被锁定",user.getUsername());
            throw ExceptionUtil.create(12005);
        }
        UserInfoVO userInfoVO = new UserInfoVO();
        BeanUtils.copyProperties(user,userInfoVO);
        return userInfoVO;
    }
    @Override
    public UserInfoVO loginPhone(UserLoginPhoneDTO userLoginPhoneDTO) {
        String phone = userLoginPhoneDTO.getPhone();
        String captcha = userLoginPhoneDTO.getCaptcha();

        UserInfoVO userInfo = baseCheck(User::getPhone,phone);
        //特有校验验证码
        boolean flag = jwtUtil.verifyCode(phone, captcha);
        if (!flag) {
            log.info("{}验证码无效",userInfo.getUsername());
        }
        userInfo.setPassword(null);
        return userInfo;
    }

    @Override
    public UserInfoVO loginCount(UserLoginCountDTO userLoginCountDTO) {
        String username = userLoginCountDTO.getUsername();
        String password = userLoginCountDTO.getPassword();

        UserInfoVO userInfo = baseCheck(User::getUsername,username);
        //密码比对
        if (!passwordEncoder.matches(password, userInfo.getPassword())) {
            //密码错误
            log.info("{}密码错误",userInfo.getUsername());
            throw ExceptionUtil.create(12001);
        }
        userInfo.setPassword(null);
        return userInfo;
    }

    @Override
    public UserInfoVO loginAuto(Integer id) {
        UserInfoVO userInfo = baseCheck(User::getId,id);
        userInfo.setPassword(null);
        return userInfo;
    }
}
