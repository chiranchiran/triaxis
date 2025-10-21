package com.chiran.dto;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ResourceDTO {
    private String title;
    private String description;
    private String path;
    private String coverImage;
    private Long size;
    private String extension;
    private Integer rightId;
    private Integer subjectId;
    private Integer userId;
    private Integer price = 0;
    private String details;
    private List<Integer> toolIds;
    private List<Integer> categoryIds;
}
