package com.chiran.service.impl;

import com.chiran.exception.BusinessException;
import com.chiran.properties.FileUploadProperties;
import com.chiran.utils.FileUploadUtil;
import com.chiran.vo.UploadCheckVO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class FileUploadService {

    @Resource
    private FileUploadProperties uploadProperties;

    /**
     * 1. 秒传检查接口：判断文件是否已存在
     */
    public UploadCheckVO checkFile(String hash, String fileName, long fileSize) {
        // 检查最终目录是否已有该文件（文件名格式：哈希_原文件名）
        UploadCheckVO uploadCheckVO = new UploadCheckVO();
        String targetFileName = hash + "_" + fileName;
        Path targetPath = Paths.get(uploadProperties.getBaseDir(), targetFileName);

        if (Files.exists(targetPath)) {
            String fileUrl = uploadProperties.getAccessBaseUrl() + targetFileName;
            // 文件已存在：返回URL，无需上传
            uploadCheckVO.setNeedUpload(false);
            uploadCheckVO.setUrl(fileUrl);

        } else {
            // 文件不存在：返回已上传分片（断点续传）
            List<Integer> uploadedChunks = FileUploadUtil.getUploadedChunks(
                    uploadProperties.getChunkTempDir(), hash
            );
            uploadCheckVO.setNeedUpload(true);
            uploadCheckVO.setUploadedChunks(uploadedChunks);
        }
        return uploadCheckVO;
    }

    /**
     * 2. 小文件直传接口
     */
    public String uploadSmallFile(MultipartFile file, String hash, String fileName) throws IOException {
        // 计算文件哈希（二次校验，避免前端传错）
        // String fileMd5 = FileUploadUtil .calculateFileMd5(file);
        // if (!fileMd5.equals(hash)) {
        //     throw new BusinessException(10000,"哈希错误");
        // }

        // 保存文件到最终目录
        String targetFileName = hash + "_" + fileName;
        Path targetPath = Paths.get(uploadProperties.getBaseDir(), targetFileName);
        Files.createDirectories(targetPath.getParent());
        file.transferTo(targetPath);

        // 返回文件访问URL
        String fileUrl = uploadProperties.getAccessBaseUrl() + targetFileName;
        return fileUrl;
    }

    /**
     * 3. 分片上传接口
     */
    public Boolean uploadChunk(MultipartFile chunk, int index, String hash, String fileName, int attempt) throws IOException {
        // 保存分片到临时目录
        FileUploadUtil.saveChunk(
                chunk,
                uploadProperties.getChunkTempDir(),
                hash,
                index
        );
        // 前端约定：返回0表示成功
        return true;
    }

    /**
     * 4. 分片合并接口
     */
    public String  mergeChunks(String hash, String fileName, int chunksCount) throws IOException {
        // 合并分片为完整文件
        File targetFile = FileUploadUtil.mergeChunks(
                uploadProperties.getChunkTempDir(),
                hash,
                fileName,
                chunksCount,
                uploadProperties.getBaseDir()
        );

        // 返回文件访问URL
        String targetFileName = targetFile.getName();
        String fileUrl = uploadProperties.getAccessBaseUrl() + targetFileName;
        return fileUrl;
    }
}
