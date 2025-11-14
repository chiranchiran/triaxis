package com.chiran.vo;

import com.chiran.bo.UserBO;
import com.chiran.entity.UserChat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UploadCheckVO implements Serializable {
    private String url;     // 文件访问URL（成功时返回）
    private boolean needUpload; // 是否需要上传（仅check接口用）
    private List<Integer> uploadedChunks;
}