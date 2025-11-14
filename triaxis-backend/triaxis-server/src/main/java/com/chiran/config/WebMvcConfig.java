package com.chiran.config;

import com.chiran.interceptor.LoginInterceptor;
import com.chiran.properties.FileUploadProperties;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Autowired
    private LoginInterceptor loginInterceptor;
    @Resource
    private FileUploadProperties uploadProperties;


    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        "/api/login/**",
                        "/api/login/*",
                        "/api/register/**",
                        "/api/register/*",
                        "/api/logout/*",
                        "/api/logout/**",
                        "/public/**",
                        "/public/*"
                );
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 映射 /files/** 到本地文件存储目录
        registry.addResourceHandler("/files/**")
                .addResourceLocations("file:" + uploadProperties.getBaseDir() + "/");
    }
}
