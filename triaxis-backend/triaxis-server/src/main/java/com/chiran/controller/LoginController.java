package com.chiran.controller;

import com.chiran.JwtUtil;
import com.chiran.dto.UserLoginCountDTO;
import com.chiran.dto.UserLoginPhoneDTO;
import com.chiran.dto.UserStateDTO;
import com.chiran.entity.User;
import com.chiran.result.Result;
import com.chiran.service.LoginService;
import com.chiran.utils.ExceptionUtil;
import com.chiran.vo.UserInfoVO;
import com.chiran.vo.UserLoginVO;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.WebUtils;

import java.net.MalformedURLException;
import java.net.URL;
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
@RequestMapping("/api")
public class LoginController {
    @Autowired
    LoginService loginService;
    @Autowired
    JwtUtil jwtUtil;
    private static final String REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

    /**
     * 手机号登录
     */
    @PostMapping("/login/phone")
    public Result<UserLoginVO> loginPhone(@RequestBody UserLoginPhoneDTO userLoginPhoneDTO, HttpServletResponse response, HttpServletRequest request) {
        log.info("用户手机号登录：{}", userLoginPhoneDTO);
        UserInfoVO userInfo = loginService.loginPhone(userLoginPhoneDTO);

        return loginSuccess(userLoginPhoneDTO.getState(), userInfo, response, request);
    }

    /**
     * 账户登录
     */
    @PostMapping("/login/count")
    public Result<UserLoginVO> loginCount(@RequestBody UserLoginCountDTO userLoginCountDTO, HttpServletResponse response, HttpServletRequest request) {
        log.info("用户账户登录：{}", userLoginCountDTO);

        UserInfoVO userInfo = loginService.loginCount(userLoginCountDTO);
        return loginSuccess(userLoginCountDTO.getState(), userInfo, response, request);
    }

    /**
     * 账户登录
     */
    @PostMapping("/login/state")
    public Result setState(@RequestBody UserStateDTO dto) {
        log.info("用户账户转跳");
        jwtUtil.saveState(dto.getState());
        return Result.success();
    }

    /**
     * 账户登录
     */
    @GetMapping("/login/token")
    public Result<UserLoginVO> getToken(String state) {
        log.info("用户获取token：{}", state);
        String token = jwtUtil.getTokenFromState(state);
        UserLoginVO userLoginVO = new UserLoginVO();
        userLoginVO.setAccessToken(token);
        Integer id = Integer.parseInt(jwtUtil.getSubjectFromAccessToken(token));
        UserInfoVO userInfoVO = loginService.baseCheck(User::getId, id);
        userLoginVO.setUserInfo(userInfoVO);

        return Result.success(userLoginVO);
    }

    // /**
    //  * 自动登录
    //  */
    // @PostMapping("/login/validate")
    // public Result<UserLoginVO> loginAuto( @RequestParam("state") String state,HttpServletRequest request, HttpServletResponse response) {
    //     log.info("用户自动登录");
    //     Cookie refreshCookie = WebUtils.getCookie(request, REFRESH_TOKEN_COOKIE_NAME);
    //     if (refreshCookie == null || !jwtUtil.validateRefreshToken(refreshCookie.getValue())) {
    //         throw new JwtException("没有有效 refreshToken");
    //     }
    //
    //     Integer id = Integer.parseInt(jwtUtil.getSubjectFromRefreshToken(refreshCookie.toString()));
    //     UserInfoVO userInfo = loginService.loginAuto(id);
    //     return loginSuccess(state, userInfo,response);
    // }

    /**
     * 刷新得到双token
     */
    @GetMapping("/login/refresh")
    public Result<UserLoginVO> refresh(HttpServletRequest request, HttpServletResponse response, Boolean auto, String state) {
        log.info("用户刷新refresh");
        Cookie refreshCookie = WebUtils.getCookie(request, REFRESH_TOKEN_COOKIE_NAME);
        if (refreshCookie == null) {
            throw new JwtException("没有 refreshToken");
        }
        log.debug("token{}，state{}", refreshCookie.getValue(), state);
        Integer id = Integer.parseInt(jwtUtil.getSubjectFromRefreshToken(refreshCookie.getValue()));
        UserInfoVO userInfo = loginService.loginAuto(id);
        if (auto) {
            return loginSuccess(state, userInfo, response, request);
        } else {
            Map<String, Object> claims = new HashMap<>();
            claims.put("username", userInfo.getUsername());
            claims.put("role", userInfo.getRole());
            String domain = getDomainFromRequestHeader(request);
            String token = jwtUtil.getRefreshToken(refreshCookie.toString(), claims, domain);
            // 原有响应：只返回 accessToken 和 userInfo，去掉 refreshToken
            UserLoginVO userInfoLoginVO = UserLoginVO.builder()
                    .accessToken(token)
                    .userInfo(userInfo)
                    .build();
            return Result.success(userInfoLoginVO);
        }
    }

    // 任何登录方式登陆成功发放jwt令牌
    private Result<UserLoginVO> loginSuccess(String state, UserInfoVO userInfo, HttpServletResponse response, HttpServletRequest request) {
        // 登录成功后，生成jwt令牌
        if (!jwtUtil.checkState(state)) {
            throw ExceptionUtil.create(10000);
        }
        Map<String, Object> claims = new HashMap<>();
        claims.put("username", userInfo.getUsername());
        claims.put("role", userInfo.getRole());
        String domain = getDomainFromRequestHeader(request);
        JwtUtil.TokenPair tokenPair = jwtUtil.getTokens(userInfo.getId().toString(), claims, domain);

        setRefreshTokenCookie(response, tokenPair.getRefreshToken());
        jwtUtil.saveStateToken(state, tokenPair.getAccessToken());
        // 原有响应：只返回 accessToken 和 userInfo，去掉 refreshToken
        UserLoginVO userInfoLoginVO = UserLoginVO.builder()
                // .accessToken(tokenPair.getAccessToken())
                .userInfo(userInfo)
                .build();
        return Result.success(userInfoLoginVO);
    }

    /**
     * 新增：设置 refreshToken 到 Cookie（本地开发适配，无冗余配置）
     */
    private void setRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken);
        cookie.setPath("/api/login/refresh");
        cookie.setHttpOnly(true); // 防 XSS
        cookie.setSecure(false); // 本地开发关闭 HTTPS 要求
        // 复用你 JwtProperties 中的过期时间（毫秒转秒）
        cookie.setMaxAge((int) (jwtUtil.getJwtProperties().getRefreshToken().getExpiration() / 1000));
        response.addCookie(cookie);
    }

    /**
     * 从请求头解析域名（降级方案）
     */
    private String getDomainFromRequestHeader(HttpServletRequest request) {
        try {
            // 1. 优先从Origin头获取（跨域请求会携带）
            String origin = request.getHeader("Origin");
            if (StringUtils.hasText(origin)) {
                return new URL(origin).getHost(); // 提取域名（如：xxx.com）
            }

            // 2. 从Referer头获取（非跨域请求）
            String referer = request.getHeader("Referer");
            if (StringUtils.hasText(referer)) {
                return new URL(referer).getHost();
            }
        } catch (MalformedURLException e) {
            log.warn("解析请求头域名失败", e);
        }
        return null;
    }
}
