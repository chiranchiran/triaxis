package com.chiran.controller;

import com.chiran.AliOssUtil;
import com.chiran.JwtUtil;
import com.chiran.dto.UserGetCaptchaDTO;
import com.chiran.result.Result;
import com.chiran.utils.CaptchaUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

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
@RequestMapping("/api/common")
public class CommonController {
    @Autowired
    private AliOssUtil aliOssUtil;
    @Autowired
    private JwtUtil jwtUtil;

    /**
     * 手机号注册
     */
    @PostMapping("/upload")
    public Result<String> upload(MultipartFile file) throws IOException {
        log.info("文件上传：{}", file.getOriginalFilename());
        String url = aliOssUtil.upload(file.getBytes(), file.getOriginalFilename());
        return Result.success(url);
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
