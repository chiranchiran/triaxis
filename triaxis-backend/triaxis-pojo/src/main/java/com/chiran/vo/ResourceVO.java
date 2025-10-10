package com.chiran.vo;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResourceVO implements Serializable {
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
        private Integer downloadCount;
        private Integer viewCount;
        private BigDecimal averageRating;
        private Integer uploaderId;
        private Integer status;
        private Boolean isFeatured;
        private Date createdAt;
        private Date updatedAt;

        // 关联的软件工具列表
        private List<Integer> toolIds;
}
