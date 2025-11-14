package com.chiran.utils;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

public class FileUploadUtil {

    /**
     * 计算文件MD5哈希（与前端保持一致，秒传核心）
     */
    public static String calculateFileMd5(MultipartFile file) throws IOException {
        try (InputStream inputStream = file.getInputStream()) {
            return DigestUtils.md5Hex(inputStream);
        }
    }

    /**
     * 保存分片到临时目录
     */
    public static void saveChunk(MultipartFile chunkFile, String chunkTempDir, String fileHash, int chunkIndex) throws IOException {
        // 临时分片路径：chunkTempDir/文件哈希/分片索引
        Path chunkPath = Paths.get(chunkTempDir, fileHash, String.valueOf(chunkIndex));
        Files.createDirectories(chunkPath.getParent()); // 创建父目录
        try (OutputStream outputStream = Files.newOutputStream(chunkPath)) {
            outputStream.write(chunkFile.getBytes());
        }
    }

    /**
     * 合并分片为完整文件
     */
    public static File mergeChunks(String chunkTempDir, String fileHash, String fileName, int totalChunks, String targetDir) throws IOException {
        // 目标文件路径：targetDir/文件哈希_原文件名（避免重名）
        String targetFileName = fileHash + "_" + fileName;
        Path targetPath = Paths.get(targetDir, targetFileName);
        Files.createDirectories(targetPath.getParent());

        try (OutputStream outputStream = Files.newOutputStream(targetPath)) {
            // 按分片索引顺序读取并写入
            for (int i = 0; i < totalChunks; i++) {
                Path chunkPath = Paths.get(chunkTempDir, fileHash, String.valueOf(i));
                if (!Files.exists(chunkPath)) {
                    throw new IOException("分片缺失：" + i);
                }
                // 写入分片数据
                Files.copy(chunkPath, outputStream);
                // 删除临时分片（可选，节省空间）
                Files.delete(chunkPath);
            }
        }
        // 删除分片父目录
        Files.deleteIfExists(Paths.get(chunkTempDir, fileHash));
        return targetPath.toFile();
    }

    /**
     * 获取已上传的分片索引
     */
    public static List<Integer> getUploadedChunks(String chunkTempDir, String fileHash) {
        List<Integer> uploadedChunks = new ArrayList<>();
        Path chunkDir = Paths.get(chunkTempDir, fileHash);
        if (Files.exists(chunkDir) && Files.isDirectory(chunkDir)) {
            // 遍历目录下的分片文件（文件名即分片索引）
            File[] chunkFiles = chunkDir.toFile().listFiles();
            if (chunkFiles != null) {
                for (File file : chunkFiles) {
                    try {
                        uploadedChunks.add(Integer.parseInt(file.getName()));
                    } catch (NumberFormatException e) {
                        // 忽略非数字命名的文件
                    }
                }
            }
        }
        return uploadedChunks;
    }
}
