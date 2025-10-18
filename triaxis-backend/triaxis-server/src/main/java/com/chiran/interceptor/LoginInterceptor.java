package com.chiran.interceptor;

import com.chiran.JwtProperties;
import com.chiran.JwtUtil;
import com.chiran.utils.ExceptionUtil;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
public class LoginInterceptor implements HandlerInterceptor {
    @Autowired
    JwtProperties jwtProperties;
    @Autowired
    JwtUtil jwtUtil;


    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {
        log.info("进入登录拦截器");
        // 放行预检请求
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            log.debug("OPTIONS请求");
            return true;
        }

        // 放行登录接口
        if (request.getRequestURI().contains("/api/login")) {
            log.debug("登录请求放行");
            return true;
        }
        // 放行注册接口
        if (request.getRequestURI().contains("/api/register")) {
            log.debug("注册请求放行");
            return true;
        }
        // 登出
        if (request.getRequestURI().contains("/api/user/logout")) {
            log.debug("登出请求放行");
            return true;
        }

        // 从请求头获取 accessToken
        String accessToken = request.getHeader(jwtProperties.getAccessToken().getHeader());
        jwtUtil.getSubjectFromAccessTokenHeader(accessToken);
        log.debug("accessToken校验通过");
        return true;
    }

}
