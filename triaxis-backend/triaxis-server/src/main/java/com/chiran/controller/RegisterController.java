package com.chiran.controller;

import com.chiran.JwtUtil;
import com.chiran.dto.UserLoginCountDTO;
import com.chiran.dto.UserRegisterPhoneDTO;
import com.chiran.result.Result;
import com.chiran.service.RegisterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


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
@RequestMapping("/api/register")
public class RegisterController {
    @Autowired
    RegisterService registerService;
    @Autowired
    JwtUtil jwtUtil;

    /**
     * 手机号注册
     */
    @PostMapping("/phone")
    public Result registerPhone(@RequestBody UserRegisterPhoneDTO userRegisterPhoneDTO) {
        log.info("用户手机号注册：{}", userRegisterPhoneDTO);
        registerService.registerPhone(userRegisterPhoneDTO);
        return Result.success();
    }

    /**
     * 账户注册
     */
    @PostMapping("/count")
    public Result registerCount(@RequestBody UserLoginCountDTO userLoginCountDTO) {
        log.info("用户账户注册：{}", userLoginCountDTO);
       registerService.registerCount(userLoginCountDTO);
        return Result.success();
    }
}
