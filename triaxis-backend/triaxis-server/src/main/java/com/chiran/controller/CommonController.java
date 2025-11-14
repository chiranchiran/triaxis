package com.chiran.controller;

import com.chiran.AliOssUtil;
import com.chiran.JwtUtil;
import com.chiran.dto.UserGetCaptchaDTO;
import com.chiran.result.Result;
import com.chiran.utils.CaptchaUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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
    // 本地存储根路径（可根据需要修改，Windows用D:/xxx，Linux用/xxx）
    private static final String LOCAL_UPLOAD_PATH = "D:/upload/test/";

    @PostMapping("/upload")
    public Result<String> upload(MultipartFile file) throws IOException {
        // 1. 校验文件是否为空
        if (file.isEmpty()) {
            log.error("上传文件为空");
            return Result.error(10000, "上传文件不能为空");
        }

        // 2. 生成唯一文件名（避免重复覆盖，保留原文件名前缀）
        String originalFilename = file.getOriginalFilename();
        String timeSuffix = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS"));
        // 拼接文件名：原文件名_时间戳.后缀（如 test.pdf_20250715100000123.pdf）
        String uniqueFilename = originalFilename.substring(0, originalFilename.lastIndexOf("."))
                + "_" + timeSuffix
                + originalFilename.substring(originalFilename.lastIndexOf("."));

        // 3. 创建存储目录（不存在则自动创建，避免路径错误）
        File uploadDir = new File(LOCAL_UPLOAD_PATH);
        if (!uploadDir.exists()) {
            boolean mkdirsSuccess = uploadDir.mkdirs();
            if (!mkdirsSuccess) {
                log.error("创建存储目录失败：{}", LOCAL_UPLOAD_PATH);
                return Result.error(10000, "文件存储目录创建失败");
            }
        }

        // 4. 保存文件到本地（核心逻辑，transferTo高效存储，减少IO开销）
        File targetFile = new File(uploadDir, uniqueFilename);
        long startTime = System.currentTimeMillis(); // 记录开始时间（用于计算速度）
        file.transferTo(targetFile); // 直接保存文件，比手动读写字节流更高效
        long endTime = System.currentTimeMillis(); // 记录结束时间

        // 5. 计算上传速度（可选，方便测试查看）
        long fileSize = file.getSize(); // 文件大小（字节）
        double speedMBps = (fileSize / 1024.0 / 1024.0) / ((endTime - startTime) / 1000.0);

        // 6. 日志输出（便于测试排查，显示关键信息）
        log.info("文件上传成功！");
        log.info("原文件名：{}", originalFilename);
        log.info("保存路径：{}", targetFile.getAbsolutePath());
        log.info("文件大小：{} MB", String.format("%.2f", fileSize / 1024.0 / 1024.0));
        log.info("上传耗时：{} ms", endTime - startTime);
        log.info("上传速度：{} MB/s", String.format("%.2f", speedMBps));

        // 7. 返回结果（返回保存后的文件路径或文件名，便于前端确认）
        return Result.success(targetFile.getAbsolutePath());
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
