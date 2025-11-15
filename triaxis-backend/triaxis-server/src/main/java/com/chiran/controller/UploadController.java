package com.chiran.controller;

import com.chiran.AliOssUtil;
import com.chiran.JwtUtil;
import com.chiran.dto.CheckFileDTO;
import com.chiran.dto.MergeChunksDTO;
import com.chiran.dto.UserGetCaptchaDTO;
import com.chiran.result.Result;
import com.chiran.service.impl.FileUploadService;
import com.chiran.utils.CaptchaUtil;
import com.chiran.vo.UploadCheckVO;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
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
@RequestMapping("/api/upload")
public class UploadController {
    @Autowired
    private AliOssUtil aliOssUtil;
    @Autowired
    private JwtUtil jwtUtil;
    @Resource
    private FileUploadService uploadService;

    /**
     * 秒传检查接口（POST）
     * 前端参数：hash（文件哈希）、fileName（文件名）、size（文件大小）
     */
    @PostMapping("/check")
    public Result<UploadCheckVO> checkFile(@RequestBody CheckFileDTO checkFileDTO) {
        UploadCheckVO uploadCheckVO = uploadService.checkFile(
                checkFileDTO.getHash(),
                checkFileDTO.getFileName(),
                checkFileDTO.getSize()
        );
        return  Result.success(uploadCheckVO);
    }

    /**
     * 小文件直传接口（POST）
     * 前端FormData参数：file（文件）、hash（哈希）、fileName（文件名）
     */
    @PostMapping("/small")
    public Result<String> uploadSmallFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("hash") String hash,
            @RequestParam("fileName") String fileName
    ) throws IOException {
        String s = uploadService.uploadSmallFile(file, hash, fileName);
        return Result.success(s);
    }

    /**
     * 分片上传接口（POST）
     * 前端FormData参数：chunk（分片）、index（分片索引）、hash（文件哈希）、fileName（文件名）、attempt（重试次数）
     */
    @PostMapping("/chunk")
    public Result uploadChunk(
            @RequestParam("chunk") MultipartFile chunk,
            @RequestParam("index") int index,
            @RequestParam("hash") String hash,
            @RequestParam("fileName") String fileName
    ) throws IOException {
        Boolean b = uploadService.uploadChunk(chunk, index, hash, fileName);
        return Result.success(null);
    }

    /**
     * 分片合并接口（POST）
     * 前端参数：hash（文件哈希）、fileName（文件名）、chunksCount（总分片数）
     */
    @PostMapping("/merge")
    public Result<String> mergeChunks(@RequestBody MergeChunksDTO mergeChunksDTO) throws IOException {
        log.info("文件上传");
        String s = uploadService.mergeChunks(
                mergeChunksDTO.getHash(),
                mergeChunksDTO.getFileName(),
                mergeChunksDTO.getChunksCount()
        );
        return Result.success(s);
    }

//     /**
//      * 手机号注册
//      */
//     @PostMapping("/upload")
//     public Result<String> upload(MultipartFile file) throws IOException {
//         log.info("文件上传：{}", file.getOriginalFilename());
// //        String url = aliOssUtil.upload(file.getBytes(), file.getOriginalFilename());
//         String url = file.getOriginalFilename();
//         return Result.success(url);
//     }

}
