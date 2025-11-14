package com.chiran.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "file.upload")
public class FileUploadProperties {
    // 最终文件存储目录（本地路径，需提前创建）
    private String baseDir = "D:/upload/files/";
    // 分片临时存储目录
    private String chunkTempDir = "D:/upload/chunks/";
    // 最大文件大小（默认10GB）
    private long maxFileSize = 10 * 1024 * 1024 * 1024L;
    // 分片大小（需与前端 config.chunkSize 一致，默认5MB）
    private long chunkSize = 5 * 1024 * 1024L;
    // 文件访问基础URL（前端通过该URL访问文件）
    private String accessBaseUrl = "http://localhost:8080/files/";
}