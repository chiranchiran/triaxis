package com.chiran.controller;

import com.chiran.result.Result;
import lombok.Data;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
@RequestMapping("/api/download")
public class DownloadController {

    private static final String FIXED_FILE_PATH = "E:\\临时文件\\课程\\国土空间总体规划\\图\\绿地.psd"; // 固定文件地址
    // private static final String FIXED_FILE_PATH = "D:\\upload\\fileTest\\ubuntu22.04_1-000006-s004.vmdk";
    /**
     * 检查文件信息
     */
    @PostMapping("/check")
    public Result<FileCheckResponse> checkFile(@RequestBody FileCheckRequest request) {
            File file = new File(FIXED_FILE_PATH);
            if (!file.exists()) {
                return Result.error(10000,"资源不存在");
            }

            long fileSize = file.length();
            int totalChunks = (int) Math.ceil((double) fileSize / request.getChunkSize());

            // 这里可以返回已下载的分片信息，用于断点续传
            List<Integer> downloadedChunks = getDownloadedChunksFromDB(request.getTaskId());

            FileCheckResponse response = new FileCheckResponse();
            response.setFileName(file.getName());
            response.setFileSize(fileSize);
            response.setTotalChunks(totalChunks);
            response.setDownloadedChunks(downloadedChunks);
            response.setNeedDownload(!downloadedChunks.containsAll(IntStream.range(0, totalChunks)
                    .boxed().collect(Collectors.toList())));

            return Result.success(response);
    }

    /**
     * 分片下载接口
     */
    @GetMapping("/chunk")
    public ResponseEntity<Resource> downloadChunk(
            @RequestParam Integer id,
            @RequestParam int index,
            @RequestParam int chunkSize) throws IOException {

        // 用try-with-resources自动关闭RandomAccessFile，避免资源泄露
        try (RandomAccessFile raf = new RandomAccessFile(new File(FIXED_FILE_PATH), "r")) {
            long fileLength = raf.length();
            long start = (long) index * chunkSize;
            long end = Math.min(start + chunkSize, fileLength);
            long chunkLength = end - start;

            // 读取分块数据
            raf.seek(start);
            byte[] bytes = new byte[(int) chunkLength];
            raf.read(bytes);

            // 二进制资源直接作为响应体
            ByteArrayResource resource = new ByteArrayResource(bytes);

            // 返回二进制流，响应体是resource（无需Result包装）
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment")
                    .header("Chunk-Index", String.valueOf(index))
                    .header("Chunk-Start", String.valueOf(start))
                    .header("Chunk-End", String.valueOf(end))
                    .body(resource); // 直接返回二进制资源
        }
    }

    /**
     * 合并分片（前端本地合并）
     */
    @PostMapping("/complete")
    public Result<Void> completeDownload(@RequestBody CompleteDownloadRequest request) {
            // 这里可以记录下载完成状态到数据库
            markDownloadCompleteInDB(request.getTaskId());
            return Result.success();
    }

    /**
     * 整体文件下载接口（用于测试）
     */
    @GetMapping("/full")
    public ResponseEntity<Resource> downloadFullFile() throws IOException {
        File file = new File(FIXED_FILE_PATH);
        if (!file.exists()) {
            throw new FileNotFoundException("文件不存在：" + FIXED_FILE_PATH);
        }

        // 读取整个文件为字节数组
        try (RandomAccessFile raf = new RandomAccessFile(file, "r")) {
            long fileLength = raf.length();
            byte[] bytes = new byte[(int) fileLength];
            raf.readFully(bytes); // 读取全部字节

            ByteArrayResource resource = new ByteArrayResource(bytes);

            // 设置响应头（指定文件名，方便前端获取）
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + file.getName() + "\"") // 传递文件名
                    .header("File-Size", String.valueOf(fileLength)) // 传递文件总大小
                    .body(resource);
        }
    }

    // 辅助方法
    private List<Integer> getDownloadedChunksFromDB(String taskId) {
        // 从数据库查询已下载的分片
        // 返回示例
        return new ArrayList<>();
    }

    private void markDownloadCompleteInDB(String taskId) {
        // 标记下载完成
    }

    // 请求响应类
    @Data
    public static class FileCheckRequest {
        private String taskId;
        private int chunkSize;
    }

    @Data
    public static class FileCheckResponse {
        private String fileName;
        private long fileSize;
        private int totalChunks;
        private List<Integer> downloadedChunks;
        private boolean needDownload;
    }

    @Data
    public static class CompleteDownloadRequest {
        private String taskId;
        private String fileName;
    }
}
