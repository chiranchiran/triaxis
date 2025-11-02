package com.chiran.dto;

import com.baomidou.mybatisplus.annotation.*;
import com.chiran.bo.UploadFileBO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ResourceDTO {
    private Integer userId;
    private Integer status;
    private List<String> tags;
    private Integer subjectId;
    private List<Integer> categoryIds;
    private List<UploadFileBO> files;
    private String coverImage;
    private List<UploadFileBO> images;
    private String title;
    private String description;
    private Integer right;
    private String details;
    private Integer price = 0;
    private List<Integer> toolIds;
    private Long size;
}
