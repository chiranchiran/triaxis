package com.chiran.dto;

import lombok.Data;

import java.util.List;

@Data
public class ResourceDTO {
    private Integer id;
    private String title;
    private String description;
    private String filePath;
    private Long fileSize;
    private String thumbnailPath;
    private String fileExtension;
    private Integer rightId;
    private Integer fieldId;
    private Integer categoryId;
    private Integer pricePoints;
    private Integer uploaderId;
    private Integer status;
    private Boolean isFeatured;

    // 关联的软件工具ID列表
    private List<Integer> toolIds;
}
