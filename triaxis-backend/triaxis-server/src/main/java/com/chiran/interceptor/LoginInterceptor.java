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
        if(request.getRequestURI().contains("/api/user/logout")) {
            log.debug("登出请求放行");
            return true;
        }

        // 从请求头获取 accessToken
        String accessToken = request.getHeader(jwtProperties.getAccessToken().getHeader());
        String token = jwtUtil.getTokenFromHeader(accessToken);
        if (accessToken == null) {
            log.debug("没有accessToken，拦截请求");
            throw new JwtException("没有accessToken");
        }
        if (token == null || token.equals(accessToken)) {
            log.debug("accessToken格式不正确，拦截请求，拦截到的格式为：{}", accessToken);
            throw new JwtException("accessToken格式不正确");
        }

        if (!jwtUtil.validateAccessToken(token)) {
            log.debug("accessToken校验未通过，拦截请求");
            throw new JwtException("accessToken校验未通过");
        }
        String userId = jwtUtil.getSubjectFromAccessToken(token);
        Integer role = (Integer) jwtUtil.parseAccessToken(token).get("role");
        request.setAttribute("userId", jwtUtil);
        request.setAttribute("role", role);
        log.debug("accessToken校验通过，解析用户id为{}，角色为{}", userId, role);
        return true;
    }

}
