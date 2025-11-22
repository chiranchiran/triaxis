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
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.HandlerInterceptor;

import java.net.URL;

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
        log.info("进入登录拦截器,url:{}",request.getRequestURI());
        // 放行预检请求
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            log.debug("OPTIONS请求");
            return true;
        }
        String domain = "";
        String origin = request.getHeader("Origin");
        if (StringUtils.hasText(origin)) {
           domain =  new URL(origin).getHost(); // 提取域名（如：xxx.com）
        }
        // 从请求头获取 accessToken
        String accessToken = request.getHeader(jwtProperties.getAccessToken().getHeader());
        // if (request.getRequestURI().contains("/api/download") || request.getRequestURI().contains("/api/user")) {
        //     String id =  jwtUtil.getSubjectFromAccessTokenHeader(accessToken);
        //     request.setAttribute("userId", Integer.parseInt(id));
        //     log.debug("accessToken校验通过");
        //     return true;
        // } else {
        //     if (accessToken != null) {
        //         String id =  jwtUtil.getSubjectFromAccessTokenHeader(accessToken);
        //         request.setAttribute("userId", Integer.parseInt(id));
        //         log.debug("accessToken校验通过");
        //         return true;
        //     }
        //     return true;
        // }
        if (request.getRequestURI().contains("/api/user")) {
            log.debug("token是{}", accessToken);
            String id =  jwtUtil.getSubjectFromAccessTokenHeader(accessToken,domain);
            request.setAttribute("userId", Integer.parseInt(id));
            log.debug("accessToken校验通过");
            return true;
        } else {
            if (accessToken != null) {
                String id =  jwtUtil.getSubjectFromAccessTokenHeader(accessToken,domain);
                request.setAttribute("userId", Integer.parseInt(id));
                log.debug("accessToken校验通过");
                return true;
            }
            return true;
        }
    }

}
