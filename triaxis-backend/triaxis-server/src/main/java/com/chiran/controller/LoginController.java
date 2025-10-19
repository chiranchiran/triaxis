package com.chiran.controller;

import com.chiran.JwtUtil;
import com.chiran.dto.UserGetCaptchaDTO;
import com.chiran.dto.UserLoginCountDTO;
import com.chiran.dto.UserLoginPhoneDTO;
import com.chiran.result.Result;
import com.chiran.service.LoginService;
import com.chiran.utils.CaptchaUtil;
import com.chiran.vo.UserInfoVO;
import com.chiran.vo.UserLoginVO;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * 前端控制器
 * </p>
 *
 * @author chiran
 * @since 2025-10-07
 */
@Slf4j
@RestController
@RequestMapping("/api/login")
public class LoginController {
    @Autowired
    LoginService loginService;
    @Autowired
    JwtUtil jwtUtil;

    /**
     * 手机号登录
     */
    @PostMapping("/phone")
    public Result<UserLoginVO> loginPhone(@RequestBody UserLoginPhoneDTO userLoginPhoneDTO) {
        log.info("用户手机号登录：{}", userLoginPhoneDTO);
        UserInfoVO userInfo = loginService.loginPhone(userLoginPhoneDTO);
        return loginSuccess(userInfo);
    }

    /**
     * 账户登录
     */
    @PostMapping("/count")
    public Result<UserLoginVO> loginCount(@RequestBody UserLoginCountDTO userLoginCountDTO) {
        log.info("用户账户登录：{}", userLoginCountDTO);
        UserInfoVO userInfo = loginService.loginCount(userLoginCountDTO);
        return loginSuccess(userInfo);
    }

    /**
     * 自动登录
     */
    @PostMapping("/validate")
    public Result<UserLoginVO> loginAuto(@RequestHeader(value = "Authorization", required = false) String token) {
        log.info("用户自动登录");
        if(token == null){
            throw new JwtException("没有accessToken");
        }
        Integer id = Integer.parseInt(jwtUtil.getSubjectFromAccessTokenHeader(token));
        UserInfoVO userInfo = loginService.loginAuto(id);
        return loginSuccess(userInfo);
    }

    /**
     * 刷新得到双token
     */
    @PostMapping("/refresh")
    public Result<UserLoginVO> refresh(@RequestHeader("Refresh-Token") String token) {
        log.info("用户刷新refresh");
        int id = Integer.parseInt(jwtUtil.refreshTokens(token));
        UserInfoVO userInfo = loginService.loginAuto(id);
        return loginSuccess(userInfo);
    }

    //任何登录方式登陆成功发放jwt令牌
    private Result<UserLoginVO> loginSuccess(UserInfoVO userInfo) {
        //登录成功后，生成jwt令牌
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", userInfo.getUsername());
        claims.put("role", userInfo.getRole());
        JwtUtil.TokenPair tokenPair = jwtUtil.getTokenPair(userInfo.getId().toString(), claims);
        UserLoginVO userInfoLoginVO = UserLoginVO.builder()
                .accessToken(tokenPair.getAccessToken())
                .refreshToken(tokenPair.getRefreshToken())
                .userInfo(userInfo)
                .build();
        return Result.success(userInfoLoginVO);
    }

    /**
     * 获取验证码
     */
    @PostMapping("/captcha")
    public Result<String> sendCode(@RequestBody UserGetCaptchaDTO userGetCaptchaDTO) {
        String phone = userGetCaptchaDTO.getPhone();
        log.debug("获取验证码，手机号是{}", phone);
        String captcha = CaptchaUtil.getInt(6);
        jwtUtil.saveCaptcha(phone, captcha);
        return Result.success(captcha);
    }
}
