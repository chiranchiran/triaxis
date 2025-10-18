package com.chiran.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chiran.JwtUtil;
import com.chiran.constant.StatusConstant;
import com.chiran.dto.UserLoginCountDTO;
import com.chiran.dto.UserLoginPhoneDTO;
import com.chiran.entity.User;
import com.chiran.mapper.LoginMapper;
import com.chiran.mapper.UserMapper;
import com.chiran.service.LoginService;
import com.chiran.utils.ExceptionUtil;
import com.chiran.vo.UserInfoVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;


@Slf4j
@Service
public class LoginServiceImpl extends ServiceImpl<UserMapper, User> implements LoginService {
    @Autowired
    private LoginMapper loginMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    JwtUtil jwtUtil;


    private void baseCheck(UserInfoVO userInfo) {
        //处理各种异常情况（用户名不存在、密码不对、账号被锁定）
        if (userInfo == null) {
            //账号不存在
            log.info("用户不存在");
            throw ExceptionUtil.create(12000);
        }
        if (userInfo.getStatus()==0) {
            //账号被锁定
            log.info("{}账号被锁定",userInfo.getUsername());
            throw ExceptionUtil.create(12005);
        }
    }
    @Override
    public UserInfoVO loginPhone(UserLoginPhoneDTO userLoginPhoneDTO) {
        String phone = userLoginPhoneDTO.getPhone();
        String captcha = userLoginPhoneDTO.getCaptcha();

        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(User::getPhone, phone).select(User::getId,);
        User user = userMapper.selectOne(queryWrapper);
        UserInfoVO userInfo = userMapper.;
        baseCheck(userInfo);
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

        UserInfoVO userInfo = loginMapper.loginCount(username);
        baseCheck(userInfo);
        //密码比对
        //对前端传过来的明文密码进行md5加密处理
        password = DigestUtils.md5DigestAsHex(password.getBytes());
        log.debug("加密后的密码是{}",password);
        if (!password.equals(userInfo.getPassword())) {
            //密码错误
            log.info("{}密码错误",userInfo.getUsername());
            throw ExceptionUtil.create(12001);
        }

        userInfo.setPassword(null);
        return userInfo;
    }

    @Override
    public UserInfoVO loginAuto(Integer id) {
        UserInfoVO userInfo = loginMapper.loginAuto(id);
        baseCheck(userInfo);
        userInfo.setPassword(null);
        return userInfo;
    }
}
