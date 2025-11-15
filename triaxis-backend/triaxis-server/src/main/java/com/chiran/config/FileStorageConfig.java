package com.chiran.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FileStorageConfig {
    // 从application.properties读取文件存储根路径
    @Value("${file.storage.path:/data/downloads}")
    private String storagePath;

    public String getStoragePath() {
        return storagePath;
    }
}